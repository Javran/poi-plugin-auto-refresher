/*

   terms:

   - mapId: number. worldId 'concatenated' with areaId
     note that in-game this is simply worldId*10+areaId
   - worldId: world id, regular maps are from 1 to 6,
     if you see numbers as large as 30, it's an event world
   - areaId: second part of the index to pinpoint a map

   Rule syntax:

   - comma separated, first separator can be ':' in addition to ','
   - map can be indicated by number '-' number, or just a simple number
     (e.g. 25 and 2-5 refer to the same map)
   - a list of node / edge / edge number can be followed. letters are case-insensitive
       - node: matches all edges ending at that node. example: 'A', 'a'
       - edge: one node to another. example: 'H->I'
       - edge number: in-game edge numbers, in case fcd is not available

       - we call this "selector" for short

   - examples:

       - '2-2: A'
       - '22:a'
       - '4-2: I, C->H'
       - '42,i,c->h'
       - '44:j'


   - Rule object structure:


   - 'type': one of 'edge', 'edgeId', 'node'
   - 'node':
       - required when type is 'node', an uppercase letter indicating the node
   - 'edgeIds':
       - only exists in processed 'node' rule, which is a list of all edges
         that point to node in question
   - 'begin' & 'end':
       - required when type is 'node', both are uppercase node letters
   - 'edge':
       - required when type is `edgeId`, a number indicating the in-game edge id
       - also exists for processed 'edge' node rules
   - 'check':
       - a function that accepts an edge number and returns either 'true' or 'false'
         indicating whether the edge number in question matches this rule
       - exists only when this rule object is processed and valid
 */

const P = require('parsimmon')
const fs = require('fs')
const _ = require('lodash')

// INTERNAL ONLY
// helper function for making several structures
// note that these functions are not responsible to check and normalize
// their arguments before creating the corresponding structure.
const mk = {
  map: (world,area) => world*10+area,
  node: n => ({type: 'node', node: n}),
  edge: (begin,end) => ({type: 'edge', begin, end}),
  edgeId: edge => ({type: 'edgeId', edge}),
}

const splitMapId = mapId => ({
  world: Math.floor(mapId/10),
  area: mapId % 10,
})

const mapIdToStr = mapId => {
  const { world, area } = splitMapId(mapId)
  return `${world}-${area}`
}

const parser = (() => {
  const token = p => p.skip(P.optWhitespace)

  const num = token(P.regexp(/[0-9]+/).map(x => parseInt(x,10)))

  const world = token(P
    .seq(
      num,
      P.string('-').then(num).atMost(1))
    .map( ([x,ys]) => {
      if (ys.length === 0) {
        return x
      } else {
        const [area] = ys
        return mk.map(x,area)
      }
    })
    .desc('world'))

  const node = token(P
    .letter
    .map(x => x.toUpperCase())
    .desc('node')
  )

  const nodeOrEdge = token(P
    .seq(
      node,
      token(P.string('->')).then(node).atMost(1))
    .map( ([x,ys]) => {
      if (ys.length === 0) {
        return mk.node(x)
      } else {
        const [end] = ys
        return mk.edge(x,end)
      }
    })
    .desc('node or edge'))

  const edgeId = num
    .map( mk.edgeId )
    .desc('edge number')

  const selector = P
    .alt(edgeId, nodeOrEdge)
    .desc('selector')

  const rule = P
    .seq(
      world,
      token(P.oneOf(',:')).then(
        P.sepBy(
          selector,
          token(P.string(',')))),
      token(P.string(',').atMost(1)))
    .map(([map,rules]) => ({map, rules}))
    .desc('rule')

  // parse a line of rules
  const ruleLine = P.optWhitespace.then(rule)

  return {
    num,
    world,
    selector,
    ruleLine,
  }
})()

