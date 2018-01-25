import { AutoRefresherMain as reactClass } from './ui'
import { Settings as settingsClass } from './ui/settings'
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

let webview = null

const responseHandler = e => {
  if (e.originalURL.indexOf('/gadget/js/kcs_const.js') !== -1) {
    bac.notifyGameStart()
  }

  if (e.originalURL.indexOf('/kcs/mainD2.swf?') !== -1) {
    bac.notifyFlashLoad()
  }
}

const pluginDidLoad = () => setTimeout(() => {
  globalSubscribe()
  bac.init(loadPState())
  const {$} = window
  webview = $('webview')
  webview.addEventListener('did-get-response-details', responseHandler)
})

const pluginWillUnload = () => {
  globalUnsubscribe()
  if (webview) {
    webview.removeEventListener('did-get-response-details', responseHandler)
    webview = null
  }
}

export {
  reactClass,
  settingsClass,
  reducer,
  pluginDidLoad,
  pluginWillUnload,
}
