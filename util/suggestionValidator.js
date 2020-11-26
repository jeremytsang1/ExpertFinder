class SuggestionValidator {
  constructor(fieldsToSuggestFor, db) {
    this.fieldsToSuggestFor = fieldsToSuggestFor;
    this.db = db;
  }

  static get MSG_PREFIX() {
    return "WARNING Database is improperly formatted:";
  }

  isDatabaseSafeForSuggestions() {
    let usrAry = this.db["Experts"];
    let knowns = this.db["Known"];

    if (!Array.isArray(usrAry)) {
      return `${SuggestionValidator.MSG_PREFIX} this.db["Experts"] is not an array`;
    } else if (typeof knowns !== 'object') {
      return `${SuggestionValidator.MSG_PREFIX} this.db["Known"] is not an object`;
    } else if (knowns === null) {
      return `${SuggestionValidator.MSG_PREFIX} this.db["Known"] is null`;
    }

    for (let [i, user] of this.db["Experts"].entries()) {
      if (this.checkUser(user, i) !== null) {
        return this.checkUser(user, i);
      }
    }

    if (this.areValidKnowns(this.db["Known"]) !== null) {
      return this.areValidKnowns(this.db["Known"]);
    }

    return null;
  }

  checkUser(user, userIndex) {
    let check;
    for (let field of this.fieldsToSuggestFor) {
      check =  this.checkFieldAry(user[field], field, `this.db["Expert"][${userIndex}]`);
      if (check !== null) return check;
    }

    return null;
  }

  checkFieldAry(ary, field, description) {
    let suffix = "is not an array";
    if (!Array.isArray(ary)) {
      return `${SuggestionValidator.MSG_PREFIX} ${description}["${field}"] ${suffix}`;
    }

    suffix = "is not a string";
    for (let [i, elt] of ary.entries()) {
      if (!(typeof elt == "string" || elt instanceof String)) {
        return `${SuggestionValidator.MSG_PREFIX} ${description}["${field}"][${i}] ${suffix}`;
      }
    }
    return null;
  }

  areValidKnowns(knowns) {
    let check;
    for (let field of this.fieldsToSuggestFor) {
      check = this.checkFieldAry(knowns[field], field, `this.db["Known"]`);
      if (check !== null) return check;
    }

    return null;
  }
}

module.exports = {
  SuggestionValidator
};
