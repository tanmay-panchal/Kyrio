var modeDatepicker = 0;
var dateDatepicker;
var perdown = '<span class="_2FSeuB _240vE8 _39J3xg _25R4LF _1-NWLc"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 292.36 164.46"><path d="M286.93 5.43A17.55 17.55 0 0 0 274.09.05H18.27A17.56 17.56 0 0 0 5.42 5.43a17.93 17.93 0 0 0 0 25.7l127.91 127.92a17.92 17.92 0 0 0 25.7 0l127.9-127.93a17.92 17.92 0 0 0 0-25.7z"></path></svg></span>';
var perup = '<span class="_2FSeuB _240vE8 _1nF21g _25R4LF _1-NWLc"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 292.36 164.46"><path d="M292.36,210.14a17.57,17.57,0,0,0-5.43-12.85L159,69.38a17.92,17.92,0,0,0-25.7,0L5.42,197.29a17.93,17.93,0,0,0,0,25.7,17.56,17.56,0,0,0,12.85,5.42H274.09a18.53,18.53,0,0,0,18.27-18.27Z" transform="translate(0 -63.95)"></path></svg></span>';
var per = '<span class="_2FSeuB _240vE8 RCcMXQ _25R4LF _1-NWLc"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 292.36 37.99"><rect width="292.36" height="37.99" rx="15" ry="15"></rect></svg></span>';
$(function () {
    $.fn.extend({
        InstallDatepicker: function (buttonDay, buttonMonth, buttonYear, callback) {
            if ($(this).is("input") && typeof ($.fn.datepickerMode) != 'undefined' && typeof (moment) != 'undefined') {
                var that = this;
                $(this).datepickerMode({
                    format: "dddd DD MMM, YYYY"
                });
                $(this).datepickerMode("setValue", $.NowTimeZone());
                $(this).on("changeDate", function () {
                    dateDatepicker = $(this).datepickerMode("GetValue");
                    if (callback)
                        callback();
                });
                buttonDay.click(function () {
                    modeDatepicker = 0;
                    $(that).datepickerMode('SetMode', modeDatepicker);
                    $(that).datepickerMode('SetFormat', "dddd DD MMM, YYYY");
                    $(that).trigger("changeDate");
                })
                buttonMonth.click(function () {
                    modeDatepicker = 1;
                    $(that).datepickerMode('SetMode', modeDatepicker);
                    $(that).datepickerMode('SetFormat', "MMM YYYY");
                    $(that).trigger("changeDate");
                })
                buttonYear.click(function () {
                    modeDatepicker = 2;
                    $(that).datepickerMode('SetMode', modeDatepicker);
                    $(that).datepickerMode('SetFormat', "YYYY");
                    $(that).trigger("changeDate");
                })
            } else
                console.log("Đối tượng khai báo không hợp lệ");
        },
    })

    var lineChartDataAppointment = {
        labels: [],
        datasets: [
          {
              label: 'Total Appointments',
              fill: false,
              backgroundColor: '#6DA4E0',
              borderColor: '#6DA4E0',
              data: []
          },
          {
              label: "Online Bookings",
              fill: false,
              backgroundColor: '#B9F9E6',
              borderColor: '#B9F9E6',
              data: []
          }
        ]
    }
    var lineChartDataSales = {
        labels: [],
        datasets: [
          {
              label: 'Services',
              fill: false,
              backgroundColor: '#6DA4E0',
              borderColor: '#6DA4E0',
              data: []
          },
          {
              label: "Products",
              fill: false,
              backgroundColor: '#B9F9E6',
              borderColor: '#B9F9E6',
              data: []
          }
        ]
    }
    var chartAppointment;
    var charSales;
    var GetTextDuration = function (duration) {
        var minutesTotal = duration / 60;
        var hour = parseInt(minutesTotal / 60);
        var minutes = (minutesTotal % 60);
        return (hour > 0 ? hour + "h " : "") + " " + (minutes > 0 ? minutes + "min" : "");
    }
    var loadDataChart = function (element, data, linechartData, chart) {
        linechartData.labels = [];
        linechartData.datasets[0].data = [];
        linechartData.datasets[1].data = [];
        $.each(data, function () {
            linechartData.labels.push(this.Name);
            linechartData.datasets[0].data.push(parseFloat(this.Item1));
            linechartData.datasets[1].data.push(parseFloat(this.Item2));
        })
        if (!chart) {
            chart = new Chart(element, {
                type: 'line',
                data: linechartData,
                options: {
                    responsive: true,
                    legend: {
                        position: 'bottom',
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Month'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Value'
                            }
                        }]
                    }
                },
            });
        } else
            chart.update();
        return { LinechartData: linechartData, Chart: chart };
    }
    var loadTitle = function (data) {
        var Mode = (modeDatepicker ? modeDatepicker : 0) + 1
        var prev = "% previous year";
        if (Mode == 1) {
            prev = "% previous day";
        }
        else if (Mode == 2) {
            prev = "% previous month";
        }
        //---------------TOTAL AP
        $("#TotalAppointments").html(data.TotalAppointments);
        if (data.AppointmentsPre == 0) {
            $("#AppointmentsPre").html(per + data.AppointmentsPre + prev)
            $("#AppointmentsPre").attr('class', '_1p62pX _3y3xr- _2xtCX5 _3D_WMD');
        }
        else if (data.AppointmentsPre > 0) {
            $("#AppointmentsPre").html(perup + data.AppointmentsPre + prev)
            $("#AppointmentsPre").attr('class', '_1p62pX _3y3xr- _2xtCX5 _3D_WMD _1RHwD-');
        }
        else {
            $("#AppointmentsPre").html(perdown + data.AppointmentsPre + prev)
            $("#AppointmentsPre").attr('class', '_1p62pX _3y3xr- _2xtCX5 _3D_WMD _4VOijb');
        }
        $("#AppointmentsComplete").html(data.AppointmentsComplete);
        $("#AppointmentsCompletePercent").html("(" + data.AppointmentsCompletePercent + "%)");

        $("#AppointmentsNotCompleted").html(data.AppointmentsNotCompleted);
        $("#AppointmentsNotCompletedPercent").html("(" + data.AppointmentsNotCompletedPercent + "%)");

        $("#AppointmentsCanceled").html(data.AppointmentsCanceled);
        $("#AppointmentsCanceledPercent").html("(" + data.AppointmentsCanceledPercent + "%)");

        $("#AppointmentsNoShow").html(data.AppointmentsNoShow);
        $("#AppointmentsNoShowPercent").html("(" + data.AppointmentsNoShowPercent + "%)");

        //--------------------ONLINE AP
        $("#TotalOnlineAppointments").html(data.TotalOnlineAppointments + " (" + data.OnlineAppointmentsPercent + "%)");
        if (data.OnlineAppointmentsPre == 0) {
            $("#OnlineAppointmentsPre").html(per + data.OnlineAppointmentsPre + prev)
            $("#OnlineAppointmentsPre").attr('class', '_1p62pX _3y3xr- _2xtCX5 _3D_WMD');
        }
        else if (data.OnlineAppointmentsPre > 0) {
            $("#OnlineAppointmentsPre").html(perup + data.OnlineAppointmentsPre + prev)
            $("#OnlineAppointmentsPre").attr('class', '_1p62pX _3y3xr- _2xtCX5 _3D_WMD _1RHwD-');
        }
        else {
            $("#OnlineAppointmentsPre").html(perdown + data.OnlineAppointmentsPre + prev)
            $("#OnlineAppointmentsPre").attr('class', '_1p62pX _3y3xr- _2xtCX5 _3D_WMD _4VOijb');
        }
        $("#OnlineAppointmentsComplete").html(data.OnlineAppointmentsComplete);
        $("#OnlineAppointmentsCompletePercent").html("(" + data.OnlineAppointmentsCompletePercent + "%)");

        $("#OnlineAppointmentsNotCompleted").html(data.OnlineAppointmentsNotCompleted);
        $("#OnlineAppointmentsNotCompletedPercent").html("(" + data.OnlineAppointmentsNotCompletedPercent + "%)");

        $("#OnlineAppointmentsCanceled").html(data.OnlineAppointmentsCanceled);
        $("#OnlineAppointmentsCanceledPercent").html("(" + data.OnlineAppointmentsCanceledPercent + "%)");

        $("#OnlineAppointmentsNoShow").html(data.OnlineAppointmentsNoShow);
        $("#OnlineAppointmentsNoShowPercent").html("(" + data.OnlineAppointmentsNoShowPercent + "%)");
        //---------------Occupancy
        $("#OccupancyPercent").html(data.OccupancyPercent + "%");
        if (data.OccupancyPre == 0) {
            $("#OccupancyPre").html(per + data.OccupancyPre + prev)
            $("#OccupancyPre").attr('class', '_1p62pX _3y3xr- _2xtCX5 _3D_WMD');
        }
        else if (data.OccupancyPre > 0) {
            $("#OccupancyPre").html(perup + data.OccupancyPre + prev)
            $("#OccupancyPre").attr('class', '_1p62pX _3y3xr- _2xtCX5 _3D_WMD _1RHwD-');
        }
        else {
            $("#OccupancyPre").html(perdown + data.OccupancyPre + prev)
            $("#OccupancyPre").attr('class', '_1p62pX _3y3xr- _2xtCX5 _3D_WMD _4VOijb');
        }
        $("#WorkingHours").html(GetTextDuration(data.WorkingHours));

        $("#BookedHours").html(GetTextDuration(data.BookedHours));
        $("#BookedHoursPercent").html("(" + data.BookedHoursPercent + "%)");

        $("#BlockedHours").html(GetTextDuration(data.BlockedHours));
        $("#BlockedHoursPercent").html("(" + data.BlockedHoursPercent + "%)");

        $("#UnbookedHours").html(GetTextDuration(data.UnbookedHours));
        $("#UnbookedHoursPercent").html("(" + data.UnbookedHoursPercent + "%)");

        //---------------------Total Sales
        $("#TotalSales").html(Window.CurrencySymbol + $.number(data.TotalSales, Window.NumberDecimal, '.', ','));
        if (data.TotalSalesPre == 0) {
            $("#TotalSalesPre").html(per + data.TotalSalesPre + prev)
            $("#TotalSalesPre").attr('class', '_1p62pX _3y3xr- _2xtCX5 _3D_WMD');
        }
        else if (data.TotalSalesPre > 0) {
            $("#TotalSalesPre").html(perup + data.TotalSalesPre + prev)
            $("#TotalSalesPre").attr('class', '_1p62pX _3y3xr- _2xtCX5 _3D_WMD _1RHwD-');
        }
        else {
            $("#TotalSalesPre").html(perdown + data.TotalSalesPre + prev)
            $("#TotalSalesPre").attr('class', '_1p62pX _3y3xr- _2xtCX5 _3D_WMD _4VOijb');
        }
        $("#Services").html(Window.CurrencySymbol + $.number(data.Services, Window.NumberDecimal, '.', ','));
        $("#ServicesPercent").html("(" + data.ServicesPercent + "%)");
        $("#Products").html(Window.CurrencySymbol + $.number(data.Products, Window.NumberDecimal, '.', ','));
        $("#ProductsPercent").html("(" + data.ProductsPercent + "%)");

        //--------------------Average Sale
        $("#AverageSale").html(Window.CurrencySymbol + $.number(data.AverageSale, Window.NumberDecimal, '.', ','));
        if (data.AverageSalePre == 0) {
            $("#AverageSalePre").html(per + data.AverageSalePre + prev)
            $("#AverageSalePre").attr('class', '_1p62pX _3y3xr- _2xtCX5 _3D_WMD');
        }
        else if (data.AverageSalePre > 0) {
            $("#AverageSalePre").html(perup + data.AverageSalePre + prev)
            $("#AverageSalePre").attr('class', '_1p62pX _3y3xr- _2xtCX5 _3D_WMD _1RHwD-');
        }
        else {
            $("#AverageSalePre").html(perdown + data.AverageSalePre + prev)
            $("#AverageSalePre").attr('class', '_1p62pX _3y3xr- _2xtCX5 _3D_WMD _4VOijb');
        }
        $("#SalesCount").html(data.SalesCount);
        $("#AvServiceSale").html(Window.CurrencySymbol + $.number(data.AvServiceSale, Window.NumberDecimal, '.', ','));
        $("#AvProductSale").html(Window.CurrencySymbol + $.number(data.AvProductSale, Window.NumberDecimal, '.', ','));

        //----------------------Client Retention (Sales)
        $("#ClientRetention").html(data.ClientRetention + "%");
        if (data.ClientRetentionPre == 0) {
            $("#ClientRetentionPre").html(per + data.ClientRetentionPre + prev)
            $("#ClientRetentionPre").attr('class', '_1p62pX _3y3xr- _2xtCX5 _3D_WMD');
        }
        else if (data.ClientRetentionPre > 0) {
            $("#ClientRetentionPre").html(perup + data.ClientRetentionPre + prev)
            $("#ClientRetentionPre").attr('class', '_1p62pX _3y3xr- _2xtCX5 _3D_WMD _1RHwD-');
        }
        else {
            $("#ClientRetentionPre").html(perdown + data.ClientRetentionPre + prev)
            $("#ClientRetentionPre").attr('class', '_1p62pX _3y3xr- _2xtCX5 _3D_WMD _4VOijb');
        }
        $("#Returning").html(Window.CurrencySymbol + $.number(data.Returning, Window.NumberDecimal, '.', ','));
        $("#ReturningPercent").html("(" + data.ReturningPercent + "%)");
        $("#New").html(Window.CurrencySymbol + $.number(data.New, Window.NumberDecimal, '.', ','));
        $("#NewPercent").html("(" + data.NewPercent + "%)");
        $("#WalkIn").html(Window.CurrencySymbol + $.number(data.WalkIn, Window.NumberDecimal, '.', ','));
        $("#WalkInPercent").html("(" + data.WalkInPercent + "%)");
    }
    var loadData = function () {
        $.RequestAjax("/Reports/GetDataAnalyticsDashBoard", JSON.stringify({
            LocationID: $("#locationSearch").val() && $("#locationSearch").val() != "" && $("#locationSearch").val() != 0 ? $("#locationSearch").val() : 0,
            StaffID: $("#staffSearch").val() && $("#staffSearch").val() != "" && $("#staffSearch").val() != 0 ? $("#staffSearch").val() : 0,
            Date: dateDatepicker ? dateDatepicker : $.NowTimeZone(),
            Mode: (modeDatepicker ? modeDatepicker : 0) + 1
        }), function (renponsive) {
            var dataTitle = renponsive.Title[0];
            var dataChartSale = renponsive.ChartSale;
            var dataChartAppointment = renponsive.ChartAppointment;
            loadTitle(dataTitle);
            var sale = loadDataChart($("#chartTotalSales")[0], dataChartSale, lineChartDataSales, charSales);
            charSales = sale.Chart;
            lineChartDataSales = sale.LinechartData;
            var appointment = loadDataChart($("#chartTotalAppointments")[0], dataChartAppointment, lineChartDataAppointment, chartAppointment);
            chartAppointment = appointment.Chart;
            lineChartDataAppointment = appointment.LinechartData;
        })
    }
    $("#locationSearch").InStallSelect2('/Home/LoadSelect2ForLocation', 20, 'All Locations', null, null, null, null, null, null, null, false);
    $("#staffSearch").InStallSelect2('/Home/LoadSelect2ForUser', 20, 'All Staff', null, null, null, null, null, null, null, false);
    $("#datepickerSearch").InstallDatepicker($("#buttonModeDay"), $("#buttonModeMonth"), $("#buttonModeYear"), loadData);
    $("#locationSearch, #staffSearch").change(function () {
        loadData();
    })
    loadData();
})