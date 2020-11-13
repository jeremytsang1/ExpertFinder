main();

// -----------------------------------------------------------------------------

function main() {

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#submit-github-username").addEventListener("click", (event) => {
      // Generate the GET request URL.
      let url = makeGitHubURL();
      console.log(url);

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

