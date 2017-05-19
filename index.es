import { connect } from 'react-redux'

import { AutoRefresherMain } from './ui/auto-refresher-main'
import { mainSelector } from './selector'
import { reducer, mapDispatchToProps } from './reducer'

/*

   TODO: to be implemented

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

const reactClass = connect(
  mainSelector,
  mapDispatchToProps,
)(AutoRefresherMain)

export {
  reactClass,
  reducer,
}
