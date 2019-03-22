// This is the handle of our "Get" button
console.log("Started ...");

$(document).ready(function() {
  toasterConfig();

  $(".timepicker").timepicker({
    default: "now",
    twelveHour: false, // change to 12 hour AM/PM clock from 24 hour
    format: "HH:ss",
    autoclose: false
  });
  // $(".timepicker").timepicker();
  // M.Datepicker.init($(".datepicker"), {
  $(".datepicker").datepicker({
    format: "dd/mm/yyyy",
    showDaysInNextAndPreviousMonths: true,
    autoClose: true
  });
});

// Get button 'click' handler
$("#get-btn").on("click", () => {
  console.log("Get clicked ... ");
  toastr.info("Searching for data ...");
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
    toastr.clear();
    toastr.success("Done!");
    if (ourRequest.status >= 200 && ourRequest.status < 400) {
      console.log("Response = ", ourRequest.responseText);

      var ourData = JSON.parse(ourRequest.responseText);
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
    ourRequest.close();
  };

  //
  // Set 'close' handler
  //
  ourRequest.close = ev => {
    var msg = "Data connection closed";
    console.log(msg);
    toastr.warning(msg);
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

// End: btn.addEventListener()

//-----------------------------------------------------------------------------
//  Miscellaneous functions
//-----------------------------------------------------------------------------

// Configure 'toastr' notification system
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
