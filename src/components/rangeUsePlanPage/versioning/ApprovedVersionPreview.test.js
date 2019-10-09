import React from 'react'
import { render } from '@testing-library/react'
import { defaultStory } from './ApprovedVersionPreview.story'

it('should display version, date, and author', () => {
  const { container, getByText } = render(defaultStory())

  expect(getByText('v2')).toBeTruthy()
  expect(getByText('June 30, 2019')).toBeTruthy()
  expect(getByText('Jane Doe')).toBeTruthy()

  expect(container.firstChild).toMatchSnapshot()
})
