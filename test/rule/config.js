import { join } from 'path-extra'
import assert from 'assert'

import * as rule from '../../rule/config'
import { mkErrorRecorder } from './test-common'

const spec = it

describe('rule/config', () => {
  spec('parsing & dumping config', () => {
    {
      const recorder = mkErrorRecorder()
      const r = rule.parseRuleConfig(
        join(__dirname,'..','conf1.csv'),
        recorder.recordError)
      assert.equal(recorder.get().length, 0)
      assert.equal(
        rule.configToStr(r),
        [
          'l,13,B,!D->C,8',
          'l,15,E->G',
          'l,16,K',
          'l,22,A,!A->B,6',
          'l,33,4,!7',
          'l,44,G->J',
          'l,51,E',
          't,33,0',
        ].join('\n'))
    }
    {
      const recorder = mkErrorRecorder()
      // this one contains 2 lines of errors
      rule.parseRuleConfig(join(__dirname,'..','conf2.csv'), recorder.recordError)
      assert.equal(recorder.get().length, 2)
    }
  })
})
