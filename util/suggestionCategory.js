class SuggestionCategory {
  constructor(catKey, processingFunction) {
    this.catKey = catKey;
    this.suggestions = new Set();
    this.processingFunction = processingFunction;
  }

  static get JSON_SUGGESTIONS_OBJ_KEY () {
    return "Categories";
  }

  static get KNOWN_KEY () {
    return "Known";
  }

  static get USER_KEY () {
    return "Experts";
  }

  static prepareContext() {
    const context = {};
    context[SuggestionCategory.JSON_SUGGESTIONS_OBJ_KEY] = {};
    return context;
  }

  isValidDB(DB) {
    return ((DB[SuggestionCategory.KNOWN_KEY] !== undefined) &&
            (this.premades(DB) !== undefined))
  }

  premades(DB) {
    return DB[SuggestionCategory.KNOWN_KEY][this.catKey];
  }

  addSuggestionsToContext(context, jsonData) {
    const DB = JSON.parse(jsonData)
    context[SuggestionCategory.JSON_SUGGESTIONS_OBJ_KEY][this.catKey] = (
      this.getSuggestions(DB)
    );
  }

  getSuggestions(DB) {
    this.extractUserSuggestions(DB[SuggestionCategory.USER_KEY]);
    this.getPremadeSuggestions(DB)
    return [...this.suggestions];
  }

  extractUserSuggestions(users) {
    users.forEach(user => user[this.catKey].forEach(elt => {
      this.suggestions.add(this.readElt(elt))
    }));
  }

  getPremadeSuggestions(DB) {
    if (this.isValidDB(DB)) {
      this.premades(DB).forEach(elt => this.suggestions.add(this.readElt(elt)));
    }
  }

  readElt(elt) {
    return this.processingFunction(elt)
  }

}
module.exports = {
  SuggestionCategory
}
