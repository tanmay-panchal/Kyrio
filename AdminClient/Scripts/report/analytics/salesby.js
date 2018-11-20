var table;
var FileName = "";
var headercol1 = "";
var sumCols = {};
$(function () {
    CreateBreadcrumb([{ href: "/Reports/Reports", title: "Reports" }])
    $("#TitleReport").text(Window.ResourcesEnum[$("#ReportType").val()]);
    FileName = Window.ResourcesEnum[$("#ReportType").val()];
    if ($("#ReportType").val() == 'report_sale_by_item') {
        headercol1 = 'Item name';
    }
    else if ($("#ReportType").val() == 'report_sale_by_type') {
        headercol1 = 'Type';
    }
    else if ($("#ReportType").val() == 'report_sale_by_service') {
        headercol1 = 'Service';
    }
    else if ($("#ReportType").val() == 'report_sale_by_product') {
        headercol1 = 'Product';
    }
    else if ($("#ReportType").val() == 'report_sale_by_location') {
        headercol1 = 'Location';
    }
    else if ($("#ReportType").val() == 'report_sale_by_channel') {
        headercol1 = 'Channel';
    }
    else if ($("#ReportType").val() == 'report_sale_by_client') {
        headercol1 = 'Client';
    }
    else if ($("#ReportType").val() == 'report_sale_by_staff') {
        headercol1 = 'Staff';
    }
    else if ($("#ReportType").val() == 'report_sale_by_hour') {
        headercol1 = 'Hour';
    }
    else if ($("#ReportType").val() == 'report_sale_by_day') {
        headercol1 = 'Day';
    }
    else if ($("#ReportType").val() == 'report_sale_by_month') {
        headercol1 = 'Month';
    }
    else if ($("#ReportType").val() == 'report_sale_by_quarter') {
        headercol1 = 'Quarter';
    }
    else if ($("#ReportType").val() == 'report_sale_by_year') {
        headercol1 = 'Year';
    }

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
    });
    $("#formReport #LocationID").InStallSelect2('/Home/LoadSelect2ForLocation', 100, 'All Location', null, null, null, null, null, null, null, false);
    $("#formReport #StaffID").InStallSelect2('/Home/LoadSelect2ForUser', 100, 'All Staff', null, null, null, null, null, null, null, false);
    var loadTable = function () {
        table = $("#table").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "Channel": $("#formReport #Channel").val(),
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
            "ReportType": $("#formReport #ReportType").val(),
        }, "/Reports/GetDataTableSalesBy", [
     {
         "data": "ItemName", "name": "ItemName", "width": "30%", "class": "text-left"
     },
     {
         "data": "ItemsSold", "name": "ItemsSold", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return ($.number(data, 0, '.', ','));
         }
     },
     {
         "data": "GrossSales", "name": "GrossSales", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
         }
     },
     {
         "data": "Discounts", "name": "Discounts", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
         }
     },
     {
         "data": "Refunds", "name": "Refunds", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
         }
     },
     {
         "data": "NetSales", "name": "NetSales", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
         }
     },
     {
         "data": "Tax", "name": "Tax", "class": "text-right", "width": "10%", "render": function (data, type, row) {
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
                var html = "<tr><td class='text-center'><strong>Total</strong></td>";
                for (i = 1; i < length; ++i) {
                    var sum = this.api().column(i).data().sum();
                    sumCols[i] = sum;
                    if (i == 1) {
                        html += "<td class='text-right'><strong>" + ($.number(sum, 0, '.', ',')) + "</strong></td>";
                    }
                    else {
                        html += "<td class='text-right'><strong>" + Window.CurrencySymbol + ($.number(sum, Window.NumberDecimal, '.', ',')) + "</strong></td>";
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
            sheetName: FileName,
            title: null,
            filename: FileName,
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
                var arrayColWidth = [20, 15, 15, 15, 15, 15, 15, 15];
                //#region fill data header

                rowPos = functions.AddRow([headercol1, "Items Sold", "Gross Sale", "Discounts", "Refunds", "Net Sales", "Tax", "Total Sales"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion
                debugger;
                //#region fill data to excel
                var sItemsSold = 0;
                var sGrossSales = 0;
                var sDiscounts = 0;
                var sRefunds = 0;
                var sNetSales = 0;
                var sTax = 0;
                var sTotalSales = 0;
                $.each(table.rows().data(), function () {
                    var ItemName = this.ItemName;
                    var ItemsSold = $.number(this.ItemsSold, 0, '.', ',');
                    var GrossSales = $.number(this.GrossSales, Window.NumberDecimal, '.', ',');
                    var Discounts = $.number(this.Discounts, Window.NumberDecimal, '.', ',');
                    var Refunds = $.number(this.Refunds, Window.NumberDecimal, '.', ',');
                    var NetSales = $.number(this.NetSales, Window.NumberDecimal, '.', ',');
                    var Tax = $.number(this.Tax, Window.NumberDecimal, '.', ',');
                    var TotalSales = $.number(this.TotalSales, Window.NumberDecimal, '.', ',');

                    sItemsSold = sItemsSold + parseInt(this.ItemsSold);
                    sGrossSales = sGrossSales + parseFloat(this.GrossSales);
                    sDiscounts = sDiscounts + parseFloat(this.Discounts);
                    sRefunds = sRefunds + parseFloat(this.Refunds);
                    sNetSales = sNetSales + parseFloat(this.NetSales);
                    sTax = sTax + Tax;
                    sTotalSales = sTotalSales + TotalSales;
                    rowPos = functions.AddRow([ItemName, ItemsSold, GrossSales, Discounts, Refunds, NetSales, Tax, TotalSales], rowPos);
                })

                rowPos = functions.AddRow(["Total", sItemsSold, $.number(sGrossSales, Window.NumberDecimal, '.', ','), $.number(sDiscounts, Window.NumberDecimal, '.', ','), $.number(sRefunds, Window.NumberDecimal, '.', ','), $.number(sNetSales, Window.NumberDecimal, '.', ','), $.number(sTax, Window.NumberDecimal, '.', ','), $.number(sTotalSales, Window.NumberDecimal, '.', ',')], rowPos);
                //#endregion

                // Set column widths
                var cols = functions.CreateCellPos(rels, 'cols');
                $('worksheet', rels).prepend(cols);

                for (var i = 0, ien = 8 ; i < ien ; i++) {
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
            filename: FileName,
            customize: function (output, config) {
                output = headercol1 + ', Items Sold, Gross Sale, Discounts, Refunds, Net Sales, Tax, Total Sales\n';

                var sItemsSold = 0;
                var sGrossSales = 0;
                var sDiscounts = 0;
                var sRefunds = 0;
                var sNetSales = 0;
                var sTax = 0;
                var sTotalSales = 0;
                $.each(table.rows().data(), function () {
                    var ItemName = this.ItemName;
                    var ItemsSold = $.number(this.ItemsSold, 0, '.', ',');
                    var GrossSales = $.number(this.GrossSales, Window.NumberDecimal, '.', ',');
                    var Discounts = $.number(this.Discounts, Window.NumberDecimal, '.', ',');
                    var Refunds = $.number(this.Refunds, Window.NumberDecimal, '.', ',');
                    var NetSales = $.number(this.NetSales, Window.NumberDecimal, '.', ',');
                    var Tax = $.number(this.Tax, Window.NumberDecimal, '.', ',');
                    var TotalSales = $.number(this.TotalSales, Window.NumberDecimal, '.', ',');

                    sItemsSold = sItemsSold + parseInt(this.ItemsSold);
                    sGrossSales = sGrossSales + parseFloat(this.GrossSales);
                    sDiscounts = sDiscounts + parseFloat(this.Discounts);
                    sRefunds = sRefunds + parseFloat(this.Refunds);
                    sNetSales = sNetSales + parseFloat(this.NetSales);
                    sTax = sTax + parseFloat(this.Tax);
                    sTotalSales = sTotalSales + parseFloat(this.TotalSales);
                    output += '"' + ItemName + '",'
                            + '"' + ItemsSold + '",'
                            + '"' + GrossSales + '",'
                            + '"' + Discounts + '",'
                            + '"' + Refunds + '",'
                            + '"' + NetSales + '",'
                            + '"' + Tax + '",'
                            + '"' + TotalSales + '"\n';
                })

                output += '"' + "Total" + '",'
                        + '"' + sItemsSold + '",'
                        + '"' + sGrossSales + '",'
                        + '"' + sDiscounts + '",'
                        + '"' + sRefunds + '",'
                        + '"' + sNetSales + '",'
                        + '"' + sTax + '",'
                        + '"' + sTotalSales + '"\n';

                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCSV');
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i> PDF',
            title: FileName,
            filename: FileName,
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