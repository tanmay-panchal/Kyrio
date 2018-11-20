//#region Method Support
var saveStaff = function (IsUpdateThisShift, callbacksuccess) {
    $.RequestAjax("/Staff/SaveWorkingHours", JSON.stringify({
        LocationID: $.fn.LocationIDClickCell,
        UserID: $.fn.UserIDClickCell,
        DateWorking: $.fn.DateWorkingClickCell,
        Shift1Start: "2000/01/01 " + $("#excuteFormClickCell #Shift1Start").data('daterangepicker').startDate.format("HH:mm"),
        Shift1End: "2000/01/01 " + $("#excuteFormClickCell #Shift1End").data('daterangepicker').startDate.format("HH:mm"),
        Shift2Start: $("#excuteFormClickCell #Shift2Start").length > 0 ? "2000/01/01 " + $("#excuteFormClickCell #Shift2Start").data('daterangepicker').startDate.format("HH:mm") : null,
        Shift2End: $("#excuteFormClickCell #Shift2End").length > 0 ? "2000/01/01 " + $("#excuteFormClickCell #Shift2End").data('daterangepicker').startDate.format("HH:mm") : null,
        IsRepeat: $("#excuteFormClickCell #IsRepeat")[0].checked,
        RepeatType: $("#excuteFormClickCell #IsRepeat")[0].checked ? $("#excuteFormClickCell #RepeatType").val() : "",
        EndRepeat: $("#excuteFormClickCell #IsRepeat")[0].checked && $("#excuteFormClickCell #RepeatType").val() != "ongoing" ?
            $("#excuteFormClickCell #EndRepeat").data('daterangepicker').startDate.format("YYYY/MM/DD") : null,
        IsUpdateThisShift: IsUpdateThisShift
    }), function (data) {
        if (callbacksuccess)
            callbacksuccess();
        toastr["success"]("Data saved successfully.", "Notification");
        $('#excuteDialogClickCell').modal("hide");
        $("#workinghourform #LocationId").trigger("change");
    }, callbacksuccess)
}
var getNotifiStaff = function (methodSuccess) {
    $.RequestAjax("/Staff/CheckWorkingHours", JSON.stringify({
        LocationID: $.fn.LocationIDClickCell,
        UserID: $.fn.UserIDClickCell,
        DateWorking: $.fn.DateWorkingClickCell,
        DayOfWeek: parseInt($.fn.DateWorkingClickCell.format("d")) + 1
    }), function (data) {
        methodSuccess(data.Result);
    })
}
var deleteStaff = function (IsUpdateThisShift, callbacksuccess) {
    $.RequestAjax("/Staff/DeleteWorkingHours", JSON.stringify({
        LocationID: $.fn.LocationIDClickCell,
        UserID: $.fn.UserIDClickCell,
        DateWorking: $.fn.DateWorkingClickCell,
        IsUpdateThisShift: IsUpdateThisShift
    }), function (data) {
        if (callbacksuccess)
            callbacksuccess();
        toastr["success"]("Delete data successfully.", "Notification");
        $('#excuteDialogClickCell').modal("hide");
        $("#workinghourform #LocationId").trigger("change");
    }, callbacksuccess)
}
var CreateShift = function () {
    $('<div class="row" id="containtShift2"><div class="col-fhd-6 col-6 col-xlg-6 col-md-6 col-sm-6 col-xs-6"><div class="form-group">'
           + '<div class="input-group"><span class="input-group-prepend"><span class="input-group-text"><i class="fa fa-calendar"></i></span></span>'
           + '<input type="text" class="form-control" id="Shift2Start" name="Shift2Start"></div></div></div>'
           + '<div class="col-fhd-6 col-xlg-6 col-md-6 col-sm-6 col-xs-6 col-6"><div class="form-group">'
           + '<div class="input-group"><span class="input-group-prepend"><span class="input-group-text"><i class="fa fa-calendar"></i></span></span>'
           + '<input type="text" class="form-control" id="Shift2End" name="Shift2End"><div class="input-group-append"><span class="input-group-text" id="removeShift"><i class="fa fa-times"></i></span></div></div></div></div></div>').hide().insertBefore($("#containtCreateButton")).show("slow")
    $('<div class="form-group text-center" id="containtBreakTimeInMinutes"><span class="text-center" id="BreakTimeInMinutes">1 hour break time</span></div>').hide().insertBefore($("#containtCreateButton")).show("slow");
}
//#endregion

