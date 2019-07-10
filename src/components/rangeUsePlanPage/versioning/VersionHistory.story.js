import React from 'react'

import { storiesOf } from '@storybook/react'

import VersionHistory from './VersionHistory'

storiesOf('VersionHistory', module).add('Default', () => {
  const plans = [
    { version: 'v1', date: 'June 1, 2019', author: 'Jane Doe' },
    { version: 'v2', date: 'June 19, 2019', author: 'John Doe' }
  ]

  return <VersionHistory plans={plans} />
})
