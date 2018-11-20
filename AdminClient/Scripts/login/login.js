var ExcuteLogin = function (Email, Password, instance) {
    $.RequestAjax("/Login/ExcuteLogin", JSON.stringify({
        Password: Password,
        Email: Email,
    }), function (data) {
        if (!JSON.parse(data.Result)) {
            toastr["error"](data.ErrorMessageStyle, "Error");
            $("#Email").focus();
        } else {
            localStorage.setItem("EmailLogin", Email);
            localStorage.setItem("PassLogin", Password);
            location.href = (JSON.parse(data.IsAdmin) ? "/HomeAdmin/Index" : "/Calendar/Index");
        }
    }, function () {
        if (instance)
            instance.stop();
    })
}
$(function () {
    var Email = localStorage.getItem("EmailLogin");
    var Pass = localStorage.getItem("PassLogin");
    var IsFirstLogin = localStorage.getItem("IsFirstLogin");
    localStorage.clear();
    localStorage.setItem("IsFirstLogin", IsFirstLogin);
    if (Email != null && Pass != null)
        ExcuteLogin(Email, Pass);

    $('#loginForm').validate({
        rules: {
            Email: {
                required: true,
                email: true
            },
            Password: {
                required: true,
                minlength: 6
            },
        },
        messages: {
            Email: 'Please enter a valid email address',
            Password: {
                required: 'Please provide a password',
                minlength: 'Your password must be at least 6 characters long'
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
    Ladda.bind('#loginButton', {
        callback: function (instance) {
            instance.start();
            var progress = 0;
            if ($("#loginForm").valid()) {
                ExcuteLogin($("#loginForm #Email").val(), $("#loginForm #Password").val(), instance);
            } else
                instance.stop();
        }
    });
})