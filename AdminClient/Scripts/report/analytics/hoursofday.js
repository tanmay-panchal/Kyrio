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
            'Last 30 Days': [moment().tz(Window.TimeZone).subtract(30, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')]
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
        }, "/Reports/GetDataTableSalesByHoursofDay", [
      {
          "data": "HourDisplay", "name": "HourDisplay", "width": "30%", "class": "text-left"
      },
      {
          "data": "SalesQuantity", "name": "SalesQuantity", "width": "20%", "class": "text-right"
      },
     {
         "data": "NetSales", "name": "NetSales", "class": "text-right", "width": "20%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
         }
     },
     {
         "data": "AVSale", "name": "AVSale", "class": "text-right", "width": "20%", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
         }
     },
     {
         "data": "PercentSale", "name": "PercentSale", "class": "text-right", "width": "10%", "render": function (data, type, row) {
             return ($.number(data, 2, '.', ','));;
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
                    else if (i == 4) {
                        html += "<td class='text-right'><strong>" + ($.number(sum, 0, '.', ',')) + "%" + "</strong></td>";
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
            sheetName: "Sales by Hours Of Day",
            title: null,
            filename: "Sales by Hours Of Day",
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
                var arrayColWidth = [20, 15, 15, 15, 15];
                //#region fill data header

                rowPos = functions.AddRow(["Hour", "Sales Qty", "Net Sales", "AV.Sale", "Sale% "], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion
                //debugger;
                //#region fill data to excel
                var sSalesQuantity = 0;
                var sNetSales = 0;
                var sAVSale = 0;
                var sPercentSale = 0;

                $.each(table.rows().data(), function () {
                    var HourDisplay = this.HourDisplay;
                    var SalesQuantity = this.SalesQuantity;
                    var NetSales = $.number(this.NetSales, Window.NumberDecimal, '.', ',');
                    var AVSale = $.number(this.AVSale, Window.NumberDecimal, '.', ',');
                    var PercentSale = $.number(this.PercentSale, 2, '.', ',');

                    sSalesQuantity = sSalesQuantity + parseInt(this.SalesQuantity);
                    sNetSales = sNetSales + parseFloat(this.NetSales);
                    sAVSale = sAVSale + parseFloat(this.AVSale);
                    sPercentSale = sPercentSale + parseFloat(this.PercentSale);
                    rowPos = functions.AddRow([HourDisplay, SalesQuantity, NetSales, AVSale, PercentSale], rowPos);
                })
                rowPos = functions.AddRow(["Total", sSalesQuantity, $.number(sNetSales, Window.NumberDecimal, '.', ','), $.number(sAVSale, Window.NumberDecimal, '.', ','), $.number(sPercentSale, 2, '.', ',')], rowPos);

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
            filename: "Sales by Hours Of Day",
            customize: function (output, config) {
                output = ' Hour, Sales Qty, Net Sales, AV.Sale, Sale%\n';

                var sSalesQuantity = 0;
                var sNetSales = 0;
                var sAVSale = 0;
                var sPercentSale = 0;
                $.each(table.rows().data(), function () {
                    var HourDisplay = this.HourDisplay;
                    var SalesQuantity = this.SalesQuantity;
                    var NetSales = $.number(this.NetSales, Window.NumberDecimal, '.', ',');
                    var AVSale = $.number(this.AVSale, Window.NumberDecimal, '.', ',');
                    var PercentSale = $.number(this.PercentSale, 2, '.', ',');

                    sSalesQuantity = sSalesQuantity + parseInt(this.SalesQuantity);
                    sNetSales = sNetSales + parseFloat(this.NetSales);
                    sAVSale = sAVSale + parseFloat(this.AVSale);
                    sPercentSale = sPercentSale + parseFloat(this.PercentSale);

                    output += '"' + HourDisplay + '",'
                            + '"' + SalesQuantity + '",'
                            + '"' + NetSales + '",'
                            + '"' + AVSale + '",'
                            + '"' + PercentSale + '"\n';
                })
                output += '"' + "Total" + '",'
                            + '"' + sSalesQuantity + '",'
                            + '"' + sNetSales + '",'
                            + '"' + sAVSale + '",'
                            + '"' + sPercentSale + '"\n';
                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCSV');
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i> PDF',
            title: "Sales by Hours Of Day",
            filename: "Sales by Hours Of Day",
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