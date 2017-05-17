import React, { Component, PropTypes } from 'react'
import {
  Panel,
  Button,
  DropdownButton,
  MenuItem,
  FormControl,
} from 'react-bootstrap'

class ControlPanel extends Component {
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
            <Button
                bsStyle="primary"
                style={{alignSelf: 'flex-end'}} >Enabled</Button>
          </div>
          <div style={{display: 'flex', marginTop: '5px', flex: 1, alignItems: 'center'}}>
            <FormControl
                type="text"
                placeholder="Enter rule"
            />
            <Button>Add Rule</Button>
          </div>
        </div>
      </Panel>
    )
  }
}

export { ControlPanel }
