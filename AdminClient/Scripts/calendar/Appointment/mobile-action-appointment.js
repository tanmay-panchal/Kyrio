var prefixFileMobileAppointment = "/ContentHtml/Appointment/Action/Mobile";
var LinkFileMobileAppointment = {
    RepeateScheulDate: {
        Index: prefixFileMobileAppointment + "/Repeate_ScheulDate/Index.html",
    },
    AppointmentService: {
        Index: prefixFileMobileAppointment + "/AppointmentService/Index.html",
    },
    ContentShare: {
        ServiceShare: prefixFileMobileAppointment + "/ContentShare/ServiceShare.html",
    },
    Control: {
        Duration: prefixFileMobileAppointment + "/Control/Duration.html",
        Resource: prefixFileMobileAppointment + "/Control/Resource.html",
        Staff_IsRequest: prefixFileMobileAppointment + "/Control/Staff_IsRequest.html",
        Starttime12h: prefixFileMobileAppointment + "/Control/Starttime12h.html",
        Starttime24h: prefixFileMobileAppointment + "/Control/Starttime24h.html",
    },
    Index: {
        Index: prefixFileMobileAppointment + "/Index/Index.html",
        ClientDetail: prefixFileMobileAppointment + "/Index/Client/Detail.html",
        ClientEmpty: prefixFileMobileAppointment + "/Index/Client/Empty.html",
        Repeat_ScheulDate: prefixFileMobileAppointment + "/Index/Repeat_ScheulDate/Index.html",
        ServiceItem: prefixFileMobileAppointment + "/Index/AppointmentService/Item.html",
        NotifyUpdateAllOrOnly: prefixFileMobileAppointment + "/Index/Notify/UpdateAllOrOnly.html",
    },
};
var LinkFileJSActionAppointment = {
    MobileAddClient: "/Scripts/calendar/AddClient/mobile-action-addClient.js",
    MobileService: "/Scripts/calendar/AddComboboxService/mobile-action-comboboxService.js",
    MobileDetailClient: "/Scripts/calendar/DetailClient/mobile-action-detailClient.js",
}
$(function () {
    $.fn.extend({
        NotifyElementValidate: function (text) {
            var htmlText = "<p class='m-0 text-danger' name='notifyValidate'>" + text + "</p>";
            if ($(this).is("select")) {
                $(this).addClass("border-danger");
                $(this).closest(".input-group-select").closest("div").append(htmlText);
            } else if ($(this).is("button")) {
                $(this).closest("div").addClass("border-danger");
                $(this).closest("div").append(htmlText);
            }
        },
        RemoveNotifyElementValidate: function () {
            if ($(this).is("select")) {
                $(this).removeClass("border-danger");
                $(this).closest(".input-group-select").closest("div").find("[name='notifyValidate']").remove();
            } else if ($(this).is("button")) {
                $(this).closest("div").addClass("border-danger");
                $(this).closest("div").find("[name='notifyValidate']").remove();
            }
        }
    })
})
var CreateNotifyMobile = function (title) {
    PNotify.removeAll();
    return PNotify.info({
        title: title,
        width: ($(document).width() / 3) * 2,
        animateSpeed: 'slow',
        delay: 5000,
        modules: {
            Buttons: {
                sticker: false,
                stickerHover: false,
                closerHover: false,
                closer: false,
            },
        },
        stack: {
            dir1: "down",
            context: $("body")[0],
            firstpos1: 0,
            firstpos2: 0,
            spacing1: 0,
            spacing2: 0,
            push: 'bottom'
        },
    });
}

//#region Repeate And Scheul Date
class MobileRepeateScheulDate {
    constructor(callBackComplete, callBackHideModal) {
        this.Modal = null;
        this.HTML = {
            Index: null,
        };
        this.Parameter = {
            CallBackComplete: callBackComplete,
            CallBackHideModal: callBackHideModal
        };
        this.Data = {
            ScheduledDate: new Date(),
            FrequencyType: "no-repeat",
            RepeatCount: null,
            EndRepeat: new Date(),
        }
    }

    //#region Private
    CreatePluginControl() {
        var that = this;
        this.Modal.find("#endRepeatAppointment").daterangepicker({
            "singleDatePicker": true,
            "opens": "center",
            "isInvalidDate": function (arg) {
                var dateAppointMent = moment(that.Modal.find("#scheduledDateAppointment").datepicker("getDate")).startOf('day');
                if (moment(arg._d).isSameOrBefore(moment(dateAppointMent)))
                    return true;
                else {
                    var valueFrequency = that.Modal.find("#frequencyTypeAppointment").val();
                    var unitFrequency = valueFrequency.toString().split(":")[0];
                    var numberFrequency = valueFrequency.toString().split(":")[1];
                    var prefixFrequency = unitFrequency == "daily" ? "days" : (unitFrequency == "weekly" ? "weeks" : "months");
                    var subtractNumber = moment(arg.toDate()).diff(moment(dateAppointMent), prefixFrequency);
                    return !(subtractNumber % numberFrequency == 0 && moment(arg._d).isSame(moment(dateAppointMent).add(subtractNumber, prefixFrequency)));
                }
            },
        });
        this.Modal.find("#scheduledDateAppointment").datepicker();
    }
    CreateEvent() {
        var that = this;
        this.Modal.find("#frequencyTypeAppointment").change(function () {
            if ($(this).val() != "no-repeat") {
                that.Modal.find("#container-repeatCountAppointment").show("slow");
                that.Modal.find("#repeatCountAppointment").val("count:2");
            } else {
                that.Modal.find("#container-endRepeatAppointment").hide();
                that.Modal.find("#container-repeatCountAppointment").hide();
            }

        })
        this.Modal.find("#endRepeatAppointment").on('hide.daterangepicker', function (ev, picker) {
            that.SetValueEndRepeat();
        });
        this.Modal.find("#repeatCountAppointment").change(function () {
            if ($(this).val() == "date") {
                var dateAppointMent = moment(that.Modal.find("#scheduledDateAppointment").datepicker("getDate")).startOf('day');
                var valueFrequency = that.Modal.find("#frequencyTypeAppointment").val();
                var unitFrequency = valueFrequency.toString().split(":")[0];
                var numberFrequency = valueFrequency.toString().split(":")[1];
                var prefixFrequency = unitFrequency == "daily" ? "days" : (unitFrequency == "weekly" ? "weeks" : "months");
                var date = dateAppointMent.add(numberFrequency, prefixFrequency).toDate();
                that.SetValueEndRepeat(date, true);
                that.Modal.find("#container-endRepeatAppointment").show("slow");
            } else
                that.Modal.find("#container-endRepeatAppointment").hide();
        })
        this.Modal.find("#buttonSaveRepeateIsRequest").click(function () {
            that.Data.ScheduledDate = that.Modal.find("#scheduledDateAppointment").datepicker("getDate");
            that.Data.FrequencyType = that.Modal.find("#frequencyTypeAppointment").val();

            if (that.Data.FrequencyType != "no-repeat")
                that.Data.RepeatCount = that.Modal.find("#repeatCountAppointment").val();
            else
                that.Data.RepeatCount = null;

            if (that.Data.FrequencyType != "no-repeat" && that.Data.RepeatCount == "date")
                that.Data.EndRepeat = that.Modal.find("#endRepeatAppointment").data('daterangepicker').startDate.toDate();
            else
                that.Data.EndRepeat = null;
            if (that.Parameter.CallBackComplete)
                that.Parameter.CallBackComplete(that.Data);
            that.HideModal();
        })
        this.Modal.find("[name='closeModal']").click(function () {
            that.HideModal();
        })
    }
    RemoveEvent() {
        this.Modal.find("#frequencyTypeAppointment").off("change");
        this.Modal.find("#repeatCountAppointment").off("change");
        this.Modal.find("#buttonSaveRepeateIsRequest").off("click");
        this.Modal.find("#endRepeatAppointment").off("hide.daterangepicker");
        this.Modal.find("[name='closeModal']").off("click");
    }
    SetValueEndRepeat(date, isSetData) {
        if (isSetData != null && isSetData != undefined && isSetData == true) {
            this.Modal.find("#endRepeatAppointment").data('daterangepicker').setStartDate(date);
            this.Modal.find("#endRepeatAppointment").data('daterangepicker').setEndDate(date);
        } else
            date = this.Modal.find("#endRepeatAppointment").data('daterangepicker').startDate.toDate();

        this.Modal.find("#endRepeatAppointment").val(moment(date).format("ddd, DD MMM"));
    }
    //#endregion

