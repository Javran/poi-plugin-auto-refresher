import _ from 'lodash'
import { projectorToComparator } from 'subtender'
import { createSelector } from 'reselect'
import {
  fcdSelector,
  extensionSelectorFactory,
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

export {
  fcdMapSelector,
  extSelector,
  readySelector,
  mapRulesSelector,
  uiSelector,
  mainSelector,
  ruleMapIdsSelector,
}
