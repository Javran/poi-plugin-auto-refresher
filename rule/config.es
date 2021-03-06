/*
   load rule config files.

   - parseRuleConfig parses the file into an intermediate structure
   - prepareRuleConfig accepts the intermediate structure and fcdMap (fcd.map)
     to produce the final representation of the rule config
   - if both config file path and fcdMap are known, loadRuleConfig can be used
     to produce the final result in one call.

 */
import { modifyArray } from 'subtender'
import { destructRule, mapIdToStr, ruleAsId } from './base'
import { parseLine } from './syntax'

const fs = require('fs')

const addConfigLine = (config, configLine/* parsed config line */) => {
  if (configLine === null)
    return config

  const {ruleTable, disabledMapIds} = config

  if (configLine.type === 'toggle') {
    const { enabled, mapId } = configLine
    return {
      ...config,
      disabledMapIds:
        enabled ?
          // remove mapId from disabled list
          disabledMapIds.filter( curMapId => curMapId !== mapId ) :
          // try making sure mapId is in the resulting list
          // while avoiding duplicated values
          (disabledMapIds.indexOf(mapId) === -1 ?
            [...disabledMapIds, mapId] :
            disabledMapIds),
    }
  }

  if (configLine.type === 'line') {
    const { mapId, rules } = configLine
    const ruleArr =
      typeof ruleTable[mapId] === 'undefined' ? [] : ruleTable[mapId]
    const addRule = (curRules, rule) => {
      const ruleId = ruleAsId(rule)
      const ruleInd = curRules.findIndex(r => ruleAsId(r) === ruleId)
      return ruleInd === -1 ? [...curRules, rule] : modifyArray(ruleInd, () => rule)(curRules)
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
      const [_thisBegin,thisEnd] = route[edgeIdStr]
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

const loadRuleConfigStr = (filePath,fcdMap,errFunc=console.error) =>
  prepareRuleConfig(parseRuleConfigStr(filePath,errFunc),fcdMap)

const configToStr = ({ ruleTable, disabledMapIds}) => {
  // construct line of rules
  const ruleLines = Object.keys( ruleTable ).map( mapIdStr =>
    // l,<mapId>, <a list of dumped rules>
    ['l',mapIdStr, ...ruleTable[mapIdStr].map( r => {
      // dump toggle first
      const prefix = r.enabled ? '' : '!'
      // dump rule for all 3 cases
      return prefix +
        destructRule(
          edgeId => String(edgeId),
          (begin,end) => `${begin}->${end}`,
          node => node)(r)
    })].join(','))

  const toggleLines = disabledMapIds.map( mapId =>
    `t,${mapId},0`)

  return [...ruleLines, ...toggleLines]
    .join('\n')
}

export {
  addConfigLine,
  loadRuleConfig,
  loadRuleConfigStr,

  parseRuleConfig,
  parseRuleConfigStr,
  prepareRuleConfig,
  prepareConfigLine,

  configToStr,
  prepareRule,
}
