import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import useCurrentRUP from './useCurrentRUP'
import ApprovedVersionPreview from './ApprovedVersionPreview'

// hook that fetches all the versions for a given rupId
const useRUPVersions = rupId => {
  const [versions, setVersions] = useState([])

  useEffect(() => {
    // we need to create an async function here because useEffect
    // does not allow async functions
    const fetchVersions = async () => {
      // TODO: replace with actual end point
      const url = 'http://www.mocky.io/v2/5d38a5a99f00009b519b406f'
      const params = { 'mocky-delay': '1000ms' }
      const { data } = await axios.get(url, { params })
      const plan = data.find(plan => plan.id === rupId)
      // setVersions (a state operation) will cause the component to rerender
      if (plan.versions) setVersions(plan.versions)
    }

    if (rupId) {
      fetchVersions()
    }

    // we could cancel the axios request in the callback returned
    // see: https://github.com/axios/axios#cancellation
    // but this is not likely an expensive request
    return () => {}
    // if the rupId changes, we need to re-run the effect
  }, [rupId])

  return versions
}

const UnstyledUl = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`

export default function VersionHistory({ onClickVersion = () => {} }) {
  // get the current rupID from context
  const rupId = useCurrentRUP()
  const versions = useRUPVersions(rupId)

  return (
    <UnstyledUl>
      {versions.map(plan => (
        <li key={plan.version} onClick={() => onClickVersion(plan.version)}>
          <ApprovedVersionPreview plan={plan} />
        </li>
      ))}
    </UnstyledUl>
  )
}

VersionHistory.propTypes = {
  onClickVersion: PropTypes.func
}
