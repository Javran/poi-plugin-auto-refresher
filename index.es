import { AutoRefresherMain as reactClass } from './ui'
import { reducer, boundActionCreators as bac } from './store'
import { globalSubscribe, globalUnsubscribe } from './observers'
import { loadPState } from './p-state'

/*
   TODO
   plan for new version:

   - alternative refresh action:

       - refresh the game: optional delay.

           - clamp: min, max (inclusive)
           - method:
             - uni,<mean> for uniform distribution
             - norm,<mean>,<var> for normal distribution

       - popping up an alert

       - do nothing (almost like disabling, but this allows
         user to edit and view rules)

   - learning mode

      this mode cannot be active when "refresh" method is used

       - refresh detection
       - get <mean> and <var> from data

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
