(exports.getDate = function () {
    return new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });
}),
    (exports.getDay = function () {
        return new Date().toLocaleDateString("en-US", { weekday: "long" });
    });
