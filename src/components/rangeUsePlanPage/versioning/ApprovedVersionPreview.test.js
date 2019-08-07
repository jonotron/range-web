import React from 'react'
import { render } from '@testing-library/react'

import ApprovedVersionPreview from './ApprovedVersionPreview'

it('should display version, date, and author', () => {
  const props = {
    plan: { version: 'v2', date: 'June 30, 2019', author: 'Jane Doe' }
  }
  const { container, getByText } = render(<ApprovedVersionPreview {...props} />)

  expect(getByText('v2')).toBeTruthy()
  expect(getByText('June 30, 2019')).toBeTruthy()
  expect(getByText('Jane Doe')).toBeTruthy()

  expect(container.firstChild).toMatchSnapshot()
})
