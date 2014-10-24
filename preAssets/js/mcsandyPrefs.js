/*MCSANDYPREFS: A user's preferences with the interface*/
mcsandyPrefs =  {
    init : function () {
        console.log("Mcsandy Preferences Loaded");
        var _this = mcsandyPrefs;
        _this.functions.loadPreferences();
        _this.functions.runPreferences();
    },
    prefUpdaters : {
        hLayout: function () {
            console.log('layout');
            var _this = mcsandyPrefs;
            mcsandyUI.helpers.toggleClass(document.querySelector('body'), 'mcsandy--horizontal');
        },
        editPanel: function () {
        },
        projectPanel: function () {
        }
    },
    functions : {
        loadPreferences : function () {
            var _this = mcsandyPrefs;
            if (store.get(0, 'mcsandyPrefs') !== undefined) {
                mcsandyAppData.userPrefs = store.get(0, 'mcsandyPrefs');
            } else {
                _this.functions.savePreferences(mcsandyAppData.userPrefs); 
            }
        },
        savePreferences: function (prefs) {
            var _this = mcsandyPrefs;
            prefs = prefs !== undefined ? prefs : mcsandyAppData.userPrefs;
            store.set(0, 'mcsandyPrefs', prefs);
        },
        runPreferences: function () {
            var _this = mcsandyPrefs,
                uiPrefs = mcsandyAppData.userPrefs.ui;
            for (var pref in uiPrefs) {
                if (uiPrefs[pref]) {
                    _this.prefUpdaters[pref]();
                }
            }
        }
    }
};