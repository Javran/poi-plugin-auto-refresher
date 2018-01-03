import _ from 'lodash'
import { projectorToComparator } from 'subtender'
import { createSelector } from 'reselect'
import {
  constSelector,
  fcdSelector,
  extensionSelectorFactory,
  sortieSelector,
} from 'views/utils/selectors'

import { initState } from './store'

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
}
