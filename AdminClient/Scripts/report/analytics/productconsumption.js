var table1;
var table2;
var table3;
var table4;
var table5;
var table6;
var table7;
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
            'Last 30 Days': [moment().tz(Window.TimeZone).subtract(30, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')],
            'All time': [moment('2018-01-01'), moment().tz(Window.TimeZone)]
        },
        locale: {
            "format": Window.FormatDateJS
        }
    });
    $("#formReport #LocationID").InStallSelect2('/Home/LoadSelect2ForLocation', 100, 'All Location', null, null, null, null, null, null, null, false);
    $("#formReport #StaffID").InStallSelect2('/Home/LoadSelect2ForUser', 100, 'All Staff', null, null, null, null, null, null, null, false);

    var loadTable1 = function () {
        table1 = $("#table1").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDateTableProductConsumption", [
          {
              "data": "StockTypeName", "name": "StockTypeName", "width": "30%", "class": "text-left"
          },
          {
              "data": "Value", "name": "Value", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                  return Window.CurrencySymbol + ($.number(data, Window.NumberDecimal, '.', ','));;
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
                    if (i == 0) {
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
    }
    var loadTable2 = function (StockType) {
        table2 = $("#table2").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
            "StockType": StockType,
        }, "/Reports/GetDateTableProductConsumptionDetail", [
            {
                "data": "ProductName", "name": "ProductName", "width": "10%", "class": "text-left"
            },
            {
                "data": "QuantityUsed", "name": "QuantityUsed", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return ($.number(data, 0, '.', ','));
                }
            },
            {
                "data": "AVGCostPrice", "name": "StartStock", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return Window.CurrencySymbol + ($.number(data, Window.NumberDecimal, '.', ','));
                }
            },
            {
                "data": "TotalCost", "name": "TotalCost", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return Window.CurrencySymbol + ($.number(data, Window.NumberDecimal, '.', ','));
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
    }
    var loadTable3 = function (StockType) {
        table3 = $("#table3").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
            "StockType": StockType,
        }, "/Reports/GetDateTableProductConsumptionDetail", [
            {
                "data": "ProductName", "name": "ProductName", "width": "10%", "class": "text-left"
            },
            {
                "data": "QuantityUsed", "name": "QuantityUsed", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return ($.number(data, 0, '.', ','));
                }
            },
            {
                "data": "AVGCostPrice", "name": "StartStock", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return Window.CurrencySymbol + ($.number(data, Window.NumberDecimal, '.', ','));
                }
            },
            {
                "data": "TotalCost", "name": "TotalCost", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return Window.CurrencySymbol + ($.number(data, Window.NumberDecimal, '.', ','));
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
    }
    var loadTable4 = function (StockType) {
        table4 = $("#table4").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
            "StockType": StockType,
        }, "/Reports/GetDateTableProductConsumptionDetail", [
            {
                "data": "ProductName", "name": "ProductName", "width": "10%", "class": "text-left"
            },
            {
                "data": "QuantityUsed", "name": "QuantityUsed", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return ($.number(data, 0, '.', ','));
                }
            },
            {
                "data": "AVGCostPrice", "name": "StartStock", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return Window.CurrencySymbol + ($.number(data, Window.NumberDecimal, '.', ','));
                }
            },
            {
                "data": "TotalCost", "name": "TotalCost", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return Window.CurrencySymbol + ($.number(data, Window.NumberDecimal, '.', ','));
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
    }
    var loadTable5 = function (StockType) {
        table5 = $("#table5").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
            "StockType": StockType,
        }, "/Reports/GetDateTableProductConsumptionDetail", [
            {
                "data": "ProductName", "name": "ProductName", "width": "10%", "class": "text-left"
            },
            {
                "data": "QuantityUsed", "name": "QuantityUsed", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return ($.number(data, 0, '.', ','));
                }
            },
            {
                "data": "AVGCostPrice", "name": "StartStock", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return Window.CurrencySymbol + ($.number(data, Window.NumberDecimal, '.', ','));
                }
            },
            {
                "data": "TotalCost", "name": "TotalCost", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return Window.CurrencySymbol + ($.number(data, Window.NumberDecimal, '.', ','));
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
    }
    var loadTable6 = function (StockType) {
        table6 = $("#table6").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
            "StockType": StockType,
        }, "/Reports/GetDateTableProductConsumptionDetail", [
            {
                "data": "ProductName", "name": "ProductName", "width": "10%", "class": "text-left"
            },
            {
                "data": "QuantityUsed", "name": "QuantityUsed", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return ($.number(data, 0, '.', ','));
                }
            },
            {
                "data": "AVGCostPrice", "name": "StartStock", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return Window.CurrencySymbol + ($.number(data, Window.NumberDecimal, '.', ','));
                }
            },
            {
                "data": "TotalCost", "name": "TotalCost", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return Window.CurrencySymbol + ($.number(data, Window.NumberDecimal, '.', ','));
                }
            },
        ], true, false, false, false, null, true, null, null, null);
    }
    var loadTable7 = function (StockType) {
        table7 = $("#table7").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
            "StockType": StockType,
        }, "/Reports/GetDateTableProductConsumptionDetail", [
            {
                "data": "ProductName", "name": "ProductName", "width": "10%", "class": "text-left"
            },
            {
                "data": "QuantityUsed", "name": "QuantityUsed", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return ($.number(data, 0, '.', ','));
                }
            },
            {
                "data": "AVGCostPrice", "name": "StartStock", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return Window.CurrencySymbol + ($.number(data, Window.NumberDecimal, '.', ','));
                }
            },
            {
                "data": "TotalCost", "name": "TotalCost", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return Window.CurrencySymbol + ($.number(data, Window.NumberDecimal, '.', ','));
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
        table7.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file-excel-o"></i>  Excel',
            extend: 'excelHtml5',
            isAutoWidth: false,
            isSTT: false,
            sheetName: "Product Consumption",
            title: null,
            filename: "Product Consumption",
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
                var arrayColWidth = [15, 15, 15, 15, 15, 15];

                rowPos = functions.AddRow(["Product Consumption"], rowPos);
                functions.MergeCells(rowPos, 1, 58);
                rowPos = functions.AddRow(["Stock Type", "Value"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                var sValue = 0;
                $.each(table1.rows().data(), function () {
                    var StockTypeName = this.StockTypeName;
                    var Value = $.number(this.Value, 0, '.', ',');
                    sValue = sValue + parseInt(this.Value);
                    rowPos = functions.AddRow([StockTypeName, Value], rowPos);
                })
                rowPos = functions.AddRow(["Total", sValue], rowPos);

                rowPos = functions.AddRow(["Internal Use"], rowPos);
                functions.MergeCells(rowPos, 5, 58);
                rowPos = functions.AddRow(["Product Name", "SKU", "Barcode", "Quantity Used", "AVG.Cost Price", "Total Cost"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                var sQuantityUsed = 0;
                var sAVGCostPrice = 0;
                var sTotalCost = 0;
                $.each(table2.rows().data(), function () {
                    var ProductName = this.ProductName;
                    var SKU = $.number(this.SKU, 0, '.', ',');
                    var Barcode = $.number(this.Barcode, 0, '.', ',');
                    var QuantityUsed = $.number(this.QuantityUsed, 0, '.', ',');
                    var AVGCostPrice = $.number(this.AVGCostPrice, Window.NumberDecimal, '.', ',');
                    var TotalCost = $.number(this.TotalCost, Window.NumberDecimal, '.', ',');
                    sQuantityUsed = sQuantityUsed + parseInt(this.QuantityUsed);
                    sAVGCostPrice = sAVGCostPrice + parseFloat(this.AVGCostPrice);
                    sTotalCost = sTotalCost + parseFloat(this.TotalCost);
                    rowPos = functions.AddRow([ProductName, SKU, Barcode, QuantityUsed, AVGCostPrice, TotalCost], rowPos);
                })
                rowPos = functions.AddRow(["Total", "", "", sQuantityUsed, sAVGCostPrice, sTotalCost], rowPos);

                rowPos = functions.AddRow(["Damaged"], rowPos);
                functions.MergeCells(rowPos, 5, 58);
                rowPos = functions.AddRow(["Product Name", "SKU", "Barcode", "Quantity Used", "AVG.Cost Price", "Total Cost"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                var sQuantityUsed = 0;
                var sAVGCostPrice = 0;
                var sTotalCost = 0;
                $.each(table3.rows().data(), function () {
                    var ProductName = this.ProductName;
                    var SKU = $.number(this.SKU, 0, '.', ',');
                    var Barcode = $.number(this.Barcode, 0, '.', ',');
                    var QuantityUsed = $.number(this.QuantityUsed, 0, '.', ',');
                    var AVGCostPrice = $.number(this.AVGCostPrice, Window.NumberDecimal, '.', ',');
                    var TotalCost = $.number(this.TotalCost, Window.NumberDecimal, '.', ',');
                    sQuantityUsed = sQuantityUsed + parseInt(this.QuantityUsed);
                    sAVGCostPrice = sAVGCostPrice + parseFloat(this.AVGCostPrice);
                    sTotalCost = sTotalCost + parseFloat(this.TotalCost);
                    rowPos = functions.AddRow([ProductName, SKU, Barcode, QuantityUsed, AVGCostPrice, TotalCost], rowPos);
                })
                rowPos = functions.AddRow(["Total", "", "", sQuantityUsed, sAVGCostPrice, sTotalCost], rowPos);

                rowPos = functions.AddRow(["Out of Date"], rowPos);
                functions.MergeCells(rowPos, 5, 58);
                rowPos = functions.AddRow(["Product Name", "SKU", "Barcode", "Quantity Used", "AVG.Cost Price", "Total Cost"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                var sQuantityUsed = 0;
                var sAVGCostPrice = 0;
                var sTotalCost = 0;
                $.each(table4.rows().data(), function () {
                    var ProductName = this.ProductName;
                    var SKU = $.number(this.SKU, 0, '.', ',');
                    var Barcode = $.number(this.Barcode, 0, '.', ',');
                    var QuantityUsed = $.number(this.QuantityUsed, 0, '.', ',');
                    var AVGCostPrice = $.number(this.AVGCostPrice, Window.NumberDecimal, '.', ',');
                    var TotalCost = $.number(this.TotalCost, Window.NumberDecimal, '.', ',');
                    sQuantityUsed = sQuantityUsed + parseInt(this.QuantityUsed);
                    sAVGCostPrice = sAVGCostPrice + parseFloat(this.AVGCostPrice);
                    sTotalCost = sTotalCost + parseFloat(this.TotalCost);
                    rowPos = functions.AddRow([ProductName, SKU, Barcode, QuantityUsed, AVGCostPrice, TotalCost], rowPos);
                })
                rowPos = functions.AddRow(["Total", "", "", sQuantityUsed, sAVGCostPrice, sTotalCost], rowPos);


                rowPos = functions.AddRow(["Adjustment"], rowPos);
                functions.MergeCells(rowPos, 5, 58);
                rowPos = functions.AddRow(["Product Name", "SKU", "Barcode", "Quantity Used", "AVG.Cost Price", "Total Cost"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                var sQuantityUsed = 0;
                var sAVGCostPrice = 0;
                var sTotalCost = 0;
                $.each(table5.rows().data(), function () {
                    var ProductName = this.ProductName;
                    var SKU = $.number(this.SKU, 0, '.', ',');
                    var Barcode = $.number(this.Barcode, 0, '.', ',');
                    var QuantityUsed = $.number(this.QuantityUsed, 0, '.', ',');
                    var AVGCostPrice = $.number(this.AVGCostPrice, Window.NumberDecimal, '.', ',');
                    var TotalCost = $.number(this.TotalCost, Window.NumberDecimal, '.', ',');
                    sQuantityUsed = sQuantityUsed + parseInt(this.QuantityUsed);
                    sAVGCostPrice = sAVGCostPrice + parseFloat(this.AVGCostPrice);
                    sTotalCost = sTotalCost + parseFloat(this.TotalCost);
                    rowPos = functions.AddRow([ProductName, SKU, Barcode, QuantityUsed, AVGCostPrice, TotalCost], rowPos);
                })
                rowPos = functions.AddRow(["Total", "", "", sQuantityUsed, sAVGCostPrice, sTotalCost], rowPos);


                rowPos = functions.AddRow(["Transfer"], rowPos);
                functions.MergeCells(rowPos, 5, 58);
                rowPos = functions.AddRow(["Product Name", "SKU", "Barcode", "Quantity Used", "AVG.Cost Price", "Total Cost"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                var sQuantityUsed = 0;
                var sAVGCostPrice = 0;
                var sTotalCost = 0;
                $.each(table6.rows().data(), function () {
                    var ProductName = this.ProductName;
                    var SKU = $.number(this.SKU, 0, '.', ',');
                    var Barcode = $.number(this.Barcode, 0, '.', ',');
                    var QuantityUsed = $.number(this.QuantityUsed, 0, '.', ',');
                    var AVGCostPrice = $.number(this.AVGCostPrice, Window.NumberDecimal, '.', ',');
                    var TotalCost = $.number(this.TotalCost, Window.NumberDecimal, '.', ',');
                    sQuantityUsed = sQuantityUsed + parseInt(this.QuantityUsed);
                    sAVGCostPrice = sAVGCostPrice + parseFloat(this.AVGCostPrice);
                    sTotalCost = sTotalCost + parseFloat(this.TotalCost);
                    rowPos = functions.AddRow([ProductName, SKU, Barcode, QuantityUsed, AVGCostPrice, TotalCost], rowPos);
                })
                rowPos = functions.AddRow(["Total", "", "", sQuantityUsed, sAVGCostPrice, sTotalCost], rowPos);

                rowPos = functions.AddRow(["Other"], rowPos);
                functions.MergeCells(rowPos, 5, 58);
                rowPos = functions.AddRow(["Product Name", "SKU", "Barcode", "Quantity Used", "AVG.Cost Price", "Total Cost"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                var sQuantityUsed = 0;
                var sAVGCostPrice = 0;
                var sTotalCost = 0;
                $.each(table7.rows().data(), function () {
                    var ProductName = this.ProductName;
                    var SKU = $.number(this.SKU, 0, '.', ',');
                    var Barcode = $.number(this.Barcode, 0, '.', ',');
                    var QuantityUsed = $.number(this.QuantityUsed, 0, '.', ',');
                    var AVGCostPrice = $.number(this.AVGCostPrice, Window.NumberDecimal, '.', ',');
                    var TotalCost = $.number(this.TotalCost, Window.NumberDecimal, '.', ',');
                    sQuantityUsed = sQuantityUsed + parseInt(this.QuantityUsed);
                    sAVGCostPrice = sAVGCostPrice + parseFloat(this.AVGCostPrice);
                    sTotalCost = sTotalCost + parseFloat(this.TotalCost);
                    rowPos = functions.AddRow([ProductName, SKU, Barcode, QuantityUsed, AVGCostPrice, TotalCost], rowPos);
                })
                rowPos = functions.AddRow(["Total", "", "", sQuantityUsed, sAVGCostPrice, sTotalCost], rowPos);
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
        table7.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i>  CSV',
            filename: "Product Consumption",
            customize: function (output, config) {

                output += 'Stock Type, Value\n';
                $.each(table1.rows().data(), function () {
                    var StockTypeName = this.StockTypeName;
                    var Value = this.Value;

                    output += '"' + StockTypeName + '",'
                            + '"' + Value + '"\n';
                })

                output += 'Internal Use\n';
                output += 'Product Name, SKU, Barcode,Quantity Used, Avg.Cost Price, Total Cost\n';
                $.each(table2.rows().data(), function () {
                    var ProductName = this.ProductName;
                    var SKU = $.number(this.SKU, 0, '.', ',');
                    var Barcode = $.number(this.Barcode, 0, '.', ',');
                    var QuantityUsed = $.number(this.QuantityUsed, 0, '.', ',');
                    var AVGCostPrice = $.number(this.AVGCostPrice, Window.NumberDecimal, '.', ',');
                    var TotalCost = $.number(this.TotalCost, Window.NumberDecimal, '.', ',');

                    output += '"' + ProductName + '",'
                            + '"' + SKU + '",'
                            + '"' + Barcode + '",'
                            + '"' + QuantityUsed + '",'
                            + '"' + AVGCostPrice + '",'
                            + '"' + TotalCost + '"\n';
                })

                output += 'Damaged\n';
                output += 'Product Name, SKU, Barcode,Quantity Used, Avg.Cost Price, Total Cost\n';
                $.each(table3.rows().data(), function () {
                    var ProductName = this.ProductName;
                    var SKU = $.number(this.SKU, 0, '.', ',');
                    var Barcode = $.number(this.Barcode, 0, '.', ',');
                    var QuantityUsed = $.number(this.QuantityUsed, 0, '.', ',');
                    var AVGCostPrice = $.number(this.AVGCostPrice, Window.NumberDecimal, '.', ',');
                    var TotalCost = $.number(this.TotalCost, Window.NumberDecimal, '.', ',');

                    output += '"' + ProductName + '",'
                            + '"' + SKU + '",'
                            + '"' + Barcode + '",'
                            + '"' + QuantityUsed + '",'
                            + '"' + AVGCostPrice + '",'
                            + '"' + TotalCost + '"\n';
                })

                output += 'Out of Date\n';
                output += 'Product Name, SKU, Barcode,Quantity Used, Avg.Cost Price, Total Cost\n';
                $.each(table4.rows().data(), function () {
                    var ProductName = this.ProductName;
                    var SKU = $.number(this.SKU, 0, '.', ',');
                    var Barcode = $.number(this.Barcode, 0, '.', ',');
                    var QuantityUsed = $.number(this.QuantityUsed, 0, '.', ',');
                    var AVGCostPrice = $.number(this.AVGCostPrice, Window.NumberDecimal, '.', ',');
                    var TotalCost = $.number(this.TotalCost, Window.NumberDecimal, '.', ',');

                    output += '"' + ProductName + '",'
                            + '"' + SKU + '",'
                            + '"' + Barcode + '",'
                            + '"' + QuantityUsed + '",'
                            + '"' + AVGCostPrice + '",'
                            + '"' + TotalCost + '"\n';
                })

                output += 'Adjustment\n';
                output += 'Product Name, SKU, Barcode,Quantity Used, Avg.Cost Price, Total Cost\n';
                $.each(table5.rows().data(), function () {
                    var ProductName = this.ProductName;
                    var SKU = $.number(this.SKU, 0, '.', ',');
                    var Barcode = $.number(this.Barcode, 0, '.', ',');
                    var QuantityUsed = $.number(this.QuantityUsed, 0, '.', ',');
                    var AVGCostPrice = $.number(this.AVGCostPrice, Window.NumberDecimal, '.', ',');
                    var TotalCost = $.number(this.TotalCost, Window.NumberDecimal, '.', ',');

                    output += '"' + ProductName + '",'
                            + '"' + SKU + '",'
                            + '"' + Barcode + '",'
                            + '"' + QuantityUsed + '",'
                            + '"' + AVGCostPrice + '",'
                            + '"' + TotalCost + '"\n';
                })

                output += 'Transfer\n';
                output += 'Product Name, SKU, Barcode,Quantity Used, Avg.Cost Price, Total Cost\n';
                $.each(table6.rows().data(), function () {
                    var ProductName = this.ProductName;
                    var SKU = $.number(this.SKU, 0, '.', ',');
                    var Barcode = $.number(this.Barcode, 0, '.', ',');
                    var QuantityUsed = $.number(this.QuantityUsed, 0, '.', ',');
                    var AVGCostPrice = $.number(this.AVGCostPrice, Window.NumberDecimal, '.', ',');
                    var TotalCost = $.number(this.TotalCost, Window.NumberDecimal, '.', ',');

                    output += '"' + ProductName + '",'
                            + '"' + SKU + '",'
                            + '"' + Barcode + '",'
                            + '"' + QuantityUsed + '",'
                            + '"' + AVGCostPrice + '",'
                            + '"' + TotalCost + '"\n';
                })

                output += 'Other\n';
                output += 'Product Name, SKU, Barcode,Quantity Used, Avg.Cost Price, Total Cost\n';
                $.each(table7.rows().data(), function () {
                    var ProductName = this.ProductName;
                    var SKU = $.number(this.SKU, 0, '.', ',');
                    var Barcode = $.number(this.Barcode, 0, '.', ',');
                    var QuantityUsed = $.number(this.QuantityUsed, 0, '.', ',');
                    var AVGCostPrice = $.number(this.AVGCostPrice, Window.NumberDecimal, '.', ',');
                    var TotalCost = $.number(this.TotalCost, Window.NumberDecimal, '.', ',');

                    output += '"' + ProductName + '",'
                            + '"' + SKU + '",'
                            + '"' + Barcode + '",'
                            + '"' + QuantityUsed + '",'
                            + '"' + AVGCostPrice + '",'
                            + '"' + TotalCost + '"\n';
                })
                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCSV');
    }

    var loaddata = function () {
        if ($.fn.DataTable.isDataTable('#table1'))
            table1.destroy();
        if ($.fn.DataTable.isDataTable('#table2'))
            table2.destroy();
        if ($.fn.DataTable.isDataTable('#table3'))
            table3.destroy();
        if ($.fn.DataTable.isDataTable('#table4'))
            table4.destroy();
        if ($.fn.DataTable.isDataTable('#table5'))
            table5.destroy();
        if ($.fn.DataTable.isDataTable('#table6'))
            table6.destroy();
        if ($.fn.DataTable.isDataTable('#table7'))
            table7.destroy();

        loadTable1();
        loadTable2("stock_internal");
        loadTable3("stock_damaged");
        loadTable4("stock_out_of_date");
        loadTable5("stock_adjustment_decrease");
        loadTable6("stock_transfer_decrease");
        loadTable7("stock_other_decrease");

        var text2 = "";
        text2 += $("#formReport #searchDate").data('daterangepicker').startDate.format(Window.FormatDateWithDayOfWeekJS)
        text2 += " to " + $("#formReport #searchDate").data('daterangepicker').endDate.format(Window.FormatDateWithDayOfWeekJS)
        var StaffID = $("#formReport #StaffID").val();
        if (StaffID == null || StaffID == "" || StaffID == "0") {
            text2 += ", all staff";
        }
        else {
            text2 += ", " + $("#formReport #StaffID").text();
        }

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
    //#region Event
    $("#formReport #btnView").click(function () {
        loaddata();
    })
    //#endregion

})