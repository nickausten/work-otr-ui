const cfg = require("./app-config.json");
const express = require("express");
const app = express();
const fs = require("fs");

const port = cfg.ui.port || 8889;

app.use(express.static("public"));

app.get("/", (req, res) => res.send("Please use: /ui route"));

app.get("/ui", (req, res) => {
  // Render the index.htnl file
  let index_file = cfg.index || "/public/index.html";

  let fname = __dirname + index_file;
  fs.readFile(fname, (err, data) => {
    if (err) {
      cfg.debug || console.log(`Error reading file ${fname}`);
      res.writeHead(404);
      res.write(`Whoops! File ${fname} not found!`);
    } else {
      cfg.debug || console.log(data);
      res.write(data);
    }
    res.end();
  });
});

app.listen(port, () => {
  cfg.debug ? console.log(`Listening on port ${port}...`) : {};
});

cfg.debug && console.log("OTR UI Server ...");
