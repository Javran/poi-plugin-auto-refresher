import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  fcdSelector,
  extensionSelectorFactory,
  constSelector,
} from 'views/utils/selectors'

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

const allMapIdsSelector = createSelector(
  constSelector,
  ({$maps}) =>
    _.values($maps).map(x => x.api_id).sort((x,y) => x-y)
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
}
