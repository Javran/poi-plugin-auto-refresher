import _ from 'lodash'
import {
  modifyArray,
  modifyObject,
} from 'subtender'
import { bindActionCreators } from 'redux'

import { gameReloadFlash } from 'views/services/utils'
import { store } from 'views/create-store'

import {
  shouldTriggerFuncSelector,
} from '../selectors'

import { initState } from './common'

const { getStore } = window

const reducer = (state = initState, action) => {
  // put pState back into state, set ready flag
  if (action.type === '@@poi-plugin-auto-refresher@Init') {
    const {pState} = action
    // using _.get because pState could be null
    const ui = _.get(pState,'ui')
    const mapRules = _.get(pState, 'mapRules')
    return _.flow(
      ui ?
        modifyObject('ui', () => ui) :
        _.identity,
      mapRules ?
        modifyObject('mapRules', () => mapRules) :
        _.identity,
      modifyObject('ready', () => true)
    )(state)
  }

  // ignore all actions except "Init" if the state is not ready.
  if (!state.ready)
    return state

  if (action.type === '@@poi-plugin-auto-refresher@Modify') {
    const {modifier} = action
    return modifier(state)
  }

  if (action.type === '@@Response/kcsapi/api_port/port') {
    return {
      ...state,
      mapId: null,
    }
  }

  /*
     get mapId and immediately start testing whether we should trigger a refresh
   */
  if (
    action.type === '@@Response/kcsapi/api_req_map/next' ||
    action.type === '@@Response/kcsapi/api_req_map/start'
  ) {
    let extNewState = state
    {
      // eslint-disable-next-line camelcase
      const {api_maparea_id, api_mapinfo_no} = action.body
      const mapId = Number(api_maparea_id)*10 + Number(api_mapinfo_no)
      extNewState = modifyObject('mapId', () => mapId)(extNewState)
    }

    // execute after update is done
    setTimeout(() => {
      const poiState = getStore()
      const edgeId = action.body.api_no
      const shouldTrigger = shouldTriggerFuncSelector(poiState)
      if (shouldTrigger(edgeId)) {
        // TODO: alternative trigger
        gameReloadFlash()
      }
    })

    return extNewState
  }

  return state
}

const defaultMapRuleData = {enabled: true, rules: []}
const defaultMapRuleUIData = {expanded: true}

const actionCreators = {
  /*
     initiate the state with a loaded p-state
     this also has the effect of setting state to 'ready'.
     when the state is 'ready', all other actions are ignored.
   */
  init: pState => ({
    type: '@@poi-plugin-auto-refresher@Init',
    pState,
  }),
  modify: modifier => ({
    type: '@@poi-plugin-auto-refresher@Modify',
    modifier,
  }),
  modifyUI: modifier =>
    actionCreators.modify(modifyObject('ui', modifier)),
  changeMapFocus: mapFocus =>
    actionCreators.modifyUI(modifyObject('mapFocus', () => mapFocus)),
  modifyMapRule: (mapId, modifier) =>
    actionCreators.modify(
      modifyObject(
        'mapRules',
        modifyObject(mapId, (data = defaultMapRuleData) => modifier(data))
      )
    ),
  modifyMapRuleUI: (mapId, modifier) =>
    actionCreators.modifyUI(
      modifyObject('rules',
        modifyObject(mapId, (data = defaultMapRuleUIData) => modifier(data))
      )
    ),
  applyParsedConfig: conf => {
    if (!conf) {
      console.error(`unexpected falsy config`)
      return
    }

    if (conf.type === 'toggle') {
      const {mapId, enabled} = conf
      return actionCreators.modifyMapRule(
        mapId,
        modifyObject('enabled', () => enabled)
      )
    } else if (conf.type === 'line') {
      console.log('TODO')
    } else {
      console.error(`unexpected toggle type: ${conf.type}`)
    }
  },
}

/*

const reducer = (state = initState, action) => {

  if (action.type === '@poi-plugin-auto-refresher@RemoveRule') {
    const { ruleTable, ...remainingState } = state
    const { mapId, ruleId } = action
    const modifyRuleList = rules => rules.filter( r => ruleAsId(r) !== ruleId )
    const removeEmpty = obj => {
      const newObj = { ...obj }
      Object.keys(obj).map( k => {
        if (newObj[k].length === 0)
          delete newObj[k]
      })
      return newObj
    }
    return saveStateConfig({
      ...remainingState,
      ruleTable: removeEmpty({
        ...ruleTable,
        [mapId]: modifyRuleList(ruleTable[mapId]),
      }),
    })
  }

  if (action.type === '@poi-plugin-auto-refresher@AddConfigLines') {
    const { ruleTable, disabledMapIds, ...remainingState } = state
    const { configLines } = action

    const newConfig = configLines.reduce(
      addConfigLine,
      { ruleTable, disabledMapIds })

    return saveStateConfig({
      ...remainingState,
      ruleTable: newConfig.ruleTable,
      disabledMapIds: newConfig.disabledMapIds,
    })
  }

  return state
}

const actionCreators = ({
  removeRule: (mapId,ruleId) => ({
    type: '@poi-plugin-auto-refresher@RemoveRule',
    mapId,
    ruleId,
  }),
  addConfigLines: configLines => ({
    type: '@poi-plugin-auto-refresher@AddConfigLines',
    configLines,
  }),
})

*/

const mapDispatchToProps = dispatch1 =>
  bindActionCreators(actionCreators, dispatch1)

const boundActionCreators =
  mapDispatchToProps(store.dispatch)

export * from './common'

export {
  defaultMapRuleData,
  defaultMapRuleUIData,
  reducer,
  actionCreators,
  mapDispatchToProps,
  boundActionCreators,
}
