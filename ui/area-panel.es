import React, { Component, PropTypes } from 'react'
import {
  Panel,
  Button,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap'
import { mapIdToStr, ruleAsId, prettyRule } from '../rule'

const tHeader = props => (
  <div>
    <div style={{width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
      <div style={{flex: '1',height: '100%'}}>{props.header}</div>
      <Button
          bsStyle={props.enabled ? 'primary' : 'danger'}
          onClick={
            e => {
              e.stopPropagation()
            }
          }
      >{props.enabled ? 'Enabled' : 'Disabled'}</Button>
    </div>
  </div>)

class AreaPanel extends Component {
  static propTypes = {
    mapId: PropTypes.number.isRequired,
    rules: PropTypes.arrayOf(PropTypes.object).isRequired,
    enabled: PropTypes.bool.isRequired,
  }
  render() {
    const { mapId, rules, enabled } = this.props
    const header = mapIdToStr(mapId)
    return (
      <Panel
          bsStyle="primary"
          header={tHeader({header, enabled})}
          content="content"
          defaultExpanded={enabled}
          collapsible>
        <ListGroup>
          {
            rules.map( r => {
              const available = typeof r.check === 'function'
              return (
                <ListGroupItem
                    key={ruleAsId(r)}
                    style={{backgroundColor: 'initial'}}
                    bsStyle={available ? 'success' : 'danger'}
                >
                  { prettyRule(r) }
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
