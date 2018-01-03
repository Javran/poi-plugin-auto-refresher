import _ from 'lodash'
import { ensureDirSync, readJsonSync, writeJsonSync } from 'fs-extra'
import { join } from 'path-extra'

import { parseRuleConfigStr } from './rule'

/*
   the data structure used by latest version of auto-refresher:

   {
     $version: <string>,
     ui: <same as extStore.ui> (optional)
     mapRules: <same as extStore.mapRules>
   }

   note that 'ui' part is optional - any falsy value means
   the default values should be used.

 */

const latestVersion = '0.3.0'

const getPStateFilePath = () => {
  const { APPDATA_PATH } = window
  const configPath = join(APPDATA_PATH,'auto-refresher')
  ensureDirSync(configPath)
  return join(configPath,'p-state.json')
}

const extStateToPState = extState => {
  const {ui, mapRules} = extState
  return {ui, mapRules}
}

const savePState = pState => {
  try {
    const pStateWithVer = {
      ...pState,
      $version: latestVersion,
    }
    writeJsonSync(getPStateFilePath(),pStateWithVer)
  } catch (err) {
    console.error('Error while writing to p-state file', err)
  }
}

/*
   TODO:

   loading strategy:

   - prefer file if it can be found
   - if file does not exist, trying updating from localStorage instead
   - failback to default if that still doesn't work

   in doing so we intentionally preserve the old rules in localStorage,
   as this is supposed to be a massive refactor, we need to be able to go back.

 */

/*
   update legacy rule (stored in localStorage) to at least version 0.3.0.
   result value could be `null` to indicate a failure or a new user,
   and in this case, default state values should be used.
 */
const migratePStateAndLoad = () => {
  // TODO: this nested structure looks terrible and we'd better do something about it.
  try {
    // if file exists and can be loaded successfully,
    // then it should have been at least 0.3.0
    return readJsonSync(getPStateFilePath())
  } catch (err) {
    if (err.syscall === 'open' && err.code === 'ENOENT') {
      // file does not exist, try loading from localStorage.
      try {
        if (
          ('autoRefresherRawConfig' in localStorage) &&
          localStorage.autoRefresherRawConfig
        ) {
          const parseResult = parseRuleConfigStr(localStorage.autoRefresherRawConfig)
          if (parseResult) {
            const {disabledMapIds, ruleTable} = parseResult
            const mapRules = _.mapValues(
              ruleTable,
              (rules, mapIdStr) => ({
                rules,
                enabled: !disabledMapIds.includes(Number(mapIdStr)),
              }))
            return {
              mapRules,
              $version: '0.3.0',
            }
          } else {
            return null
          }
        } else {
          // either there is no legacy config or config does not exist at all
          // in both case default value should be used.
          return null
        }
      } catch (err2) {
        console.error('Error while reading p-state from localStorage', err2)
        return null
      }
    } else {
      console.error('Error while reading p-state from file', err)
      return null
    }
  }
}

/*
   this function updates a p-state structure of at least version 0.3.0
   to the latest one, and then returns p-state without `$version` property.

   any failure happens inside of this function results in `null`.
   in addition, it's allowed to pass `oldPState = null` to this function,
   in which case `null` is returned.

   whenever a `null` is returns, the default values should be used instead.
 */
const updatePState = oldPState => {
  // should use default.
  if (oldPState === null)
    return null

  if (oldPState.$version === latestVersion) {
    const {$version: _ignored, ...pState} = oldPState
    return pState
  }

  console.warn(`invalid p-state structure, using default.`)
  console.warn(`the loaded p-state:`, oldPState)
  return null
}

const loadPState = () => {
  const oldPState = migratePStateAndLoad()
  return updatePState(oldPState)
}

export {
  extStateToPState,
  savePState,
  loadPState,
}
