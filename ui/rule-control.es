import React, { Component, PropTypes } from 'react'
import {
  Button,
} from 'react-bootstrap'

import { prettyRule } from '../rule'
import { TriButton } from './tri-button'
import { __ } from '../tr'

const { FontAwesome } = window

class RuleControl extends Component {
  static propTypes = {
    rule: PropTypes.shape({
      type: PropTypes.oneOf(['edgeId','edge','node']).isRequired,
      enabled: PropTypes.bool.isRequired,
      check: PropTypes.func,
    }).isRequired,
    onToggleRule: PropTypes.func.isRequired,
    onRemoveRule: PropTypes.func.isRequired,
  }

  handleRemoveRule = e => {
    e.stopPropagation()
    this.props.onRemoveRule()
  }

  render() {
    const { onToggleRule, rule } = this.props
    const { enabled, check } = rule
    const valid = typeof check === 'function'
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <Button
            onClick={this.handleRemoveRule}
            className="rule-delete">
          <FontAwesome
              name="close" />
        </Button>
        <div style={{flex: 1}}>
          { prettyRule(__)(rule) }
        </div>
        <TriButton
            onClick={onToggleRule}
            enabled={enabled}
            valid={valid} />
      </div>
    )
  }
}

export { RuleControl }
