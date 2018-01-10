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

import { prepareRule } from '../rule/config'

// for breaking circular dep
import { initState } from '../store/common'

import {
  defaultMapRuleData,
  defaultMapRuleUIData,
} from '../store'

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

export {
  extSelector,
  fcdMapSelector,
  readySelector,
  mapRulesSelector,
  uiSelector,
  mapFocusSelector,
  mapIdSelector,
}
