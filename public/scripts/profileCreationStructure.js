function createFormGroup() {

}

class DatabaseField {
  constructor(humanReadable, inputAttr) {
    this.humanReadable = humanReadable;
    this.inputAttr = inputAttr;
  }

  createLabel() {
    label = document.createElement("label");
    return label;
  }

  createInput() {
    input = document.createElement("label");
    return input;
  }

  sourceName() {
    return this.humanReadable.replace(' ', '-').toLowerCase();
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
