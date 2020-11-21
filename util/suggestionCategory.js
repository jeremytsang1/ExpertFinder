class SuggestionCategory {
  constructor(catKey) {
    this.catKey = catKey;
    this.suggestions = new Set();
  }

  static get JSON_SUGGESTIONS_OBJ_KEY () {
    return "Categories";
  }

  static get KNOWN_KEY () {
    return "Known";
  }

  static get USER_KEY () {
    return "Users";
  }

  static prepareContext() {
    const context = {};
    context[SuggestionCategory.JSON_SUGGESTIONS_OBJ_KEY] = {};
    return context;
  }

  static isValidDB(DB) {
    return ((DB[SuggestionCategory.KNOWN] !== undefined) &&
            (this.premades(DB) !== undefined))
  }

  premades(DB) {
    return DB[SuggestionCategory.KNOWN][this.catKey];
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
      this.suggestions.add(elt)
    }));
  }

  getPremadeSuggestions(DB) {
    if (SuggestionCategory.isValidDB(DB)) {
      this.premades(DB).forEach(premade => this.suggestions.add(premade));
    }
  }
}
module.exports = {
  SuggestionCategory
}
