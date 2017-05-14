import React, { Component, PropTypes } from 'react'
import {
  Panel,
  Button,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap'
import { mapIdToStr } from './rule'

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
  static propTypes = {
    mapId: PropTypes.number.isRequired,
  }
  render() {
    const { mapId, rules } = this.props
    const header = mapIdToStr(mapId)
    return (
      <Panel
          bsStyle="primary"
          header={tHeader({header})}
          content="content"
          defaultExpanded
          collapsible>
        <ListGroup>
          {
            rules.map( r => {
              const available = typeof r.check === 'function'
              return (
                <ListGroupItem
                    style={{ backgroundColor: 'initial'}}
                    bsStyle={available ? 'success' : 'danger'}
                >
                  { JSON.stringify( r ) }
                </ListGroupItem>
              )
            })
          }
        </ListGroup>
      </Panel>
    )
  }
}

export { AreaPanel }
