import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { TriButton } from './tri-button'

class AreaHeader extends Component {
  static propTypes = {
    header: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
  }

  render() {
    const { onToggle, header, enabled } = this.props
    return (
      <div style={{width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
        <div style={{flex: '1',height: '100%'}}>{header}</div>
        <TriButton
          enabled={enabled}
          onClick={e => {
            e.stopPropagation()
            onToggle()
          }}
        />
      </div>)
  }
}

export { AreaHeader }
