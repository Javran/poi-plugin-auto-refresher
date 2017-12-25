import React, { Component } from 'react'
import {
  Button,
} from 'react-bootstrap'
import PropTypes from 'prop-types'

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
    toggleRule: PropTypes.func.isRequired,
    removeRule: PropTypes.func.isRequired,
  }

  handleRemoveRule = e => {
    e.stopPropagation()
    this.props.removeRule()
  }

  render() {
    const { toggleRule, rule } = this.props
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
          onClick={toggleRule}
          enabled={enabled}
          valid={valid} />
      </div>
    )
  }
}

export { RuleControl }
