/*
   load rule config files.

   - parseRuleConfig parses the file into an intermediate structure
   - prepareRuleConfig accepts the intermediate structure and fcdMap (fcd.map)
     to produce the final representation of the rule config
   - if both config file path and fcdMap are known, loadRuleConfig can be used
     to produce the final result in one call.

 */
import { destructRule, mapIdToStr, ruleAsId } from './base'
import { parseLine } from './syntax'
import { ignore, modifyArray, konst } from '../utils'

const fs = require('fs')

const addConfigLine = (config, configLine/* parsed config line*/) => {
  if (configLine === null)
    return config

  const {ruleTable, disabledMapIds} = config

  if (configLine.type === 'toggle') {
    const { enabled, mapId } = configLine
    if (!enabled && disabledMapIds.indexOf(mapId) === -1) {
      return {
        ...config,
        disabledMapIds: [...disabledMapIds, mapId],
      }
    }
  }

  if (configLine.type === 'line') {
    const { mapId, rules } = configLine
    const ruleArr =
      typeof ruleTable[mapId] === 'undefined' ? [] : ruleTable[mapId]
    const addRule = (curRules, rule) => {
      const ruleId = ruleAsId(rule)
      const ruleInd = curRules.findIndex(r => ruleAsId(r) === ruleId)
      return ruleInd === -1 ? [...curRules, rule] : modifyArray(ruleInd,konst(rule))(curRules)
    }

    return {
      ...config,
      ruleTable: {
        ...ruleTable,
        [mapId]: rules.reduce(addRule, ruleArr),
      },
    }
  }

  console.error(`Unknown configLine type: ${configLine.type}`)
}

// parse a raw string (as if it's file content)
const parseRuleConfigStr = (rawString, errFunc=console.error) =>
  rawString
    .split(/\r?\n/)
    .map(raw => parseLine(raw,errFunc))
    .reduce(addConfigLine, {
      ruleTable: {},
      disabledMapIds: [],
    })

const parseRuleConfig = (filePath, errFunc=console.error) =>
  parseRuleConfigStr(fs.readFileSync(filePath,'utf8'), errFunc)

const prepareRule = route => destructRule(
  (edgeId,rule) => {
    const check = curEdgeId => edgeId === curEdgeId
    const result = []
    Object.keys( route ).map( edgeIdStr => {
      if (parseInt(edgeIdStr,10) === edgeId)
        result.push( route[edgeIdStr] )
    })
    return result.length === 1
      ? { ...rule, check, begin: result[0][0], end: result[0][1] }
      : {...rule, check }
  },
  (begin,end,rule) => {
    const result = []
    Object.keys( route ).map( edgeIdStr => {
      const [thisBegin,thisEnd] = route[edgeIdStr]
      if (thisBegin === begin && thisEnd === end) {
        result.push(parseInt(edgeIdStr,10))
      }
    })
    const check = curEdgeId => result[0] === curEdgeId
    return result.length === 1 ? {...rule, check, edge: result[0]} : rule
  },
  (node,rule) => {
    const edgeIds = []
    Object.keys( route ).map( edgeIdStr => {
      const [thisBegin,thisEnd] = route[edgeIdStr]
      ignore(thisBegin)
      if (thisEnd === node) {
        edgeIds.push(parseInt(edgeIdStr,10))
      }
    })
    const check = edgeId => edgeIds.indexOf(edgeId) !== -1
    return edgeIds.length > 0 ? {...rule, edgeIds, check} : rule
  }
)

const prepareConfigLine = (configLine, fcdMap) => {
  if (configLine.type === 'toggle')
    return configLine

  if (configLine.type === 'line') {
    const { mapId, rules } = configLine
    const { route } = fcdMap[mapIdToStr(mapId)] || { route: {} }
    const processRule = prepareRule(route)
    return {
      ...configLine,
      rules: rules.map(processRule),
    }
  }

  console.error(`Unknown configLine type: ${configLine.type}`)
}

// trim ruleTable, setup "check" function for rules using fcd
const prepareRuleConfig = ({ruleTable, disabledMapIds}, fcdMap) => {
  const resultRuleTable = {}

  Object.keys( ruleTable ).map( mapIdStr => {
    const mapId = parseInt(mapIdStr,10)
    const rules = ruleTable[mapIdStr]
    const { route } = fcdMap[mapIdToStr(mapId)] || { route: {} }
    const processRule = prepareRule(route)

    resultRuleTable[mapIdStr] = rules.map(processRule)
  })

  return {
    ruleTable: resultRuleTable,
    disabledMapIds,
  }
}

const loadRuleConfig = (filePath,fcdMap,errFunc=console.error) =>
  prepareRuleConfig(parseRuleConfig(filePath,errFunc),fcdMap)

export {
  addConfigLine,
  loadRuleConfig,

  parseRuleConfig,
  parseRuleConfigStr,
  prepareRuleConfig,
  prepareConfigLine,
}
