/*
   Rule Config Syntax

   TODO: not implemented yet

   - Rule Config file itself should be valid CSV file

   - unless explicitly stated, every letter is case-insensitive, and if there
     is a need of normalization, lower case letters are preferred.

   - each line of the file is referred to by 'config line' below

   - a 'config line' means either a 'rule line' or a 'map toggle'

     - a 'rule line' indicates a map, and a (perhaps empty) set of rules

       - first field is always 'l' (for 'line')
       - to indicate a map, you can use either `38-2` or `382`, which both means
         world 38 (Spring 2017) area 2 (if it's a number split it by dividing 10)
       - a rule can be prefixed by '!', which means the rule should be disabled.

       - there are 3 types of rules:

         - node rule: a node letter, matches every edge pointing to it, e.g. 'A'
         - edge rule: contains begin and end node letter, e.g. 'A->B',
           it's allowed to have spaces before and after '->'.
         - edge id rule: matches edge id, e.g. '6'

       - rule line example: 'l,2-2,A,!6,A->B'

         - meaning: a rule line of map 2-2, in which we have 2 rules:

           - first one 'A' matches all edges ending at 'A'
           - second one '6' matches edge with id '6', and is disabled
           - third one 'A->B' matches the edge from 'A' to 'B'

     - a 'map toggle' indicates whether rules for that map should be disabled

       - 3 fields
       - first field is always 't' (for toggle)
       - second one is map, whose format is the same as 'rule line'
       - third one is either 0 or 1 indicates whether this map should be disabled
       - e.g. `t,2-2,0` means all rules of map 2-2 should be disabled

   - few extra syntax & semantics extension to make this more convenient

     - if a line begins with a number, a rule line is assumed. which means the following
       two lines should have no difference in semantics:

       - l,2-2,A,!6,A->B
       - 2-2,A,!6,A->B

     - if map toggle is not present, it's enabled by default
     - if there are multiple map toggle of the same line, the last one
       takes effect.

     - as opposed to CSV files, a rule config file can contain empty lines
       or lines that have only whitespaces, but they will be removed upon saving
       or normalization
 */
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
