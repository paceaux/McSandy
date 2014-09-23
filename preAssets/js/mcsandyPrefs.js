/*MCSANDYPREFS: A user's preferences with the interface*/
var mcsandyPrefs;
mcsandyPrefs =  {
    init : function () {
        console.log("Mcsandy Preferences Loaded");
        var _this = mcsandyPrefs;
    },
    data : mcsandyAppData.userPrefs,
    helpers : {},
    functions : {
        loadPreferences : function () {
            var _this = mcsandyPrefs;
            _this.data = store.get(0,'mcsandyPrefs');
        },
        savePreferences: function () {
            var _this = mcsandyPrefs;
            store.set(0, 'mcsandyPrefs', _this.data);
        }
    }
}
mcsandyPrefs.init();