$(function () {
    CreateBreadcrumb([{ href: "/Setup/Index", title: "Setup" }, { href: "/Setup/CalendarSettings", title: "Calendar Settings" }])
    //lay setting
    $.RequestAjax("/Setup/GetBusinessSetting", JSON.stringify({
        SettingGroup: "Calendar Settings"
    }), function (data) {
        $.each(data.data, function () {
            if (this.SettingCode == 'business_beginning_of_week') {
                $("#business_beginning_of_week").val(this.Value).change();
            }
            else if (this.SettingCode == 'business_appointment_color_source') {
                $("#business_appointment_color_source").val(this.Value).change();
            }
            else if (this.SettingCode == 'business_time_slot_minutes') {
                $("#business_time_slot_minutes").val(this.Value).change();
            }
            else if (this.SettingCode == 'business_default_calendar_view') {
                $("#business_default_calendar_view").val(this.Value).change();
            }
        })
    }, function () {
    })

    $.validator.addMethod("requiredselect", function (value, element, arg) {
        return value != null && value != "";
    });
    $('#busiessForm').validate({
        rules: {
            business_appointment_color_source: { requiredselect: "" },
            business_time_slot_minutes: { requiredselect: "" },
            business_default_calendar_view: { requiredselect: "" },
            business_beginning_of_week: { requiredselect: "" },
        },
        messages: {
            business_appointment_color_source: { requiredselect: "Please choose Appointment Colors" },
            business_time_slot_minutes: { requiredselect: "Please choose Time Slot Interval" },
            business_default_calendar_view: { requiredselect: "Please choose Default View" },
            business_beginning_of_week: { requiredselect: "Please choose week Start Day" },
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
    Ladda.bind('#excuteButton', {
        callback: function (instance) {
            instance.start();
            if ($("#busiessForm").valid()) {
                var BusinessSettings = [];
                $("#busiessForm").find("[ispropertiesmodel]").each(function () {
                    if ($(this).is("input[type='text'],input[type='number'],input[type='email'],textarea,select,input[type='hidden'],input[type='password']"))
                        BusinessSettings.push({
                            SettingCode: $(this).attr("id"),
                            SettingGroup: "",
                            BussinessID: 0,
                            Value: $(this).val(),
                            Description: "",
                        })
                    if ($(this).is("input[type='checkbox'],input[type='radio']"))
                        BusinessSettings.push({
                            SettingCode: $(this).attr("id"),
                            SettingGroup: "",
                            BussinessID: 0,
                            Value: this.checked == true ? "1" : "0",
                            Description: "",
                        })
                });
                
                $.ajax({
                    url: "/Setup/SaveBusinessSettings",
                    type: 'post',
                    datatype: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        businessSettings: BusinessSettings,
                    }),
                    async: true,
                    cache: false,
                    success: function (data) {
                        instance.stop();
                        if (!JSON.parse(data.Result)) {
                            toastr["error"](data.ErrorMessage, "Error");
                            console.log("Dữ liệu lưu thất bại. Lỗi: " + data.ErrorMessage);
                        } else {
                            toastr["success"](data.ErrorMessage, "Notification");
                        }
                    }
                })
            } else
                instance.stop();
        }
    });
})