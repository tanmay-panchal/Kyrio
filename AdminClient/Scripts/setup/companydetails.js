var autocomplete;
function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('Address'), {
        componentRestrictions: { country: $("#CountryCode").val() }
    });
}
$(function () {
    CreateBreadcrumb([{ href: "/Setup/Index", title: "Setup" }, { href: "/Setup/CompanyDetails", title: "Company Details" }])
    $("#busiessForm #BusinessTypeID").InStallSelect2('/Home/LoadSelect2ForBusinessType', 20, 'Business Type', null);
    $("#busiessForm #CountryID").InStallSelect2('/Home/LoadSelect2ForCountry', 20, 'Country', null);
    $("#busiessForm #TimeZoneID").InStallSelect2('/Home/LoadSelect2ForTimeZone', 20, 'Time Zone', null);
    $("#busiessForm #CurrencyCode").InStallSelect2('/Home/LoadSelect2ForCurrency', 20, 'Currency', null);
    $("#busiessForm #TimeFormat").InStallSelect2('/Home/LoadSelect2ForTimeFormat', 20, 'Time Format', null);
    $("#openModalOpeningHourButton").ModalOpeningHour('Work Hour', '<button type="button" class="btn btn-block btn-success" data-dismiss="modal">Save</button>', true);
    var country = "vn";
    $.each($.fn.intlTelInput.getCountryData(), function () {
        if ($("#ContactNumberDialCode").val() == this.dialCode) {
            country = this.iso2;
            return;
        }
    })
    $("#ContactNumber").intlTelInput({
        separateDialCode: true,
        initialCountry: country,
        preferredCountries: [Window.CountryCode],
        utilsScript: "/Extension/js/utils.js"
    });
    $.validator.addMethod("requiredselect", function (value, element, arg) {
        return value != null && value != "" && value != "0";
    });
    $('#busiessForm').validate({
        rules: {
            CompanyName: {
                required: true,
                maxlength: 200
            },
            Website: { maxlength: 100 },
            ContactNumber: { maxlength: 20 },
            BusinessTypeID: { requiredselect: "" },
            TimeZoneID: { requiredselect: "" },
        },
        messages: {
            CompanyName: {
                required: 'Please enter your company name',
                maxlength: 'Company name lengths are not greater than 200'
            },
            Website: { maxlength: 'Website lengths are not greater than 100' },
            ContactNumber: { maxlength: 'Contact number lengths are not greater than 20' },
            BusinessTypeID: { requiredselect: "Please choose business type" },
            TimeZoneID: { requiredselect: "Please choose time zone" },
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
                var entity = new Object();
                $("#busiessForm").find("[ispropertiesmodel]").each(function () {
                    if ($(this).is("input[type='text'],input[type='number'],input[type='email'],textarea,select,input[type='hidden'],input[type='password']"))
                        entity[$(this).attr("id")] = $(this).val();
                    if ($(this).is("input[type='checkbox'],input[type='radio']"))
                        entity[$(this).attr("id")] = this.checked;
                    if ($(this).is("[isnumber]"))
                        entity[$(this).attr("id")] = entity[$(this).attr("id")].replace(/,/gi, '');
                    if ($(this).is("[isdate]") && $(this).val() != "") {
                        entity[$(this).attr("id")] = moment(entity[$(this).attr("id")], $(this).attr("formatdate")).format("YYYY/MM/DD");
                    }
                })
                $.extend(entity, { ContactNumberDialCode: $("#ContactNumber").intlTelInput("getSelectedCountryData").dialCode });
                $.RequestAjax("/Setup/SaveCompanyDetails", JSON.stringify({
                    business: entity,
                }), function (data) {
                    toastr["success"]("Data saved successfully.", "Notification");
                }, function () {
                    instance.stop();
                })
            } else
                instance.stop();
        }
    });
    $("#ContactNumber").keyup(function () {
        $("#ContactNumber").val(this.value.match(/[0-9]*/));
    });
})