    //#region Public
    OpenModal(data) {
        var that = this;
        if (this.HTML.Index == null)
            $.RequestAjaxText(LinkFileMobileAppointment.RepeateScheulDate.Index, function (data) { that.HTML.Index = data; });

        if (that.Modal == null || that.Modal == undefined) {
            that.Modal = $(that.HTML.Index);
            $("body").append(that.Modal);
            that.CreatePluginControl();
            this.SetValueEndRepeat();
        } else
            this.RemoveEvent();

        this.Modal.show("slow");
        this.Modal.find("#container-repeatCountAppointment").hide();
        this.Modal.find("#container-endRepeatAppointment").hide();
        if (data != null && data != undefined) {
            this.Modal.find("#scheduledDateAppointment").datepicker("setDate", data.ScheduledDate);
            this.Modal.find("#frequencyTypeAppointment").val(data.FrequencyType);
            if (data.RepeatCount != null && data.RepeatCount != undefined) {
                this.Modal.find("#container-repeatCountAppointment").show();
                this.Modal.find("#repeatCountAppointment").val(data.RepeatCount);
            }
            if (data.EndRepeat != null && data.EndRepeat != undefined) {
                this.Modal.find("#container-endRepeatAppointment").show();
                this.SetValueEndRepeat(data.EndRepeat, true);
            }
        } else {
            this.Modal.find("#scheduledDateAppointment").datepicker("setDate", new Date());
            this.Modal.find("#frequencyTypeAppointment").val("no-repeat");
            this.Modal.find("#repeatCountAppointment").val("count:2");
            this.SetValueEndRepeat(new Date(), true);
        }
        if (data)
            this.Data = data;
        this.CreateEvent();
    }
    HideModal() {
        if (this.Modal != null) {
            this.Modal.hide();
            this.RemoveEvent();
        }
        if (this.Parameter.CallBackHideModal)
            this.Parameter.CallBackHideModal();
    }
    RemoveModal() {
        if (this.Modal != null) {
            this.RemoveEvent();
            this.Modal.remove();
        }
    }
    //#endregion

}
//#endregion

//#region Appointment Service
class MobileAppointmentService {
    constructor(staffId, scheduledDate, locationID, callbackComplete, callBackRemoveService, callBackHideModal) {
        this.Modal = null;
        var that = this;
        this.HTML = {
            Index: null,
            Control: {
                OptionStaff: null,
                Resource: null,
                Duration: null,
                Staff_IsRequest: null,
                Starttime12h: null,
                Starttime24h: null,
            },
            ContentShare: {
                ServiceShare: null,
            },
        };
        this.Data = {
            Service: null,
            Duration: null,
            StartTime: null,
            StaffID: null,
            IsRequest: null,
        };
        this.DataLSStaffs = [];
        this.Parameter = {
            CallbackComplete: callbackComplete,
            CallBackRemoveService: callBackRemoveService,
            CallBackHideModal: callBackHideModal,
            LocationID: locationID,
            ScheduledDate: scheduledDate,
            StaffId: staffId
        };
        this.Page = {
            Service: new MobileService(function (item) {
                that.CallBackChooseItemService(item);
            }, function () {
                that.CallBackHideChooseItemService();
            })
        };
        this.TextValidateAppointmentService = {
            Service: "Service is required",
            Duration: "Duration is required",
            StartTime: "StartTime is required",
            Staff: "Staff is required",
        }

        $.RequestAjaxText(LinkFileMobileAppointment.AppointmentService.Index, function (data) { that.HTML.Index = data; });
        $.RequestAjaxText(LinkFileMobileAppointment.Control.Duration, function (data) { that.HTML.Control.Duration = data; });
        $.RequestAjaxText(LinkFileMobileAppointment.Control.Staff_IsRequest, function (data) { that.HTML.Control.Staff_IsRequest = data; });
        $.RequestAjaxText(LinkFileMobileAppointment.Control.Resource, function (data) { that.HTML.Control.Resource = data; });
        $.RequestAjaxText(LinkFileMobileAppointment.Control.Starttime12h, function (data) { that.HTML.Control.Starttime12h = data; });
        $.RequestAjaxText(LinkFileMobileAppointment.Control.Starttime24h, function (data) { that.HTML.Control.Starttime24h = data; });
        $.RequestAjaxText(LinkFileMobileAppointment.ContentShare.ServiceShare, function (data) { that.HTML.ContentShare.ServiceShare = data; });
    }

