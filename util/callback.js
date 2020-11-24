class Callback {
  constructor(fcn, responseAction) {
    this.fcn = fcn; // has parameters (complete, responseAction)
    this.actionIfLastCallback = responseAction; // action
  }
}

module.exports = {
  Callback
};
