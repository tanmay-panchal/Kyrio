$(function () {
    CreateBreadcrumb([{ href: "/Home/Index", title: "Home" }, { href: "/User/MySetting", title: "MySetting" }])
    var country = "vn";
    $.each($.fn.intlTelInput.getCountryData(), function () {
        if ($("#DialCode").val() == this.dialCode)
            country = this.iso2;
    })
    $("#MobileNumber").intlTelInput({
        separateDialCode: true,
        initialCountry: country,
        preferredCountries: ["vn"],
        utilsScript: "/Extension/js/utils.js"
    });
    $.validator.addMethod("validatecurrentpassword", function (value, element, arg) {
        var valueNewPassword = $("#NewPassword").val();
        var valueOldPassword = value;
        var valueVerifyPassword = $("#VerifyPassword").val();
        if (valueOldPassword == "" && valueNewPassword == "" && valueVerifyPassword == "")
            return true;
        $.validator.messages["validatecurrentpassword"] = "Is Required";
        return valueOldPassword != "";
    });
    $.validator.addMethod("validatenewpassword", function (value, element, arg) {
        var valueNewPassword = value;
        var valueOldPassword = $("#OldPassword").val();
        var valueVerifyPassword = $("#VerifyPassword").val();
        if (valueOldPassword == "" && valueNewPassword == "" && valueVerifyPassword == "")
            return true;
        if (valueNewPassword != "" && valueNewPassword.length < 6) {
            $.validator.messages["validatenewpassword"] = "Is too short (minimum is 6 characters)";
            return false;
        }
        $.validator.messages["validatenewpassword"] = "Is Required";
        return (valueNewPassword != "" && valueVerifyPassword != "");
    });
    $.validator.addMethod("validateverifypassword", function (value, element, arg) {
        var valueNewPassword = $("#NewPassword").val();
        var valueOldPassword = $("#OldPassword").val();
        var valueVerifyPassword = value;
        if (valueOldPassword == "" && valueNewPassword == "" && valueVerifyPassword == "")
            return true;
        if ((valueNewPassword != "" || valueOldPassword != "") && valueVerifyPassword == "") {
            $.validator.messages["validateverifypassword"] = "Is Required";
            return false;
        }
        $.validator.messages["validateverifypassword"] = "Does Not Match Password";
        return valueNewPassword == valueVerifyPassword;
    });
    $('#settingForm').validate({
        rules: {
            FirstName: 'required',
            LastName: 'required',
            Email: {
                required: true,
                email: true,
                remote: {
                    url: "/User/ValidateEmailMySetting",
                    type: 'post',
                    data: {
                        Email: function () {
                            return $("#Email").val();
                        },
                    },
                    error: function (jqXHR, textStatus, errorThrow) {
                        toastr["error"](jqXHR.responseJSON.ContentError, jqXHR.responseJSON.TitleError);
                    }
                }
            },
            OldPassword: {
                validatecurrentpassword: "",
                remote: {
                    url: "/User/ValidatePasswordMySetting",
                    type: 'post',
                    data: {
                        Password: function () {
                            return $("#OldPassword").val();
                        },
                    },
                    error: function (jqXHR, textStatus, errorThrow) {
                        toastr["error"](jqXHR.responseJSON.ContentError, jqXHR.responseJSON.TitleError);
                    }
                }
            },
            NewPassword: { validatenewpassword: "" },
            VerifyPassword: { validateverifypassword: "" },
        },
        messages: {
            FirstName: 'Please enter your first name',
            LastName: 'Please enter your last name',
            Email: {
                required: 'Please enter a valid email address',
                email: 'Please enter a valid email address',
                remote: 'Has already been taken',
            },
            OldPassword: { remote: "Is invalid" }
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
            var progress = 0;
            if ($("#settingForm").valid()) {
                $.RequestAjax("/User/ChangeMySetting", JSON.stringify({
                    FirstName: $("#settingForm #FirstName").val(),
                    LastName: $("#settingForm #LastName").val(),
                    OldPassword: $("#settingForm #OldPassword").val(),
                    NewPassword: $("#settingForm #NewPassword").val(),
                    MobileNumber: $("#settingForm #MobileNumber").val(),
                    Email: $("#settingForm #Email").val(),
                    DialCode: $("#MobileNumber").intlTelInput("getSelectedCountryData").dialCode
                }), function (data) {
                    if (!JSON.parse(data.Result)) {
                        if (parseInt(data.ErrorStyle) == 1) {
                            toastr["error"](data.ErrorMessage, "Error");
                            $("#settingForm #Email").focus();
                        } else if (parseInt(data.ErrorStyle) == 2) {
                            toastr["error"](data.ErrorMessage, "Error");
                            $("#settingForm #OldPassword").focus();
                        } else {
                            toastr["error"]("Failed registration. Please contact the developer to fix it.", "Error");
                            console.log("Dữ liệu lưu thất bại. Lỗi: " + data.ErrorMessage);
                        }
                    } else {
                        toastr["success"]("Data saved successfully.", "Notification");
                    }
                }, function () {
                    instance.stop();
                })
            } else
                instance.stop();
        }
    });
})