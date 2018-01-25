import _ from 'lodash'
import React, { PureComponent } from 'react'
import {
  Panel,
  Button,
  FormControl,
} from 'react-bootstrap'
import { connect } from 'react-redux'

import { __ } from '../tr'
import { PTyp } from '../ptyp'
import { parseLine } from '../rule/syntax'
import { mapDispatchToProps } from '../store'

class RuleAddingPanelImpl extends PureComponent {
  static propTypes = {
    applyParsedConfig: PTyp.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      rawConf: '',
    }
  }

  handleChangeRawConf = e => {
    const {value: rawConf} = e.target
    this.setState({rawConf})
  }

  /*
     conf is the parsed config as a proof that the original
     content is syntactically valid.

     this also avoids some unnecessary parsing.
   */
  handleApplyConfig = conf => () => {
    this.props.applyParsedConfig(conf)
    this.setState({rawConf: ''})
  }

  handleRuleKeyPress = conf => target => {
    if (target.charCode === 13) {
      this.handleApplyConfig(conf)()
    }
  }

  render() {
    const {rawConf} = this.state
    const conf = parseLine(rawConf, _.noop /* suppress warning */)
    return (
      <Panel>
        <Panel.Body>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div
              style={{
                display: 'flex',
                flex: 1,
                alignItems: 'baseline',
              }}
            >
              <FormControl
                onChange={this.handleChangeRawConf}
                onKeyPress={this.handleRuleKeyPress(conf)}
                type="text"
                placeholder={__('EnterRule')}
                value={rawConf}
              />
              <Button
                onClick={this.handleApplyConfig(conf)}
                disabled={!conf}
                style={{
                  marginLeft: 5,
                  marginTop: 0,
                }}
              >
                {__('AddRule')}
              </Button>
            </div>
          </div>
        </Panel.Body>
      </Panel>
    )
  }
}

const RuleAddingPanel = connect(null, mapDispatchToProps)(RuleAddingPanelImpl)

export { RuleAddingPanel }
