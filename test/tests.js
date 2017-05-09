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
      assert.deepEqual(
        p.world.parse('13').value,
        { world: 1, area: 3} )

      assert.deepEqual(
        p.world.parse('23-4').value,
        { world: 23, area: 4} )

      assert.deepEqual(
        p.world.parse('234').value,
        { world: 23, area: 4} )

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
        map: {world: 2, area: 2},
        rules: [mk.node('A')],
      }
      assert.deepEqual(
        p.ruleLine.parse('2-2: A').value,
        r22)
      assert.deepEqual(
        p.ruleLine.parse('22:a').value,
        r22)

      const r42 = {
        map: {world: 4, area: 2},
        rules: [mk.node('I'),mk.edge('C','H')],
      }

      assert.deepEqual(
        p.ruleLine.parse('4-2: I, C->H').value,
        r42)

      assert.deepEqual(
        p.ruleLine.parse('42,i,c -> h').value,
        r42)

      const r44 = {
        map: {world: 4, area: 4},
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
        map: {world: 3, area: 3},
        rules: [mk.edgeNum(4),mk.edgeNum(7)],
      }

      assert.deepEqual(
        p.ruleLine.parse(' 3-3 , 4, 7 , ').value,
        r33)
    })
  })
})
