var table;

$(function () {
    CreateBreadcrumb([{ href: "/Reports/Reports", title: "Reports" }])
    $("#searchDate").daterangepicker({
        startDate: moment().tz(Window.TimeZone).startOf('month'),
        endDate: moment().tz(Window.TimeZone),
        ranges: {
            'Today': [moment().tz(Window.TimeZone), moment().tz(Window.TimeZone)],
            'Yesterday': [moment().tz(Window.TimeZone).subtract(1, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')],
            'Last 7 Days': [moment().tz(Window.TimeZone).subtract(7, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')],
            'This month': [moment().tz(Window.TimeZone).startOf('month'), moment().tz(Window.TimeZone)],
            'Last 30 Days': [moment().tz(Window.TimeZone).subtract(30, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')],
            'All time': [moment('2018-01-01'), moment().tz(Window.TimeZone)]
        },
        locale: {
            "format": Window.FormatDateJS
        }
    });
    var loadTable = function () {
        table = $("#table").InStallDatatable({
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableClientList", [

       {
           "data": "ClientName", "name": "ClientName", "width": "15%", "class": "text-left"
       },
       {
           "data": "Appointments", "name": "Appointments", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return ($.number(data, 0, '.', ','));
           }
       },
       {
           "data": "NoShows", "name": "NoShows", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return ($.number(data, 0, '.', ','));
           }
       },
       {
           "data": "TotalSales", "name": "TotalSales", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
           }
       },
       {
           "data": "Outstanding", "name": "Outstanding", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
           }
       },
       {
           "data": "Gender", "name": "Gender", "class": "text-center", "width": "10%", "render": function (data, type, row) {
               return Window.ResourcesEnum[data];
           }
       },
       {
           "data": "CreateDate", "name": "CreateDate", "class": "text-left", "width": "15%", "render": function (data, type, row) {
               return moment(data).format(Window.FormatDateWithDayOfWeekJS);
           }
       },
       {
           "data": "LastAppointment", "name": "LastAppointment", "class": "text-left", "width": "10%", "render": function (data, type, row) {
               return data == null ? "" : moment(data).format(Window.FormatDateWithDayOfWeekJS);
           }
       },
       {
           "data": "LastLocation", "name": "LastLocation", "width": "15%", "class": "text-left"
       },

        ], true, false, false, false, null, true, null);
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file-excel-o"></i>  Excel',
            extend: 'excelHtml5',
            isAutoWidth: false,
            isSTT: false,
            sheetName: "Client List",
            title: null,
            filename: "Client List",
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
                var arrayColWidth = [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15];
                //debugger;
                rowPos = functions.AddRow(["ClientID", "First Name", "Last Name", "Appointments", "No Shows", "Total Sales", "Outstanding", "Gender", "Mobile Number", "Telephone", "Email", "Accepts Marketing", "Address", "Area", "City", "State", "PostCode", "Date of Birth", "Last Location", "Added", "Last Appointment", "Note", "Referral Source"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                $.each(table.rows().data(), function () {
                    var ClientID = this.ClientID;
                    var FirstName = this.FirstName;
                    var LastName = this.LastName;
                    var Appointments = this.Appointments;
                    var NoShows = this.NoShows;
                    var TotalSales = $.number(this.TotalSales, Window.NumberDecimal, '.', ',');
                    var Outstanding = $.number(this.Outstanding, Window.NumberDecimal, '.', ',');
                    var Gender = (Window.ResourcesEnum[this.Gender]);
                    var MobileNumberDialCode = this.MobileNumberDialCode;
                    var MobileNumber = this.MobileNumber;
                    var TelephoneDialCode = this.TelephoneDialCode;
                    var Telephone = this.Telephone;
                    var Email = this.Email;
                    var AcceptMarketingNotifications = this.AcceptMarketingNotifications == true ? "Yes" : "No";
                    var Address = this.Address;
                    var Suburb = this.Suburb;
                    var City = this.City;
                    var State = this.State;
                    var PostCode = this.PostCode;
                    var DateOfBirth = moment(this.DateOfBirth).format(Window.FormatDateJS);
                    var LastLocation = this.LastLocation;
                    var CreateDate = moment(this.CreateDate).format(Window.FormatDateWithDayOfWeekJS);
                    var LastAppointment = moment(this.LastAppointment).format(Window.FormatDateWithDayOfWeekJS);
                    var ClientNotes = this.ClientNotes;
                    var ReferralSourceName = this.ReferralSourceName;

                    rowPos = functions.AddRow([ClientID, FirstName, LastName, Appointments, NoShows, TotalSales, Outstanding, Gender, "+" + MobileNumberDialCode + MobileNumber, "+" + TelephoneDialCode + Telephone, Email, AcceptMarketingNotifications, Address, Suburb, City, State, PostCode, DateOfBirth, LastLocation, CreateDate, LastAppointment, ClientNotes, ReferralSourceName], rowPos);
                })

                //  Set column widths
                var cols = functions.CreateCellPos(rels, 'cols');
                $('worksheet', rels).prepend(cols);
                for (var i = 0, ien = 23 ; i < ien ; i++) {
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
            text: '<i class="fa fa-file"></i>  CSV',
            filename: "Client List",
            customize: function (output, config) {

                output = 'ClientID, First Name, Last Name, Appointments, No Shows, Total Sales, Outstanding, Gender, Mobile Number, Telephone, Email, Accepts Marketing, Address, Area, City, State, PostCode, Date of Birth, Last Location, Added, Last Appointment, Note, Referral Source\n';
                $.each(table.rows().data(), function () {
                    var ClientID = this.ClientID;
                    var FirstName = this.FirstName;
                    var LastName = this.LastName;
                    var Appointments = this.Appointments;
                    var NoShows = this.NoShows;
                    var TotalSales = $.number(this.TotalSales, Window.NumberDecimal, '.', ',');
                    var Outstanding = $.number(this.Outstanding, Window.NumberDecimal, '.', ',');
                    var Gender = (Window.ResourcesEnum[this.Gender]);
                    var MobileNumberDialCode = this.MobileNumberDialCode;
                    var MobileNumber = this.MobileNumber;
                    var TelephoneDialCode = this.TelephoneDialCode;
                    var Telephone = this.Telephone;
                    var Email = this.Email;
                    var AcceptMarketingNotifications = this.AcceptMarketingNotifications == true ? "Yes" : "No";
                    var Address = this.Address;
                    var Suburb = this.Suburb;
                    var City = this.City;
                    var State = this.State;
                    var PostCode = this.PostCode;
                    var DateOfBirth = moment(this.DateOfBirth).format(Window.FormatDateJS);
                    var LastLocation = this.LastLocation;
                    var CreateDate = moment(this.CreateDate).format(Window.FormatDateWithDayOfWeekJS);
                    var LastAppointment = moment(this.LastAppointment).format(Window.FormatDateWithDayOfWeekJS);
                    var ClientNotes = this.ClientNotes;
                    var ReferralSourceName = this.ReferralSourceName;

                    output += '"' + ClientID + '",'
                            + '"' + FirstName + '",'
                            + '"' + LastName + '",'
                            + '"' + Appointments + '",'
                            + '"' + NoShows + '",'
                            + '"' + TotalSales + '",'
                            + '"' + Outstanding + '",'
                            + '"' + Gender + '",'
                            + '"' + MobileNumberDialCode + MobileNumber + '",'
                            + '"' + TelephoneDialCode + Telephone + '",'
                            + '"' + Email + '",'
                            + '"' + AcceptMarketingNotifications + '",'
                            + '"' + Address + '",'
                            + '"' + Suburb + '",'
                            + '"' + City + '",'
                            + '"' + State + '",'
                            + '"' + PostCode + '",'
                            + '"' + DateOfBirth + '",'
                            + '"' + LastLocation + '",'
                            + '"' + CreateDate + '",'
                            + '"' + LastAppointment + '",'
                            + '"' + ClientNotes + '",'
                            + '"' + ReferralSourceName + '"\n';
                })
                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCSV');
    }

    var loaddata = function () {
        if ($.fn.DataTable.isDataTable('#table'))
            table.destroy();
        loadTable();

        var text2 = "";
        text2 += $("#formReport #searchDate").data('daterangepicker').startDate.format(Window.FormatDateWithDayOfWeekJS)
        text2 += " to " + $("#formReport #searchDate").data('daterangepicker').endDate.format(Window.FormatDateWithDayOfWeekJS)
        text2 = text2 + ", generated " + moment().tz(Window.TimeZone).format(Window.FormatDateWithDayOfWeekJS) + " at " + moment().tz(Window.TimeZone).format(Window.FormatTimeJS);
        $("#txtfilter").text(text2);
    }
    loaddata();
    $("#formReport #btnView").click(function () {
        loaddata();
    })
})