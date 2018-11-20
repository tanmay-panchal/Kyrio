var SendEmailRegister = function (instance) {
    $.RequestAjax("/Login/SendEmailExcuteRegister", JSON.stringify({
        FirstName: $("#registerForm #FirstName").val(),
        LastName: $("#registerForm #LastName").val(),
        CompanyName: $("#registerForm #CompanyName").val(),
        Password: $("#registerForm #Password").val(),
        Email: $("#registerForm #Email").val(),
    }), function (data) {
        //toastr["success"]("Sign Up Success.", "Notification");
        localStorage.setItem("EmailLogin", $("#registerForm #Email").val());
        localStorage.setItem("PassLogin", $("#registerForm #Password").val());
        localStorage.setItem("IsFirstLogin", true);
        setTimeout('location.href = "/Home/Index"', 500);
    }, function () {
        if (instance)
            instance.stop();
    })
}
$(function () {
    $("#registerForm #BusinessTypeID").InStallSelect2('/Home/LoadSelect2ForBusinessType', 20, 'Business Type', null);
    $("#registerForm #CountryID").InStallSelect2('/Home/LoadSelect2ForCountry', 20, 'Country', null);
    $("#registerForm #TimeZoneID").InStallSelect2('/Home/LoadSelect2ForTimeZone', 20, 'Time Zone', null);
    $("#registerForm #CurrencyCode").InStallSelect2('/Home/LoadSelect2ForCurrency', 20, 'Currency', null);
    $.validator.addMethod("requiredselect", function (value, element, arg) {
        return value != null && value != "" && value != "0";
    });
    $("#registerForm #CountryID").change(function () {
        var id = $(this).val() ? $(this).val() : 0;
        if (id != "0") {
            $.RequestAjax("/Login/GetDataWhenChangeCoutryRegister", JSON.stringify({
                "coutryId": id,
            }), function (data) {
                $('#registerForm #TimeZoneID').select2('destroy');
                $('#registerForm #CurrencyCode').select2('destroy');
                var timeZone = {
                    id: data.timeZone.TimeZoneID,
                    text: data.timeZone.TimeZoneName
                };
                var newOptionTimeZone = new Option(timeZone.text, timeZone.id, true, true);
                var currency = {
                    id: data.currency.CurrencyCode,
                    text: data.currency.CurrencyName
                };
                var newOptionCurrency = new Option(currency.text, currency.id, true, true);
                $('#registerForm #TimeZoneID').append(newOptionTimeZone).trigger('change');
                $('#registerForm #CurrencyCode').append(newOptionCurrency).trigger('change');
                $("#registerForm #TimeZoneID").InStallSelect2('/Home/LoadSelect2ForTimeZone', 20, 'Time Zone', null);
                $("#registerForm #CurrencyCode").InStallSelect2('/Home/LoadSelect2ForCurrency', 20, 'Currency', null);
            })
        }
    })
    $('#registerForm').validate({
        rules: {
            FirstName: 'required',
            LastName: 'required',
            CompanyName: 'required',
            BusinessTypeID: { requiredselect: "" },
            CountryID: { requiredselect: "" },
            TimeZoneID: { requiredselect: "" },
            CurrencyCode: { requiredselect: "" },
            Password: {
                required: true,
                minlength: 6
            },
            Email: {
                required: true,
                email: true
            },
        },
        messages: {
            FirstName: 'Please enter your firstname',
            LastName: 'Please enter your lastname',
            CompanyName: 'Please enter your company name',
            BusinessTypeID: { requiredselect: "Please choose business type" },
            CountryID: { requiredselect: "Please choose country" },
            TimeZoneID: { requiredselect: "Please choose time zone" },
            CurrencyCode: { requiredselect: "Please choose currency" },
            Password: {
                required: 'Please provide a password',
                minlength: 'Your password must be at least 6 characters long'
            },
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
    Ladda.bind('#buttonExcuteRegister', {
        callback: function (instance) {
            instance.start();
            var progress = 0;
            if ($("#registerForm").valid()) {
                $.RequestAjax("/Login/ExcuteRegister", JSON.stringify({
                    FirstName: $("#registerForm #FirstName").val(),
                    LastName: $("#registerForm #LastName").val(),
                    CompanyName: $("#registerForm #CompanyName").val(),
                    BusinessTypeID: $("#registerForm #BusinessTypeID").val() ? $("#registerForm #BusinessTypeID").val() : 0,
                    CountryID: $("#registerForm #CountryID").val() ? $("#registerForm #CountryID").val() : 0,
                    TimeZoneID: $("#registerForm #TimeZoneID").val() ? $("#registerForm #TimeZoneID").val() : 0,
                    CurrencyCode: $("#registerForm #CurrencyCode").val() ? $("#registerForm #CurrencyCode").val() : "",
                    Password: $("#registerForm #Password").val(),
                    Email: $("#registerForm #Email").val(),
                }), function (data) {
                    if (!JSON.parse(data.Result)) {
                        if (parseInt(data.ErrorStyle) == 1) {
                            toastr["error"]("Email already exists.", "Error");
                            $("#registerForm #Email").focus();
                        }
                    } else {
                        toastr["success"]("Register successfully.", "Notification");
                        SendEmailRegister(instance);
                    }
                }, function () {
                    instance.stop();
                })
            } else
                instance.stop();
        }
    });
})