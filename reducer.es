import { join } from 'path-extra'

import { ruleAsId } from './rule/base'
import {
  addConfigLine,
  loadRuleConfig,
} from './rule/config'

import { modifyArray } from './utils'

// 'null' as placeholders for both, the real initialization is done
// after we have acquired enough info
const initState = {
  ruleTable: null,
  disabledMapIds: null,
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
