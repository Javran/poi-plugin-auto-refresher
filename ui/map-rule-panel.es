import _ from 'lodash'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Panel, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { modifyObject, not, modifyArray } from 'subtender'
import { mapIdToStr } from 'subtender/kc'

import { ruleAsId } from '../rule'
import { getMapRuleInfoFuncSelector } from '../selectors'
import { mapDispatchToProps } from '../store'
import { PTyp } from '../ptyp'

class MapRulePanelImpl extends PureComponent {
  static propTypes = {
    mapId: PTyp.number.isRequired,
    ui: PTyp.object.isRequired,
    rules: PTyp.array.isRequired,
    enabled: PTyp.bool.isRequired,
    // note: avoid using this directly, use this.modifyMapRule instead.
    modifyMapRule: PTyp.func.isRequired,
    // note: avoid using this directly, use this.modifyMapRuleUI instead.
    modifyMapRuleUI: PTyp.func.isRequired,
  }

  modifyMapRule = modifier => {
    const {mapId, modifyMapRule} = this.props
    modifyMapRule(mapId, modifier)
  }

  modifyMapRuleUI = modifier => {
    const {mapId, modifyMapRuleUI} = this.props
    modifyMapRuleUI(mapId, modifier)
  }

  handleToggleMap = () =>
    this.modifyMapRule(modifyObject('enabled', not))

  handleToggleExpanded = () =>
    this.modifyMapRuleUI(modifyObject('expanded', not))

  handleToggleRule = ruleInd => () =>
    this.modifyMapRule(
      modifyObject('rules',
        modifyArray(ruleInd,
          modifyObject('enabled', not))))

  render() {
    const {mapId, ui: {expanded}, enabled, rules} = this.props
    return (
      <Panel
        className="map-rule-panel"
        header={(
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div
              onClick={this.handleToggleExpanded}
              onKeyPress={() => null}
              style={{flex: 1}}>
              {mapIdToStr(mapId)}
            </div>
            <Button
              onClick={this.handleToggleMap}
              bsStyle={enabled ? 'success' : 'danger'}
              style={{width: '3em'}} bsSize="xsmall">
              <FontAwesome name={enabled ? 'check' : 'ban'} />
            </Button>
          </div>
        )}
        collapsible
        expanded={expanded}
      >
        {
          _.flatMap(rules, (rule, ind) => {
            const {enabled: rEnabled} = rule
            const rId = ruleAsId(rule)
            return [
              (
                <Button
                  key={`${rId}-remove`}
                  bsStyle="danger"
                  style={{
                    width: '3em',
                    gridArea: `${ind} / 1 / span 1 / span 1`,
                  }}
                  bsSize="xsmall">
                  <FontAwesome name="trash" />
                </Button>
              ),
              (
                <div
                  className={(enabled && rEnabled) ? '' : 'text-muted'}
                  style={{
                    gridArea: `${ind} / 2 / span 1 / span 1`,
                  }}
                  key={`${rId}-desc`}>
                  {JSON.stringify(rule)}
                </div>
              ),
              (
                <Button
                  onClick={this.handleToggleRule(ind)}
                  key={`${rId}-toggle`}
                  bsStyle={rEnabled ? 'success' : 'danger'}
                  style={{
                    width: '3em',
                    gridArea: `${ind} / 3 / span 1 / span 1`,
                  }}
                  bsSize="xsmall">
                  <FontAwesome name={rEnabled ? 'check' : 'ban'} />
                </Button>
              ),
            ]
            }
          )
        }
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
