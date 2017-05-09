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

const P = require('parsimmon')

// INTERNAL ONLY
// helper function for making several structures
// note that these functions are not responsible to check and normalize
// their arguments before creating the corresponding structure.
const mk = {
  node: n => ({type: 'node', node: n}),
  edge: (begin,end) => ({type: 'edge', begin, end}),
  edgeNum: edge => ({type: 'edgeNum', edge}),
}

const token = p => p.skip(P.optWhitespace)

const num = token(P.regexp(/[0-9]+/).map(x => parseInt(x,10)))

const world = token(P
  .seq(
    num,
    P.string('-').then(num).atMost(1))
  .map( ([x,ys]) => {
    if (ys.length === 0) {
      return { world: Math.floor(x/10), area: x%10 }
    } else {
      const [area] = ys
      return { world: x, area }
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

const parser = {
  num,
  world,
  selector,
  ruleLine,
}

export {
  mk,
  parser,
}
