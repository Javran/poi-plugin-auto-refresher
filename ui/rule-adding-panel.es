import React, { Component } from 'react'

import {
  Panel,
  Button,
  FormControl,
} from 'react-bootstrap'

import { __ } from '../tr'

class RuleAddingPanel extends Component {
  render() {
    return (
      <Panel>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div
            style={{
              display: 'flex',
              flex: 1,
              alignItems: 'baseline',
            }}
          >
            <FormControl
              type="text"
              placeholder={__('Enter rule')}
            />
            <Button
              style={{
                marginLeft: 5,
                marginTop: 0,
              }}
            >
              {__('Add Rule')}
            </Button>
          </div>
        </div>
      </Panel>
    )
  }
}

export { RuleAddingPanel }
