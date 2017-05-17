import { destructRule, mapIdToStr } from './base'
import { parseLine } from './syntax'
import { ignore } from '../utils'

const fs = require('fs')

const parseRuleConfig = (filePath, errFunc=console.error) => {
  const ruleTable = {}
  const disabledMapIds = []

  fs.readFileSync(filePath,'utf8')
    .split(/\r?\n/)
    .map( raw => {
      const parseResult = parseLine(raw, errFunc)
      if (parseResult !== null) {
        if (parseResult.type === 'toggle') {
          const { enabled, mapId } = parseResult
          if (!enabled && disabledMapIds.indexOf(mapId) === -1)
            disabledMapIds.push(mapId)
        } else if (parseResult.type === 'line') {
          const { mapId, rules } = parseResult
          const ruleArr =
            typeof ruleTable[mapId] === 'undefined' ? [] : ruleTable[mapId]
          ruleTable[mapId] = [...ruleArr, ...rules]
        }
      }
    })

  return {
    ruleTable,
    disabledMapIds,
  }
}

// trim ruleTable, setup "check" function for rules using fcd
const prepareRuleConfig = ({ruleTable, disabledMapIds}, fcdMap) => {
  const resultRuleTable = {}

  Object.keys( ruleTable ).map( mapIdStr => {
    const mapId = parseInt(mapIdStr,10)
    const rules = ruleTable[mapIdStr]
    const { route } = fcdMap[mapIdToStr(mapId)] || { route: {} }

    resultRuleTable[mapIdStr] = rules.map(
      destructRule(
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
      ))
  })

  return {
    ruleTable: resultRuleTable,
    disabledMapIds,
  }
}

const loadRuleConfig = (filePath,fcdMap,errFunc=console.error) =>
  prepareRuleConfig(parseRuleConfig(filePath,errFunc),fcdMap)

export {
  loadRuleConfig,

  parseRuleConfig,
  prepareRuleConfig,
}
