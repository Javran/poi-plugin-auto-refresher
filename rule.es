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
 */

import { join } from 'path-extra'
import { readJsonSync } from 'fs-extra'

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
  edgeNum: edge => ({type: 'edgeNum', edge}),
}

const splitMapId = mapId => ({
  world: Math.floor(mapId/10),
  area: mapId % 10,
})

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

  const edgeNum = num
    .map( mk.edgeNum )
    .desc('edge number')

  const selector = P
    .alt(edgeNum, nodeOrEdge)
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

/*
const tmpFcdMap = readJsonSync(join(__dirname,'assets','map.json'))

const applyFcd = (ruleTable, fcdMap) => {
  [...ruleTable.keys()]
    .map( mapId => {
      const {world,area} = splitMapId(mapId)
      const rules = ruleTable.get(mapId)
      const mapInfo = fcdMap[`${world}-${area}`] || { route: {} }
      const { route } = mapInfo

      const newRules = rules.map( rule => {
        const { type } = rule
        if (type === 'edgeNum') {
          const check = edgeNum =>
            rule.edge === edgeNum
          return {...rule, check }
        }

        if (type === 'node') {
          // TODO
        }


        if (type === 'edge') {
          // TODO
        }
        console.log(rule)
        console.error(`invalid type: ${type}`)
      })

      ruleTable.set(mapId, newRules)
    })
}

const r = loadRules(join(__dirname,'assets','default.csv'))
applyFcd(r,tmpFcdMap)
*/

export {
  mk,
  parser,

  splitMapId,
  loadRules,
}
