import _ from 'lodash'
import { observer } from 'redux-observers'
import {
  createStructuredSelector,
} from 'reselect'

import {
  savePState,
  pStateSelector,
} from '../p-state'
import {
  readySelector,
} from '../selectors/common'

const debouncedSavePState = _.debounce(
  pStateData => setTimeout(() => savePState(pStateData)),
  500
)

const extPStateSelector = createStructuredSelector({
  pState: pStateSelector,
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
