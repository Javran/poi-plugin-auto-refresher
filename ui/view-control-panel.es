import _ from 'lodash'
import { not, modifyObject } from 'subtender'
import { mapIdToStr } from 'subtender/kc'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  Panel,
  Button,
  Dropdown,
  MenuItem,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import { PTyp } from '../ptyp'
import {
  mapFocusSelector,
  effectiveMapFocusSelector,
  grouppedMapInfoListSelector,
  ruleMapIdsSelector,
} from '../selectors'
import { mapDispatchToProps } from '../store'

class ViewControlPanelImpl extends PureComponent {
  static propTypes = {
    effMapFocus: PTyp.oneOfType([PTyp.number, PTyp.string]).isRequired,
    mapFocusDesc: PTyp.string.isRequired,
    grouppedMapInfoList: PTyp.array.isRequired,
    changeMapFocus: PTyp.func.isRequired,
    allMapIds: PTyp.array.isRequired,
    modifyMapRuleUI: PTyp.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      menuOpened: false,
    }
  }

  handleToggleMenu = () => {
    this.setState(modifyObject('menuOpened',not))
  }

  handleSelectMap = (key,e) => {
    e.stopPropagation()
    this.props.changeMapFocus(key)
    this.setState({menuOpened: false})
  }

  handleExpandedValToAllMaps = expanded => () => {
    const {allMapIds, modifyMapRuleUI} = this.props
    // note that we cannot simply use _.mapValues because
    // some maps might not have UI states setup and are using defaults
    allMapIds.map(mapId =>
      modifyMapRuleUI(mapId, modifyObject('expanded', () => expanded))
    )
  }

  render() {
    const {mapFocusDesc, grouppedMapInfoList, effMapFocus} = this.props
    // only available in 'all' view
    const disableExpandedMod = effMapFocus !== 'all'
    return (
      <Panel>
        <div
          style={{display: 'flex', alignItems: 'center'}}
        >
          <div style={{marginRight: 5}}>Map</div>
          <Dropdown
            open={this.state.menuOpened}
            onToggle={this.handleToggleMenu}
            id="auto-refresher-select-map"
            style={{flex: 1, marginRight: 2}}>
            <Dropdown.Toggle
              style={{width: '100%'}}
            >
              {mapFocusDesc}
            </Dropdown.Toggle>
            <Dropdown.Menu
              style={{width: '100%'}}
            >
              <div style={{display: 'flex', justifyContent: 'space-around'}}>
                <MenuItem
                  className="menu-item"
                  style={{width: '50%'}}
                  onSelect={this.handleSelectMap}
                  eventKey="auto">
                  Auto
                </MenuItem>
                <MenuItem
                  className="menu-item"
                  style={{width: '50%'}}
                  onSelect={this.handleSelectMap}
                  eventKey="all">
                  All
                </MenuItem>
              </div>
              <MenuItem
                style={{margin: '5px 0'}}
                divider />
              <div
                style={{
                  display: 'grid',
                  grid: `auto / repeat(${grouppedMapInfoList.length}, 1fr)`,
                  justifyItems: 'stretch',
                  alignItems: 'stretch',
                  marginLeft: 10,
                  marginRight: 10,
                }}
              >
                {

                  _.flatMap(
                    grouppedMapInfoList, ([_areaNum, mapInfoList]) =>
                      mapInfoList.map(({area, num, mapId}) => (
                        <MenuItem
                          className="menu-item"
                          onSelect={this.handleSelectMap}
                          style={{
                            fontSize: '120%',
                            margin: '2px 5px',
                            gridArea: `${num} / ${area} / span 1 / span 1`,
                          }}
                          eventKey={mapId}
                          key={mapId}>
                          {mapIdToStr(mapId)}
                        </MenuItem>
                      ))
                  )
                }
              </div>
            </Dropdown.Menu>
          </Dropdown>
          <Button
            disabled={disableExpandedMod}
            bsSize="small"
            style={{marginRight: 2}}
            onClick={this.handleExpandedValToAllMaps(false)}
          >
            <FontAwesome name="angle-double-up" />
          </Button>
          <Button
            disabled={disableExpandedMod}
            bsSize="small"
            onClick={this.handleExpandedValToAllMaps(true)}
          >
            <FontAwesome name="angle-double-down" />
          </Button>
        </div>
      </Panel>
    )
  }
}

const ViewControlPanel = connect(
  state => {
    const mapFocus = mapFocusSelector(state)
    const effMapFocus = effectiveMapFocusSelector(state)
    const grouppedMapInfoList = grouppedMapInfoListSelector(state)
    const allMapIds = ruleMapIdsSelector(state)
    const effMapFocusText =
      effMapFocus === 'all' ? 'All' : mapIdToStr(effMapFocus)

    const mapFocusDesc =
      mapFocus === 'auto' ?
        `${effMapFocusText} (Auto)` :
        effMapFocusText
    return {mapFocusDesc, grouppedMapInfoList, allMapIds, effMapFocus}
  },
  mapDispatchToProps,
)(ViewControlPanelImpl)

export { ViewControlPanel }
