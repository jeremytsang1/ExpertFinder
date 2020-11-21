function createFormGroup() {

}

class DatabaseField {
  constructor(humanReadable, inputAttr) {
    this.humanReadable = humanReadable;
    this.inputAttr = this.makeInputAttributes(inputAttr);
  }

  createLabel() {
    let label = document.createElement("label");
    label.setAttribute('id', this.idVal());
    return label;
  }

  createInput() {
    input = document.createElement("label");
    return input;
  }

  makeInputAttributes(inputAttr) {
    // Use provided ID if it was specified in the inputAttr
    return {...{id: `${this.idVal}`}, ...inputAttr};
  }

  sourceName() {
    return this.humanReadable.replace(' ', '-').toLowerCase();
  }

  idVal() {
    return `${DatabaseField.ID_PREFIX}${this.sourceName()}`;
  }

  static get ID_PREFIX () {
    return "profile-creation-";
  }

  static makeID(databaseName) {
    return `${DatabaseField.ID_PREFIX()}${databaseName}`;
  }
}

ts = new DatabaseField("Tech Skills");
so = new DatabaseField("Stack Overflow");
