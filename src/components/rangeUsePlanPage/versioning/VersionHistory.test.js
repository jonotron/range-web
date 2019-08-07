import React from 'react'
import { render, fireEvent, waitForElement } from '@testing-library/react'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { CurrentRUPContext } from './useCurrentRUP'
import VersionHistory from './VersionHistory'

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
  mock.reset()
})

it('should display a list of plans', async () => {
  const { container, getByText } = render(
    <CurrentRUPContext.Provider value={'rup-1'}>
      <VersionHistory />
    </CurrentRUPContext.Provider>
  )

  const john = await waitForElement(() => getByText('Mock John Doe'))
  const jane = await waitForElement(() => getByText('Mock Jane Doe'))
  expect(container).toContainElement(john)
  expect(container).toContainElement(jane)
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
