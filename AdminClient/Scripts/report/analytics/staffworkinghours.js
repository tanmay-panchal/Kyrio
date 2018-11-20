var table;
var sumCols = {};
$(function () {
    CreateBreadcrumb([{ href: "/Reports/Reports", title: "Reports" }])
    var GetTextDuration = function (duration) {
        var minutesTotal = duration / 60;
        var hour = parseInt(minutesTotal / 60);
        var minutes = (minutesTotal % 60);
        return (hour > 0 ? hour + " h " : "") + (minutes > 0 ? minutes + " min" : "");
    }

    $("#searchDate").daterangepicker({
        startDate: moment().tz(Window.TimeZone).startOf('month'),
        endDate: moment().tz(Window.TimeZone),
        ranges: {
            'Today': [moment().tz(Window.TimeZone), moment().tz(Window.TimeZone)],
            'Yesterday': [moment().tz(Window.TimeZone).subtract(1, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')],
            'Last 7 Days': [moment().tz(Window.TimeZone).subtract(7, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')],
            'This month': [moment().tz(Window.TimeZone).startOf('month'), moment().tz(Window.TimeZone)],
            'Last 30 Days': [moment().tz(Window.TimeZone).subtract(30, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')],
            'Tomorrow': [moment().tz(Window.TimeZone).add(1, 'days'), moment().tz(Window.TimeZone).add(1, 'days')],
            'Next 7 Days': [moment().tz(Window.TimeZone).add(1, 'days'), moment().tz(Window.TimeZone).add(7, 'days')],
            'Next Month': [moment().tz(Window.TimeZone).add(1, 'month').startOf('month'), moment().tz(Window.TimeZone).add(1, 'month').endOf('month')],
            'Next 30 Days': [moment().tz(Window.TimeZone).add(1, 'days'), moment().tz(Window.TimeZone).add(30, 'days')],
        },
        locale: {
            "format": Window.FormatDateJS
        }
    });
    $("#formReport #LocationID").InStallSelect2('/Home/LoadSelect2ForLocation', 100, '', null, null, null, null, null, null, null, false);
    $("#formReport #StaffID").InStallSelect2('/Home/LoadSelect2ForUser', 100, 'All Staff', null, null, null, null, null, null, null, false);
    var loadTable = function () {
        table = $("#table").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableStaffWorkingHours", [
      {
          "data": "Date", "name": "Date", "class": "text-left", "width": "15%", "render": function (data, type, row) {
              return row.Bold == 1 ? ('<div style ="font-weight: bold;">' + row.FullName + '</div>') : moment(data).format(Window.FormatDateWithDayOfWeekJS);
          }
      },
      {
         "data": "StartTime", "name": "StartTime", "class": "text-left", "width": "15%", "render": function (data, type, row) {
             return row.Bold == 1 ? ('<div style ="font-weight: bold;">' + '</div>') : data == null ? "Not working" : moment(data).format(Window.FormatTimeJS);
         }
     },
      {
          "data": "EndTime", "name": "EndTime", "class": "text-left", "width": "15%", "render": function (data, type, row) {
              return row.Bold == 1 ? ('<div style ="font-weight: bold;">' + '</div>') : data == null ? "Not working" : moment(data).format(Window.FormatTimeJS);
          }
      },
      {
           "data": "Duration", "name": "Duration", "width": "15%", "class": "text-left", "render": function (data, type, row) {
               return row.Bold == 1 ? ('<div style ="font-weight: bold;">' + GetTextDuration(row.TotalWorkMinute) + '</div>') : GetTextDuration(row.WorkMinute);
           }
       },

        ], true, false, false, false, null, true, null);

        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file-excel-o"></i>  Excel',
            extend: 'excelHtml5',
            isAutoWidth: true,
            sheetName: "Staff Working Hours",
            title: "Staff Working Hours",
            filename: "Staff Working Hours",
        }, '#buttonExcel');
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i>  CSV',
            filename: "Staff Working Hours",
            extend: 'csvHtml5',
        }, '#buttonCSV');
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i> PDF',
            title: "Staff Working Hours",
            filename: "Staff Working Hours",
            extend: 'pdfHtml5',
            download: "open",
        }, '#buttonPDF');
    }

    var loaddata = function () {
        if ($.fn.DataTable.isDataTable('#table'))
            table.destroy();

        loadTable();

        var text2 = "";
        text2 += $("#formReport #searchDate").data('daterangepicker').startDate.format(Window.FormatDateWithDayOfWeekJS)
        text2 += " to " + $("#formReport #searchDate").data('daterangepicker').endDate.format(Window.FormatDateWithDayOfWeekJS)
        var StaffID = $("#formReport #StaffID").val();
        if (StaffID == null || StaffID == "" || StaffID == "0") {
            text2 += ", all staff";
        }
        else {
            text2 += ", " + $("#formReport #StaffID").text();
        }

        var locationid = $("#formReport #LocationID").val();
        if (locationid == null || locationid == "" || locationid == "0") {
            text2 += ", all locations";
        }
        else {
            text2 += ", " + $("#formReport #LocationID").text();
        }

        text2 = text2 + ", generated " + moment().tz(Window.TimeZone).format(Window.FormatDateWithDayOfWeekJS) + " at " + moment().tz(Window.TimeZone).format(Window.FormatTimeJS);
        $("#txtfilter").text(text2);
    }
    loaddata();
    $("#formReport #btnView").click(function () {
        loaddata();
    })
})