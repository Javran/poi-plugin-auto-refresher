import React, { Component, PropTypes } from 'react'

import { TriButton } from './tri-button'

class AreaHeader extends Component {
  static propTypes = {
    header: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
  }

  render() {
    const { header, enabled } = this.props
    return (
      <div style={{width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
        <div style={{flex: '1',height: '100%'}}>{header}</div>
        <TriButton
            enabled={enabled}
            onClick={e => { e.stopPropagation() }}
        />
      </div>)
  }
}

export { AreaHeader }
