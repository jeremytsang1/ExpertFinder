class Callback {
  constructor(fcn, responseAction) {
    this.fcn = fcn; // has parameters (complete, responseAction)
    this.actionIfLastCallback = responseAction; // action
  }

  static runCallbacks(callbacks) {
    let callbacksCompletedCount = 0;

    // run all the callbacks and send when they've all completed
    callbacks.forEach(callback => callback.fcn(complete, callback.actionIfLastCallback))

    // ------------------------------------------------------------------------
    // Helper functions for sendAfterCallbacksComplete()

    // relies on closure for callbacksCompletedCount
    function complete(actionIfLastCallback) {
      callbacksCompletedCount++;
      // Check if callback is the last callback to complete
      if (callbacksCompletedCount == callbacks.length) actionIfLastCallback();
    }
  }
}

module.exports = {
  Callback
};
