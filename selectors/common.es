import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  fcdSelector,
  extensionSelectorFactory,
  constSelector,
} from 'views/utils/selectors'
import { generalComparator } from 'subtender'
import { splitMapId } from 'subtender/kc'

// for breaking circular dep
import { initState } from '../store/common'

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-auto-refresher'),
  ext => _.isEmpty(ext) ? initState : ext)

const fcdMapSelector = createSelector(
  fcdSelector,
  fcd => fcd.map
)

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

const mapIdSelector = createSelector(
  extSelector,
  ext => ext.mapId
)

const lastFlashLoadSelector = createSelector(
  extSelector,
  ext => ext.lastFlashLoad
)

const lastGameStartSelector = createSelector(
  extSelector,
  ext => ext.lastGameStart
)

// return a sorted list of all mapIds known
const allMapIdsSelector = createSelector(
  constSelector,
  ({$maps}) =>
    _.values($maps).map(x => x.api_id).sort(generalComparator)
)

/*
   return an Array of pairs: [area : Number, Array of {mapId, area, num}]
   due to the invariant held by allMapIdsSelector,
   the Array should be naturally sorted by area.
 */
const grouppedMapInfoListSelector = createSelector(
  allMapIdsSelector,
  allMapIds => {
    const mapInfoList = allMapIds.map(mapId => ({
      mapId,
      ...splitMapId(mapId),
    }))
    const grouppedMapInfoList = _.toPairs(
      _.groupBy(mapInfoList, 'area')
    ).map(([mS, v]) =>
      [Number(mS), v]
    )
    return grouppedMapInfoList
  }
)

export {
  extSelector,
  fcdMapSelector,
  readySelector,
  mapRulesSelector,
  uiSelector,
  mapFocusSelector,
  mapIdSelector,
  allMapIdsSelector,
  grouppedMapInfoListSelector,
  lastGameStartSelector,
  lastFlashLoadSelector,
}
