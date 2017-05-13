import { join } from 'path-extra'

import React, { Component } from 'react'
import { Panel, Button, DropdownButton, MenuItem, FormControl } from 'react-bootstrap'
import { AreaPanel } from './area-panel'
import { loadRules } from './rule'

// TODO: to be removed after implementing profile switching
const ruleTable = loadRules(join(__dirname,'default.csv'))

/*
   TODO: allow profile switching, each rule file is an individual profile,
   we store its path, and its containing directory becomes the dir of profiles
   and menu have access to all files (and perhaps a menu item for opening that directory)
   this enable a quick way of toggling many auto-refresh rules at once

   however we might store enable / disable flag for each sortie area,
   it seems complicated to keep these flags with each config (besides profiles are
   files, which can be modified externally), and leaving each sortie area just one enable/disable
   flag sounds like the most sensible option.
*/

const reactClass = () => (
  <div className="poi-plugin-auto-refresher">
    <link rel="stylesheet" href={join(__dirname, 'assets', 'auto-refresher.css')} />
    <Panel
        header="Control"
    >
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', width: '100%', justifyContent: 'space-between', flex: 1}}>
          <div style={{display: 'flex', width: '100%', flex: 1}}>
            <DropdownButton
                style={{flex: 1, margin: '5px'}}
                title="File" id="auto-refresher-file-dropdown">
              <MenuItem eventKey="1">Import</MenuItem>
              <MenuItem eventKey="2">Export</MenuItem>
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
    <AreaPanel
        header="1-3"
    />
    <AreaPanel
        header="2-2"
    />
    <AreaPanel
        header="4-2"
    />
  </div>)

export {
  reactClass,
}
