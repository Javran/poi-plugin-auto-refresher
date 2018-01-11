const initState = {
  ui: {
    /*
       indicates the focusing map for displaying rules.
       possible values:

       - 'auto': 'all' if not during sortie, otherwise, focus on the sortieing map
       - 'all': show rules for all maps
       - <mapId>: only show rules for a specific map
     */
    mapFocus: 'auto',
    /*
       `rules` is an Object, `rules[<mapId>]` is an Object for indicating
       UI state of a specific rule.

       defaults to `{expanded: true}`
     */
    rules: {},
  },
  /*
     mapRules is an Object,
     which maps mapId to <MapRule>.

     a MapRule is an Object:

     {
       enabled: <boolean>,
       rules: <Array of Rule>,
     }

   */
  mapRules: {},
  /*
     not present in p-state, we have to keep track of mapId ourselves
     because <store>.sortie.sortieMapId is not reliable: both us and <store>.sortie
     reacts to /start api and by the time we are processing it,
     <store>.sortie is not yet updated.

     INVARIANT: mapId should either be a valid mapId, or null, can never be 0.
   */
  mapId: null,
  // a flag for indicating whether p-state is loaded.
  ready: false,
}

export { initState }
