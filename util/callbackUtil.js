function runCallbacksAndSend(res, context, callbacks) {
  if (callbacks.length == 0) res.send(send, context); // send immediately
  else sendAfterCallbacksComplete(res, context, callbacks);
}

function sendAfterCallbacksComplete(res, context, callbacks) {
  let callbacksCompletedCount = 0;

  // run all the callbacks and send when they've all completed
  callbacks.forEach(callback => callback(complete))

  // ------------------------------------------------------------------------
  // Helper functions for sendAfterCallbacksComplete()

  // relies on closure for callbacksCompletedCount
  function complete() {
    callbacksCompletedCount++;
    // Check if callback is the last callback to complete
    if (callbacksCompletedCount == callbacks.length) res.send(context);
  }
}

module.exports = {
  runCallbacksAndSend,
  sendAfterCallbacksComplete
}
