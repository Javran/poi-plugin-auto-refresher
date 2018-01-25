import { AutoRefresherMain as reactClass } from './ui'
import { Settings as settingsClass } from './ui/settings'
import { reducer, boundActionCreators as bac } from './store'
import { globalSubscribe, globalUnsubscribe } from './observers'
import { loadPState } from './p-state'

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
