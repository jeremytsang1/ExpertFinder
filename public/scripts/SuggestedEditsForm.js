var SuggestEditsButton = document.getElementsByClassName("suggest-edits-button")[0];
SuggestEditsButton.addEventListener("click", updateForm);

function updateForm(event) {
    let tagify = new Tagify(document.querySelector("#edit"));
    // {
    //     {{this.TechSkills}}: document.querySelectorAll("input[value=Techskills]").value,
    //     {{this.Coursework}}: document.querySelectorAll("input[value=Coursework]").value,
    //     {{this.Industry}}: document.querySelectorAll("input[value=Industry]").value,
    // }
}

function createTagifyObjectForSuggestedEditsForm(input, suggestionAry) {
    // Taken from Official tagify repo:
    // https://github.com/yairEO/tagify/blob/bd4cb069b1cacb6b8bdd34457de5f86752015a9c/index.html#L1456
    const tagify = new Tagify(input, {
        whitelist: suggestionAry.sort(),
        dropdown: {
            maxItems: 20,           // <- mixumum allowed rendered suggestions
            classname: "tags-look", // <- custom classname for this dropdown, so it could be targeted
            enabled: 0,             // <- show suggestions on focus
            closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
        }
    });
    setReadOnly(input, true);
    setupEditsButton(input);
    return tagify;
}

function setupEditsButton(input) {
}


function setReadOnly(input, toBeReadOnly) {
    const tags = input.parentElement.querySelector("tags");

    // simple toggling
    if (typeof(toBeReadOnly) !== 'boolean') {
        tags.toggleAttribute('readonly');
        return;
    }

    // setting
    if (toBeReadOnly) {
        tags.setAttribute('readonly', 'readonly');
    } else {
        tags.removeAttribute('readonly');
    }
}

function prepareInputs() {
    // Assumes tagifyClientRequest.js is executed before this file to get tag
    // completions.
    makeTagifyUsingBackendData(createTagifyObjectForSuggestedEditsForm);
}

prepareInputs();
