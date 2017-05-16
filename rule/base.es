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

export {
  mk,
}
