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
            "Channel": $("#formReport #Channel").val(),
            "ItemType": $("#formReport #ItemType").val(),
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableSalesByStaffBreak", [
     {
         "data": "Staff", "name": "Staff", "width": "30%", "class": "text-left"
     },

     {
         "data": "Services", "name": "Services", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
         }
     },
     {
         "data": "Products", "name": "Products", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
         }
     },
     {
         "data": "TotalSales", "name": "TotalSales", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
         }
     },
     {
         "data": "Vouchers", "name": "Vouchers", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
         }
     },
     {
         "data": "Total", "name": "Total", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
         }
     },
     {
         "data": "PercentTotal", "name": "PercentTotal", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return ($.number(data, 2, '.', ','));;
         }
     },
     {
         "data": "ItemSold", "name": "ItemSold", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return ($.number(data, 0, '.', ','));;
         }
     },
     {
         "data": "AVGItemPrice", "name": "AVGItemPrice", "class": "text-right", "width": "10%", "render": function (data, type, row) {
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
                    if (i == 7) {
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
            sheetName: "Sales by Staff Breakdown",
            title: null,
            filename: "Sales by Staff Breakdown",
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
                var arrayColWidth = [20, 15, 15, 15, 15, 15, 15, 15, 15];
                //#region fill data header

                rowPos = functions.AddRow(["Staff", "Services", "Products", "Total Sales", "Vouchers ", "Total", "%Total", "Item Sold", "Avg.Item Price"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion
                //#region fill data to excel
                var sServices = 0;
                var sProducts = 0;
                var sTotalSales = 0;
                var sVouchers = 0;
                var sTotal = 0;
                var sPercentTotal = 0;
                var sItemSold = 0;
                var sAVGItemPrice = 0;

                $.each(table.rows().data(), function () {
                    var Staff = this.Staff;
                    var Services = $.number(this.Services, Window.NumberDecimal, '.', ',');
                    var Products = $.number(this.Products, Window.NumberDecimal, '.', ',');
                    var TotalSales = $.number(this.TotalSales, Window.NumberDecimal, '.', ',');
                    var Vouchers = $.number(this.Vouchers, Window.NumberDecimal, '.', ',');
                    var Total = $.number(this.Total, Window.NumberDecimal, '.', ',');
                    var PercentTotal = $.number(this.PercentTotal, 2, '.', ',');
                    var ItemSold = $.number(this.ItemSold, 0, '.', ',');
                    var AVGItemPrice = $.number(this.AVGItemPrice, Window.NumberDecimal, '.', ',');

                    sServices = sServices + parseFloat(this.Services);
                    sProducts = sProducts + parseFloat(this.Products);
                    sTotalSales = sTotalSales + parseFloat(this.TotalSales);
                    sVouchers = sVouchers + parseFloat(this.Vouchers);
                    sTotal = sTotal + parseFloat(this.Total);
                    sPercentTotal = sPercentTotal + parseFloat(this.PercentTotal);
                    sItemSold = sItemSold + parseInt(this.ItemSold);
                    sAVGItemPrice = sAVGItemPrice + parseFloat(this.AVGItemPrice);
                    rowPos = functions.AddRow([Staff, Services, Products, TotalSales, Vouchers, Total, PercentTotal, ItemSold, AVGItemPrice], rowPos);
                })
                rowPos = functions.AddRow(["Total", $.number(sServices, Window.NumberDecimal, '.', ','), $.number(sProducts, Window.NumberDecimal, '.', ','), $.number(sTotalSales, Window.NumberDecimal, '.', ','), $.number(sVouchers, Window.NumberDecimal, '.', ','), $.number(sTotal, Window.NumberDecimal, '.', ','), $.number(sPercentTotal, Window.NumberDecimal, '.', ','), sItemSold, $.number(sAVGItemPrice, Window.NumberDecimal, '.', ',')], rowPos);

                //#endregion

                // Set column widths
                var cols = functions.CreateCellPos(rels, 'cols');
                $('worksheet', rels).prepend(cols);

                for (var i = 0, ien = 9 ; i < ien ; i++) {
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
            filename: "Sales by Staff Breakdown",
            customize: function (output, config) {
                output = ' Staff, Services, Products, Total Sales, Vouchers, Total, %Total, Item Sold, Avg.Item Price\n';

                var sServices = 0;
                var sProducts = 0;
                var sTotalSales = 0;
                var sVouchers = 0;
                var sTotal = 0;
                var sPercentTotal = 0;
                var sItemSold = 0;
                var sAVGItemPrice = 0;
                $.each(table.rows().data(), function () {
                    var Staff = this.Staff;
                    var Services = $.number(this.Services, Window.NumberDecimal, '.', ',');
                    var Products = $.number(this.Products, Window.NumberDecimal, '.', ',');
                    var TotalSales = $.number(this.TotalSales, Window.NumberDecimal, '.', ',');
                    var Vouchers = $.number(this.Vouchers, Window.NumberDecimal, '.', ',');
                    var Total = $.number(this.Total, Window.NumberDecimal, '.', ',');
                    var PercentTotal = $.number(this.PercentTotal, 2, '.', ',');
                    var ItemSold = $.number(this.ItemSold, 0, '.', ',');
                    var AVGItemPrice = $.number(this.AVGItemPrice, Window.NumberDecimal, '.', ',');

                    sServices = sServices + parseFloat(this.Services);
                    sProducts = sProducts + parseFloat(this.Products);
                    sTotalSales = sTotalSales + parseFloat(this.TotalSales);
                    sVouchers = sVouchers + parseFloat(this.Vouchers);
                    sTotal = sTotal + parseFloat(this.Total);
                    sPercentTotal = sPercentTotal + parseFloat(this.PercentTotal);
                    sItemSold = sItemSold + parseInt(this.ItemSold);
                    sAVGItemPrice = sAVGItemPrice + parseFloat(this.AVGItemPrice);

                    output += '"' + Staff + '",'
                            + '"' + Services + '",'
                            + '"' + Products + '",'
                            + '"' + TotalSales + '",'
                            + '"' + Vouchers + '",'
                            + '"' + Total + '",'
                            + '"' + PercentTotal + '",'
                            + '"' + ItemSold + '",'
                            + '"' + AVGItemPrice + '"\n';
                })
                output += '"' + "Total" + '",'
                           + '"' + sServices + '",'
                           + '"' + sProducts + '",'
                           + '"' + sTotalSales + '",'
                           + '"' + sVouchers + '",'
                           + '"' + sTotal + '",'
                           + '"' + sPercentTotal + '",'
                           + '"' + sItemSold + '",'
                           + '"' + sAVGItemPrice + '"\n';

                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCSV');
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i> PDF',
            title: "Sales by Staff Breakdown",
            filename: "Sales by Staff Breakdown",
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