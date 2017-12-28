import { AutoRefresherMain as reactClass } from './ui'
import { reducer, boundActionCreators as bac } from './store'
import { fcdMapSelector } from './selector'

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

   - no more export / import,
     and there will be only one profile to be mananged.
     we'll use files instead of localStorage for storage,
     that we things can still be easily backed up

   - need to define a p-state which contains rules, ui states
     and settings in a more structured way.

   - will still keep the "user language" same way before,
     but now there's a structured object underlying for easier processing.

   - we don't have to show all rules, let's place a table of maps
     and let user pick one from them (but we'll still make it so that
     all rules can be shown at the same time)

 */

const pluginDidLoad = () => setTimeout(() => {
  const {getStore} = window
  const fcdMap = fcdMapSelector(getStore())
  bac.init(fcdMap)
})

export {
  reactClass,
  reducer,
  pluginDidLoad,
}
