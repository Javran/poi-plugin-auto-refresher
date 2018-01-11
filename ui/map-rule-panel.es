import _ from 'lodash'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Panel, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { modifyObject, not, modifyArray } from 'subtender'
import { mapIdToStr } from 'subtender/kc'

import { ruleAsId, prettyRule } from '../rule'
import { getMapRuleInfoFuncSelector, effectiveMapFocusSelector } from '../selectors'
import { mapDispatchToProps } from '../store'
import { PTyp } from '../ptyp'
import { __ } from '../tr'

class MapRulePanelImpl extends PureComponent {
  static propTypes = {
    mapId: PTyp.number.isRequired,
    ui: PTyp.object.isRequired,
    rules: PTyp.array.isRequired,
    enabled: PTyp.bool.isRequired,
    effMapFocus: PTyp.oneOfType([PTyp.number, PTyp.string]).isRequired,
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

  handleToggleExpanded = () => {
    const {effMapFocus} = this.props
    // only togglable when we are in 'all' mode
    if (effMapFocus === 'all')
      this.modifyMapRuleUI(modifyObject('expanded', not))
  }

  handleToggleRule = ruleId => () =>
    this.modifyMapRule(
      modifyObject('rules', rules => {
        const ruleInd = rules.findIndex(r => ruleAsId(r) === ruleId)
        if (ruleInd === -1) {
          console.warn(`Rule with id ${ruleId} is not found`)
          return rules
        }
        return modifyArray(ruleInd, modifyObject('enabled', not))(rules)
      })
    )

  render() {
    const {mapId, ui: {expanded}, enabled, rules, effMapFocus} = this.props
    const effExpanded = effMapFocus === 'all' ? expanded : true
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
        expanded={effExpanded}
      >
        {
          _.map(rules, (rule, ind) => {
            const {enabled: rEnabled} = rule
            // we need to use ind here as we actually allow to have
            // identical rules within one map
            const key = ruleAsId(rule)
            return (
              <div
                key={key}
                style={{
                  display: 'flex',
                  ...(ind !== 0 ? {marginTop: 4} : {}),
                }}
              >
                <Button
                  bsStyle="danger"
                  style={{
                    width: '3em',
                    gridArea: `${ind} / 1 / span 1 / span 1`,
                  }}
                  bsSize="xsmall">
                  <FontAwesome name="trash" />
                </Button>
                <div
                  className={(enabled && rEnabled) ? '' : 'text-muted'}
                  style={{
                    flex: 1,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    marginLeft: '.4em',
                  }}
                >
                  {prettyRule(__)(rule)}
                </div>
                <Button
                  onClick={this.handleToggleRule(key)}
                  bsStyle={rEnabled ? 'success' : 'danger'}
                  style={{
                    width: '3em',
                    gridArea: `${ind} / 3 / span 1 / span 1`,
                    marginLeft: '.4em',
                  }}
                  bsSize="xsmall">
                  <FontAwesome name={rEnabled ? 'check' : 'ban'} />
                </Button>
              </div>
            )
          })
        }
      </Panel>
    )
  }
}

const MapRulePanel = connect(
  (state, {mapId}) => ({
    effMapFocus: effectiveMapFocusSelector(state),
    ...getMapRuleInfoFuncSelector(state)(mapId),
  }),
  mapDispatchToProps,
)(MapRulePanelImpl)

export { MapRulePanel }
