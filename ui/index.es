import { join } from 'path-extra'
import React, { PureComponent } from 'react'

import { connect } from 'react-redux'

import { RuleAddingPanel } from './rule-adding-panel'
import { ViewControlPanel } from './view-control-panel'
import { mapDispatchToProps } from '../store'

class AutoRefresherMainImpl extends PureComponent {
  render() {
    return (
      <div className="poi-plugin-auto-refresher">
        <link
          rel="stylesheet"
          href={join(__dirname, '..' , 'assets', 'auto-refresher.css')}
        />
        <RuleAddingPanel />
        <ViewControlPanel />
      </div>
    )
  }
}

const AutoRefresherMain = connect(
  null,
  mapDispatchToProps,
)(AutoRefresherMainImpl)

export { AutoRefresherMain }
