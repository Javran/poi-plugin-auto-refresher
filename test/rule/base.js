import assert from 'assert'
import * as rule from '../../rule/base'

const spec = it

describe('rule/base', () => {
  spec('ruleAsId', () => {
    const {mk} = rule
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
