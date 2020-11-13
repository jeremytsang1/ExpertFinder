main();

// -----------------------------------------------------------------------------

/**
 * Add an event listener to the submit button so that whenever the button is
 * clicked we make an XHR request to GitHub's REST API. Provided a successful
 * response, the repo names and URLS will then be displayed in the output <div>
 */
function main() {


  document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#submit-github-username").addEventListener("click", (event) => {
      // Generate the GET request URL.
      let url = makeGitHubURL();

      // Create the request to https://api.github.com asynchronously
      let req = new XMLHttpRequest();
      req.open("GET", url, true);

      // Determine action to take with the response.
      registerGitHubCallback(req);

      // Send off the request.
      req.send(null);

      // Prevent from reloading page when clicking submit button.
      event.preventDefault();
    });
  });
}

// -----Helper functions-------------------------------------------------------

/**
 * Scans the search field to create the URL to make the GET request to.
 * @return {string} URL for a given GitHub username.
 */
function makeGitHubURL() {
  const API_URL_PREFIX = "https://api.github.com/users";
  const API_URL_SUFFIX = "repos";
  let username = document.querySelector('#github-username').value;

  return `${API_URL_PREFIX}/${username}/${API_URL_SUFFIX}`
}

/**
 * Given a request modifies the output DOM element to show the response content
 * or warns the user their search was unsuccessful.
 * @param {XMLHttpRequest} req - request to GitHub REST API
 * @return {undefined} none
 */
function registerGitHubCallback(req) {
  req.addEventListener("load", () => {
    // DOM element whose .textContent will be modified with depending on status of
    // the response.
    let outputElt = document.querySelector("#output-repos");

    if (req.status >= 200 && req.status < 400) { // Search successful.
      let repos = JSON.parse(req.responseText);
      outputElt.textContent = listGitHubRepos(repos)
    } else { // Search failed.
      outputElt.textContent = "No public repos found for that username!";
    }
  });
}

/**
 * For sake of example make a single string of the repo names and urls. One
 * pair of name urls per line. In the event of using this in the ExpertFinder
 * site, will probably want to modify this function to use actual HTML elements
 * instead of plain text.
 * @param {[Object]} repos - JSON parsed array from the GitHub REST API response.
 * @return {string} Single string of repo names and URLS.
 */
function listGitHubRepos(repos) {
  let output = [];  // Each element will represent output for a specific repo.

  // Get the repo name and URL from the response object.
  repos.forEach(repo => {
    output.push(`${repo['name']}: ${repo['html_url']}`)
  });

  // Using '\n' for newline assumes output element is styled with 'white-space:
  // pre-line'.
  return output.join('\n\n');
}
