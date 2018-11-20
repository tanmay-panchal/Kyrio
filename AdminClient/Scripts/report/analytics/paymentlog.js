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
            "IncludeVoucher": $("#formReport #IncludeVoucher").val(),
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTablePaymentsLog", [
       {
           "data": "PaymentDate", "name": "PaymentDate", "class": "text-left", "width": "15%", "render": function (data, type, row) {
               return moment(data).format(Window.FormatDateWithTimeJS);
           }
       },
       {
           "data": "LocationName", "name": "LocationName", "width": "15%", "class": "text-left"
       },
       {
           "data": "InvoiceNo", "name": "InvoiceNo", "width": "5%", "class": "text-left"
       },
       {
           "data": "ClientName", "name": "ClientName", "width": "15%", "class": "text-left"
       },
       {
           "data": "Staff", "name": "Staff", "width": "15%", "class": "text-left"
       },
       {
           "data": "InvoiceType", "name": "InvoiceType", "class": "text-left", "width": "10%", "render": function (data, type, row) {
               return Window.ResourcesEnum[data];
           }
       },
       {
           "data": "PaymentTypeName", "name": "PaymentTypeName", "width": "15%", "class": "text-left"
       },
          {
              "data": "PaymentAmount", "name": "PaymentAmount", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                  return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
              }
          },

        ], true, false, false, false, null, true, null, function (setting) {
            var api = this.api();
            if (api.rows().data().count() > 0) {
                var length = api.columns()[0].length;
                var html = "<tr><td colspan='7' class='text-center'><strong>Total</strong></td>";
                for (i = 7; i < length; ++i) {
                    var sum = this.api().column(i).data().sum();
                    sumCols[i] = sum;
                    if (i == 7) {
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
            sheetName: "Payments log",
            title: null,
            filename: "Payments log",
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
                var arrayColWidth = [20, 20, 10, 20, 15, 15, 15, 15, 15, 15, 15];
                //#region fill data header

                rowPos = functions.AddRow(["Payment Date", "Payment No.", "Location", "Invoice Date", "Invoice No ", "Client", "ClientID", "Staff", "Transactions", "Method", "Amount"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion
                //#region fill data to excel

                $.each(table.rows().data(), function () {
                    var PaymentDate = moment(this.PaymentDate).format(Window.FormatDateWithTimeJS);
                    var PaymentNo = this.PaymentNo;
                    var LocationName = this.LocationName;
                    var InvoiceDate = moment(this.InvoiceDate).format(Window.FormatDateWithTimeJS);
                    var InvoiceNo = this.InvoiceNo;
                    var ClientName = this.ClientName;
                    var ClientID = this.ClientID;
                    var Staff = this.Staff;
                    var InvoiceType = (Window.ResourcesEnum[this.InvoiceType]);
                    var PaymentTypeName = this.PaymentTypeName;
                    var PaymentAmount = $.number(this.PaymentAmount, Window.NumberDecimal, '.', ',');
                    rowPos = functions.AddRow([PaymentDate, PaymentNo, LocationName, InvoiceDate, InvoiceNo, ClientName, ClientID, Staff, InvoiceType, PaymentTypeName, PaymentAmount], rowPos);
                })

                //#endregion

                // Set column widths
                var cols = functions.CreateCellPos(rels, 'cols');
                $('worksheet', rels).prepend(cols);

                for (var i = 0, ien = 11 ; i < ien ; i++) {
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
            filename: "Sales Log",
            customize: function (output, config) {
                output = ' Payment Date, Payment No., Location, Invoice Date, Invoice No, Client, ClientID, Staff, Transactions , Method, Amount\n';

                $.each(table.rows().data(), function () {

                    var PaymentDate = moment(this.PaymentDate).format(Window.FormatDateWithTimeJS);
                    var PaymentNo = this.PaymentNo;
                    var LocationName = this.LocationName;
                    var InvoiceDate = moment(this.InvoiceDate).format(Window.FormatDateWithTimeJS);
                    var InvoiceNo = this.InvoiceNo;
                    var ClientName = this.ClientName;
                    var ClientID = this.ClientID;
                    var Staff = this.Staff;
                    var InvoiceType = (Window.ResourcesEnum[this.InvoiceType]);
                    var PaymentTypeName = this.PaymentTypeName;
                    var PaymentAmount = $.number(this.PaymentAmount, Window.NumberDecimal, '.', ',');


                    output += '"' + PaymentDate + '",'
                            + '"' + PaymentNo + '",'
                            + '"' + LocationName + '",'
                            + '"' + InvoiceDate + '",'
                            + '"' + InvoiceNo + '",'
                            + '"' + ClientName + '",'
                            + '"' + ClientID + '",'
                            + '"' + Staff + '",'
                            + '"' + InvoiceType + '",'
                            + '"' + PaymentTypeName + '",'
                            + '"' + PaymentAmount + '"\n';
                })
                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCSV');
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i> PDF',
            title: "Payment Log",
            filename: "Payment Log",
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