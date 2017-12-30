/*
   Rule Config Syntax

   - Rule Config file itself should be valid CSV file

   - unless explicitly stated, every letter is case-insensitive, and if there
     is a need of normalization, lower case letters are preferred.

   - each line of the file is referred to by 'config line' below

   - a 'config line' means either a 'rule line' or a 'map toggle'

     - a 'rule line' indicates a map, and a non-empty set of rules

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

// parses a number
const num = token(P.regexp(/[0-9]+/).map(x => parseInt(x,10)))

// parses a world indicator, yields mapId
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

// parses and yields the node letter in uppercase
const node = token(P
  .letter
  .map(x => x.toUpperCase())
  .desc('node')
)

// parses either a node or an edge, yields a rule structure
// these two parser are combined to avoid backtracking
const nodeOrEdge = token(P
  .seq(
    node,
    token(P.string('->')).then(node).atMost(1))
  .map( ([x,ys]) => {
    if (ys.length === 0) {
      // e.g. 'A'
      return mk.node(x)
    } else {
      // ys has exactly one element, this constraint is
      // implied by ".atMost(1)"
      const [end] = ys
      return mk.edge(x,end)
    }
  })
  .desc('node or edge'))

// parses and yields edgeId
const edgeId = num
  .map( mk.edgeId )
  .desc('edge number')


// parses and yields a single rule
const rule = P
  .seq(
    token(P.string('!').atMost(1)),
    P.alt(edgeId, nodeOrEdge))
  .map(([ec,r]) => (
    { ...r,
      // this field should always be present,
      // we are not relying on default values.
      enabled: ec.length === 0,
    }))
  .desc('rule')

const comma = token(P.string(','))

const mapToggleLine = P
  .seq(
    token(P.regexp(/t/i)).skip(comma),
    world.skip(comma),
    token(P.regexp(/[01]/)))
  .map( ([_t,mapId,rawFlg]) => (
    {
      type: 'toggle',
      mapId,
      enabled: rawFlg === '1',
    }))
  .desc('map toggle line')

const ruleLine = token(P.regexp(/l/i))
  .skip(comma).atMost(1) // optional 'l,'
  .then(P
    .seq(
      // mapId (e.g. 23)
      world,
      // ',rule_1,rule_2 ... ,rule_n'
      comma.then(rule).atLeast(1))
    .map( ([mapId, rules]) => (
      {
        type: 'line',
        mapId,
        rules,
      }))
    .desc('rule line'))

const configLine = P.alt(mapToggleLine,ruleLine)

// parses a config line, returns either a config line representation
// or null on parse failure or empty lines,
// when it is a parse error, errFunc is called with error message.
const parseLine = (raw, errFunc=console.error) => {
  if (P.optWhitespace.parse(raw).status === true)
    return null

  try {
    return P.optWhitespace.then(configLine).tryParse(raw)
  } catch (e) {
    errFunc(e.message)
    return null
  }
}

export {
  num,
  world,
  rule,
  configLine,

  parseLine,
}
