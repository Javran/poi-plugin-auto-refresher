import _ from 'lodash'
import { ensureDirSync, readJsonSync } from 'fs-extra'
import { join } from 'path-extra'

import { parseRuleConfigStr } from './rule'

const getPStateFilePath = () => {
  const { APPDATA_PATH } = window
  const configPath = join(APPDATA_PATH,'auto-refresher')
  ensureDirSync(configPath)
  return join(configPath,'p-state.json')
}

const latestVersion = '0.3.0'

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
