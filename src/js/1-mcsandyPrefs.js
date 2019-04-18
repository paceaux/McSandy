/* MCSANDYPREFS: A user's preferences with the interface */
mcsandyPrefs = {
    init() {
        console.log('Mcsandy Preferences Loaded');
        const _this = mcsandyPrefs;
        _this.functions.loadPreferences();
        _this.functions.runPreferences();
    },
    prefUpdaters: {
        hLayout() {
            const _this = mcsandyPrefs;
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
            const _this = mcsandyPrefs;
            if (store.get(0, 'mcsandyPrefs') !== undefined) {
                mcsandyAppData.userPrefs = store.get(0, 'mcsandyPrefs');
            } else {
                _this.functions.savePreferences(mcsandyAppData.userPrefs);
            }
        },
        savePreferences(prefs) {
            const _this = mcsandyPrefs;
            prefs = prefs !== undefined ? prefs : mcsandyAppData.userPrefs;
            store.set(0, 'mcsandyPrefs', prefs);
        },
        runPreferences() {
            const _this = mcsandyPrefs;
            const uiPrefs = mcsandyAppData.userPrefs.ui;
            for (const pref in uiPrefs) {
                if (uiPrefs[pref]) {
                    _this.prefUpdaters[pref]();
                }
            }
        },
    },
};
