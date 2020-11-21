class DatabaseField {
  constructor(humanReadable, inputAttr) {
    this.humanReadable = humanReadable;
    this.inputAttr = this.makeInputAttributes(inputAttr);
  }

  createLabel() {
    let label = document.createElement("label");
    label.setAttribute('id', this.idVal());
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
    return `${DatabaseField.ID_PREFIX}${this.sourceName()}`;
  }

  static get ID_PREFIX () {
    return "profile-creation-";
  }

  static makeID(databaseName) {
    return `${DatabaseField.ID_PREFIX()}${databaseName}`;
  }
}

function createElt(eltType, ...classes) {
  const ELT = document.createElement(eltType);
  classes.forEach(className => ELT.className += ` ${className}`);
  return ELT;
}

function createFormGroup(databaseField) {
  let formGroup = createElt("div", "form-group")
  formGroup.appendChild(databaseField.createLabel());
  formGroup.appendChild(databaseField.createInput());
  return formGroup;
}

function createCol(databaseField) {
  let col = createElt("div", "col-md-6");
  col.appendChild(createFormGroup(databaseField));
  return col;
}

function makeStandardGroups(standardFields) {
  const COLS_PER_ROW = 2;
  const DIV_TO_ADD_TO = document.querySelector(".standard-fields");

  standardFields.forEach((databaseField, i) => {
    if (i % COLS_PER_ROW == 0) DIV_TO_ADD_TO.appendChild(createElt("div", "row"));
    DIV_TO_ADD_TO.lastElementChild.append(createCol(databaseField));
  });
}

function profileCreationStructureMain() {

  const STANDARD_FIELDS = [
    new DatabaseField("Name", {"required": "required"}),
    new DatabaseField("Email", {"type": "email", "required": "required"}),
    new DatabaseField("Twitter"),
    new DatabaseField("GitHub"),
    new DatabaseField("LinkedIn"),
    new DatabaseField("Stack Overflow"),
    new DatabaseField("Profile Picture", {"type": "file"})
  ];

  const TAGIFY_FIELDS = [
    nd = new DatabaseField("Industry"),
    ts = new DatabaseField("Tech Skills"),
    cw = new DatabaseField("Coursework")
  ];

  makeStandardGroups(STANDARD_FIELDS);
  makeTagifyGroups(TAGIFY_FIELDS);
}

profileCreationStructureMain();
