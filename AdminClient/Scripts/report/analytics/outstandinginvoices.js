var table;
var sumCols = {};
$(function () {
    CreateBreadcrumb([{ href: "/Reports/Reports", title: "Reports" }])
    $("#formReport #LocationID").InStallSelect2('/Home/LoadSelect2ForLocation', 100, 'All Location', null, null, null, null, null, null, null, false);
    var loadTable = function () {
        table = $("#table").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
        }, "/Reports/GetDataTableOutstandingInvoices", [
       {
           "data": "InvoiceNo", "name": "InvoiceNo", "width": "10%", "class": "text-left"
       },
        {
            "data": "LocationName", "name": "LocationName", "width": "15%", "class": "text-left"
        },
        {
            "data": "InvoiceStatus", "name": "InvoiceStatus", "class": "text-center", "width": "10%", "render": function (data, type, row) {
                return Window.ResourcesEnum[data];
            }
        },
       {
           "data": "InvoiceDate", "name": "InvoiceDate", "class": "text-center", "width": "15%", "render": function (data, type, row) {
               return moment(data).format(Window.FormatDateWithDayOfWeekJS);
           }
       },

       {
           "data": "DueDate", "name": "DueDate", "class": "text-center", "width": "15%", "render": function (data, type, row) {
               return moment(data).format(Window.FormatDateWithDayOfWeekJS);
           }
       },
       {
           "data": "OverDue", "name": "OverDue", "width": "10%", "class": "text-left"
       },
       {
           "data": "ClientName", "name": "ClientName", "width": "10%", "class": "text-left"
       },
        {
            "data": "TotalWithTip", "name": "TotalWithTip", "class": "text-right", "width": "7%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
            }
        },
         {
             "data": "AmountDue", "name": "AmountDue", "class": "text-right", "width": "8%", "render": function (data, type, row) {
                 return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
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
                        html += "<td class='text-right'><strong>" + ($.number(sum, Window.NumberDecimal, '.', ',')) + "</strong></td>";
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
            sheetName: "Outstangding Invoices",
            title: null,
            filename: "Outstangding Invoices",
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
                var arrayColWidth = [10, 20, 10, 20, 20, 15, 15, 15, 15];
                //#region fill data header

                rowPos = functions.AddRow(["Invoice #", "Location", "Status", "Invoice Date", "Due Date", "OverDue", "Customer", "Gross Total", "Amount Due"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion
                //#region fill data to excel
                var sTotalWithTip = 0;
                var sAmountDue = 0;
                $.each(table.rows().data(), function () {
                    var InvoiceNo = this.InvoiceNo;
                    var LocationName = this.LocationName;
                    var InvoiceStatus = (Window.ResourcesEnum[this.InvoiceStatus]);
                    var InvoiceDate = moment(this.InvoiceDate).format(Window.FormatDateWithDayOfWeekJS);
                    var DueDate = moment(this.DueDate).format(Window.FormatDateWithDayOfWeekJS);
                    var OverDue = this.OverDue;
                    var ClientName = this.ClientName;
                    var TotalWithTip = $.number(this.TotalWithTip, Window.NumberDecimal, '.', ',');
                    var AmountDue = $.number(this.AmountDue, Window.NumberDecimal, '.', ',');

                    sTotalWithTip = sTotalWithTip + parseFloat(this.TotalWithTip);
                    sAmountDue = sAmountDue + parseFloat(this.TotalWithTip);
                    rowPos = functions.AddRow([InvoiceNo, LocationName, InvoiceStatus, InvoiceDate, DueDate, OverDue, ClientName, TotalWithTip, AmountDue], rowPos);
                })
                rowPos = functions.AddRow(["Total", "", "", "", "", "", "", sTotalWithTip, sAmountDue], rowPos);

                //#endregion

                // Set column widths
                var cols = functions.CreateCellPos(rels, 'cols');
                $('worksheet', rels).prepend(cols);

                for (var i = 0, ien = 9; i < ien ; i++) {
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
            filename: "Outstanding Invoices",
            customize: function (output, config) {
                output = ' Invoice#, Location, Status,Invoice Date, Due Date, Overdue, Customer, Gross Total, Amount Due\n';
                var sTotalWithTip = 0;
                var sAmountDue = 0;
                $.each(table.rows().data(), function () {
                    var InvoiceNo = this.InvoiceNo;
                    var LocationName = this.LocationName;
                    var InvoiceStatus = (Window.ResourcesEnum[this.InvoiceStatus]);
                    var InvoiceDate = moment(this.InvoiceDate).format(Window.FormatDateWithDayOfWeekJS);
                    var DueDate = moment(this.DueDate).format(Window.FormatDateWithDayOfWeekJS);
                    var OverDue = this.OverDue;
                    var ClientName = this.ClientName;
                    var TotalWithTip = $.number(this.TotalWithTip, Window.NumberDecimal, '.', ',');
                    var AmountDue = $.number(this.AmountDue, Window.NumberDecimal, '.', ',');

                    sTotalWithTip = sTotalWithTip + parseFloat(this.TotalWithTip);
                    sAmountDue = sAmountDue + parseFloat(this.AmountDue);
                    output += '"' + InvoiceNo + '",'
                            + '"' + LocationName + '",'
                            + '"' + InvoiceStatus + '",'
                            + '"' + InvoiceDate + '",'
                            + '"' + DueDate + '",'
                            + '"' + OverDue + '",'
                            + '"' + ClientName + '",'
                            + '"' + TotalWithTip + '",'
                            + '"' + AmountDue + '"\n';
                })
                output += '"' + "Total" + '",'
                        + '"' + "" + '",'
                        + '"' + "" + '",'
                        + '"' + "" + '",'
                        + '"' + "" + '",'
                        + '"' + "" + '",'
                        + '"' + "" + '",'
                        + '"' + sTotalWithTip + '",'
                        + '"' + sAmountDue + '"\n';


                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCSV');

    }
    var loaddata = function () {
        if ($.fn.DataTable.isDataTable('#table'))
            table.destroy();
        loadTable();

        var text2 = "";
        var locationid = $("#formReport #LocationID").val();
        if (locationid == null || locationid == "" || locationid == "0") {
            text2 += "All locations";
        }
        else {
            text2 += $("#formReport #LocationID").text();
        }

        text2 = text2 + ", generated " + moment().tz(Window.TimeZone).format(Window.FormatDateWithDayOfWeekJS) + " at " + moment().tz(Window.TimeZone).format(Window.FormatTimeJS);
        $("#txtfilter").text(text2);
    }
    loaddata();
    $("#formReport #btnView").click(function () {
        loaddata();
    })
})