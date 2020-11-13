
function fuzzySearch() {
  const FUSE_OPTIONS = {includeScore: true}
  const OUTPUT_ELT_ID = "fuzzy-terms";
  const SEARCH_TERMS = [
    "Arcadia",
    "Gates of the Arctic",
    "Gateway Arch",
    "Martha's Vineyard",
    "Olympic",
    "Yellowstone",
    "Yosemite",
  ];

  document.addEventListener("DOMContentLoaded", () => {
    // Display list of search terms for convenience
    document.querySelector(`#${OUTPUT_ELT_ID}`).textContent = SEARCH_TERMS.join(" | ");

    // Register fuzzy searching on the submit button.
    document.querySelector("#fuzzy-submit").addEventListener("click", (event) => {
      let searchKey = document.querySelector("#fuzzy-field").value;
      let outputDiv = document.querySelector("#fuzzy-output");

      let fuse = new Fuse(SEARCH_TERMS, FUSE_OPTIONS);
      let results = fuse.search(searchKey);
      outputDiv.textContent = formatFuzzyResult(results)

      event.preventDefault();
    });
  });

  function formatFuzzyResult(results) {
    let output = [];
    let resultMsg;
    results.forEach(result => {
      resultMsg = "";
      for (let key in result) resultMsg += `${key}: ${result[key]}` + "\n";
      output.push(resultMsg);
    });
    return output.join("\n----------------------------------------\n");
  }
}

fuzzySearch();
