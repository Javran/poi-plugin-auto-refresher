import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Panel, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { modifyObject, not } from 'subtender'
import { mapIdToStr } from 'subtender/kc'

import { getMapRuleInfoFuncSelector } from '../selectors'
import { mapDispatchToProps } from '../store'
import { PTyp } from '../ptyp'

class MapRulePanelImpl extends PureComponent {
  static propTypes = {
    mapId: PTyp.number.isRequired,
    ui: PTyp.object.isRequired,
    enabled: PTyp.bool.isRequired,
    // note: avoid using this directly, use this.modifyMapRule instead.
    modifyMapRule: PTyp.func.isRequired,
  }

  modifyMapRule = modifier => {
    const {mapId, modifyMapRule} = this.props
    modifyMapRule(mapId, modifier)
  }

  handleToggleMap = () =>
    this.modifyMapRule(modifyObject('enabled', not))

  render() {
    const {mapId, ui, enabled} = this.props
    return (
      <Panel
        className="map-rule-panel"
        header={(
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{flex: 1}}>{mapIdToStr(mapId)}</div>
            <Button
              onClick={this.handleToggleMap}
              bsStyle={enabled ? 'success' : 'danger'}
              style={{width: '3em'}} bsSize="xsmall">
              <FontAwesome name={enabled ? 'check' : 'ban'} />
            </Button>
          </div>
        )}
      >
        {JSON.stringify(this.props)}
      </Panel>
    )
  }
}

const MapRulePanel = connect(
  (state, {mapId}) =>
    getMapRuleInfoFuncSelector(state)(mapId),
  mapDispatchToProps,
)(MapRulePanelImpl)

export { MapRulePanel }
