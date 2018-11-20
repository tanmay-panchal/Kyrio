class ModalStaff {
    constructor(UserID, callBack) {
        ; debugger;
        var that = this;
        this.UserID = UserID;
        this.CallBackHide = callBack;
        if (UserID && UserID != 0 && $.isNumeric(UserID)) {
            this.InstallModal(function () {
                that.LoadEdit(UserID)
            });
        } else
            this.InstallModal(that.LoadCreate);
    }
    InstallModal(callback) {
        var that = this;
        $.RequestAjaxText("/ContentHtml/Staff/Modal.html", function (data) { that.HtmlModal = data; });
        that.Modal = $(that.HtmlModal).modal({
            backdrop: "static",
            keyboard: false,
            show: true,
        })
        that.Modal.on("shown.bs.modal", function () {
            that.InstallControllAndLoadData();
            that.InstallEvent();
            if (callback)
                callback();
        });
        that.Modal.on("hidden.bs.modal", function () {
            that.Remove();
        });
    }
    InstallControllAndLoadData() {
        var that = this;
        //Load Data Tab Location
        $.RequestAjax("/Staff/GetLocation", JSON.stringify({
            UserID: that.UserID
        }), function (data) {
            that.AddDataLocation("#containtLocation", data.Result, "locationIDStaff");
        })
        //Load Data Tab Service
        $.RequestAjax("/Staff/GetService", JSON.stringify({
            UserID: that.UserID
        }), function (data) {
            that.AddDataService("#containtService", data.Result, "serviceIDStaff");
        });
        //Load Data APPOINTMENT COLOR
        $.RequestAjax('/Home/GetDefaultColor', null, function (data) {
            $.each(data.Result, function () {
                that.Modal.find("#colorGroup").InstallButtonColor("AppointmentColor", "buttonAppointmentColor", this.DefaultColorCode);
            })
        })

        //Install control
        that.Modal.find('#StartDate').daterangepicker({
            "singleDatePicker": true,
        });
        that.Modal.find('#EndDate').daterangepicker({
            "singleDatePicker": true,
            "autoUpdateInput": false
        });
        that.Modal.find("#RoleID").InStallSelect2('/Home/LoadSelect2ForRole', 20, 'USER PERMISSION');
        that.Modal.find('[isnumber]').InStallInputMarsk(2, "", false, false, 0, 100);
    }
    InstallEvent() {
        var that = this;
        this.Modal.find('#EndDate').on('apply.daterangepicker', function (ev, picker) {
            $(this).val($(this).data('daterangepicker').startDate.format(Window.FormatDateJS));
        });
        this.Modal.find("#MobileNumber").keyup(function () {
            that.Modal.find("#MobileNumber").val(this.value.match(/[0-9]*/));
        });
        this.Validator = this.Modal.find('#staffForm').validate({
            rules: {
                FirstName: 'required',
                Email: {
                    required: false,
                    email: true,
                    remote: {
                        url: "/Staff/ValidateEmail",
                        type: 'post',
                        data: {
                            Email: function () {
                                return that.Modal.find("#Email").val();
                            },
                            UserId: function () {
                                return that.Modal.find("#UserID").val();
                            },
                        },
                        error: function (jqXHR, textStatus, errorThrow) {
                            toastr["error"](jqXHR.responseJSON.ContentError, jqXHR.responseJSON.TitleError);
                        }
                    }
                },
            },
            messages: {
                FirstName: 'Please enter your first name',
                Email: {
                    email: 'Please enter a valid email address',
                    remote: 'Has already been taken',
                },
            },
            errorElement: 'em',
            errorPlacement: function (error, element) {
                error.addClass('invalid-feedback');
                error.insertAfter(element);
            },
            highlight: function (element, errorClass, validClass) {
                $(element).addClass('is-invalid').removeClass('is-valid');
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).addClass('is-valid').removeClass('is-invalid');
            },
        });
        this.ButtonSave = Ladda.bind('#actionServiceButton', {
            callback: function (instance) {
                instance.start();
                if (that.Modal.find("#staffForm").valid()) {
                    var entity = new Object();
                    that.Modal.find("[ispropertiesmodel]").each(function () {
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
                    entity.DialCode = that.Modal.find("#MobileNumber").intlTelInput("getSelectedCountryData").dialCode;
                    entity.StartDate = that.Modal.find('#StartDate').data('daterangepicker').startDate._d;
                    entity.EndDate = that.Modal.find('#EndDate').val() == "" ? null : that.Modal.find('#EndDate').data('daterangepicker').startDate.toDate();
                    entity.AppointmentColor = that.Modal.find('[name="AppointmentColor"]:checked').attr("valuecolor");
                    var userLocations = [];
                    that.Modal.find("[name='locationIDStaff']").each(function () {
                        if (this.checked) {
                            userLocations.push({
                                LocationID: $(this).attr("locationID")
                            });
                        }
                    });
                    var serviceStaff = [];
                    that.Modal.find("[name='serviceIDStaff']").each(function () {
                        if (this.checked) {
                            serviceStaff.push({
                                ServiceStaffID: $(this).attr("servicestaffid"),
                                ServiceID: $(this).attr("serviceid"),
                            });
                        }
                    });
                    $.RequestAjax("/Staff/SaveStaffMember", JSON.stringify({
                        Entity: entity,
                        UserLocations: userLocations,
                        ServiceStaffs: serviceStaff,
                        isUpdate: that.Modal.find("[ispropertiesidmodel]").val() != 0,
                    }), function (data) {
                        toastr["success"]("Data saved successfully.", "Notification");
                        that.Modal.modal("hide");
                    }, function () {
                        instance.stop();
                    })
                } else
                    instance.stop();
            }
        });
        this.Modal.find("#deleteServiceButton").click(function () {
            $.RequestAjax("/Staff/CheckDeleteStaffMember", JSON.stringify({
                id: that.Modal.find("#UserID").val(),
            }), function (data) {
                if (data.Result == true) {
                    PNotify.notice({
                        title: 'Delete Employee',
                        text: 'Are you sure you want to delete this employee?',
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
                                            url: '/Staff/DeleteStaffMember',
                                            type: 'post',
                                            datatype: 'json',
                                            data: {
                                                id: that.Modal.find("#UserID").val(),
                                            },
                                            async: false,
                                            cache: false,
                                            success: function (data) {
                                                if (!JSON.parse(data.Result)) {
                                                    if (parseInt(data.ErrorStyle) != 0)
                                                        toastr["error"](data.ErrorMessage, "Error");
                                                    else
                                                        toastr["error"](data.ErrorMessage, "Error");
                                                }
                                                else
                                                    toastr["success"](data.ErrorMessage, "Notification");
                                                notice.close();
                                                that.Modal.modal("hide");
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
                }
                else
                    toastr["error"](data.ErrorMessage, "");
            })
        })
        this.Modal.find("#resetPassswordButton").click(function () {
            PNotify.notice({
                title: 'Send Reset Password Employee',
                text: 'Are you sure you want to send reset password this employee?',
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
                            text: 'Reset Password',
                            primary: true,
                            click: function (notice) {
                                $.RequestAjax("/Staff/ResetPassword", JSON.stringify({
                                    UserID: that.Modal.find("#UserID").val(),
                                    Email: that.Modal.find("#Email").val(),
                                }), function (data) {
                                    if (!JSON.parse(data.Result))
                                        toastr["error"](data.ErrorMessage, "Error");
                                    else
                                        toastr["success"]("Data saved successfully.", "Notification");
                                    notice.close();
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
    }
    Remove() {
        this.Modal.modal('dispose');
        this.Modal.remove();
        //this.ButtonSave.remove();
        this.Validator.destroy();
        $(document).off("apply.daterangepicker", "#modalStaff #EndDate");
        $(document).off("keyup", "#modalStaff #MobileNumber");
        $(document).off("click", "#modalStaff #deleteServiceButton");
        $(document).off("click", "#modalStaff #resetPassswordButton");
        $(document).off("click", "#modalStaff #actionServiceButton");
        if (this.CallBackHide)
            this.CallBackHide();
    }
    LoadCreate() {
        var that = this;
        $.RequestAjax('/Staff/GetDataWhenCreateStaff', null, function (data) {
            that.Modal.find("#TitleModal").text("New Staff");
            that.Modal.find("#FirstName, #LastName, #MobileNumber, #Email, #Notes").val("");
            that.Modal.find("#UserID, #ServiceCommission, #ProductCommission, #VoucherSalesCommission").val("0");
            that.Modal.find("#EnableAppointmentBooking")[0].checked = true;
            that.Modal.find("#EnableAppointmentBooking").trigger("change");
            that.Modal.find('#StartDate, #EndDate').data('daterangepicker').setStartDate(new Date());
            that.Modal.find('#StartDate, #EndDate').data('daterangepicker').setEndDate(new Date());
            that.Modal.find('#EndDate').val("");
            that.Modal.find('#RoleID').append(new Option(data.Result.Role.RoleName, data.Result.Role.RoleID, true, true)).trigger('change');
            that.Modal.find('#RoleID').select2("enable");
            that.Modal.find('[name="AppointmentColor"][valuecolor="#0000FF"]')[0].checked = true;
            that.Modal.find("#checkAllLocation").iCheck('check');
            that.Modal.find("#checkAllService").iCheck('check');
            that.Modal.find("[name='serviceIDStaff']").iCheck('check');
            that.Modal.find("[name='locationIDStaff']").iCheck('check');
            that.Modal.find("[name='serviceIDStaff']").attr("servicestaffid", "0");
            that.Modal.find("#deleteServiceButton").hide();
            that.Modal.find("#resetPassswordButton").hide();
            that.Modal.find("#MobileNumber").intlTelInput("destroy");
            that.Modal.find("#MobileNumber").intlTelInput({
                separateDialCode: true,
                initialCountry: data.Result.DialCode.CountryCode,
                preferredCountries: [data.Result.DialCode.CountryCode],
                utilsScript: "/Extension/js/utils.js"
            });
        })
    }
    LoadEdit(UserID) {
        var that = this;
        $.RequestAjax("/Staff/GetDataWhenEditStaff", JSON.stringify({
            UserID: UserID,
        }), function (data) {
            var User = data.Result.User;
            var Role = data.Result.Role;
            var DialCode = data.Result.DialCode;
            var UserLocations = data.Result.UserLocations;
            var ServiceStaffs = data.Result.ServiceStaffs;

            //Load data user
            that.Modal.find("#TitleModal").text("Edit Staff");
            that.Modal.find("#UserID").val(User.UserID);
            that.Modal.find("#FirstName").val(User.FirstName);
            that.Modal.find("#LastName").val(User.LastName);
            that.Modal.find("#Email").val(User.Email);
            that.Modal.find("#MobileNumber").val(User.MobileNumber);
            that.Modal.find("#Notes").val(User.Notes);
            that.Modal.find("#ServiceCommission").val(User.ServiceCommission);
            that.Modal.find("#ProductCommission").val(User.ProductCommission);
            that.Modal.find("#VoucherSalesCommission").val(User.VoucherSalesCommission);
            that.Modal.find("#MobileNumber").intlTelInput("destroy");
            that.Modal.find("#MobileNumber").intlTelInput({
                separateDialCode: true,
                initialCountry: DialCode == "" ? "vn" : DialCode,
                preferredCountries: [DialCode == "" ? "vn" : DialCode],
                utilsScript: "/Extension/js/utils.js"
            });
            that.Modal.find("#EnableAppointmentBooking")[0].checked = User.EnableAppointmentBooking;
            that.Modal.find("#EnableAppointmentBooking").trigger("change");
            that.Modal.find('#StartDate').data('daterangepicker').setStartDate(moment(User.StartDate).toDate());
            that.Modal.find('#StartDate').data('daterangepicker').setEndDate(moment(User.StartDate).toDate());
            var EndDate = User.EndDate ? User.EndDate : new Date();
            that.Modal.find('#EndDate').data('daterangepicker').setStartDate(moment(EndDate).toDate());
            that.Modal.find('#EndDate').data('daterangepicker').setEndDate(moment(EndDate).toDate());
            that.Modal.find("#EndDate").val("");
            if (User.EndDate)
                that.Modal.find("#EndDate").trigger("apply.daterangepicker");
            that.Modal.find('#RoleID').select2("enable");
            that.Modal.find('#RoleID').append(new Option(Role.RoleName, Role.RoleID, true, true)).trigger('change');
            if (parseInt(Role.RoleID) == 5)
                that.Modal.find('#RoleID').select2("enable", false);
            that.Modal.find('[name="AppointmentColor"][valuecolor="' + User.AppointmentColor + '"]')[0].checked = true;

            //Load data Location User
            that.Modal.find("#checkAllLocation").iCheck('uncheck');
            that.Modal.find("[name='locationIDStaff']").iCheck('uncheck');
            $.each(UserLocations, function () {
                that.Modal.find("[name='locationIDStaff'][locationID='" + this.LocationID + "']").iCheck('check');
            })

            //Load data Service Staff
            that.Modal.find("#checkAllService").iCheck('uncheck');
            that.Modal.find("[name='serviceIDStaff']").iCheck('uncheck');
            that.Modal.find("[name='serviceIDStaff']").attr("servicestaffid", "0");
            $.each(ServiceStaffs, function () {
                that.Modal.find("[name='serviceIDStaff'][serviceid='" + this.ServiceID + "']").iCheck('check');
                that.Modal.find("[name='serviceIDStaff'][serviceid='" + this.ServiceID + "']").attr("servicestaffid", this.ServiceStaffID);
            })
            if ($.trim(User.Email) == "")
                that.Modal.find("#resetPassswordButton").hide();
            else
                that.Modal.find("#resetPassswordButton").show();
            that.Modal.find("#deleteServiceButton").show();
        })
    }
    AddDataLocation(seletor, data, nameInputLocation) {
        if (this.Modal.find(seletor).is("div")) {
            if (Array.isArray(data)) {
                var that = this.Modal.find(seletor);
                this.Modal.find(seletor).html("");
                $.each(data, function () {
                    var html = '<div class="col-fhd-6 col-xlg-6 col-md-6 col-sm-12 col-xs-6"><hr><div class="btn-block btn-checkbox" name="locationStaff">'
                               + '<input type="checkbox" name="' + nameInputLocation + '" locationID="' + this.LocationID + '"/> <strong style="margin-left: 5px">' + this.LocationName + "</strong>"
                               + '</div></div>';
                    $(that).append(html);
                })
            }
            this.Modal.find("div[name='locationStaff']").click(function () {
                $(this).find("input[type='checkbox']").iCheck('toggle');
            })
            this.Modal.find("input[type='checkbox']:not(.switch-input)").iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        } else
            console.error("Đối tượng không hợp lệ");
    }
    AddDataService(seletor, data, nameInputService) {
        if (this.Modal.find(seletor).is("div")) {
            if (Array.isArray(data)) {
                var that = this.Modal.find(seletor);
                this.Modal.find(seletor).html("");
                $.each(data, function () {
                    var html = '<div class="col-fhd-6 col-xlg-6 col-md-6 col-sm-12 col-xs-6"><hr><div class="btn-block btn-checkbox" name="serviceStaff">'
                               + '<input type="checkbox" name="' + nameInputService + '" serviceid="' + this.ServiceID + '" servicestaffid="' + 0 + '" /> <strong style="margin-left: 5px">' + this.ServiceName + "</strong>"
                               + '</div></div>';
                    $(that).append(html);
                })
            }
            this.Modal.find("div[name='serviceStaff']").click(function () {
                $(this).find("input[type='checkbox']").iCheck('toggle');
            })
            this.Modal.find("input[type='checkbox']:not(.switch-input)").iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        } else
            console.error("Đối tượng không hợp lệ");
    }
}