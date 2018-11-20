var prefixFileMobileAddOrEditClient = "/ContentHtml/AddOrEditClient/Mobile";
var LinkFileMobileAddOrEditClient = {
    AddOrEditClient: {
        Index: prefixFileMobileAddOrEditClient + "/Index.html",
    },
};

class MobileAddOrEditClient {
    constructor(callBackComplete, callBackHideModal) {
        this.Modal = null;
        this.HTML = {
            Index: null,
        };
        this.Parameter = {
            CallBackComplete: callBackComplete,
            CallBackHideModal: callBackHideModal,
            ClientID: 0,
            FirstName: null,
            LastName: null,
            NotYear: true
        }
    }
    //#region Private
    SaveClientID() {
        if (this.Modal.find("#actionForm").valid()) {
            var that = this;
            var entity = new Object();
            that.Modal.find("#actionForm").find("[ispropertiesmodel]").each(function () {
                if ($(this).is("input[type='text'],input[type='number'],input[type='email'],textarea,select,input[type='hidden'],input[type='password']"))
                    entity[$(this).attr("id")] = $(this).val();
                if ($(this).is("input[type='checkbox'],input[type='radio']"))
                    entity[$(this).attr("id")] = this.checked;
                if ($(this).is("[isnumber]"))
                    entity[$(this).attr("id")] = entity[$(this).attr("id")].replace(/,/gi, '');
                if ($(this).is("[isdate]") && $(this).val() != "") {
                    if ($(this).attr("id") == "DateOfBirth") {
                        if (that.Parameter.NotYear) {
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
            $.extend(entity, { MobileNumberDialCode: that.Modal.find("#MobileNumber").intlTelInput("getSelectedCountryData").dialCode });
            $.extend(entity, { TelephoneDialCode: that.Modal.find("#Telephone").intlTelInput("getSelectedCountryData").dialCode });
            $.RequestAjax("/Clients/AddOrUpdate", JSON.stringify({
                entity: entity,
                isUpdate: that.Modal.find("#ClientID").val() != 0,
            }), function (data) {
                toastr["success"]("Data saved successfully.", "Notification");
                if (that.Parameter.CallBackComplete)
                    that.Parameter.CallBackComplete();
                that.HideModal();
            })
        }
    }
    CreateControlPlugin() {
        this.Modal.find("#DateOfBirth").prop("formatdate", Window.FormatDateJS)
        this.Modal.find("#DateOfBirth").daterangepicker({
            "singleDatePicker": true,
            "timePicker": false,
            "changeYear": false,
            "locale": {
                "format": "DD/MM"
            }
        });
        this.Modal.find("#MobileNumber").intlTelInput({
            separateDialCode: true,
            initialCountry: Window.CountryCode,
            preferredCountries: [Window.CountryCode],
            utilsScript: "/Extension/js/utils.js"
        });
        this.Modal.find("#Telephone").intlTelInput({
            separateDialCode: true,
            initialCountry: Window.CountryCode,
            preferredCountries: [Window.CountryCode],
            utilsScript: "/Extension/js/utils.js"
        });
        this.Modal.find("#ReferralSource").InStallSelect2('/Home/LoadSelect2ForReferralSource', 20, 'Referral Source', null);
    }
    CreateEvent() {
        var that = this;
        this.Modal.find('#actionForm').validate({
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
        this.Modal.find("#setyear").click(function () {
            if (that.Parameter.NotYear) {
                $("#DateOfBirth").daterangepicker({
                    "singleDatePicker": true,
                    "timePicker": false,
                    "locale": {
                        "format": Window.FormatDateJS,
                    }
                });
                $(this).html("Remove year");
                that.Parameter.NotYear = false;
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
                that.Parameter.NotYear = true;
            }

        })
        this.Modal.find("#actionButton").click(function () {
            that.SaveClientID();
        })
        this.Modal.on('hidden.bs.modal', function (e) {
            if (that.Parameter.CallBackHideModal)
                that.Parameter.CallBackHideModal();
        })
    }
    RemoveEvent() {
        this.Modal.find("#setyear").off("click");
        this.Modal.find("#actionButton").off("click");
    }
    LoadCreate() {
        this.Modal.find("#TitleModal").text("New Client");
        this.Modal.find("#ClientID").val(0);
        this.Modal.find("#FirstName").val(this.Parameter.FirstName ? this.Parameter.FirstName : "");
        this.Modal.find("#LastName").val(this.Parameter.LastName ? this.Parameter.LastName : "");
        this.Modal.find("#MobileNumber").val("");
        this.Modal.find("#Telephone").val("");
        this.Modal.find("#Email").val("");
        this.Modal.find("#AppointmentNotificationType").val("marketing_both").change();
        this.Modal.find("#AcceptMarketingNotifications").iCheck('check');
        this.Modal.find("#MobileNumber").intlTelInput("setCountry", Window.CountryCode);
        this.Modal.find("#Telephone").intlTelInput("setCountry", Window.CountryCode);

        this.Modal.find("#Gender").val("gender_unknown").change();
        this.Modal.find("#ReferralSource").SetValueSelect2("", "Referral Source");
        this.Modal.find("#DateOfBirth").data('daterangepicker').setStartDate(moment()._d);
        this.Modal.find("#DisplayOnAllBookings").iCheck('uncheck');
        this.Modal.find("#ClientNotes").val("");

        this.Modal.find("#Address").val("");
        this.Modal.find("#Suburb").val("");
        this.Modal.find("#City").val("");
        this.Modal.find("#State").val("");
        this.Modal.find("#PostCode").val("");
        this.Modal.find("#deleteButton").hide();
        this.Modal.modal("show");
    }
    LoadEdit() {
        if (this.Parameter.ClientID != null && this.Parameter.ClientID != undefined && $.isNumeric(this.Parameter.ClientID)) {
            var that = this;
            setTimeout(function () {
                $.RequestAjax("/Clients/GetClientByID", JSON.stringify({
                    ID: that.Parameter.ClientID,
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
                    that.Modal.find("#MobileNumber").intlTelInput("setCountry", countryMobileNumber);
                    that.Modal.find("#Telephone").intlTelInput("setCountry", countryTelephone);

                    that.Modal.find("#TitleModal").text("Edit Client");
                    that.Modal.find("#ClientID").val(client.ClientID);
                    that.Modal.find("#FirstName").val(client.FirstName);
                    that.Modal.find("#LastName").val(client.LastName);
                    that.Modal.find("#MobileNumber").val(client.MobileNumber);
                    that.Modal.find("#Telephone").val(client.Telephone);
                    that.Modal.find("#Email").val(client.Email);
                    that.Modal.find("#AppointmentNotificationType").val(client.AppointmentNotificationType).change();
                    that.Modal.find("#AcceptMarketingNotifications").iCheck(client.AcceptMarketingNotifications == true ? 'check' : 'uncheck');
                    that.Modal.find("#Gender").val(client.Gender).change();
                    that.Modal.find("#ReferralSource").SetValueSelect2ID(client.ReferralSource);

                    if (client.DateOfBirth != null) {
                        if (moment(client.DateOfBirth).year() == 1900) {
                            that.Parameter.NotYear = true;
                            that.Modal.find("#DateOfBirth").daterangepicker({
                                "singleDatePicker": true,
                                "timePicker": false,
                                "changeYear": false,
                                "locale": {
                                    "format": "DD/MM",
                                }
                            });
                            that.Modal.find("#setyear").html("Set year");
                        }
                        else {
                            that.Parameter.NotYear = false;
                            that.Modal.find("#DateOfBirth").daterangepicker({
                                "singleDatePicker": true,
                                "timePicker": false,
                                "locale": {
                                    "format": Window.FormatDateJS,
                                }
                            });
                            that.Modal.find("#setyear").html("Remove year");
                        }
                    }
                    that.Modal.find("#DateOfBirth").data('daterangepicker').setStartDate(client.DateOfBirth ? moment(client.DateOfBirth)._d : moment()._d);
                    that.Modal.find("#DisplayOnAllBookings").iCheck(client.DisplayOnAllBookings == true ? 'check' : 'uncheck');
                    that.Modal.find("#ClientNotes").val(client.ClientNotes);
                    that.Modal.find("#Address").val(client.Address);
                    that.Modal.find("#Suburb").val(client.Suburb);
                    that.Modal.find("#City").val(client.City);
                    that.Modal.find("#State").val(client.State);
                    that.Modal.find("#PostCode").val(client.PostCode);
                    that.Modal.find("#deleteButton").show();
                    that.Modal.modal("show");
                })
            }, 1000);
        }
    }
    //#endregion

    //#region Public
    CreateModal(firstName, lastName, clientID) {
        this.Parameter.ClientID = clientID;
        this.Parameter.FirstName = firstName;
        this.Parameter.LastName = lastName;

        var that = this;
        if (this.HTML.Index == null)
            $.RequestAjaxText(LinkFileMobileAddOrEditClient.AddOrEditClient.Index, function (data) { that.HTML.Index = data; });
        if (this.Modal == undefined || this.Modal == null) {
            this.Modal = $(this.HTML.Index).modal({
                backdrop: false,
                show: false,
            })
        } else {
            this.RemoveEvent();
        }
        this.CreateControlPlugin();

        if (that.Parameter.ClientID != null && that.Parameter.ClientID != undefined)
            this.LoadEdit();
        else
            this.LoadCreate();
        this.CreateEvent();
    }
    HideModal() {
        if (this.Modal != null) {
            this.RemoveEvent();
            this.Modal.modal("hide");
            if (this.Parameter.CallBackHideModal)
                this.Parameter.CallBackHideModal();
        }
    }
    RemoveModal() {
        if (this.Modal != null) {
            this.RemoveEvent();
            this.Modal.modal("hide");
            this.Modal.remove();
        }
    }
    //#endregion
}