var htmlMessageMobile = '<div class="message" onclick="@Link">'
                        + '<div><small class="text-muted">@DateUpdate</small></div>'
                        + '<div class="font-weight-bold">@Subject</div>'
                        + '<small class="text-muted">@Detail</small>'
                        + '</div><hr>';
var htmlMessageDestop = '<a class="dropdown-item" href="#" onclick="@Link">'
                        + '<div class="message">'
                        + '<div><small class="text-muted">@DateUpdate</small></div>'
                        + '<div class="font-weight-bold">@Subject</div>'
                        + '<div class="small text-muted">@Detail</div>'
                        + '</div></a>';
$(function () {

    //#region Extension Setup
    $.fn.extend({
        SearchScheul: function () {
            if ($(this).is("a")) {
                var htmlModal = '';
                $(this).click(function () {
                    if (htmlModal == "")
                        $.RequestAjaxText("/ContentHtml/Search/Index.html", function (data) { htmlModal = data; });
                    var modal = $(htmlModal);
                    modal.modal({
                        keyboard: false,
                        show: true,
                    });
                    modal.find("#search-scheul").keyup(function () {
                        var value = $.trim($(this).val());
                        var appointmentServiceContaint = modal.find("#container-appointmentservice-search");
                        var clientContaint = modal.find("#container-client-search");
                        clientContaint.html("");
                        appointmentServiceContaint.html('');
                        if (value != "") {
                            $.RequestAjax("/Home/SearchScheul", JSON.stringify({ search: $(this).val() }), function (reponsive) {
                                var clients = reponsive.Clients;
                                var appointmentServices = reponsive.AppointmentServices;
                                $.each(clients, function () {
                                    clientContaint.append('<div class="form-group col-12 p-0 m-0 d-flex mt-1 pb-1" style="cursor:pointer" data-id="' + this.ClientID + '" name="client-search-scheul">'
                                        + '<div style="height: 52px; width: 52px;" class="rounded-circle bg-danger p-2 text-center text-white"><i class="fa fa-user fa-lg ml-2 mr-2 pt-2"></i></div>'
                                        + '<div class="pl-1">'
                                        + '<p class="font-weight-normal pl-2 mb-1">' + (!this.FirstName ? "" : this.FirstName) + ' ' + (!this.LastName ? "" : this.LastName) + '</p>'
                                        + '<p class="font-weight-light mb-1">' + (!this.MobileNumber ? "" : this.MobileNumber) + ' ' + (!this.Email ? "" : this.Email) + '</p>'
                                        + '</div>'
                                        + '</div>');
                                    clientContaint.find("[name='client-search-scheul']:last").show("slow");
                                })
                                $.each(appointmentServices, function () {
                                    appointmentServiceContaint.append('<div class="form-group col-12 p-0 m-0 d-flex mt-1 pb-1 pl-2" style="cursor:pointer" data-id="' + this.AppointmentID + '" name="appointmentservice-search-scheul">'
                                        + '<div style="height: 52px; width: 52px;" class="rounded-circle bg-info p-2 text-center text-white"><i class="fa fa-calendar-o fa-lg ml-2 mr-2 pt-2"></i></div>'
                                        + '<div class="pl-1">'
                                        + '<p class="font-weight-normal pl-2 mb-1">' + this.ClientName + '</p>'
                                        + '<p class="font-weight-light mb-1">' + this.ServiceName + ' ' + moment(this.StartTime).format(Window.FormatDateWithDayOfWeekJS)
                                        + " " + moment(this.StartTime).startOf('day').add(this.StartTimeInSecond, "seconds").format(Window.FormatTimeJS) + '</p>'
                                        + '</div>'
                                        + '</div>');
                                    appointmentServiceContaint.find("[name='appointmentservice-search-scheul']:last").show("slow");
                                })
                                //event
                                modal.find("[name='client-search-scheul']").click(function () {
                                    location.href = "/Clients/Clients?id=" + $(this).attr("data-id");
                                })
                                modal.find("[name='appointmentservice-search-scheul']").click(function () {
                                    $.CallViewAppointment($(this).attr("data-id"));
                                })
                            })
                        }
                    })
                    modal.find("#search-scheul").focus();
                    modal.on("hidden.bs.modal", function () {
                        $("[name='client-search-scheul']").off("click");
                        $("[name='appointmentservice-search-scheul']").off("click");
                        $("#search-scheul").off("keyup");
                        modal.modal('dispose');
                        modal.remove();
                    })
                })
            } else
                console.log("Tag html không hợp lệ");
        },
        GetMessageMobile: function () {
            if ($(this).is("div")) {
                var that = this;
                $(that).html("");
                $.RequestAjax("/Home/GetMessage", null, function (data) {
                    $.each(data, function () {
                        var link = (this.Link != "" && this.Link ? ("window.open('" + (this.Link.includes("https://") ? this.Link : ("https://" + this.Link)) + "')") : "");
                        $(that).append(htmlMessageMobile.replace("@Link", link)
                        .replace("@DateUpdate", moment(this.DateUpdate, "DD/MM/YYYY").format("MMM DD, YYYY"))
                        .replace("@Subject", this.Subject).replace("@Detail", (this.Detail ? this.Detail : "")));
                    })
                })
            } else
                console.error("Tag không hợp lệ");
        },
        GetMessageDestop: function (selectorCountDestop) {
            if ($(this).is("div")) {
                var that = this;
                $(that).html("");
                $(selectorCountDestop).html("");
                $.RequestAjax("/Home/GetMessage", null, function (data) {
                    $(selectorCountDestop).html(data.length);
                    $(that).append('<div class="dropdown-header text-center">'
                                   + '<strong>You have ' + data.length + ' messages</strong>'
                                   + '</div>')
                    $.each(data, function () {
                        var link = (this.Link != "" && this.Link ? ("window.open('" + (this.Link.includes("https://") ? this.Link : ("https://" + this.Link)) + "')") : "");
                        $(that).append(htmlMessageDestop.replace("@Link", link)
                        .replace("@DateUpdate", moment(this.DateUpdate, "DD/MM/YYYY").format("MMM DD, YYYY"))
                        .replace("@Subject", this.Subject).replace("@Detail", (this.Detail ? this.Detail : "")));
                    })
                })
            } else
                console.error("Tag không hợp lệ");
        }
    })
    $.GetMessage = function (selectorConataintDestop, selectorCountDestop, selectorConataintMobile) {
        if ($(document).width() >= 1040)
            $(selectorConataintDestop).GetMessageDestop(selectorCountDestop);
        else
            $(selectorConataintMobile).GetMessageMobile();
    }
    //#endregion

    //GetMessage
    var selectorConataintDestop = "#container-message-destop";
    var selectorConataintMobile = "#container-message-mobile";
    var selectorCountDestop = "#count-message-destop";
    var GetMessage = function () {
        $.GetMessage(selectorConataintDestop, selectorCountDestop, selectorConataintMobile);
    }
    GetMessage();
    setTimeout(GetMessage, 360000);
    $(window).resize(GetMessage);

    //Setup SearchScheul
    $("#searchScheul").SearchScheul();

    //CheckDateExpiry
    $.RequestAjax("/Home/CheckDateExpiry", null, function (data) {
        if (!JSON.parse(data.Result))
            $.InstallNotify(data.Message, "600");
    })

    //set moment
    moment.lang('kyrio-locale', {
        week: {
            dow: Window.BusinessBeginningOfWeek
        },
        longDateFormat: {
            L: Window.FormatDateJS
        }
    });

    //check brower
    if ($.CheckBrowIE())
        $.InstallNotifyMainError('Your browser is not supported anymore. Please update to a more recent one to get the best Kyrio experience. Click for more info.');

    //#region Event button
    $(document).on("click", "#logoutAccount", function () {
        localStorage.setItem("Logout", true);
        $.ajax({
            url: '/Home/Logout',
            type: 'post',
            datatype: 'json',
            contentType: 'application/json',
            async: true,
            success: function (data) {
                if (!JSON.parse(data.Result)) {
                    toastr["error"]("Logout failed. Please contact the developer to fix it.", "Error");
                    console.log("Lỗi đăng xuất lưu thất bại: " + data.ErrorMessage);
                }
                else {
                    localStorage.clear();
                    location.href = '/Login/Index';
                }
            }
        })
    })
    $("[ismodal]").on('shown.bs.modal', function (e) {
        var modal = this;
        $(document).enterKey(function () {
            $(modal).find("[isbuttonsave]").trigger("click");
        })
    })
    $("[ismodal]").on('hidden.bs.modal', function (e) {
        $(document).on("enterKey", null);
    })
    //#endregion
})

//#region Method
var CreateBreadcrumb = function (data) {
    var html = "";
    $.each(data, function () {
        html += '<li class="breadcrumb-item"><a href="' + this.href + '">' + this.title + '</a></li>';
    })
    $(".breadcrumb").append(html);
}
//#endregion