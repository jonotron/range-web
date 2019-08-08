import React from 'react'
import { render, fireEvent, waitForElement } from '@testing-library/react'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { CurrentRUPContext } from './useCurrentRUP'
import VersionHistory from './VersionHistory'

// We should try keep our tests as close to an integration tests as possible.
// So we try to not mock internals and rather just mock the data that is
// provided to our components.
// Here we mock the response that VersionHistory would get when it's request
// asks for some versions
const mock = new MockAdapter(axios)
beforeEach(() => {
  mock.onGet('http://www.mocky.io/v2/5d38a5a99f00009b519b406f').reply(200, [
    {
      id: 'rup-1',
      versions: [
        { version: 'v1', date: 'June 1, 2019', author: 'Mock Jane Doe' },
        { version: 'v2', date: 'June 19, 2019', author: 'Mock John Doe' }
      ]
    },
    {
      id: 'rup-2',
      versions: [
        { version: 'v1', date: 'Jan 15, 2019', author: 'Mock John Smith' },
        { version: 'v2', date: 'Jan 25, 2019', author: 'Mock Jane Smith' }
      ]
    }
  ])
})

afterEach(() => {
  // we also need to remember to reset the mock so other requests to this
  // endpoint in other tests are not mocked
  mock.reset()
})

it('should display a list of plans', async () => {
  const { getByText } = render(
    <CurrentRUPContext.Provider value={'rup-1'}>
      <VersionHistory />
    </CurrentRUPContext.Provider>
  )

  const john = await waitForElement(() => getByText('Mock John Doe'))
  const jane = await waitForElement(() => getByText('Mock Jane Doe'))
  expect(john).toBeInTheDocument()
  expect(jane).toBeInTheDocument()
})

it('should fire onClick when a version is clicked', async () => {
  const onClickVersion = jest.fn()
  const { getByText } = render(
    <CurrentRUPContext.Provider value={'rup-1'}>
      <VersionHistory onClickVersion={onClickVersion} />
    </CurrentRUPContext.Provider>
  )

  const john = await waitForElement(() => getByText('Mock John Doe'))
  fireEvent.click(john)
  expect(onClickVersion).toHaveBeenCalledWith('v2')
})
