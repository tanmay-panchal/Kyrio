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
    $("#formReport #SupplierID").InStallSelect2('/Home/LoadSelect2ForSupplier', 50, 'Select supplier', null);
    $("#formReport #BrandID").InStallSelect2('/Home/LoadSelect2ForBrand', 50, 'Select brand', null);
    $("#formReport #CategoryID").InStallSelect2('/Home/LoadSelect2ForCategory', 50, 'Select category', null);

    var loadTable = function () {
        table = $("#table").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "SupplierID": $("#formReport #SupplierID").val(),
            "BrandID": $("#formReport #BrandID").val(),
            "CategoryID": $("#formReport #CategoryID").val(),
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableProductSales", [
        {
            "data": "ItemName", "name": "ItemName", "width": "30%", "class": "text-left"
        },
      {
          "data": "StockOnHand", "name": "StockOnHand", "class": "text-right", "width": "10%", "render": function (data, type, row) {
              return ($.number(data, "", '.', ','));
          }
      },
     {
         "data": "QtySold", "name": "QtySold", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return ($.number(data, "", '.', ','));
         }
     },
     {
         "data": "CostGoodSold", "name": "CostGoodSold", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
         }
     },
     {
         "data": "NetSale", "name": "NetSale", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
         }
     },
     {
         "data": "AVGNetSale", "name": "AVGNetSale", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
         }
     },
     {
         "data": "Margin", "name": "Margin", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return ($.number(data, 2, '.', ',')) + "%";
         }
     },
     {
         "data": "TotalMargin", "name": "TotalMargin", "class": "text-right", "width": "10%", "render": function (data, type, row) {
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
                    if (i == 1 || i == 2) {
                        html += "<td class='text-right'><strong>" + ($.number(sum, 0, '.', ',')) + "</strong></td>";
                    }
                    else if (i == 6) {
                        html += "<td class='text-right'><strong>" + ($.number(sum, 2, '.', ',')) + "%" + "</strong></td>";
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
            sheetName: "Product Sales Performance",
            title: null,
            filename: "Product Sales Performance",
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
                var arrayColWidth = [20, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15];
                //#region fill data header

                rowPos = functions.AddRow(["Product Name", "Barcode", "SKU", "Supplier", "Brand", "Category", "Stock on Hand", "Qty Sold", "Cost of Goods Sold", "Net Sales", "Av.Net Price", "Margin", "Total Margin"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion
                //#region fill data to excel

                var sStockOnHand = 0;
                var sQtySold = 0;
                var sCostGoodSold = 0;
                var sNetSale = 0;
                var sAVGNetSale = 0;
                var sMargin = 0;
                var sTotalMargin = 0;

                $.each(table.rows().data(), function () {
                    var ItemName = this.ItemName;
                    var Barcode = this.Barcode;
                    var SKU = this.SKU;
                    var SupplierName = this.SupplierName;
                    var BrandName = this.BrandName;
                    var CategoryName = this.CategoryName;
                    var StockOnHand = $.number(this.StockOnHand, '', '.', ',');
                    var QtySold = $.number(this.QtySold, '', '.', ',');
                    var CostGoodSold = $.number(this.CostGoodSold, Window.NumberDecimal, '.', ',');
                    var NetSale = $.number(this.NetSale, Window.NumberDecimal, '.', ',');
                    var AVGNetSale = $.number(this.AVGNetSale, Window.NumberDecimal, '.', ',');
                    var Margin = $.number(this.Margin, Window.NumberDecimal, '.', ',');
                    var TotalMargin = $.number(this.TotalMargin, Window.NumberDecimal, '.', ',');

                    sStockOnHand = sStockOnHand + parseInt(this.StockOnHand);
                    sQtySold = sQtySold + parseInt(this.QtySold);
                    sCostGoodSold = sCostGoodSold + parseFloat(this.CostGoodSold);
                    sNetSale = sNetSale + parseFloat(this.NetSale);
                    sAVGNetSale = sAVGNetSale + parseFloat(this.AVGNetSale);
                    sMargin = sMargin + parseFloat(this.Margin);
                    sTotalMargin = sTotalMargin + parseFloat(this.TotalMargin);
                    rowPos = functions.AddRow([ItemName, Barcode, SKU, SupplierName, BrandName, CategoryName, StockOnHand, QtySold, $.number(this.CostGoodSold, Window.NumberDecimal, '.', ','), $.number(this.NetSale, Window.NumberDecimal, '.', ','), $.number(this.AVGNetSale, Window.NumberDecimal, '.', ','), $.number(this.Margin, Window.NumberDecimal, '.', ','), $.number(this.TotalMargin, Window.NumberDecimal, '.', ',')], rowPos);
                })
                rowPos = functions.AddRow(["Total", "", "", "", "", "", sStockOnHand, sQtySold, $.number(sCostGoodSold, Window.NumberDecimal, '.', ','), $.number(sNetSale, Window.NumberDecimal, '.', ','), $.number(sAVGNetSale, Window.NumberDecimal, '.', ','), $.number(sMargin, Window.NumberDecimal, '.', ','), $.number(sTotalMargin, Window.NumberDecimal, '.', ',')], rowPos);

                //#endregion

                // Set column widths
                var cols = functions.CreateCellPos(rels, 'cols');
                $('worksheet', rels).prepend(cols);

                for (var i = 0, ien = 13 ; i < ien ; i++) {
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
            filename: "Product Sales Performance",
            customize: function (output, config) {
                output = ' Product Name, Barcode, SKU, Supplier, Brand, Category, Stock on Hand, Qty Sold, Cost of Goods Sold, Net Sales, Av.Net Price, Margin, Total Margin\n';

                var sStockOnHand = 0;
                var sQtySold = 0;
                var sCostGoodSold = 0;
                var sNetSale = 0;
                var sAVGNetSale = 0;
                var sMargin = 0;
                var sTotalMargin = 0;
                $.each(table.rows().data(), function () {

                    var ItemName = this.ItemName;
                    var Barcode = this.Barcode;
                    var SKU = this.SKU;
                    var SupplierName = this.SupplierName;
                    var BrandName = this.BrandName;
                    var CategoryName = this.CategoryName;
                    var StockOnHand = $.number(this.StockOnHand, '', '.', ',');
                    var QtySold = $.number(this.QtySold, '', '.', ',');
                    var CostGoodSold = $.number(this.CostGoodSold, Window.NumberDecimal, '.', ',');
                    var NetSale = $.number(this.NetSale, Window.NumberDecimal, '.', ',');
                    var AVGNetSale = $.number(this.AVGNetSale, Window.NumberDecimal, '.', ',');
                    var Margin = $.number(this.Margin, Window.NumberDecimal, '.', ',');
                    var TotalMargin = $.number(this.TotalMargin, Window.NumberDecimal, '.', ',');

                    sStockOnHand = sStockOnHand + parseInt(this.StockOnHand);
                    sQtySold = sQtySold + parseInt(this.QtySold);
                    sCostGoodSold = sCostGoodSold + parseFloat(this.CostGoodSold);
                    sNetSale = sNetSale + parseFloat(this.NetSale);
                    sAVGNetSale = sAVGNetSale + parseFloat(this.AVGNetSale);
                    sMargin = sMargin + parseFloat(this.Margin);
                    sTotalMargin = sTotalMargin + parseFloat(this.TotalMargin);

                    output += '"' + ItemName + '",'
                            + '"' + Barcode + '",'
                            + '"' + SKU + '",'
                            + '"' + SupplierName + '",'
                            + '"' + BrandName + '",'
                            + '"' + CategoryName + '",'
                            + '"' + StockOnHand + '",'
                            + '"' + QtySold + '",'
                            + '"' + CostGoodSold + '",'
                            + '"' + NetSale + '",'
                            + '"' + AVGNetSale + '",'
                            + '"' + Margin + '",'
                            + '"' + TotalMargin + '"\n';
                })

                output += '"' + "Total" + '",'
                        + '"' + "" + '",'
                        + '"' + "" + '",'
                        + '"' + "" + '",'
                        + '"' + "" + '",'
                        + '"' + "" + '",'
                        + '"' + sStockOnHand + '",'
                        + '"' + sQtySold + '",'
                        + '"' + sCostGoodSold + '",'
                        + '"' + sNetSale + '",'
                        + '"' + sAVGNetSale + '",'
                        + '"' + sMargin + '",'
                        + '"' + sTotalMargin + '"\n';
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