import React from 'react'
import { cleanup, render, fireEvent } from '@testing-library/react'

import VersionHistory from './VersionHistory'

afterEach(cleanup)

const plans = [
  { version: 'v1', date: 'June 1, 2019', author: 'Jane Doe' },
  { version: 'v2', date: 'June 19, 2019', author: 'John Doe' }
]
it('should display a list of plans', () => {
  const { getByText } = render(<VersionHistory plans={plans} />)

  expect(getByText('v1')).toBeTruthy()
  expect(getByText('v2')).toBeTruthy()
})

it('should fire onClick when a version is clicked', () => {
  const onClickVersion = jest.fn()
  const { getByText } = render(
    <VersionHistory plans={plans} onClickVersion={onClickVersion} />
  )

  fireEvent.click(getByText('v1'))

  expect(onClickVersion).toHaveBeenCalledWith('v1')
})
