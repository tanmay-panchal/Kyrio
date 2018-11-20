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
            'Last 30 Days': [moment().tz(Window.TimeZone).subtract(30, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')],
            'Last 90 Days': [moment().tz(Window.TimeZone).subtract(90, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')],
            'Last Month': [moment().tz(Window.TimeZone).subtract(1, 'month').startOf('month'), moment().tz(Window.TimeZone).subtract(1, 'month').endOf('month')],
            'Last Year': [moment().tz(Window.TimeZone).subtract(1, 'years').startOf('years'), moment().tz(Window.TimeZone).subtract(1, 'years').endOf('years')],
            'Week to date': [moment().tz(Window.TimeZone).startOf('weeks'), moment().tz(Window.TimeZone)],
            'Month to date': [moment().tz(Window.TimeZone).startOf('month'), moment().tz(Window.TimeZone)],
            'Quarter to date': [moment().tz(Window.TimeZone).startOf('quarters'), moment().tz(Window.TimeZone)],
            'Year to date': [moment().tz(Window.TimeZone).startOf('years'), moment().tz(Window.TimeZone)],
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
        }, "/Reports/GetDataTableVouchersOutstanding", [
      {
          "data": "Date", "name": "Date", "class": "text-left", "width": "15%", "render": function (data, type, row) {
            return moment(data).format(Window.FormatDateWithTimeJS);
        }
      },
      {
          "data": "OpeningBalance", "name": "OpeningBalance", "class": "text-right", "width": "10%", "render": function (data, type, row) {
              return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
          }
      },
      {
          "data": "IssuedValue", "name": "IssuedValue", "class": "text-right", "width": "10%", "render": function (data, type, row) {
              return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
          }
      },
      {
          "data": "SoldValue", "name": "SoldValue", "class": "text-right", "width": "10%", "render": function (data, type, row) {
              return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
          }
      },
      {
          "data": "ExpiredValue", "name": "ExpiredValue", "class": "text-right", "width": "10%", "render": function (data, type, row) {
              return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
          }
      },
      {
          "data": "RedeemedValue", "name": "RedeemedValue", "class": "text-right", "width": "10%", "render": function (data, type, row) {
              return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
          }
      },
      {
          "data": "RefundedValue", "name": "RefundedValue", "class": "text-right", "width": "10%", "render": function (data, type, row) {
              return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
          }
      },
      {
          "data": "ClosingBalance", "name": "ClosingBalance", "class": "text-right", "width": "10%", "render": function (data, type, row) {
              return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
          }
      },
      {
          "data": "NetChange", "name": "NetChange", "class": "text-right", "width": "10%", "render": function (data, type, row) {
              return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
          }
      },

        ], true, false, false, false, null, true, null);
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file-excel-o"></i>  Excel',
            extend: 'excelHtml5',
            isAutoWidth: true,
            sheetName: "Vouchers Outstanding Balance",
            title: "Vouchers Outstanding Balance",
            filename: "Vouchers Outstanding Balance",
        }, '#buttonExcel');
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i>  CSV',
            filename: "Vouchers Outstanding Balance",
            extend: 'csvHtml5',
        }, '#buttonCSV');
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i> PDF',
            title: "Vouchers Outstanding Balance",
            filename: "Vouchers Outstanding Balance",
            extend: 'pdfHtml5',
            download: "open",
        }, '#buttonPDF');
    }

    var loaddata = function () {
        if ($.fn.DataTable.isDataTable('#table'))
            table.destroy();
        loadTable();
    }
    loaddata();
    $("#formReport #btnView").click(function () {
        loaddata();
    })
})