    //#region Private
    CallBackChooseItemService(item) {
        this.Data.Service = item;
        this.Data.Duration = item.Duration;
        this.Modal.hide();
        this.OpenModal(this.Data);
        this.GetData();
        this.NotifyCheckDateWorkingUserExist(this.Parameter.LocationID, this.Parameter.ScheduledDate, this.Data.Duration, this.Data.StartTime, this.Data.StaffID);
    }
    CallBackHideChooseItemService() {
        this.Modal.show("slow");
    }
    CreateEvent() {
        var that = this;
        this.Modal.find("[name='IsRequest']").closest(".input-group-prepend").click(function () {
            var checkBox = $(this).find("[name='IsRequest']")[0];
            checkBox.checked = !checkBox.checked;
        })
        this.Modal.find("[name='Service']").click(function () {
            that.Modal.hide();
            that.Page.Service.OpenModal();
        })
        this.Modal.find("[name='Duration'], [name='StartTime']").change(function () {
            that.GetData();
            that.NotifyCheckDateWorkingUserExist(that.Parameter.LocationID, that.Parameter.ScheduledDate, that.Data.Duration, that.Data.StartTime, that.Data.StaffID);
        })
        this.Modal.find("#buttonSaveAppointmentService").click(function () {
            that.GetData()
            if (that.Validate(that.Modal, that.Data.Service.ServiceID)) {
                that.HideModal();
                if (that.Parameter.CallbackComplete)
                    that.Parameter.CallbackComplete(that.Data);
            }
        })
        this.Modal.find("[name='closeModal']").click(function () {
            that.HideModal();
        })
        this.Modal.find("#removeAppintmentService").click(function () {
            that.Modal.hide();
            that.RemoveEvent();
            that.GetData();
            if (that.Parameter.CallBackRemoveService)
                that.Parameter.CallBackRemoveService(that.Data);
        })
    }
    GetData() {
        this.Data.Duration = this.Modal.find("[name='Duration']").val();
        this.Data.StartTime = this.Modal.find("[name='StartTime']").val();
        this.Data.StaffID = this.Modal.find("[name='StaffID']").val();
        this.Data.IsRequest = this.Modal.find("[name='IsRequest']")[0].checked;
        this.Data.StaffName = this.Modal.find("[name='StaffID'] option[value='" + this.Data.StaffID + "']").text();
        this.Data.ResourceID = this.Modal.find("[name='Resource'] option").length == 1 ? null : this.Modal.find("[name='Resource']").val();
        this.Data.ResourceName = this.Data.ResourceID != null ? this.Modal.find("[name='Resource'] option[value='" + this.Data.ResourceID + "']").html() : "";
        //không cần set service vì CallBackChooseItemService đã lấy và gán rồi
        return this.Data;
    }
    RemoveEvent() {
        this.Modal.find("[name='IsRequest']").closest(".input-group-prepend").off("click");
        this.Modal.find("[name='Service']").off("click");
        this.Modal.find("#buttonSaveAppointmentService").off("click");
        this.Modal.find("#removeAppintmentService").off("click");
        this.Modal.find("[name='closeModal']").off("click");
        this.Modal.find("[name='Duration'], [name='StartTime']").off("change");
    }
    GetStartTimeValueBaseSecond(second) {
        var starTimeControl = $(this.HTML.Control.Starttime12h);
        var valueStartTime = 0;
        starTimeControl.find("option").each(function () {
            var secondStarTime = $(this).val();
            if (parseInt(second) >= parseInt(secondStarTime))
                valueStartTime = parseInt(secondStarTime);
            else
                return false;
        })
        return valueStartTime;
    }
    //#endregion

    //#region Public
    Validate(form, ServiceID) {
        var check = true;
        var elementService = form.find("[name='Service']");
        var elementDuration = form.find("[name='Duration']");
        var elementStartTime = form.find("[name='StartTime']");
        var elementStaff = form.find("[name='StaffID']");
        var CheckValidateSelect = function (element) {
            var value = element.val();
            if (value != null && value != undefined && value != "")
                return true;
            return false;
        }
        //service
        if ($.isNumeric(ServiceID))
            elementService.RemoveNotifyElementValidate();
        else {
            check *= false;
            elementService.NotifyElementValidate(this.TextValidateAppointmentService.Service);
        }
        //staff
        if (CheckValidateSelect(elementStaff))
            elementStaff.RemoveNotifyElementValidate();
        else {
            check *= false;
            elementService.NotifyElementValidate(this.TextValidateAppointmentService.Staff);
        }
        //start time
        if (CheckValidateSelect(elementStartTime))
            elementStartTime.RemoveNotifyElementValidate();
        else {
            check *= false;
            elementStartTime.NotifyElementValidate(this.TextValidateAppointmentService.StartTime);
        }
        //duration
        if (CheckValidateSelect(elementDuration))
            elementDuration.RemoveNotifyElementValidate();
        else {
            check *= false;
            elementDuration.NotifyElementValidate(this.TextValidateAppointmentService.Duration);
        }
        return check;
    }
    GetTextDuration(duration) {
        var minutuesDuration = duration / 60;
        var hour = parseInt(minutuesDuration / 60);
        var second = parseInt(minutuesDuration % 60);
        return (hour >= 1 ? (hour + "h ") : "") + (second >= 1 ? (second + "min") : "");
    }
    NotifyCheckDateWorkingUserExist(LocationID, ScheduledDate, Duration, StartTime, StaffID) {
        var that = this;
        if (Duration && Duration != "" && StartTime && StartTime != "" && StaffID && StaffID != "") {
            var startTimeWorkingHour = moment([2000, 0, 1]);
            var endTimeWorkingHour = moment([2000, 0, 1]);
            var dateWorkingHour = moment(ScheduledDate);
            var dateBlockTime = moment(ScheduledDate);
            var startTimeBlockTime = moment(dateBlockTime.format("YYYY/MM/DD"), "YYYY/MM/DD");
            var endTimeBlockTime = moment(dateBlockTime.format("YYYY/MM/DD"), "YYYY/MM/DD");
            startTimeWorkingHour.add(StartTime, "seconds");
            endTimeWorkingHour.add(parseInt(StartTime) + parseInt(Duration), "seconds");
            startTimeBlockTime.add(StartTime, "seconds");
            endTimeBlockTime.add(parseInt(StartTime) + parseInt(Duration), "seconds");
            $.RequestAjax("/Calendar/CheckDateWorkingUserExist", JSON.stringify({
                UserID: StaffID,
                StartTimeWorkingHour: startTimeWorkingHour.local().toDate(),
                EndTimeWorkingHour: endTimeWorkingHour.local().toDate(),
                DateWorkingHour: dateWorkingHour.local().toDate(),
                StartTimeBlockTime: startTimeBlockTime.local().toDate(),
                EndTimeBlockTime: endTimeBlockTime.local().toDate(),
                DateBlockTime: dateBlockTime.local().toDate(),
                LocationID: LocationID,
            }), function (renponsive) {
                var text = "";
                var textNameStaff = that.GetNameStaffBaseId(StaffID);
                if (!JSON.parse(renponsive.CheckBlockTime))
                    text += textNameStaff + " has a blocked time at " + startTimeWorkingHour.format("HH:mm") + ", but you can still book them.";
                if (!JSON.parse(renponsive.CheckWorkingHour))
                    text += textNameStaff + " isn’t working between " + startTimeWorkingHour.format("HH:mm") + " and " + endTimeWorkingHour.format("HH:mm") + ", but you can still book them.";
                if (text != "")
                    CreateNotifyMobile(text);
            });
        }
    }
    GetNameStaffBaseId(id) {
        var result = "";
        $.RequestAjax('/Home/GetUserBaseId', JSON.stringify({ id: id }), function (data) {
            result = data.Text;
        })
        return result;
    }
    OpenModal(data) {
        var that = this;

        if (that.Modal)
            that.Modal.remove();

        var html = this.HTML.Index.replace("@ContentControlService", that.ReturnHtmlControl(data))
        that.Modal = $(html);
        $("body").append(that.Modal);
        that.CreateEvent();

        if (data) {
            this.Data = data;
            if (!data.IsCreate) {
                this.Modal.find("#removeService").show();
                this.Modal.find("[name='titleModal']").text("edit services");
            }
        }
    }
    ReturnHtmlControl(data) {
        var htmlContentControlService = this.HTML.ContentShare.ServiceShare.replace("@ControlStaff_IsRequest", this.HTML.Control.Staff_IsRequest)
            .replace("@ControlResouce", this.HTML.Control.Resource).replace("@ControlDuration", this.HTML.Control.Duration)
            .replace("@ControlStartTime", Window.TimeFormat == "24" ? this.HTML.Control.Starttime12h : this.HTML.Control.Starttime24h);
        var ServiceName = "Add a service";
        var DesService = "";
        var element = $("<div>" + htmlContentControlService + "</div>");
        element.find("[name='StaffID']").html(this.GetOpitonStaff());

        if (data) {
            if (data.Service) {
                DesService = "";
                ServiceName = data.Service.ServiceName + " (" + this.GetTextDuration(data.Service.Duration) + ", "
                    + $.FormatNumberMoney(parseInt(data.Service.SpecialPrice) > 0 ? data.Service.SpecialPrice : data.Service.RetailPrice) + ")";

                //set show and load data resouce
                var htmlResouce = this.GetOpitonResouce(data.Service.ServiceID, this.Parameter.LocationID);
                if ($.trim(htmlResouce) != "") {
                    element.find("#container-resouce").show();
                    element.find("[name='Resource']").html(htmlResouce);
                }
            }

            //set value
            if ($.isNumeric(this.Parameter.StaffId) && this.Parameter.StaffId != 0) {
                var staffID = (data.StaffID != undefined && data.StaffID != null ? data.StaffID : this.Parameter.StaffId);
                element.find("[name='StaffID'] option[value='" + staffID + "']").attr("selected", true);
            } else
                element.find("[name='StaffID'] option:first").attr("selected", true);
            if (data.IsRequest != undefined && data.IsRequest != null)
                element.find("[name='IsRequest']")[0].checked = data.IsRequest;
            if (data.StartTime != undefined && data.StartTime != null)
                element.find("[name='StartTime'] option[value='" + this.GetStartTimeValueBaseSecond(data.StartTime) + "']").attr("selected", true);
            if (data.Duration != undefined && data.Duration != null)
                element.find("[name='Duration'] option[value='" + data.Duration + "']").attr("selected", true);
            if (data.ResourceID != undefined && data.ResourceID != null)
                element.find("[name='Resource']").val(data.ResourceID);
        }
        htmlContentControlService = element.html();
        return htmlContentControlService.replace("@ServiceName", ServiceName).replace("@DesService", DesService);
    }
    HideModal() {
        if (this.Modal != null) {
            this.RemoveEvent();
            this.Modal.hide();
        }
        if (this.Parameter.CallBackHideModal)
            this.Parameter.CallBackHideModal();
    }
    SetScheduledDate(ScheduledDate) {
        this.Parameter.ScheduledDate = ScheduledDate;
    }
    SetLocationID(LocationID) {
        this.Parameter.LocationID = LocationID;
    }
    RemoveModal() {
        this.Page.Service.RemoveModal();
        if (this.Modal != null) {
            this.RemoveEvent();
            this.Modal.remove();
        }
    }
    GetOpitonStaff() {
        if (this.HTML.Control.OptionStaff == null) {
            var that = this;
            $.RequestAjax("/Calendar/GetUserByLocationBooking", JSON.stringify({
                LocationID: this.Parameter.LocationID
            }), function (data) {
                that.DataLSStaffs = data;
                if (data != null && data != undefined) {
                    that.HTML.Control.OptionStaff = "";
                    $.each(data, function () {
                        var name = (this.FirstName != undefined && this.FirstName != null ? this.FirstName : "") + " " + (this.LastName != undefined && this.LastName != null ? this.LastName : "");
                        that.HTML.Control.OptionStaff += '<option value="' + this.UserID + '">' + name + '</option>';
                    });
                }
                else
                    return "";
            })
        }
        return this.HTML.Control.OptionStaff;
    }
    GetOpitonResouce(ServiceID, LocationID) {
        var htmlResouce = "";
        if ($.isNumeric(LocationID) && $.isNumeric(ServiceID)) {
            if (this.HTML.Control.OptionResouce == null) {
                var that = this;
                $.RequestAjax("/Calendar/GetComboboxResourceNotPagging", JSON.stringify({
                    LocationID: LocationID,
                    ServiceID: ServiceID,
                }), function (data) {
                    if (data != null && data != undefined && data.length > 0) {
                        htmlResouce += '<option value="0">Choose Resource</option>';
                        $.each(data, function () {
                            htmlResouce += '<option value="' + this.ResourceID + '">' + this.ResourceName + '</option>';
                        });
                    }
                })
            }
        }
        return htmlResouce;
    }
    //#endregion

}
//#endregion

