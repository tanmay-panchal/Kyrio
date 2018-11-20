var EventFinishActionOrViewAppointment = function () {
    $("#fullCalendar").RefetchCanlendarSchedul(true, false);
}
var ModalAppointment = {
    OpenCreate: function (ScheduledDate, StartTime, StaffID) {
        $.CallCreateAppointment($("#locationSearch").val(), StartTime, ScheduledDate, StaffID, function () {
            $("#fullCalendar").RefetchCanlendarSchedul(true);
        });
    },
    OpenEdit: function (AppointmentID) {
        $.CallEditAppointment(AppointmentID, EventFinishActionOrViewAppointment);
    },
    OpenView: function (AppointmentID) {
        $.CallViewAppointment(AppointmentID, EventFinishActionOrViewAppointment, EventFinishActionOrViewAppointment);
    }
}
$(function () {
    //#region Setup Control
    $("#containtButtonCreate").InStallButtonGroupFooter({
        ArrayButtonOriginal: [{
            IdButtonCreate: "",
            ClassIcon: "fa-plus",
            IsShowTitle: false,
            Title: ""
        }],
        ArrayButtonLater: [{
            IdButtonCreate: "buttonSaleCreate",
            ClassIcon: "fa-shopping-cart",
            IsShowTitle: true,
            Title: "New Sale"
        }, {
            IdButtonCreate: "buttonBlockTimeCreate",
            ClassIcon: "fa-clock-o",
            IsShowTitle: true,
            Title: "New Blocked Time"
        }, {
            IdButtonCreate: "buttonAppointmentCreate",
            ClassIcon: "fa-calendar",
            IsShowTitle: true,
            Title: "New Appointment"
        }]
    })
    CreateBreadcrumb([{ href: "/Home/Index", title: "Home" }, { href: "/Calendar/Index", title: "Calendar" }])
    //#endregion

    //#region Event
    $(document).on("click", "#buttonAppointmentCreate", function () {
        if ($("#locationSearch option").length > 0) {
            var valueStaff = $("#staffResourSearch").val();
            var prefix = valueStaff.split(":")[0];
            var staffId;
            if (prefix == "employee") {
                var resouce = $("#fullCalendar").fullCalendar("getResources");
                if (resouce.length > 0 && resouce[0].isEmployee)
                    staffId = resouce[0].id;
            }
            ModalAppointment.OpenCreate($.NowTimeZone(), $.NowTimeZone(), staffId);
        }
        else
            NotifyShow("Not created when no location");
    })
    $(document).on("click", "#buttonSaleCreate", function () {
        if ($("#locationSearch option").length > 0)
            location.href = "/Sale/NewSale"
        else
            NotifyShow("Not created when no location");
    })
    $(document).on("click", "#buttonBlockTimeCreate", function () {
        var text = "Not created when no location";
        if ($("#locationSearch option").length > 0) {
            window.isCreateBlockTimeScheul = true;
            text = "Click the calendar to add blocked time";
        }
        $.InstallNotifyMain(text, function () {
            window.isCreateBlockTimeScheul = false;
        });
    })
    $("#alowShowCanlendar").click(function () {
        $("#NotifyNoScheduled").addClass("d-none");
        $("#NotifyNoStaff").addClass("d-none");
        $("#notifyScheul").addClass("d-none");
        $("#staffResourSearch").val("employee:all").trigger("change");
        localStorage.setItem("allowShowCandendar", true);
        $("#fullCalendar").RefetchCanlendarSchedul();
    })
    //#endregion

    //#region Open View Scheul Cut Or Copy Appointment
    var isViewCopyOrCutAppointment = JSON.parse(localStorage.getItem("IsViewCopyOrCutAppointment"));
    var copyOrCutAppointmentID = JSON.parse(localStorage.getItem("CopyOrCutAppointmentID"));
    var isCopyOrCutAppointment = JSON.parse(localStorage.getItem("IsCopyOrCutAppointment"));
    var locationIdCopyOrCutAppointment = JSON.parse(localStorage.getItem("locationIdCopyOrCutAppointment"));
    var allowShowCandendarCopyOrCutAppointment = localStorage.getItem("allowShowCandendar");
    if (isViewCopyOrCutAppointment && copyOrCutAppointmentID && locationIdCopyOrCutAppointment && isCopyOrCutAppointment != null) {
        localStorage.setItem("IsViewCopyOrCutAppointment", false);
        localStorage.setItem("CopyOrCutAppointmentID", null);
        localStorage.setItem("locationIdCopyOrCutAppointment", null);
        localStorage.setItem("IsCopyOrCutAppointment", null);
        localStorage.setItem("allowShowCandendar", true);
        localStorage.setItem("locationidscheul", locationIdCopyOrCutAppointment);
        Window.CallBackAfterRenderScheul = function () {
            var ExcuteActionForScheulCopyOrCut = function () {
                if ($("#fullCalendar") && typeof ($.fn.fullCalendar) != 'undefined') {
                    var action = new CutOrCopyAppointment($("#fullCalendar"), copyOrCutAppointmentID, isCopyOrCutAppointment, null);
                    action.ActionForScheulCopyOrCut();
                    localStorage.setItem("allowShowCandendar", allowShowCandendarCopyOrCutAppointment);
                    delete countCallBackAfterRender;
                    delete isViewCopyOrCutAppointment;
                    delete copyOrCutAppointmentID;
                    delete isCopyOrCutAppointment;
                    delete allowShowCandendarCopyOrCutAppointment;
                    delete locationIdCopyOrCutAppointment;
                }
            }
            if (typeof CutOrCopyAppointment != "function") {
                $.getScript("/Scripts/calendar/Appointment/cut-copy-appointment.js").done(function () {
                    ExcuteActionForScheulCopyOrCut();
                }).fail(function () {
                    console.log("Load file js fail");
                })
            } else
                ExcuteActionForScheulCopyOrCut();
        }
    }
    //#endregion

    //#region Open View Create Appointment
    var isViewCreateAppointment = JSON.parse(localStorage.getItem("IsViewCreateAppointment"));
    var clientIdViewCreateAppointment = JSON.parse(localStorage.getItem("ClientIDViewCreateAppointment"));
    var allowShowCandendarCreateAppointment = localStorage.getItem("allowShowCandendar");
    if (isViewCreateAppointment && clientIdViewCreateAppointment) {
        localStorage.setItem("IsViewCreateAppointment", false);
        localStorage.setItem("ClientIDViewCreateAppointment", null);
        localStorage.setItem("allowShowCandendar", true);
        Window.CallBackAfterRenderScheul = function () {
            var ExcuteCreateAppointment = function () {
                if ($("#fullCalendar") && typeof ($.fn.fullCalendar) != 'undefined') {
                    var action = new CreateAppointment($("#fullCalendar"), $("#locationSearch").val(), EventFinishActionOrViewAppointment, clientIdViewCreateAppointment);
                    action.Excute();
                    localStorage.setItem("allowShowCandendar", allowShowCandendarCreateAppointment);
                    delete isViewCreateAppointment;
                    delete clientIdViewCreateAppointment;
                    delete allowShowCandendarCreateAppointment;
                }
            }
            if (typeof CreateAppointment != "function") {
                $.getScript("/Scripts/calendar/Appointment/create-appointment.js").done(function () {
                    ExcuteCreateAppointment();
                }).fail(function () {
                    console.log("Load file js fail");
                })
            } else
                ExcuteCreateAppointment();
        }
    }
    //#endregion

    //#region Open View, Edit, Create Appointment
    var isOpenPopupAppointment = JSON.parse(localStorage.getItem("IsOpenPopupAppointment"));
    var openPopupAppointmentID = JSON.parse(localStorage.getItem("OpenPopupAppointmentID"));
    var popup = localStorage.getItem("PopupAppointment");
    if (isOpenPopupAppointment && popup) {
        if (popup == "new") {
            var scheduledDatePopupAppointment = JSON.parse(localStorage.getItem("ScheduledDatePopupAppointment"));
            var startTimePopupAppointment = JSON.parse(localStorage.getItem("StartTimePopupAppointment"));
            scheduledDatePopupAppointment = scheduledDatePopupAppointment == null ? new Date() : moment(scheduledDatePopupAppointment, "YYYY/MM/DD").local().toDate();
            startTimePopupAppointment = startTimePopupAppointment == null ? new Date() : moment(startTimePopupAppointment, "HH:mm").local().toDate();
            ModalAppointment.OpenCreate(scheduledDatePopupAppointment, startTimePopupAppointment);
        }
        if (popup == "view" && openPopupAppointmentID) {
            ModalAppointment.OpenView(openPopupAppointmentID);
        }
        if (popup == "edit" && openPopupAppointmentID) {
            ModalAppointment.OpenEdit(openPopupAppointmentID);
        }
        localStorage.setItem("IsOpenPopupAppointment", false);
        localStorage.setItem("OpenPopupAppointmentID", null);
        localStorage.setItem("PopupAppointment", null);
        delete isOpenPopupAppointment;
        delete openPopupAppointmentID;
        delete popup;
    }
    //#endregion

    //#region Welcome
    $.RequestAjax('/Home/WellcomeScheul', null, function (data) {
        if (JSON.parse(data.FirstLogin))
            $.WelcomeScheul(data.FirstName);
    })
    //#endregion
})