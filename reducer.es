import { join } from 'path-extra'

import {
  loadRuleConfig,
} from './rule/config'

// 'null' as placeholders for both, the real initialization is done
// after we have acquired enough info
const initState = {
  ruleTable: null,
  disabledMapIds: null,
}

const reducer = (state = initState, action) => {
  if (action.type === '@poi-plugin-auto-refresher@Init') {
    const { ruleTable, disabledMapIds } = action
    return {
      ...state,
      ruleTable,
      disabledMapIds,
    }
  }
  return state
}

const mapDispatchToProps = dispatch => ({
  onInitialize: fcdMap =>
    dispatch({
      type: '@poi-plugin-auto-refresher@Init',
      ...loadRuleConfig(join(__dirname,'default.csv'),fcdMap),
    }),
})

export {
  reducer,
  mapDispatchToProps,
}
