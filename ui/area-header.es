import React, { Component, PropTypes } from 'react'
import {
  Button,
} from 'react-bootstrap'

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
        <Button
            bsStyle={enabled ? 'primary' : 'danger'}
            onClick={
              e => {
                e.stopPropagation()
              }
                    }
        >{enabled ? 'Enabled' : 'Disabled'}</Button>
      </div>)
  }
}

export { AreaHeader }
