class Validator {
  constructor(fieldsToSuggestFor, db) {
    this.fieldsToSuggestFor = fieldsToSuggestFor;
    this.db = db;
  }

  static get MSG_PREFIX() {
    return "WARNING Database is improperly formatted:";
  }

  isDatabaseSafeForSuggestions() {
    let expertAry = this.db["Experts"];
    let knowns = this.db["Known"];

    if (!Array.isArray(expertAry)) {
      return `${Validator.MSG_PREFIX} this.db["Experts"] is not an array`;
    } else if (typeof knowns !== 'object') {
      return `${Validator.MSG_PREFIX} this.db["Known"] is not an object`;
    } else if (knowns === null) {
      return `${Validator.MSG_PREFIX} this.db["Known"] is null`;
    }

    for (let [i, expert] of this.db["Experts"].entries()) {
      if (this.checkExpert(expert, i) !== null) {
        return this.checkExpert(expert, i);
      }
    }

    if (this.areValidKnowns(this.db["Known"]) !== null) {
      return this.areValidKnowns(this.db["Known"]);
    }

    return null;
  }

  checkExpert(expert, expertIndex) {
    let check;
    for (let field of this.fieldsToSuggestFor) {
      check =  this.checkFieldAry(expert[field], field, `this.db["Expert"][${expertIndex}]`);
      if (check !== null) return check;
    }

    return null;
  }

  checkFieldAry(ary, field, description) {
    let suffix = "is not an array";
    if (!Array.isArray(ary)) {
      return `${Validator.MSG_PREFIX} ${description}["${field}"] ${suffix}`;
    }

    suffix = "is not a string";
    for (let [i, elt] of ary.entries()) {
      if (!(typeof elt == "string" || elt instanceof String)) {
        return `${Validator.MSG_PREFIX} ${description}["${field}"][${i}] ${suffix}`;
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
  Validator
};
