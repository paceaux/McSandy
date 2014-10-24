store = {
    types: [localStorage,sessionStorage],
    convertValue: function (v) {
        return typeof v !== 'object' ? v : JSON.stringify(v);
    },
    unconvertValue: function (v) {
        if (v !== null) {
            if ( v.indexOf('{') === 0 || v.indexOf('[') === 0 ) {
                v = JSON.parse(v);
                return v;
            } else {
                return null;
            }
        }
    },
    set: function (type, k, v) {
        v = this.convertValue(v);
        store.types[type].setItem(k,v); 
    },
    get: function (type, k) {
        v = typeof k !== 'number' ? store.types[type].getItem(k) : store.types[type].getItem(store.types[type].key(k));
        return  this.unconvertValue(v);
    },
    del: function (type, k) {
        store.types[type].removeItem(k);       
    },
    clr: function (type) {
        store.types[type].clear();
    }
};