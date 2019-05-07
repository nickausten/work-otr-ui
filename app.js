const cfg = require("./app-config.json");
const express = require("express");
const { XMLHttpRequest } = require("xmlhttprequest");
const path = require("path");
const app = express();
const csv = require("./csv.js");
const fs = require("fs");

const port = cfg.ui.port || 8889;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "pdf")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  let index_file = cfg.index || "/public/index.html";

  let fname = __dirname + index_file;
  fs.readFile(fname, (err, data) => {
    if (err) {
      cfg.debug || console.log(`Error reading file ${fname}`);
    } else {
      cfg.debug || console.log(data);
      res.write(data);
    }
    res.end();
  });
});

app.get("/pdf", function(req, res) {
  let pdf_file = cfg.index || "/pdf/pdf-report.pdf";

  let fname = __dirname + pdf_file;
  cfg.debug > 4 && console.log(`/pdf: ${fname}`);
  fs.readFile(fname, (err, data) => {
    if (err) {
      cfg.debug > 4 && console.log(`/pdf: Error: ${err}`);
      res.writeHead(404);
      res.write(`<H1>Error!</H1><hr><br>`);
      res.end(`<p>We could not find the file ${fname}!</p>`);
    } else {
      cfg.debug > 4 &&
        console.log(`/pdf: Read OK - render: ${fname} as application/pdf`);
      res.contentType("application/pdf");
      // res.writeHead(201);
      res.send(data);
      // res.end();
    }
  });
});
app.post("/api", (req, res) => {
  cfg.debug > 4 && console.log(req.body);
  let myCSV = Object.keys(req.body) + "\n";
  myCSV += csv.convert([req.body]);
  if (myCSV) {
    console.log(`CSV: ${myCSV}`);
    res.write(
      JSON.stringify({
        result: "OK",
        data: myCSV.length,
        response: "bytes of data written"
      })
    );
    // res.writeHead(200);
    res.end();
  } else {
    res.writeHead(204); // No content
  }
});

app.get("/api", (req, res) => {
  var ourRequest = new XMLHttpRequest();
  let url = cfg.server.url || "http://localhost:8889/api";
  cfg.debug && console.log("Request URL:", url);

  if (req.body) {
    console.log(`/get: res.body.keys = ${Object.keys(req.body)}`);
  } else {
    console.log(`/get: NO res.body!`);
  }

  ourRequest.open("GET", url, true);

  // Request 'loaded' handler (SUCCESS) - should have data returned.
  //
  ourRequest.onload = ev => {
    if (ourRequest.status >= 200 && ourRequest.status < 400) {
      // cfg.debug && console.log("Response = ", ourRequest.responseText);
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
