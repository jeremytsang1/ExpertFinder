function runCallbacksAndSend(res, template, context, callbacks) {
  if (callbacks.length == 0) res.render(template, context); // render immediately
  else sendAfterCallbacksComplete(res, template, context, callbacks);
}

function sendAfterCallbacksComplete(res, template, context, callbacks) {
  let callbacksCompletedCount = 0;

  // run all the callbacks and send when they've all completed
  callbacks.forEach(callback => callback(complete))

  // ------------------------------------------------------------------------
  // Helper functions for sendAfterCallbacksComplete()

  // relies on closure for callbacksCompletedCount
  function complete() {
    callbacksCompletedCount++;
    // Check if callback is the last callback to complete
    if (callbacksCompletedCount == callbacks.length) res.render(template, context);
  }
}

module.exports = {
  runCallbacksAndSend,
  sendAfterCallbacksComplete
}
