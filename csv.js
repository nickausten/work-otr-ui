const cfg = require("./csv.js");
exports.convert = function(json) {
  let csv = "";
  if (json) {
    var fields = Object.keys(json[0]);
    var replacer = function(key, value) {
      return value === null ? "" : value;
    };
    csv = json.map(function(row) {
      return fields
        .map(function(fieldName) {
          return JSON.stringify(row[fieldName], replacer);
        })
        .join(",");
    });
    csv.unshift(fields.join(",")); // add header column
  }
  return csv.join("\r\n");
};
