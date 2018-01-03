import _ from 'lodash'
import { observer } from 'redux-observers'
import {
  createSelector,
  createStructuredSelector,
} from 'reselect'

import {
  savePState,
  extStateToPState,
} from '../p-state'
import {
  readySelector,
  extSelector,
} from '../selectors'

const debouncedSavePState = _.debounce(
  pStateData => setTimeout(() => savePState(pStateData)),
  500)

const extPStateSelector = createStructuredSelector({
  pState: createSelector(extSelector, extStateToPState),
  ready: readySelector,
})

const pStateSaver = observer(
  extPStateSelector,
  (_dispatch, current, previous) => {
    if (
      current.ready === true &&
      previous.ready === true &&
      current.pState !== previous.pState
    ) {
      debouncedSavePState(current.pState)
    }
  }
)

export { pStateSaver }
