import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap'
import { modifyObject, words } from 'subtender'

import {
  readySelector,
  triggerActionSelector,
} from '../selectors'
import { mapDispatchToProps } from '../store'
import { PTyp } from '../ptyp'

// TODO: i18n

class SettingsImpl extends PureComponent {
  static propTypes = {
    ready: PTyp.bool.isRequired,
    triggerAction: PTyp.string.isRequired,
    modify: PTyp.func.isRequired,
  }

  handleSelectTriggerAction = triggerAction =>
    this.props.modify(
      modifyObject('triggerAction', () => triggerAction)
    )

  render() {
    const {ready, triggerAction} = this.props
    return (
      <div style={{marginBottom: '1.8em'}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div
            style={{
              width: '50%',
              maxWidth: '25em',
            }}
          >
            Trigger Action
          </div>
          <div style={{flex: 1}}>
            <ButtonGroup justified>
              <DropdownButton
                id="auto-refresher-setting-trigger-action"
                title={triggerAction}
                disabled={!ready}
                onSelect={this.handleSelectTriggerAction}
              >
                {
                  words('reloadFlash refreshPage toast noop').map(w => (
                    <MenuItem key={w} eventKey={w}>{w}</MenuItem>
                  ))
                }
              </DropdownButton>
            </ButtonGroup>
          </div>
        </div>
      </div>
    )
  }
}

const Settings = connect(
  createStructuredSelector({
    ready: readySelector,
    triggerAction: triggerActionSelector,
  }),
  mapDispatchToProps,
)(SettingsImpl)

export { Settings }
