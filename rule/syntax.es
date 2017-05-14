import * as P from 'parsimmon'
import { mk } from './base'

// transforms the parser so that it not only yields the expected result
// but also consumes all following spaces of the input string
// this allows next parser to assume the input is either EOF or non-space
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

export {
  num,
  world,
  selector,
  ruleLine,
}
