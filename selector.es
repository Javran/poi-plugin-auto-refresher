import { createSelector } from 'reselect'
import { fcdSelector } from 'views/utils/selectors'

const fcdMapSelector = createSelector(
  fcdSelector,
  fcd => fcd.map)

export { fcdMapSelector }
