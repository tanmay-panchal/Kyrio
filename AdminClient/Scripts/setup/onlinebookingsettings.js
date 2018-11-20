$(function () {
    CreateBreadcrumb([{ href: "/Setup/Index", title: "Setup" }, { href: "/Setup/OnlineBookingSettings", title: "Online Booking Settings" }])
    //lay setting
    $.RequestAjax("/Setup/GetBusinessSetting", JSON.stringify({
        SettingGroup: "Online Booking Settings"
    }), function (data) {
        $.each(data.data, function () {
            if (this.SettingCode == 'business_online_booking') {
                var x = document.getElementById("groupsetting");
                if (this.Value == "0") {
                    $("#business_online_booking").iCheck('uncheck');
                    x.style.display = 'none';
                }
                else {
                    $("#business_online_booking").iCheck('check');
                    x.style.display = 'block';
                }
            }
            else if (this.SettingCode == 'business_advance_notice_time_in_seconds') {
                $("#business_advance_notice_time_in_seconds").val(this.Value).change();
            }
            else if (this.SettingCode == 'business_widget_max_advance_time_in_months') {
                $("#business_widget_max_advance_time_in_months").val(this.Value).change();
            }
            else if (this.SettingCode == 'business_cancellation_time') {
                $("#business_cancellation_time").val(this.Value).change();
            }
            else if (this.SettingCode == 'business_cancellation_policy') {
                $("#business_cancellation_policy").val(this.Value);
            }
            else if (this.SettingCode == 'business_widget_allows_employee_selection') {
                if (this.Value == "0") {
                    $("#business_widget_allows_employee_selection").iCheck('uncheck');
                }
                else {
                    $("#business_widget_allows_employee_selection").iCheck('check');
                }
            }
        })
    }, function () {
    })
    //an hien khung setting
    $('#business_online_booking').on('change', function () {
        var x = document.getElementById("groupsetting");
        if (this.checked) {
            x.style.display = 'block';
        } else {
            x.style.display = 'none';
        }
    });

    $.validator.addMethod("requiredselect", function (value, element, arg) {
        return value != null && value != "" && value != "0";
    });
    $('#busiessForm').validate({
        rules: {
            
        },
        messages: {
            
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