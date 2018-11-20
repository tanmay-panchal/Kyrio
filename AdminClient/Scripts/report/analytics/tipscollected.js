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
        }, "/Reports/GetDataTableTipsCollected", [
       {
           "data": "InvoiceDate", "name": "InvoiceDate", "class": "text-left", "width": "20%", "render": function (data, type, row) {
               return moment(data).format(Window.FormatDateWithTimeJS);
           }
       },
       {
           "data": "InvoiceNo", "name": "InvoiceNo", "width": "10%", "class": "text-left"
       },
       {
           "data": "LocationName", "name": "LocationName", "width": "10%", "class": "text-left"
       },
       {
           "data": "StaffName", "name": "StaffName", "width": "10%", "class": "text-left"
       },
       {
           "data": "TipAmount", "name": "TipAmount", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
           }
       },
        ], true, false, false, false, null, true, null, function (setting) {
            var api = this.api();
            if (api.rows().data().count() > 0) {
                var length = api.columns()[0].length;
                var html = "<tr><td colspan='4' class='text-center'><strong>Total</strong></td>";
                for (i = 4; i < length; ++i) {
                    var sum = this.api().column(i).data().sum();
                    sumCols[i] = sum;
                    if (i == 4) {
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
            sheetName: "Tips Collected",
            title: null,
            filename: "Tips Collected",
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
                var arrayColWidth = [20, 20, 20, 20, 10];
                //#region fill data header

                rowPos = functions.AddRow(["Date" , "Invoice.No", "Location", "Staff Name", "Tips Collected"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion
                //#region fill data to excel

                $.each(table.rows().data(), function () {
                    var InvoiceDate = moment(this.InvoiceDate).format(Window.FormatDateWithTimeJS);
                    var InvoiceNo = this.InvoiceNo;
                    var LocationName = this.LocationName;
                    var StaffName = this.StaffName;
                    var TipAmount = $.number(this.TipAmount, Window.NumberDecimal, '.', ',');
                    rowPos = functions.AddRow([InvoiceDate, InvoiceNo, LocationName, StaffName, TipAmount], rowPos);
                })

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
            filename: "Tips Collected",
            customize: function (output, config) {
                output = ' Invoice Date, Invoice No, Location, Staff Name, Tips Collected\n';

                $.each(table.rows().data(), function () {

                    var InvoiceDate = moment(this.InvoiceDate).format(Window.FormatDateWithTimeJS);
                    var InvoiceNo = this.InvoiceNo;
                    var LocationName = this.LocationName;
                    var StaffName = this.StaffName;
                    var TipAmount = $.number(this.TipAmount, Window.NumberDecimal, '.', ',');


                    output += '"' + InvoiceDate + '",'
                            + '"' + InvoiceNo + '",'
                            + '"' + LocationName + '",'
                            + '"' + StaffName + '",'
                            + '"' + TipAmount + '"\n';
                })

                           

                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCSV');
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i> PDF',
            title: "Tips Collected",
            filename: "Tips Collected",
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