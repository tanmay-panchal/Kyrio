var table1;
var table2;
var sumCols = {};
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
    $("#formReport #LocationID").InStallSelect2('/Home/LoadSelect2ForLocation', 100, 'All Location', null, null, null, null, null, null, null, false);
    $("#formReport #StaffID").InStallSelect2('/Home/LoadSelect2ForUser', 100, 'All Staff', null, null, null, null, null, null, null, false);
    var loadTable1 = function () {
        table1 = $("#table1").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "ByType": "staff",
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableAppointmentsSummary", [
       {
           "data": "Name", "name": "Name", "width": "30%", "class": "text-left"
       },
       {
           "data": "Appointments", "name": "Appointments", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return ($.number(data, "", '.', ','));
           }
       },
        {
            "data": "TotalValue", "name": "TotalValue", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
            }
        },
        ], true, false, false, false, null, true, null, function (setting) {
            var api = this.api();
            if (api.rows().data().count() > 0) {
                var length = api.columns()[0].length;
                var html = "<tr><td class='text-center'><strong>Total</strong></td>";
                for (i = 1; i < length; ++i) {
                    var sum = this.api().column(i).data().sum();
                    sumCols[i] = sum;
                    if (i == 1) {
                        html += "<td class='text-right'><strong>" + ($.number(sum, 0, '.', ',')) + "</strong></td>";
                    }
                    else {
                        html += "<td class='text-right'><strong>" + Window.CurrencySymbol + ($.number(sum, Window.NumberDecimal, '.', ',')) + "</strong></td>";
                    }
                }
                html += "</tr>";
                $(html).insertAfter($(this[0]).find("tr:last"));

            }
        });
    }
    var loadTable2 = function () {
        table2 = $("#table2").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "ByType": "service",
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableAppointmentsSummary", [
       {
           "data": "Name", "name": "Name", "width": "30%", "class": "text-left"
       },
       {
           "data": "Appointments", "name": "Appointments", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return ($.number(data, "", '.', ','));
           }
       },
       {
           "data": "TotalValue", "name": "TotalValue", "class": "text-right", "width": "10%", "render": function (data, type, row) {
               return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
           }
       },
        ], true, false, false, false, null, true, null, function (setting) {
            var api = this.api();
            if (api.rows().data().count() > 0) {
                var length = api.columns()[0].length;
                var html = "<tr><td class='text-center'><strong>Total</strong></td>";
                for (i = 1; i < length; ++i) {
                    var sum = this.api().column(i).data().sum();
                    sumCols[i] = sum;
                    if (i == 1) {
                        html += "<td class='text-right'><strong>" + ($.number(sum, 0, '.', ',')) + "</strong></td>";
                    }
                    else {
                        html += "<td class='text-right'><strong>" + Window.CurrencySymbol + ($.number(sum, Window.NumberDecimal, '.', ',')) + "</strong></td>";
                    }
                }
                html += "</tr>";
                $(html).insertAfter($(this[0]).find("tr:last"));
            }
        });
        table2.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file-excel-o"></i>  Excel',
            extend: 'excelHtml5',
            isAutoWidth: false,
            isSTT: false,
            sheetName: "Appointments Summary",
            title: null,
            filename: "Appointments Summary",
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
                var arrayColWidth = [15, 15, 15];

                //Appointments by Staff
                rowPos = functions.AddRow(["Appointments by Staff"], rowPos);
                functions.MergeCells(rowPos, 2, 58);
                rowPos = functions.AddRow(["Staff Member", "Appointments", "Total Value"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                var sAppointments = 0;
                var sTotalValue = 0;
                $.each(table1.rows().data(), function () {
                    var Name = this.Name;
                    var Appointments = $.number(this.Appointments, '', '.', ',');
                    var TotalValue = $.number(this.TotalValue, Window.NumberDecimal, '.', ',');

                    sAppointments = sAppointments + parseInt(this.Appointments);
                    sTotalValue = sTotalValue + parseFloat(this.TotalValue);
                    rowPos = functions.AddRow([Name, Appointments, TotalValue], rowPos);
                })
                rowPos = functions.AddRow(["Total", sAppointments, sTotalValue], rowPos);
                rowPos = functions.AddRow([]);

                //Appointments by Services
                rowPos = functions.AddRow(["Appointments by Services"], rowPos);
                functions.MergeCells(rowPos, 2, 58);
                rowPos = functions.AddRow(["Service Name", "Appointments", "Total Value"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                var sAppointments = 0;
                var sTotalValue = 0;
                $.each(table2.rows().data(), function () {
                    var Name = this.Name;
                    var Appointments = $.number(this.Appointments, '', '.', ',');
                    var TotalValue = $.number(this.TotalValue, Window.NumberDecimal, '.', ',');

                    sAppointments = sAppointments + parseInt(this.Appointments);
                    sTotalValue = sTotalValue + parseFloat(this.TotalValue);
                    rowPos = functions.AddRow([Name, Appointments, TotalValue], rowPos);
                })
                rowPos = functions.AddRow(["Total", sAppointments, sTotalValue], rowPos);
                rowPos = functions.AddRow([]);

                //  Set column widths
                var cols = functions.CreateCellPos(rels, 'cols');
                $('worksheet', rels).prepend(cols);
                for (var i = 0, ien = 3 ; i < ien ; i++) {
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
            filename: "Appointment Summary",
            customize: function (output, config) {
                output = 'Appointment by Staff\n';
                output += 'Staff Member, Appointments ,Total Value\n';
                var sAppointments = 0;
                var sTotalValue = 0;
                $.each(table1.rows().data(), function () {
                    var Name = this.Name;
                    var Appointments = $.number(this.Appointments, 0, '.', ',');
                    var TotalValue = $.number(this.TotalValue, Window.NumberDecimal, '.', ',');

                    sAppointments = sAppointments + parseInt(this.Appointments);
                    sTotalValue = sTotalValue + parseFloat(this.TotalValue);

                    output += '"' + Name + '",'
                            + '"' + Appointments + '",'
                            + '"' + TotalValue + '"\n';
                })
                output += '"' + "Total" + '",'
                     + '"' + sAppointments + '",'
                     + '"' + sTotalValue + '"\n';

                output += 'Discount by service\n';
                output += 'Service Name, Appointments ,Total Value\n';
                var sAppointments = 0;
                var sTotalValue = 0;
                $.each(table2.rows().data(), function () {
                    var Name = this.Name;
                    var Appointments = $.number(this.Appointments, 0, '.', ',');
                    var TotalValue = $.number(this.TotalValue, Window.NumberDecimal, '.', ',');

                    sAppointments = sAppointments + parseInt(this.Appointments);
                    sTotalValue = sTotalValue + parseFloat(this.TotalValue);

                    output += '"' + Name + '",'
                            + '"' + Appointments + '",'
                            + '"' + TotalValue + '"\n';
                })
                output += '"' + "Total" + '",'
                        + '"' + sAppointments + '",'
                        + '"' + sTotalValue + '"\n';
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