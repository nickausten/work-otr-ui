const $ = require("jquery");
console.log("Started");

$.get("http://google.com").done((msg) => {
	console.log(msg);
});

