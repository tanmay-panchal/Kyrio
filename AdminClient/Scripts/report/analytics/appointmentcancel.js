var table1;
var table2;
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
    $("#formReport #LocationID").InStallSelect2('/Home/LoadSelect2ForLocation', 100, 'All Location', null, null, null, null, null, null, null, false);
    $("#formReport #StaffID").InStallSelect2('/Home/LoadSelect2ForUser', 100, 'All Staff', null, null, null, null, null, null, null, false);
    var loadTable1 = function () {
        table1 = $("#table1").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "ByType": "summary",
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableReasonCancel", [
       {
           "data": "ReasonCancel", "name": "ReasonCancel", "width": "30%", "class": "text-left"
       },
       {
           "data": "Appointments", "name": "Appointments", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return ($.number(data, "", '.', ','));
           }
       },
        ], true, false, false, false, null, true, null);
    }
    var loadTable2 = function () {
        table2 = $("#table2").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "ByType": "detail",
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableAppointmentCancel",[
       {
           "data": "RefNo", "name": "RefNo", "width": "10%", "class": "text-left"
       },
       {
            "data": "ClientName", "name": "ClientName", "width": "12%", "class": "text-left"
       },
       {
           "data": "ServiceName", "name": "ServiceName", "width": "10%", "class": "text-left"
       },
       {
            "data": "ScheduledDate", "name": "ScheduledDate", "class": "text-right", "width": "15%", "render": function (data, type, row) {
                return moment(data).format(Window.FormatDateWithDayOfWeekJS);
       }
       },
       {
            "data": "DatetimeCancel", "name": "DatetimeCancel", "class": "text-right", "width": "15%", "render": function (data, type, row) {
                return moment(data).format(Window.FormatDateWithDayOfWeekJS);
       }
       },
       {
            "data": "CancelBy", "name": "CancelBy", "width": "13%", "class": "text-left"
       },
       {
           "data": "ReasonCancel", "name": "ReasonCancel", "width": "10%", "class": "text-left"
       },
       {
           "data": "Price", "name": "Price", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
           }
       },
        ], true, false, false, false, null, true, null);
        table2.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file-excel-o"></i>  Excel',
            extend: 'excelHtml5',
            isAutoWidth: false,
            isSTT: false,
            sheetName: "Appointments Cancellations",
            title: null,
            filename: "Appointments Cancellations",
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
                var arrayColWidth = [15, 15, 15, 15, 15, 15, 15, 15];

                //Reason
                rowPos = functions.AddRow(["Reason", "Appointments"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                $.each(table1.rows().data(), function () {
                    var ReasonCancel = this.ReasonCancel;
                    var Appointments = $.number(this.Appointments, '', '.', ',');
                    rowPos = functions.AddRow([ReasonCancel, Appointments], rowPos);
                })
                rowPos = functions.AddRow([]);

                //Appointments cancellations
                rowPos = functions.AddRow(["Appointments by Cancellations"], rowPos);
                functions.MergeCells(rowPos, 2, 58);
                rowPos = functions.AddRow(["Ref#", "Client", "Service", "Scheduled date", "Cancelled date", "Cancelled by", "Reason", "Price"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                $.each(table2.rows().data(), function () {
                    var RefNo = this.RefNo;
                    var ClientName = this.ClientName;
                    var ServiceName = this.ServiceName;
                    var ScheduledDate = moment(this.ScheduledDate).format(Window.FormatDateJS);
                    var DatetimeCancel = moment(this.DatetimeCancel).format(Window.FormatDateWithTimeJS);
                    var CancelBy = this.CancelBy;
                    var ReasonCancel = this.ReasonCancel;
                    var Price = $.number(this.Price, Window.NumberDecimal, '.', ',');
                    rowPos = functions.AddRow([RefNo,ClientName,ServiceName,ScheduledDate,DatetimeCancel,CancelBy,ReasonCancel,Price], rowPos);
                })

                //  Set column widths
                var cols = functions.CreateCellPos(rels, 'cols');
                $('worksheet', rels).prepend(cols);
                for (var i = 0, ien = 8 ; i < ien ; i++) {
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
        table2.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i>  CSV',
            filename: "Appointments Cancellations",
            customize: function (output, config) {
                output = '\n';
                output += 'Reason, Appointments\n';
                $.each(table1.rows().data(), function () {
                    var ReasonCancel = this.ReasonCancel;
                    var Appointments = $.number(this.Appointments, '', '.', ',');

                    output += '"' + ReasonCancel + '",'
                            + '"' + Appointments + '"\n';
            })

                output += 'Appointment Cancellations\n';
                output += 'Ref#, Client, Service, Scheduled date, Cancelled date, Cancelled by, Reason, Price\n';
                $.each(table2.rows().data(), function () {
                    var RefNo = this.RefNo;
                    var ClientName = this.ClientName;
                    var ServiceName = this.ServiceName;
                    var ScheduledDate = moment(this.ScheduledDate).format(Window.FormatDateJS);
                    var DatetimeCancel = moment(this.DatetimeCancel).format(Window.FormatDateWithTimeJS);
                    var CancelBy = this.CancelBy;
                    var ReasonCancel = this.ReasonCancel;
                    var Price = $.number(this.Price, Window.NumberDecimal, '.', ',');

                    output += '"' + RefNo + '",'
                            + '"' + ClientName + '",'
                            + '"' + ServiceName + '",'
                            + '"' + ScheduledDate + '",'
                            + '"' + DatetimeCancel + '",'
                            + '"' + CancelBy + '",'
                            + '"' + ReasonCancel + '",'
                            + '"' + Price + '"\n';
                })
                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCSV');
    }
    var loaddata = function () {
        if ($.fn.DataTable.isDataTable('#table1'))
            table1.destroy();
        if ($.fn.DataTable.isDataTable('#table2'))
            table2.destroy();
        loadTable1();
        loadTable2();

        var text2 = "";
        text2 += $("#formReport #searchDate").data('daterangepicker').startDate.format(Window.FormatDateWithDayOfWeekJS)
        text2 += " to " + $("#formReport #searchDate").data('daterangepicker').endDate.format(Window.FormatDateWithDayOfWeekJS)
        var StaffID = $("#formReport #StaffID").val();
        if (StaffID == null || StaffID == "" || StaffID == "0") {
            text2 += ", all staff";
        }
        else {
            text2 += ", " + $("#formReport #StaffID").text();
        }

        var locationid = $("#formReport #LocationID").val();
        if (locationid == null || locationid == "" || locationid == "0") {
            text2 += ", all locations";
        }
        else {
            text2 += ", " + $("#formReport #LocationID").text();
        }

        text2 = text2 + ", generated " + moment().tz(Window.TimeZone).format(Window.FormatDateWithDayOfWeekJS) + " at " + moment().tz(Window.TimeZone).format(Window.FormatTimeJS);
        $("#txtfilter").text(text2);
    }
    loaddata();
    $("#formReport #btnView").click(function () {
        loaddata();
    })
})