import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  fcdSelector,
  extensionSelectorFactory,
  constSelector,
} from 'views/utils/selectors'
import { generalComparator } from 'subtender'
import { splitMapId } from 'subtender/kc'
import {
  gameReloadFlash,
  gameRefreshPage,
} from 'views/services/utils'

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

const triggerActionSelector = createSelector(
  extSelector,
  ext => ext.triggerAction
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

const performTriggerActionFuncSelector = createSelector(
  triggerActionSelector,
  triggerAction => {
    if (triggerAction === 'reloadFlash') {
      return gameReloadFlash
    }
    if (triggerAction === 'refreshPage') {
      return gameRefreshPage
    }
    if (triggerAction === 'toast') {
      return () => {
        const {toast} = window
        toast('Going offroute')
      }
    }
    if (triggerAction === 'noop') {
      return _.noop
    }

    console.error(`unknown trigger action: ${triggerAction}, assuming "noop"`)
    return _.noop
  }
)

export {
  extSelector,
  fcdMapSelector,
  readySelector,
  mapRulesSelector,
  uiSelector,
  triggerActionSelector,
  mapFocusSelector,
  mapIdSelector,
  allMapIdsSelector,
  grouppedMapInfoListSelector,
  lastGameStartSelector,
  lastFlashLoadSelector,
  performTriggerActionFuncSelector,
}
