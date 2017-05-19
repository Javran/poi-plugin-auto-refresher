import { join } from 'path-extra'

import {
  // not reliable as it depends on process ordering of messages
  // we only use this when "curMapId" is not available
  // (this happens when the plugin is just loaded)
  sortieMapIdSelector,
} from 'views/utils/selectors'
import { gameReloadFlash } from 'views/services/utils'

import {
  ruleAsId,
  addConfigLine,
  loadRuleConfig,
} from './rule'

import { modifyArray } from './utils'

const { getStore } = window

// 'null' as placeholders for both, the real initialization is done
// after we have acquired enough info
const initState = {
  ruleTable: null,
  disabledMapIds: null,
  curMapId: null,
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
    return {
      ...remainingState,
      disabledMapIds:
        isDisabled
          ? disabledMapIds.filter( x => x !== mapId )
          : [...disabledMapIds, mapId],
    }
  }

  if (action.type === '@poi-plugin-auto-refresher@ToggleRule') {
    const { ruleTable, ...remainingState } = state
    const { mapId, ruleId } = action
    const toggleRule = r => ({ ...r, enabled: !r.enabled})
    const modifyRuleList = rules => {
      const ruleInd = rules.findIndex( r => ruleAsId(r) === ruleId )
      return ruleInd !== -1 ? modifyArray(ruleInd,toggleRule)(rules) : rules
    }

    return {
      ...remainingState,
      ruleTable: {
        ...ruleTable,
        [mapId]: modifyRuleList(ruleTable[mapId]),
      },
    }
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
    return {
      ...remainingState,
      ruleTable: removeEmpty({
        ...ruleTable,
        [mapId]: modifyRuleList(ruleTable[mapId]),
      }),
    }
  }

  if (action.type === '@poi-plugin-auto-refresher@AddConfigLine') {
    const { ruleTable, disabledMapIds, ...remainingState } = state
    const { configLine } = action

    const newConfig = addConfigLine(
      { ruleTable, disabledMapIds }, configLine)

    return {
      ...remainingState,
      ruleTable: newConfig.ruleTable,
      disabledMapIds: newConfig.disabledMapIds,
    }
  }

  if (action.type === '@@Response/kcsapi/kcsapi/api_port/port') {
    return {
      ...state,
      curMapId: null,
    }
  }

  if (action.type === '@@Request/kcsapi/api_req_map/start') {
    const { api_maparea_id, api_mapinfo_no } = action.body
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
      state.curMapId === null
      ? parseInt(sortieMapIdSelector( getStore() ), 10)
      : state.curMapId
    const edgeId = action.body.api_no
    const { ruleTable, disabledMapIds } = state
    // map must not be disabled
    if (disabledMapIds.indexOf(mapId) === -1 &&
        Array.isArray(ruleTable[mapId]) ) {
      // only enabled rules
      const rules = ruleTable[mapId].filter(r => r.enabled)
      if (rules.some(r => r.check(edgeId))) {
        gameReloadFlash()
      }
    }

    return {
      ...state,
      curMapId: mapId,
    }
  }

  return state
}

const mapDispatchToProps = dispatch => ({
  onInitialize: fcdMap =>
    dispatch({
      type: '@poi-plugin-auto-refresher@Init',
      ...loadRuleConfig(join(__dirname,'default.csv'),fcdMap),
    }),
  onToggleArea: mapId =>
    dispatch({
      type: '@poi-plugin-auto-refresher@ToggleArea',
      mapId,
    }),
  onToggleRule: (mapId,ruleId) =>
    dispatch({
      type: '@poi-plugin-auto-refresher@ToggleRule',
      mapId,
      ruleId,
    }),
  onRemoveRule: (mapId,ruleId) =>
    dispatch({
      type: '@poi-plugin-auto-refresher@RemoveRule',
      mapId,
      ruleId,
    }),
  onAddConfigLine: configLine =>
    dispatch({
      type: '@poi-plugin-auto-refresher@AddConfigLine',
      configLine,
    }),
})

export {
  reducer,
  mapDispatchToProps,
}