class MoblieEditOrCreateAppointment {
    constructor(locationId, startTime, ScheduledDate, staffId, clientID, appointmentId, callback) {
        ; debugger;
        ScheduledDate = ScheduledDate == null || ScheduledDate == undefined ? new Date() : ScheduledDate;
        var that = this;
        var hidePage = function () {
            that.CallBackHidePage();
        }
        this.Modal = null;
        this.HTML = {
            Index: null,
            ClientDetail: null,
            ClientEmpty: null,
            Repeat_ScheulDate: null,
            ServiceItem: null,
            NotifyUpdateAllOrOnly: null,
        };
        this.Data = {
            Appointment: {
                AppointmentID: 0,
                ScheduledDate: moment(ScheduledDate).startOf('day').toDate(),
                ClientID: clientID ? clientID : 0,
                LocationID: locationId,
                TotalAmount: 0,
                TotalTimeInMinutes: 0,
                FrequencyType: "no-repeat",
                RepeatCount: null,
                EndRepeat: null,
                Notes: ""
            },
            AppointmentParent: null,
            LsAppointmentService: []
        };
        this.Parameter = {
            LocationID: locationId,
            StartTime: startTime,
            ScheduledDate: moment(ScheduledDate).startOf('day').toDate(),
            StaffId: staffId ? staffId : 0,
            ClientID: clientID ? clientID : 0,
            AppointmentId: appointmentId,
            CallBack: callback,
            StaffName: "",
            FrequencyTypeOld: null,
            IsCreate: !$.isNumeric(appointmentId)
        }

        //Class Another Support
        if (typeof MobileAddClient != "function" || typeof MobileService != "function" || typeof MobileDetailClient != "function") {
            $.RequestAjaxSript(LinkFileJSActionAppointment.MobileAddClient);
            $.RequestAjaxSript(LinkFileJSActionAppointment.MobileService);
            $.RequestAjaxSript(LinkFileJSActionAppointment.MobileDetailClient);
        }
        that.Page = {
            AddClient: new MobileAddClient(function (ClientID) {
                that.CallBackComplete_AddClient(ClientID);
            }, hidePage),
            Service: new MobileService(function (data) {
                that.CallBackComplete_AddService(data);
            }, hidePage),
            AppointmentService: new MobileAppointmentService(staffId, ScheduledDate, locationId, function (data) {
                that.CallBackComplete_AppointmentService(data);
            }, function (data) {
                that.CallBackRemove_AppointmentService(data);
            }, hidePage),
            RepeateScheulDate: new MobileRepeateScheulDate(function (data) {
                that.CallBackComplete_RepeateScheulDate(data);
            }, hidePage),
            DetailClient: new MobileDetailClient(function (ClientID) {
                that.CallBackRemoveClient_ClientDetail(ClientID)
            }, function (data) {
                that.CallBackHidePageClientDetail(data);
            }),
        };
        if (that.Parameter.StaffId != 0)
            that.Parameter.StaffName = that.Page.AppointmentService.GetNameStaffBaseId(that.Parameter.StaffId);
    }

