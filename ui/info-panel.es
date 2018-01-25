import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Panel } from 'react-bootstrap'
import shallowEqual from 'shallowequal'
import { modifyObject } from 'subtender'
import _ from 'lodash'

import {
  lastGameStartSelector,
  lastFlashLoadSelector,
} from '../selectors'
import { PTyp } from '../ptyp'
import { __ } from '../tr'

const { ticker } = window
const tickLabel = 'auto-refresher'

const pprDuration = mills => {
  if (mills === null) {
    return null
  }

  const seconds = Math.floor(mills/1000)
  const minutes = Math.floor(seconds/60)
  const hourPart = Math.floor(minutes/60)
  const minutePart = minutes - hourPart*60
  const output = []
  if (hourPart > 0) {
    output.push(`${hourPart} ${__('Hours')}`)
  }
  if (minutePart > 0) {
    output.push(`${minutePart} ${__('Mins')}`)
  }
  // insufficient as a minute
  if (output.length === 0) {
    output.push(`${seconds} ${__('Secs')}`)
  }
  return output.join(' ')
}

class InfoPanelImpl extends Component {
  static propTypes = {
    lastFlashLoad: PTyp.number,
    lastGameStart: PTyp.number,
  }

  static defaultProps = {
    lastFlashLoad: null,
    lastGameStart: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      durationFlashLoad: null,
      durationGameStart: null,
    }
  }

  componentDidMount = () =>
    ticker.reg(tickLabel, this.handleTick)

  shouldComponentUpdate = (nextProps, nextState) => {
    if (!shallowEqual(this.props, nextProps))
      return true

    // frequent update of durationFlashLoad will otherwise cause unnecessary updates
    return pprDuration(this.state.durationFlashLoad) !== pprDuration(nextState.durationFlashLoad) ||
      pprDuration(this.state.durationGameStart) !== pprDuration(nextState.durationGameStart)
  }

  componentWillUnmount = () =>
    ticker.unreg(tickLabel)

  handleTick = timestamp => {
    const {lastFlashLoad, lastGameStart} = this.props

    this.setState(_.flow(
      lastGameStart ?
        modifyObject('durationGameStart', () => timestamp - lastGameStart) :
        _.identity,
      lastFlashLoad ?
        modifyObject('durationFlashLoad', () => timestamp - lastFlashLoad) :
        _.identity
    ))
  }

  render() {
    const {lastFlashLoad, lastGameStart} = this.props
    const {durationFlashLoad, durationGameStart} = this.state
    return (
      <Panel>
        <Panel.Body>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <span
              style={{width: '9em'}}
            >
              {__('Info.LastGameStart')}:
            </span>
            <span
              style={{
                marginLeft: '1em',
                marginRight: '.5em',
                fontSize: '110%',
                fontWeight: 'bold',
              }}>
              {
                lastGameStart ?
                  moment(lastGameStart).format('YYYY-MM-DD HH:mm') :
                  '-'
              }
            </span>
            {
              durationGameStart !== null && (
                <span>({pprDuration(durationGameStart)})</span>
              )
            }
          </div>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <span
              style={{width: '9em'}}
            >
              {__('Info.LastFlashLoad')}:
            </span>
            <span
              style={{
                marginLeft: '1em',
                marginRight: '.5em',
                fontSize: '110%',
                fontWeight: 'bold',
              }}>
              {
                lastFlashLoad ?
                  moment(lastFlashLoad).format('YYYY-MM-DD HH:mm') :
                  '-'
              }
            </span>
            {
              durationFlashLoad !== null && (
                <span>({pprDuration(durationFlashLoad)})</span>
              )
            }
          </div>
        </Panel.Body>
      </Panel>
    )
  }
}

const InfoPanel = connect(
  createStructuredSelector({
    lastFlashLoad: lastFlashLoadSelector,
    lastGameStart: lastGameStartSelector,
  })
)(InfoPanelImpl)

export { InfoPanel }
