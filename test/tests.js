import { join } from 'path-extra'
import { readJsonSync } from 'fs-extra'
// import * as ruleConfig from '../rule/config'

import * as rule from '../rule'

const assert = require('assert')

const spec = it

// const fcdMap = readJsonSync(join(__dirname,'map.json'))

describe('rule', () => {
  /*
  describe('parsing', () => {
    spec('parsing & dumping config', () => {
      const mkErrorRecorder = () => {
        const errMsgLog = []
        return {
          recordError: msg => errMsgLog.push(msg),
          countMessages: () => errMsgLog.length,
        }
      }

      {
        const recorder = mkErrorRecorder()
        const r = rule.loadRules(join(__dirname,'conf1.csv'), recorder.recordError)
        assert.equal(recorder.countMessages(), 0)

        assert.equal(
          rule.ruleTableToStr(r),
          [
            '13,B,D->C,8',
            '15,E->G',
            '16,K',
            '22,A,A->B,6',
            '33,4,7',
            '44,G->J',
            '51,E',
          ].join('\n'))
      }

      {
        const recorder = mkErrorRecorder()
        // this one contains 2 lines of errors
        rule.loadRules(join(__dirname,'conf2.csv'), recorder.recordError)
        assert.equal(recorder.countMessages(), 2*2)
      }
    })
  }) */

  true || spec('fcd', () => {
    // a small portion of fcd for testing config normalization
    const fcdMap = readJsonSync(join(__dirname,'map.json'))
    const ruleTable = rule.loadRules(join(__dirname,'conf1.csv'))
    const preparedRuleTable = rule.prepareRuleTable(ruleTable,fcdMap)

    const gen = rule.shouldTrigger(preparedRuleTable)
    const f22 = gen(22)
    assert.deepEqual(
      [0,1,2,3,4,5,6,7,8].map( f22 ),
      [false,true/* ->A*/,false,true/* A->B */,false,false,true/* B->D */,false,false])

    const f13 = gen(13)
    assert.deepEqual(
      [0,1,2,3,4,5,6,7,8,9].map( f13 ),
      [false,false,true/* ->B */,false,false,false,false,false,true/* D->C */,false])

    // none will trigger because fcd is not available so we can't possibly figure out G->J
    const f44 = gen(44)
    for (let i=0; i<10; ++i)
      assert( !f44(i) )

    // 3-3 rules are still working because they don't need fcd
    const f33 = gen(33)
    for (let i=0; i<10; ++i) {
      if (i === 4 || i === 7)
        assert( f33(i) )
      else
        assert( !f33(i) )
    }
  })
})
