import _ from 'lodash'
import { projectorToComparator, modifyObject } from 'subtender'
import { mapIdToStr } from 'subtender/kc'
import { createSelector } from 'reselect'
import {
  constSelector,
  fcdSelector,
  extensionSelectorFactory,
  sortieSelector,
} from 'views/utils/selectors'

import { prepareRule } from './rule/config'
import {
  initState,
  defaultMapRuleData,
  defaultMapRuleUIData,
} from './store'

const fcdMapSelector = createSelector(
  fcdSelector,
  fcd => fcd.map
)

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-auto-refresher'),
  ext => _.isEmpty(ext) ? initState : ext)

const readySelector = createSelector(
  extSelector,
  ext => ext.ready
)

const uiSelector = createSelector(
  extSelector,
  ext => ext.ui,
)

const mapFocusSelector = createSelector(
  uiSelector,
  ui => ui.mapFocus
)

const mapRulesSelector = createSelector(
  extSelector,
  ext => ext.mapRules
)

const mainSelector = createSelector(
  fcdMapSelector,
  extSelector,
  (fcdMap,{ruleTable,disabledMapIds,curMapId}) => ({
    fcdMap,
    ruleTable,
    disabledMapIds,
    curMapId,
  }))

/*
   a sorted Array of all mapIds that have defined rules.
   note that some mapIds (e.g. event map) are not always valid
 */
const ruleMapIdsSelector = createSelector(
  mapRulesSelector,
  mapRules => _.flatMap(
    _.toPairs(mapRules),
    ([mapIdStr, {rules}]) =>
      rules.length > 0 ? [Number(mapIdStr)] : []
  ).sort(projectorToComparator(_.identity))
)

// null or a number indicating mapId of current sortieing map
const sortieMapIdSelector = createSelector(
  sortieSelector,
  poiSortie => {
    if (!poiSortie || typeof poiSortie !== 'object')
      return null
    const {sortieMapId} = poiSortie
    if (!sortieMapId)
      return null
    return Number(sortieMapId)
  }
)

// all valid value of mapId from master data
const validMapIdsSelector = createSelector(
  constSelector,
  ({$maps}) =>
    _.keys($maps).map(Number).sort(projectorToComparator(_.identity))
)

/*
   use this selector to eliminate "auto" from mapFocus,
   which is interpreted at runtime:

   - if we are not in a sortie, it's the same as "all"
   - otherwise, the sortieing map is focused.

 */
const effectiveMapFocusSelector = createSelector(
  sortieMapIdSelector,
  mapFocusSelector,
  (mapId, mapFocus) => {
    if (mapFocus !== 'auto')
      return mapFocus
    return mapId || 'all'
  }
)

const visibleMapIdsSelector = createSelector(
  effectiveMapFocusSelector,
  ruleMapIdsSelector,
  (mapFocus, rMapIds) =>
    mapFocus === 'all' ? rMapIds : [mapFocus]
)

const getMapRuleFuncSelector = createSelector(
  mapRulesSelector,
  mapRules => mapId =>
    _.get(mapRules, mapId, defaultMapRuleData)
)

const getFcdMapRoutesFuncSelector = createSelector(
  fcdSelector,
  fcd => _.memoize(mapId => {
    const mapStr = mapIdToStr(mapId)
    if (!mapStr)
      return []
    return _.get(fcd, ['map', mapStr, 'route'], [])
  })
)

/*
   "Processed" means the data will be combined with fcdMap and have
   additional info available.
 */
const getProcessedMapRuleFuncSelector = createSelector(
  getMapRuleFuncSelector,
  getFcdMapRoutesFuncSelector,
  (getMapRule, getFcdMapRoutes) => _.memoize(mapId => {
    const mapRule = getMapRule(mapId)
    const routes = getFcdMapRoutes(mapId)
    return modifyObject(
      'rules',
      rs => rs.map(prepareRule(routes))
    )(mapRule)
  })
)

const getMapRuleUIFuncSelector = createSelector(
  uiSelector,
  ui => mapId =>
    _.get(ui, ['rules', mapId], defaultMapRuleUIData)
)

const getMapRuleInfoFuncSelector = createSelector(
  getProcessedMapRuleFuncSelector,
  getMapRuleUIFuncSelector,
  validMapIdsSelector,
  (getProcessedMapRule, getMapRuleUI, validMapIds) => _.memoize(mapId => ({
    // whether the current map is valid from master data
    valid: validMapIds.includes(mapId),
    ...getProcessedMapRule(mapId),
    ui: getMapRuleUI(mapId),
  }))
)

const shouldTriggerFuncSelector = createSelector(
  sortieMapIdSelector,
  getProcessedMapRuleFuncSelector,
  (sortieMapId, getProcessedMapRule) => _.memoize(edgeId => {
    // this should not happen, as we only call this function during sorties
    if (!sortieMapId) {
      // TODO: weird, not sure why this branch gets hit
      // TODO: it seems we need to keep record of sortieMapId because one in main app
      // gets messed up
      console.warn(`sortieMapId should not be falsy`)
      return false
    }
    const processedMapRule = getProcessedMapRule(sortieMapId)
    // when the whole map is disabled
    if (!processedMapRule.enabled)
      return false
    console.log(processedMapRule)
  })
)

export {
  fcdMapSelector,
  extSelector,
  readySelector,
  mapRulesSelector,
  uiSelector,
  mapFocusSelector,
  mainSelector,
  ruleMapIdsSelector,
  validMapIdsSelector,
  effectiveMapFocusSelector,
  visibleMapIdsSelector,
  getMapRuleInfoFuncSelector,
  getFcdMapRoutesFuncSelector,
  shouldTriggerFuncSelector,
}
