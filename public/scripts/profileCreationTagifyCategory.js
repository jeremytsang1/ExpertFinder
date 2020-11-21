class ProfileCreationTagifyCategory {
  constructor(htmlName, dbName) {
    this.htmlName = htmlName;
    this.dbName = dbName;
  }

  getInput() {
    return document.querySelector(`#${ProfileCreationTagifyCategory.INPUT_ID_PREFIX}${this.htmlName}`);
  }

  getHtmlName() {
    return this.htmlName;
  }

  getDbName() {
    return this.dbName;
  }

  static get INPUT_ID_PREFIX () {
    return "profile-creation-";
  }

  createTagify(suggestionAry) {
    // Taken from Official tagify repo:
    // https://github.com/yairEO/tagify/blob/bd4cb069b1cacb6b8bdd34457de5f86752015a9c/index.html#L1456
    return new Tagify(this.getInput(), {
      whitelist: suggestionAry.sort(),
      dropdown: {
        maxItems: 20,           // <- mixumum allowed rendered suggestions
        classname: "tags-look", // <- custom classname for this dropdown, so it could be targeted
        enabled: 0,             // <- show suggestions on focus
        closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
      }
    });
  }
}
