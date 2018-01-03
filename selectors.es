import _ from 'lodash'
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

const mainSelector = createSelector(
  fcdMapSelector,
  extSelector,
  (fcdMap,{ruleTable,disabledMapIds,curMapId}) => ({
    fcdMap,
    ruleTable,
    disabledMapIds,
    curMapId,
  }))

export {
  fcdMapSelector,
  extSelector,
  readySelector,
  mainSelector,
}
