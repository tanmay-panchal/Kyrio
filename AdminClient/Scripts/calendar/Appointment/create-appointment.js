class CreateAppointment {
    constructor(CanlendarElement, locationId, callback, clientID) {
        this.CanlendarElement = CanlendarElement;
        this.Callback = callback;
        this.LocationId = locationId;
        this.ClientID = clientID;
    }
    Excute() {
        var that = this;
        if (that.CanlendarElement && typeof ($.fn.fullCalendar) != 'undefined') {
            var containtCanlendar;
            var notify;
            var CreateViewRescheduleAppointment = function () {
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
                        $.CallCreateAppointment(that.LocationId, startDate.toDate(), startDate.toDate(), resource.id, function(){
                            containtCanlendar.remove();
                            Window.CallBackAfterRenderScheul = null;
                            $("body header.app-header").find(".ui-pnotify").find(".ui-pnotify-closer").find("span").trigger("click");
                            if (that.Callback)
                                that.Callback();
                        }, that.ClientID);
                    } else 
                        toastr["error"]("Staff is not valid. Please select another staff", "Notification");
                })
            }
            CreateViewRescheduleAppointment();
            Window.CallBackAfterRenderScheul = function () {
                containtCanlendar.remove();
                CreateViewRescheduleAppointment();
            }
            notify = $.InstallNotifyMain("Click the calendar to choose a new date and time", function () {
                containtCanlendar.remove();
                Window.CallBackAfterRenderScheul = null;
            });
        }
    }
}