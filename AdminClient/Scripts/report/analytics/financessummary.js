var table;
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
        }, "/Reports/GetDataTableSalesSummaryPayments", [
             {
                 "data": "PaymentTypeName", "name": "PaymentTypeName", "width": "30%", "class": "text-left"
             },
             {
                 "data": "PaymentAmount", "name": "PaymentAmount", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                     return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
                 }
             },
        ], true, false, false, false, null, true, null);
    }
    var loaddata = function () {
        $.RequestAjax("/Reports/GetDataTableSalesSummaryPayments", JSON.stringify({
            "LocationID": $("#formReport #LocationID").val() == null ? 0 : $("#formReport #LocationID").val(),
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }), function (data) {
            var linetitle = '<div class="_35jn3W">Payments</div>';
            var linetotal = '<div class="_35cX3G _2WTCka"></div><div class="_35cX3G"><div class="_2JEBY3 _1rpjRA"><a class="_1FszNF SVCc33 _1qlFXq" href="/Reports/PaymentsSummary">Total payments</a></div><div class="_281HP7 _2JEBY3 _1rpjRA" id="TotalPayments"></div></div>';
            var lineitem = '<div class="_35cX3G"><div class="_2JEBY3">@PaymentTypeName</div><div class="_281HP7 _2JEBY3">@PaymentAmount</div></div>';
            $("#divPaymentDetail").html(linetitle);
            if (data.data.length > 0) {
                $.each(data.data, function () {
                    $("#divPaymentDetail").append(lineitem.replace("@PaymentTypeName", this.PaymentTypeName).replace("@PaymentAmount", Window.CurrencySymbol + $.number(this.PaymentAmount, Window.NumberDecimal, '.', ',')));
                })
            }
            $("#divPaymentDetail").append(linetotal);
        })

        $.RequestAjax("/Reports/GetDataTableFinancesSummary", JSON.stringify({
            "LocationID": $("#formReport #LocationID").val() == null ? 0 : $("#formReport #LocationID").val(),
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }), function (data) {
            if (data.data.length > 0) {
                $("#GrossSales").html(Window.CurrencySymbol + $.number(data.data[0].GrossSales, Window.NumberDecimal, '.', ','));
                $("#Discounts").html(Window.CurrencySymbol + $.number(data.data[0].Discounts, Window.NumberDecimal, '.', ','));
                $("#Refunds").html(Window.CurrencySymbol + $.number(data.data[0].Refunds, Window.NumberDecimal, '.', ','));
                $("#NetSales").html(Window.CurrencySymbol + $.number(data.data[0].NetSales, Window.NumberDecimal, '.', ','));
                $("#Taxes").html(Window.CurrencySymbol + $.number(data.data[0].Taxes, Window.NumberDecimal, '.', ','));
                $("#TotalSales").html(Window.CurrencySymbol + $.number(data.data[0].TotalSales, Window.NumberDecimal, '.', ','));
                $("#VoucherSales").html(Window.CurrencySymbol + $.number(data.data[0].VoucherSales, Window.NumberDecimal, '.', ','));
                $("#VoucherRedemptions").html(Window.CurrencySymbol + $.number(data.data[0].VoucherRedemptions, Window.NumberDecimal, '.', ','));
                $("#VoucherOutstandingBalance").html(Window.CurrencySymbol + $.number(data.data[0].VoucherOutstandingBalance, Window.NumberDecimal, '.', ','));
                $("#TotalPayments").html(Window.CurrencySymbol + $.number(data.data[0].TotalPayments, Window.NumberDecimal, '.', ','));
                $("#TipsCollected").html(Window.CurrencySymbol + $.number(data.data[0].TipsCollected, Window.NumberDecimal, '.', ','));
            }
            else {
            }
        }, function () {
        })
    }
    loaddata();
    $("#formReport #btnView").click(function () {
        loaddata();
    })
})