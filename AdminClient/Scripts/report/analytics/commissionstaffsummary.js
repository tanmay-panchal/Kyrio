var table1;
var table2;
var table3;
var table4;
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
            "ByType": "staff",
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableCommissionStaff", [

       {
           "data": "StaffMember", "name": "StaffMember", "width": "30%", "class": "text-left"
       },
       {
           "data": "ServiceSalesTotal", "name": "ServiceSalesTotal", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return (Window.CurrencySymbol + $.number(data, "", '.', ','));
           }
       },
       {
           "data": "ServiceCommission", "name": "ServiceCommission", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return ($.number(data, 0, '.', ',') + "%");
           }
       },
       {
           "data": "ProductSalesTotal", "name": "ProductSalesTotal", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
           }
       },
       {
           "data": "ProductCommission", "name": "ProductCommission", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return ($.number(data, 0, '.', ',') + "%");
           }
       },
       {
           "data": "VoucherSaleTotal", "name": "VoucherSaleTotal", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
           }
       },
       {
           "data": "VoucherCommission", "name": "VoucherCommission", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return ($.number(data, 0, '.', ',') + "%");
           }
       },
       {
           "data": "CommissionTotal", "name": "CommissionTotal", "class": "text-right", "width": "10%", "render": function (data, type, row) {
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
                    if (i == 2 || i == 4 || i == 6) {
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
    }
    var loadTable2 = function () {
        table2 = $("#table2").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "ByType": "service",
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableCommissionService", [
        {
            "data": "ServiceName", "name": "ServiceName", "width": "30%", "class": "text-left"
        },
        {
            "data": "Qty", "name": "Qty", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return ($.number(data, 0, '.', ','));
            }
        },
        {
            "data": "SalesAmount", "name": "SalesAmount", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
            }
        },
        {
            "data": "RefundAmount", "name": "RefundAmount", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
            }
        },
        {
            "data": "SalesTotal", "name": "SalesTotal", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
            }
        },
        {
            "data": "AVGSalesPrice", "name": "AVGSalesPrice", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
            }
        },
        {
            "data": "CommissionTotal", "name": "CommissionTotal", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
            }
        },
        {
            "data": "AVGCommission", "name": "AVGCommission", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return ($.number(data, 0, '.', ',') + "%");
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
                    else if (i == 7) {
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
    }
    var loadTable3 = function () {
        table3 = $("#table3").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "ByType": "product",
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableCommissionProduct", [
        {
            "data": "ProductName", "name": "ProductName", "width": "30%", "class": "text-left"
        },
        {
            "data": "Qty", "name": "Qty", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return ($.number(data, 0, '.', ','));
            }
        },
        {
            "data": "SalesAmount", "name": "SalesAmount", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
            }
        },
        {
            "data": "RefundAmount", "name": "RefundAmount", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
            }
        },
        {
            "data": "SalesTotal", "name": "SalesTotal", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
            }
        },
        {
            "data": "AVGSalesPrice", "name": "AVGSalesPrice", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
            }
        },
        {
            "data": "CommissionTotal", "name": "CommissionTotal", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
            }
        },
        {
            "data": "AVGCommission", "name": "AVGCommission", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return ($.number(data, 0, '.', ',') + "%");
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
                    else if (i == 7) {
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
    }
    var loadTable4 = function () {
        table4 = $("#table4").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "ByType": "voucher",
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableCommissionVoucher", [
        {
            "data": "VoucherName", "name": "VoucherName", "width": "30%", "class": "text-left"
        },
        {
            "data": "Qty", "name": "Qty", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return ($.number(data, 0, '.', ','));
            }
        },
        {
            "data": "SalesAmount", "name": "SalesAmount", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
            }
        },
        {
            "data": "RefundAmount", "name": "RefundAmount", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
            }
        },
        {
            "data": "SalesTotal", "name": "SalesTotal", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
            }
        },
        {
            "data": "AVGSalesPrice", "name": "AVGSalesPrice", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
            }
        },
        {
            "data": "CommissionTotal", "name": "CommissionTotal", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
            }
        },
        {
            "data": "AVGCommission", "name": "AVGCommission", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return ($.number(data, 0, '.', ',') + "%");
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
                    else if (i == 7) {
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
        table4.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file-excel-o"></i>  Excel',
            extend: 'excelHtml5',
            isAutoWidth: true,
            sheetName: "Staff Commission Summary",
            title: "Staff Commission Summary",
            filename: "Staff Commission Summary",
        }, '#buttonExcel');
        table4.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i>  CSV',
            filename: "Staff Commission Summary",
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