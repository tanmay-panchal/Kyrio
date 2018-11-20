//#region Method Support
//#endregion
var table1;
$(function () {
    //#region Load data && setup control
    $("#searchDate").daterangepicker({
        startDate: moment().tz(Window.TimeZone).startOf('month'),
        endDate: moment().tz(Window.TimeZone),
        ranges: {
            'Today': [moment().tz(Window.TimeZone), moment().tz(Window.TimeZone)],
            'Yesterday': [moment().tz(Window.TimeZone).subtract(1, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')],
            'Last 7 Days': [moment().tz(Window.TimeZone).subtract(7, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')],
            'This month': [moment().tz(Window.TimeZone).startOf('month'), moment().tz(Window.TimeZone)],
            'Last 30 Days': [moment().tz(Window.TimeZone).subtract(30, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')],
            'Tomorrow': [moment().tz(Window.TimeZone).add(1, 'days'), moment().tz(Window.TimeZone).add(1, 'days')],
            'Next 7 Days': [moment().tz(Window.TimeZone).add(1, 'days'), moment().tz(Window.TimeZone).add(7, 'days')],
            'Next Month': [moment().tz(Window.TimeZone).add(1, 'month').startOf('month'), moment().tz(Window.TimeZone).add(1, 'month').endOf('month')],
            'Next 30 Days': [moment().tz(Window.TimeZone).add(1, 'days'), moment().tz(Window.TimeZone).add(30, 'days')],
            'All time': [moment('2018-01-01'), moment().tz(Window.TimeZone)]
        },
        locale: {
            "format": Window.FormatDateJS
        }
    });
    $("#formAppointments #LocationID").InStallSelect2('/Home/LoadSelect2ForLocation', 100, 'All Location', null, null, null, null, null, null, null, false);
    $("#formAppointments #StaffID").InStallSelect2('/Home/LoadSelect2ForUser', 100, 'All Staff', null, null, null, null, null, null, null, false);
    var loadTable1 = function () {
        table1 = $("#table1").InStallDatatable({
            "LocationID": $("#formAppointments #LocationID").val(),
            "StaffID": $("#formAppointments #StaffID").val(),
            "fromdate": $("#formAppointments #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formAppointments #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableAppointments", [
     {
         "data": "RefNo", "name": "RefNo", "width": "10%", "class": "text-left"
     },
     {
         "data": "ClientName", "name": "ClientName", "width": "10%", "class": "text-left"
     },
     {
         "data": "ServiceName", "name": "ServiceName", "width": "10%", "class": "text-left"
     },
     {
         "data": "ScheduledDateString", "name": "ScheduledDateString", "class": "text-left", "width": "10%", "render": function (data, type, row) {
             return moment(data).format(Window.FormatDateWithDayOfWeekJS);
         }
     },
     {
         "data": "StartTimeString", "name": "StartTimeString", "width": "10%", "class": "text-left", "width": "10%", "render": function (data, type, row) {
             return moment(data).format(Window.FormatTimeJS);
         }
     },
     {
         "data": "Duration", "name": "Duration", "width": "10%", "class": "text-left", "width": "10%", "render": function (data, type, row) {
             return (parseInt(data / 3600) <= 0 ? "" : (parseInt(data / 3600) + "h")) + " " + ((data % 3600) / 60 == 0 ? "" : ((data % 3600) / 60 + "min"));
         }
     },
     {
         "data": "LocationName", "name": "LocationName", "width": "10%", "class": "text-left"
     },
     {
         "data": "StaffName", "name": "StaffName", "width": "10%", "class": "text-left"
     },
     {
         "data": "Price", "name": "Price", "width": "10%", "class": "text-right", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
         }
     },
     {
         "data": "Status", "name": "Status", "width": "10%", "class": "text-left", "render": function (data, type, row) {
             return '<span class="badge" style="width:70px;background-color: ' + Window.StatusScheul.find(n=>n.Status == data).Color + '">' + data.toUpperCase() + '</span>';
         }
     },
        ], true, true, true, false, null, true, null, null, null, {
            language: {
                search: "",
                searchPlaceholder: "Reference or Client",
                "info": "Displaying _START_ - _END_ of _TOTAL_ total bookings",
                "infoEmpty": "",
            }
        });

        table1.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file-excel-o"></i>  Excel',
            extend: 'excelHtml5',
            isAutoWidth: false,
            isSTT: false,
            sheetName: "Appointments List Report",
            title: null,
            filename: "Appointments List Report",
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
                var arrayColWidth = [15, 15, 15, 20, 10, 10, 20, 20, 10, 10];
                //#region fill data header
                rowPos = functions.AddRow(["REF #", "CLIENT", "SERVICE", "DATE", "TIME", "DURATION", "LOCATION", "STAFF", "PRICE", "STATUS"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion

                //#region fill data to excel
                $.each(table1.rows().data(), function () {
                    var RefNo = this.RefNo;
                    var ClientName = this.ClientName;
                    var ServiceName = this.ServiceName;
                    var ScheduledDate = moment(this.ScheduledDate).format(Window.FormatDateWithDayOfWeekJS);
                    var StartTime = moment(this.StartTime).format(Window.FormatTimeJS);
                    var Duration = this.Duration / 60;
                    var LocationName = this.LocationName;
                    var StaffName = this.StaffName;
                    var Price = $.number(this.Price, Window.NumberDecimal, '.', ',');
                    var Status = this.Status;

                    rowPos = functions.AddRow([RefNo, ClientName, ServiceName, ScheduledDate, StartTime, Duration, LocationName, StaffName, Price, Status], rowPos);
                })

                //#endregion

                // Set column widths
                var cols = functions.CreateCellPos(rels, 'cols');
                $('worksheet', rels).prepend(cols);

                for (var i = 0, ien = 10 ; i < ien ; i++) {
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
        table1.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i>  CSV',
            filename: "Appointments List Report",
            customize: function (output, config) {
                output = 'REF #, CLIENT, SERVICE, DATE, TIME, DURATION, LOCATION, STAFF, PRICE, STATUS\n';
                $.each(table1.rows().data(), function () {
                    var RefNo = this.RefNo;
                    var ClientName = this.ClientName;
                    var ServiceName = this.ServiceName;
                    var ScheduledDate = moment(this.ScheduledDate).format(Window.FormatDateWithDayOfWeekJS);
                    var StartTime = moment(this.StartTime).format(Window.FormatTimeJS);
                    var Duration = this.Duration / 60;
                    var LocationName = this.LocationName;
                    var StaffName = this.StaffName == null ? "" : this.StaffName;
                    var Price = $.number(this.Price, Window.NumberDecimal, '.', ',');
                    var Status = this.Status;

                    output += '"' + RefNo + '",'
                            + '"' + ClientName + '",'
                            + '"' + ServiceName + '",'
                            + '"' + ScheduledDate + '",'
                            + '"' + StartTime + '",'
                            + '"' + Duration + '",'
                            + '"' + LocationName + '",'
                            + '"' + StaffName + '",'
                            + '"' + Price + '",'
                            + '"' + Status + '"\n';
                })

                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCSV');
        table1.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i> PDF',
            title: "Appointments List Report",
            filename: "Appointments List Report",
            extend: 'pdfHtml5',
            download: "open",
            width: ["auto", "*", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
        }, '#buttonPDF');
    }

    var loaddata = function () {
        if ($.fn.DataTable.isDataTable('#table1'))
            table1.destroy();

        loadTable1();
        //Sunday, 1 Jul 2018 to Wednesday, 25 Jul 2018, all staff, all locations, generated Wednesday, 25 Jul 2018 at 23:06

        var text2 = "";
        text2 += $("#formAppointments #searchDate").data('daterangepicker').startDate.format(Window.FormatDateWithDayOfWeekJS)
        text2 += " to " + $("#formAppointments #searchDate").data('daterangepicker').endDate.format(Window.FormatDateWithDayOfWeekJS)
        var StaffID = $("#formAppointments #StaffID").val();
        if (StaffID == null) {
            text2 += ", all staff";
        }
        else {
            if (locationid != 0) {
                text2 += ", " + $("#formAppointments #StaffID").text();
            }
            else {
                text2 += ", all staff";
            }
        }

        var locationid = $("#formAppointments #LocationID").val();
        if (locationid == null) {
            text2 += ", all locations";
        }
        else {
            if (locationid != 0) {
                text2 += ", " + $("#formAppointments #LocationID").text();
            }
            else {
                text2 += ", all locations";
            }
        }

        text2 = text2 + ", generated " + moment().tz(Window.TimeZone).format(Window.FormatDateWithDayOfWeekJS) + " at " + moment().tz(Window.TimeZone).format(Window.FormatTimeJS);
        $("#formAppointments #txtfilter").text(text2);
    }
    loaddata();
    //#endregion

    //#region Event
    $("#formAppointments #btnView").click(function () {
        loaddata();
    })
    $(document).on("click", "#table1 tbody tr td", function () {
        if (table1 != null) {
            var data = table1.row($(this).closest("tr")).data();
            $.CallViewAppointment(data.AppointmentID);
        }
    })
    //#endregion
})