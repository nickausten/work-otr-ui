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

// Get button 'click' handler
//
$("#get-btn").on("click", () => {
  toastr.info("Searching for data ...");

  var ourRequest = new XMLHttpRequest();
  let url = "http://localhost:8899/api";
  //let url = cfg.server.url || "http://localhost:8888/api";
  //cfg.debug && console.log("Request URL:", url);
  console.log("Request URL:", url);
  ourRequest.open("GET", url, true);

  // Request 'loaded' handler (SUCCESS) - should have data returned.
  //
  ourRequest.onload = ev => {
    toastr.clear();
    toastr.success("Done!");
    if (ourRequest.status >= 200 && ourRequest.status < 400) {
      //cfg.debug && console.log("Response = ", ourRequest.responseText);
      console.log("Response = ", ourRequest.responseText);
      renderHTML(JSON.parse(ourRequest.responseText));
    } else {
      console.log("We connected to the server, but it returned an error.");
    }
  };

  // Request 'error' handler
  //
  ourRequest.onerror = ev => {
    var msg = `Connection error...${ev}`;
    console.log(msg);
    toastr.error(msg);
    ourRequest.close();
  };

  // Request 'close' handler
  //
  ourRequest.close = ev => {
    var msg = `Data connection closed ${ev}`;
    console.log(msg);
    toastr.warning(msg);
  };

  ourRequest.send();
});
// End of addEventListener(click)

//  r e n d e r H T M L ( )
//
renderHTML = data => {
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
  document.getElementById("mydata").innerHTML = htmlString;
  $("#myTable").smpSortableTable(data, 10);
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
