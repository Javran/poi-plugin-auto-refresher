/*

   TODO: see docs/rule.md, the following content will be removed in future

   terms:

   - mapId: number. worldId 'concatenated' with areaId
     note that in-game this is simply worldId*10+areaId
   - worldId: world id, regular maps are from 1 to 6,
     if you see numbers as large as 30, it's an event world
   - areaId: second part of the index to pinpoint a map

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

import * as parser from './syntax'

import {
  mapIdToStr,
  splitMapId,
  ruleAsId,
  prettyRule,
} from './base'

import { shouldTrigger } from './trigger'
import {
  loadRuleConfig,
  loadRuleConfigStr,
  addConfigLine,
  prepareConfigLine,
  parseRuleConfigStr,
  parseRuleConfig,
  configToStr,
} from './config'

export {
  parser,

  splitMapId,
  mapIdToStr,

  shouldTrigger,

  ruleAsId,
  prettyRule,

  parseRuleConfig,
  parseRuleConfigStr,
  prepareConfigLine,
  loadRuleConfig,
  loadRuleConfigStr,
  addConfigLine,
  configToStr,
}
