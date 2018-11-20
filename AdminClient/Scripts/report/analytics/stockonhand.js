var table;
var sumCols = {};
$(function () {
    CreateBreadcrumb([{ href: "/Reports/Reports", title: "Reports" }])
    $("#ExpiryManual").daterangepicker({
        "singleDatePicker": true,
        "autoApply": true,
        "autoUpdateInput": false,
        "maxDate": moment().tz(Window.TimeZone)._d,
        "locale": {
            "firstDay": parseInt(Window.BusinessBeginningOfWeek)
        }
    });
    $("#ExpiryManual").data('daterangepicker').setStartDate(moment().tz(Window.TimeZone)._d);
    $("#ExpiryManual").data('daterangepicker').setEndDate(moment().tz(Window.TimeZone)._d);
    $("#ExpiryManual").val(moment().tz(Window.TimeZone).format("dddd DD MMM, YYYY"));
    $("#ExpiryManual").on('apply.daterangepicker', function (ev, picker) {
        $(this).val($(this).data('daterangepicker').startDate.format("dddd DD MMM, YYYY")).trigger("change");
    });

    $("#formReport #LocationID").InStallSelect2('/Home/LoadSelect2ForLocation', 100, 'All Location', null, null, null, null, null, null, null, false);
    $("#formReport #SupplierID").InStallSelect2('/Home/LoadSelect2ForSupplier', 50, 'All supplier', null, null, null, null, null, null, null, false);
    $("#formReport #BrandID").InStallSelect2('/Home/LoadSelect2ForBrand', 50, 'All brand', null, null, null, null, null, null, null, false);
    $("#formReport #CategoryID").InStallSelect2('/Home/LoadSelect2ForCategory', 50, 'All category', null, null, null, null, null, null, null, false);

    var loadTable = function () {
        table = $("#table").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "SupplierID": $("#formReport #SupplierID").val(),
            "BrandID": $("#formReport #BrandID").val(),
            "CategoryID": $("#formReport #CategoryID").val(),
            "todate": $("#formReport #ExpiryManual").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableStockonHand", [
     {
         "data": "ProductName", "name": "ProductName", "width": "30%", "class": "text-left"
     },
     {
         "data": "LocationName", "name": "LocationName", "width": "30%", "class": "text-left"
     },
     {
         "data": "OnHand", "name": "OnHand", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return ($.number(data, "", '.', ','));;
         }
     },
     {
         "data": "OnHandCost", "name": "OnHandCost", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
         }
     },
     {
         "data": "AVGCost", "name": "AVGCost", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
         }
     },
     {
         "data": "TotalRetailValue", "name": "TotalRetailValue", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
         }
     },
     {
         "data": "RetailPrice", "name": "RetailPrice", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
         }
     },
     {
         "data": "ReorderPoint", "name": "ReoderPoint", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return ($.number(data, "", '.', ','));;
         }
     },
     {
         "data": "ReorderQty", "name": "ReoderQty", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return ($.number(data, "", '.', ','));;
         }
     },
        ], true, false, false, false, null, true, null, function (setting) {
            var api = this.api();
            if (api.rows().data().count() > 0) {
                var length = api.columns()[0].length;
                var html = "<tr><td class='text-center'><strong>Total</strong></td><td></td>";
                for (i = 2; i < length; ++i) {
                    var sum = this.api().column(i).data().sum();
                    sumCols[i] = sum;
                    if (i == 2) {
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
            sheetName: "Stock on Hand",
            title: null,
            filename: "Stock on Hand",
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
                var arrayColWidth = [20, 20, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15];
                //#region fill data header

                rowPos = functions.AddRow(["Product", "Location", "Barcode", "SKU", "Supplier", "Brand", "Category", "Stock on Hand", "Total Cost", "Average Cost", "Total Retail Value", "Retail Price", "Reorder Point", "Reorder Amount"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion
                //#region fill data to excel


                $.each(table.rows().data(), function () {
                    var ProductName = this.ProductName;
                    var LocationName = this.LocationName;
                    var Bardcode = $.number(this.Products, '', '.', ',');
                    var SKU = $.number(this.TotalSales, '', '.', ',');
                    var SupplierName = this.SupplierName;
                    var BrandName = this.BrandName;
                    var CategoryName = this.CategoryName;
                    var OnHand = $.number(this.OnHand, '', '.', ',');
                    var OnHandCost = $.number(this.OnHandCost, Window.NumberDecimal, '.', ',');
                    var AVGCost = $.number(this.AVGCost, Window.NumberDecimal, '.', ',');
                    var TotalRetailValue = $.number(this.TotalRetailValue, Window.NumberDecimal, '.', ',');
                    var RetailPrice = $.number(this.RetailPrice, Window.NumberDecimal, '.', ',');
                    var ReorderPoint = $.number(this.ReorderPoint, '', '.', ',');
                    var ReorderAmount = $.number(this.ReorderAmount, '', '.', ',');


                    rowPos = functions.AddRow([ProductName, LocationName, Bardcode, SKU, SupplierName, BrandName, CategoryName, OnHand, OnHandCost, AVGCost, TotalRetailValue, RetailPrice, ReorderPoint, ReorderAmount], rowPos);
                })

                //#endregion

                // Set column widths
                var cols = functions.CreateCellPos(rels, 'cols');
                $('worksheet', rels).prepend(cols);

                for (var i = 0, ien = 14 ; i < ien ; i++) {
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
            filename: "Stock On Hand",
            customize: function (output, config) {
                output = 'Product , Location, Barcode, SKU, Supplier, Brand,Category, Stock on Hand, Total Cost, Average Cost, Total Retail Value, Retail Price, Reorder Point, Reorder Amount\n';
                $.each(table.rows().data(), function () {

                    var ProductName = this.ProductName;
                    var LocationName = this.LocationName;
                    var Bardcode = $.number(this.Products, '', '.', ',');
                    var SKU = $.number(this.TotalSales, '', '.', ',');
                    var SupplierName = this.SupplierName;
                    var BrandName = this.BrandName;
                    var CategoryName = this.CategoryName;
                    var OnHand = $.number(this.OnHand, '', '.', ',');
                    var OnHandCost = $.number(this.OnHandCost, Window.NumberDecimal, '.', ',');
                    var AVGCost = $.number(this.AVGCost, Window.NumberDecimal, '.', ',');
                    var TotalRetailValue = $.number(this.TotalRetailValue, Window.NumberDecimal, '.', ',');
                    var RetailPrice = $.number(this.RetailPrice, Window.NumberDecimal, '.', ',');
                    var ReorderPoint = $.number(this.ReorderPoint, '', '.', ',');
                    var ReorderAmount = $.number(this.ReorderAmount, '', '.', ',');

                    output += '"' + ProductName + '",'
                            + '"' + LocationName + '",'
                            + '"' + Bardcode + '",'
                            + '"' + SKU + '",'
                            + '"' + SupplierName + '",'
                            + '"' + BrandName + '",'
                            + '"' + CategoryName + '",'
                            + '"' + OnHand + '",'
                            + '"' + OnHandCost + '",'
                            + '"' + AVGCost + '",'
                            + '"' + TotalRetailValue + '",'
                            + '"' + RetailPrice + '",'
                            + '"' + ReorderPoint + '",'
                            + '"' + ReorderAmount + '"\n';

                })

                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCSV');
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i> PDF',
            title: "Sales by Stock on Hand",
            filename: "Sales by Sales by Stock on Hand",
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