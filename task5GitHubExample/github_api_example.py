# Filename    : github_api_example.py
# Description: Simple example for using the GitHub REST API
# Requires: requests modules
# Usage: python github_api_example.py <GITHUB_USERNAME>

import requests
from sys import argv


def make_request(username):
    """Make a GET request to GitHub REST API

    Parameters
    ----------
    username: str
        GitHub username to lookup repos for.

    Returns
    -------
    requests.models.Response

    """
    url = f'https://api.github.com/users/{username}/repos'
    return requests.get(url)


def get_all_repo_names(username):
    """Get a list of all the public repo names listed for specified GitHub
    username.

    Parameters
    ----------
    username: str
        Username to search repos for.

    Returns
    -------
    List of str

    """
    req = make_request(username)

    if not req.ok:  # username not found
        return []

    res = req.json()

    return [repo['name'] for repo in res]


def main():
    if len(argv) < 2:
        print("Please provide a username!")
        return

    username = argv[1]
    repos = get_all_repo_names(username)

    if repos:
        print('\n'.join(repos))
    else:
        print(f'No repos found for {username}')


if __name__ == '__main__':
    main()
