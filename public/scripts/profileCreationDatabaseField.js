class ProfileCreationDatabaseField {
  constructor(humanReadable, inputAttr) {
    this.humanReadable = humanReadable;
    this.inputAttr = this.makeInputAttributes(inputAttr);
  }

  createLabel() {
    let label = document.createElement("label");
    label.setAttribute('for', this.idVal());
    label.textContent = this.humanReadable;
    return label;
  }

  createInput() {
    let input = document.createElement("input");
    for (let key in this.inputAttr) input.setAttribute(key, this.inputAttr[key]);
    return input;
  }

  defaultAttributes() {
    return  {
      "id": `${this.idVal()}`,
      "class": "form-control",
      "type": "text",
      "name": this.sourceName()
    }
  }

  makeInputAttributes(inputAttr) {
    // Use provided ID if it was specified in the inputAttr
    return {...this.defaultAttributes(), ...inputAttr};
  }

  sourceName() {
    return this.humanReadable.replace(' ', '-').toLowerCase();
  }

  idVal() {
    return `${ProfileCreationDatabaseField.ID_PREFIX}${this.sourceName()}`;
  }

  static get ID_PREFIX () {
    return "profile-creation-";
  }

  static makeID(databaseName) {
    return `${ProfileCreationDatabaseField.ID_PREFIX()}${databaseName}`;
  }
}
