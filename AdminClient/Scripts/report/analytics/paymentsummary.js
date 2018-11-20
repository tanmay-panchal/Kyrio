var table;
var sumCols = {};
$(function () {
    CreateBreadcrumb([{ href: "/Reports/Reports", title: "Reports" }])

    $("#searchDate").daterangepicker({
        startDate: moment().tz(Window.TimeZone),
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
        }, "/Reports/GetDataTablePaymentsSummary", [
      {
          "data": "PaymentTypeName", "name": "PaymentTypeName", "width": "20%", "class": "text-left"
      },
      {
          "data": "Transactions", "name": "Transactions", "class": "text-right", "width": "20%", "render": function (data, type, row) {
              return ($.number(data,"", '.', ','));;
          }
      },
     {
         "data": "GrossPayments", "name": "GrossPayments", "class": "text-right", "width": "20%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
         }
     },
     {
         "data": "Refunds", "name": "Refunds", "class": "text-right", "width": "20%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
         }
     },
     {
         "data": "NetPayments", "name": "NetPayments", "class": "text-right", "width": "20%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
         }
     },
        ], true, false, false, false, null, true, null, function (setting) {
            var api = this.api();
            if (api.rows().data().count() > 0) {
                var length = api.columns()[0].length;
                var html = "<tr><td class='text-center'><strong>Total</strong></td>";
                for (i = 1; i < length; ++i) {
                    var sum = this.api().column(i).data().sum();
                    sumCols[i] = sum;
                    if (i == 1) {
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
            sheetName: "Payments Summary",
            title: null,
            filename: "Payments Summary",
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
                var arrayColWidth = [20, 15, 15, 15, 15];
                //#region fill data header

                rowPos = functions.AddRow(["Payment", "Transactions", "Gross Payments", "Refunds", "Net Payments"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion
                debugger;
                //#region fill data to excel
                var sTransactions = 0;
                var sGrossPayments = 0;
                var sRefunds = 0;
                var sNetPayments = 0;

                $.each(table.rows().data(), function () {
                    var PaymentTypeName = this.PaymentTypeName;
                    var Transactions = $.number(this.Transactions, '', '.', ',');
                    var GrossPayments = $.number(this.GrossPayments, Window.NumberDecimal, '.', ',');
                    var Refunds = $.number(this.Refunds, Window.NumberDecimal, '.', ',');
                    var NetPayments = $.number(this.NetPayments, Window.NumberDecimal, '.', ',');

                    sTransactions = sTransactions + parseInt(this.Transactions);
                    sGrossPayments = sGrossPayments + parseFloat(this.GrossPayments);
                    sRefunds = sRefunds + parseFloat(this.Refunds);
                    sNetPayments = sNetPayments + parseFloat(this.NetPayments);
                    rowPos = functions.AddRow([PaymentTypeName,Transactions,GrossPayments,Refunds,NetPayments], rowPos);
                })
                rowPos = functions.AddRow(["Total", sTransactions, $.number(sGrossPayments, Window.NumberDecimal, '.', ','), $.number(sRefunds, Window.NumberDecimal, '.', ','), $.number(sNetPayments, Window.NumberDecimal, '.', ',')], rowPos);

                //#endregion

                // Set column widths
                var cols = functions.CreateCellPos(rels, 'cols');
                $('worksheet', rels).prepend(cols);

                for (var i = 0, ien = 5 ; i < ien ; i++) {
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
            filename: "Payments Summary",
            customize: function (output, config) {
                output = ' Payment, Transactions, Gross Payments, Refunds, Net Payments\n';

                var sTransactions = 0;
                var sGrossPayments = 0;
                var sRefunds = 0;
                var sNetPayments = 0;
                $.each(table.rows().data(), function () {
                    var PaymentTypeName = this.PaymentTypeName;
                    var Transactions = $.number(this.Transactions, '', '.', ',');
                    var GrossPayments = $.number(this.GrossPayments, Window.NumberDecimal, '.', ',');
                    var Refunds = $.number(this.Refunds, Window.NumberDecimal, '.', ',');
                    var NetPayments = $.number(this.NetPayments, Window.NumberDecimal, '.', ',');

                    sTransactions = sTransactions + parseInt(this.Transactions);
                    sGrossPayments = sGrossPayments + parseFloat(this.GrossPayments);
                    sRefunds = sRefunds + parseFloat(this.Refunds);
                    sNetPayments = sNetPayments + parseFloat(this.NetPayments);
                   
                    output += '"' + PaymentTypeName + '",'
                            + '"' + Transactions + '",'
                            + '"' + GrossPayments + '",'
                            + '"' + Refunds + '",'
                            + '"' + NetPayments + '"\n';
                })
                output += '"' + "Total" + '",'
                            + '"' + sTransactions + '",'
                            + '"' + sGrossPayments + '",'
                            + '"' + sRefunds + '",'
                            + '"' + sNetPayments + '"\n';
                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCSV');
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i> PDF',
            title: "Payments Summary",
            filename: "Payments Summary",
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