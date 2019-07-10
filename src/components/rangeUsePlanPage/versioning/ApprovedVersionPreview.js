import React from 'react'
import PropTypes from 'prop-types'

export default function ApprovedVersionPreview({ plan }) {
  return (
    <div>
      <div>{plan.version}</div>
      <div>{plan.date}</div>
      <div>{plan.author}</div>
    </div>
  )
}

ApprovedVersionPreview.propTypes = {
  plan: PropTypes.shape({
    version: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired, // TODO: turn into an actual date
    author: PropTypes.string.isRequired
  }).isRequired
}
