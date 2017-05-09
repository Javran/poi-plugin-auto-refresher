import React, { Component } from 'react'
import { Panel, Button } from 'react-bootstrap'

const tHeader = props => (
  <div>
    <div style={{width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
      <div style={{flex: '1',height: '100%'}}>{props.header}</div>
      <Button
          bsStyle="primary"
          onClick={
            e => {
              e.stopPropagation()
            }
          }
      >Enabled</Button>
    </div>
  </div>)

class AreaPanel extends Component {
  render() {
    return (
      <Panel
          bsStyle="primary"
          header={tHeader(this.props)}
          content="content"
          collapsible>
        Content
      </Panel>
    )
  }
}

export { AreaPanel }
