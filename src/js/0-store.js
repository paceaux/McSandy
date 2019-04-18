store = {
    types: [localStorage, sessionStorage],
    convertValue(v) {
        return typeof v !== 'object' ? v : JSON.stringify(v);
    },
    unconvertValue(v) {
        if (v !== null) {
            if (v.indexOf('{') === 0 || v.indexOf('[') === 0) {
                v = JSON.parse(v);
                return v;
            }
            return null;
        }
    },
    set(type, k, v) {
        v = this.convertValue(v);
        store.types[type].setItem(k, v);
    },
    get(type, k) {
        v = typeof k !== 'number' ? store.types[type].getItem(k) : store.types[type].getItem(store.types[type].key(k));
        return this.unconvertValue(v);
    },
    del(type, k) {
        store.types[type].removeItem(k);
    },
    clr(type) {
        store.types[type].clear();
    },
};
