import { AutoRefresherMain as reactClass } from './ui'
import { reducer, boundActionCreators as bac } from './store'
import { globalSubscribe, globalUnsubscribe } from './observers'
import { loadPState } from './p-state'

/*
   TODO
   plan for new version:

   - alternative refresh actions:

       - reload flash
       - refresh webview
       - popping up an alert
       - do nothing (almost like disabling, but this allows
         user to edit and view rules)

   - no need for making delays intentionally: as we already have network delays,
     the result will look like normal distribution on the server end.

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
