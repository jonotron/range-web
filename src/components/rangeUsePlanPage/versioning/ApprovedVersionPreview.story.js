import React from 'react'

import ApprovedVersionPreview from './ApprovedVersionPreview'

export default {
  title: 'ApprovedVersionPreview'
}

export const defaultStory = () => (
  <ApprovedVersionPreview
    plan={{ version: 'v2', date: 'June 30, 2019', author: 'Jane Doe' }}
  />
)
