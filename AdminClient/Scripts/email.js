$(function () {
    $("#divResult").append("&nbsp;&nbsp;Run at: " + moment().format("DD MMM YYYY, HH:mm"));
    $.RequestAjax('/Email/SendEmail', null, function (data) {
        $("#divResult").append("<br>");
        $("#divResult").append("&nbsp;&nbsp;Run complete at: " + moment().format("DD MMM YYYY, HH:mm"));
        $("#divResult").append("<br>");
        $("#divResult").append("&nbsp;&nbsp;&nbsp;&nbsp;Total email: " + data.TotalEmail + " - Success: " + data.EmailOK + " - Fail: " + data.EmailFail);
        $("#divResult").append("<br>");
        $("#divResult").append("&nbsp;&nbsp;&nbsp;&nbsp;Total SMS: " + data.TotalSMS + " - Success: " + data.SMSOK + " - Fail: " + data.SMSFail);
    })
    setInterval(function () {
        $.RequestAjax('/Email/SendEmail', null, function (data) {
            $("#divResult").append("<br>");
            $("#divResult").append("&nbsp;&nbsp;Send complete at: " + moment().format("DD MMM YYYY, HH:mm"));
            $("#divResult").append("<br>");
            $("#divResult").append("&nbsp;&nbsp;&nbsp;&nbsp;Total email: " + data.TotalEmail + " - Success: " + data.EmailOK + " - Fail: " + data.EmailFail);
            $("#divResult").append("<br>");
            $("#divResult").append("&nbsp;&nbsp;&nbsp;&nbsp;Total SMS: " + data.TotalSMS + " - Success: " + data.SMSOK + " - Fail: " + data.SMSFail);
        })
    }, 60000)
})