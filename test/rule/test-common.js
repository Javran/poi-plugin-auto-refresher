/*
   creates a simple object that can keep lines of messages
   and allowing retrieving them back later
 */
const mkErrorRecorder = () => {
  const errMsgLog = []
  return {
    recordError: msg => errMsgLog.push(msg),
    get: () => errMsgLog,
  }
}

export { mkErrorRecorder }
