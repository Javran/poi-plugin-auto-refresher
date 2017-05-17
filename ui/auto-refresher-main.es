import { join } from 'path-extra'

import React, { Component, PropTypes } from 'react'

import { ControlPanel } from './control-panel'
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
    return ruleTable !== null && disabledMapIds !== null && (
      <div className="poi-plugin-auto-refresher">
        <link rel="stylesheet" href={join(__dirname, '..' , 'assets', 'auto-refresher.css')} />
        <ControlPanel />
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
