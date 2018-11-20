$(function () {
    $('#forgotPasswordForm').validate({
        rules: {
            Email: {
                required: true,
                email: true
            },
        },
        messages: {
            Email: 'Please enter a valid email address',
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
    Ladda.bind('#forgotPasswordButton', {
        callback: function (instance) {
            instance.start();
            var progress = 0;
            if ($("#forgotPasswordForm").valid()) {
                $.RequestAjax("/Login/ExcuteForgotPassword", JSON.stringify({
                    Email: $("#forgotPasswordForm #Email").val(),
                }), function (data) {
                    if (!JSON.parse(data.Result)) {
                        if (parseInt(data.ErrorStyle) == 1) {
                            toastr["error"]("Oops! That email address is not registered with Shedul, please try again.", "Error");
                            $("#forgotPasswordForm #Email").focus();
                        } else {
                            toastr["error"]("Failed Forgot Password. Please contact the developer to fix it.", "Error");
                            console.log("Quên mật khẩu thất bại. Lỗi: " + data.ErrorMessage);
                        }
                    } else {
                        toastr["success"]("Done! The password reset email has been sent, please check your inbox.", "Notification");
                    }
                }, function () {
                    instance.stop();
                })
            } else
                instance.stop();
        }
    });
})