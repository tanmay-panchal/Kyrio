$(function () {
    $('#changePasswordForm').validate({
        rules: {
            NewPassword: {
                required: true,
                minlength: 6
            },
            RepeatPassword: {
                required: true,
                minlength: 6,
                equalTo: '#NewPassword'
            },
        },
        messages: {
            NewPassword: {
                required: 'Please provide a password',
                minlength: 'Your password must be at least 6 characters long'
            },
            RepeatPassword: {
                required: 'Please provide a password',
                minlength: 'Your password must be at least 6 characters long',
                equalTo: 'Please enter the same password as above'
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
    Ladda.bind('#changePasswordButton', {
        callback: function (instance) {
            instance.start();
            var progress = 0;
            if ($("#changePasswordForm").valid()) {
                $.RequestAjax("/Login/ExcuteChangePassword", JSON.stringify({
                    ResetID: $.url().param('reset_password_token') ? $.url().param('reset_password_token') : '',
                    NewPassword: $("#changePasswordForm #NewPassword").val(),
                    RepeatPassword: $("#changePasswordForm #RepeatPassword").val(),
                }), function (data) {
                    if (!JSON.parse(data.Result)) {
                        if (parseInt(data.ErrorStyle) == 1) {
                            toastr["error"]("Reset password token is invalid.", "Error");
                            $("#changePasswordForm #NewPassword").focus();
                        } else {
                            toastr["error"]("Password Change Failed. Please contact the developer to fix it.", "Error");
                            console.log("Thay đổi mật khẩu thất bại. Lỗi: " + data.ErrorMessage);
                        }
                    } else {
                        toastr["success"]("Change Password Successfully.", "Notification");
                        setTimeout('location.href = "/Login/Index";', 500);
                    }
                }, function () {
                    instance.stop();
                })
            } else
                instance.stop();
        }
    });
})