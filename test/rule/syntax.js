import assert from 'assert'

import * as rule from '../../rule'
import { mk } from '../../rule/base'

import { mkErrorRecorder } from './test-common'

const spec = it

describe('rule/syntax', () => {
  const p = rule.parser

  const enableMark = flg => r => ({ ...r, enabled: flg})
  const enabled = enableMark(true)
  const disabled = enableMark(false)

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

  spec('rule', () => {
    assert.deepEqual(
      p.rule.parse('a').value,
      enabled(mk.node('A')))

    assert.deepEqual(
      p.rule.parse('B').value,
      enabled(mk.node('B')))

    assert.deepEqual(
      p.rule.parse('x->Y').value,
      enabled(mk.edge('X','Y')))

    assert.deepEqual(
      p.rule.parse('x  ->  Y ').value,
      enabled(mk.edge('X','Y')))

    assert.deepEqual(
      p.rule.parse('15 ').value,
      enabled(mk.edgeId(15)))

    assert.deepEqual(
      p.rule.parse('!x  ->  Y ').value,
      disabled(mk.edge('X','Y')))

    assert.deepEqual(
      p.rule.parse('!123').value,
      disabled(mk.edgeId(123)))

    assert.deepEqual(
      p.rule.parse('!  v   ').value,
      disabled(mk.node('V')))
  })

  describe('config line', () => {
    spec('map toggle line', () => {
      const testParseResult = (mapId,e) => rawInput => {
        const result = p.configLine.parse(rawInput).value
        assert(result)
        assert.deepEqual(
          result,
          { type: 'toggle', mapId, enabled: e })
      }
      testParseResult(23,true)('t,23,1')
      testParseResult(234,false)('T ,23-4,0')
    })

    spec('rule line optional header', () => {
      const result1 = p.configLine.parse('l,2-2,A,!6,A->B').value
      const result2 = p.configLine.parse('2-2,A,!6,A->B').value
      const result3 = p.configLine.parse('L  , 2-2 , A,!6,A->B').value
      assert(result1 && result2)
      assert.deepEqual(result1, result2)
      assert.deepEqual(result1, result3)
    })

    spec('rule line general', () => {
      const r22 = {
        type: 'line',
        mapId: 22,
        rules: [mk.node('A')].map(enabled),
      }
      assert.deepEqual(
        p.configLine.parse('2-2, A').value,
        r22)
      assert.deepEqual(
        p.configLine.parse('22,a').value,
        r22)

      const r42 = {
        type: 'line',
        mapId: 42,
        rules: [mk.node('I'),mk.edge('C','H')].map(enabled),
      }

      assert.deepEqual(
        p.configLine.parse('4-2, I, C->H').value,
        r42)

      assert.deepEqual(
        p.configLine.parse('42,i,c -> h').value,
        r42)

      const r44 = {
        type: 'line',
        mapId: 44,
        rules: [mk.node('J')].map(enabled),
      }

      assert.deepEqual(
        p.configLine.parse('44,j').value,
        r44)

      assert.deepEqual(
        p.configLine.parse('44 , j   ').value,
        r44)

      const r33 = {
        type: 'line',
        mapId: 33,
        rules: [mk.edgeId(4),mk.edgeId(7)].map(enabled),
      }

      assert.deepEqual(
        p.configLine.parse('3-3 , 4, 7').value,
        r33)
    })

    describe('parseLine', () => {
      spec('skip leading spaces', () => {
        const er = mkErrorRecorder()
        const result1 = p.parseLine(' 2-2,a',er)
        const result2 = p.parseLine('2-2,a',er)
        assert(result1)
        assert.deepEqual(result1,result2)
      })

      spec('empty lines', () => {
        const er = mkErrorRecorder()
        assert.equal(p.parseLine('  \t\t',er.recordError),null)
        assert.equal(er.get().length, 0)

        assert.equal(p.parseLine('',er.recordError),null)
        assert.equal(er.get().length, 0)
      })

      spec('error', () => {
        const er = mkErrorRecorder()
        assert.equal(p.parseLine('t,his,line,should,not,parse',er.recordError),null)
        assert.equal(er.get().length, 1)
      })
    })
  })
})
