export var AdType;
(function (AdType) {
    AdType[AdType["Banner"] = 0] = "Banner";
    AdType[AdType["Interstitial"] = 1] = "Interstitial";
    AdType[AdType["Rewarded"] = 2] = "Rewarded";
    AdType[AdType["AppOpen"] = 3] = "AppOpen";
    AdType[AdType["Native"] = 4] = "Native";
    AdType[AdType["None"] = 5] = "None";
})(AdType || (AdType = {}));
export var Gender;
(function (Gender) {
    Gender[Gender["Unknown"] = 0] = "Unknown";
    Gender[Gender["Male"] = 1] = "Male";
    Gender[Gender["Female"] = 2] = "Female";
})(Gender || (Gender = {}));
export var Audience;
(function (Audience) {
    Audience[Audience["Undefined"] = 0] = "Undefined";
    Audience[Audience["Children"] = 1] = "Children";
    Audience[Audience["NotChildren"] = 2] = "NotChildren";
})(Audience || (Audience = {}));
export var AdViewSize;
(function (AdViewSize) {
    AdViewSize["B"] = "BANNER";
    AdViewSize["L"] = "LEADERBOARD";
    AdViewSize["M"] = "MEDIUM_RECTANGLE";
    AdViewSize["A"] = "ADAPTIVE";
    AdViewSize["S"] = "SMART";
})(AdViewSize || (AdViewSize = {}));
