function addReadonlyTags(expert) {
    READONLY_KEY = "Readonly"
    const keys = ['TechSkills', 'Coursework', 'Industry'];

    expert[READONLY_KEY] = {};

    // Add a new object to each expert with read only fields of their expertise.
    keys.forEach(key => {
        expert[READONLY_KEY][key] = expert[key].map(elt => ({"value": elt, readonly: true}));
        expert[READONLY_KEY][key] = JSON.stringify(expert[READONLY_KEY][key]);
    });
}

module.exports = {
    addReadonlyTags
};
