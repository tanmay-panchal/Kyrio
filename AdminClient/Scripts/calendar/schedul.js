var GetSecond = function (time) {
    var hours = time.hour() * 60;
    return hours * 60 + time.minute() * 60;
}
$(function () {
    window.isCreateBlockTimeScheul = false;
    var historyRequestCanlendar = [];
    //#region Create Control
    var opitionSelectTimeModalBlockTime;
    $.GetStarTimeScheul = function (callback) {
        if ($("#staffResourSearch").val()) {
            var startTime, endTime;
            var modeView = Window.BusinessDefaultCalendarView;
            var staffID = 0;
            startTime = endTime = $("#inputDate").data('daterangepicker').startDate.local().toDate();
            if (modeView == "scheulWeek")
                endTime = $("#inputDate").data('daterangepicker').endDate.local().toDate();
            if ($.isNumeric($("#staffResourSearch").val().split(":")[1]))
                staffID = $("#staffResourSearch").val().split(":")[1];
            $.RequestAjax("/Calendar/GetStartTimeCalendar", JSON.stringify({
                FromDate: startTime,
                ToDate: endTime,
                ModeView: modeView,
                LocationID: $("#locationSearch").val(),
                StaffID: staffID,
            }), function (result) {
                var duration = {
                    hours: result.Hour,
                    minutes: result.Minute,
                    seconds: 0,
                };
                if (callback)
                    callback(duration);
            })
        }
    }
    $.SaveBlockTime = function (entity, isUpdate, Start, End, callback) {
        $.RequestAjax("/Calendar/SaveBlockTime", JSON.stringify({
            entity: entity,
            isUpdate: isUpdate,
            Start: Start,
            End: End
        }), callback);
    }
    $.DeleteBlockTime = function (id, callback) {
        $.RequestAjax("/Calendar/DeleteBlockTime", JSON.stringify({
            id: id,
        }), callback);
    }
    $.ModalBlockTime = function (entity, isUpdate, locationCombobox, staffCombobox, canlendarSchedul, staffID) {
        var modal = $('<div class="modal fade"><div class="modal-dialog" role="document"><div class="modal-content">'
            + '<div class="modal-header"><h3 class="modal-title"></h3><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>'
            + '<div class="modal-body"><form novalidate="novalidate">'
            + '</form></div>'
            + '<div class="modal-footer"></div>'
            + '</div></div>');
        if (!opitionSelectTimeModalBlockTime)
            $.RequestAjaxText(Window.TimeFormat == "24" ? "/ContentHtml/ComboboxTime/Combobox24h.html" : "/ContentHtml/ComboboxTime/Combobox12h.html", function (data) { opitionSelectTimeModalBlockTime = data; });
        var DateWorkingControl = '<div class="form-group"><label class="col-form-label">Date</label>'
            + '<div class="input-group mb-4"><div class="input-group-prepend"><span class="input-group-text"><i class="fa fa-calendar"></i></span></div><input type="text" class="form-control" id="DateWorking" name="DateWorking">'
            + '</div>';
        var staffControl = '<div class="form-group"><label class="col-form-label">Staff</label>'
            + '<select style="width: 100%" type="text" class="form-control" id="StaffID" name="StaffID" urlselection="/Home/GetUserBaseId"></select>'
            + '</div>';
        var timeControl = '<div class="form-group">'
            + '<div class="col-fhd-6 col-xlg-6 col-md-6 col-sm-12 col-xs-6 p-0"><label class="col-form-label">Start Time</label><select class="form-control" id="StartTime" name="StartTime"></select></div>'
            + '<div class="col-fhd-6 col-xlg-6 col-md-6 col-sm-12 col-xs-6 p-0"><label class="col-form-label">End Time</label><select class="form-control" id="EndTime" name="EndTime"></select></div>'
            + '</div>';
        var desControl = '<div class="form-group"><label class="col-form-label">Description</label>'
            + '<textarea class="form-control" rows="3" id="Description" name="Description" placeholder="Description"></textarea>'
            + '</div>';
        var buttonUpdate = '<div class="col-6"><button type="button" class="btn btn-block btn-danger" id="buttonDeleteModal">Delete</button></div></div>'
            + '<div class="col-6"><button type="button" class="btn btn-block btn-success" id="buttonSaveModal">Save</button></div></div>';
        var buttonCreate = '<div class="col-12"><button type="button" class="btn btn-block btn-success" id="buttonSaveModal">Save</button></div></div>';
        modal.find("form").append(DateWorkingControl + staffControl + timeControl + desControl);
        modal.find(".modal-footer").append(isUpdate ? buttonUpdate : buttonCreate);
        modal.find("#StartTime, #EndTime").append(opitionSelectTimeModalBlockTime);
        modal.find("#DateWorking").daterangepicker({
            "singleDatePicker": true,
        });
        modal.find("#StaffID").InStallSelect2('/Home/LoadSelect2ForUserLocation', 20, 'Staff', { LocationId: locationCombobox.val() });
        if (staffID)
            modal.find("#StaffID").SetValueSelect2ID(staffID);
        modal.find("#StartTime, #EndTime").val(0);
        modal.modal({
            keyboard: false,
            show: true,
            backdrop: "static"
        });
        //validate
        $.validator.addMethod("requiredselect", function (value, element, arg) {
            return value != null && value != "" && value != "0";
        });
        $.validator.addMethod("compareTimeModal", function (value, element, arg) {
            return parseInt(modal.find("#StartTime").val()) <= parseInt(modal.find("#EndTime").val());
        });
        var validate = modal.find("form").validate({
            rules: {
                StaffID: { requiredselect: "" },
                StartTime: { compareTimeModal: "" },
                EndTime: { compareTimeModal: "" },
            },
            messages: {
                StaffID: { requiredselect: "Please choose time staff" },
                StartTime: { compareTimeModal: "The start time is less than or equal to the end time" },
                EndTime: { compareTimeModal: "The start time is less than or equal to the end time" },
            },
            errorElement: 'em',
            errorPlacement: function (error, element) {
                error.addClass('invalid-feedback');
                if (element.prop('type') === 'checkbox') {
                    error.insertAfter(element.parent('label'));
                } else {
                    error.insertAfter(element);
                }
            },
            highlight: function (element, errorClass, validClass) {
                $(element).addClass('is-invalid').removeClass('is-valid');
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).addClass('is-valid').removeClass('is-invalid');
            },
        });
        modal.on("shown.bs.modal", function () {
            modal.find("#StartTime").val(GetSecond(moment(entity.StartTime)));
            modal.find("#EndTime").val(GetSecond(moment(entity.EndTime)));
            modal.find("#DateWorking").data('daterangepicker').setStartDate(entity.DateWorking);
            modal.find("#DateWorking").data('daterangepicker').setEndDate(entity.DateWorking);
            if (isUpdate) {
                modal.find("#StaffID").SetValueSelect2ID(entity.StaffID);
                modal.find("#Description").val(entity.Description ? entity.Description : "");
                modal.find(".modal-title").text("Edit Blocked Time");
            } else
                modal.find(".modal-title").text("New Blocked Time");
            //create event
            if (isUpdate) {
                modal.find("#buttonDeleteModal").click(function () {
                    $.InStallPopupConfirm({
                        title: "Notification",
                        text: "Do you want to delete?",
                    }, [{
                        text: "No",
                        click: function (notice) {
                            notice.close();
                            modal.modal("hide");
                        }
                    }, {
                        text: "Yes",
                        addClass: 'brighttheme-primary',
                        click: function (notice) {
                            $.DeleteBlockTime(entity.BlockTimeID, function () {
                                canlendarSchedul.RefetchCanlendarSchedul(true);
                                notice.close();
                                modal.modal("hide");
                                toastr["success"]("Data saved successfully.", "Notification");
                            })
                        }
                    }])
                })
            }
            modal.find("#buttonSaveModal").click(function () {
                if (modal.find("form").valid()) {
                    var dateWorking = modal.find("#DateWorking").data('daterangepicker').startDate.local();
                    var startTime = dateWorking.toDate();
                    var endTime = dateWorking.toDate();
                    $.SaveBlockTime({
                        BlockTimeID: isUpdate ? entity.BlockTimeID : 0,
                        LocationID: locationCombobox.val(),
                        StaffID: modal.find("#StaffID").val(),
                        DateWorking: moment(dateWorking.toDate()).format("YYYY/MM/DD"),
                        StartTime: moment(startTime).add(modal.find("#StartTime").val(), 's').toDate(),
                        EndTime: moment(endTime).add(modal.find("#EndTime").val(), 's').toDate(),
                        Description: modal.find("#Description").val(),
                    }, isUpdate, modal.find("#StartTime").val(), modal.find("#EndTime").val(), function () {
                        canlendarSchedul.RefetchCanlendarSchedul(true);
                        modal.modal("hide");
                        toastr["success"]("Data saved successfully.", "Notification");
                    })
                }
            })
        })
        modal.on("hidden.bs.modal", function () {
            modal.find("#buttonDeleteModal").off("click");
            modal.find("#buttonSaveModal").off("click");
            validate.destroy();
            modal.remove();
        })
    }
    $.fn.extend({
        ComboboxLocation: function (callback) {
            if ($(this).is("select")) {
                $(this).html("");
                var that = this;
                $.RequestAjax("/Calendar/LoadDataComboboxLocation", null, function (data) {
                    var locationidscheul = localStorage.getItem("locationidscheul");
                    $.each(data.Results, function (index, item) {
                        var select = locationidscheul ? locationidscheul == item.LocationID : index == 0;
                        $(that).append(new Option(item.LocationName, item.LocationID, select, select));
                    })
                    if (data.Results.length > 0 && !locationidscheul)
                        localStorage.setItem("locationidscheul", data.Results[0].LocationID);
                    $(that).change(function () {
                        localStorage.setItem("locationidscheul", $(that).val());
                    })
                    if (callback)
                        callback();
                })
            }
        },
        ComboboxResourceStaff: function (comboboxLocation, callback) {
            if ($(this).is("select")) {
                $(this).html("");
                var that = this;
                var LoadCombobox = function () {
                    if ($(comboboxLocation).val() != "" && $(comboboxLocation).val()) {
                        $(that).html("");
                        $.RequestAjax("/Calendar/LoadDataComboboxResourceStaff", JSON.stringify({ LocationId: $(comboboxLocation).val() }), function (data) {
                            var Staffs = data.Results.Staffs;
                            var Resources = data.Results.Resources;
                            var isHide = JSON.parse(data.Results.IsHide);
                            $(that).find("option").remove();
                            if (isHide) {
                                $(that).hide();
                                $.each(Staffs, function (index, item) {
                                    $(that).append(new Option((item.FirstName ? item.FirstName : "") + " " + (item.LastName ? item.LastName : ""), "employee:" + item.UserID));
                                })
                            } else {
                                $(this).show();
                                if (Staffs.length > 0) {
                                    var isFirstLogin = localStorage.getItem("IsFirstLogin") == "true" ? true : false;
                                    $(that).append('<optgroup label="Staff"></optgroup>');
                                    $(that).append(new Option("Working Staff", "employee:working"));
                                    if (Staffs.length > 1)
                                        $(that).append(new Option("All Staff", "employee:all"));
                                    $.each(Staffs, function (index, item) {
                                        $(that).append(new Option((item.FirstName ? item.FirstName : "") + " " + (item.LastName ? item.LastName : ""), "employee:" + item.UserID));
                                    })
                                    if (isFirstLogin) {
                                        $(that).val("employee:all");
                                        localStorage.setItem("IsFirstLogin", false);
                                    }
                                }
                                if (Resources.length > 0) {
                                    $(that).append('<optgroup label="Resources"></optgroup>');
                                    if (Resources.length > 1)
                                        $(that).append(new Option("All Resources", "room:all"));
                                    $.each(Resources, function (index, item) {
                                        $(that).append(new Option(item.ResourceName, "room:" + item.ResourceID));
                                    })
                                }
                            }
                            if (callback)
                                callback();
                        })
                    }
                }
                LoadCombobox();
                $(comboboxLocation).change(function () {
                    LoadCombobox();
                    $(that).trigger("change")
                })
            }
        },
        Datetimepicker: function (idInputDate, idButtonPrevious, idButtonNext, idButtonToday, buttonWeek, buttonDay) {
            if ($(this).is("div")) {
                var that = this;
                var isFormatInputDatePicker = Window.BusinessDefaultCalendarView;
                $(that).append('<div class="row">'
                    + '<div class="title">'
                    + '<button type="button" class="btn btn-outline-primary btn-block" id="' + idButtonPrevious + '"><i class="fa fa-chevron-left"></i></button></div>'
                    + '<div class="hidden-xs button-today">'
                    + '<button type="button" class="btn btn-primary btn-block" id="' + idButtonToday + '">Today</button></div>'
                    + '<div class="inputDateSingle">'
                    + '<input type="text" class="form-control" readonly id="' + idInputDate + '"/></div>'
                    + '<div class="title">'
                    + '<button type="button" class="btn btn-outline-primary btn-block" id="' + idButtonNext + '"><i class="fa fa-chevron-right"></i></button></div></div>');
                $(that).addClass("date-toolbar");
                var SetValueDatePicker = function (dateStart, dateFinish) {
                    $("#" + idInputDate).data('daterangepicker').setStartDate(dateStart);
                    $("#" + idInputDate).data('daterangepicker').setEndDate(dateFinish);
                    $("#" + idInputDate).trigger("apply.daterangepicker");
                }
                var AddValueDatePicker = function (date) {
                    $("#" + idInputDate).data('daterangepicker').startDate.add(date, 'day');
                    $("#" + idInputDate).data('daterangepicker').endDate.add(date, 'day');
                    $("#" + idInputDate).trigger("apply.daterangepicker");
                }
                var RemoveEvent = function () {
                    $("#" + idButtonPrevious).off("click");
                    $("#" + idButtonNext).off("click");
                    $("#" + idButtonToday).off("click");
                }
                var datePickerDay;
                var CreateDatePickerDay = function () {
                    RemoveEvent();
                    datePickerDay = datePickerDay ? datePickerDay : $.NowTimeZone();
                    $(buttonWeek).attr("class", "btn-schedul");
                    $(buttonDay).attr("class", "btn-outline-schedul");
                    if ($("#" + idInputDate).data('daterangepicker'))
                        $("#" + idInputDate).data('daterangepicker').remove();
                    $("#" + idInputDate).daterangepicker({
                        "singleDatePicker": true,
                        "autoApply": true,
                        "autoUpdateInput": false,
                        "startDate": datePickerDay,
                        "endDate": datePickerDay,
                    });
                    $("#" + idInputDate).on('apply.daterangepicker', function (ev, picker) {
                        datePickerDay = $(this).data('daterangepicker').startDate;
                        $(this).val($(this).data('daterangepicker').startDate.format("dddd DD MMM, YYYY")).trigger("change");
                    });
                    SetValueDatePicker(datePickerDay, datePickerDay);
                    $("#" + idButtonPrevious).click(function () {
                        AddValueDatePicker(-1);
                    })
                    $("#" + idButtonNext).click(function () {
                        AddValueDatePicker(1);
                    })
                    $("#" + idButtonToday).click(function () {
                        SetValueDatePicker(moment(moment().tz(Window.TimeZone).format("YYYY-MM-DD")).toDate(), moment(moment().tz(Window.TimeZone).format("YYYY-MM-DD")).toDate());
                    })
                }
                var CreateDatePickerWeek = function (dateStart, dateFinish) {
                    RemoveEvent();
                    $(buttonDay).attr("class", "btn-schedul");
                    $(buttonWeek).attr("class", "btn-outline-schedul");
                    if ($("#" + idInputDate).data('daterangepicker'))
                        $("#" + idInputDate).data('daterangepicker').remove();
                    $("#" + idInputDate).InStallPickerWeek(parseInt(Window.BusinessBeginningOfWeek));
                    $("#" + idInputDate).on('apply.daterangepicker', function (ev, picker) {
                        $(this).val($(this).data('daterangepicker').startDate.format("DD") + "-" +
                            $(this).data('daterangepicker').endDate.format("DD MMM, YYYY")).trigger("change");;
                    });
                    if (dateStart && dateFinish)
                        SetValueDatePicker(dateStart, dateFinish);
                    $("#" + idButtonPrevious).click(function () {
                        AddValueDatePicker(-7);
                    })
                    $("#" + idButtonNext).click(function () {
                        AddValueDatePicker(7);
                    })
                    $("#" + idButtonToday).click(function () {
                        var firstday = $.fn.daterangepicker.FirstDay;
                        SetValueDatePicker(moment().tz(Window.TimeZone).day(firstday)._d, moment().tz(Window.TimeZone).day(firstday).add(6, 'day')._d);
                    })
                }
                if (Window.BusinessDefaultCalendarView == "day")
                    CreateDatePickerDay();
                else
                    CreateDatePickerWeek();
                $(buttonWeek).click(function () {
                    if (isFormatInputDatePicker == "day") {
                        var date = moment($("#" + idInputDate).data('daterangepicker').startDate.toDate());
                        var startDate = date.startOf('week');
                        var finishDate = moment(startDate.toDate()).add(6, 'day');
                        CreateDatePickerWeek(startDate._d, finishDate._d);
                        isFormatInputDatePicker = "week";
                    }
                })
                $(buttonDay).click(function () {
                    if (isFormatInputDatePicker == "week") {
                        CreateDatePickerDay();
                        isFormatInputDatePicker = "day";
                    }
                })
            }
        },
        CreateCanlendarSchedul: function (idInputDate, comboboxLocation, comboboxStaff, NotifyNoScheduled, NotifyNoStaff, NotifyContaint, buttonWeek, buttonDay, buttonAlowShowCanlendar) {
            if ($(this).is("div") && typeof ($.fn.fullCalendar) != 'undefined') {
                var that = this;
                //Method Support
                var comboboxStaffIsWorkingStaff = $(comboboxStaff).val() == "employee:working";
                var LoadAgainCalendar = function (noCheck) {
                    $(that).RefetchCanlendarSchedul(noCheck);
                }
                var UpdateAppointment = function (event, resouce) {
                    var id = event.id.split("_" + event.TypeItem)[0];
                    var userId = resouce.isEmployee ? resouce.id : event.userID;
                    var resourceId = resouce.isResource ? resouce.id : event.resourceID;
                    $.RequestAjax("/Calendar/UpdateAppointment", JSON.stringify({
                        AppointmentServiceID: id,
                        AppointmentID: event.appointmentID,
                        ScheduledDate: event.start.local().toDate(),
                        StartTime: event.start.local().toDate(),
                        EndTime: event.end.local().toDate(),
                        Duration: GetSecond(event.end) - GetSecond(event.start),
                        UserID: userId,
                        ResourceID: resourceId,
                        IsEmployee: event.isEmployee,
                        Start: GetSecond(event.start)
                    }), function (reponsive) {
                        toastr["success"]("Data saved successfully.", "Notification");
                        LoadAgainCalendar(true);
                    })
                }
                var UpdateBlockTime = function (event) {
                    var BlockTimeID = event.id.split("_" + event.TypeItem)[0];
                    $.SaveBlockTime({
                        BlockTimeID: BlockTimeID,
                        StaffID: event.resourceId,
                        Description: event.description,
                        DateWorking: event.start.local().toDate(),
                        StartTime: event.start.local().toDate(),
                        EndTime: event.end.local().toDate(),
                    }, true, GetSecond(event.start), GetSecond(event.end), function () {
                        LoadAgainCalendar(true);
                        toastr["success"]("Data saved successfully.", "Notification");
                    })
                }
                var formatDate = Window.TimeFormat == "24" ? "HH:mm" : "hh:mm A";
                var ChangeWorkingStaffToStaffFirst = function () {
                    var value = $(comboboxStaff).val();
                    var prefixStaff = value.split(":")[0];
                    comboboxStaffIsWorkingStaff = false;
                    $(comboboxStaff).find("option").each(function () {
                        var valItem = $(this).attr("value");
                        var prefixOption = valItem.split(":")[0];
                        var valueOption = valItem.split(":")[1];
                        if ($.isNumeric(valueOption) && prefixOption == prefixStaff) {
                            $(comboboxStaff).val(valItem).trigger("change");
                            return false;
                        }
                    })
                }
                $.RequestAjax("/Calendar/CheckShowScheulBaseUser", null, function (data) {
                    var allowShowCandendar = localStorage.getItem("allowShowCandendar");
                    allowShowCandendar = allowShowCandendar == null ? false : JSON.parse(allowShowCandendar);
                    $(NotifyNoScheduled).addClass("d-none");
                    $(NotifyNoStaff).addClass("d-none");
                    $(NotifyContaint).addClass("d-none");
                    $(that).addClass("d-none");
                    if (JSON.parse(data) || allowShowCandendar) {
                        $.GetStarTimeScheul(function (result) {
                            if (Window.BusinessDefaultCalendarView != "day")
                                ChangeWorkingStaffToStaffFirst();
                            $(that).removeClass("d-none");
                            $(that).fullCalendar({
                                schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                                header: true,
                                selectable: true,
                                editable: true,
                                nowIndicator: true,
                                slotLabelFormat: formatDate,
                                allDaySlot: false,
                                slotEventOverlap: false,
                                //snapDuration: '00:05:00',
                                slotDuration: { minutes: parseInt(Window.BusinessTimeSlotMinutes) },
                                height: $(document).height() - $(that).offset().top,
                                minTime: result,
                                now: moment().tz(Window.TimeZone).format(),
                                defaultDate: moment(moment().tz(Window.TimeZone).format("YYYY-MM-DD")),
                                defaultView: Window.BusinessDefaultCalendarView == "day" ? 'scheulDay' : 'scheulWeek',
                                firstDay: parseInt(Window.BusinessBeginningOfWeek),
                                navLinks: true,
                                navLinkDayClick: function (date, jsEvent) {
                                    $(buttonDay).trigger("click");
                                    $("#" + idInputDate).data('daterangepicker').setStartDate(date);
                                    $("#" + idInputDate).data('daterangepicker').setEndDate(date);
                                    $("#" + idInputDate).trigger("apply.daterangepicker");
                                },
                                eventRender: function (eventObj, $el) {
                                    var color = "#BEBEBE";
                                    var clientName = "";
                                    var icoinHtml = "";
                                    if (eventObj.TypeItem == "appointment") {
                                        color = eventObj.appointmentColor;
                                        clientName = eventObj.clientName;
                                        $el.find(".fc-title").html("<span>" + eventObj.serviceName + "</span>");
                                        if (eventObj.isRequest)
                                            icoinHtml += '<p class="mr-1 ml-1" style="flex-basis: 12px"><i class="fa fa-heart text-danger"></i></p>';
                                        if (eventObj.bookingType == "booking_type_online")
                                            icoinHtml += '<p class="mr-1 ml-1" style="flex-basis: 12px"><i class="fa fa-cloud"></i></p>';
                                        if (eventObj.InvoiceStatus) {
                                            icoinHtml = "<p class='mb-1' style='flex-basis: 32px'>"
                                                + "<span class='pr-1' data-toggle='tooltip' title='@TitleTooltip'>@icon</span>"
                                                + "<span data-toggle='tooltip' title='Appointment completed'><i class='fa fa-check'></i></span></p>"
                                            switch (eventObj.InvoiceStatus) {
                                                case "invoice_status_complete":
                                                    icoinHtml = icoinHtml.replace("@icon", "<i class='fa fa-file'></i>").replace("@TitleTooltip", "Fully paid")
                                                    break;
                                                case "invoice_status_unpaid":
                                                    icoinHtml = icoinHtml.replace("@icon", "<i class='fa fa-file-o'></i>").replace("@TitleTooltip", "Unpaid invoice")
                                                    break;
                                                case "invoice_status_part_paid":
                                                    icoinHtml = icoinHtml.replace("@icon", "<i class='fa fa-file-o'></i>").replace("@TitleTooltip", "Part-paid invoice")
                                                    break;
                                            }
                                        }
                                    }
                                    $el.find(".fc-time").html("<p class='mb-1 d-flex flex-wrap' style='flex: 1; white-space: nowrap'><span class='fc-appointment-time'>" + eventObj.start.format(formatDate) + (eventObj.end ? " - " + eventObj.end.format(formatDate) : "") + "</span>"
                                        + "<span class='fc-client'> " + clientName + "</span></p>" + icoinHtml);
                                    $el.find(".fc-time").addClass("d-flex");
                                    $el.css("border", "none");
                                    $el.append('<div class="border-time"></div>');
                                    $el.find(".border-time").css("background-color", color);
                                },
                                views: {
                                    scheulWeek: {
                                        type: 'agendaWeek',
                                        columnHeaderFormat: "ddd DD MMM",
                                    },
                                    scheulDay: {
                                        type: 'agendaDay',
                                    }
                                },
                                resourceText: function (resource) {
                                    return $(that).fullCalendar('getView').name == "scheulWeek" ? "" : resource.title;
                                },
                                resources: function (callback) {
                                    if ($(comboboxStaff).find("option").length > 0) {
                                        var valueStaff = $(comboboxStaff).val();
                                        var prefixStaff = valueStaff.split(":")[0];
                                        var value = valueStaff.split(":")[1];
                                        var locationID = $(comboboxLocation).val();
                                        if (comboboxStaffIsWorkingStaff) {
                                            $.RequestAjax("/Calendar/GetResourceChooseWokingStaff", JSON.stringify({
                                                Date: $("#" + idInputDate).data('daterangepicker').startDate.local().toDate(),
                                                LocationID: locationID,
                                            }), function (data) {
                                                callback(data.map(n => {
                                                    return {
                                                        id: n.UserID,
                                                        title: n.UserName,
                                                        locationID: locationID,
                                                        isEmployee: prefixStaff == "employee",
                                                        isResource: prefixStaff == "room",
                                                    }
                                                }));
                                            })
                                        } else {
                                            var resouces = [];
                                            if (!$.isNumeric(value)) {
                                                $(comboboxStaff).find("option").each(function (index, item) {
                                                    var valueItemOpition = $(item).val();
                                                    var prefixOpition = valueItemOpition.split(":")[0];
                                                    var valueOpition = valueItemOpition.split(":")[1];
                                                    if (prefixOpition == prefixStaff && value != valueOpition && $.isNumeric(valueOpition)) {
                                                        resouces.push({
                                                            id: valueItemOpition.split(":")[1],
                                                            title: $(item).text(),
                                                            locationID: locationID,
                                                            isEmployee: prefixStaff == "employee",
                                                            isResource: prefixStaff == "room",
                                                        })
                                                    }
                                                })
                                            } else {
                                                resouces.push({
                                                    id: value,
                                                    title: $(comboboxStaff).find("[value='" + valueStaff + "']").text(),
                                                    locationID: locationID,
                                                    isEmployee: prefixStaff == "employee",
                                                    isResource: prefixStaff == "room",
                                                })
                                            }
                                            callback(resouces);
                                        }
                                    }
                                },
                                resourceRender: function (resourceObj, labelTds, bodyTds) {
                                    labelTds.on('click', function () {
                                        $(comboboxStaff).val((resourceObj.isEmployee ? "employee" : "room") + ":" + resourceObj.id).trigger("change");
                                        if ($(that).fullCalendar("getView").name == "scheulDay")
                                            $(buttonWeek).trigger("click");
                                    });
                                },
                                events: function (start, end, timezone, callback) {
                                    var resources = this.getResources();
                                    var EmployeeIDs = [];
                                    var ResourceIDs = [];
                                    if (resources.length > 0) {
                                        var isEmployee = resources[0].isEmployee;
                                        EmployeeIDs = isEmployee ? Array.from(resources, n => n.id) : EmployeeIDs;
                                        ResourceIDs = !isEmployee ? Array.from(resources, n => n.id) : ResourceIDs;
                                        StartLoading();
                                        setTimeout(function () {
                                            $.RequestAjax("/Calendar/GetDataScheul", JSON.stringify({
                                                DateFrom: start.local().toDate(),
                                                DateTo: end.local().toDate(),
                                                LocationID: $(comboboxLocation).val(),
                                                EmployeeIDs: EmployeeIDs,
                                                ResourceIDs: ResourceIDs,
                                            }), function (data) {
                                                EndLoading();
                                                callback(data.map(n => {
                                                    if (n.TypeItem == "appointment") {
                                                        var AppointmentColor = n.ServiceColor;
                                                        if (Window.BusinessAppointmentColorSource == "employee")
                                                            AppointmentColor = n.StaffColor;
                                                        if (Window.BusinessAppointmentColorSource == "status")
                                                            AppointmentColor = Window.StatusScheul.find(function (m) { return m.Status == n.Status }).Color;
                                                        return {
                                                            id: n.AppointmentServiceID + "_" + n.TypeItem,
                                                            date: n.ScheduledDate,
                                                            appointmentID: n.AppointmentID,
                                                            resourceId: isEmployee ? n.UserID : n.ResourceID,
                                                            userID: n.UserID,
                                                            resourceID: n.ResourceID,
                                                            title: n.ClientName + " " + n.ServiceName,
                                                            start: moment(n.ScheduledDate, "YYYY-M-D").startOf('day').add(n.StartTimeInSecond, "seconds"),
                                                            end: moment(n.ScheduledDate, "YYYY-M-D").startOf('day').add(n.StartTimeInSecond, "seconds").add(n.Duration, "seconds"),
                                                            clientID: n.ClientID,
                                                            clientName: n.ClientName,
                                                            serviceID: n.ServiceID,
                                                            serviceName: n.ServiceName,
                                                            scheduledDate: n.ScheduledDate,
                                                            status: n.Status,
                                                            userName: n.UserName,
                                                            TypeItem: n.TypeItem,
                                                            isEmployee: isEmployee,
                                                            isRequest: n.IsRequest,
                                                            InvoiceStatus: n.InvoiceStatus,
                                                            MobileNumber: n.MobileNumber,
                                                            MobileNumberDialCode: n.MobileNumberDialCode,
                                                            serviceGroupName: n.ServiceGroupName,
                                                            appointmentColor: AppointmentColor,
                                                            backgroundColor: AppointmentColor,
                                                            price: n.Price,
                                                            bookingType: n.BookingType,
                                                            specialPrice: n.SpecialPrice,
                                                            retailPrice: n.RetailPrice,
                                                            notes: n.Notes,
                                                        }
                                                    } else {
                                                        return {
                                                            id: n.BlockTimeID + "_" + n.TypeItem,
                                                            title: "Blocked Time",
                                                            start: moment(n.DateWorking).startOf('day').add(n.StartTimeInSecond, "seconds"),
                                                            end: moment(n.DateWorking).startOf('day').add(n.EndTimeInSecond, "seconds"),
                                                            date: n.DateWorking,
                                                            description: n.Description,
                                                            TypeItem: n.TypeItem,
                                                            backgroundColor: "#BEBEBE",
                                                            dateWorking: n.DateWorking,
                                                            staffID: n.StaffID,
                                                            resourceId: n.StaffID
                                                        }
                                                    }
                                                }));
                                            })
                                        }, 100)
                                    } else
                                        callback([]);
                                },
                                eventClick: function (event, jsEvent, view) {
                                    if (event.TypeItem == "appointment")
                                        ModalAppointment.OpenView(event.appointmentID);
                                    else {
                                        var BlockTimeID = event.id.split("_" + event.TypeItem)[0];
                                        $.ModalBlockTime({
                                            BlockTimeID: BlockTimeID,
                                            StaffID: event.staffID,
                                            DateWorking: moment(event.dateWorking).toDate(),
                                            StartTime: event.start.local().toDate(),
                                            EndTime: event.end.local().toDate(),
                                            Description: event.description,
                                        }, true, $(comboboxLocation), $(comboboxStaff), $(that));
                                    }
                                },
                                eventAfterAllRender: function (view) {
                                    $(NotifyNoScheduled).addClass("d-none");
                                    $(NotifyNoStaff).addClass("d-none");
                                    $(NotifyContaint).addClass("d-none");
                                    view.start.local();
                                    view.end.local();
                                    $(that).find("[name='cell-date']").closest(".fc-widget-header").remove();
                                    $(that).find(".fc-today").removeClass("fc-today");
                                    var tableHeader = $('<div class="fc-row fc-widget-header">' + view.el.find(".fc-bg table")[0].outerHTML + '</div>');
                                    tableHeader.find("tbody tr td:eq(0)").remove();
                                    tableHeader.find("td").attr("name", "cell-date");
                                    tableHeader.find("td").addClass("cell-date-scheul");
                                    var CreateCellTime = function (ArrayValidRange) {
                                        var checkValidDate = function (td) {
                                            var result = false;
                                            var timeString = $(td).attr("data-date") + " " + $(td).attr("data-time");
                                            var time = moment(timeString, "YYYY-MM-DD HH:mm:ss");
                                            var resourceId = parseInt($(td).attr("data-resource-id"));
                                            if (ArrayValidRange) {
                                                $.each(ArrayValidRange, function () {
                                                    if (resourceId == this.StaffId) {
                                                        if (this.Shift1Start.isSameOrBefore(time) && this.Shift1End.isAfter(time)) {
                                                            result = true;
                                                            return false;
                                                        }
                                                        if (this.Shift2End && this.Shift2Start && this.Shift2Start.isSameOrBefore(time) && this.Shift2End.isAfter(time)) {
                                                            result = true;
                                                            return false;
                                                        }
                                                    }
                                                })
                                            }
                                            return result;
                                        }
                                        view.el.find(".fc-slats table tbody tr").each(function () {
                                            var tableItem = $(tableHeader[0].outerHTML);
                                            var time = $(this).attr("data-time");
                                            tableItem.find("td").append('<span>' + moment(time, "HH:mm:ss").format(formatDate) + '</span>');
                                            tableItem.find("td").attr("data-time", time);
                                            $(this).find("td:eq(1)").append(tableItem);
                                            $(this).find("td:eq(1)").css("line-height", "26px");
                                            if (ArrayValidRange) {
                                                tableItem.find("td").each(function () {
                                                    if (!checkValidDate(this))
                                                        $(this).addClass("fc-disabled-day");
                                                })
                                            }
                                        });
                                    }
                                    var resources = this.calendar.getResources();
                                    var countBooking = parseInt(view.calendar.clientEvents().filter(n => view.start.isSameOrBefore(n.date) && view.end.isSameOrAfter(n.date)).length);
                                    if (resources.length > 0 && resources[0].isEmployee) {
                                        if (view.name == "scheulWeek")
                                            tableHeader.find("td").attr("data-resource-id", resources[0].id);
                                        var staffIds = resources.map(n => n.id);
                                        $.RequestAjax("/Calendar/GetUserWorkingHour", JSON.stringify({
                                            Start: view.start.local().toDate(),
                                            End: view.end.local().toDate(),
                                            StaffId: staffIds,
                                            LocationID: $(comboboxLocation).val()
                                        }), function (data) {
                                            if (data.length == 0 && !allowShowCandendar && comboboxStaffIsWorkingStaff && countBooking == 0) {
                                                $(NotifyNoScheduled).removeClass("d-none");
                                                $(NotifyContaint).removeClass("d-none");
                                            } else {
                                                var setdateshift = function (time1, time2) {
                                                    time2.years(time1.years());
                                                    time2.months(time1.months());
                                                    time2.dates(time1.dates());
                                                }
                                                $.each(data, function () {
                                                    this.DateWorking = moment(this.DateWorking);
                                                    this.Shift1Start = moment(this.DateWorking).startOf('day').add(this.StartTime1InSecond, "seconds");
                                                    this.Shift1End = moment(this.DateWorking).startOf('day').add(this.EndTime1InSecond, "seconds");
                                                    this.Shift2End = this.Shift2End ? moment(this.DateWorking).startOf('day').add(this.EndTime2InSecond, "seconds") : null;
                                                    this.Shift2Start = this.Shift2Start ? moment(this.DateWorking).startOf('day').add(this.StartTime2InSecond, "seconds") : null;
                                                    //ko can gan nua do da gan ngay roi
                                                    //setdateshift(this.DateWorking, this.Shift1Start);
                                                    //setdateshift(this.DateWorking, this.Shift1End);
                                                    //if (this.Shift2End)
                                                    //    setdateshift(this.DateWorking, this.Shift2End);
                                                    //if (this.Shift2Start)
                                                    //    setdateshift(this.DateWorking, this.Shift2Start);
                                                })
                                                CreateCellTime(data)
                                            }
                                        })
                                    }
                                    else if (comboboxStaffIsWorkingStaff && resources.length == 0) {
                                        $(NotifyNoScheduled).removeClass("d-none");
                                        $(NotifyContaint).removeClass("d-none");
                                    } else
                                        CreateCellTime();

                                    EndLoading();
                                    $('[data-toggle="tooltip"]').tooltip();
                                    if (Window.CallBackAfterRenderScheul)
                                        Window.CallBackAfterRenderScheul();
                                },
                                select: function (startDate, endDate, jsEvent, view, resource) {
                                    if (this.calendar.getResources().length > 0 && view.name == "scheulWeek")
                                        resource = resource ? resource : this.calendar.getResources()[0];
                                    if (window.isCreateBlockTimeScheul) {
                                        var dateWorking = startDate.local().toDate();
                                        $.ModalBlockTime({
                                            DateWorking: moment(dateWorking).local().startOf('d').toDate(),
                                            StartTime: startDate.local().toDate(),
                                            EndTime: endDate.local().toDate(),
                                        }, false, $(comboboxLocation), $(comboboxStaff), $(that), resource && resource.isEmployee ? resource.id : null);
                                        window.isCreateBlockTimeScheul = false;
                                        $("body header.app-header button.sidebar-toggler").trigger("click");
                                        PNotify.removeAll();
                                    } else
                                        ModalAppointment.OpenCreate(startDate.local().toDate(), startDate.local().toDate(), resource && resource.isEmployee ? resource.id : null);
                                },
                                eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
                                    if (event.TypeItem == "appointment") {
                                        if (event.status != "Completed") {
                                            var resouce = event.source.calendar.getResourceById(event.resourceId);
                                            if (delta._days > 0 && event.source.calendar.clientEvents(n => n.appointmentID == event.appointmentID).length > 1) {
                                                $.InStallPopupConfirm({
                                                    title: "Split Appointment",
                                                    text: "This appointment is part of a group, moving it to another day will split it to become a separate booking. Are you sure?",
                                                }, [{
                                                    text: "CANCEL",
                                                    click: function (notice) {
                                                        revertFunc();
                                                        notice.close();
                                                    }
                                                }, {
                                                    text: "Split Appointment",
                                                    addClass: 'brighttheme-primary',
                                                    click: function (notice) {
                                                        notice.close();
                                                        UpdateAppointment(event, resouce);
                                                    }
                                                }])
                                            } else
                                                UpdateAppointment(event, resouce);
                                        } else
                                            revertFunc();
                                    } else if (event.TypeItem == "blocktime")
                                        UpdateBlockTime(event);
                                },
                                eventMouseover: function (event, jsEvent, view) {
                                    event.start.local();
                                    event.end.local();
                                    var content = "";
                                    var colorBackGround = "#BEBEBE";
                                    var title = "Blocked Time";
                                    if (event.TypeItem == "appointment") {
                                        var duration = GetSecond(event.end) - GetSecond(event.start);
                                        duration = duration / 60;
                                        var hourDuration = parseInt(duration / 60);
                                        var minutuesDuration = duration % 60;
                                        var textDuration = " (" + (hourDuration == 0 ? "" : hourDuration + "h ") + (minutuesDuration = 0 ? "" : minutuesDuration + "m ") + ")";
                                        colorBackGround = event.appointmentColor;
                                        title = event.status;
                                        content = "<p class='title-body'>" + event.clientName + "</p>"
                                            + (event.MobileNumber && event.MobileNumberDialCode ? ("<p> +" + event.MobileNumberDialCode + " " + event.MobileNumber + "</p>") : "")
                                            + "<p>" + event.serviceName + "</p>"
                                            + "<p>" + event.start.format(formatDate) + " - " + event.end.format(formatDate) + " " + textDuration + "</p>"
                                            + "<p>" + (event.isRequest ? '<i class="fa fa-heart text-danger"></i> ' : "") + event.userName + "</p>"
                                            + "<p>" + $.FormatNumberMoney(event.price) + "</p>"
                                            + (event.notes ? "<p>" + event.notes + "</p>" : "");
                                    }
                                    else {
                                        content = "<p>" + event.start.format(formatDate) + " - " + event.end.format(formatDate) + "</p>";
                                    }
                                    $(this).popover({
                                        title: title,
                                        content: content,
                                        trigger: 'hover',
                                        placement: 'auto',
                                        container: 'body',
                                        html: true,
                                        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header-scheul popover-header" style="background-color: ' + colorBackGround +
                                            '" ></h3><div class="popover-body-scheul popover-body"></div></div>'
                                    });
                                    $(this).popover('show');
                                },
                                eventMouseout: function (event, jsEvent, view) {
                                    $(this).popover('dispose')
                                },
                                eventResize: function (event, delta, revertFunc) {
                                    if (event.TypeItem == "appointment")
                                        UpdateAppointment(event, event.source.calendar.getResourceById(event.resourceId));
                                    else if (event.TypeItem == "blocktime")
                                        UpdateBlockTime(event);
                                },
                            });
                            var startDatePickerLast = moment($("#" + idInputDate).data('daterangepicker').startDate.local().toDate());
                            var endDatePickerLast = moment($("#" + idInputDate).data('daterangepicker').endDate.local().toDate());
                            //event
                            $(document).on('change', "#" + idInputDate, function () {
                                var start = $(this).data('daterangepicker').startDate.local();
                                var end = $(this).data('daterangepicker').endDate.local()
                                if (!startDatePickerLast.isSame(start) || !endDatePickerLast.isSame(end)) {
                                    $(that).fullCalendar("gotoDate", start.toDate());
                                    LoadAgainCalendar();
                                    startDatePickerLast = moment(start.toDate());
                                    endDatePickerLast = moment(end.toDate())
                                }
                            })
                            $(comboboxLocation).change(LoadAgainCalendar);
                            $(comboboxStaff).change(function () {
                                var prefix = $(this).val().split(":")[0];
                                var value = $(this).val().split(":")[1];
                                var nameView = $(that).fullCalendar('getView').name;
                                comboboxStaffIsWorkingStaff = prefix == "employee" && value == "working";
                                if (!$.isNumeric(value) && nameView == "scheulWeek")
                                    $(buttonDay).trigger("click");
                                LoadAgainCalendar();
                            })
                            $(buttonWeek).click(function () {
                                var value = $(comboboxStaff).val();
                                var valueStaff = value.split(":")[1];
                                if (!$.isNumeric(valueStaff))
                                    ChangeWorkingStaffToStaffFirst();
                                $(that).fullCalendar('changeView', 'scheulWeek');
                            })
                            $(buttonDay).click(function () {
                                $(that).fullCalendar('changeView', 'scheulDay');
                            })
                            $(buttonAlowShowCanlendar).click(function () {
                                //allowShowCandendar = true;
                                //localStorage.setItem("allowShowCandendar", allowShowCandendar);
                                $(NotifyNoStaff).addClass("d-none");
                                $(NotifyNoScheduled).addClass("d-none");
                                $(NotifyContaint).addClass("d-none");
                            })
                        })
                    } else {
                        $(NotifyContaint).removeClass("d-none");
                        $(NotifyNoStaff).removeClass("d-none");
                    }
                })
            } else
                console.log("Thẻ không hơp lệ hoặc chưa khai báo thư viện");
        },
        RefetchCanlendarSchedul: function (noCheck, isRefetchResources) {
            if ($(this).is("div") && typeof ($.fn.fullCalendar) != 'undefined') {
                if (noCheck) {
                    if (isRefetchResources == null || isRefetchResources != false)
                        $(this).fullCalendar("refetchResources");
                    $(this).fullCalendar("refetchEvents");
                } else {
                    var that = this;
                    var location = $("#locationSearch").val();
                    var staffResource = $("#staffResourSearch").val();
                    var starTime = moment($("#inputDate").data('daterangepicker').startDate.local().toDate());
                    var endTime = moment($("#inputDate").data('daterangepicker').endDate.local().toDate());
                    var checkExist = false;

                    if (historyRequestCanlendar.length > 0) {
                        var length = historyRequestCanlendar.length;
                        var item = historyRequestCanlendar[length - 1];
                        if (item.Location == location && item.StaffResource == staffResource && item.StarTime.isSameOrBefore(starTime) && item.EndTime.isSameOrAfter(endTime))
                            checkExist = true;
                    }

                    if (!checkExist) {
                        historyRequestCanlendar.push({
                            Location: location,
                            StaffResource: staffResource,
                            StarTime: starTime,
                            EndTime: endTime
                        })
                        console.log(JSON.stringify({
                            Location: location,
                            StaffResource: staffResource,
                            StarTime: starTime,
                            EndTime: endTime
                        }))
                        StartLoading();
                        setTimeout(function () {
                            $.GetStarTimeScheul(function (result) {
                                $(that).fullCalendar('option', {
                                    minTime: result,
                                });
                                EndLoading();
                                $(that).fullCalendar("refetchResources");
                                $(that).fullCalendar("refetchEvents");
                            })
                        }, 100);
                    }
                }
            }
        }
    })
    //#endregion

    //#region Setup Control
    $("#ContaintDatePicker").Datetimepicker("inputDate", "buttonPrevious", "buttonNext", "buttonToday", $("#buttonWeekMod")[0], $("#buttonDayMod")[0]);
    $("#locationSearch").ComboboxLocation(function () {
        $("#staffResourSearch").ComboboxResourceStaff($("#locationSearch")[0], function () {
            $("#fullCalendar").CreateCanlendarSchedul("inputDate", $("#locationSearch")[0], $("#staffResourSearch")[0], $("#NotifyNoScheduled")[0], $("#NotifyNoStaff")[0], $("#notifyScheul")[0], $("#buttonWeekMod")[0], $("#buttonDayMod")[0], $("#alowShowCanlendar")[0])
        });
    });
    //#endregion
})