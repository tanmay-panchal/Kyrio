
class CutOrCopyAppointment {
    constructor(CanlendarElement, AppointmentID, IsCut, callback) {
        this.CanlendarElement = CanlendarElement;
        this.AppointmentID = AppointmentID;
        this.IsCut = IsCut;
        this.Callback = callback;
    }
    SaveForScheulCopyOrCut(startDate, resourceID, locationID, notice) {
        var that = this;
        StartLoading();
        setTimeout(function () {
            $.RequestAjax("/Calendar/SaveForScheulCopyOrCut", JSON.stringify({
                StartTime: startDate.local().toDate(),
                AppointmentID: that.AppointmentID,
                StaffId: resourceID,
                LocationID: locationID,
                IsCut: that.IsCut,
                Start: (startDate.hour() * 3600 + startDate.minute() * 60)
            }), function (data) {
                if (notice)
                    notice.close();
                toastr["success"]("Data saved successfully.", "Notification");
                $("body header.app-header").find(".ui-pnotify").find(".ui-pnotify-closer").find("span").trigger("click");
                that.CanlendarElement.RefetchCanlendarSchedul(true);
                if (that.Callback)
                    that.Callback();
                EndLoading();
            })
        }, 100)
    }
    ActionForScheulCopyOrCut() {
        var that = this;
        if (that.CanlendarElement && typeof ($.fn.fullCalendar) != 'undefined') {
            var containtCanlendar;
            var CreateViewRescheduleAppointment = function () {
                if (containtCanlendar)
                    containtCanlendar.remove();
                containtCanlendar = $(that.CanlendarElement[0].outerHTML);
                containtCanlendar.addClass("position-absolute-0");
                containtCanlendar.css("z-index", "200");
                containtCanlendar.css("background-color", "white");
                var containtRow = containtCanlendar.find(".fc-slats");
                containtRow.addClass("position-absolute-0");
                containtRow.css("opacity", "0.6");
                containtRow.css("z-index", "4");
                that.CanlendarElement.parent("div").append(containtCanlendar);
                containtCanlendar.find("[name='cell-date']").click(function () {
                    var resource = that.CanlendarElement.fullCalendar("getResourceById", $(this).attr("data-resource-id"));
                    var startDate = moment($(this).attr("data-date") + " " + $(this).attr("data-time"), "YYYY-MM-DD HH:mm:ss")
                    if (resource && resource.isEmployee) {
                        $.RequestAjax("/Calendar/CheckTimeForScheulReschedule", JSON.stringify({
                            StartTime: startDate.local().toDate(),
                            StaffId: resource.id,
                            LocationID: resource.locationID,
                        }), function (renponsive) {
                            if (!renponsive.CheckAppointmentService || !renponsive.CheckBlockTime || !renponsive.CheckUserWorking) {
                                var getHtmlBoldText = function (text) {
                                    return "<span class='text-primary font-weight-bold'>" + text + "</span>";
                                }
                                var text = "";
                                if (!renponsive.CheckAppointmentService)
                                    text += "<p>" + getHtmlBoldText(resource.title) + " has another booking at " + getHtmlBoldText(startDate.format("HH:mm")) + ", but you can still double-book them." + "</p>";
                                if (!renponsive.CheckBlockTime)
                                    text += "<p>" + getHtmlBoldText(resource.title) + " has a blocked time at " + getHtmlBoldText(startDate.format("HH:mm")) + ", but you can still double-book them." + "</p>";
                                if (!renponsive.CheckUserWorking)
                                    text += "<p>" + getHtmlBoldText(resource.title) + " isn't working at " + getHtmlBoldText(startDate.format("HH:mm")) + ", but you can still book them." + "</p>";;
                                var notify = $.InStallPopupConfirm({
                                    title: that.IsCut ? "Reschedule Appointment" : "Rebook Appointment",
                                    text: " ",
                                }, [{
                                    text: "CANCEL",
                                    click: function (notice) {
                                        notice.close();
                                    }
                                }, {
                                    text: that.IsCut ? "Reschedule" : "Rebook",
                                    addClass: 'brighttheme-primary',
                                    click: function (notice) {
                                        that.SaveForScheulCopyOrCut(startDate, resource.id, resource.locationID, notice);
                                    }
                                }]);
                                $(notify.refs.textContainer).append(text);
                            } else
                                that.SaveForScheulCopyOrCut(startDate, resource.id, resource.locationID, null);
                        });
                    } else {
                        toastr["error"]("Staff is not valid. Please select another staff", "Notification");
                    }
                })
            }
            CreateViewRescheduleAppointment();
            Window.CallBackAfterRenderScheul = function () {
                containtCanlendar.remove();
                CreateViewRescheduleAppointment();
            }
            $.InstallNotifyMain("Click the calendar to choose a new date and time", function () {
                containtCanlendar.remove();
                Window.CallBackAfterRenderScheul = null;
            });
        }
    }
}