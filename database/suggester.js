class Suggester {
  constructor(fieldsToSuggestFor, db) {
    this.fieldsToSuggestFor = fieldsToSuggestFor;
    this.db = db;
  }

  makeSuggestions() {
    let suggestions = this.initializeEmptySuggestionsSets();
    this.addUserSuggestions(suggestions);
    this.addKnownSuggestions(suggestions);
    this.convertSetsToArrays(suggestions);
    return suggestions;
  }

  initializeEmptySuggestionsSets() {
    let suggestions = {};
    this.fieldsToSuggestFor.forEach(field => suggestions[field] = new Set());
    return suggestions;
  }

  addUserSuggestions(suggestions) {
    let expertAry = this.db['Experts'];
    expertAry.forEach(expert => this.mergeFieldsInto(expert, suggestions))
  }

  addKnownSuggestions(suggestions) {
    this.mergeFieldsInto(this.db['Known'], suggestions);
  }

  /**
   * Takes each field's array in `objectWithFields` and merges its contents
   * into the corresponding field set in `suggestions`.
   * @param {object} objectWithFields - object of arrays
   * @param {object} suggestions - object of sets
   * @return {undefined}
   */
  mergeFieldsInto(objectWithFields, suggestions) {
    let ary = null;
    for (let field of this.fieldsToSuggestFor) {
      ary = objectWithFields[field];
      this.addAryEltsToSet(ary, suggestions[field]);
    }
  }

  addAryEltsToSet(ary, suggestionSet) {
    ary.forEach(elt => suggestionSet.add(elt));
  }

  convertSetsToArrays(suggestions) {
    for (let field in suggestions) suggestions[field] = [...suggestions[field]];
  }
}

module.exports = {
  Suggester
};
