var NotYear = true;
$(function () {
    //#region Load data && setup control
    CreateBreadcrumb([{ href: "/Clients/Index", title: "Clients" }, { href: "", title: "Profile" }])
    $("#main").css("background-color", "#F7F7F8")
    var country = "vn";
    $.each($.fn.intlTelInput.getCountryData(), function () {
        if ($("#MobileNumberDialCode").val() == this.dialCode) {
            country = this.iso2;
            return;
        }
    })
    $("#MobileNumber").intlTelInput({
        separateDialCode: true,
        initialCountry: country,
        preferredCountries: [Window.CountryCode],
        utilsScript: "/Extension/js/utils.js"
    });
    $.each($.fn.intlTelInput.getCountryData(), function () {
        if ($("#TelephoneDialCode").val() == this.dialCode) {
            country = this.iso2;
            return;
        }
    })
    $("#Telephone").intlTelInput({
        separateDialCode: true,
        initialCountry: country,
        preferredCountries: [Window.CountryCode],
        utilsScript: "/Extension/js/utils.js"
    });
    $("#DateOfBirth").prop("formatdate", Window.FormatDateJS)
    $("#DateOfBirth").daterangepicker({
        "singleDatePicker": true,
        "timePicker": false,
        "locale": {
            "format": "DD/MM",
        }
    });
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
    $('#actionModal').modal({
        backdrop: false,
        show: false,
    })
    $('#actionModal').on('hidden.bs.modal', function (e) {
        $("body").find(".modal-backdrop").remove();
    })
    $('#actionModal').on('shown.bs.modal', function (e) {
        $("body").append('<div class="modal-backdrop fade show"></div>');
    })
    $("#actionForm #ReferralSource").InStallSelect2('/Home/LoadSelect2ForReferralSource', 20, 'Referral Source', null);
    //Load 3 tab
    var LoadHistoryClient = function () {
        var Excute = function () {
            var clientDestop = new ClientDetailDestop($("#ViewClientID").val(), false);
            clientDestop.CreateClient(function (renposive) {
                var element = $(renposive.Html).find("#divMainTab");//chi lay du lieu trong divMainTab
                element.find("#tabHistoryClientInfo").remove();//bo di tab info
                $("#divHistoryClient").html(element);
                //gan su kien click tab
                $("#btnTabAppointments").click(function () {
                    $("#btnTabAppointments").removeClass("oEUy3Y").addClass("oEUy3Y");
                    $("#btnTabProducts").removeClass("oEUy3Y");
                    $("#btnTabInvoices").removeClass("oEUy3Y");
                    $("#btnTabInfo").removeClass("oEUy3Y");

                    $("#divTabAppointment").css('display', 'block');
                    $("#divTabProduct").css('display', 'none');
                    $("#divTabInvoice").css('display', 'none');
                    $("#divTabInfo").css('display', 'none');
                })
                $("#btnTabProducts").click(function () {
                    $("#btnTabProducts").removeClass("oEUy3Y").addClass("oEUy3Y");
                    $("#btnTabAppointments").removeClass("oEUy3Y");
                    $("#btnTabInvoices").removeClass("oEUy3Y");
                    $("#btnTabInfo").removeClass("oEUy3Y");

                    $("#divTabProduct").css('display', 'flex');
                    $("#divTabAppointment").css('display', 'none');
                    $("#divTabInvoice").css('display', 'none');
                    $("#divTabInfo").css('display', 'none');
                })
                $("#btnTabInvoices").click(function () {
                    $("#btnTabInvoices").removeClass("oEUy3Y").addClass("oEUy3Y");
                    $("#btnTabAppointments").removeClass("oEUy3Y");
                    $("#btnTabProducts").removeClass("oEUy3Y");
                    $("#btnTabInfo").removeClass("oEUy3Y");

                    $("#divTabInvoice").css('display', 'flex');
                    $("#divTabAppointment").css('display', 'none');
                    $("#divTabProduct").css('display', 'none');
                    $("#divTabInfo").css('display', 'none');
                })
                $("#btnTabInfo").click(function () {
                    $("#btnTabInfo").removeClass("oEUy3Y").addClass("oEUy3Y");
                    $("#btnTabAppointments").removeClass("oEUy3Y");
                    $("#btnTabProducts").removeClass("oEUy3Y");
                    $("#btnTabInvoices").removeClass("oEUy3Y");

                    $("#divTabInfo").css('display', 'flex');
                    $("#divTabAppointment").css('display', 'none');
                    $("#divTabProduct").css('display', 'none');
                    $("#divTabInvoice").css('display', 'none');
                })
            });
        }
        if (typeof ClientSearchDestop != "function") {
            $.getScript("/Scripts/calendar/client.js").done(function () {
                Excute();
            }).fail(function () {
                console.log("Load file js fail");
            })
        } else
            Excute();
    }
    LoadHistoryClient();
    //#endregion

    //#region event 
    $("#btnEditClient").click(function () {
        $("#TitleModal").text("Edit Client");
        //lay client
        $.RequestAjax("/Clients/GetClientByID", JSON.stringify({
            ID: $("#ViewClientID").val(),
        }), function (data) {
            var client = data.data;
            $("#ClientID").val(client.ClientID);
            $("#FirstName").val(client.FirstName);
            $("#LastName").val(client.LastName);
            $("#MobileNumber").val(client.MobileNumber);
            $("#Telephone").val(client.Telephone);
            $("#Email").val(client.Email);
            $("#AppointmentNotificationType").val(client.AppointmentNotificationType).change();
            $("#AcceptMarketingNotifications").iCheck(client.AcceptMarketingNotifications == true ? 'check' : 'uncheck');
            $("#Gender").val(client.Gender).change();
            $("#ReferralSource").SetValueSelect2ID(client.ReferralSource);

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
            $("#DateOfBirth").data('daterangepicker').setStartDate(client.DateOfBirth ? moment(client.DateOfBirth)._d : moment()._d);
            $("#DisplayOnAllBookings").iCheck(client.DisplayOnAllBookings == true ? 'check' : 'uncheck');
            $("#ClientNotes").val(client.ClientNotes);

            $("#Address").val(client.Address);
            $("#Suburb").val(client.Suburb);
            $("#City").val(client.City);
            $("#State").val(client.State);
            $("#PostCode").val(client.PostCode);
        }, function () {
        })
        $("#deleteButton").show();
        $('#actionModal').modal("show");
    })
    $("#btnDeleteClient, #deleteButton").click(function () {
        PNotify.notice({
            title: 'DELETE CLIENT',
            text: 'Are you sure you want to delete this client?',
            icon: 'fa fa-question-circle',
            hide: false,
            width: "460px",
            stack: {
                'dir1': 'down',
                'modal': true,
                'firstpos1': 25
            },
            modules: {
                Confirm: {
                    confirm: true,
                    buttons: [{
                        text: 'DELETE',
                        primary: true,
                        click: function (notice) {
                            $.ajax({
                                url: '/Clients/Delete',
                                type: 'post',
                                datatype: 'json',
                                data: {
                                    id: $("#ViewClientID").val()
                                },
                                async: false,
                                cache: false,
                                success: function (data) {
                                    if (!JSON.parse(data.Result)) {
                                        if (parseInt(data.ErrorStyle) != 0) {
                                            toastr["error"](data.ErrorMessage, "Error");
                                        } else {
                                            toastr["error"]("Delete data failed. Please contact the developer to fix it.", "Error");
                                            console.log("Xóa dữ liệu thất bại: " + data.ErrorMessage);
                                        }
                                    }
                                    else {
                                        toastr["success"](data.ErrorMessage, "Notification");
                                        window.location.href = '/Clients/Index'
                                    }
                                    notice.close();
                                }
                            })
                        }
                    },
                        {
                            text: 'CANCEL',
                            click: function (notice) {
                                notice.close();
                            }
                        }
                    ],
                },
                Buttons: {
                    closer: false,
                    sticker: false
                },
                History: {
                    history: false
                }
            }
        })
    })
    $("#btnNewAppointment").click(function () {
        localStorage.setItem("IsViewCreateAppointment", true);
        localStorage.setItem("ClientIDViewCreateAppointment", $("#ViewClientID").val());
        window.location.href = '/Calendar/Index'
    })
    Ladda.bind('#actionButton', {
        callback: function (instance) {
            //debugger;
            instance.start();
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
                    isUpdate: $("#actionForm [ispropertiesidmodel]").val() != 0,
                }), function (data) {
                    toastr["success"]("Data saved successfully.", "Notification");
                    $('#actionModal').modal("hide");
                    //setTimeout("table.ajax.reload()", 500);
                    window.location = "/Clients/Clients?id=" + $("#ViewClientID").val();
                }, function () {
                    instance.stop();
                })
            } else
                instance.stop();
        }
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
    $(document).on("click", "#divLineService ._1EOvhM", function () {
        var AppointmentID = $(this).attr("AppointmentID");
        $.CallViewAppointment(AppointmentID);
    })
    $(document).on("click", "#divClientInvoice ._2mPFMy", function () {
        //debugger;
        var InvoiceID = $(this).attr("InvoiceID");
        window.location = "/Sale/Invoices?id=" + InvoiceID;
        localStorage.setItem("PreLink", "/Clients/Clients?id=" + $("#ViewClientID").val());
    })
    $("#MobileNumber").keyup(function () {
        $("#MobileNumber").val(this.value.match(/[0-9]*/));
    });
    $("#Telephone").keyup(function () {
        $("#Telephone").val(this.value.match(/[0-9]*/));
    });
    //#endregion
})