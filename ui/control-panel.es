import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Panel,
  Button,
  DropdownButton,
  MenuItem,
  FormControl,
} from 'react-bootstrap'

import { parser, prepareConfigLine } from '../rule'
import { __ } from '../tr'

class ControlPanel extends Component {
  static propTypes = {
    fcdMap: PropTypes.object.isRequired,
    onToggleAllArea: PropTypes.func.isRequired,
    addConfigLines: PropTypes.func.isRequired,
  }

  handleAddRule = () => {
    const { fcdMap } = this.props
    const configLine = parser.parseLine( this.ruleInput.value || '')
    if (configLine !== null) {
      this.props.addConfigLines(
        [prepareConfigLine(configLine,fcdMap)])
      this.ruleInput.value = ''
    }
  }

  handleRuleKeyPress = target => {
    if (target.charCode === 13) {
      this.handleAddRule()
    }
  }

  // TODO:
  // - add a "Quick Import", keep track of most recent importing file paths.
  // - enable / disable whole plugin
  render() {
    return (
      <Panel header={__('Control')}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', width: '100%', justifyContent: 'space-between', flex: 1}}>
            <div style={{display: 'flex', width: '100%', flex: 1}}>
              <DropdownButton
                style={{flex: 1, margin: '5px'}}
                title="View" id="auto-refresher-view-dropdown">
                <MenuItem
                  eventKey="1"
                  onClick={this.props.onToggleAllArea(false)}>
                  Collapse All
                </MenuItem>
                <MenuItem
                  eventKey="2"
                  onClick={this.props.onToggleAllArea(true)}>
                  Expand All
                </MenuItem>
                {/*
                    <MenuItem eventKey="3">Only Current Sortie Area</MenuItem>
                  */
                }
              </DropdownButton>
            </div>
          </div>
          <div style={{display: 'flex', marginTop: '5px', flex: 1, alignItems: 'center'}}>
            <FormControl
              onKeyPress={this.handleRuleKeyPress}
              type="text"
              inputRef={ref => { this.ruleInput = ref }}
              placeholder={__('Enter rule')}
            />
            <Button
              onClick={this.handleAddRule}
            >
              {__('Add Rule')}
            </Button>
          </div>
        </div>
      </Panel>
    )
  }
}

export { ControlPanel }
