import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'

const Grid = styled.div`
  display: grid;
  grid-template-columns: 24px 96px 1fr;
`

export default function ApprovedVersionPreview({ plan }) {
  return (
    <Grid>
      <div>{plan.version}</div>
      <div>{plan.date}</div>
      <div>{plan.author}</div>
    </Grid>
  )
}

ApprovedVersionPreview.propTypes = {
  plan: PropTypes.shape({
    version: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired, // TODO: turn into an actual date
    author: PropTypes.string.isRequired
  }).isRequired
}
