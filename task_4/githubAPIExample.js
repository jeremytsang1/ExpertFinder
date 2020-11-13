main();

// -----------------------------------------------------------------------------

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

function makeGitHubURL() {
  const API_URL_PREFIX = "https://api.github.com/users";
  const API_URL_SUFFIX = "repos";
  let username = document.querySelector('#github-username').value;

  return `${API_URL_PREFIX}/${username}/${API_URL_SUFFIX}`
}

function registerGitHubCallback(req) {
  req.addEventListener("load", () => {
    let outputElt = document.querySelector("#output-repos");

    if (req.status >= 200 && req.status < 400) { // Search successful.
      let res = JSON.parse(req.responseText);
      outputElt.textContent = listGitHubRepos(res)
    } else { // Search failed.

      outputElt.textContent = "No public repos found for that username!";
    }
  });
}

function listGitHubRepos(res) {
  let output = [];

  res.forEach(repo => {
    output.push(`${repo['name']}: ${repo['html_url']}`)
  });
  return output.join('\n\n');
}
