import { join } from 'path-extra'

import React, { Component, PropTypes } from 'react'
import { Panel, Button, DropdownButton, MenuItem, FormControl } from 'react-bootstrap'
import { AreaPanel } from './area-panel'

class AutoRefresherMain extends Component {
  static propTypes = {
    fcdMap: PropTypes.object.isRequired,
    onInitialize: PropTypes.func.isRequired,
    ruleTable: PropTypes.object,
    disabledMapIds: PropTypes.arrayOf(PropTypes.number),
  }

  static defaultProps = {
    ruleTable: null,
    disabledMapIds: null,
  }

  componentWillMount() {
    const { onInitialize, fcdMap } = this.props
    onInitialize(fcdMap)
  }

  render() {
    const { ruleTable, disabledMapIds } = this.props
    if (ruleTable === null || disabledMapIds === null)
      return false

    return (
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
        {
          Object.keys(ruleTable).map( mapIdStr => {
            const mapId = parseInt(mapIdStr,10)
            const rules = ruleTable[mapIdStr]
            return (
              <AreaPanel
                  enabled={disabledMapIds.indexOf(mapId) === -1}
                  key={mapId}
                  mapId={mapId}
                  rules={rules}
              />
            )
          })
        }
      </div>)
  }
}

export { AutoRefresherMain }
