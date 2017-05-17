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
    onToggleArea: PropTypes.func.isRequired,
    onToggleRule: PropTypes.func.isRequired,
    onRemoveRule: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    const { enabled } = this.props
    this.state = { expanded: enabled }
  }

  handleToggleArea = () => {
    const { onToggleArea, enabled } = this.props
    onToggleArea()
    this.setState({ expanded: !enabled })
  }

  handleToggleCollapse = () =>
    this.setState( state =>
      ({ ...state, expanded: !state.expanded }))

  handleToggleRule = ruleId => () => {
    const { mapId, onToggleRule } = this.props
    onToggleRule(mapId,ruleId)
  }

  handleRemoveRule = ruleId => () => {
    const { mapId, onRemoveRule } = this.props
    onRemoveRule(mapId,ruleId)
  }

  render() {
    const { mapId, rules, enabled } = this.props
    const { expanded } = this.state
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
