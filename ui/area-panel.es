import React, { Component, PropTypes } from 'react'
import {
  Panel,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap'

import { mapIdToStr, ruleAsId } from '../rule'
import { AreaHeader } from './area-header'
import { RuleControl } from './rule-control'

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
          header={
            <div>
              <AreaHeader
                header={header}
                enabled={enabled} />
            </div>}
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
                  <RuleControl rule={r} />
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
