/*
   see docs/rule.md for a spec of Rule objects
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
