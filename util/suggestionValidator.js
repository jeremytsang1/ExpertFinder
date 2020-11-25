class SuggestionValidator {
  constructor(fieldsToSuggestFor, db) {
    this.fieldsToSuggestFor = fieldsToSuggestFor;
    this.db = db;
  }

  static get MSG_PREFIX() {
    return "Database is improperly formatted:";
  }

  isDatabaseSafeForSuggestions() {
    let usrAry = this.db["Experts"];
    let knowns = this.db["Known"];

    if (!Array.isArray(usrAry)) {
      throw `${SuggestionValidator.MSG_PREFIX} db["Experts"] is not an array`;
    } else if (typeof knowns !== 'object') {
      throw `${SuggestionValidator.MSG_PREFIX} db["Known"] is not an object`;
    } else if (knowns === null) {
      throw `${SuggestionValidator.MSG_PREFIX} db["Known"] is null`;
    }

    this.db["Experts"].forEach((user, i) => this.checkUser(user, i));
    this.areValidKnowns(this.db["Known"]);
  }

  checkUser(user, userIndex) {
    this.fieldsToSuggestFor.forEach(field => {
      this.checkFieldAry(user[field], field, `db["Expert"][${userIndex}]`);
    });
  }

  checkFieldAry(ary, field, description) {
    let suffix = "is not an array";
    if (!Array.isArray(ary)) {
      throw new Error(`${SuggestionValidator.MSG_PREFIX} ${description}["${field}"] ${suffix}`);
    }

    suffix = "is not a string";
    ary.forEach((elt, i) => {
      if (!(typeof elt == "string" || elt instanceof String)) {
        throw `${SuggestionValidator.MSG_PREFIX} ${description}["${field}"][${i}] ${suffix}`;
      }
    });
  }

  areValidKnowns(knowns) {
    this.fieldsToSuggestFor.forEach(field => {
      this.checkFieldAry(knowns[field], field, `db["Known"]`);
    });
  }
}

module.exports = {
  SuggestionValidator
};
