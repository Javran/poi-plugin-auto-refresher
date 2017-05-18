import * as rule from '../../rule'

const assert = require('assert')

const spec = it

describe('rule/base', () => {
  spec('ruleAsId', () => {
    const mk = rule.mk
    assert.equal(
      rule.ruleAsId(mk.node('X')),
      'n-X')
    assert.equal(
      rule.ruleAsId(mk.edge('U','V')),
      'e-U-V')
    assert.equal(
      rule.ruleAsId(mk.edgeId(192)),
      'd-192')
  })
})
