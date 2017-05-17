/* A simple button with triple states: Enabled / Disabled / Invalid */

import React, { Component, PropTypes } from 'react'
import {
  Button,
} from 'react-bootstrap'

class TriButton extends Component {
  static propTypes = {
    valid: PropTypes.bool,
    enabled: PropTypes.bool,
    onClick: PropTypes.func,
    style: PropTypes.object,
  }

  static defaultProps = {
    valid: true,
    enabled: true,
    onClick: null,
    style: {},
  }

  handleClick = e => {
    e.stopPropagation()
    const { valid, onClick } = this.props
    if (valid)
      onClick(e)
  }

  render() {
    const { valid, enabled, style } = this.props
    return (
      <Button
          className="tri-button"
          style={style}
          bsStyle={valid ? (enabled ? 'primary' : 'warning') : 'danger'}
          onClick={this.handleClick}
      >
        {
          valid ? (enabled ? 'Enabled' : 'Disabled') : 'Invalid'
        }
      </Button>
    )
  }
}

export { TriButton }
