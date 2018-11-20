var NotYear = true;
$(function () {
    $('#actionModal').modal({
        backdrop: false,
        show: false,
    })
    $("#DateOfBirth").prop("formatdate", Window.FormatDateJS)
    $("#DateOfBirth").daterangepicker({
        "singleDatePicker": true,
        "timePicker": false,
        "changeYear": false,
        "locale": {
            "format": "DD/MM"
        }
    });
    $("#MobileNumber").intlTelInput({
        separateDialCode: true,
        initialCountry: Window.CountryCode,
        preferredCountries: [Window.CountryCode],
        utilsScript: "/Extension/js/utils.js"
    });
    $("#Telephone").intlTelInput({
        separateDialCode: true,
        initialCountry: Window.CountryCode,
        preferredCountries: [Window.CountryCode],
        utilsScript: "/Extension/js/utils.js"
    });
    $("#actionForm #ReferralSource").InStallSelect2('/Home/LoadSelect2ForReferralSource', 20, 'Referral Source', null);
    $('#actionModal').on('hidden.bs.modal', function (e) {
        $("#actionButton").off("click");
    })
    $('#actionForm').validate({
        rules: {
            FirstName: 'required',
        },
        messages: {
            FirstName: 'Please enter first name',
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
    $("#setyear").click(function () {
        if (NotYear) {
            $("#DateOfBirth").daterangepicker({
                "singleDatePicker": true,
                "timePicker": false,
                "locale": {
                    "format": Window.FormatDateJS,
                }
            });
            $(this).html("Remove year");
            NotYear = false;
        }
        else {
            $("#DateOfBirth").daterangepicker({
                "singleDatePicker": true,
                "timePicker": false,
                "changeYear": false,
                "locale": {
                    "format": "DD/MM",
                }
            });
            $(this).html("Set year");
            NotYear = true;
        }

    })
})
var SaveClient = function (callback) {
    $('#actionButton').click(function () {
        if ($("#actionForm").valid()) {
            var entity = new Object();
            $("#actionForm").find("[ispropertiesmodel]").each(function () {
                if ($(this).is("input[type='text'],input[type='number'],input[type='email'],textarea,select,input[type='hidden'],input[type='password']"))
                    entity[$(this).attr("id")] = $(this).val();
                if ($(this).is("input[type='checkbox'],input[type='radio']"))
                    entity[$(this).attr("id")] = this.checked;
                if ($(this).is("[isnumber]"))
                    entity[$(this).attr("id")] = entity[$(this).attr("id")].replace(/,/gi, '');
                if ($(this).is("[isdate]") && $(this).val() != "") {
                    if ($(this).attr("id") == "DateOfBirth") {
                        if (NotYear) {
                            entity[$(this).attr("id")] = "1900/" + moment(entity[$(this).attr("id")], Window.FormatDateJS).format("MM/DD");
                        }
                        else {
                            entity[$(this).attr("id")] = moment(entity[$(this).attr("id")], Window.FormatDateJS).format("YYYY/MM/DD");
                        }
                    }
                    else
                        entity[$(this).attr("id")] = moment(entity[$(this).attr("id")], Window.FormatDateJS).format("YYYY/MM/DD");
                }
            })
            $.extend(entity, { MobileNumberDialCode: $("#MobileNumber").intlTelInput("getSelectedCountryData").dialCode });
            $.extend(entity, { TelephoneDialCode: $("#Telephone").intlTelInput("getSelectedCountryData").dialCode });
            $.RequestAjax("/Clients/AddOrUpdate", JSON.stringify({
                entity: entity,
                isUpdate: $("#actionForm #ClientID").val() != 0,
            }), function (data) {
                toastr["success"]("Data saved successfully.", "Notification");
                $('#actionModal').modal("hide");
                if (callback)
                    callback(data);
            })
        }
    })
}
var ReferClient = function (firstName, lastName) {
    $("#TitleModal").text("New Client");
    $("#ClientID").val(0);
    $("#FirstName").val(firstName ? firstName : "");
    $("#LastName").val(lastName ? lastName : "");
    $("#MobileNumber").val("");
    $("#Telephone").val("");
    $("#Email").val("");
    $("#AppointmentNotificationType").val("marketing_both").change();
    $("#AcceptMarketingNotifications").iCheck('check');
    $("#MobileNumber").intlTelInput("setCountry", Window.CountryCode);
    $("#Telephone").intlTelInput("setCountry", Window.CountryCode);

    $("#Gender").val("gender_unknown").change();
    $("#ReferralSource").SetValueSelect2("", "Referral Source");
    $("#DateOfBirth").data('daterangepicker').setStartDate(moment()._d);
    $("#DisplayOnAllBookings").iCheck('uncheck');
    $("#ClientNotes").val("");

    $("#Address").val("");
    $("#Suburb").val("");
    $("#City").val("");
    $("#State").val("");
    $("#PostCode").val("");
    $("#deleteButton").hide();
    $('#actionModal').modal("show");
}
var LoadClient = function (ClientID, CallBack) {
    $.RequestAjax("/Clients/GetClientByID", JSON.stringify({
        ID: ClientID,
    }), function (data) {
        var countryMobileNumber = Window.CountryCode;
        var countryTelephone = Window.CountryCode;
        var client = data.data;
        var countFindDialCode = 0;
        $.each($.fn.intlTelInput.getCountryData(), function () {
            if (client.MobileNumberDialCode == this.dialCode) {
                countryMobileNumber = this.iso2;
                ++countFindDialCode;
            }
            if (client.TelephoneDialCode == this.dialCode) {
                countryTelephone = this.iso2;
                ++countFindDialCode;
            }
            if (countFindDialCode == 2)
                return;
        })
        $("#MobileNumber").intlTelInput("setCountry", countryMobileNumber);
        $("#Telephone").intlTelInput("setCountry", countryTelephone);

        $("#TitleModal").text("Edit Client");
        $("#actionModal #ClientID").val(client.ClientID);
        $("#actionModal #FirstName").val(client.FirstName);
        $("#actionModal #LastName").val(client.LastName);
        $("#actionModal #MobileNumber").val(client.MobileNumber);
        $("#actionModal #Telephone").val(client.Telephone);
        $("#actionModal #Email").val(client.Email);
        $("#actionModal #AppointmentNotificationType").val(client.AppointmentNotificationType).change();
        $("#actionModal #AcceptMarketingNotifications").iCheck(client.AcceptMarketingNotifications == true ? 'check' : 'uncheck');
        $("#actionModal #Gender").val(client.Gender).change();
        $("#actionModal #ReferralSource").SetValueSelect2ID(client.ReferralSource);
        debugger;
        if (client.DateOfBirth != null) {
            if (moment(client.DateOfBirth).year() == 1900) {
                NotYear = true;
                $("#DateOfBirth").daterangepicker({
                    "singleDatePicker": true,
                    "timePicker": false,
                    "changeYear": false,
                    "locale": {
                        "format": "DD/MM",
                    }
                });
                $("#setyear").html("Set year");
            }
            else {
                NotYear = false;
                $("#DateOfBirth").daterangepicker({
                    "singleDatePicker": true,
                    "timePicker": false,
                    "locale": {
                        "format": Window.FormatDateJS,
                    }
                });
                $("#setyear").html("Remove year");
            }
        }
        $("#actionModal #DateOfBirth").data('daterangepicker').setStartDate(client.DateOfBirth ? moment(client.DateOfBirth)._d : moment()._d);
        $("#actionModal #DisplayOnAllBookings").iCheck(client.DisplayOnAllBookings == true ? 'check' : 'uncheck');
        $("#actionModal #ClientNotes").val(client.ClientNotes);
        $("#actionModal #Address").val(client.Address);
        $("#actionModal #Suburb").val(client.Suburb);
        $("#actionModal #City").val(client.City);
        $("#actionModal #State").val(client.State);
        $("#actionModal #PostCode").val(client.PostCode);
        $("#deleteButton").show();
        $('#actionModal').modal("show");
        if (CallBack)
            CallBack();
    })
}