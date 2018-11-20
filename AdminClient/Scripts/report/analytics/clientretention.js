var table;
$(function () {
    CreateBreadcrumb([{ href: "/Reports/Reports", title: "Reports" }])
    $("#searchDate").daterangepicker({
        startDate: moment().tz(Window.TimeZone).startOf('month'),
        endDate: moment().tz(Window.TimeZone),
        ranges: {
            'Today': [moment().tz(Window.TimeZone), moment().tz(Window.TimeZone)],
            'Yesterday': [moment().tz(Window.TimeZone).subtract(1, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')],
            'Last 7 Days': [moment().tz(Window.TimeZone).subtract(7, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')],
            'This month': [moment().tz(Window.TimeZone).startOf('month'), moment().tz(Window.TimeZone)],
            'Last 30 Days': [moment().tz(Window.TimeZone).subtract(30, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')],
            'All time': [moment('2018-01-01'), moment().tz(Window.TimeZone)]
        },
        locale: {
            "format": Window.FormatDateJS
        }
    });
    var loadTable = function () {
        table = $("#table").InStallDatatable({
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableClientRetention", [
       {
           "data": "ClientName", "name": "ClientName", "width": "15%", "class": "text-left"
       },
       {
           "data": "MobileNumber", "name": "MobileNumber", "width": "15%", "class": "text-left"
       },
       {
           "data": "Email", "name": "Email", "width": "15%", "class": "text-left"
       },
       {
           "data": "LastAppointment", "name": "LastAppointment", "class": "text-left", "width": "10%", "render": function (data, type, row) {
               return moment(data).format(Window.FormatDateJS);
           }
       },
       {
           "data": "DaysAbsent", "name": "DaysAbsent", "class": "text-right", "width": "5%", "render": function (data, type, row) {
               return ($.number(data, 0, '.', ','));
           }
       },
       {
           "data": "StaffName", "name": "StaffName", "width": "15%", "class": "text-left"
       },
       {
           "data": "LastVisitSales", "name": "LastVisitSales", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
           }
       },
       {
           "data": "TotalSales", "name": "TotalSales", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
           }
       },
        ], true, false, false, false, null, true, null);
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file-excel-o"></i>  Excel',
            extend: 'excelHtml5',
            isAutoWidth: true,
            sheetName: "Client Retention",
            title: "Client Retention",
            filename: "Client Retention",
        }, '#buttonExcel');
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i>  CSV',
            filename: "Client Retention",
            extend: 'csvHtml5',
        }, '#buttonCSV');
    }

    var loaddata = function () {
        if ($.fn.DataTable.isDataTable('#table'))
            table.destroy();
        loadTable();

        var text2 = "";
        text2 += $("#formReport #searchDate").data('daterangepicker').startDate.format(Window.FormatDateWithDayOfWeekJS)
        text2 += " to " + $("#formReport #searchDate").data('daterangepicker').endDate.format(Window.FormatDateWithDayOfWeekJS)

        text2 = "Customer absent since " + text2 + ", generated " + moment().tz(Window.TimeZone).format(Window.FormatDateWithDayOfWeekJS) + " at " + moment().tz(Window.TimeZone).format(Window.FormatTimeJS);
        $("#txtfilter").text(text2);
    }
    loaddata();
    $("#formReport #btnView").click(function () {
        loaddata();
    })
})