    //#region Private

    //#region Call Back Page Another
    CallBackRemoveClient_ClientDetail() {
        this.Data.Appointment.ClientID = 0;
        this.Modal.find("#container-client-index").html("");
        this.Modal.find("#container-client-index").append(this.HTML.ClientEmpty);
        this.Modal.show("slow");
    }
    CallBackComplete_AddClient(data) {
        this.Data.Appointment.ClientID = data.ClientID;
        //show client
        this.Modal.find("#container-client-index").html("");
        this.Modal.find("#container-client-index").append(this.GetHtmlClientDetail(data));
        this.Modal.show("slow");
    }
    CallBackComplete_RepeateScheulDate(data) {
        this.Data.Appointment.ScheduledDate = moment(data.ScheduledDate).startOf("day").toDate();
        this.Data.Appointment.FrequencyType = data.FrequencyType;
        this.Data.Appointment.RepeatCount = data.RepeatCount;
        this.Data.Appointment.EndRepeat = data.EndRepeat;
        this.Modal.find("#container-repeat-scheulDate-index").html(this.GetHtml_RepeateScheulDate());
        this.Modal.show("slow");
        //set ScheduledDate For Page AppointmentService
        this.Page.AppointmentService.SetScheduledDate(data.ScheduledDate);
    }
    CallBackComplete_AddService(item) {
        var itemAppointmentService = this.Data.LsAppointmentService[0];
        itemAppointmentService.Service = item;
        itemAppointmentService.Duration = item.Duration;
        this.Data.LsAppointmentService[0] = itemAppointmentService;
        this.LoadAppointmentService();
        this.Modal.show("slow");
        this.Page.AppointmentService.NotifyCheckDateWorkingUserExist(this.Parameter.LocationID, this.Data.Appointment.ScheduledDate,
           itemAppointmentService.Duration, itemAppointmentService.StartTime, itemAppointmentService.StaffID);
    }
    CallBackComplete_AppointmentService(data) {
        if (data.IsCreate)
            this.Data.LsAppointmentService.push(data);
        else {
            this.Data.LsAppointmentService.forEach(function (element) {
                if (parseInt(element.ID) == parseInt(data.ID))
                    element = data;
            })
        }
        this.LoadAppointmentService();
        this.Modal.show("slow");
    }
    CallBackRemove_AppointmentService(data) {
        this.Data.LsAppointmentService = this.Data.LsAppointmentService.filter(n=> n.ID != data.ID);
        this.LoadAppointmentService();
        this.Modal.show("slow");
    }
    CallBackHidePage() {
        this.Modal.show("slow");
    }
    CallBackHidePageClientDetail(data) {
        this.Modal.find("#container-client-index").html("");
        this.Modal.find("#container-client-index").append(this.GetHtmlClientDetail(data));
        this.Modal.show("slow");
    }
    //#endregion

    //#region Appointment Service
    LoadAppointmentService() {
        var htmlAppointmentService = "";
        this.RemoveEventAppointmentService();
        this.Modal.find("#container-addAppointmentService").hide();

        if (this.Data.LsAppointmentService.length >= 1) {
            this.Modal.find("#container-addAppointmentService").show();
            this.SetTextTotal();
        }

        //get html
        if (this.Data.LsAppointmentService.length <= 1) {
            var data = this.Data.LsAppointmentService.length == 1 ? this.Data.LsAppointmentService[0] : this.GetAppoimentEmptyFor_AddAppointmentService();
            htmlAppointmentService = this.Page.AppointmentService.ReturnHtmlControl(data);
            if (this.Data.LsAppointmentService.length == 0)
                this.Data.LsAppointmentService.push(data);
        } else {
            var that = this;
            $.each(this.Data.LsAppointmentService, function () {
                htmlAppointmentService += that.LoadButtonDetailService(this);
            })
        }
        this.Modal.find("#container-service").html(htmlAppointmentService);
        this.CreateEventAppointmentService();
    }
    LoadButtonDetailService(data) {
        var startTime = moment().startOf("day").add(data.StartTime, "second");
        var des = this.Page.AppointmentService.GetTextDuration(data.Duration) + " with " + data.StaffName + (data.ResourceID ? (", " + data.ResourceName) : "");
        return this.HTML.ServiceItem.replace("@StartTime", startTime.format(Window.FormatTimeJS)).replace("@ServiceName", data.Service.ServiceName)
            .replace("@Description", des).replace("@IdTemporary", data.ID);
    }
    CreateEventAppointmentService() {
        var that = this;
        this.Modal.find("#addAppointmentService").click(function () {
            that.Modal.hide();
            that.Page.AppointmentService.OpenModal(that.GetAppoimentEmptyFor_AddAppointmentService());
        })
        this.Modal.on("click", "[name='editAppointmentService']", function () {
            var idtemporary = $(this).attr("idtemporary");
            var itemAppointmentService = that.Data.LsAppointmentService.find(function (element) {
                return parseInt(element.ID) == parseInt(idtemporary);
            });
            if (itemAppointmentService != undefined && itemAppointmentService != null) {
                itemAppointmentService.IsCreate = false;
                that.Page.AppointmentService.OpenModal(itemAppointmentService);
            }
        })
        //event appointment service item
        this.Modal.find("[name='Duration']").change(function () {
            var item = that.Data.LsAppointmentService[0];
            item.Duration = $(this).val();
            that.Data.LsAppointmentService[0] = item;
            that.SetTextTotal();
            that.Page.AppointmentService.NotifyCheckDateWorkingUserExist(that.Parameter.LocationID, that.Data.Appointment.ScheduledDate,
           item.Duration, item.StartTime, item.StaffID);
        })
        this.Modal.find("[name='StartTime']").change(function () {
            var item = that.Data.LsAppointmentService[0];
            item.StartTime = $(this).val();
            that.Data.LsAppointmentService[0] = item;
            that.Page.AppointmentService.NotifyCheckDateWorkingUserExist(that.Parameter.LocationID, that.Data.Appointment.ScheduledDate,
           item.Duration, item.StartTime, item.StaffID);
        })
        this.Modal.find("[name='StaffID']").change(function () {
            var item = that.Data.LsAppointmentService[0];
            item.StaffID = $(this).val();
            item.StaffName = $(this).text();
            that.Data.LsAppointmentService[0] = item;
        })
        this.Modal.find("[name='Resource']").change(function () {
            var item = that.Data.LsAppointmentService[0];
            item.ResourceID = $(this).val();
            item.ResourceName = $(this).find("option[value='" + item.ResourceID + "']").text();
            that.Data.LsAppointmentService[0] = item;
        })
        this.Modal.find("[name='IsRequest']").closest(".input-group-prepend").click(function () {
            var checkBox = $(this).find("[name='IsRequest']")[0];
            checkBox.checked = !checkBox.checked;
            var item = that.Data.LsAppointmentService[0];
            item.IsRequest = checkBox.checked;
            that.Data.LsAppointmentService[0] = item;
        })
        this.Modal.find("[name='Service']").click(function () {
            that.Modal.hide();
            that.Page.Service.OpenModal();
        })
    }
    ValidateAppointmentService() {
        if (this.Data.LsAppointmentService.length == 0)
            return false;
        var check = (this.Modal.find("[name='Service']").length == 0)
        * (this.Modal.find("[name='StaffID']").length == 0)
        * (this.Modal.find("[name='IsRequest']").length == 0)
        * (this.Modal.find("[name='StartTime']").length == 0)
        * (this.Modal.find("[name='Duration']").length == 0)
        * (this.Modal.find("[name='Resource']").length == 0);

        if (!check) {
            var itemFirst = this.Data.LsAppointmentService[0];
            check *= this.Page.AppointmentService.Validate(this.Modal, itemFirst.Service.ServiceID);
        }
        return check;
    }
    RemoveEventAppointmentService() {
        this.Modal.find("#addAppointmentService").off("click");
        this.Modal.off("click", "[name='editAppointmentService']");
    }
    SetTextTotal() {
        var durationTotal = 0;
        var totalPrice = 0;
        $.each(this.Data.LsAppointmentService, function () {
            durationTotal += parseInt(this.Duration);
            if (this.Service != null) {
                var SpecialPrice = parseInt(this.Service.SpecialPrice);
                var RetailPrice = parseInt(this.Service.RetailPrice);
                totalPrice += SpecialPrice == 0 ? RetailPrice : SpecialPrice;
            }
        })
        this.Data.Appointment.TotalAmount = totalPrice;
        this.Data.Appointment.TotalTimeInMinutes = durationTotal;
        this.Modal.find("#totalIndex").text("Total: " + $.FormatNumberMoney(totalPrice) + " (" + this.Page.AppointmentService.GetTextDuration(durationTotal) + ")");
    }
    GetAppoimentEmptyFor_AddAppointmentService() {
        var statTime = this.GetStarTimeFor_AddAppointmentService();
        var id = this.GetIdTemporaryForAppoitnmentService();
        return {
            ID: id,
            AppointmentServiceID: 0,
            StaffID: this.Parameter.StaffId,
            StaffName: this.Parameter.StaffName,
            ResourceID: 0,
            ResourceName: "",
            Duration: 0,
            IsRequest: false,
            StartTime: statTime,
            Service: null,
            IsCreate: true,
        }
    }
    GetStarTimeFor_AddAppointmentService() {
        if (this.Data.LsAppointmentService.length == 0)
            return this.Parameter.StartTime;
        else {
            var length = this.Data.LsAppointmentService.length;
            var itemLast = this.Data.LsAppointmentService[length - 1];
            var startTime = parseInt(itemLast.StartTime) + parseInt(itemLast.Duration);
            return startTime > 86100 ? 86100 : startTime;
        }
    }
    GetIdTemporaryForAppoitnmentService() {
        if (this.Data.LsAppointmentService.length == 0)
            return 0;
        else
            return this.Data.LsAppointmentService.length + 1;
    }
    //#endregion

