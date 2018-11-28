$(function () {
    CreateBreadcrumb([{ href: "/Setup/Index", title: "Setup" }, { href: "/Setup/ClientNotifications", title: "Client Notifications" }])
    //lay setting
    $.RequestAjax("/Setup/GetBusinessSetting", JSON.stringify({
        SettingGroup: "Client Notifications"
    }), function (data) {
        $.each(data.data, function () {
            //debugger;
            if (this.SettingCode == 'config_communications_enabled') {
                var x = document.getElementById("groupsetting");
                if (this.Value == "0") {
                    $("#config_communications_enabled").iCheck('uncheck');
                    x.style.display = 'none';
                }
                else {
                    $("#config_communications_enabled").iCheck('check');
                    x.style.display = 'block';
                }
            }
            else if (this.SettingCode == 'config_confirmation_notification_enabled') {
                var x = document.getElementById("gr_config_confirmation");
                if (this.Value == "0") {
                    $("#config_confirmation_notification_enabled").iCheck('uncheck');
                    x.style.display = 'none';
                }
                else {
                    $("#config_confirmation_notification_enabled").iCheck('check');
                    x.style.display = 'block';
                }
            }
            else if (this.SettingCode == 'config_reminder_notification_enabled') {
                var x = document.getElementById("gr_config_reminder");
                if (this.Value == "0") {
                    $("#config_reminder_notification_enabled").iCheck('uncheck');
                    x.style.display = 'none';
                }
                else {
                    $("#config_reminder_notification_enabled").iCheck('check');
                    x.style.display = 'block';
                }
            }
            else if (this.SettingCode == 'config_rescheduling_notification_enabled') {
                var x = document.getElementById("gr_config_rescheduling");
                if (this.Value == "0") {
                    $("#config_rescheduling_notification_enabled").iCheck('uncheck');
                    x.style.display = 'none';
                }
                else {
                    $("#config_rescheduling_notification_enabled").iCheck('check');
                    x.style.display = 'block';
                }
            }
            else if (this.SettingCode == 'config_cancellation_notification_enabled') {
                var x = document.getElementById("gr_config_cancellation");
                if (this.Value == "0") {
                    $("#config_cancellation_notification_enabled").iCheck('uncheck');
                    x.style.display = 'none';
                }
                else {
                    $("#config_cancellation_notification_enabled").iCheck('check');
                    x.style.display = 'block';
                }
            }
            else if (this.SettingCode == 'config_thank_you_notification_enabled') {
                var x = document.getElementById("gr_config_thank_you");
                if (this.Value == "0") {
                    $("#config_thank_you_notification_enabled").iCheck('uncheck');
                    x.style.display = 'none';
                }
                else {
                    $("#config_thank_you_notification_enabled").iCheck('check');
                    x.style.display = 'block';
                }
            }
            else if (this.SettingCode == 'config_reminders_send_by') {
                $("#config_reminders_send_by").val(this.Value).change();
                if (this.Value == "marketing_email") {
                    $("#divsms_template").css("display", "none");
                    $("#divButtonreminder_sms").css("display", "none");

                    $("#divemail_title").css("display", "block");
                    $("#divemail_template").css("display", "block");
                    $("#divButtonreminder_email").css("display", "block");
                }
                else if (this.Value == "marketing_sms") {
                    $("#divsms_template").css("display", "block");
                    $("#divButtonreminder_sms").css("display", "block");

                    $("#divemail_title").css("display", "none");
                    $("#divemail_template").css("display", "none");
                    $("#divButtonreminder_email").css("display", "none");
                }
                else {
                    $("#divsms_template").css("display", "block");
                    $("#divButtonreminder_sms").css("display", "block");
                    $("#divemail_title").css("display", "block");
                    $("#divemail_template").css("display", "block");
                    $("#divButtonreminder_email").css("display", "block");
                }
            }
            else if (this.SettingCode == 'config_reminders_advance_period') {
                $("#config_reminders_advance_period").val(this.Value).change();
            }
            else if (this.SettingCode == 'config_reminder_sms_template') {
                $("#config_reminder_sms_template").val(this.Value);
            }
            else if (this.SettingCode == 'config_reminder_email_title') {
                $("#config_reminder_email_title").val(this.Value);
            }
            else if (this.SettingCode == 'config_reminder_email_template') {
                $("#config_reminder_email_template").val(this.Value);
            }
            else if (this.SettingCode == 'config_confirmation_email_title') {
                $("#config_confirmation_email_title").val(this.Value);
            }
            else if (this.SettingCode == 'config_confirmation_email_template') {
                $("#config_confirmation_email_template").val(this.Value);
            }
            else if (this.SettingCode == 'config_rescheduling_email_title') {
                $("#config_rescheduling_email_title").val(this.Value);
            }
            else if (this.SettingCode == 'config_rescheduling_email_template') {
                $("#config_rescheduling_email_template").val(this.Value);
            }
            else if (this.SettingCode == 'config_cancellation_email_title') {
                $("#config_cancellation_email_title").val(this.Value);
            }
            else if (this.SettingCode == 'config_cancellation_email_template') {
                $("#config_cancellation_email_template").val(this.Value);
            }
            else if (this.SettingCode == 'config_thank_you_email_title') {
                $("#config_thank_you_email_title").val(this.Value);
            }
            else if (this.SettingCode == 'config_thank_you_email_template') {
                $("#config_thank_you_email_template").val(this.Value);
            }
        })
    }, function () {
    })
    //doi reminder send by
    $('#config_reminders_send_by').on('change', function () {
        if ($(this).val() == "marketing_email") {
            $("#divsms_template").css("display", "none");
            $("#divButtonreminder_sms").css("display", "none");

            $("#divemail_title").css("display", "block");
            $("#divemail_template").css("display", "block");
            $("#divButtonreminder_email").css("display", "block");
        }
        else if ($(this).val() == "marketing_sms") {
            $("#divsms_template").css("display", "block");
            $("#divButtonreminder_sms").css("display", "block");

            $("#divemail_title").css("display", "none");
            $("#divemail_template").css("display", "none");
            $("#divButtonreminder_email").css("display", "none");
        }
        else {
            $("#divsms_template").css("display", "block");
            $("#divButtonreminder_sms").css("display", "block");
            $("#divemail_title").css("display", "block");
            $("#divemail_template").css("display", "block");
            $("#divButtonreminder_email").css("display", "block");
        }
    })
    //an hien khung setting
    $('#config_communications_enabled').on('change', function () {
        var x = document.getElementById("groupsetting");
        if (this.checked) {
            x.style.display = 'block';
        } else {
            x.style.display = 'none';
        }
    });
    //an hien group reminder
    $("#config_reminder_notification_enabled").on("ifChanged", function () {
        var x = document.getElementById("gr_config_reminder");
        if (this.checked) {
            x.style.display = 'block';
        } else {
            x.style.display = 'none';
        }
    })
    //an hien group confirmation
    $("#config_confirmation_notification_enabled").on("ifChanged", function () {
        var x = document.getElementById("gr_config_confirmation");
        if (this.checked) {
            x.style.display = 'block';
        } else {
            x.style.display = 'none';
        }
    })
    //an hien group rescheduling
    $("#config_rescheduling_notification_enabled").on("ifChanged", function () {
        var x = document.getElementById("gr_config_rescheduling");
        if (this.checked) {
            x.style.display = 'block';
        } else {
            x.style.display = 'none';
        }
    })
    //an hien group cancellation
    $("#config_cancellation_notification_enabled").on("ifChanged", function () {
        var x = document.getElementById("gr_config_cancellation");
        if (this.checked) {
            x.style.display = 'block';
        } else {
            x.style.display = 'none';
        }
    })
    //an hien group thank_you
    $("#config_thank_you_notification_enabled").on("ifChanged", function () {
        var x = document.getElementById("gr_config_thank_you");
        if (this.checked) {
            x.style.display = 'block';
        } else {
            x.style.display = 'none';
        }
    })

    $("#preview_confirmation, #preview_sms_reminder, #preview_reminder, #preview_rescheduling, #preview_cancellation, #preview_thank_you").click(function () {
        //lay template
        var template = $("#" + $(this).attr("tag")).val();

        $.RequestAjax("/Setup/PreviewTemplateNotification", JSON.stringify({
            template: template,
        }), function (data) {
            var html = '<div class="col-fhd-12 col-xlg-12 col-md-12 col-sm-12 col-xs-12 ">' + data.data + '</div>';
            $("#template").html(html);
        }, function () {
        })

        $('#actionModal').modal("show");
    })

    $("#reset_confirmation, #reset_sms_reminder, #reset_reminder, #reset_rescheduling, #reset_cancellation, #reset_thank_you").click(function () {
        var settingcode = $(this).attr("tag");
        PNotify.notice({
            title: 'Reset template to default',
            text: 'Do you really want to reset the template to default?',
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
                        text: 'Reset',
                        primary: true,
                        click: function (notice) {
                            $.ajax({
                                url: '/Setup/ResetTemplateNotification',
                                type: 'post',
                                datatype: 'json',
                                data: {
                                    SettingCode: settingcode
                                },
                                async: false,
                                cache: false,
                                success: function (data) {
                                    //debugger;
                                    $("#" + settingcode).val(data.data);
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