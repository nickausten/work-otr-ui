const cfg = require("./app-config.json");
const express = require("express");
const { XMLHttpRequest } = require("xmlhttprequest");

const path = require("path");
const app = express();
const fs = require("fs");

const port = cfg.ui.port || 8889;

app.use(express.static(path.join(__dirname, "public")));

// app.get("/", (req, res) => res.send("Please use: /ui route"));

// app.get("/ui", (req, res) => {
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

app.get("/api", (req, res) => {
  var ourRequest = new XMLHttpRequest();
  let url = cfg.server.url || "http://localhost:8889/api";
  cfg.debug && console.log("Request URL:", url);
  ourRequest.open("GET", url, true);

  // Request 'loaded' handler (SUCCESS) - should have data returned.
  //
  ourRequest.onload = ev => {
    if (ourRequest.status >= 200 && ourRequest.status < 400) {
      cfg.debug && console.log("Response = ", ourRequest.responseText);
      res.send(JSON.parse(ourRequest.responseText));
    } else {
      console.log("We connected to the server, but it returned an error.");
    }
  };

  // Request 'error' handler
  //
  ourRequest.onerror = ev => {
    var msg = `Connection error...${ev}`;
    cfg.debug && console.log(msg);
    ourRequest.close();
  };

  // Request 'close' handler
  //
  ourRequest.close = ev => {
    var msg = `Data connection closed ${ev}`;
    cfg.debug && console.log(msg);
  };

  ourRequest.send();
});

app.listen(port, () => {
  cfg.debug && console.log(`Listening on port ${port}...`);
});

cfg.debug && console.log("OTR UI Server ...");