    LoadCreate() {
        if (this.Modal) {
            this.Modal.remove();
            this.RemoveEvent();
        }
        this.Modal = $(this.HTML.Index);
        $("body").append(this.Modal);
        if ($.isNumeric(this.Parameter.ClientID) && this.Parameter.ClientID != 0) {
            var that = this;
            $.RequestAjax("/Calendar/GetClientBaseIdForAppointment", JSON.stringify({ ClientId: that.Parameter.ClientID }), function (data) {
                that.Modal.find("#container-client-index").html("");
                that.Modal.find("#container-client-index").append(that.GetHtmlClientDetail(data.Client));
            });
        } else
            this.Modal.find("#container-client-index").html(this.HTML.ClientEmpty);
        this.Modal.find("#container-repeat-scheulDate-index").html(this.GetHtml_RepeateScheulDate());
        this.LoadAppointmentService();
        this.CreateEvent();
    }
    LoadEdit(data) {
        if ($.isNumeric(this.Parameter.AppointmentId)) {
            var that = this;
            if (this.Modal) {
                this.Modal.remove();
                this.RemoveEvent();
            }
            that.Modal = $(that.HTML.Index);
            $("body").append(that.Modal);
            that.Modal.find("#titleModal").text("edit appointment");
            StartLoading();
            setTimeout(function () {
                $.RequestAjax("/Calendar/GetAppointmentBaseId", JSON.stringify({
                    "AppointmentID": that.Parameter.AppointmentId
                }), function (reponsive) {
                    var appointment = reponsive.Appointment;
                    var appointmentServices = reponsive.AppointmentServices;
                    var GetSecond = function (time) {
                        var hours = time.hour() * 60;
                        return hours * 60 + time.minute() * 60;
                    }
                    //set data
                    that.Data.AppointmentParent = reponsive.AppointmentParent;
                    that.Parameter.LocationID = appointment.LocationID;
                    that.Parameter.FrequencyTypeOld = appointment.FrequencyType;
                    that.Parameter.ScheduledDate = appointment.ScheduledDate;
                    that.Page.AppointmentService.SetLocationID(that.Parameter.LocationID);
                    that.Page.AppointmentService.SetScheduledDate(that.Parameter.ScheduledDate);
                    that.Data.Appointment = {
                        AppointmentID: appointment.AppointmentID,
                        ScheduledDate: moment(appointment.ScheduledDate, "YYYY/MM/DD").toDate(),
                        ClientID: appointment.ClientID != null && appointment.ClientID != undefined ? appointment.ClientID : 0,
                        LocationID: appointment.LocationID,
                        TotalAmount: appointment.TotalAmount,
                        TotalTimeInMinutes: appointment.TotalTimeInMinutes,
                        FrequencyType: appointment.FrequencyType,
                        RepeatCount: appointment.RepeatCount,
                        EndRepeat: appointment.EndRepeat ? moment(appointment.EndRepeat, "YYYY/MM/DD").toDate() : null,
                        Notes: appointment.Notes
                    };
                    that.Data.LsAppointmentService = [];
                    $.each(appointmentServices, function (index, item) {
                        that.Data.LsAppointmentService.push({
                            ID: index,
                            AppointmentServiceID: item.AppointmentServiceID,
                            StaffID: item.StaffID,
                            StaffName: item.StaffName,
                            ResourceID: item.ResourceID,
                            ResourceName: item.ResourceName,
                            Duration: item.Duration,
                            IsRequest: item.IsRequest,
                            Price: item.Price,
                            StartTime: GetSecond(moment(item.StartTime).startOf('day').add(item.StartTimeInSecond, "seconds")),
                            Service: {
                                ServiceName: item.ServiceName,
                                ServiceID: item.ServiceID,
                                RetailPrice: item.RetailPrice,
                                SpecialPrice: item.SpecialPrice,
                            },
                            IsCreate: false,
                        })
                    });

                    //html
                    if ($.isNumeric(that.Data.Appointment.ClientID) && that.Data.Appointment.ClientID != 0) {
                        $.RequestAjax("/Calendar/GetClientBaseIdForAppointment", JSON.stringify({ ClientId: that.Data.Appointment.ClientID }), function (data) {
                            that.Modal.find("#container-client-index").html("");
                            that.Modal.find("#container-client-index").append(that.GetHtmlClientDetail(data.Client));
                        });
                    } else
                        that.Modal.find("#container-client-index").html(that.HTML.ClientEmpty);
                    that.Modal.find("#container-repeat-scheulDate-index").html(that.GetHtml_RepeateScheulDate());
                    that.LoadAppointmentService();
                    that.CreateEvent();
                    that.Modal.find("#noteAppointment").val(that.Data.Appointment.Notes).trigger("keyup");
                    EndLoading();
                })
            }, 100);
        }
    }
    CreateEvent() {
        var that = this;
        //xử lý client
        this.Modal.on("click", "#clientAppointment", function () {
            if (that.Data.Appointment.ClientID != null && that.Data.Appointment.ClientID != undefined && $.isNumeric(that.Data.Appointment.ClientID) && that.Data.Appointment.ClientID != 0)
                that.Page.DetailClient.OpenModal(that.Data.Appointment.ClientID);
            else
                that.Page.AddClient.OpenModal();
            that.Modal.hide();
        });
        //xử lý cụm scheduled date
        this.Modal.on("click", "#repeat_isRequestAppointment", function () {
            that.Page.RepeateScheulDate.OpenModal({
                ScheduledDate: that.Data.Appointment.ScheduledDate,
                FrequencyType: that.Data.Appointment.FrequencyType,
                RepeatCount: that.Data.Appointment.RepeatCount,
                EndRepeat: that.Data.Appointment.EndRepeat,
            });
            that.Modal.hide();
        })
        //xử lý textarea auto tăng dòng
        this.Modal.find("#noteAppointment").keyup(function (event) {
            $(this).height(21);
            if (this.clientHeight < this.scrollHeight)
                $(this).height(this.scrollHeight);
        })
        //xử lý thoát modal
        this.Modal.find("[name='closeModal']").click(function (event) {
            that.RemoveModal();
        })
        //xử lý save
        this.Modal.find("#saveAppointment").click(function (event) {
            that.SaveData(function () {
                toastr["success"]("Data saved successfully.", "Notification");
                that.RemoveModal();
            });
        })
        this.Modal.find("#checkoutAppointment").click(function (event) {
            that.SaveData(function (rensponsive) {
                toastr["success"]("Data saved successfully.", "Notification");
                location.href = "/Sale/CheckOut?AppointmentID=" + rensponsive.AppointmentID;
            });
        })
    }
    RemoveEvent() {
        this.Modal.off("click", "#clientAppointment");
        this.Modal.find("#repeat_isRequestAppointment").off("click");
        this.Modal.find("#noteAppointment").off("keyup");
        this.Modal.find("[name='closeModal']").off("click");
        this.Modal.find("#saveAppointment").off("click");
        this.Modal.find("#checkoutAppointment").off("click");
    }
    GetHtmlClientDetail(Client) {
        var mobilenumberClient = (Client.MobileNumber == null || Client.MobileNumber == "") ? "" : ("+" + Client.MobileNumberDialCode + " " + Client.MobileNumber);
        var emailClient = (Client.Email == null || Client.Email == "") ? "" : Client.Email;
        return this.HTML.ClientDetail.replace("@Represent", ($.trim(Client.FirstName) == "" ? '' : Client.FirstName.toString().charAt(0).toUpperCase()))
                .replace("@FullName", ($.trim(Client.FirstName) == "" ? '' : Client.FirstName) + ($.trim(Client.LastName) == "" ? '' : ' ' + Client.LastName))
                .replace("@Description", (mobilenumberClient == "" && emailClient == "") ? "" : (mobilenumberClient == "" ? emailClient : (emailClient == "" ? mobilenumberClient : (mobilenumberClient + ", " + emailClient))));
    }
    GetHtml_RepeateScheulDate() {
        return this.HTML.Repeat_ScheulDate.replace("@ScheulDate", moment(this.Data.Appointment.ScheduledDate).format(Window.FormatDateWithDayOfWeekJS)).replace("@Description", this.GetTextDescription_RepeateScheulDate());
    }
    GetTextDescription_RepeateScheulDate() {
        var GetRepeateTime = function (dateStart, dateFinish, numberFrequency, unitFrequency) {
            var duration = moment.duration(dateFinish.diff(dateStart));
            var time = duration.asDays();
            if (unitFrequency == "weekly")
                time = duration.asWeeks();
            else if (unitFrequency == "monthly")
                time = duration.asMonths();
            return parseInt(time) / parseInt(numberFrequency) + 1;
        }
        var dateAppointMent = moment(this.Data.Appointment.ScheduledDate).startOf('day');
        var unitFrequency = this.Data.Appointment.FrequencyType.toString().split(":")[0];
        var numberFrequency = this.Data.Appointment.FrequencyType.toString().split(":")[1];
        var textDescription = "";
        if (this.Data.Appointment.RepeatCount != "date" && this.Data.Appointment.RepeatCount != "ongoing" && this.Data.Appointment.FrequencyType != "no-repeat") {
            var repeatCount = this.Data.Appointment.RepeatCount.split(":")[1];
            --repeatCount;
            var prefixFrequency = unitFrequency == "daily" ? "days" : (unitFrequency == "weekly" ? "weeks" : "months");
            textDescription = "Repeats until " + dateAppointMent.add(repeatCount * numberFrequency, prefixFrequency).format("dddd, DD MMM YYYY");
        } else if (this.Data.Appointment.RepeatCount == "date" && this.Data.Appointment.EndRepeat != null) {
            var date = moment(this.Data.Appointment.EndRepeat).startOf('day');
            var repeatTime = GetRepeateTime(dateAppointMent, date, numberFrequency, unitFrequency);
            textDescription = "Repeats " + repeatTime + " times";
        } else if (this.Data.Appointment.RepeatCount == "ongoing") {
            var datefinish = moment().startOf('day').add(1, "years");
            var repeatTime = GetRepeateTime(dateAppointMent, datefinish, numberFrequency, unitFrequency);
            --repeatTime;
            var prefixFrequency = unitFrequency == "daily" ? "days" : (unitFrequency == "weekly" ? "weeks" : "months");
            textDescription = "Repeats until " + dateAppointMent.add(repeatTime * numberFrequency, prefixFrequency).format("dddd, DD MMM YYYY");
        }
        else
            textDescription = "Doesn't repeat";

        return textDescription;
    }
    NotifyUpdateAllOrOnly(callback) {
        var modalNotify = $(this.HTML.NotifyUpdateAllOrOnly);
        var that = this;
        this.Modal.hide();
        var remove = function () {
            modalNotify.remove();
            that.Modal.show("slow");
            modalNotify.find("#container-opitionSaveUpdateAppointment").off("click");
            modalNotify.find("[name='closeModal']").off("click");
            modalNotify.find("#saveUpdateAppointment").off("click");
        }
        $("body").append(modalNotify);
        //create event
        modalNotify.find("[name='container-opitionSaveUpdateAppointment']").click(function () {
            var checkbox = $(this).find("[name='opitionSaveUpdateAppointment']")[0];
            checkbox.checked = !checkbox.checked;
            $(checkbox).trigger("change");
        })
        modalNotify.find("[name='closeModal']").click(function () {
            remove();
        })
        modalNotify.find("#saveUpdateAppointment").click(function () {
            var valueOpition = modalNotify.find("[name='opitionSaveUpdateAppointment']:checked").attr("valueopition");
            //valueOpition == 0: update only
            if (callback)
                callback(parseInt(valueOpition) == 0);
            remove();
        })
    }
    SaveData(callback) {
        if (this.ValidateAppointmentService()) {
            var that = this;
            this.Data.Appointment.Notes = this.Modal.find("#noteAppointment").val();
            var dataSave = {
                Appointment: this.Data.Appointment,
                AppointmentServices: [],
                isUpadate: !this.Parameter.IsCreate,
                StartTime: this.Data.LsAppointmentService[0].StartTime,
                lsScheduledDate: [moment(this.Data.Appointment.ScheduledDate).format("YYYY/MM/DD")]
            }
            var urlRequest = "/Calendar/SaveCreateAppointment";
            var save = function () {
                StartLoading();
                setTimeout(function () {
                    $.RequestAjax(urlRequest, JSON.stringify(dataSave), function (renponsive) {
                        EndLoading();
                        if (callback)
                            callback(renponsive);
                        if (that.Parameter.CallBack)
                            that.Parameter.CallBack();
                    })
                }, 100);
            }
            //get data appointment service
            $.each(this.Data.LsAppointmentService, function (index, item) {
                var date = moment(that.Data.Appointment.ScheduledDate);
                dataSave.AppointmentServices.push({
                    AppointmentServiceID: item.AppointmentServiceID,
                    ServiceID: item.Service.ServiceID,
                    Duration: item.Duration,
                    StaffID: item.StaffID,
                    ResourceID: !$.isNumeric(item.ResourceID) || item.ResourceID == 0 ? null : item.ResourceID,
                    StartTime: date.add(item.StartTime, "second").format("YYYY/MM/DD HH:mm"),
                    RetailPrice: item.Service.RetailPrice,
                    SpecialPrice: item.Service.SpecialPrice,
                    IsRequest: item.IsRequest,
                    SortOrder: index
                })
            })
            //get data.lsScheduledDate;
            if (this.Data.Appointment.FrequencyType != "no-repeat") {
                var dateAppointMent = moment(this.Data.Appointment.ScheduledDate);
                var unitFrequency = this.Data.Appointment.FrequencyType.toString().split(":")[0];
                var numberFrequency = this.Data.Appointment.FrequencyType.toString().split(":")[1];
                var prefixFrequency = unitFrequency == "daily" ? "days" : (unitFrequency == "weekly" ? "weeks" : "months");
                if (this.Data.Appointment.RepeatCount != "ongoing") {
                    var repeatCount = 0;
                    if (this.Data.Appointment.RepeatCount == "date") {
                        var duration = moment.duration(moment(this.Data.Appointment.EndRepeat).diff(dateAppointMent));
                        var time = duration.asDays();
                        if (unitFrequency == "weekly")
                            time = duration.asWeeks();
                        else if (unitFrequency == "monthly")
                            time = duration.asMonths();
                        repeatCount = parseInt(time) / parseInt(numberFrequency);
                    } else
                        repeatCount = parseInt(this.Data.Appointment.RepeatCount.split(":")[1]) - 1;
                    for (var i = 1; i <= repeatCount; ++i) {
                        dataSave.lsScheduledDate.push(moment(dateAppointMent.toDate()).add(numberFrequency * i, prefixFrequency).format("YYYY/MM/DD"))
                    }
                } else {
                    var date = moment(dateAppointMent.toDate());
                    var finish = moment().add(1, "years");
                    date.add(numberFrequency, prefixFrequency);
                    while (date.isSameOrBefore(finish)) {
                        dataSave.lsScheduledDate.push(date.format("YYYY/MM/DD"));
                        date.add(numberFrequency, prefixFrequency)
                    }
                }
            }
            //when is edit
            if (!this.Parameter.IsCreate) {
                dataSave.Appointment.AppointmentID = this.Parameter.AppointmentId;
                dataSave.isUpdateOnly = true;
                urlRequest = "/Calendar/SaveEditAppointment";
                if (this.Parameter.FrequencyTypeOld == "no-repeat")
                    save();
                else {
                    this.NotifyUpdateAllOrOnly(function (isUpdateOnly) {
                        dataSave.isUpdateOnly = isUpdateOnly;
                        save();
                    })
                }
            } else
                save();
        }
    }
    //#endregion

