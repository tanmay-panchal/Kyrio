var table;
var sumCols = {};
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
    $("#formReport #LocationID").InStallSelect2('/Home/LoadSelect2ForLocation', 100, 'All Location', null, null, null, null, null, null, null, false);
    $("#formReport #StaffID").InStallSelect2('/Home/LoadSelect2ForUser', 100, 'All Staff', null, null, null, null, null, null, null, false);
    var loadTable = function () {
        table = $("#table").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
          
        }, "/Reports/GetDataTableVouchersSales", [
      {
         "data": "InvoiceDate", "name": "InvoiceDate", "class": "text-left", "width": "15%", "render": function (data, type, row) {
             return moment(data).format(Window.FormatDateWithTimeJS);
         }
     },
      {
          "data": "InvoiceNo", "name": "InvoiceNo", "width": "15%", "class": "text-left"
      },
      {
          "data": "ClientName", "name": "ClientName", "width": "15%", "class": "text-left"
      },
      {
          "data": "IssuedValue", "name": "IssuedValue", "class": "text-right", "width": "10%", "render": function (data, type, row) {
              return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
          }
      },
      {
          "data": "Discount", "name": "Discount", "class": "text-right", "width": "10%", "render": function (data, type, row) {
              return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
          }
      },
      {
          "data": "TotalSales", "name": "TotalSales", "class": "text-right", "width": "10%", "render": function (data, type, row) {
              return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
          }
      },
        ], true, false, false, false, null, true, null, function (setting) {
            var api = this.api();
            if (api.rows().data().count() > 0) {
                var length = api.columns()[0].length;
                var html = "<tr><td colspan='3'class='text-center'><strong>Total</strong></td>";
                for (i = 3; i < length; ++i) {
                    var sum = this.api().column(i).data().sum();
                    sumCols[i] = sum;
                    if (i == 3) {
                        html += "<td class='text-right'><strong>" + ($.number(sum, 0, '.', ',')) + "</strong></td>";
                    }
                    else {
                        html += "<td class='text-right'><strong>" + ($.number(sum, Window.NumberDecimal, '.', ',')) + "</strong></td>";
                    }

                }
                html += "</tr>";
                $(html).insertAfter($(this[0]).find("tr:last"));
            }
        });

        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file-excel-o"></i>  Excel',
            extend: 'excelHtml5',
            isAutoWidth: false,
            isSTT: false,
            sheetName: "Vouchers Sales",
            title: null,
            filename: "Vouchers Sales",
            ArrayColWidth: [25],
            exportOptions: {
                columns: [1],
                modifier: {
                    page: 'current'
                },
                orthogonal: "export",
                trim: false
            },
            methodCustomeAll: function (data, functions, rels, rowPos) {
                var arrayColWidth = [20, 15, 15, 15, 15, 15];
                //#region fill data header

                rowPos = functions.AddRow(["Date","Invoice no.","Customer","Issued Value","Discount","Total Sales"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion
                debugger;
                //#region fill data to excel
                var sIssuedValue = 0;
                var sDiscount = 0;
                var sTotalSales = 0;
                $.each(table.rows().data(), function () {
                    var Date = moment(this.Date).format(Window.FormatDateJS);
                    var InvoiceNo = this.InvoiceNo;
                    var ClientName = this.ClientName;
                    var IssuedValue = $.number(this.IssuedValue, Window.NumberDecimal, '.', ',');
                    var Discount = $.number(this.Discount, Window.NumberDecimal, '.', ',');
                    var TotalSales = $.number(this.TotalSales, Window.NumberDecimal, '.', ',');

                    sIssuedValue = sIssuedValue + parseFloat(this.IssuedValue);
                    sDiscount = sDiscount + parseFloat(this.Discount);
                    sTotalSales = sTotalSales + parseFloat(this.TotalSales);
                  
                    rowPos = functions.AddRow([Date,InvoiceNo,ClientName,IssuedValue,Discount,TotalSales], rowPos);
                })
                rowPos = functions.AddRow(["Total","","",sIssuedValue,sDiscount,sTotalSales], rowPos);
                //#endregion

                // Set column widths
                var cols = functions.CreateCellPos(rels, 'cols');
                $('worksheet', rels).prepend(cols);

                for (var i = 0, ien = 6 ; i < ien ; i++) {
                    cols.appendChild(functions.CreateCellPos(rels, 'col', {
                        attr: {
                            min: i + 1,
                            max: i + 1,
                            width: arrayColWidth[i],
                            customWidth: 1,
                        }
                    }));
                }

            },
        }, '#buttonExcel');
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i>  CSV',
            filename: "Vouchers Sales",
            customize: function (output, config) {
                output = ' Date, Invoice no., Customer , Issued Value, Discount,Total Sales\n';
                var sIssuedValue = 0;
                var sDiscount = 0;
                var sTotalSales = 0;
                $.each(table.rows().data(), function () {
                    var Date = moment(this.Date).format(Window.FormatDateJS);
                    var InvoiceNo = this.InvoiceNo;
                    var ClientName = this.ClientName;
                    var IssuedValue = $.number(this.IssuedValue, Window.NumberDecimal, '.', ',');
                    var Discount = $.number(this.Discount, Window.NumberDecimal, '.', ',');
                    var TotalSales = $.number(this.TotalSales, Window.NumberDecimal, '.', ',');

                    sIssuedValue = sIssuedValue + parseFloat(this.IssuedValue);
                    sDiscount = sDiscount + parseFloat(this.Discount);
                    sTotalSales = sTotalSales + parseFloat(this.TotalSales);

                    output += '"' + Date + '",'
                            + '"' + InvoiceNo + '",'
                            + '"' + ClientName + '",'
                            + '"' + IssuedValue + '",'
                            + '"' + Discount + '",'
                            + '"' + TotalSales + '"\n';
                })
                     output += '"' + "Total" + '",'
                            + '"' + "" + '",'
                            + '"' + "" + '",'
                            + '"' + sIssuedValue  + '",'
                            + '"' + sDiscount + '",'
                            + '"' + sTotalSales + '"\n';
                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCSV'); table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i> PDF',
            title: "Vouchers Sales",
            filename: "Vouchers Sales",
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