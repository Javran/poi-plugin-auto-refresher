import { join } from 'path-extra'
import { readJsonSync } from 'fs-extra'

import * as rule from '../../rule'

const assert = require('assert')

const spec = it

describe('rule/trigger', () => {
  spec('shouldTrigger', () => {
    // a small portion of fcd for testing config normalization
    const fcdMap = readJsonSync(join(__dirname,'..','map.json'))
    const ruleConfig = rule.loadRuleConfig(join(__dirname,'..','conf1.csv'), fcdMap)

    const gen = rule.shouldTrigger(ruleConfig)
    const f22 = gen(22)
    assert.deepEqual(
      [0,1,2,3,4,5,6,7,8].map( f22 ),
      [false,true/* ->A*/,false,false/* A->B, disabled */,false,false,true/* B->D */,false,false])

    const f13 = gen(13)
    assert.deepEqual(
      [0,1,2,3,4,5,6,7,8,9].map( f13 ),
      [
        false,false,true/* ->B */,false,false,false,false,false,
        true/* D->C (disabled) and 8 (enabled) */,false,
      ])

    // none will trigger because fcd is not available so we can't possibly figure out G->J
    const f44 = gen(44)
    for (let i=0; i<10; ++i)
      assert( !f44(i) )

    // all 3-3 rules are diabled
    const f33 = gen(33)
    for (let i=0; i<10; ++i)
      assert( !f33(i), `3-3 edge ${i}` )

    // now have 3-3 rules enabled
    // 3-3 rules are still working because they don't need fcd
    const f33Enabled = rule.shouldTrigger(
      rule.addConfigLine(
        ruleConfig,
        rule.parser.parseLine('t,33,1')))(33)
    for (let i=0; i<10; ++i) {
      if (i === 4) // note that i === 7 is ignored because it's a disabled rule
        assert( f33Enabled(i), `3-3 edge ${i}` )
      else
        assert( !f33Enabled(i), `3-3 edge ${i}`)
    }
  })
})
