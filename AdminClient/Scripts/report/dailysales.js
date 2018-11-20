//#region Method Support

//#endregion
var table1;
var table2;
$(function () {
    //#region Load data && setup control
    $("#formDailySales #LocationID").InStallSelect2('/Home/LoadSelect2ForLocation', 100, 'All Location', null, null, null, null, null, null, null, false);
    $("#formDailySales #ContaintDatePicker").InStallDatetimepickerScheulSingle("inputDate", "buttonPrevious", "buttonNext", "buttonToday", function () {
    });
    var loadTable1 = function () {
        table1 = $("#table1").InStallDatatable({
            "LocationID": $("#formDailySales #LocationID").val(),
            "date": $("#formDailySales #inputDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableTransactionSummary", [
     {
         "data": "ItemType", "name": "ItemType", "width": "25%", "class": "text-left", "render": function (data, type, row) {
             return row.Bold == 0 ? Window.ResourcesEnum[row.ItemType] : '<div style ="font-weight: bold;">' + Window.ResourcesEnum[row.ItemType] + '</div>';
         }
     },
     {
         "data": "SalesQty", "name": "SalesQty", "width": "25%", "class": "text-right", "render": function (data, type, row) {
             return row.Bold == 0 ? row.SalesQty : '<div style ="font-weight: bold;">' + row.SalesQty + '</div>';
         }
     },
     {
         "data": "RefundQty", "name": "RefundQty", "width": "25%", "class": "text-right", "render": function (data, type, row) {
             return row.Bold == 0 ? row.RefundQty : '<div style ="font-weight: bold;">' + row.RefundQty + '</div>';
         }
     },
     {
         "data": "GrossTotal", "name": "GrossTotal", "width": "25%", "class": "text-right", "render": function (data, type, row) {
             return row.Bold == 0 ? (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ',')) : '<div style ="font-weight: bold;">' + (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ',')) + '</div>';
         }
     },
        ], true, false, false, false, null, true, null, null, null);
    }
    var loadTable2 = function () {
        table2 = $("#table2").InStallDatatable({
            "LocationID": $("#formDailySales #LocationID").val(),
            "date": $("#formDailySales #inputDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableCashMovementSummary", [
     {
         "data": "PaymentTypeName", "name": "PaymentTypeName", "width": "25%", "class": "text-left", "render": function (data, type, row) {
             return row.Bold == 0 ? row.PaymentTypeName : '<div style ="font-weight: bold;">' + row.PaymentTypeName + '</div>';
         }
     },
     {
         "data": "PaymentsCollected", "name": "PaymentsCollected", "width": "25%", "class": "text-right", "render": function (data, type, row) {
             return row.Bold == 0 ? (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ',')) : '<div style ="font-weight: bold;">' + (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ',')) + '</div>';
         }
     },
     {
         "data": "RefundsPaid", "name": "RefundsPaid", "width": "25%", "class": "text-right", "render": function (data, type, row) {
             return row.Bold == 0 ? (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ',')) : '<div style ="font-weight: bold;">' + (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ',')) + '</div>';
         }
     },
        ], true, false, false, false, null, true, null, null, null);

        table2.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file-excel-o"></i>  Excel',
            extend: 'excelHtml5',
            isAutoWidth: false,
            isSTT: false,
            sheetName: "Daily Sales",
            title: null,
            filename: "Daily Sales",
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
                var arrayColWidth = [15, 15, 15, 15];
                //Transaction Summary
                //#region fill data header
                rowPos = functions.AddRow(["Transaction Summary"], rowPos);
                functions.MergeCells(rowPos, 3, 58);
                rowPos = functions.AddRow(["Item Type", "Sales Qty", "Refund Qty", "Gross Total"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion

                //#region fill data to excel
                $.each(table1.rows().data(), function () {
                    var ItemType = Window.ResourcesEnum[this.ItemType];
                    var SalesQty = $.number(this.SalesQty, 0, '.', ',');
                    var RefundQty = $.number(this.RefundQty, 0, '.', ',');
                    var GrossTotal = $.number(this.GrossTotal, Window.NumberDecimal, '.', ',');

                    rowPos = functions.AddRow([ItemType, SalesQty, RefundQty, GrossTotal], rowPos);
                })
                rowPos = functions.AddRow(["Cash Movement Summary"], rowPos);
                functions.MergeCells(rowPos, 2, 58);
                rowPos = functions.AddRow(["Payment Type", "Payments Collected", "Refunds Paid"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                $.each(table2.rows().data(), function () {
                    var PaymentTypeName = this.PaymentTypeName;
                    var PaymentsCollected = $.number(this.PaymentsCollected, Window.NumberDecimal, '.', ',');
                    var RefundsPaid = $.number(this.RefundsPaid, Window.NumberDecimal, '.', ',');
                    rowPos = functions.AddRow([PaymentTypeName, PaymentsCollected, RefundsPaid], rowPos);
                })
                //#endregion

                // Set column widths
                var cols = functions.CreateCellPos(rels, 'cols');
                $('worksheet', rels).prepend(cols);

                for (var i = 0, ien = 4 ; i < ien ; i++) {
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
        table2.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i>  CSV',
            filename: "Daily Sales",
            customize: function (output, config) {
                output = 'Transaction Summary\n';
                output += 'Item Type, Sales Qty, Refund Qty, Gross Total\n';
                $.each(table1.rows().data(), function () {
                    var ItemType = Window.ResourcesEnum[this.ItemType];
                    var SalesQty = $.number(this.SalesQty, 0, '.', ',');
                    var RefundQty = $.number(this.RefundQty, 0, '.', ',');
                    var GrossTotal = $.number(this.GrossTotal, Window.NumberDecimal, '.', ',');

                    output += '"' + ItemType + '",'
                            + '"' + SalesQty + '",'
                            + '"' + RefundQty + '",'
                            + '"' + GrossTotal + '"\n';
                })
                output += 'Cash Movement Summary\n';
                $.each(table2.rows().data(), function () {
                    var PaymentTypeName = this.PaymentTypeName;
                    var PaymentsCollected = $.number(this.PaymentsCollected, Window.NumberDecimal, '.', ',');
                    var RefundsPaid = $.number(this.RefundsPaid, Window.NumberDecimal, '.', ',');

                    output += '"' + PaymentTypeName + '",'
                            + '"' + PaymentsCollected + '",'
                            + '"' + RefundsPaid + '"\n';
                })
                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCSV');
        table1.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i> PDF',
            title: "Transaction Summary",
            filename: "DailySales",
            extend: 'pdfHtml5',
            download: "open",
            width: ['*', 'auto', 'auto', 'auto'],
            customize: function (doc, config) {
                doc.content.push({
                    text: "Cash Movement Summary",
                    style: 'title',
                    margin: [0, 25, 0, 12]
                });
                var row = [];
                row.push($.map(["Payment Type", "Payments Collected", "Refunds Paid"], function (d) {
                    return {
                        text: typeof d === 'string' ? d : d + '',
                        style: 'tableHeader'
                    };
                }));
                $.each(table2.rows().data(), function (index, item) {
                    delete item.Bold;
                    row.push($.map(item, function (d, key) {
                        return {
                            text: typeof d === 'string' ? d : d + '',
                            style: index % 2 ? 'tableBodyEven' : 'tableBodyOdd'
                        };
                    }));
                })
                doc.content.push({
                    table: {
                        widths: ['*', 'auto', 'auto'],
                        headerRows: 1,
                        body: row
                    },
                });
            },
        }, '#buttonPDF');
    }

    var loaddata = function () {
        if ($.fn.DataTable.isDataTable('#table1'))
            table1.destroy();
        if ($.fn.DataTable.isDataTable('#table2'))
            table2.destroy();
        loadTable1();
        loadTable2();

        $("#formDailySales #txtDailySales").text("Daily Sales: " + $("#formDailySales #inputDate").data('daterangepicker').startDate.format(Window.FormatDateWithDayOfWeekJS));
        var text2 = "All locations";
        var locationid = $("#formDailySales #LocationID").val();
        if (locationid == null) {
            text2 = "All locations";
        }
        else {
            if (locationid != 0) {
                text2 = $("#formDailySales #LocationID").text();
            }
        }
        text2 = text2 + ", generated " + moment().tz(Window.TimeZone).format(Window.FormatDateWithDayOfWeekJS) + " at " + moment().tz(Window.TimeZone).format(Window.FormatTimeJS);
        $("#formDailySales #txtDailySales2").text(text2);
    }
    loaddata();
    //#endregion

    //#region Event
    $("#formDailySales #btnView").click(function () {
        loaddata();
    })
    $(document).on("change", "#inputDate", function () {
        loaddata();
    })
    //#endregion
})