import React, { Component, PropTypes } from 'react'
import {
  Panel,
  Button,
  DropdownButton,
  MenuItem,
  FormControl,
} from 'react-bootstrap'

import { TriButton } from './tri-button'

import { parseLine } from '../rule/syntax'

class ControlPanel extends Component {
  handleAddRule = () => {
    console.log( parseLine( this.ruleInput.value || '') )
  }

  render() {
    return (
      <Panel header="Control" >
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', width: '100%', justifyContent: 'space-between', flex: 1}}>
            <div style={{display: 'flex', width: '100%', flex: 1}}>
              <DropdownButton
                  style={{flex: 1, margin: '5px'}}
                  title="File" id="auto-refresher-file-dropdown">
                <MenuItem eventKey="1">Load Config ...</MenuItem>
                <MenuItem eventKey="2">Save Config ...</MenuItem>
                <MenuItem eventKey="3">Quick Load</MenuItem>
              </DropdownButton>
              <DropdownButton
                  style={{flex: 1, margin: '5px'}}
                  title="View" id="auto-refresher-view-dropdown">
                <MenuItem eventKey="1">Collapse All</MenuItem>
                <MenuItem eventKey="2">Expand All</MenuItem>
              </DropdownButton>
            </div>
            <TriButton
                style={{alignSelf: 'flex-end'}}
                enabled={true}
            />
          </div>
          <div style={{display: 'flex', marginTop: '5px', flex: 1, alignItems: 'center'}}>
            <FormControl
                type="text"
                inputRef={ref => { this.ruleInput = ref }}
                placeholder="Enter rule"
            />
            <Button
                onClick={this.handleAddRule}
            >
              Add Rule
            </Button>
          </div>
        </div>
      </Panel>
    )
  }
}

export { ControlPanel }
