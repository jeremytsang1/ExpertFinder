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

function prepareTagifyFormGroup(tagifyField) {
  let formGroup = createFormGroup(tagifyField);
  let input = formGroup.querySelector('input');

  input.remove();
  formGroup.appendChild(createElt("div", "form-inline", "multi-input"))
  formGroup.lastElementChild.appendChild(input);
  return formGroup;
}

function makeTagifyGroups(tagifyFields) {
  const DIV_TO_ADD_TO = document.querySelector(".tagify-fields");

  tagifyFields.forEach(tagifyField => {
    DIV_TO_ADD_TO.appendChild(prepareTagifyFormGroup(tagifyField));
  });
}

function profileCreationStructureMain() {

  const STANDARD_FIELDS = [
    new ProfileCreationDatabaseField("Name", {"required": "required"}),
    new ProfileCreationDatabaseField("Email", {"type": "email", "required": "required"}),
    new ProfileCreationDatabaseField("Twitter"),
    new ProfileCreationDatabaseField("GitHub"),
    new ProfileCreationDatabaseField("LinkedIn"),
    new ProfileCreationDatabaseField("Stack Overflow"),
    new ProfileCreationDatabaseField("Profile Picture", {"type": "file"})
  ];

  const TAGIFY_FIELDS = [
    new ProfileCreationDatabaseField("Tech Skills"),
    new ProfileCreationDatabaseField("Coursework"),
    new ProfileCreationDatabaseField("Industry")
  ];

  makeStandardGroups(STANDARD_FIELDS);
  makeTagifyGroups(TAGIFY_FIELDS);
}

profileCreationStructureMain();
