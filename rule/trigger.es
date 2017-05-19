// shouldTrigger(<config structure>)(<mapId>)(<edgeId>)
// returns true if we are suppose to trigger a refresh
// you can store "shouldTrigger(<config structure>)(<mapId>)" somewhere
// which avoids some unnessary costs of looking up the whole config
const shouldTrigger = ({ruleTable, disabledMapIds}) => mapId => {
  // length check is unnessary,
  // plus we have removed entries that have empty list of rules
  const mapRules = ruleTable[mapId]
  if (Array.isArray(mapRules) &&
      disabledMapIds.indexOf(mapId) === -1) {
    const validRules = ruleTable[mapId].filter(r =>
      r.enabled && typeof r.check === 'function')
    return edgeId => validRules.some(rule => rule.check(edgeId))
  } else {
    return () => false
  }
}

export { shouldTrigger }
