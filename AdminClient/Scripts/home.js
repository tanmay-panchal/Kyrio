var tableService, tableStaff;
$(function () {
    //#region cotaint
    $.fn.extend({
        InstallAppointmentActivity: function (url, pageSize) {
            if ($(this).is("div")) {
                var that = this;
                var pageIndex = 0;
                pageSize = parseInt(pageSize);
                var total = 0;
                $(that).html("");
                var loaddata = function () {
                    var itemHtml = '<div class="appointment-item-home col-12 p-2 form-group b-t-1 b-b-1">'
                        + '<p><span class="badge text-uppercase mr-2" style="background-color: @BackgroundColor">@Status</span><span class="btn-link">@ServiceName</span></p>'
                        + '<p><span class="pr-2">@StarTime</span><span class="pr-2"><i class="fa fa-clock-o"></i> @Duration</span><span class="pr-2"><i class="fa fa-user-o"></i> @StaffName</span>'
                        + '<span class="pr-2"><i class="fa fa-home"></i> @LocationName</span></p>'
                        + '</div>';
                    $.RequestAjax(url, JSON.stringify({
                        PageIndex: pageIndex,
                        PageSize: pageSize
                    }), function (renponsive) {
                        total = parseInt(renponsive.total);
                        if (total > 0) {
                            pageIndex = pageIndex + pageSize;
                            var GetTextDuration = function (duration) {
                                duration = parseInt(duration);
                                var minutuesDuration = duration / 60;
                                var hour = parseInt(minutuesDuration / 60);
                                return (hour >= 1 ? (hour + "h ") : "") + (parseInt(minutuesDuration % 60)) + "min";
                            };
                            $.each(renponsive.data, function () {
                                var item = this;
                                var serviceName = item.ServiceName + (parseInt(item.ClientID) == 0 ? " as " : " with ") + item.ClientName;
                                var BackgroundColor = Window.StatusScheul.find(n => n.Status == item.Status).Color;
                                $(that).append(itemHtml.replace('@Status', item.Status)
                                    .replace('@ServiceName', serviceName)
                                    .replace('@StarTime', moment(item.StartTime).format(Window.FormatDateWithDayOfWeekJS)
                                        + " at " + moment(item.StartTime).startOf('day').add(item.StartTimeInSecond, "seconds").format(Window.FormatTimeJS))
                                    .replace('@Duration', GetTextDuration(item.Duration))
                                    .replace('@StaffName', item.StaffName)
                                    .replace('@LocationName', item.LocationName)
                                    .replace('@BackgroundColor', BackgroundColor));
                                $(that).find(".appointment-item-home:last").click(function () {
                                    $.CallViewAppointment(item.AppointmentID);
                                })
                            })
                        } else {
                            var card = $(that).closest(".card");
                            card.parent("div").find('[name="notify"]').removeClass("d-none");
                            card.addClass("d-none");
                        }
                    })
                }
                loaddata();
                $(that).scroll(function (a, b) {
                    if (total > pageSize + pageIndex && total != 0 && this.offsetHeight + this.scrollTop == this.scrollHeight)
                        loaddata();
                })
            } else
                console.log("Đối tượng khai báo không hợp lệ");
        },
        InstallNextAppointment: function (url) {
            if ($(this).is("div")) {
                var that = this;
                $(that).html("");
                var itemHtml = '<div class="appointment-item-home col-12 p-2 form-group d-flex b-t-1 b-b-1">'
                    + '<p class="font-weight-bold pr-3 pl-2">@StarTime</p>'
                    + '<div><p class="btn-link">@ServiceName</p>'
                    + '<p><span class="pr-2"><i class="fa fa-clock-o"></i> @Duration</span><span class="pr-2"><i class="fa fa-user-o"></i> @StaffName</span><span class="pr-2"><i class="fa fa-home"></i> @LocationName</span></p>'
                    + '</div>'
                    + '</div>';
                $.RequestAjax(url, JSON.stringify({
                    date: moment(moment().tz(Window.TimeZone).format("YYYY-MM-DD"))
                }), function (data) {
                    if (data.length > 0) {
                        var GetTextDuration = function (duration) {
                            duration = parseInt(duration);
                            var hour = parseInt(duration / 60);
                            return (hour >= 1 ? (hour + "h ") : "") + (parseInt(duration % 60)) + "min";
                        };
                        $.each(data, function () {
                            var item = this;
                            $(that).append(itemHtml.replace('@ServiceName', item.ServiceName)
                                .replace('@StarTime', moment(item.StartTime).startOf('day').add(item.StartTimeInSecond, "seconds").format(Window.FormatTimeJS))
                                .replace('@Duration', GetTextDuration(item.DurationInMinute))
                                .replace('@StaffName', item.StaffName)
                                .replace('@LocationName', item.LocationName));
                            $(that).find(".appointment-item-home:last").click(function () {
                                $.CallViewAppointment(item.AppointmentID);
                            })
                        })
                    } else {
                        var card = $(that).closest(".card");
                        card.parent("div").find('[name="notify"]').removeClass("d-none");
                        card.addClass("d-none");
                    }
                })
            } else
                console.log("Đối tượng khai báo không hợp lệ");
        },
        InstallChartUpcomingAppointment: function (url, comboboxLocation, comboboxRange, titlechart) {
            if ($(this).is("canvas")) {
                var that = this;
                var barChartData = {
                    labels: [],
                    datasets: [
                        {
                            label: "Confirmed",
                            backgroundColor: '#6DA4E0',
                            borderColor: 'rgba(220,220,220,0.8)',
                            highlightFill: 'rgba(220,220,220,0.75)',
                            highlightStroke: 'rgba(220,220,220,1)',
                            data: []
                        },
                        {
                            label: "Cancelled",
                            backgroundColor: '#F35756',
                            borderColor: 'rgba(151,187,205,0.8)',
                            highlightFill: 'rgba(151,187,205,0.75)',
                            highlightStroke: 'rgba(151,187,205,1)',
                            data: []
                        }
                    ]
                }
                var chart;
                var loadData = function () {
                    var start = moment(moment().tz(Window.TimeZone).format("YYYY-MM-DD")).add(1, "day");
                    var end = moment(start.toDate()).add(comboboxRange.val() - 1, "day");
                    $.RequestAjax(url, JSON.stringify({
                        LocationID: comboboxLocation.val() == 0 || !comboboxLocation.val() || comboboxLocation.val() == "" ? 0 : comboboxLocation.val(),
                        Start: start.toDate(),
                        End: end.toDate(),
                    }), function (renponsive) {
                        barChartData.labels = [];
                        barChartData.datasets[0].data = [];
                        barChartData.datasets[1].data = [];
                        if (renponsive.show) {
                            if (renponsive.data.length > 0) {
                                titlechart.find("#sumAppointmentsBooked").text(renponsive.data[0].SumAppointmentsBooked);
                                titlechart.find("#sumConfirmed").text(renponsive.data[0].SumConfirmed);
                                titlechart.find("#sumCancelled").text(renponsive.data[0].SumCancelled);
                            } else {
                                titlechart.find("#sumAppointmentsBooked").text(0);
                                titlechart.find("#sumConfirmed").text(0);
                                titlechart.find("#sumCancelled").text(0);
                            }
                            var max = 0;
                            $.each(renponsive.data, function () {
                                var confirmed = parseInt(this.Confirmed);
                                var cancelled = parseInt(this.Cancelled);
                                barChartData.labels.push(moment(this.Date).format("MMM DD"));
                                max = max < confirmed ? confirmed : max;
                                max = max < cancelled ? cancelled : max;
                                barChartData.datasets[0].data.push(confirmed);
                                barChartData.datasets[1].data.push(cancelled);
                            })
                            if (!chart) {
                                chart = new Chart(that, {
                                    type: 'bar',
                                    data: barChartData,
                                    options: {
                                        responsive: true,
                                        legend: {
                                            position: 'bottom',
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
                                                ticks: {
                                                    stepSize: parseInt(max / 4) + 1,
                                                    min: 0,
                                                }
                                            }]
                                        }
                                    },
                                });
                            } else
                                chart.update();
                        } else {
                            var card = $(that).closest(".card");
                            card.parent("div").find('[name="notify"]').removeClass("d-none");
                            card.addClass("d-none");
                        }
                    })
                }
                loadData();
                comboboxLocation.change(function () {
                    loadData();
                })
                comboboxRange.change(function () {
                    loadData();
                })
            } else {
                console.log("Đối tượng khai báo không hợp lệ");
            }
        },
        InstallChartRecentSale: function (url, comboboxLocation, comboboxRange, titlechart) {
            if ($(this).is("canvas")) {
                var that = this;
                var lineChartData = {
                    labels: [],
                    datasets: [
                        {
                            label: 'Appointments',
                            fill: false,
                            backgroundColor: '#6DA4E0',
                            borderColor: '#6DA4E0',
                            data: []
                        },
                        {
                            label: "Sales",
                            fill: false,
                            backgroundColor: '#B9F9E6',
                            borderColor: '#B9F9E6',
                            data: []
                        }
                    ]
                }
                var chart;
                var loadData = function () {
                    var end = moment(moment().tz(Window.TimeZone).format("YYYY-MM-DD")).tz(Window.TimeZone).subtract(0, "day");
                    var start = moment(end.toDate()).subtract(comboboxRange.val(), "day");
                    $.RequestAjax(url, JSON.stringify({
                        LocationID: comboboxLocation.val() == 0 || !comboboxLocation.val() || comboboxLocation.val() == "" ? 0 : comboboxLocation.val(),
                        Start: start.toDate(),
                        End: end.toDate(),
                    }), function (renponsive) {
                        lineChartData.labels = [];
                        lineChartData.datasets[0].data = [];
                        lineChartData.datasets[1].data = [];
                        if (renponsive.show) {
                            if (renponsive.data.length > 0) {
                                titlechart.find("#sumAppointments").text(renponsive.data[0].SumAppointments);
                                titlechart.find("#sumAppointmentsValue").text(Window.CurrencySymbol + $.number(renponsive.data[0].SumAppointmentsValue, Window.NumberDecimal, '.', ','));
                                titlechart.find("#sumSalesValue").text(Window.CurrencySymbol + $.number(renponsive.data[0].SumSalesValue, Window.NumberDecimal, '.', ','));
                            } else {
                                titlechart.find("#sumAppointments").text(0);
                                titlechart.find("#sumAppointmentsValue").text(0);
                                titlechart.find("#sumSalesValue").text(0);
                            }
                            $.each(renponsive.data, function () {
                                lineChartData.labels.push(moment(this.Date).format("MMM DD"));
                                lineChartData.datasets[0].data.push(parseFloat(this.Appointments).toFixed(Window.NumberDecimal));
                                lineChartData.datasets[1].data.push(parseFloat(this.Sales).toFixed(Window.NumberDecimal));
                            })
                            if (!chart) {
                                chart = new Chart(that, {
                                    type: 'line',
                                    data: lineChartData,
                                    options: {
                                        responsive: true,
                                        legend: {
                                            position: 'bottom',
                                        },
                                        tooltips: {
                                            mode: 'index',
                                            intersect: false,
                                            callbacks: {
                                                label: function (tooltipItem, data) {
                                                    var label = data.datasets[tooltipItem.datasetIndex].label || '';
                                                    if (label) {
                                                        label += ': ' + Window.CurrencySymbol + parseFloat(tooltipItem.yLabel).toFixed(Window.NumberDecimal);
                                                    }
                                                    return label;
                                                }
                                            }
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
                                                },
                                                ticks: {
                                                    callback: function (value, index, values) {
                                                        return Window.CurrencySymbol + "" + parseFloat(value).toFixed(Window.NumberDecimal);
                                                    }
                                                }
                                            }]
                                        }
                                    },
                                });
                            } else
                                chart.update();
                        } else {
                            var card = $(that).closest(".card");
                            card.parent("div").find('[name="notify"]').removeClass("d-none");
                            card.addClass("d-none");
                        }
                    })
                }
                loadData();
                comboboxLocation.change(function () {
                    loadData();
                })
                comboboxRange.change(function () {
                    loadData();
                })
            } else {
                console.log("Đối tượng khai báo không hợp lệ");
            }
        }
    })
    //#endregion

    //#region table
    var tableService = $("#tableTopService").InStallDatatable(null, "/Home/GetDataTableTopService", [
        { "data": "ServiceName", "name": "ServiceName", "width": "60%", "class": "text-left" },
        { "data": "ThisMonth", "name": "ThisMonth", "width": "20%", "class": "text-right" },
        { "data": "LastMonth", "name": "LastMonth", "width": "20%", "class": "text-right" },
    ], false, false, false, false, null, true, null, function () {
        if (tableService.rows().data().count() == 0) {
            var card = $(tableService.containers()[0]).closest(".card");
            card.parent("div").find('[name="notify"]').removeClass("d-none");
            card.addClass("d-none");
        }
    });
    var tableStaff = $("#tableTopStaff").InStallDatatable(null, "/Home/GetDataTableTopStaff", [
        {
            "data": "StaffName", "name": "StaffName", "width": "60%", "class": "text-left"
        },
        {
            "data": "ThisMonth", "name": "ThisMonth", "width": "20%", "class": "text-right", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
            }
        },
        {
            "data": "LastMonth", "name": "LastMonth", "width": "20%", "class": "text-right", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
            }
        },
    ], false, false, false, false, null, true, null, function () {
        if (tableStaff.rows().data().count() == 0) {
            var card = $(tableStaff.containers()[0]).closest(".card");
            card.parent("div").find('[name="notify"]').removeClass("d-none");
            card.addClass("d-none");
        }
    });
    //#endregion

    //#region appointment
    $("#containtAppointmentActivity").InstallAppointmentActivity("/Home/GetDataAppointmentActivity", 10);
    $("#containtAppointmentToday").InstallNextAppointment("/Home/GetDataTodayNextAppointment");
    //#endregion

    //#region chart
    $("#locationUpcomingAppointment").InStallSelect2('/Home/LoadSelect2ForLocation', 20, 'All Locations', null, null, null, null, null, null, null, false);
    $("#locationRecentSale").InStallSelect2('/Home/LoadSelect2ForLocation', 20, 'All Locations', null, null, null, null, null, null, null, false);
    $("#chartUpcomingAppointment").InstallChartUpcomingAppointment("/Home/GetDataChartUpcomingAppointment", $("#locationUpcomingAppointment"), $("#rangeDateUpcomingAppointment"), $("#titleChartUpcomingAppointment"));
    $("#chartRecentSale").InstallChartRecentSale("/Home/GetDataChartRecentSales", $("#locationRecentSale"), $("#rangeDateRecentSale"), $("#titleChartRecentSale"));
    //#endregion

    //#region welcome
    $.RequestAjax('/Home/WellcomeScheul', null, function (data) {
        if (JSON.parse(data.FirstLogin))
            $.WelcomeScheul(data.FirstName);
    })
    //#endregion
})