const loadRules = (fp, errFunc=console.error) => {
  const ruleTable = new Map()
  const register = (mapId, r1) => {
    if (ruleTable.has(mapId)) {
      const arr = ruleTable.get(mapId)
      if (arr.findIndex(r2 => _.isEqual(r1,r2)) === -1)
        arr.push(r1)
    } else {
      ruleTable.set(mapId, [r1])
    }
  }
  fs.readFileSync(fp,'utf8')
    .split(/\r?\n/)
    .map( raw => {
      // skipping lines that does not contain any non-space
      if (/^\s*$/.test(raw))
        return

      try {
        const {map, rules} = parser.ruleLine.tryParse(raw)
        rules.map( r => register(map, r) )
      } catch (e) {
        errFunc(`Failed to parse "${raw}"`)
        errFunc(`Error message: ${e.message}`)
      }
    })
  return ruleTable
}

const ignored = () => ({})

// trim ruleTable, setup "check" function for rules using fcd
const prepareRuleTable = (ruleTable, fcdMap) => {
  const retRuleTable = new Map();
  [...ruleTable.entries()]
    .map( ([mapId,rules]) => {
      const { route } = fcdMap[mapIdToStr(mapId)] || { route: {} }

      const newRules = rules.map( rule => {
        const { type } = rule
        if (type === 'edgeId') {
          const check = edgeId =>
            rule.edge === edgeId
          return {...rule, check }
        }

        if (type === 'node') {
          const edgeIds = []
          Object.keys( route ).map( edgeIdStr => {
            const [begin,end] = route[edgeIdStr]
            ignored(begin)
            if (end === rule.node) {
              edgeIds.push(parseInt(edgeIdStr,10))
            }
          })
          const check = edgeId => edgeIds.indexOf(edgeId) !== -1
          return edgeIds.length > 0 ? {...rule, edgeIds, check} : rule
        }

        if (type === 'edge') {
          const result = []
          Object.keys( route ).map( edgeIdStr => {
            const [begin,end] = route[edgeIdStr]
            if (begin === rule.begin && end === rule.end) {
              result.push(parseInt(edgeIdStr,10))
            }
          })
          const check = edgeId =>
            result[0] === edgeId
          return result.length === 1 ? {...rule, check, edge: result[0]} : rule
        }
        console.error(`invalid type: ${type}`)
      })
      // TODO: remove duplicated rules
      retRuleTable.set(mapId, newRules)
    })
  return retRuleTable
}

// shouldTrigger(<prepared table>)(<mapId>)(<edgeId>)
// returns true if we are suppose to trigger a refresh
const shouldTrigger = preparedTable => mapId => {
  if (preparedTable.has(mapId)) {
    const mapRules = preparedTable.get(mapId)
    return edgeId => mapRules.some( rule =>
      typeof rule.check !== 'undefined' && rule.check(edgeId) )
  } else {
    return () => false
  }
}

// should work on both unprocessed and processed rule table
const ruleTableToStr = ruleTable =>
  [...ruleTable.entries()]
    .map(([mapId,rules]) => {
      const ruleToStr = rule =>
          rule.type === 'edgeId' ? String(rule.edge)
        : rule.type === 'edge' ? `${rule.begin}->${rule.end}`
        : rule.type === 'node' ? rule.node
        : console.error(`Unknown rule type: ${rule.type}`)

      return [mapId, ...rules.map(ruleToStr)].join(',')
    })
    .join('\n')

// encode rule as id
const ruleAsId = rule =>
    rule.type === 'edgeId' ? `d-${rule.edge}`
  : rule.type === 'edge' ? `e-${rule.begin}-${rule.end}`
  : rule.type === 'node' ? `n-${rule.node}`
  : console.error(`Unknown rule type: ${rule.type}`)

export {
  mk,
  parser,

  splitMapId,
  mapIdToStr,

  loadRules,
  prepareRuleTable,
  shouldTrigger,

  ruleTableToStr,
  ruleAsId,
}
