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
      even.preventDefault();
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
  // TODO
}
