var table1;
var table2;
var table3;
var table4;
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
            'This month': [moment().tz(Window.TimeZone).startOf('month'), moment().tz(Window.TimeZone)],
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
            "ByType": "type",
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableDiscountSummary", [

       {
           "data": "Name", "name": "Name", "width": "30%", "class": "text-left"
       },
       {
           "data": "ItemsDiscounted", "name": "ItemsDiscounted", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return ($.number(data, "", '.', ','));
           }
       },
       {
           "data": "ItemsValue", "name": "ItemsValue", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
           }
       },
       {
           "data": "DiscountAmount", "name": "DiscountAmount", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
           }
       },
       {
           "data": "DiscountRefunds", "name": "DiscountRefunds", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
           }
       },
       {
           "data": "NetDiscounts", "name": "NetDiscounts", "class": "text-right", "width": "10%", "render": function (data, type, row) {
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
                    if (i == 1) {
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
    }
    var loadTable2 = function () {
        table2 = $("#table2").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "ByType": "service",
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableDiscountSummary", [

       {
           "data": "Name", "name": "Name", "width": "30%", "class": "text-left"
       },
       {
           "data": "ItemsDiscounted", "name": "ItemsDiscounted", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return ($.number(data, "", '.', ','));;
           }
       },
       {
           "data": "ItemsValue", "name": "ItemsValue", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
           }
       },
       {
           "data": "DiscountAmount", "name": "DiscountAmount", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
           }
       },
        {
            "data": "DiscountRefunds", "name": "DiscountRefunds", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
            }
        },
         {
             "data": "NetDiscounts", "name": "NetDiscounts", "class": "text-right", "width": "10%", "render": function (data, type, row) {
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
                    if (i == 1) {
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
    }
    var loadTable3 = function () {
        table3 = $("#table3").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "ByType": "product",
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableDiscountSummary", [

       {
           "data": "Name", "name": "Name", "width": "30%", "class": "text-left"
       },
       {
           "data": "ItemsDiscounted", "name": "ItemsDiscounted", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return ($.number(data, "", '.', ','));;
           }
       },
       {
           "data": "ItemsValue", "name": "ItemsValue", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
           }
       },
       {
           "data": "DiscountAmount", "name": "DiscountAmount", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
           }
       },
        {
            "data": "DiscountRefunds", "name": "DiscountRefunds", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
            }
        },
         {
             "data": "NetDiscounts", "name": "NetDiscounts", "class": "text-right", "width": "10%", "render": function (data, type, row) {
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
                    if (i == 1) {
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
    }
    var loadTable4 = function () {
        table4 = $("#table4").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "ByType": "staff",
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableDiscountSummary", [

       {
           "data": "Name", "name": "Name", "width": "30%", "class": "text-left"
       },
       {
           "data": "ItemsDiscounted", "name": "ItemsDiscounted", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return ($.number(data, "", '.', ','));;
           }
       },
       {
           "data": "ItemsValue", "name": "ItemsValue", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
           }
       },
       {
           "data": "DiscountAmount", "name": "DiscountAmount", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
           }
       },
       {
           "data": "DiscountRefunds", "name": "DiscountRefunds", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
           }
       },
       {
           "data": "NetDiscounts", "name": "NetDiscounts", "class": "text-right", "width": "10%", "render": function (data, type, row) {
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
                    if (i == 1) {
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
        table4.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file-excel-o"></i>  Excel',
            extend: 'excelHtml5',
            isAutoWidth: false,
            isSTT: false,
            sheetName: "Discount Summary",
            title: null,
            filename: "Discount Summary",
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

                //Discount by type 
                rowPos = functions.AddRow(["Discount by Type"], rowPos);
                functions.MergeCells(rowPos, 5, 58);
                rowPos = functions.AddRow(["Discount Type", "Items Discounted", "Items Value", "Discount Amount", "Discount Refunds", "Net Discounts"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                var sItemsDiscounted = 0;
                var sItemsValue = 0;
                var sDiscountAmount = 0;
                var sDiscountRefunds = 0;
                var sNetDiscounts = 0;
                $.each(table1.rows().data(), function () {
                    var Name = this.Name;
                    var ItemsDiscounted = this.ItemsDiscounted;
                    var ItemsValue = $.number(this.ItemsValue, Window.NumberDecimal, '.', ',');
                    var DiscountAmount = $.number(this.DiscountAmount, Window.NumberDecimal, '.', ',');
                    var DiscountRefunds = $.number(this.DiscountRefunds, Window.NumberDecimal, '.', ',');
                    var NetDiscounts = $.number(this.NetDiscounts, Window.NumberDecimal, '.', ',');

                    sItemsDiscounted = sItemsDiscounted + parseInt(this.ItemsDiscounted);
                    sItemsValue = sItemsValue + parseFloat(this.ItemsValue);
                    sDiscountAmount = sDiscountAmount + parseFloat(this.DiscountAmount);
                    sDiscountRefunds = sDiscountRefunds + parseFloat(this.DiscountRefunds);
                    sNetDiscounts = sNetDiscounts + parseFloat(this.NetDiscounts);
                    rowPos = functions.AddRow([Name, ItemsDiscounted, ItemsValue, DiscountAmount, DiscountRefunds, NetDiscounts], rowPos);
                })
                rowPos = functions.AddRow(["Total", sItemsDiscounted, sItemsValue, sDiscountAmount, sDiscountRefunds, sNetDiscounts], rowPos);
                rowPos = functions.AddRow([]);

                //Discount by Service
                rowPos = functions.AddRow(["Discount by Service"], rowPos);
                functions.MergeCells(rowPos, 5, 58);
                rowPos = functions.AddRow(["Service Name", "Items Discounted", "Items Value", "Discount Amount", "Discount Refunds", "Net Discounts"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                var sItemsDiscounted = 0;
                var sItemsValue = 0;
                var sDiscountAmount = 0;
                var sDiscountRefunds = 0;
                var sNetDiscounts = 0;
                $.each(table2.rows().data(), function () {
                    var Name = this.Name;
                    var ItemsDiscounted = this.ItemsDiscounted;
                    var ItemsValue = $.number(this.ItemsValue, Window.NumberDecimal, '.', ',');
                    var DiscountAmount = $.number(this.DiscountAmount, Window.NumberDecimal, '.', ',');
                    var DiscountRefunds = $.number(this.DiscountRefunds, Window.NumberDecimal, '.', ',');
                    var NetDiscounts = $.number(this.NetDiscounts, Window.NumberDecimal, '.', ',');

                    sItemsDiscounted = sItemsDiscounted + parseInt(this.ItemsDiscounted);
                    sItemsValue = sItemsValue + parseFloat(this.ItemsValue);
                    sDiscountAmount = sDiscountAmount + parseFloat(this.DiscountAmount);
                    sDiscountRefunds = sDiscountRefunds + parseFloat(this.DiscountRefunds);
                    sNetDiscounts = sNetDiscounts + parseFloat(this.NetDiscounts);
                    rowPos = functions.AddRow([Name, ItemsDiscounted, ItemsValue, DiscountAmount, DiscountRefunds, NetDiscounts], rowPos);
                })
                rowPos = functions.AddRow(["Total", sItemsDiscounted, sItemsValue, sDiscountAmount, sDiscountRefunds, sNetDiscounts], rowPos);
                rowPos = functions.AddRow([]);

                //Discount by Product
                rowPos = functions.AddRow(["Discount by Product "], rowPos);
                functions.MergeCells(rowPos, 5, 58);
                rowPos = functions.AddRow(["Product Name", "Items Discounted", "Items Value", "Discount Amount", "Discount Refunds", "Net Discounts"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                var sItemsDiscounted = 0;
                var sItemsValue = 0;
                var sDiscountAmount = 0;
                var sDiscountRefunds = 0;
                var sNetDiscounts = 0;
                $.each(table3.rows().data(), function () {
                    var Name = this.Name;
                    var ItemsDiscounted = this.ItemsDiscounted;
                    var ItemsValue = $.number(this.ItemsValue, Window.NumberDecimal, '.', ',');
                    var DiscountAmount = $.number(this.DiscountAmount, Window.NumberDecimal, '.', ',');
                    var DiscountRefunds = $.number(this.DiscountRefunds, Window.NumberDecimal, '.', ',');
                    var NetDiscounts = $.number(this.NetDiscounts, Window.NumberDecimal, '.', ',');

                    sItemsDiscounted = sItemsDiscounted + parseInt(this.ItemsDiscounted);
                    sItemsValue = sItemsValue + parseFloat(this.ItemsValue);
                    sDiscountAmount = sDiscountAmount + parseFloat(this.DiscountAmount);
                    sDiscountRefunds = sDiscountRefunds + parseFloat(this.DiscountRefunds);
                    sNetDiscounts = sNetDiscounts + parseFloat(this.NetDiscounts);
                    rowPos = functions.AddRow([Name, ItemsDiscounted, ItemsValue, DiscountAmount, DiscountRefunds, NetDiscounts], rowPos);
                })
                rowPos = functions.AddRow(["Total", sItemsDiscounted, sItemsValue, sDiscountAmount, sDiscountRefunds, sNetDiscounts], rowPos);
                rowPos = functions.AddRow([]);

                //Discount by Staff
                rowPos = functions.AddRow(["Discount by Staff"], rowPos);
                functions.MergeCells(rowPos, 5, 58);
                rowPos = functions.AddRow(["Staff Name", "Items Discounted", "Items Value", "Discount Amount", "Discount Refunds", "Net Discounts"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                var sItemsDiscounted = 0;
                var sItemsValue = 0;
                var sDiscountAmount = 0;
                var sDiscountRefunds = 0;
                var sNetDiscounts = 0;
                $.each(table4.rows().data(), function () {
                    var Name = this.Name;
                    var ItemsDiscounted = this.ItemsDiscounted;
                    var ItemsValue = $.number(this.ItemsValue, Window.NumberDecimal, '.', ',');
                    var DiscountAmount = $.number(this.DiscountAmount, Window.NumberDecimal, '.', ',');
                    var DiscountRefunds = $.number(this.DiscountRefunds, Window.NumberDecimal, '.', ',');
                    var NetDiscounts = $.number(this.NetDiscounts, Window.NumberDecimal, '.', ',');


                    sItemsDiscounted = sItemsDiscounted + parseInt(this.ItemsDiscounted);
                    sItemsValue = sItemsValue + parseFloat(this.ItemsValue);
                    sDiscountAmount = sDiscountAmount + parseFloat(this.DiscountAmount);
                    sDiscountRefunds = sDiscountRefunds + parseFloat(this.DiscountRefunds);
                    sNetDiscounts = sNetDiscounts + parseFloat(this.NetDiscounts);
                    rowPos = functions.AddRow([Name, ItemsDiscounted, ItemsValue, DiscountAmount, DiscountRefunds, NetDiscounts], rowPos);
                })
                rowPos = functions.AddRow(["Total", sItemsDiscounted, sItemsValue, sDiscountAmount, sDiscountRefunds, sNetDiscounts], rowPos);
                rowPos = functions.AddRow([]);
                //  Set column widths
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
        table4.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i>  CSV',
            filename: "Discount Summary",
            customize: function (output, config) {
                output = 'Discount by Type\n';
                output += 'Discount Type, Item Discounted, Items Value, Discount Amount,Discount Refunds, Net Discount\n';
                $.each(table1.rows().data(), function () {
                    var Name = this.Name;
                    var ItemsDiscounted = this.ItemsDiscounted;
                    var ItemsValue = $.number(this.ItemsValue, Window.NumberDecimal, '.', ',');
                    var DiscountAmount = $.number(this.DiscountAmount, Window.NumberDecimal, '.', ',');
                    var DiscountRefunds = $.number(this.DiscountRefunds, Window.NumberDecimal, '.', ',');
                    var NetDiscounts = $.number(this.NetDiscounts, Window.NumberDecimal, '.', ',');

                    output += '"' + Name + '",'
                            + '"' + ItemsDiscounted + '",'
                            + '"' + ItemsValue + '",'
                            + '"' + DiscountAmount + '",'
                            + '"' + DiscountRefunds + '",'
                            + '"' + NetDiscounts + '"\n';
                })
                output += 'Discount by service\n';
                output += 'Service Name, Item Discounted, Items Value, Discount Amount,Discount Refunds, Net Discount\n';
                $.each(table2.rows().data(), function () {
                    var Name = this.Name;
                    var ItemsDiscounted = this.ItemsDiscounted;
                    var ItemsValue = $.number(this.ItemsValue, Window.NumberDecimal, '.', ',');
                    var DiscountAmount = $.number(this.DiscountAmount, Window.NumberDecimal, '.', ',');
                    var DiscountRefunds = $.number(this.DiscountRefunds, Window.NumberDecimal, '.', ',');
                    var NetDiscounts = $.number(this.NetDiscounts, Window.NumberDecimal, '.', ',');

                    output += '"' + Name + '",'
                            + '"' + ItemsDiscounted + '",'
                            + '"' + ItemsValue + '",'
                            + '"' + DiscountAmount + '",'
                            + '"' + DiscountRefunds + '",'
                            + '"' + NetDiscounts + '"\n';
                })
                output += 'Discount by product\n';
                output += 'Product Name, Item Discounted, Items Value, Discount Amount,Discount Refunds, Net Discount\n';
                $.each(table3.rows().data(), function () {
                    var Name = this.Name;
                    var ItemsDiscounted = this.ItemsDiscounted;
                    var ItemsValue = $.number(this.ItemsValue, Window.NumberDecimal, '.', ',');
                    var DiscountAmount = $.number(this.DiscountAmount, Window.NumberDecimal, '.', ',');
                    var DiscountRefunds = $.number(this.DiscountRefunds, Window.NumberDecimal, '.', ',');
                    var NetDiscounts = $.number(this.NetDiscounts, Window.NumberDecimal, '.', ',');

                    output += '"' + Name + '",'
                            + '"' + ItemsDiscounted + '",'
                            + '"' + ItemsValue + '",'
                            + '"' + DiscountAmount + '",'
                            + '"' + DiscountRefunds + '",'
                            + '"' + NetDiscounts + '"\n';
                })
                output += 'Discount by service\n';
                output += 'Staff Name, Item Discounted, Items Value, Discount Amount,Discount Refunds, Net Discount\n';
                $.each(table4.rows().data(), function () {
                    var Name = this.Name;
                    var ItemsDiscounted = this.ItemsDiscounted;
                    var ItemsValue = $.number(this.ItemsValue, Window.NumberDecimal, '.', ',');
                    var DiscountAmount = $.number(this.DiscountAmount, Window.NumberDecimal, '.', ',');
                    var DiscountRefunds = $.number(this.DiscountRefunds, Window.NumberDecimal, '.', ',');
                    var NetDiscounts = $.number(this.NetDiscounts, Window.NumberDecimal, '.', ',');

                    output += '"' + Name + '",'
                            + '"' + ItemsDiscounted + '",'
                            + '"' + ItemsValue + '",'
                            + '"' + DiscountAmount + '",'
                            + '"' + DiscountRefunds + '",'
                            + '"' + NetDiscounts + '"\n';
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
        loadTable1();
        loadTable2();
        loadTable3();
        loadTable4();

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
    $("#formReport #btnView").click(function () {
        loaddata();
    })
})