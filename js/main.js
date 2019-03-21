// Loction in template where we want to render results:

var errorLocation = document.getElementById("myerror");

// This is the handle of our "Get" button
var btn = document.getElementById("get-btn");

console.log("Started ...");

// Configure 'toastr' notification system
toastr.options.progressBar = true;
toastr.options.timeOut = 3000; // How long the toast will display without user interaction
toastr.options.extendedTimeOut = 6000; // How long the toast will display after a user hovers over it
toastr.options.closeMethod = "fadeOut";
toastr.options.closeDuration = 0;
toastr.options.closeEasing = "swing";
toastr.options.showMethod = "slideDown";
toastr.options.hideMethod = "slideUp";
toastr.options.closeMethod = "slideUp";

$(document).ready(function() {
  $(".timepicker").timepicker();
  var elems = document.querySelectorAll(".datepicker");
  var options = {
    format: "dd/mm/yyyy",
    showDaysInNextAndPreviousMonths: true,
    autoClose: true
  };
  var instances = M.Datepicker.init(elems, options);
});

document.addEventListener("DOMContentLoaded", function() {});

// Action - on clicking Get button
btn.addEventListener("click", function() {
  console.log("Get clicked ... ");
  //errorLocation.innerHTML = "<p>Waiting for connection...</p>";
  document.myToastr = toastr.info("Searching for data ...");

  var ourRequest = new XMLHttpRequest();
  ourRequest.open(
    "GET",
    //"http://localhost:34010/rest/services/info/getActualTrains?from=01012017000000&to=31122020235959"
    // "http://102.32.45.88:34010/rest/services/info/getActualTrains?from=01012017000000&to=31122020235959"
    "http://dummy.restapiexample.com/api/v1/employees"
  );

  //
  // Set 'loaded' handler (SUCCESS) - should have data returned.
  //
  //ourRequest.open('GET', 'https://reqres.in/api/users1.json');
  ourRequest.onload = () => {
    console.log("Got response ... ");
    // toastr.forEach(t => {
    //   t.clear();
    // });
    toastr.clear();
    toastr.success("Done!");
    if (ourRequest.status >= 200 && ourRequest.status < 400) {
      console.log("Response = ", ourRequest.responseText);

      var ourData = JSON.parse(ourRequest.responseText);
      errorLocation.innerHTML = "<br />";
      renderHTML(ourData);
    } else {
      console.log("We connected to the server, but it returned an error.");
    }
  };

  //
  // Set 'error' handler
  //
  ourRequest.onerror = ev => {
    var msg = "Connection error...";
    console.log(msg);
    toastr.error(msg);

    // Maybe we should render the error on the web page ....
    var htmlString = `<h3 id='errmsg'>${msg}</h3><br><hl>`;

    errorLocation.innerHTML = htmlString;
    ourRequest.close();
  };

  //
  // Set 'close' handler
  //
  ourRequest.close = ev => {
    var myErrMsg = "[Some error message]";
    console.log("Connection error. On close ...  Event code = " + myErrMsg);

    // Maybe we should render the error on the web page ....
    var htmlString = `<h3>On clode: ${myErrMsg}</h3><br><hl>`;

    errorLocation.innerHTML = htmlString;
  };

  ourRequest.send();
});
// End of addEventListener(click)

//-----------------------------------------------------------------------------
//  r e n d e r H T M L ( )
//-----------------------------------------------------------------------------
renderHTML = function(data) {
  console.log(data);
  var htmlString =
    "<table id='myTable' ><thead><th>ID</th><td>Name</th><th>Number</th><th>Age</th><th>Other</th></thead><tbody>";

  if (data.lenght === 0) {
  } else {
    data.forEach(
      (item, idx) =>
        (htmlString += `<tr><td>[${idx}]</td><td>${
          item.employee_name
        }</td><td>${item.employee_age}</td></tr>`)
    );
  }
  htmlString += "</tbody></table>";
  //     +
  //     `<div class="col-md-12 center text-center">
  //   <span class="left" id="total_reg"></span>
  //       <ul class="pagination pager" id="myPager"></ul>
  //     </div>`

  //placeholder.innerHTML = htmlString;
  document.getElementById("mydata").innerHTML = htmlString;

  //   $("#myTable").smpSortableTable(data, 10, "en", {
  //     responsive: true
  //   });
  $("#myTable").smpSortableTable(data, 10);
};

function RefreshTable() {
  $("#myTable").load("index.html #myTable");
}
// End: btn.addEventListener()
