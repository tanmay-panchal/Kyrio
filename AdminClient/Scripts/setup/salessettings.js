$(function () {
    CreateBreadcrumb([{ href: "/Setup/Index", title: "Setup" }, { href: "/Setup/SalesSettings", title: "Sales Settings" }])
    //lay setting
    $.RequestAjax("/Setup/GetBusinessSetting", JSON.stringify({
        SettingGroup: "Sales Settings"
    }), function (data) {
        $.each(data.data, function () {
            debugger;
            if (this.SettingCode == 'business_voucher_expiration_period') {
                $("#business_voucher_expiration_period").val(this.Value).change();
            }
            else if (this.SettingCode == 'business_commission_before_discount') {
                if (this.Value == "0") {
                    $("#business_commission_before_discount").iCheck('uncheck');
                }
                else {
                    $("#business_commission_before_discount").iCheck('check');
                }
            }
            else if (this.SettingCode == 'business_commission_after_tax') {
                if (this.Value == "0") {
                    $("#business_commission_after_tax").iCheck('uncheck');
                }
                else {
                    $("#business_commission_after_tax").iCheck('check');
                }
            }
        })
    }, function () {
    })

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