    //#region Public
    OpenModal() {
        ; debugger;
        var that = this;
        if (this.HTML.Index == null || this.HTML.ClientDetail == null || this.HTML.ClientEmpty == null || this.HTML.Repeat_ScheulDate == null || this.HTML.ServiceItem == null
            || that.HTML.Control.Duration == null || that.HTML.Control.Staff_IsRequest == null || that.HTML.Control.Starttime12h == null || that.HTML.Control.Starttime24h == null
            || that.HTML.ContentShare.ServiceShare == null) {
            $.RequestAjaxText(LinkFileMobileAppointment.Index.Index, function (data) { that.HTML.Index = data; });
            $.RequestAjaxText(LinkFileMobileAppointment.Index.ClientDetail, function (data) { that.HTML.ClientDetail = data; });
            $.RequestAjaxText(LinkFileMobileAppointment.Index.ClientEmpty, function (data) { that.HTML.ClientEmpty = data; });
            $.RequestAjaxText(LinkFileMobileAppointment.Index.Repeat_ScheulDate, function (data) { that.HTML.Repeat_ScheulDate = data; });
            $.RequestAjaxText(LinkFileMobileAppointment.Index.ServiceItem, function (data) { that.HTML.ServiceItem = data; });
            $.RequestAjaxText(LinkFileMobileAppointment.Index.NotifyUpdateAllOrOnly, function (data) { that.HTML.NotifyUpdateAllOrOnly = data; });
        }

        if (this.Parameter.AppointmentId != null && this.Parameter.AppointmentId != undefined && this.Parameter.AppointmentId != 0 && $.isNumeric(this.Parameter.AppointmentId))
            this.LoadEdit();
        else
            this.LoadCreate();
    }
    RemoveModal() {
        this.Page.AddClient.RemoveModal();
        this.Page.AppointmentService.RemoveModal();
        this.Page.DetailClient.RemoveModal();
        this.Page.RepeateScheulDate.RemoveModal();
        this.Page.Service.RemoveModal();
        this.RemoveEventAppointmentService();
        this.RemoveEvent();
        this.Modal.remove();
        if (this.Parameter.CallBack)
            this.Parameter.CallBack();
    }
    //#endregion
}