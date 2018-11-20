var table;
$(function () {
    //#region Method Add data location, Add data staff
    $.fn.extend({
        AddDataLocation: function (data, nameInputLocation) {
            if ($(this).is("div")) {
                if (Array.isArray(data)) {
                    var that = this;
                    $(this).html("");
                    $.each(data, function () {
                        var html = '<div class="col-fhd-6 col-xlg-6 col-md-6 col-sm-12 col-xs-6"><hr><div class="btn-block btn-checkbox" name="locationStaff">'
                                   + '<input type="checkbox" name="' + nameInputLocation + '" locationID="' + this.LocationID + '"/> <strong style="margin-left: 5px">' + this.LocationName + "</strong>"
                                   + '</div></div>';
                        $(that).append(html);
                    })
                }
                $(document).on("click", "div[name='locationStaff']", function () {
                    $(this).find("input[type='checkbox']").iCheck('toggle');
                })
                $("input[type='checkbox']:not(.switch-input)").iCheck({
                    checkboxClass: 'icheckbox_flat-green',
                    radioClass: 'iradio_flat-green'
                });
            } else {
                console.log("Đối tượng không hợp lệ");
            }
        },
        AddDataService: function (data, nameInputService) {
            if ($(this).is("div")) {
                if (Array.isArray(data)) {
                    var that = this;
                    $(this).html("");
                    $.each(data, function () {
                        var html = '<div class="col-fhd-6 col-xlg-6 col-md-6 col-sm-12 col-xs-6"><hr><div class="btn-block btn-checkbox" name="serviceStaff">'
                                   + '<input type="checkbox" name="' + nameInputService + '" serviceid="' + this.ServiceID + '" servicestaffid="' + 0 + '" /> <strong style="margin-left: 5px">' + this.ServiceName + "</strong>"
                                   + '</div></div>';
                        $(that).append(html);
                    })
                }
                $(document).on("click", "div[name='serviceStaff']", function () {
                    $(this).find("input[type='checkbox']").iCheck('toggle');
                })
                $("input[type='checkbox']:not(.switch-input)").iCheck({
                    checkboxClass: 'icheckbox_flat-green',
                    radioClass: 'iradio_flat-green'
                });
            } else {
                console.log("Đối tượng không hợp lệ");
            }
        }
    })
    //#endregion

    //#region Load data && setup control
    CreateBreadcrumb([{ href: "/Home/Index", title: "Home" }, { href: "/Staff/StaffMember", title: "Staff Members" }])
    $("#RoleID").InStallSelect2('/Home/LoadSelect2ForRole', 20, 'USER PERMISSION');
    $('#modalStaff').modal({
        backdrop: false,
        show: false,
    })
    $('[isnumber]').InStallInputMarsk(2, "", false, false, 0, 100);
    $('#modalStaff').on('hidden.bs.modal', function (e) {
        $("body").find(".modal-backdrop").remove();
    })
    $('#StartDate').daterangepicker({
        "singleDatePicker": true,
    });
    $('#EndDate').daterangepicker({
        "singleDatePicker": true,
        "autoUpdateInput": false
    });
    $('#EndDate').on('apply.daterangepicker', function (ev, picker) {
        $(this).val($(this).data('daterangepicker').startDate.format(Window.FormatDateJS));
    });
    $('#modalStaff').on('shown.bs.modal', function (e) {
        $("body").append('<div class="modal-backdrop fade show"></div>');
        $('#staffForm').validate().resetForm();
        $("a[href='#details']").trigger("click");
    })
    //Load Table
    table = $("#tableStaffMember").InStallDatatable(null, "/Staff/GetDataTableStaffMemeber", [
        {
            "data": null, "name": null, "width": "5%", "class": "text-center", "render": function (data, type, row) {
                return '<i class="icon-menu icons "></i>';
            }
        },
        { "data": "FirstName", "name": "FirstName", "class": "text-left", "render": function (data, type, row) { return (row.EnableAppointmentBooking ? '<i style="padding-left: 5px; color:' + row.AppointmentColor + '" class="fa fa-circle"></i>' : '') + '<strong style="padding-left: 15px">' + row.FirstName + ' ' + (row.LastName == null ? '' : row.LastName) + '</strong>'; } },
       { "data": "MobileNumber", "name": "MobileNumber", "class": "text-left" },
       { "data": "Email", "name": "Email", "class": "text-left" },
       { "data": "EnableAppointmentBooking", "name": "EnableAppointmentBooking", "class": "text-left", "render": function (data) { return data == true ? "Calendar bookings enabled" : "Calendar disabled"; } },
       { "data": "RoleName", "name": "RoleName", "class": "text-left" },
    ], true, false, false, false, 1, true, null, null, null, {
        "rowReorder": true
    });
    table.CreateButtonExportExcel({
        className: 'btn-block',
        text: '<i class="fa fa-file-excel-o"></i>  Download Excel',
        extend: 'excelHtml5',
        isAutoWidth: false,
        isSTT: false,
        sheetName: "Staff Member",
        title: null,
        filename: "StaffMember",
        ArrayColWidth: [25],
        exportOptions: {
            columns: [1],
            modifier: {
                page: 'current'
            },
            orthogonal: "export",
            trim: false
        },
        methodCustomeAll: function (data, functions, rels, rowPos) {
            var arrayColWidth = [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25];

            //#region fill data header
            rowPos = functions.AddRow(["First Name", "Last Name", "Mobile Number", "Email", "Appointments", "User Permission", "Start Date", "End Date", "Notes", "Service Commission", "Product Commission", "Voucher Commission"], rowPos);
            functions.MergeCells(rowPos, 0, 73);
            //#endregion

            //#region fill data to excel
            $.each(table.rows().data(), function () {
                var firstName = this.FirstName;
                var LastName = this.LastName;
                var MobileNumber = this.MobileNumber.toString() + " ";
                var Email = this.Email;
                var Appointments = this.EnableAppointmentBooking == true ? "Enabled" : "Disabled";
                var RoleName = this.RoleName;
                var StartDate = moment(this.StartDate).format("DD/MM/YYYY");
                var EndDate = this.EndDate == null ? '' : moment(this.EndDate).format("DD/MM/YYYY");
                var Notes = this.Notes;
                var ProductCommission = $.number(this.ProductCommission, Window.NumberDecimal, '.', ',');
                var VoucherSalesCommission = $.number(this.VoucherSalesCommission, Window.NumberDecimal, '.', ',');
                var ServiceCommission = $.number(this.ServiceCommission, Window.NumberDecimal, '.', ',');
                rowPos = functions.AddRow([firstName, LastName, MobileNumber, Email, Appointments, RoleName, StartDate, EndDate,
                    Notes, ServiceCommission, ProductCommission, VoucherSalesCommission], rowPos);
            })
            //#endregion

            // Set column widths
            var cols = functions.CreateCellPos(rels, 'cols');
            $('worksheet', rels).prepend(cols);

            for (var i = 0, ien = 12 ; i < ien ; i++) {
                cols.appendChild(functions.CreateCellPos(rels, 'col', {
                    attr: {
                        min: i + 1,
                        max: i + 1,
                        width: arrayColWidth[i],
                        customWidth: 1,
                    }
                }));
            }

        },
    }, '#buttonExcel');
    table.CreateButtonExportExcel({
        className: 'btn-block',
        text: '<i class="fa fa-file"></i>  Download CSV',
        filename: "StaffMember",
        customize: function (output, config) {
            output = '"First Name","Last Name","Mobile Number","Email","Appointments","User Permission","Start Date","End Date","Notes","Service Commission","Product Commission","Voucher Commission"\n';
            $.each(table.rows().data(), function () {
                output += '"' + this.FirstName + '",' + '"' + (this.LastName == null ? '' : this.LastName) + '",' + '"' + this.MobileNumber + '",' + '"' + (this.Email == null ? '' : this.Email) + '",' + '"' + (this.EnableAppointmentBooking == true ? 'Enabled' : 'Disabled') +
                    '",' + '"' + this.RoleName + '",' + '"' + moment(this.StartDate).format("DD/MM/YYYY") + '",' + '"' + (this.EndDate == null ? '' : moment(this.EndDate).format("DD/MM/YYYY")) + '",' + '"' + (this.Notes == null ? '' : this.Notes) + '",' +
                    '"' + $.number(this.ServiceCommission, Window.NumberDecimal, '.', ',') + '",' + '"' + $.number(this.ProductCommission, Window.NumberDecimal, '.', ',') + '",' + '"' + $.number(this.VoucherSalesCommission, Window.NumberDecimal, '.', ',') + '"\n';
            })
            return output;
        },
        extend: 'csvHtml5',
    }, '#buttonCVX');
    //Load Data Tab Location
    $.RequestAjax("/Staff/GetLocation", null, function (data) {
        $("#containtLocation").AddDataLocation(data.Result, "locationIDStaff");
    })
    //Load Data Tab Service
    $.RequestAjax("/Staff/GetService", null, function (data) {
        $("#containtService").AddDataService(data.Result, "serviceIDStaff");
    });
    //Load Data APPOINTMENT COLOR
    $.RequestAjax('/Home/GetDefaultColor', null, function (data) {
        $.each(data.Result, function () {
            $("#colorGroup").InstallButtonColor("AppointmentColor", "buttonAppointmentColor", this.DefaultColorCode);
        })
    })
    //#endregion

    //#region event
    table.on('row-reorder', function (e, diff, edit) {
        for (var i = 0, ien = diff.length ; i < ien ; i++) {
            var SortOrderNew = table.row(diff[i].newPosition).data().SortOrder;
            var UserID = table.row(diff[i].node).data().UserID;
            $.RequestAjax("/Staff/UpdateSortOrderUser", JSON.stringify({
                UserID: UserID,
                SortOrderNew: SortOrderNew,
            }))
        }
    })
    $("#EnableAppointmentBooking").change(function () {
        if (this.checked)
            $("#containtAppointmentColor").show("slow");
        else
            $("#containtAppointmentColor").hide("slow");
    })
    $("#checkAllLocation").on("ifChanged", function () {
        if (this.checked)
            $("[name='locationIDStaff']").iCheck('check');
        else
            $("[name='locationIDStaff']").iCheck('uncheck');
    })
    $("#checkAllService").on("ifChanged", function () {
        if (this.checked)
            $("[name='serviceIDStaff']").iCheck('check');
        else
            $("[name='serviceIDStaff']").iCheck('uncheck');
    })
    $("[name='locationIDStaff']").on("ifChanged", function () {
        var checkAll = $("#checkAllLocation")[0].checked;
        if ($("[name='locationIDStaff']:checked").length == $("[name='locationIDStaff']").length && this.checked && !checkAll)
            $("#checkAllLocation").iCheck('check');
        if (!this.checked && checkAll) {
            $("#checkAllLocation")[0].checked = false
            $("#checkAllLocation").iCheck('update');
        }
    })
    $("[name='serviceIDStaff']").on("ifChanged", function () {
        var checkAll = $("#checkAllService")[0].checked;
        if ($("[name='serviceIDStaff']:checked").length == $("[name='serviceIDStaff']").length && this.checked && !checkAll)
            $("#checkAllService").iCheck('check');
        if (!this.checked && checkAll) {
            $("#checkAllService")[0].checked = false
            $("#checkAllService").iCheck('update');
        }
    })
    $("[name='createStaff']").click(function () {
        $.RequestAjax('/Staff/GetDataWhenCreateStaff', null, function (data) {
            $("#TitleModal").text("New Staff");
            $("#FirstName, #LastName, #MobileNumber, #Email, #Notes").val("");
            $("#UserID, #ServiceCommission, #ProductCommission, #VoucherSalesCommission").val("0");
            $("#EnableAppointmentBooking")[0].checked = true;
            $("#EnableAppointmentBooking").trigger("change");
            $('#StartDate, #EndDate').data('daterangepicker').setStartDate(new Date());
            $('#StartDate, #EndDate').data('daterangepicker').setEndDate(new Date());
            $('#EndDate').val("");
            $('#RoleID').append(new Option(data.Result.Role.RoleName, data.Result.Role.RoleID, true, true)).trigger('change');
            $('#RoleID').select2("enable");
            $('[name="AppointmentColor"][valuecolor="#0000FF"]')[0].checked = true;
            $("#MobileNumber").intlTelInput("destroy");
            $("#MobileNumber").intlTelInput({
                separateDialCode: true,
                initialCountry: data.Result.DialCode.CountryCode,
                preferredCountries: [data.Result.DialCode.CountryCode],
                utilsScript: "/Extension/js/utils.js"
            });
            $("#checkAllLocation").iCheck('check');
            $("#checkAllService").iCheck('check');
            $("[name='serviceIDStaff']").iCheck('check');
            $("[name='locationIDStaff']").iCheck('check');
            $("[name='serviceIDStaff']").attr("servicestaffid", "0");
            $("#deleteServiceButton").hide();
            $("#resetPassswordButton").hide();
            $('#modalStaff').modal("show");
        })
    })
    $(document).on("click", "#tableStaffMember tbody tr td", function () {
        var data = table.row($(this).closest("tr")).data();
        $.RequestAjax("/Staff/GetDataWhenEditStaff", JSON.stringify({
            UserID: data.UserID,
        }), function (data) {
            var User = data.Result.User;
            var Role = data.Result.Role;
            var DialCode = data.Result.DialCode;
            var UserLocations = data.Result.UserLocations;
            var ServiceStaffs = data.Result.ServiceStaffs;

            //Load data user
            $("#TitleModal").text("Edit Staff");
            $("#UserID").val(User.UserID);
            $("#FirstName").val(User.FirstName);
            $("#LastName").val(User.LastName);
            $("#Email").val(User.Email);
            $("#MobileNumber").val(User.MobileNumber);
            $("#Notes").val(User.Notes);
            $("#ServiceCommission").val(User.ServiceCommission);
            $("#ProductCommission").val(User.ProductCommission);
            $("#VoucherSalesCommission").val(User.VoucherSalesCommission);
            $("#EnableAppointmentBooking")[0].checked = User.EnableAppointmentBooking;
            $("#EnableAppointmentBooking").trigger("change");
            $('#StartDate').data('daterangepicker').setStartDate(moment(User.StartDate).toDate());
            $('#StartDate').data('daterangepicker').setEndDate(moment(User.StartDate).toDate());
            var EndDate = User.EndDate ? User.EndDate : new Date();
            $('#EndDate').data('daterangepicker').setStartDate(moment(EndDate).toDate());
            $('#EndDate').data('daterangepicker').setEndDate(moment(EndDate).toDate());
            $("#EndDate").val("");
            if (User.EndDate)
                $("#EndDate").trigger("apply.daterangepicker");
            $('#RoleID').select2("enable");
            $('#RoleID').append(new Option(Role.RoleName, Role.RoleID, true, true)).trigger('change');
            if (parseInt(Role.RoleID) == 5)
                $('#RoleID').select2("enable", false);
            $('[name="AppointmentColor"][valuecolor="' + User.AppointmentColor + '"]')[0].checked = true;
            $("#MobileNumber").intlTelInput("destroy");
            $("#MobileNumber").intlTelInput({
                separateDialCode: true,
                initialCountry: DialCode == "" ? "vn" : DialCode,
                preferredCountries: [DialCode == "" ? "vn" : DialCode],
                utilsScript: "/Extension/js/utils.js"
            });

            //Load data Location User
            $("#checkAllLocation").iCheck('uncheck');
            $("[name='locationIDStaff']").iCheck('uncheck');
            $.each(UserLocations, function () {
                $("[name='locationIDStaff'][locationID='" + this.LocationID + "']").iCheck('check');
            })

            //Load data Service Staff
            $("#checkAllService").iCheck('uncheck');
            $("[name='serviceIDStaff']").iCheck('uncheck');
            $("[name='serviceIDStaff']").attr("servicestaffid", "0");
            $.each(ServiceStaffs, function () {
                $("[name='serviceIDStaff'][serviceid='" + this.ServiceID + "']").iCheck('check');
                $("[name='serviceIDStaff'][serviceid='" + this.ServiceID + "']").attr("servicestaffid", this.ServiceStaffID);
            })
            if ($.trim(User.Email) == "")
                $("#resetPassswordButton").hide();
            else
                $("#resetPassswordButton").show();
            $("#deleteServiceButton").show();
            $('#modalStaff').modal("show");
        })
    })
    $("#MobileNumber").keyup(function () {
        $("#MobileNumber").val(this.value.match(/[0-9]*/));
    });
    //#endregion

    //#region save
    $('#staffForm').validate({
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
                            return $("#Email").val();
                        },
                        UserId: function () {
                            return $("#UserID").val();
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
    Ladda.bind('#actionServiceButton', {
        callback: function (instance) {
            instance.start();
            if ($("#staffForm").valid()) {
                var entity = new Object();
                $("#staffForm").find("[ispropertiesmodel]").each(function () {
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
                entity.DialCode = $("#MobileNumber").intlTelInput("getSelectedCountryData").dialCode;
                entity.StartDate = $('#StartDate').data('daterangepicker').startDate._d;
                entity.EndDate = $('#EndDate').val() == "" ? null : $('#EndDate').data('daterangepicker').startDate.toDate();
                entity.AppointmentColor = $('[name="AppointmentColor"]:checked').attr("valuecolor");
                var userLocations = [];
                $("[name='locationIDStaff']").each(function () {
                    if (this.checked) {
                        userLocations.push({
                            LocationID: $(this).attr("locationID")
                        });
                    }
                });
                var serviceStaff = [];
                $("[name='serviceIDStaff']").each(function () {
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
                    isUpdate: $("#staffForm").find("[ispropertiesidmodel]").val() != 0,
                }), function (data) {
                    toastr["success"]("Data saved successfully.", "Notification");
                    $('#modalStaff').modal("hide");
                    setTimeout("table.ajax.reload()", 500);
                }, function () {
                    instance.stop();
                })
            } else
                instance.stop();
        }
    });
    $("#deleteServiceButton").click(function () {
        $.RequestAjax("/Staff/CheckDeleteStaffMember", JSON.stringify({
            id: $("#UserID").val(),
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
                                            id: $("#UserID").val(),
                                        },
                                        async: false,
                                        cache: false,
                                        success: function (data) {
                                            if (!JSON.parse(data.Result)) {
                                                if (parseInt(data.ErrorStyle) != 0) {
                                                    toastr["error"](data.ErrorMessage, "Error");
                                                } else {
                                                    toastr["error"](data.ErrorMessage, "Error");
                                                }
                                            }
                                            else {
                                                toastr["success"](data.ErrorMessage, "Notification");
                                                setTimeout("table.ajax.reload()", 500);
                                            }
                                            notice.close();
                                            $('#modalStaff').modal("hide");
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
    $("#resetPassswordButton").click(function () {
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
                                UserID: $("#UserID").val(),
                                Email: $("#Email").val(),
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
    //#endregion

})