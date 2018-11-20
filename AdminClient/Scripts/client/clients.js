var table;
var NotYear = true;
$(function () {
    //#region Load data && setup control
    CreateBreadcrumb([{ href: "/Clients/Index", title: "Clients" }]);

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
    $("#DateOfBirth").prop("formatdate", Window.FormatDateJS)
    $("#DateOfBirth").daterangepicker({
        "singleDatePicker": true,
        "timePicker": false,
        "changeYear": false,
        "locale": {
            "format": "DD/MM"
        }
    });

    table = $("#table").InStallDatatable(null, "/Clients/GetDataTable", [
         {
             "data": null, "name": null, "width": "5%", "render": function (data, type, row) {
                 return '<div class = "src-components-Avatar-CustomerAvatar__self__2FiXk"><div class="src-components-Avatar-CustomerAvatar__alphaNumPlaceholder__1qweJ">' + row.FirstName.charAt(0) + '</div></div>';
             }
         },
         {
             "data": "FirstName", "name": "FirstName", "width": "55%", "class": "text-left", "render": function (data, type, row) {
                 return (row.FirstName != null ? row.FirstName + " " : "") + (row.LastName != null ? row.LastName + "" : "");
             }
         },
         {
             "data": "MobileNumber", "name": "MobileNumber", "width": "15%", "class": "text-left", "render": function (data, type, row) {
                 return row.MobileNumber == null ? '' : (row.MobileNumberDialCode == null ? '' : ('+' + row.MobileNumberDialCode + ' ')) + (row.MobileNumber != null ? row.MobileNumber : "");
             }
         },
         { "data": "Email", "name": "Email", "width": "15%", "class": "text-left" },
         {
             "data": "Gender", "name": "Gender", "width": "10%", "class": "text-left", "render": function (data, type, row) {
                 return data != "gender_unknown" ? (Window.ResourcesEnum[row.Gender]) : "";
             }
         },
    ], true, true, true, false, 1, true, null, null, null, {
        language: {
            search: "",
            searchPlaceholder: "Search by name, e-mail or mobile number"
        }
    });
    table.CreateButtonExportExcel({
        className: 'btn-block',
        text: '<i class="fa fa-file-excel-o"></i>  Download Excel',
        extend: 'excelHtml5',
        isAutoWidth: false,
        isSTT: false,
        sheetName: "Clients",
        title: null,
        filename: "Clients",
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
            var arrayColWidth = [10, 15, 15, 10, 10, 15, 15, 15, 15, 15, 20, 25, 25, 25, 25, 15, 15, 15, 15, 15, 15, 25];

            //#region fill data header
            rowPos = functions.AddRow(["Client ID", "First Name", "Last Name", "Appointments", "No Shows", "Total Sales", "Outstanding", "Gender", "Mobile Number", "Telephone", "Email", "Accepts Marketing", "Address", "Area", "City", "State", "Post Code", "Date of Birth", "Last Location", "Added", "Last Appointment", "Note"], rowPos);
            functions.MergeCells(rowPos, 0, 73);
            //#endregion

            //#region fill data to excel

            $.RequestAjax("/Clients/GetAll", null, function (data) {
                if (data.data.length == 0) {
                }
                else {
                    $.each(data.data, function () {
                        var clientid = this.ClientID;
                        var firstName = this.FirstName;
                        var LastName = this.LastName == null ? '' : this.LastName;
                        var Appointments = this.Appointments;
                        var NoShows = this.NoShows;
                        var TotalSales = $.number(this.TotalSales, Window.NumberDecimal, '.', ',');
                        var Outstanding = $.number(this.Outstanding, Window.NumberDecimal, '.', ',');
                        var Gender = Window.ResourcesEnum[this.Gender];
                        var MobileNumber = (this.MobileNumberDialCode == null ? '' : this.MobileNumberDialCode) + ' ' + (this.MobileNumber == null ? '' : this.MobileNumber) + ' ';
                        var Telephone = (this.TelephoneDialCode == null ? '' : this.TelephoneDialCode) + ' ' + (this.Telephone == null ? '' : this.Telephone) + ' ';
                        var Email = this.Email == null ? '' : this.Email;
                        var AcceptMarketingNotifications = this.AcceptMarketingNotifications == true ? "Yes" : "No";
                        var Address = this.Address == null ? '' : this.Address;
                        var Area = this.Suburb == null ? '' : this.Suburb;
                        var City = this.City == null ? '' : this.City;
                        var State = this.State == null ? '' : this.State;
                        var PostCode = this.PostCode == null ? '' : this.PostCode;
                        var DateOfBirth = this.DateOfBirth == null ? "" : (moment(this.DateOfBirth).year() == 1900 ? moment(this.DateOfBirth).format(Window.FormatDayAndMonthNameJS) : moment(this.DateOfBirth).format(Window.FormatDateJS));
                        var LastLocation = this.LastLocation == null ? '' : this.LastLocation;
                        var Added = moment(this.CreateDate).format(Window.FormatDateJS);
                        var LastAppointment = this.LastAppointment == null ? "" : moment(this.LastAppointment).format(Window.FormatDateJS);
                        var ClientNotes = this.ClientNotes == null ? '' : this.ClientNotes;

                        rowPos = functions.AddRow([clientid, firstName, LastName, Appointments, NoShows, TotalSales, Outstanding, Gender, MobileNumber, Telephone, Email,
                        AcceptMarketingNotifications, Address, Area, City, State, PostCode, DateOfBirth, LastLocation, Added, LastAppointment, ClientNotes], rowPos);
                    })
                }
            }, function () {
            })
            //#endregion

            // Set column widths
            var cols = functions.CreateCellPos(rels, 'cols');
            $('worksheet', rels).prepend(cols);

            for (var i = 0, ien = 22 ; i < ien ; i++) {
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
        filename: "Clients",
        customize: function (output, config) {
            output = 'Client ID, First Name, Last Name, Appointments, No Shows, Total Sales, Outstanding, Gender, Mobile Number, Telephone, Email, Accepts Marketing, Address, Area, City, State, Post Code, Date of Birth, Last Location, Added, Last Appointment, Note\n';

            $.RequestAjax("/Clients/GetAll", null, function (data) {
                if (data.data.length == 0) {
                }
                else {
                    $.each(data.data, function () {
                        var clientid = this.ClientID;
                        var firstName = this.FirstName;
                        var LastName = this.LastName == null ? '' : this.LastName;
                        var Appointments = this.Appointments;
                        var NoShows = this.NoShows;
                        var TotalSales = $.number(this.TotalSales, Window.NumberDecimal, '.', ',');
                        var Outstanding = $.number(this.Outstanding, Window.NumberDecimal, '.', ',');
                        var Gender = Window.ResourcesEnum[this.Gender];
                        var MobileNumber = (this.MobileNumberDialCode == null ? '' : this.MobileNumberDialCode) + ' ' + (this.MobileNumber == null ? '' : this.MobileNumber) + ' ';
                        var Telephone = (this.TelephoneDialCode == null ? '' : this.TelephoneDialCode) + ' ' + (this.Telephone == null ? '' : this.Telephone) + ' ';
                        var Email = this.Email == null ? '' : this.Email;
                        var AcceptMarketingNotifications = this.AcceptMarketingNotifications == true ? "Yes" : "No";
                        var Address = this.Address == null ? '' : this.Address;
                        var Area = this.Suburb == null ? '' : this.Suburb;
                        var City = this.City == null ? '' : this.City;
                        var State = this.State == null ? '' : this.State;
                        var PostCode = this.PostCode == null ? '' : this.PostCode;
                        var DateOfBirth = this.DateOfBirth == null ? "" : (moment(this.DateOfBirth).year() == 1900 ? moment(this.DateOfBirth).format(Window.FormatDayAndMonthNameJS) : moment(this.DateOfBirth).format(Window.FormatDateJS));
                        var LastLocation = this.LastLocation == null ? '' : this.LastLocation;
                        var Added = moment(this.CreateDate).format(Window.FormatDateJS);
                        var LastAppointment = this.LastAppointment == null ? "" : moment(this.LastAppointment).format(Window.FormatDateJS);
                        var ClientNotes = this.ClientNotes == null ? '' : this.ClientNotes;

                        output += '"' + clientid + '",'
                        + '"' + firstName + '",'
                        + '"' + LastName + '",'
                        + '"' + Appointments + '",'
                        + '"' + NoShows + '",'
                        + '"' + TotalSales + '",'
                        + '"' + Outstanding + '",'
                        + '"' + Gender + '",'
                        + '"' + MobileNumber + '",'
                        + '"' + Telephone + '",'
                        + '"' + Email + '",'
                        + '"' + AcceptMarketingNotifications + '",'
                        + '"' + Address + '",'
                        + '"' + Area + '",'
                        + '"' + City + '",'
                        + '"' + State + '",'
                        + '"' + PostCode + '",'
                        + '"' + DateOfBirth + '",'
                        + '"' + LastLocation + '",'
                        + '"' + Added + '",'
                        + '"' + LastAppointment + '",'
                        + '"' + ClientNotes + '"\n';
                    })
                }
            }, function () {
            })
            return output;
        },
        extend: 'csvHtml5',
    }, '#buttonCVX');

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
    $("#containtButtonCreate").InStallButtonFooter("buttonCreate", "tittleButton", "New Client");
    $("#actionForm #ReferralSource").InStallSelect2('/Home/LoadSelect2ForReferralSource', 20, 'Referral Source', null);
    //#endregion

    //#region event 
    $(document).on("click", "#table tbody tr td", function () {
        var data = table.row($(this).closest("tr")).data();
        window.location = "/Clients/Clients?id=" + data.ClientID.toString();
    })
    $("#containtButtonCreate").click(function () {
        $("#TitleModal").text("New Client");
        $("#ClientID").val(0);
        $("#FirstName").val("");
        $("#LastName").val("");
        $("#MobileNumber").val("");
        $("#Telephone").val("");
        $("#Email").val("");
        $("#AppointmentNotificationType").val("marketing_both").change();
        $("#AcceptMarketingNotifications").iCheck('check');

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
    })
    $("#btnDownloadImportClient").click(function () {
        $('#actionModalImport').modal("show");
    })
    Ladda.bind('#actionButton', {
        callback: function (instance) {
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
                    setTimeout("table.ajax.reload()", 500);
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
    $("#MobileNumber").keyup(function () {
        $("#MobileNumber").val(this.value.match(/[0-9]*/));
    });
    $("#Telephone").keyup(function () {
        $("#Telephone").val(this.value.match(/[0-9]*/));
    });
    //#endregion
})