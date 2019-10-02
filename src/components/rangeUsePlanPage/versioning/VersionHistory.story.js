import React from 'react'

import { action } from '@storybook/addon-actions'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { CurrentRUPContext } from './useCurrentRUP'
import VersionHistory from './VersionHistory'

const mock = new MockAdapter(axios)
// TODO: This URL needs to be retrieved from an env var
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

export default {
  title: 'VersionHistory',

  decorators: [
    story => (
      <CurrentRUPContext.Provider value="rup-1">
        {story()}
      </CurrentRUPContext.Provider>
    )
  ]
}

export const defaultStory = () => {
  return <VersionHistory onClickVersion={action('clicked version')} />
}

defaultStory.story = {
  name: 'Default'
}
