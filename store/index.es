import fs from 'fs'
import { bindActionCreators } from 'redux'

import {
  // not reliable as it depends on process ordering of messages
  // we only use this when "curMapId" is not available
  // (this happens when the plugin is just loaded)
  sortieMapIdSelector,
} from 'views/utils/selectors'
import { gameReloadFlash } from 'views/services/utils'
import { store } from 'views/create-store'

import {
  ruleAsId,
  addConfigLine,
  loadRuleConfigStr,
  shouldTrigger,
  configToStr,
} from '../rule'

import { modifyArray } from '../utils'

const { getStore } = window

// 'null' as placeholders for both, the real initialization is done
// after we have acquired enough info
const initState = {
  ruleTable: null,
  disabledMapIds: null,
  curMapId: null,
}

const _newInitState = {
  // TODO: ui related stuff (expand / collapse)
  ui: {},
  /* TODO: draft
     Object from mapId to <MapRule>,

     there MapRule is an Object:

     {
       enabled: <boolean>,
       rules: <Array of Rule>,
     }

   */
  mapRules: {},
  // TODO: is curMapId necessary?
}

// return the state intact while saving the config part
// of it to localStorage
const saveStateConfig = state => {
  const { ruleTable, disabledMapIds } = state

  if (ruleTable !== null && disabledMapIds !== null)
    localStorage.autoRefresherRawConfig =
      configToStr({ruleTable, disabledMapIds})

  return state
}

const reducer = (state = initState, action) => {
  if (action.type === '@poi-plugin-auto-refresher@Init') {
    const { ruleTable, disabledMapIds } = action
    return {
      ...state,
      ruleTable,
      disabledMapIds,
    }
  }

  if (action.type === '@poi-plugin-auto-refresher@ToggleArea') {
    const { disabledMapIds, ...remainingState } = state
    const { mapId } = action
    const isDisabled = disabledMapIds.indexOf(mapId) !== -1
    return saveStateConfig(
      {
        ...remainingState,
        disabledMapIds:
          isDisabled ?
            disabledMapIds.filter( x => x !== mapId ) :
            [...disabledMapIds, mapId],
      }
    )
  }

  if (action.type === '@poi-plugin-auto-refresher@ToggleRule') {
    const { ruleTable, ...remainingState } = state
    const { mapId, ruleId } = action
    const toggleRule = r => ({ ...r, enabled: !r.enabled})
    const modifyRuleList = rules => {
      const ruleInd = rules.findIndex( r => ruleAsId(r) === ruleId )
      return ruleInd !== -1 ? modifyArray(ruleInd,toggleRule)(rules) : rules
    }

    return saveStateConfig(
      {
        ...remainingState,
        ruleTable: {
          ...ruleTable,
          [mapId]: modifyRuleList(ruleTable[mapId]),
        },
      }
    )
  }

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

  if (action.type === '@@Response/kcsapi/api_port/port') {
    return {
      ...state,
      curMapId: null,
    }
  }

  if (action.type === '@@Request/kcsapi/api_req_map/start') {
    // eslint-disable-next-line camelcase
    const {api_maparea_id, api_mapinfo_no} = action.body
    const parse = raw => parseInt(raw,10)
    const mapId = parse(api_maparea_id)*10+parse(api_mapinfo_no)
    return {
      ...state,
      curMapId: mapId,
    }
  }

  if (action.type === '@@Response/kcsapi/api_req_map/next' ||
      action.type === '@@Response/kcsapi/api_req_map/start') {
    // when curMapId is not available upon plugin start,
    // mapId is obtained from store instead
    const mapId =
      state.curMapId === null ?
        parseInt(sortieMapIdSelector(getStore()), 10) :
        state.curMapId
    const edgeId = action.body.api_no
    const { ruleTable, disabledMapIds } = state

    const checker = shouldTrigger({ruleTable, disabledMapIds})(mapId)
    if (checker(edgeId))
      gameReloadFlash()

    return {
      ...state,
      curMapId: mapId,
    }
  }

  return state
}

const actionCreators = ({
  init: fcdMap => {
    let rawConfig = localStorage.autoRefresherRawConfig
    if (typeof rawConfig === 'undefined')
      rawConfig = ''
    return {
      type: '@poi-plugin-auto-refresher@Init',
      ...loadRuleConfigStr(rawConfig,fcdMap),
    }
  },
  toggleArea: mapId => ({
    type: '@poi-plugin-auto-refresher@ToggleArea',
    mapId,
  }),
  toggleRule: (mapId,ruleId) => ({
    type: '@poi-plugin-auto-refresher@ToggleRule',
    mapId,
    ruleId,
  }),
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

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreators, dispatch)

const boundActionCreators =
  mapDispatchToProps(store.dispatch)

export {
  reducer,
  mapDispatchToProps,
  boundActionCreators,
}
