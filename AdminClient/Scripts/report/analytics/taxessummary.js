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

    var loadTable = function () {
        table = $("#table").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableTaxesSummary", [
      
       {
           "data": "TaxName", "name": "TaxName", "width": "15%", "class": "text-left"
       },
       {
           "data": "LocationName", "name": "LocationName", "width": "20%", "class": "text-left"
       },
       {
           "data": "ItemSales", "name": "ItemSales", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return ($.number(data,"", '.', ','));;
           }
       },
       {
           "data": "TaxRate", "name": "TaxRate", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return ($.number(data, Window.NumberDecimal, '.', ','));;
           }
       },
       
         {
             "data": "TotalTax", "name": "TotalTax", "class": "text-right", "width": "10%", "render": function (data, type, row) {
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
            sheetName: "Taxes Summary",
            title: null,
            filename: "Taxes Summary",
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
                var arrayColWidth = [20, 10, 10, 20, 10];
                //#region fill data header

                rowPos = functions.AddRow(["Tax","Item Sales","Rate","Location","Amount"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion
                //#region fill data to excel

                
                var sTotalTax = 0;
                $.each(table.rows().data(), function () {
                    var TaxName = this.TaxName;
                    var ItemSales = this.ItemSales;
                    var TaxRate = $.number(this.TaxRate, Window.NumberDecimal, '.', ',');
                    var LocationName = this.LocationName;
                    var TotalTax = $.number(this.TotalTax, Window.NumberDecimal, '.', ',');

                    sTotalTax = sTotalTax + parseFloat(TotalTax);
                    rowPos = functions.AddRow([TaxName , ItemSales, TaxRate, LocationName, TotalTax], rowPos);
                })
                rowPos = functions.AddRow(["Total", "", "", "", $.number(sTotalTax, Window.NumberDecimal, '.', ',')])
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
            filename: "Taxes Summary",
            customize: function (output, config) {
            output = ' Tax, Item Sales, Rate, Location, Amount\n';
                    var sTotalTax = 0;
                    $.each(table.rows().data(), function () {
                        var TaxName = this.TaxName;
                        var ItemSales = this.ItemSales;
                        var TaxRate = $.number(this.TaxRate, Window.NumberDecimal, '.', ',');
                        var LocationName = this.LocationName;
                        var TotalTax = $.number(this.TotalTax, Window.NumberDecimal, '.', ',');

                        sTotalTax = sTotalTax + parseFloat(TotalTax);
                    output += '"' + TaxName + '",'
                            + '"' + ItemSales + '",'
                            + '"' + TaxRate + '",'
                            + '"' + LocationName + '",'
                            + '"' + TotalTax + '"\n';
                    })
                    output +=    '"' + "Total" + '",'
                               + '"' + "" + '",'
                               + '"' + "" + '",'
                               + '"' + "" + '",'
                               + '"' + sTotalTax + '"\n';


                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCSV');
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i> PDF',
            title: "Taxes Summary",
            filename: "Taxes Summary",
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