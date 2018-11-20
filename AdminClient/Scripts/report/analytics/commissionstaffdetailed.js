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
            'Last 30 Days': [moment().tz(Window.TimeZone).subtract(30, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')],
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
        }, "/Reports/GetDataTableCommissionStaffDetailed", [
            {
                "data": "InvoiceDate", "name": "InvoiceDate", "class": "text-right", "width": "15%", "render": function (data, type, row) {
                    return moment(data).format(Window.FormatDateWithDayOfWeekJS);
                }
            },
            {
                "data": "InvoiceNo", "name": "InvoiceNo", "width": "15%", "class": "text-left"
            },
            {
                "data": "StaffIV", "name": "StaffIV", "width": "15%", "class": "text-left"
            },
            {
                "data": "ItemName", "name": "ItemName", "width": "15%", "class": "text-left"
            },
            {
                "data": "Quantity", "name": "Quantity", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return ($.number(data, 0, '.', ','));
                }
            },
            {
                "data": "SaleValue", "name": "SaleValue", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
                }
            },
            {
                "data": "CommissionRate", "name": "CommissionRate", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return ($.number(data, 2, '.', ','));
                }
            },
            {
                "data": "CommissionAmount", "name": "CommissionAmount", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
                }
            },
        ], true, false, false, false, null, true, null,
        function (setting) {
            var api = this.api();
            if (api.rows().data().count() > 0) {
                var length = api.columns()[0].length;
                var html = "<tr><td colspan='4' class='text-center'><strong>Total</strong></td>";
                for (i = 4; i < length; ++i) {
                    var sum = this.api().column(i).data().sum();
                    sumCols[i] = sum;
                    if (i == 4) {
                        html += "<td class='text-right'><strong>" + ($.number(sum, 0, '.', ',')) + "</strong></td>";
                    }
                    else if (i == 6) {
                        html += "<td class='text-right'><strong></strong></td>";
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
            isAutoWidth: true,
            sheetName: "Staff Commission Detailed",
            title: "Staff Commission Detailed",
            filename: "Staff Commission Detailed",
        }, '#buttonExcel');
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i>  CSV',
            filename: "Staff Commission Detailed",
            extend: 'csvHtml5',
        }, '#buttonCSV');
    }
    var loaddata = function () {
        if ($.fn.DataTable.isDataTable('#table'))
            table.destroy();
        loadTable();

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