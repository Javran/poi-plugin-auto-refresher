import { join } from 'path-extra'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { ControlPanel } from './control-panel'
import { AreaPanel } from './area-panel'
import { mainSelector } from '../selectors'
import { mapDispatchToProps } from '../store'

class AutoRefresherMainImpl extends Component {
  static propTypes = {
    fcdMap: PropTypes.object.isRequired,
    ruleTable: PropTypes.object,
    disabledMapIds: PropTypes.arrayOf(PropTypes.number),
    curMapId: PropTypes.number,

    toggleArea: PropTypes.func.isRequired,
    toggleRule: PropTypes.func.isRequired,
    removeRule: PropTypes.func.isRequired,
    addConfigLines: PropTypes.func.isRequired,
  }

  static defaultProps = {
    ruleTable: null,
    disabledMapIds: null,
    curMapId: null,
  }

  constructor(props) {
    super(props)
    this.state = { areaExpanded: {} }
  }

  isAreaExpanded = mapId => {
    const e = this.state.areaExpanded[mapId]
    if (typeof e !== 'undefined') {
      return e
    } else {
      const { disabledMapIds } = this.props
      return disabledMapIds.indexOf( mapId ) === -1
    }
  }

  handleToggleAreaCollapse = mapId => stateModifier => {
    const { areaExpanded } = this.state
    const expanded = this.isAreaExpanded(mapId)
    this.setState(
      { areaExpanded: {
        ...areaExpanded,
        [mapId]: stateModifier(expanded) } })
  }

  handleToggleArea = mapId => () =>
    this.props.toggleArea(mapId)

  handleToggleAllArea = newVal => () => {
    const mapIds = Object.keys(this.props.ruleTable)
      .map(x => parseInt(x,10))

    // try to minimize modification to areaExpanded
    const update = (ae, mapId) =>
      this.isAreaExpanded(mapId) !== newVal ?
        { ...ae, [mapId]: newVal } :
        ae

    this.setState({
      areaExpanded:
        mapIds.reduce(update, this.state.areaExpanded),
    })
  }

  render() {
    const {
      ruleTable,
      disabledMapIds,
      fcdMap,
      curMapId,

      toggleRule,
      removeRule,
      addConfigLines,
    } = this.props
    return ruleTable !== null && disabledMapIds !== null && (
      <div className="poi-plugin-auto-refresher">
        <link
          rel="stylesheet"
          href={join(__dirname, '..' , 'assets', 'auto-refresher.css')}
        />
        <ControlPanel
          fcdMap={fcdMap}
          addConfigLines={addConfigLines}
          onToggleAllArea={this.handleToggleAllArea}
        />
        {
          Object.keys(ruleTable)
            .map(x => parseInt(x,10))
            .sort((x,y) => x-y)
            .map( mapIdStr => {
              const mapId = parseInt(mapIdStr,10)
              const rules = ruleTable[mapIdStr]
              const enabled = disabledMapIds.indexOf(mapId) === -1
              const currentlyVisible = curMapId === null || curMapId === mapId
              return rules.length > 0 && currentlyVisible && (
                <AreaPanel
                  enabled={enabled}
                  expanded={this.isAreaExpanded(mapId)}
                  toggleArea={this.handleToggleArea(mapId)}
                  toggleAreaCollapse={this.handleToggleAreaCollapse(mapId)}
                  toggleRule={toggleRule}
                  removeRule={removeRule}
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

const AutoRefresherMain = connect(
  mainSelector,
  mapDispatchToProps,
)(AutoRefresherMainImpl)

export { AutoRefresherMain }
