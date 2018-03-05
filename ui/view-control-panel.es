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
  getMapRuleFuncSelector,
} from '../selectors'
import { mapDispatchToProps } from '../store'
import { __ } from '../tr'

class ViewControlPanelImpl extends PureComponent {
  static propTypes = {
    disableExpandedMod: PTyp.bool.isRequired,
    mapFocusDesc: PTyp.string.isRequired,
    grouppedMapInfoList: PTyp.array.isRequired,
    changeMapFocus: PTyp.func.isRequired,
    allMapIds: PTyp.array.isRequired,
    getMapRule: PTyp.func.isRequired,
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
    const {
      mapFocusDesc,
      grouppedMapInfoList,
      disableExpandedMod,
      getMapRule,
    } = this.props
    return (
      <Panel>
        <Panel.Body>
          <div
            style={{display: 'flex', alignItems: 'center'}}
          >
            <div style={{marginRight: 5}}>{__('ViewControl.Map')}</div>
            <Dropdown
              open={this.state.menuOpened}
              onToggle={this.handleToggleMenu}
              id="auto-refresher-select-map"
              style={{flex: 1, marginRight: 2}}
            >
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
                    {__('ViewControl.Auto')}
                  </MenuItem>
                  <MenuItem
                    className="menu-item"
                    style={{width: '50%'}}
                    onSelect={this.handleSelectMap}
                    eventKey="all">
                    {__('ViewControl.All')}
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
                      grouppedMapInfoList, ([_areaNum, mapInfoList], areaOffset) =>
                        mapInfoList.map(({num, mapId}) => (
                          <MenuItem
                            className="menu-item"
                            onSelect={this.handleSelectMap}
                            style={{
                              ...(getMapRule(mapId).rules.length > 0 ? {fontWeight: 'bold'} : {}),
                              fontSize: '120%',
                              margin: '2px 5px',
                              gridArea: `${num} / ${areaOffset+1} / span 1 / span 1`,
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
        </Panel.Body>
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
    const getMapRule = getMapRuleFuncSelector(state)
    const effMapFocusText =
      effMapFocus === 'all' ? __('ViewControl.All') : mapIdToStr(effMapFocus)
    const disableExpandedMod = effMapFocus !== 'all'

    const mapFocusDesc =
      mapFocus === 'auto' ?
        `${effMapFocusText} (${__('ViewControl.Auto')})` :
        effMapFocusText
    return {
      mapFocusDesc,
      grouppedMapInfoList,
      allMapIds,
      disableExpandedMod,
      getMapRule,
    }
  },
  mapDispatchToProps,
)(ViewControlPanelImpl)

export { ViewControlPanel }
