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
            'This month': [moment().tz(Window.TimeZone).startOf('month'), moment().tz(Window.TimeZone)],
            'Last 30 Days': [moment().tz(Window.TimeZone).subtract(30, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')]
        },
        locale: {
            "format": Window.FormatDateJS
        }
    });
    $("#formReport #LocationID").InStallSelect2('/Home/LoadSelect2ForLocation', 100, 'All Location', null, null, null, null, null, null, null, false);

    var loadTable = function () {
        table = $("#table").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableStockMovementLog", [
     {
         "data": "TransactionTime", "name": "TransactionTime", "class": "text-left", "width": "20%", "render": function (data, type, row) {
             return moment(data).format(Window.FormatDateWithTimeJS);
         }
     },
     {
         "data": "ProductName", "name": "ProductName", "width": "15%", "class": "text-left"
     },
     {
         "data": "Barcode", "name": "Barcode", "width": "15%", "class": "text-left"
     },
     {
         "data": "StaffName", "name": "StaffName", "width": "30%", "class": "text-left"
     },
     {
         "data": "LocationName", "name": "LocationName", "width": "20%", "class": "text-left"
     },
     {
         "data": "Action", "name": "Action", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return Window.ResourcesEnum[data] + " " + row.InvoiceNo + row.OrderNo;
         }
     },
     {
         "data": "Adjustment", "name": "Adjustment", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return ($.number(data, Window.NumberDecimal, '.', ','));
         }
     },
     {
         "data": "CostPrice", "name": "CostPrice", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
         }
     },
     {
         "data": "StockOnHand", "name": "StockOnHand", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return ($.number(data, 0, '.', ','));;
         }
     },
        ], true, false, false, false, null, true, null, function (setting) {
            var api = this.api();
            if (api.rows().data().count() > 0) {
                var length = api.columns()[0].length;
                var html = "<tr><td colspan='6'class='text-center'><strong>Total</strong></td>";
                for (i = 6; i < length; ++i) {
                    var sum = this.api().column(i).data().sum();
                    sumCols[i] = sum;
                    if (i == 6 || i == 8) {
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
            sheetName: "Stock Movement Log",
            title: null,
            filename: "Stock Movement Log",
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
                var arrayColWidth = [20, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15];
                //#region fill data header

                rowPos = functions.AddRow(["Time & Date", "Product", "SKU", "Barcode", "Brand", "Category", "Supplier", "Location", "Staff", "Action", "Adjustment", "Cost Price", "Adjustment Cost", "On Hand", "On Hand Cost"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion
                debugger;
                //#region fill data to excel


                $.each(table.rows().data(), function () {
                    var TransactionTime = moment(this.TransactionTime).format(Window.FormatDateWithTimeJS);
                    var ProductName = this.ProductName;
                    var SKU = this.SKU;
                    var Barcode = this.Barcode;
                    var BrandName = this.BrandName;
                    var CategoryName = this.CategoryName;
                    var SupplierName = this.SupplierName;
                    var LocationName = this.LocationName;
                    var StaffName = this.StaffName;
                    var Action = (Window.ResourcesEnum[this.Action]);
                    var InvoiceNo = this.InvoiceNo;
                    var OrderNo = this.OrderNo;
                    var Adjustment = $.number(this.Adjustment, 0, '.', ',');
                    var CostPrice = $.number(this.CostPrice, Window.NumberDecimal, '.', ',');
                    var AdjustmentCost = $.number(this.AdjustmentCost, Window.NumberDecimal, '.', ',');
                    var OnHand = $.number(this.StockOnHand, 0, '.', ',');
                    var OnHandCost = $.number(this.StockOnHandCost, Window.NumberDecimal, '.', ',');

                    rowPos = functions.AddRow([TransactionTime, ProductName, SKU, Barcode, BrandName, CategoryName, SupplierName, LocationName, StaffName, Action + InvoiceNo + OrderNo, Adjustment, CostPrice, AdjustmentCost, OnHand, OnHandCost], rowPos);
                })


                //#endregion

                // Set column widths
                var cols = functions.CreateCellPos(rels, 'cols');
                $('worksheet', rels).prepend(cols);

                for (var i = 0, ien = 15 ; i < ien ; i++) {
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
            filename: "Stock Movement Log",
            customize: function (output, config) {
                output = 'Time & Date,Product, SKU, Barcode, Brand, Category,Supplier, Location, Staff, Action, Adjustment, CostPrice, Adjustment Cost,On Hand,On Hand Cost%\n';

                $.each(table.rows().data(), function () {
                    var TransactionTime = moment(this.TransactionTime).format(Window.FormatDateWithTimeJS);
                    var ProductName = this.ProductName;
                    var SKU = this.SKU;
                    var Barcode = this.Barcode;
                    var BrandName = this.BrandName;
                    var CategoryName = this.CategoryName;
                    var SupplierName = this.SupplierName;
                    var LocationName = this.LocationName;
                    var StaffName = this.StaffName;
                    var Action = (Window.ResourcesEnum[this.Action]);
                    var Adjustment = $.number(this.Adjustment, 0, '.', ',');
                    var CostPrice = $.number(this.CostPrice, Window.NumberDecimal, '.', ',');
                    var AdjustmentCost = $.number(this.AdjustmentCost, Window.NumberDecimal, '.', ',');
                    var OnHand = $.number(this.StockOnHand, 0, '.', ',');
                    var OnHandCost = $.number(this.StockOnHandCost, Window.NumberDecimal, '.', ',');

                    output += '"' + TransactionTime + '",'
                            + '"' + ProductName + '",'
                            + '"' + SKU + '",'
                            + '"' + Barcode + '",'
                            + '"' + BrandName + '",'
                            + '"' + CategoryName + '",'
                            + '"' + SupplierName + '",'
                            + '"' + LocationName + '",'
                            + '"' + StaffName + '",'
                            + '"' + Action + '",'
                            + '"' + Adjustment + '",'
                            + '"' + CostPrice + '",'
                            + '"' + AdjustmentCost + '",'
                            + '"' + OnHand + '",'
                            + '"' + OnHandCost + '"\n';
                })

                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCSV');
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i> PDF',
            title: "Stock Movement Log",
            filename: "Stock Movement Log",
            extend: 'pdfHtml5',
            download: "open",
        }, '#buttonPDF');
    }

    var loaddata = function () {
        if ($.fn.DataTable.isDataTable('#table'))
            table.destroy();
        loadTable();

        var text2 = "";
        text2 += $("#formReport #searchDate").data('daterangepicker').startDate.format(Window.FormatDateWithDayOfWeekJS)
        text2 += " to " + $("#formReport #searchDate").data('daterangepicker').endDate.format(Window.FormatDateWithDayOfWeekJS)

        var locationid = $("#formReport #LocationID").val();
        if (locationid == null || locationid == "" || locationid == "0") {
            text2 += ", all locations";
        }
        else {
            text2 += ", " + $("#formReport #LocationID").text();
        }

        text2 = text2 + ", generated " + moment().tz(Window.TimeZone).format(Window.FormatDateWithDayOfWeekJS) + " at " + moment().tz(Window.TimeZone).format(Window.FormatTimeJS);
        $("#txtfilter").text(text2);
    }
    loaddata();
    $("#formReport #btnView").click(function () {
        loaddata();
    })
})