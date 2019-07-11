import React from 'react'
import PropTypes from 'prop-types'

import ApprovedVersionPreview from './ApprovedVersionPreview'

export default function VersionHistory({ plans, onClickVersion }) {
  return (
    <ul>
      {plans.map(plan => (
        <li key={plan.version} onClick={() => onClickVersion(plan.version)}>
          <ApprovedVersionPreview plan={plan} />
        </li>
      ))}
    </ul>
  )
}

VersionHistory.propTypes = {
  plans: PropTypes.arrayOf(
    PropTypes.shape(ApprovedVersionPreview.propTypes.plan)
  ),
  onClickVersion: PropTypes.func
}

VersionHistory.defaultProps = {
  onClickVersion: () => {}
}
