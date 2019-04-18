
const { localStorage, sessionStorage } = window;
const store = {
    types: [localStorage, sessionStorage],
    convertValue(val) {
        return typeof val !== 'object' ? val : JSON.stringify(val);
    },
    unconvertValue(val) {
        let result;

        if (val && (val.indexOf('{') === 0 || val.indexOf('[') === 0)) {
            result = JSON.parse(result);
        }

        return result;
    },
    set(type, key, val) {
        const value = this.convertValue(val);
        store.types[type].setItem(key, value);
    },
    get(type, key) {
        const value = typeof key !== 'number' ? store.types[type].getItem(key) : store.types[type].getItem(store.types[type].key(key));
        return this.unconvertValue(value);
    },
    del(type, k) {
        store.types[type].removeItem(k);
    },
    clr(type) {
        store.types[type].clear();
    },
};
