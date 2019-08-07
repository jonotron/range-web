import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import useCurrentRUPContext from './useCurrentRUP'
import ApprovedVersionPreview from './ApprovedVersionPreview'

const useVersionsForRUP = rupId => {
  if (!rupId) throw new Error('Need to provide a rupID to useVersionsForRUP')
  const [plan, setPlan] = useState({ versions: [] })

  useEffect(() => {
    const fetchPlans = async () => {
      // TODO: replace with actual end point
      const url = 'http://www.mocky.io/v2/5d38a5a99f00009b519b406f'
      const params = { 'mocky-delay': '1000ms' }
      const { data } = await axios.get(url, { params })
      const plan = data.find(plan => plan.id === rupId)
      setPlan(plan)
    }

    if (rupId) {
      fetchPlans()
    }

    return () => {}
  }, [rupId])

  return plan
}

const UnstyledUl = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`

export default function VersionHistory({ onClickVersion }) {
  const rupId = useCurrentRUPContext()
  const plan = useVersionsForRUP(rupId)

  return (
    <UnstyledUl>
      {plan.versions.map(plan => (
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

VersionHistory.defaultProps = {
  onClickVersion: () => {}
}
