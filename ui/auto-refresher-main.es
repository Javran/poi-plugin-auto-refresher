import { join } from 'path-extra'

import React, { Component, PropTypes } from 'react'

import { ControlPanel } from './control-panel'
import { AreaPanel } from './area-panel'

class AutoRefresherMain extends Component {
  static propTypes = {
    fcdMap: PropTypes.object.isRequired,
    ruleTable: PropTypes.object,
    disabledMapIds: PropTypes.arrayOf(PropTypes.number),

    onInitialize: PropTypes.func.isRequired,
    onToggleArea: PropTypes.func.isRequired,
    onToggleRule: PropTypes.func.isRequired,
    onRemoveRule: PropTypes.func.isRequired,
  }

  static defaultProps = {
    ruleTable: null,
    disabledMapIds: null,
  }

  componentWillMount() {
    const { onInitialize, fcdMap } = this.props
    onInitialize(fcdMap)
  }

  handleToggleArea = mapId => () =>
    this.props.onToggleArea(mapId)

  render() {
    const { ruleTable, disabledMapIds, onToggleRule, onRemoveRule } = this.props
    return ruleTable !== null && disabledMapIds !== null && (
      <div className="poi-plugin-auto-refresher">
        <link rel="stylesheet" href={join(__dirname, '..' , 'assets', 'auto-refresher.css')} />
        <ControlPanel />
        {
          Object.keys(ruleTable)
            .map(x => parseInt(x,10))
            .sort((x,y) => x-y)
            .map( mapIdStr => {
              const mapId = parseInt(mapIdStr,10)
              const rules = ruleTable[mapIdStr]
              return rules.length > 0 && (
                <AreaPanel
                    enabled={disabledMapIds.indexOf(mapId) === -1}
                    onToggleArea={this.handleToggleArea(mapId)}
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
