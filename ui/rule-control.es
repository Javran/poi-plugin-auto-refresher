import React, { Component, PropTypes } from 'react'
import {
  Panel,
  ListGroup,
  Button,
  ListGroupItem,
} from 'react-bootstrap'

import { mapIdToStr, ruleAsId, prettyRule } from '../rule'
import { TriButton } from './tri-button'

const { FontAwesome } = window

class RuleControl extends Component {
  static propTypes = {
    rule: PropTypes.shape({
      type: PropTypes.oneOf(['edgeId','edge','node']).isRequired,
      enabled: PropTypes.bool.isRequired,
      check: PropTypes.func,
    }).isRequired,
  }
  render() {
    const { enabled, check } = this.props.rule
    const valid = typeof check === 'function'
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <Button
            className="rule-delete">
          <FontAwesome
            name="close" />
        </Button>
        <div style={{flex: 1}}>
          { prettyRule(this.props.rule) }
        </div>
        <TriButton enabled={enabled} valid={valid} />
      </div>
    )
  }
}

export { RuleControl }
