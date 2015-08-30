function set (key, value) {
    this[key] = value;

    return this;
}

exports = module.exports = {
    set: set,
    rootDir: null
}
