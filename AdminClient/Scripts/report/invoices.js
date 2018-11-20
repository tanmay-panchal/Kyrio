//#region Method Support
//#endregion
var table1;
$(function () {
    //#region Load data && setup control
    $("#searchDate").daterangepicker({
        startDate: moment().tz(Window.TimeZone),
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
    $("#formInvoices #LocationID").InStallSelect2('/Home/LoadSelect2ForLocation', 100, 'All Location', null, null, null, null, null, null, null, false);
    var loadTable1 = function () {
        table1 = $("#table1").InStallDatatable({
            "LocationID": $("#formInvoices #LocationID").val(),
            "fromdate": $("#formInvoices #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formInvoices #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableInvoices", [
     {
         "data": "InvoiceNo", "name": "InvoiceNo", "width": "15%", "class": "text-left", "render": function (data, type, row) {
             return "<a id='linkInvoice' href='/Sale/Invoices?id=" + row.InvoiceID + "'>" + data + "</a>";
         }
     },
     {
         "data": "ClientName", "name": "ClientName", "width": "20%", "class": "text-left"
     },
     {
         "data": "InvoiceStatus", "name": "InvoiceStatus", "width": "15%", "class": "text-left", "render": function (data, type, row) {
             var html = "";
             if (data == "invoice_status_complete") {
                 html = '<span class="badge badge-success" style="width:80px">' + Window.ResourcesEnum[data].toUpperCase() + '</span>';
             }
             else if (data == "invoice_status_void" || data == "invoice_status_refund") {
                 html = '<span class="badge badge-danger" style="width:80px">' + Window.ResourcesEnum[data].toUpperCase() + '</span>';
             }
             else if (data == "invoice_status_unpaid" || data == "invoice_status_part_paid") {
                 html = '<span class="badge badge-warning" style="width:80px">' + Window.ResourcesEnum[data].toUpperCase() + '</span>';
             }
             return html;
         }
     },
     {
         "data": "InvoiceDateString", "name": "InvoiceDateString", "class": "text-left", "width": "20%", "render": function (data, type, row) {
             return moment(data).format(Window.FormatDateWithDayOfWeekJS);
         }
     },
     {
         "data": "LocationName", "name": "LocationName", "width": "15%", "class": "text-left"
     },
     {
         "data": "Total", "name": "Total", "width": "15%", "class": "text-right", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
         }
     },
        ], true, true, true, false, null, true, null, null, null, {
            language: {
                search: "",
                searchPlaceholder: "Invoice or Client",
                "info": "Displaying _START_ - _END_ of _TOTAL_ total invoices",
                "infoEmpty": "",
            }
        });

        table1.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file-excel-o"></i>  Excel',
            extend: 'excelHtml5',
            isAutoWidth: false,
            isSTT: false,
            sheetName: "Invoices List Report",
            title: null,
            filename: "Invoices List Report",
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
                var arrayColWidth = [15, 25, 15, 20, 20, 15];
                //#region fill data header
                rowPos = functions.AddRow(["INVOICE #", "CLIENT", "STATUS", "INVOICE DATE", "LOCATION", "GROSS TOTAL"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion

                //#region fill data to excel
                $.each(table1.rows().data(), function () {
                    var InvoiceNo = this.InvoiceNo;
                    var InvoiceDate = moment(this.InvoiceDate).format(Window.FormatDateWithDayOfWeekJS);
                    var InvoiceStatus = Window.ResourcesEnum[this.InvoiceStatus];
                    var ClientName = this.ClientName;
                    var LocationName = this.LocationName;
                    var Total = $.number(this.Total, Window.NumberDecimal, '.', ',');
                    rowPos = functions.AddRow([InvoiceNo, ClientName, InvoiceStatus, InvoiceDate, LocationName, Total], rowPos);
                })

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
        table1.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i>  CSV',
            filename: "Invoices List Report",
            customize: function (output, config) {
                output = 'INVOICE #, CLIENT, STATUS, INVOICE DATE, LOCATION, GROSS TOTAL\n';
                $.each(table1.rows().data(), function () {
                    var InvoiceNo = this.InvoiceNo;
                    var InvoiceDate = moment(this.InvoiceDate).format(Window.FormatDateWithDayOfWeekJS);
                    var InvoiceStatus = Window.ResourcesEnum[this.InvoiceStatus];
                    var ClientName = this.ClientName;
                    var LocationName = this.LocationName;
                    var Total = $.number(this.Total, Window.NumberDecimal, '.', ',');

                    output += '"' + InvoiceNo + '",'
                            + '"' + InvoiceDate + '",'
                            + '"' + InvoiceStatus + '",'
                            + '"' + ClientName + '",'
                            + '"' + LocationName + '",'
                            + '"' + Total + '"\n';
                })

                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCSV');
        table1.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i> PDF',
            title: "Invoices List Report",
            filename: "Invoices List Report",
            extend: 'pdfHtml5',
            width: ["auto", "*", "auto", "auto", "auto", "auto"],
            download: "open",
        }, '#buttonPDF');
    }

    var loaddata = function () {
        if ($.fn.DataTable.isDataTable('#table1'))
            table1.destroy();

        loadTable1();
        //Sunday, 1 Jul 2018 to Wednesday, 25 Jul 2018, all staff, all locations, generated Wednesday, 25 Jul 2018 at 23:06

        var text2 = "";
        text2 += $("#formInvoices #searchDate").data('daterangepicker').startDate.format(Window.FormatDateWithDayOfWeekJS)
        text2 += " to " + $("#formInvoices #searchDate").data('daterangepicker').endDate.format(Window.FormatDateWithDayOfWeekJS)

        var locationid = $("#formInvoices #LocationID").val();
        if (locationid == null) {
            text2 += ", all locations";
        }
        else {
            if (locationid != 0) {
                text2 += ", " + $("#formInvoices #LocationID").text();
            }
            else {
                text2 += ", all locations";
            }
        }

        text2 = text2 + ", generated " + moment().tz(Window.TimeZone).format(Window.FormatDateWithDayOfWeekJS) + " at " + moment().tz(Window.TimeZone).format(Window.FormatTimeJS);
        $("#formInvoices #txtfilter").text(text2);
    }
    loaddata();
    //#endregion

    //#region Event
    $("#formInvoices #btnView").click(function () {
        loaddata();
    })
    $(document).on("click", "#linkInvoice", function () {
        if (table1 != null) {
            localStorage.setItem("PreLink", "/Reports/Invoices");
        }
    })
    //#endregion
})