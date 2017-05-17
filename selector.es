import { createSelector } from 'reselect'
import {
  fcdSelector,
  extensionSelectorFactory,
} from 'views/utils/selectors'

const fcdMapSelector = createSelector(
  fcdSelector,
  fcd => fcd.map)

const extSelector = extensionSelectorFactory('poi-plugin-auto-refresher')

const mainSelector = createSelector(
  fcdMapSelector,
  extSelector,
  (fcdMap,{ruleTable,disabledMapIds}) => ({
    fcdMap,
    ruleTable,
    disabledMapIds,
  }))


export { mainSelector }
