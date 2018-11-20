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
        }, "/Reports/GetDataTableStockMovementSummary", [
            {
                "data": "ProductName", "name": "ProductName", "width": "15%", "class": "text-left"
            },
        {
            "data": "Barcode", "name": "Barcode", "width": "10%", "class": "text-left"
        },
        {
            "data": "StartStock", "name": "StartStock", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return ($.number(data, 0, '.', ','));
            }
        },
        {
            "data": "Received", "name": "Received", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return ($.number(data, 0, '.', ','));
            }
        },
         {
             "data": "Sold", "name": "Sold", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                 return ($.number(data, 0, '.', ','));
             }
         },
        {
            "data": "Deducted", "name": "Deducted", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return ($.number(data, 0, '.', ','));
            }
        },
        {
            "data": "EndStock", "name": "EndStock", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return ($.number(data, 0, '.', ','));
            }
        },
        {
            "data": "EndStockValue", "name": "EndStockValue", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
            }
        },

        ], true, false, false, false, null, true, null);

        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file-excel-o"></i>  Excel',
            extend: 'excelHtml5',
            isAutoWidth: false,
            isSTT: false,
            sheetName: "Stock Movement Summary",
            title: null,
            filename: "Stock Movement Summary",
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
                var arrayColWidth = [20, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15];
                //#region fill data header

                rowPos = functions.AddRow(["Product", "SKU", "Barcode", "Brand", "Category", "Supplier", "Start Stock", "Start Value", "Orders Received", "Deleted Invoice", "New Stock", "Returned", "Sold", "Internal Use", "Damaged", "Out of Date", "Transfers", "Adjustment", "Others", "End Stock", "End Value"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion
                debugger;
                //#region fill data to excel


                $.each(table.rows().data(), function () {
                    var ProductName = this.ProductName;
                    var SKU = this.SKU;
                    var Barcode = this.Barcode;
                    var BrandName = this.BrandName;
                    var CategoryName = this.CategoryName;
                    var SupplierName = this.SupplierName;
                    var StartStock = $.number(this.StartStock, '', '.', ',');
                    var StartStockValue = $.number(this.StartStockValue, 0, '.', ',');
                    var OrdersReceived = $.number(this.OrsdersReceived, 0, '.', ',');
                    var DeletedInvoice = $.number(this.DeletedInvoice, 0, '.', ',');
                    var NewStock = $.number(this.NewStock, 0, '.', ',');
                    var Returned = $.number(this.Returned, 0, '.', ',');
                    var Sold = $.number(this.Sold, 0, '.', ',');
                    var InternalUse = $.number(this.InternalUse, 0, '.', ',');
                    var Damaged = $.number(this.Damaged, 0, '.', ',');
                    var OutOfDate = $.number(this.OutOfDate, 0, '.', ',');
                    var Transfers = $.number(this.Transfers, 0, '.', ',');
                    var Adjustments = $.number(this.Adjustments, 0, '.', ',');
                    var Others = $.number(this.Others, 0, '.', ',');
                    var EndStock = $.number(this.EndStock, 0, '.', ',');
                    var EndStockValue = $.number(this.EndStockValue, 0, '.', ',');

                    rowPos = functions.AddRow([ProductName, SKU, Barcode, BrandName, CategoryName, SupplierName, StartStock, StartStockValue, OrdersReceived, DeletedInvoice, NewStock, Returned, Sold, InternalUse, Damaged, OutOfDate, Transfers, Adjustment, Others, EndStock, EndStockValue], rowPos);
                })


                //#endregion

                // Set column widths
                var cols = functions.CreateCellPos(rels, 'cols');
                $('worksheet', rels).prepend(cols);

                for (var i = 0, ien = 21 ; i < ien ; i++) {
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
                output = 'Product, SKU, Barcode, Brand, Category, Supplier, Start Stock, Start Value, Orders Received, Deleted Invoice, New Stock, Returned, Sold, Internal Use, Damaged, Out of Date, Transfers, Adjustment, Others, End Stock", End Value"%\n';

                $.each(table.rows().data(), function () {
                    var ProductName = this.ProductName;
                    var SKU = this.SKU;
                    var Barcode = this.Barcode;
                    var BrandName = this.BrandName;
                    var CategoryName = this.CategoryName;
                    var SupplierName = this.SupplierName;
                    var StartStock = $.number(this.StartStock, 0, '.', ',');
                    var StartStockValue = $.number(this.StartStockValue, 0, '.', ',');
                    var OrdersReceived = $.number(this.OrsdersReceived, 0, '.', ',');
                    var DeletedInvoice = $.number(this.DeletedInvoice, 0, '.', ',');
                    var NewStock = $.number(this.NewStock, 0, '.', ',');
                    var Returned = $.number(this.Returned, 0, '.', ',');
                    var Sold = $.number(this.Sold, 0, '.', ',');
                    var InternalUse = $.number(this.InternalUse, 0, '.', ',');
                    var Damaged = $.number(this.Damaged, 0, '.', ',');
                    var OutOfDate = $.number(this.OutOfDate, 0, '.', ',');
                    var Transfers = $.number(this.Transfers, 0, '.', ',');
                    var Adjustments = $.number(this.Adjustments, 0, '.', ',');
                    var Others = $.number(this.Others, 0, '.', ',');
                    var EndStock = $.number(this.EndStock, 0, '.', ',');
                    var EndStockValue = $.number(this.EndStockValue, 0, '.', ',');

                    output += '"' + ProductName + '",'
                            + '"' + SKU + '",'
                            + '"' + Barcode + '",'
                            + '"' + BrandName + '",'
                            + '"' + CategoryName + '",'
                            + '"' + SupplierName + '",'
                            + '"' + StartStock + '",'
                            + '"' + StartStockValue + '",'
                            + '"' + OrdersReceived + '",'
                            + '"' + DeletedInvoice + '",'
                            + '"' + NewStock + '",'
                            + '"' + Returned + '",'
                            + '"' + Sold + '",'
                            + '"' + InternalUse + '",'
                            + '"' + Damaged + '",'
                            + '"' + OutOfDate + '",'
                            + '"' + Transfers + '",'
                            + '"' + Adjustments + '",'
                            + '"' + Others + '",'
                            + '"' + EndStock + '",'
                            + '"' + EndStockValue + '"\n';
                })

                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCSV');
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i> PDF',
            title: "Stock Movement Summary",
            filename: "Stock Movement Summary",
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