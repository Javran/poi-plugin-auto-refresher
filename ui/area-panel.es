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

    onToggleArea: PropTypes.func.isRequired,
    onToggleAreaCollapse: PropTypes.func.isRequired,
    onToggleRule: PropTypes.func.isRequired,
    onRemoveRule: PropTypes.func.isRequired,
  }

  handleToggleArea = () => {
    const { onToggleArea, enabled } = this.props
    onToggleArea()
    this.props.onToggleAreaCollapse( () => !enabled )
  }

  handleToggleCollapse = () =>
    this.props.onToggleAreaCollapse( x => !x )

  handleToggleRule = ruleId => () => {
    const { mapId, onToggleRule } = this.props
    onToggleRule(mapId,ruleId)
  }

  handleRemoveRule = ruleId => () => {
    const { mapId, onRemoveRule } = this.props
    onRemoveRule(mapId,ruleId)
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
                enabled={enabled} />
            </div>}
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
                      onToggleRule={this.handleToggleRule(ruleId)}
                      onRemoveRule={this.handleRemoveRule(ruleId)}
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