$(function () {
    //#region create plugin control
    $.fn.extend({
        InstallPickerTime: function (dataformat, timePicker) {
            if ($(this).is("input")) {
                $(this).daterangepicker({
                    "singleDatePicker": true,
                    "timePicker": true,
                    "autoApply": true,
                    "timePicker24Hour": dataformat == 24,
                    "autoUpdateInput": false,
                    "timePickerIncrement": 5,
                });
                var start = new Date(moment().format("YYYY/MM/DD") + " " + timePicker);
                var formatString = (dataformat == 24 ? "HH" : "hh") + ":mm " + (dataformat == 24 ? "" : "a")
                $(this).data('daterangepicker').setStartDate(start);
                $(this).val(moment(start).format(formatString));
                $(this).on('apply.daterangepicker', function (ev, picker) {
                    $(this).val(picker.startDate.format(formatString)).trigger("change");;
                });
                $(this).on('show.daterangepicker', function (ev, picker) {
                    picker.container.addClass("timepicker");
                    picker.container.find(".calendar-table").hide();
                });
                $(this).on('hide.daterangepicker', function (ev, picker) {
                    $(".daterangepicker").removeClass("timepicker");
                    $(".daterangepicker .calendar-table").show();
                });
            } else {
                console.log("Đối tượng không hợp lệ");
            }
        }
    })
    //#endregion

    //#region Load data && setup control
    $('#excuteDialogClickCell').modal({
        backdrop: false,
        show: false,
    })
    $('#excuteDialogClickCell').on('hidden.bs.modal', function (e) {
        $("body").find(".modal-backdrop").remove();
    })
    $('#excuteDialogClickCell').on('shown.bs.modal', function (e) {
        $("body").append('<div class="modal-backdrop fade show"></div>');
    })
    //#endregion

    //#region event xử lý giao diện người dùng
    $('#excuteDialogClickCell').on('shown.bs.modal', function (e) {
        var format = $.fn.DateFormat;
        $("#excuteFormClickCell #containtShift2").remove();
        $("#excuteFormClickCell #containtBreakTimeInMinutes").remove();
        $("#excuteFormClickCell #RepeatType").val("ongoing").trigger("change");
        var valueMinEndRepeat = moment($.fn.DateWorkingClickCell).add(8, "day");
        var valueEndRepeat = valueMinEndRepeat;
        $("#createShift").hide();
        if ($.fn.WorkingHoursIsUpdate) {
            var dataWorking = $.fn.WorkingHoursDataItem;
            $("#excuteFormClickCell #Shift1Start").InstallPickerTime(format, moment(dataWorking.Shift1Start).format("HH:mm"));
            $("#excuteFormClickCell #Shift1End").InstallPickerTime(format, moment(dataWorking.Shift1End).format("HH:mm"));
            if (dataWorking.Shift2Start && dataWorking.Shift2End) {
                CreateShift();
                $("#excuteFormClickCell #Shift2Start").InstallPickerTime(format, moment(dataWorking.Shift2Start).format("HH:mm"));
                $("#excuteFormClickCell #Shift2Start").trigger("change");
                $("#excuteFormClickCell #Shift2End").InstallPickerTime(format, moment(dataWorking.Shift2End).format("HH:mm"));
            } else {
                $("#createShift").show();
            }
            $("#excuteFormClickCell #IsRepeat")[0].checked = dataWorking.IsRepeat;
            $("#excuteFormClickCell #IsRepeat").trigger("change");
            if (dataWorking.IsRepeat) {
                $("#excuteFormClickCell #RepeatType").val(dataWorking.RepeatType).trigger("change");
                if (dataWorking.RepeatType == "specificdate") {
                    valueEndRepeat = moment(dataWorking.EndRepeat)
                }
            }
            $("#deleteButtonClickCell").show();
        } else {
            $("#deleteButtonClickCell").hide();
            $("#excuteFormClickCell #Shift1Start").InstallPickerTime(format, "09:00");
            $("#excuteFormClickCell #Shift1End").InstallPickerTime(format, "17:00");
            $("#excuteFormClickCell #IsRepeat")[0].checked = false;
            $("#excuteFormClickCell #IsRepeat").trigger("change");
            $("#excuteFormClickCell #EndRepeat").closest("div").hide();
            $("#createShift").show();
        }
        $("#EndRepeat").daterangepicker({
            "singleDatePicker": true,
            "minDate": valueMinEndRepeat._d,
            "startDate": valueEndRepeat._d,
            "endDate": valueEndRepeat._d,
            "locale": {
                "format": "DD/MM/YYYY",
            }
        });
    })
    $("#createShift").click(function () {
        var format = $.fn.DateFormat;
        CreateShift();
        $(this).hide();
        var shiftEnd = moment($("#excuteFormClickCell #Shift1End").data('daterangepicker').startDate._d);
        $("#excuteFormClickCell #Shift2Start").InstallPickerTime(format, shiftEnd.add(1, 'hours').format("HH:mm"));
        $("#excuteFormClickCell #Shift2End").InstallPickerTime(format, shiftEnd.add(5, 'hours').format("HH:mm"));
    })
    $('#IsRepeat').change(function (event) {
        $("#RepeatType").val("ongoing").trigger("change");
        if (this.checked) {
            $("#showHideBaseRepart").show("slow");
        } else {
            $("#showHideBaseRepart").hide("slow");
        }
    });
    $('#RepeatType').change(function (event) {
        if ($(this).val() == "ongoing") {
            $("#containtEndRepeat").hide("slow");
            $(this).show("slow");
        } else {
            $("#containtEndRepeat").show("slow");
            $(this).hide("slow");
        }
    });
    $("#showRepeatType").click(function () {
        $('#RepeatType').val("ongoing");
        $('#RepeatType').trigger("change");
    })
    $(document).on("click", "#removeShift", function () {
        $("#containtBreakTimeInMinutes").remove();
        $("#containtShift2").remove();
        $("#createShift").show("fast");
    })
    $(document).on("change", "#Shift2Start, #Shift1End", function () {
        if ($("#Shift2Start").length > 0) {
            $("#BreakTimeInMinutes").text("");
            var Shift2Start = $("#Shift2Start").data('daterangepicker').startDate._d;
            var Shift1End = $("#Shift1End").data('daterangepicker').startDate._d;
            if (Shift2Start - Shift1End > 0) {
                ; debugger;
                var timeSubtract = Shift2Start.subtractTime(Shift1End);
                $("#BreakTimeInMinutes").text((timeSubtract.hours > 0 ? timeSubtract.hours + " hours " : " ") + (timeSubtract.minutes > 0 ? timeSubtract.minutes + " minutes " : " ") + "break time");
            }
        }
    })
    //#endregion

    //#region save
    $.validator.addMethod("validateshift1end", function (value, element, arg) {
        var Shift1End = $("#excuteFormClickCell #Shift1End").data('daterangepicker').startDate._d;
        var Shift1Start = $("#excuteFormClickCell #Shift1Start").data('daterangepicker').startDate._d;
        if (Shift1End - Shift1Start < 0) {
            $.validator.messages["validateverifypassword"] = "Start time must be before end time";
            return false;
        }
        if ($("#Shift2Start").length == 0)
            return true;
        var Shift2Start = $("#excuteFormClickCell #Shift2Start").data('daterangepicker').startDate._d;
        return Shift2Start - Shift1End >= 0;
    }, 'Shifts are overlapping');
    $.validator.addMethod("validateshift2start", function (value, element, arg) {
        var Shift2Start = $("#excuteFormClickCell #Shift2Start").data('daterangepicker').startDate._d;
        var Shift2End = $("#excuteFormClickCell #Shift2End").data('daterangepicker').startDate._d;
        if (Shift2End - Shift2Start < 0) {
            $.validator.messages["validateverifypassword"] = "Start time must be before end time";
            return false;
        }
        var Shift1End = $("#excuteFormClickCell #Shift1End").data('daterangepicker').startDate._d;
        return Shift2Start - Shift1End >= 0;
    }, 'Start time must be before end time');
    $('#excuteFormClickCell').validate({
        rules: {
            Shift1End: { required: true, validateshift1end: "" },
            Shift2Start: { required: true, validateshift2start: "" },
            Shift1Start: { required: true },
            Shift2End: { required: true },
        },
        messages: {
            Shift1End: {
                required: 'Please enter Shift1End',
            },
            Shift2Start: {
                required: 'Please enter Shift2Start',
            },
            Shift1Start: {
                required: 'Please enter Shift1Start',
            },
            Shift2End: {
                required: 'Please enter Shift2End',
            },
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
    Ladda.bind('#excuteButtonClickCell', {
        callback: function (instance) {
            instance.start();
            if ($("#excuteFormClickCell").valid()) {
                var ExcuteData = function () {
                    if (!$("#excuteFormClickCell #IsRepeat")[0].checked) {
                        saveStaff(0, function () {
                            instance.stop();
                        });
                    } else {
                        getNotifiStaff(function (data) {
                            var text = "";
                            if (JSON.parse(data)) {
                                if ($("#excuteFormClickCell #RepeatType").val() == "ongoing") {
                                    text = "You have edited a shift that repeats weekly. Updating upcoming shifts will overwrite " + $.fn.DataItemClickCell.FirstName + "'s ongoing " + $.fn.DateWorkingClickCell.format("dddd") + " schedule";
                                } else {
                                    text = "You have edited a shift that repeats weekly. Updating upcoming shifts will overwrite " + $.fn.DataItemClickCell.FirstName + "'s " + $.fn.DateWorkingClickCell.format("dddd") + " schedule up to " +
                                        $("#excuteFormClickCell #EndRepeat").data('daterangepicker').startDate.format("DD MMMM YYYY");
                                }
                            }
                            if (text != "") {
                                PNotify.notice({
                                    title: 'Repeating Shift',
                                    text: text,
                                    hide: false,
                                    width: "650px",
                                    stack: {
                                        'dir1': 'down',
                                        'modal': true,
                                        'firstpos1': 25
                                    },
                                    animate: {
                                        animate: true,
                                        in_class: 'bounceInDown',
                                        out_class: 'hinge'
                                    },
                                    modules: {
                                        Confirm: {
                                            confirm: true,
                                            buttons: [
                                                {
                                                    text: 'Close',
                                                    addClass: ' btn-pnotify',
                                                    click: function (notice) {
                                                        notice.close();
                                                        instance.stop();
                                                    }
                                                },
                                                  {
                                                      text: 'Update this shift only',
                                                      addClass: 'float-right btn-primary-pnotify',
                                                      click: function (notice) {
                                                          saveStaff(2, function () {
                                                              notice.close();
                                                              instance.stop();
                                                          })
                                                      }
                                                  },
                                                {
                                                    text: 'Update upcoming shifts',
                                                    addClass: 'float-right btn-success-pnotify',
                                                    click: function (notice) {
                                                        saveStaff(1, function () {
                                                            notice.close();
                                                            instance.stop();
                                                        })
                                                    }
                                                },
                                            ],
                                        },
                                        Buttons: {
                                            closer: false,
                                            sticker: false
                                        },
                                        History: {
                                            history: false
                                        }
                                    }
                                })
                            } else {
                                saveStaff(0, function () {
                                    instance.stop();
                                });
                            }
                        });
                    }
                }
                var CheckUpdate = function () {
                    var dataWorkingHour = $.fn.WorkingHoursDataItem;
                    var check = true; // check = true là không có thay đổi dữ liệu, ngược lại là thay đổi
                    check *= moment(dataWorkingHour.Shift1Start).format("HH:mm") == $("#excuteFormClickCell #Shift1Start").data('daterangepicker').startDate.format("HH:mm");

                    check *= moment(dataWorkingHour.Shift1End).format("HH:mm") == $("#excuteFormClickCell #Shift1End").data('daterangepicker').startDate.format("HH:mm");

                    check *= !((!dataWorkingHour.Shift2Start && $("#excuteFormClickCell #Shift2Start").length > 0) || //nếu dữ liệu ban đầu Shift2Start có mà không có dữ liệu Shift2End ở form, 
                        (dataWorkingHour.Shift2Start && $("#excuteFormClickCell #Shift2Start").length == 0) || //nếu Shift2End có dữ liệu mà Shift2Start ở form không có
                        (dataWorkingHour.Shift2Start && $("#excuteFormClickCell #Shift2Start").length > 0 && moment(dataWorkingHour.Shift2Start).format("HH:mm") != $("#excuteFormClickCell #Shift2Start").data('daterangepicker').startDate.format("HH:mm")));// nếu cả hai cùng có thì check dữ liệu có bằng nhau không

                    check *= !((!dataWorkingHour.Shift2End && $("#excuteFormClickCell #Shift2End").length > 0) || //nếu dữ liệu ban đầu Shift2End có mà không có dữ liệu Shift2End ở form, 
                        (dataWorkingHour.Shift2End && $("#excuteFormClickCell #Shift2End").length == 0) || //nếu Shift2End có dữ liệu mà Shift2End ở form không có
                        (dataWorkingHour.Shift2End && $("#excuteFormClickCell #Shift2End").length > 0 && moment(dataWorkingHour.Shift2End).format("HH:mm") != $("#excuteFormClickCell #Shift2End").data('daterangepicker').startDate.format("HH:mm")));// nếu cả hai cùng có thì check dữ liệu có bằng nhau không

                    check *= dataWorkingHour.IsRepeat == $("#excuteFormClickCell #IsRepeat")[0].checked;

                    check *= ($("#excuteFormClickCell #IsRepeat")[0].checked && dataWorkingHour.RepeatType == $("#excuteFormClickCell #RepeatType").val()) || !$("#excuteFormClickCell #IsRepeat")[0].checked; // nếu IsRepeat == true thì mới check dữ liệu của RepeatType;

                    check *= ($("#excuteFormClickCell #IsRepeat")[0].checked && $("#excuteFormClickCell #RepeatType").val() == "specificdate" // nếu IsRepeat == true && RepeatType == date && dataWorkingHour.EndRepeat đẻ 
                        && (dataWorkingHour.EndRepeat && moment(dataWorkingHour.EndRepeat)._d - $("#excuteFormClickCell #EndRepeat").data('daterangepicker').startDate._d == 0))
                    return check;
                }
                if (!$.fn.WorkingHoursIsUpdate || ($.fn.WorkingHoursIsUpdate && !CheckUpdate())) {
                    ExcuteData();
                } else {
                    instance.stop();
                    $('#excuteDialogClickCell').modal("hide");
                }
            } else
                instance.stop();
        }
    });
    Ladda.bind('#deleteButtonClickCell', {
        callback: function (instance) {
            instance.start();
            if ($.fn.WorkingHoursIsUpdate) {
                var dataWorkingHours = $.fn.WorkingHoursDataItem;
                if (!dataWorkingHours.IsRepeat) {
                    deleteStaff(0, function () {
                        instance.stop();
                    })
                } else {
                    getNotifiStaff(function (data) {
                        var text = "";
                        if (JSON.parse(data)) {
                            if ($("#excuteFormClickCell #RepeatType").val() == "ongoing") {
                                text = "You have deleting a shift that repeats weekly. Deleting upcoming shifts will overwrite " + $.fn.DataItemClickCell.FirstName + "'s ongoing " + $.fn.DateWorkingClickCell.format("dddd") + " schedule";
                            } else {
                                text = "You have deleting a shift that repeats weekly. Deleting upcoming shifts will overwrite " + $.fn.DataItemClickCell.FirstName + "'s " + $.fn.DateWorkingClickCell.format("dddd") + " schedule up to " +
                                    $("#excuteFormClickCell #EndRepeat").data('daterangepicker').startDate.format("DD MMMM YYYY");
                            }
                        }
                        if (text != "") {
                            PNotify.notice({
                                title: 'Repeating Shift',
                                text: text,
                                hide: false,
                                width: "650px",
                                stack: {
                                    'dir1': 'down',
                                    'modal': true,
                                    'firstpos1': 25
                                },
                                animate: {
                                    animate: true,
                                    in_class: 'bounceInDown',
                                    out_class: 'hinge'
                                },
                                modules: {
                                    Confirm: {
                                        confirm: true,
                                        buttons: [
                                            {
                                                text: 'Close',
                                                addClass: ' btn-pnotify',
                                                click: function (notice) {
                                                    notice.close();
                                                    instance.stop();
                                                }
                                            },
                                              {
                                                  text: 'Delete this shift only',
                                                  addClass: 'float-right btn-primary-pnotify',
                                                  click: function (notice) {
                                                      deleteStaff(2, function () {
                                                          notice.close();
                                                          instance.stop();
                                                      })
                                                  }
                                              },
                                            {
                                                text: 'Delete upcoming shifts',
                                                addClass: 'float-right btn-success-pnotify',
                                                click: function (notice) {
                                                    deleteStaff(1, function () {
                                                        notice.close();
                                                        instance.stop();
                                                    })
                                                }
                                            },
                                        ],
                                    },
                                    Buttons: {
                                        closer: false,
                                        sticker: false
                                    },
                                    History: {
                                        history: false
                                    }
                                }
                            })
                        } else {
                            deleteStaff(0, function () {
                                instance.stop();
                            });
                        }
                    });
                }
            } else {
                instance.stop();
            }
        }
    });
    //#endregion
})