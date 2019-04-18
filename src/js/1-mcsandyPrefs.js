/* MCSANDYPREFS: A user's preferences with the interface */

// eslint-disable-next-line no-unused-vars
const mcsandyPrefs = {
    init() {
        console.log('Mcsandy Preferences Loaded');
        Object.keys(this.functions).forEach((funcName) => {
            this.functions[funcName] = this.functions[funcName].bind(this);
        });
        this.functions.loadPreferences();
        this.functions.runPreferences();
    },
    prefUpdaters: {
        hLayout() {
            // eslint-disable-next-line no-undef
            mcsandyUI.helpers.toggleClass(document.querySelector('body'), 'mcsandy--horizontal');
        },
        editPanel() {
            // do something about the edit panel
        },
        projectPanel() {
            // do something about the project panel
        },
    },
    functions: {
        loadPreferences() {
            // eslint-disable-next-line no-undef
            const preferences = store.get(0, 'mcsandyPrefs');
            if (preferences) {
                // eslint-disable-next-line no-undef
                mcsandyAppData.userPrefs = preferences;
            } else {
                // eslint-disable-next-line no-undef
                this.functions.savePreferences(mcsandyAppData.userPrefs);
            }
        },
        savePreferences(prefs) {
            // eslint-disable-next-line no-undef
            preferences = prefs !== undefined ? prefs : mcsandyAppData.userPrefs;
            // eslint-disable-next-line no-undef
            store.set(0, 'mcsandyPrefs', preferences);
        },
        runPreferences() {
            // eslint-disable-next-line no-undef
            const uiPrefs = mcsandyAppData.userPrefs.ui;
            Object.entries(uiPrefs).forEach((entry) => {
                const [key, val] = entry;
                if (val && this.prefUpdaters[key]) {
                    this.prefUpdaters[key]();
                }
            });
        },
    },
};
