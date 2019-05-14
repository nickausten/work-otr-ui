// Doc ready handler
//
$(document).ready(function() {
  toasterConfig();
  console.log("main.js: Loaded!");
  $(".timepicker").timepicker({
    default: "now",
    twelveHour: false,
    format: "HH:ss",
    autoclose: false
  });
  // $(".timepicker").timepicker();
  $(".datepicker").datepicker({
    format: "dd/mm/yyyy",
    showDaysInNextAndPreviousMonths: true,
    autoClose: true
  });
});

normaliseDate = function(inputDate, separator = "/") {
  dateArray = inputDate.split(separator);
  return dateArray.join("");
};
// Get button 'click' handler
//
$("#get-btn").on("click", () => {
  toastr.info("Searching for data ...");

  let url = cfg.data.url || "http://localhost:8889/api";
  my_query = {
    from_date: normaliseDate($("#from_date").val()),
    to_date: normaliseDate($("#to_date").val()),
    train_id: normaliseDate($("#train_id").val())
  };

  cfg.debug > 2 && console.log("Request URL:", url);

  $.get(url, my_query)
    .done(respData => {
      toastr.clear();
      toastr.success("Done!");
      cfg.debug > 8 && console.log("Response = ", respData);
      renderHTML(respData);
    })
    .fail(ev => {
      var msg = `Connection error...${ev}`;
      console.log(msg);
      toastr.error(msg);
    });
});
// End of addEventListener(click)

processStats = journeyStats => {
  let data = [];
  let buckets = [
    { "0": 0 },
    { "1": 0 },
    { "11": 0 },
    { "16": 0 },
    { "31": 0 },
    { "45": 0 }
  ];
  console.log("processStats----------------------------");

  let arrDelays = [];
  let depDelays = [];
  journeyStats.buckets // Arrivals
    .slice()
    .reverse()
    .forEach((item, idx) => {
      // Find the bucket for this delay
      if (delay >= item["45"]) {
        arrDelays["45"]++;
      } else if (delay >= item["31"]) {
        arrDelays["31"]++;
      } else if (delay >= item["16"]) {
        arrDelays["16"]++;
      } else if (delay >= item["11"]) {
        arrDelays["11"]++;
      } else if (delay >= item["1"]) {
        arrDelays["1"]++;
      } else arrDelays["0"]++;
    });
  console.log("RESULT(arrDelays): ", arrDelays);
  arrDelays.push({});
  return data;
};

makeTableHeader = () => {
  let htmlString = `
    <table id='my-table'>
      <thead>
        <tr>
          <th rowspan="3">Train<br>No</th>
          <th rowspan="3">No of<br>Runs</th>
          <th colspan="6">Departure</th>
          <th colspan="6">Arrival</th>
        </tr>
        <tr>
          <td rowspan="2">On<br>Time</td>
          <td colspan="5">Delay in Minutes</td>
          <td rowspan="2">On<br>Time</td>
          <td colspan="5">Delay in Minutes</td>
        </tr>
        <tr>
          <td>1-10</td>
          <td>11-15</td>
          <td>16-30</td>
          <td>31-45</td>
          <td>>45</td>
          <td>1-10</td>
          <td>11-15</td>
          <td>16-30</td>
          <td>31-45</td>
          <td>>45</td>
        </tr>
      </thead>
    <tbody>`;
  // "<table id='my-table' ><thead><th>Num</th><th>Train ID</th><th>Origin</th><th>Date</th><th>Type</th><th>Class</th><th>Events</th><th>Atot</th><th>Aav</th><th>Amx</th><th>Dtot</th><th>Dav</th><th>Dmx</th></thead><tbody>";
  return htmlString;
};
//  r e n d e r H T M L ( )
//
renderHTML = data => {
  let htmlString = makeTableHeader();
  // "<table id='my-table' ><thead><th>Num</th><th>Train ID</th><th>Origin</th><th>Date</th><th>Type</th><th>Class</th><th>Events</th><th>Atot</th><th>Aav</th><th>Amx</th><th>Dtot</th><th>Dav</th><th>Dmx</th></thead><tbody>";

  if (data.length === 0) {
  } else {
    // Process arrival and depatrure delays - placing them into buckets...
    let buckets = [0, 1, 11, 16, 31, 46];

    // Render the dtaa
    data.forEach((item, idx) => {
      let arrBuckets = [];
      let depBuckets = [];

      let delay = item.arr.avg;
      buckets
        .slice()
        .reverse()
        .forEach((i, myIdx) => {
          arrBuckets[i] = 0;
          if (delay >= i) {
            arrBuckets[i]++;
          }
        });
      console.log("arrBuckets", arrBuckets);

      delay = item.dep.avg;
      buckets
        .slice()
        .reverse()
        .forEach((i, myIdx) => {
          depBuckets[i] = 0;
          if (delay >= i) {
            depBuckets[i]++;
          }
        });
      console.log("depBuckets", depBuckets);

      let parts = item.journeyId.split("/");
      htmlString += `<tr>
          <td>${parts[0]}</td>
          <td>${item.eventCount}</td>
          <td>${depBuckets[0]}</td>
          <td>${depBuckets[1]}</td>
          <td>${depBuckets[11]}</td>
          <td>${depBuckets[16]}</td>
          <td>${depBuckets[31]}</td>
          <td>${depBuckets[46]}</td>
          <td>${arrBuckets[0]}</td>
          <td>${arrBuckets[1]}</td>
          <td>${arrBuckets[11]}</td>
          <td>${arrBuckets[16]}</td>
          <td>${arrBuckets[31]}</td>
          <td>${arrBuckets[46]}</td>
          </tr>`;
    });
  }
  htmlString += "</tbody></table>";

  // Now paginate the table
  document.getElementById("my-table").innerHTML = htmlString;
  processTable("my-table", 30);
};
// End: btn.addEventListener()

//-----------------------------------------------------------------------------
//  Miscellaneous functions
//-----------------------------------------------------------------------------

toasterConfig = () => {
  toastr.options.progressBar = true;
  toastr.options.timeOut = 3000; // How long the toast will display without user interaction
  toastr.options.extendedTimeOut = 6000; // How long the toast will display after a user hovers over it
  toastr.options.closeMethod = "fadeOut";
  toastr.options.closeDuration = 0;
  toastr.options.closeEasing = "swing";
  toastr.options.showMethod = "slideDown";
  toastr.options.hideMethod = "slideUp";
  toastr.options.closeMethod = "slideUp";
};
