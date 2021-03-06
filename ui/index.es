import { join } from 'path-extra'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { InfoPanel } from './info-panel'
import { RuleAddingPanel } from './rule-adding-panel'
import { ViewControlPanel } from './view-control-panel'
import { MapRulePanel } from './map-rule-panel'
import { visibleMapIdsSelector } from '../selectors'
import { mapDispatchToProps } from '../store'
import { PTyp } from '../ptyp'

class AutoRefresherMainImpl extends PureComponent {
  static propTypes = {
    mapIds: PTyp.arrayOf(PTyp.number).isRequired,
  }

  render() {
    const {mapIds} = this.props
    return (
      <div className="poi-plugin-auto-refresher">
        <link
          rel="stylesheet"
          href={join(__dirname, '..' , 'assets', 'auto-refresher.css')}
        />
        <InfoPanel />
        <RuleAddingPanel />
        <ViewControlPanel />
        <div style={{flex: 1, overflowY: 'auto'}}>
          {
            mapIds.map(mapId => (
              <MapRulePanel
                key={mapId}
                mapId={mapId}
              />
            ))
          }
        </div>
      </div>
    )
  }
}

const AutoRefresherMain = connect(
  createStructuredSelector({
    mapIds: visibleMapIdsSelector,
  }),
  mapDispatchToProps
)(AutoRefresherMainImpl)

export { AutoRefresherMain }
