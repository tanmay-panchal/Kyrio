//#region Page 2
var table;
$(function () {

})
//#endregion

//#region Page 3
$(function () {
    $.LoadDashboardAdmin = function (bussinessID) {
        $.RequestAjax("/HomeAdmin/GetDataDashboardAdmin", JSON.stringify({
            BusinessID: bussinessID
        }), function (data) {
            if (data.length > 0) {
                var format = function (number, numberDecimal) {
                    return $.number(number, numberDecimal, '.', ',');
                }
                var item = data[0];
                var array = [{ Seletor: "Total", NumberDecimal: 2 }, { Seletor: "Today", NumberDecimal: 2 }, { Seletor: "TodayPer", NumberDecimal: 2 },
                { Seletor: "ThisWeek", NumberDecimal: 2 }, { Seletor: "ThisWeekPer", NumberDecimal: 2 }, { Seletor: "ThisMonth", NumberDecimal: 2 },
                { Seletor: "ThisMonthPer", NumberDecimal: 2 }, { Seletor: "BTotal", NumberDecimal: 0 }, { Seletor: "BNew", NumberDecimal: 0 },
                { Seletor: "BTrial", NumberDecimal: 0 }, { Seletor: "BPaid", NumberDecimal: 0 }, { Seletor: "BExpired", NumberDecimal: 0 },
                { Seletor: "ABTotal", NumberDecimal: 0 }, { Seletor: "ABNew", NumberDecimal: 0 }, { Seletor: "ABConfirmed", NumberDecimal: 0 },
                { Seletor: "ABArrived", NumberDecimal: 0 }, { Seletor: "ABStarted", NumberDecimal: 0 }, { Seletor: "ABFinished", NumberDecimal: 0 },
                { Seletor: "EmailSent", NumberDecimal: 0 }, { Seletor: "EmailBounced", NumberDecimal: 0 }, { Seletor: "SMSSent", NumberDecimal: 0 },
                { Seletor: "SMSBounced", NumberDecimal: 0 }, { Seletor: "TotalStaff", NumberDecimal: 0 }, { Seletor: "TotalService", NumberDecimal: 0 },
                { Seletor: "TotalClient", NumberDecimal: 0 }]
                var extensionSeletor = "DashboardAdmin";
                $.each(array, function () {
                    $("#" + this.Seletor + extensionSeletor).text(format(item[this.Seletor], this.NumberDecimal));
                })
            }
        })
    }
    $.fn.extend({
        InstallChartUpcomingAppointment: function (url, comboboxBussiness, comboboxRange, titlechart) {
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
                        BusinessID: comboboxBussiness.val() == 0 || !comboboxBussiness.val() || comboboxBussiness.val() == "" ? 0 : comboboxBussiness.val(),
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
                comboboxBussiness.change(function () {
                    loadData();
                })
                comboboxRange.change(function () {
                    loadData();
                })
            } else {
                console.log("Đối tượng khai báo không hợp lệ");
            }
        },
        InstallChartRecentSale: function (url, comboboxBussiness, comboboxRange, titlechart) {
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
                        BusinessID: comboboxBussiness.val() == 0 || !comboboxBussiness.val() || comboboxBussiness.val() == "" ? 0 : comboboxBussiness.val(),
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
                comboboxBussiness.change(function () {
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
    $("#bussinessUpcomingAppointment, #bussinessRecentSale, #bussinessID").InStallSelect2('/Home/LoadSelect2ForCompany', 20, 'All Companies', null, null, null, null, null, null, null, false);

    //#region chart
    $("#chartUpcomingAppointment").InstallChartUpcomingAppointment("/HomeAdmin/GetDataChartUpcomingAppointmentAdmin", $("#bussinessUpcomingAppointment"), $("#rangeDateUpcomingAppointment"), $("#titleChartUpcomingAppointment"));
    $("#chartRecentSale").InstallChartRecentSale("/HomeAdmin/GetDataChartRecentSalesAdmin", $("#bussinessRecentSale"), $("#rangeDateRecentSale"), $("#titleChartRecentSale"));
    //#endregion

    //#region Dashboard Admin
    $("#bussinessID").change(function () {
        var value = $(this).val() == null || $(this).val() == "" ? 0 : $(this).val();
        $.LoadDashboardAdmin(value);
    });
    $.LoadDashboardAdmin(0);
    //#endregion
})
//#endregion