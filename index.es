import { AutoRefresherMain as reactClass } from './ui'
import { reducer, boundActionCreators as bac } from './store'
import { globalSubscribe, globalUnsubscribe } from './observers'
import { loadPState } from './p-state'

/*

   strategy for profile switching:

   Motivation: allow users to toggle multiple rules at once

   Solution:

   - have main config stored in localStorage, the point is to make this less
     accesible to regular users, as any attempt of actually store main config
     as a file will allow user to arbitrarily modify it, which is not desired

   - Export dumps the whole config

   - Import merges exported config as if it's typed in line by line.
     and if two rules are the same, only "enable" flag is changed if necessary,
     which allows toggling multiple rules at once.

*/

/*
   TODO
   plan for new version:

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
