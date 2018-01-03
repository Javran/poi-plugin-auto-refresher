import _ from 'lodash'
import { not, modifyObject, projectorToComparator } from 'subtender'
import { splitMapId, mapIdToStr } from 'subtender/kc'
import { createStructuredSelector } from 'reselect'
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
import { mapFocusSelector, effectiveMapFocusSelector } from '../selectors'
import { mapDispatchToProps } from '../store'

// TODO: connect store
const mapIds = [
  "11", "12", "13", "14", "15", "16",
  "21", "22", "23", "24", "25",
  "31", "32", "33", "34", "35",
  "41", "42", "43", "44", "45",
  "51", "52", "53", "54", "55",
  "61", "62", "63", "64", "65",
].map(Number)

const mapInfoList = mapIds.map(splitMapId)
const grouppedMapInfoList = _.toPairs(
  _.groupBy(mapInfoList, 'area')
).map(([mS, v]) =>
  [Number(mS), v.map(x => x.area*10 + x.num)]
).sort(
  projectorToComparator(x => x.area)
)

class ViewControlPanelImpl extends PureComponent {
  static propTypes = {
    mapFocusDesc: PTyp.string.isRequired,
    changeMapFocus: PTyp.func.isRequired,
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

  render() {
    const {mapFocusDesc} = this.props
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
                  mapIds.map(mapId => {
                    const {area, num} = splitMapId(mapId)
                    return (
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
                    )
                  })
                }
              </div>
            </Dropdown.Menu>
          </Dropdown>
          <Button bsSize="small" style={{marginRight: 2}}>
            <FontAwesome name="angle-double-up" />
          </Button>
          <Button bsSize="small">
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
    const effMapFocusText =
      effMapFocus === 'all' ? 'All' : mapIdToStr(effMapFocus)

    const mapFocusDesc =
      mapFocus === 'auto' ?
        `${effMapFocusText} (Auto)` :
        effMapFocusText
    return {mapFocusDesc}
  },
  mapDispatchToProps,
)(ViewControlPanelImpl)

export { ViewControlPanel }
