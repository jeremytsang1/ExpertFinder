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
    let input = document.createElement("label");
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

fn = new DatabaseField("First Name", {"required": "required"});
ln = new DatabaseField("Last Name", {"required": "required"});
em = new DatabaseField("Email", {"type": "email", "required": "required"});
tw = new DatabaseField("Twitter");
gh = new DatabaseField("GitHub");
li = new DatabaseField("LinkedIn");
so = new DatabaseField("Stack Overflow");
pp = new DatabaseField("Profile Picture", {"type": "file"});
// ----------------------------------------------------------------------------
nd = new DatabaseField("Industry");
ts = new DatabaseField("Tech Skills");
cw = new DatabaseField("Coursework");
