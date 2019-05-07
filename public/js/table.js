processTable = function(mytable, perPage) {
  let mytag = "#" + mytable;
  $(mytag).after('<div id="nav"></div>');
  var rowsShown = perPage;
  var rowsTotal = $(mytag + " tbody tr").length;
  var numPages = rowsTotal / rowsShown;
  for (i = 0; i < numPages; i++) {
    var pageNum = i + 1;
    $("#nav").append('<a href="#" rel="' + i + '">' + pageNum + "</a> ");
  }
  $(mytag + " tbody tr").hide();
  $(mytag + " tbody tr")
    .slice(0, rowsShown)
    .show();
  $("#nav a:first").addClass("active");
  $("#nav a").bind("click", function() {
    $("#nav a").removeClass("active");
    $(this).addClass("active");
    var currPage = $(this).attr("rel");
    var startItem = currPage * rowsShown;
    var endItem = startItem + rowsShown;
    $(mytag + " tbody tr")
      .css("opacity", "0.0")
      .hide()
      .slice(startItem, endItem)
      .css("display", "table-row")
      .animate({ opacity: 1 }, 300);
  });
  $("#export-btn").bind("click", function() {
    console.log("Export button clicked");

    // Collect data from form
    my_query = {
      from_date: normaliseDate($("#from_date").val()),
      to_date: normaliseDate($("#to_date").val()),
      train_id: normaliseDate($("#train_id").val())
    };

    let url = cfg.ui.url || "http://localhost:8899/api";
    cfg.debug > 4 && console.log("Export post URL:", url, "query:", my_query);

    let my_resp = $.post(url, my_query).done(function(data) {
      if (console && console.log) {
        console.log("EXPORT: Ajax result = ", data);
      }
    });
    cfg.debug > 4 && console.log("Ajax post returned:", my_resp);
  });

  $("#pdf-btn").bind("click", function() {
    console.log("PDF button clicked");
    pdfFromHTML("pdf-table*");
  }); // Collect data from form
};
