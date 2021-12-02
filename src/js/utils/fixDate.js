"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function fixDate(date) {
    let hour = date.split(" ")[1];
    hour = hour.split(":")[0];
    let dateTime = date.split(" ")[0];
    dateTime = dateTime.split("-");
    let year = dateTime[0];
    let month = dateTime[1];
    let day = dateTime[2];
    dateTime = new Date(year, month - 1, day, hour, 0, 0);
    dateTime = dateTime.toISOString().replace("T", " ").split(".")[0];
    return dateTime;
}
exports.default = fixDate;
//# sourceMappingURL=fixDate.js.map