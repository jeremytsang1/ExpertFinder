class Suggester {
  constructor(fieldsToSuggestFor, db) {
    // TODO: Validate
    this.fieldsToSuggestFor = fieldsToSuggestFor;
    this.db = db;
  }

  makeSuggestions() {
    let suggestions = this.initializeEmptySuggestionsSets();
    this.addUserSuggestions(suggestions);
    this.addKnownSuggestions(suggestions);

    return this.convertSetsToArrays(suggestions);
  }

  initializeEmptySuggestionsSets() {
    let suggestions = {};
    this.fieldsToSuggestFor.forEach(field => suggestions[field] = new Set());
    return suggestions;
  }

  addUserSuggestions(suggestions) {
  }

  addKnownSuggestions(suggestions) {
  }

  convertSetsToArrays(suggestions) {
    return suggestions;
  }
}
