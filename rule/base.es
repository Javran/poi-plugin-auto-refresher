// INTERNAL ONLY
// helper function for making several structures
// note that these functions are not responsible to check and normalize
// their arguments before creating the corresponding structure.
const mk = {
  map: (world,area) => world*10+area,
  node: n => ({type: 'node', node: n}),
  edge: (begin,end) => ({type: 'edge', begin, end}),
  edgeId: edge => ({type: 'edgeId', edge}),
}

const splitMapId = mapId => ({
  world: Math.floor(mapId/10),
  area: mapId % 10,
})

const mapIdToStr = mapId => {
  const { world, area } = splitMapId(mapId)
  return `${world}-${area}`
}

const destructRule = (onEdgeId, onEdge, onNode) =>
  rule =>
    /* eslint-disable indent */
    rule.type === 'edgeId' ? onEdgeId(rule.edge, rule) :
    rule.type === 'edge' ? onEdge(rule.begin,rule.end, rule) :
    rule.type === 'node' ? onNode(rule.node, rule) :
    console.error(`Unknown rule type: ${rule.type}`)
    /* eslint-enable indent */

// encode rule as id
const ruleAsId = destructRule(
  edgeId => `d-${edgeId}`,
  (begin,end) => `e-${begin}-${end}`,
  node => `n-${node}`
)

// rule pretty printer (to string)
const prettyRule = (__ = x => x) => destructRule(
  (edgeId, r) => {
    const [begin,end] = [r.begin || '?', r.end || '?']
    return `${__('Match Edge Id')}: ${begin}->${end} (${edgeId})`
  },
  (begin,end,r) => {
    const edgeId = r.edge || '?'
    return `${__('Match Edge')}: ${begin}->${end} (${edgeId})`
  },
  (node,r) => {
    const edges =
      typeof r.edgeIds !== 'undefined' ?
        r.edgeIds.map(String).join(',') :
        '?'
    return `${__('Match End Node')}: *->${node} (${edges})`
  }
)

export {
  mk,

  mapIdToStr,
  splitMapId,
  destructRule,

  ruleAsId,
  prettyRule,
}
