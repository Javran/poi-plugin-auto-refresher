import React, { Component, PropTypes } from 'react'
import {
  Panel,
  Button,
  DropdownButton,
  MenuItem,
  FormControl,
} from 'react-bootstrap'

import { parser, prepareConfigLine } from '../rule'

const { remote } = window
const { dialog } = remote.require('electron')
const fs = require('fs')

class ControlPanel extends Component {
  static propTypes = {
    fcdMap: PropTypes.object.isRequired,
    onAddConfigLines: PropTypes.func.isRequired,
    onExportConfigFile: PropTypes.func.isRequired,
  }

  handleAddRule = () => {
    const { fcdMap } = this.props
    const configLine = parser.parseLine( this.ruleInput.value || '')
    if (configLine !== null) {
      this.props.onAddConfigLines(
        [prepareConfigLine(configLine,fcdMap)])
      this.ruleInput.value = ''
    }
  }

  handleRuleKeyPress = target => {
    if (target.charCode === 13) {
      this.handleAddRule()
    }
  }

  handleImportFile = () => {
    const { fcdMap } = this.props
    const result = dialog.showOpenDialog({
      title: 'Import Auto Refresher Config',
      filters: [{name: 'Auto Refresher Config (*.csv)', extensions: ['csv']}],
      properties: ['openFile'],
    })

    if (! Array.isArray(result) || result.length !== 1)
      return

    const [importFileName] = result
    const preparedRules = fs.readFileSync(importFileName,'utf8')
      .split(/\r?\n/)
      .map(parser.parseLine)
      .filter(x => x !== null)
      .map(l => prepareConfigLine(l,fcdMap))

    this.props.onAddConfigLines( preparedRules )
  }

  handleExportFile = () => {
    const exportFileName = dialog.showSaveDialog({
      title: 'Export Auto Refresher Config',
      filters: [{name: 'Auto Refresher Config (*.csv)', extensions: ['csv']}],
    })

    if (typeof exportFileName !== 'string')
      return

    this.props.onExportConfigFile(exportFileName)
  }

  // TODO:
  // - add a "Quick Import", keep track of most recent importing file paths.
  // - enable / disable whole plugin
  render() {
    return (
      <Panel header="Control" >
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', width: '100%', justifyContent: 'space-between', flex: 1}}>
            <div style={{display: 'flex', width: '100%', flex: 1}}>
              <DropdownButton
                  style={{flex: 1, margin: '5px'}}
                  title="File" id="auto-refresher-file-dropdown">
                <MenuItem eventKey="1" onClick={this.handleImportFile}>Import ...</MenuItem>
                <MenuItem eventKey="2" onClick={this.handleExportFile}>Export ...</MenuItem>
              </DropdownButton>
              <DropdownButton
                  style={{flex: 1, margin: '5px'}}
                  title="View" id="auto-refresher-view-dropdown">
                <MenuItem eventKey="1">Collapse All</MenuItem>
                <MenuItem eventKey="2">Expand All</MenuItem>
                <MenuItem eventKey="3">Only Current Sortie Area</MenuItem>
              </DropdownButton>
            </div>
          </div>
          <div style={{display: 'flex', marginTop: '5px', flex: 1, alignItems: 'center'}}>
            <FormControl
                onKeyPress={this.handleRuleKeyPress}
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
