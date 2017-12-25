import React, { Component } from 'react'
import {
  Panel,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap'

import PropTypes from 'prop-types'

import { mapIdToStr, ruleAsId } from '../rule'
import { AreaHeader } from './area-header'
import { RuleControl } from './rule-control'

class AreaPanel extends Component {
  static propTypes = {
    mapId: PropTypes.number.isRequired,
    rules: PropTypes.arrayOf(PropTypes.object).isRequired,
    expanded: PropTypes.bool.isRequired,
    enabled: PropTypes.bool.isRequired,

    toggleArea: PropTypes.func.isRequired,
    toggleAreaCollapse: PropTypes.func.isRequired,
    toggleRule: PropTypes.func.isRequired,
    removeRule: PropTypes.func.isRequired,
  }

  handleToggleArea = () => {
    const { toggleArea, enabled } = this.props
    toggleArea()
    this.props.toggleAreaCollapse( () => !enabled )
  }

  handleToggleCollapse = () =>
    this.props.toggleAreaCollapse( x => !x )

  handleToggleRule = ruleId => () => {
    const { mapId, toggleRule } = this.props
    toggleRule(mapId,ruleId)
  }

  handleRemoveRule = ruleId => () => {
    const { mapId, removeRule } = this.props
    removeRule(mapId,ruleId)
  }

  render() {
    const { mapId, rules, enabled, expanded } = this.props
    const header = mapIdToStr(mapId)
    return (
      <Panel
        bsStyle="primary"
        header={
          <div>
            <AreaHeader
              onToggle={this.handleToggleArea}
              header={header}
              enabled={enabled}
            />
          </div>
        }
        content="content"
        onClick={this.handleToggleCollapse}
        expanded={expanded}
        collapsible>
        <ListGroup>
          {
            rules.map( r => {
              const available = typeof r.check === 'function'
              const ruleId = ruleAsId(r)
              return (
                <ListGroupItem
                  key={ruleId}
                  style={{backgroundColor: 'initial'}}
                  bsStyle={available ? 'success' : 'danger'}
                >
                  <RuleControl
                    toggleRule={this.handleToggleRule(ruleId)}
                    removeRule={this.handleRemoveRule(ruleId)}
                    rule={r} />
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
