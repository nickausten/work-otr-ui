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

//  r e n d e r H T M L ( )
//
renderHTML = data => {
  var htmlString =
    "<table id='my-table' ><thead><th>Num</th><th>Train ID</th><th>Origin</th><th>Date</th><th>Type</th><th>Class</th><th>Events</th><th>Arr avg</th><th>Dep avg</th></thead><tbody>";

  if (data.length === 0) {
  } else {
    data.forEach((item, idx) => {
      let parts = item.journeyId.split("/");
      htmlString +=
        `<tr><td>${idx}</td><td>${parts[0]}</td><td>${parts[1]}</td><td>${
          parts[2]
        }</td><td>${item.service}</td><td>${item.category}</td>` +
        `<td>${item.eventCount}</td><td>${item.arr.avg}</td><td>${
          item.dep.avg
        }</td>` +
        `</tr>`;
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
