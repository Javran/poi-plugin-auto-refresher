import { AutoRefresherMain as reactClass } from './ui'
import { reducer, boundActionCreators as bac } from './store'
import { globalSubscribe, globalUnsubscribe } from './observers'
import { loadPState } from './p-state'

/*
   TODO
   plan for new version:

   - enforce that rule id should be unique in `rules` property

   - will still keep the "user language" same way before,
     but now there's a structured object underlying for easier processing.

   - it makes sense to make "expanded" togglable only in "all" mode,
     and in all other modes, we just force expansion

 */

const pluginDidLoad = () => setTimeout(() => {
  globalSubscribe()
  bac.init(loadPState())
})

const pluginWillUnload = () => {
  globalUnsubscribe()
}

export {
  reactClass,
  reducer,
  pluginDidLoad,
  pluginWillUnload,
}
