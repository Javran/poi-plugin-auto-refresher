import { join } from 'path-extra'
import { readJsonSync } from 'fs-extra'

import * as rule from '../rule'

const assert = require('assert')

const spec = it

describe('rule', () => {
  describe('parsing', () => {
    const p = rule.parser
    const mk = rule.mk
    spec('num', () => {
      assert.equal(p.num.parse('1000').value, 1000)
      assert( !p.num.parse('str').status )
      assert( !p.num.parse('').status )
    })

    spec('world', () => {
      assert.equal(p.world.parse('13').value, 13)
      assert.equal(p.world.parse('23-4').value, 234)
      assert.equal(p.world.parse('234').value, 234)

      assert( !p.world.parse('1-wrong').status )
    })

    spec('selector', () => {
      assert.deepEqual(
        p.selector.parse('a').value,
        mk.node('A'))

      assert.deepEqual(
        p.selector.parse('B').value,
        mk.node('B'))

      assert.deepEqual(
        p.selector.parse('x->Y').value,
        mk.edge('X','Y'))

      assert.deepEqual(
        p.selector.parse('x  ->  Y ').value,
        mk.edge('X','Y'))

      assert.deepEqual(
        p.selector.parse('15 ').value,
        mk.edgeNum(15))
    })

    spec('rule line', () => {
      const r22 = {
        map: 22,
        rules: [mk.node('A')],
      }
      assert.deepEqual(
        p.ruleLine.parse('2-2: A').value,
        r22)
      assert.deepEqual(
        p.ruleLine.parse('22:a').value,
        r22)

      const r42 = {
        map: 42,
        rules: [mk.node('I'),mk.edge('C','H')],
      }

      assert.deepEqual(
        p.ruleLine.parse('4-2: I, C->H').value,
        r42)

      assert.deepEqual(
        p.ruleLine.parse('42,i,c -> h').value,
        r42)

      const r44 = {
        map: 44,
        rules: [mk.node('J')],
      }

      assert.deepEqual(
        p.ruleLine.parse('44:j').value,
        r44)

      assert.deepEqual(
        p.ruleLine.parse('44:j,').value,
        r44)

      assert.deepEqual(
        p.ruleLine.parse('  44 : j    ,   ').value,
        r44)

      const r33 = {
        map: 33,
        rules: [mk.edgeNum(4),mk.edgeNum(7)],
      }

      assert.deepEqual(
        p.ruleLine.parse(' 3-3 , 4, 7 , ').value,
        r33)
    })

    spec('parsing config', () => {
      const mkErrorRecorder = () => {
        const errMsgLog = []
        return {
          recordError: msg => errMsgLog.push(msg),
          countMessages: () => errMsgLog.length,
        }
      }

      {
        const recorder = mkErrorRecorder()
        rule.loadRules(join(__dirname,'conf1.csv'), recorder.recordError)
        assert.equal(recorder.countMessages(), 0)
      }

      {
        const recorder = mkErrorRecorder()
        // this one contains 2 lines of errors
        rule.loadRules(join(__dirname,'conf2.csv'), recorder.recordError)
        assert.equal(recorder.countMessages(), 2*2)
      }
    })
  })

  spec('fcd', () => {
    // a small portion of fcd for testing config normalization
    const fcdMap = readJsonSync(join(__dirname,'map.json'))

  })
})
