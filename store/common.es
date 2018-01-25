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

       note that "expanded" represents a user choice: a user might choose
       to collapse rules for a specific map in "All" view, but it'll be forced
       to be expanded when we are viewing a specific map, otherwise this doesn't
       make good sense.

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

     note that `rules` property has one more invariant:
     the id of any rule in same array should be unique.
     a rule id is computed using `ruleAsId` function.

   */
  mapRules: {},
  /*
     action to trigger upon a match:

     - 'reload-flash' (default)
     - 'refresh-page'
     - 'toast': use window.toast to pop up a message
     - 'noop': do nothing

   */
  triggerAction: 'reload-flash',
  /*
     not present in p-state, we have to keep track of mapId ourselves
     because <store>.sortie.sortieMapId is not reliable: both us and <store>.sortie
     reacts to /start api and by the time we are processing it,
     <store>.sortie is not yet updated.

     INVARIANT: mapId should either be a valid mapId, or null, can never be 0.
   */
  mapId: null,
  // timestamp of receiving mainD2.swf
  lastGameStart: null,
  // timestamp of most recent api_start2 request
  lastFlashLoad: null,
  // a flag for indicating whether p-state is loaded.
  ready: false,
}

export { initState }
