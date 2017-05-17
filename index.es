import { connect } from 'react-redux'

import { AutoRefresherMain } from './ui/auto-refresher-main'
import { mainSelector } from './selector'
import { reducer, mapDispatchToProps } from './reducer'

// TODO: to be removed after implementing profile switching
// const ruleTableRaw = loadRules(join(__dirname,'default.csv'))

/*
   TODO: allow profile switching, each rule file is an individual profile,
   we store its path, and its containing directory becomes the dir of profiles
   and menu have access to all files (and perhaps a menu item for opening that directory)
   this enable a quick way of toggling many auto-refresh rules at once

   however we might store enable / disable flag for each sortie area,
   it seems complicated to keep these flags with each config (besides profiles are
   files, which can be modified externally), and leaving each sortie area just one enable/disable
   flag sounds like the most sensible option.
*/

const reactClass = connect(
  mainSelector,
  mapDispatchToProps,
)(AutoRefresherMain)

export {
  reactClass,
  reducer,
}
