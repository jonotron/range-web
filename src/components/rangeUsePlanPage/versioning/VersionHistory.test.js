import React from 'react'
import { cleanup, render } from '@testing-library/react'

import VersionHistory from './VersionHistory'

afterEach(cleanup)

it('should display a list of plans', () => {
  const plans = [
    { version: 'v1', date: 'June 1, 2019', author: 'Jane Doe' },
    { version: 'v2', date: 'June 19, 2019', author: 'John Doe' }
  ]

  const { getByText } = render(<VersionHistory plans={plans} />)

  expect(getByText('v1')).toBeTruthy()
  expect(getByText('v2')).toBeTruthy()
})
