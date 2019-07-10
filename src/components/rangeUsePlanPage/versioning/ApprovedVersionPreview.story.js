import React from 'react'

import { storiesOf } from '@storybook/react'

import ApprovedVersionPreview from './ApprovedVersionPreview'

storiesOf('ApprovedVersionPreview', module).add('Default', () => (
  <ApprovedVersionPreview
    plan={{ version: 'v2', date: 'June 30, 2019', author: 'Jane Doe' }}
  />
))
