import { join } from 'path-extra'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ControlPanel } from './control-panel'
import { AreaPanel } from './area-panel'

class AutoRefresherMain extends Component {
  static propTypes = {
    fcdMap: PropTypes.object.isRequired,
    ruleTable: PropTypes.object,
    disabledMapIds: PropTypes.arrayOf(PropTypes.number),
    curMapId: PropTypes.number,

    onInitialize: PropTypes.func.isRequired,
    onToggleArea: PropTypes.func.isRequired,
    onToggleRule: PropTypes.func.isRequired,
    onRemoveRule: PropTypes.func.isRequired,
    onAddConfigLines: PropTypes.func.isRequired,
    onExportConfigFile: PropTypes.func.isRequired,
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

  componentWillMount() {
    const { onInitialize, fcdMap } = this.props
    onInitialize(fcdMap)
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
    this.props.onToggleArea(mapId)

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

      onToggleRule,
      onRemoveRule,
      onAddConfigLines,
      onExportConfigFile,
    } = this.props
    return ruleTable !== null && disabledMapIds !== null && (
      <div className="poi-plugin-auto-refresher">
        <link rel="stylesheet" href={join(__dirname, '..' , 'assets', 'auto-refresher.css')} />
        <ControlPanel
          fcdMap={fcdMap}
          onAddConfigLines={onAddConfigLines}
          onExportConfigFile={onExportConfigFile}
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
                  onToggleArea={this.handleToggleArea(mapId)}
                  onToggleAreaCollapse={this.handleToggleAreaCollapse(mapId)}
                  onToggleRule={onToggleRule}
                  onRemoveRule={onRemoveRule}
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
