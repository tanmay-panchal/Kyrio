//#region Method Support
$(function () {
    $.fn.extend({
        InStallComboboxStaff: function (comboboxLocation) {
            if ($(this).is("select")) {
                var that = this;
                $(this).select2({ theme: "bootstrap", });
                var loaddata = function (staff, location) {
                    $.RequestAjax("/Staff/GetUserByLocation", JSON.stringify({
                        LocationID: location.val() ? location.val() : 0,
                    }), function (data) {
                        $(staff).html("");
                        if (data.Result.length > 0) {
                            $(staff).closest("div").show();
                            $(staff).append(new Option("All Staff", 0, true, true));
                            $.each(data.Result, function () {
                                $(staff).append(new Option((this.FirstName ? this.FirstName : "") + " " + (this.LastName ? this.LastName : ""), this.UserID, false, false));
                            })
                        } else {
                            $(staff).html("");
                            $(staff).val("");
                            $(staff).closest("div").hide();
                        }
                    })
                }
                loaddata(this, comboboxLocation);
                comboboxLocation.change(function () {
                    loaddata(that, comboboxLocation);
                })
            } else {
                console.log("Tag không hợp lệ");
            }
        },
        InStallComboboxLocation: function (callbackcomplete) {
            if ($(this).is("select")) {
                var that = this;
                $.RequestAjax("/Staff/GetLocation", null, function (data) {
                    $.each(data.Result, function (index, item) {
                        $(that).append(new Option(item.LocationName, this.LocationID, index == 0, index == 0));
                    })
                    if (data.Result.length > 0)
                        callbackcomplete(data.Result[0].LocationID);
                    $(that).select2({ theme: "bootstrap", });
                })
            } else {
                console.log("Tag không hợp lệ");
            }
        },
        InStallTable: function (url, seletorTableTitle, idButtonShowModal, idRowCreateShowModal, nameColShowModal, LocationID, UserID, DateFrom, DateTo) {
            if ($(this).is("table")) {
                $tableContaint = this;
                $tableTitle = $(seletorTableTitle);
                $.fn.UrlTable = url;
                $.fn.IdButtonShowModal = idButtonShowModal;

                //reset tbody tableContaint and tableTitle
                $tableContaint.find("tbody").html("");
                $tableTitle.find("tbody").html("");

                //reset text th tableContaint and tableTitle
                $tableContaint.find("thead th").text("");
                $tableContaint.find("thead tr:first-child").hide();
                $tableTitle.find("thead tr:first-child").hide();
                $tableTitle.find("thead th").text("");
                $tableTitle.find("thead th:last").append('<button type="button" class="btn btn-link"><strong>CHANGE STAFF</strong></button>');
                var withColTableContaint = parseInt(parseInt($tableContaint.find("thead tr:last").width()) / 7);
                $tableContaint.find("thead th").css("width", withColTableContaint + "px");
                $tableContaint.find("thead th").css("min-width", withColTableContaint + "px");
                $tableContaint.find("thead th").css("max-width", withColTableContaint + "px");
                $("#containtNotification").hide();
                $.RequestAjax("/Staff/GetDataTableWorkingHour", JSON.stringify({
                    LocationID: LocationID,
                    UserID: UserID,
                    DateFrom: DateFrom,
                    DateTo: DateTo
                }), function (data) {
                    var lsItems = data.Result;
                    var timeFormat = data.TimeFormat;
                    $.fn.DataTable = data.Result;
                    $.fn.DateFormat = timeFormat;
                    var RangerCloseDate = [];
                    //; debugger;
                    for (var i = 0; i <= 6 ; i++) {
                        var DateWorking = moment(DateFrom).add(i, 'day').startOf('day');
                        $tableContaint.find("thead tr:last th:eq(" + i + ")").append('<span>' + DateWorking.format("ddd D MMM") + '</span>');
                        var Description = "";
                        if ($.grep(data.RangerCloseDate, function (item, index) {
                            var StartDate = moment(item.StartDate).startOf('day');
                            var EndDate = moment(item.EndDate).startOf('day');
                            if (StartDate.isSameOrBefore(DateWorking) && EndDate.isSameOrAfter(DateWorking)) {
                                Description = item.Description;
                                return true;
                        }
                            return false;
                        }).length > 0) {
                            RangerCloseDate[i] = {
                                isCloseDate: true,
                                Description: Description
                            };
                        } else {
                            RangerCloseDate[i] = {
                                isCloseDate: false,
                                Description: ""
                            };
                        }
                    }
                    //set height thead for $tableContaint and $tableTitle
                    var heigthTitle = $tableTitle.find("thead tr:last").css("height");
                    var heigthContaint = $tableContaint.find("thead tr:last").css("height");
                    var heigth = heigthTitle > heigthContaint ? heigthTitle : heigthContaint;
                    $tableTitle.find("thead tr:last").css("height", heigth);
                    $tableContaint.find("thead tr:last").css("height", heigth);
                    $tableTitle.find("thead tr:last th:first button").attr("name", nameColShowModal);
                    $.each(RangerCloseDate, function (index, item) {
                        if (item.isCloseDate) {
                            $tableTitle.css("border", "none");
                            $tableContaint.css("border", "none");
                            $tableTitle.find("thead tr:first-child th").css("border", "none");
                            $tableContaint.find("thead tr:first-child th").css("border", "none");
                            $tableContaint.find("thead tr:first-child th").css("padding", "2px");

                            $tableContaint.find("thead tr:first-child").show();
                            $tableTitle.find("thead tr:first-child").show();
                            $tableContaint.find("thead tr:first-child th:eq(" + index + ")").append('<div class="col-md-12"><button type="button" class="btn btn-square btn-block btn-dark"><strong>CLOSED</strong>'
                                + '<i class="icon-bubble icons d-block float-right" data-toggle="tooltip" data-placement="top" title="' + item.Description + '"></i></button></div>');
                        }
                    })
                    if (lsItems.length > 0) {
                        $.each(lsItems, function () {
                            this.Sum = parseInt(this.Sum);
                            var sum = "0h";
                            if (this.Sum == 0)
                                sum = "Not working";
                            if (this.Sum >= 60)
                                sum = parseInt(this.Sum / 60).toString() + "h";
                            var nameUser = ((this.FirstName ? this.FirstName : "") + " " + (this.LastName ? this.LastName : ""));
                            var htmlTableTitle = '<tr><td class="range"><strong style="line-height: 16px;">' + nameUser + '</strong><br><span>' + sum + '</span></td></tr>';
                            if (nameUser.length > 28)
                                htmlTableTitle = '<tr><td class="range"><strong class="text-truncate d-inline-block" style="line-height: 16px; max-width: 257px;" data-toggle="tooltip" data-placement="top" title="' + nameUser + '">' + nameUser + '</strong><br><span>' + sum + '</span></td></tr>';
                            $tableTitle.find("tbody").append(htmlTableTitle);
                            $tableContaint.find("tbody").append("<tr>"
                                                         + '<td ' + (RangerCloseDate[0].isCloseDate ? '' : 'class="row-click" name="' + idRowCreateShowModal + '"') + '></td>'
                                                         + '<td ' + (RangerCloseDate[1].isCloseDate ? '' : 'class="row-click" name="' + idRowCreateShowModal + '"') + '></td>'
                                                         + '<td ' + (RangerCloseDate[2].isCloseDate ? '' : 'class="row-click" name="' + idRowCreateShowModal + '"') + '></td>'
                                                         + '<td ' + (RangerCloseDate[3].isCloseDate ? '' : 'class="row-click" name="' + idRowCreateShowModal + '"') + '></td>'
                                                         + '<td ' + (RangerCloseDate[4].isCloseDate ? '' : 'class="row-click" name="' + idRowCreateShowModal + '"') + '></td>'
                                                         + '<td ' + (RangerCloseDate[5].isCloseDate ? '' : 'class="row-click" name="' + idRowCreateShowModal + '"') + '></td>'
                                                         + '<td ' + (RangerCloseDate[6].isCloseDate ? '' : 'class="row-click" name="' + idRowCreateShowModal + '"') + '></td>'
                                                         + "</tr>");

                            //set height thead for $tableContaint and $tableTitle
                            var heigthTitle = $tableTitle.find("thead tr:last").css("height");
                            var heigthContaint = $tableContaint.find("thead tr:last").css("height");
                            var heigth = heigthTitle > heigthContaint ? heigthTitle : heigthContaint;
                            $tableTitle.find("thead tr:first-child").css("height", heigth);
                            $tableContaint.find("thead tr:first-child").css("height", heigth);

                            $.each(this.WorkingHours, function () {
                                var indexCol = parseInt(moment(this.DateWorking)._d.subtract(DateFrom));
                                var itemRangerCloseDate = RangerCloseDate[indexCol];
                                var formatTime = (timeFormat == "24" ? "HH:mm" : "hh:mm A");
                                var htmlButton = "";
                                if (!itemRangerCloseDate.isCloseDate) {
                                    $tableContaint.find("tbody tr:last").find("td:eq(" + (indexCol) + ")").removeClass("row-click");
                                    $tableContaint.find("tbody tr:last").find("td:eq(" + (indexCol) + ")").removeAttr("name");
                                    $tableContaint.find("tbody tr:last").find("td:eq(" + (indexCol) + ")").addClass("range");
                                    htmlButton = '<div class="col-md-12"><button type="button" name="' + idButtonShowModal + '" class="btn btn-block btn-custome active" aria-pressed="true">@text</button></div>';
                                } else {
                                    $tableContaint.find("tbody tr:last").find("td:eq(" + (indexCol) + ")").removeAttr("name");
                                    $tableContaint.find("tbody tr:last").find("td:eq(" + (indexCol) + ")").addClass("iscloseday");
                                    htmlButton = '<div class="col-md-12" data-toggle="tooltip" data-placement="top" title="' + itemRangerCloseDate.Description + '"><button type="button" class="btn btn-square btn-block btn-dark">@text</button></div>';
                                }
                                $tableContaint.find("tbody tr:last").find("td:eq(" + (indexCol) + ")").append(htmlButton.replace("@text", moment(this.Shift1Start).format(formatTime) + " - " + moment(this.Shift1End).format(formatTime))
                                                                                                                + (this.Shift2Start != null && this.Shift2End != null ? htmlButton.replace("@text", moment(this.Shift2Start).format(formatTime) + " - " + moment(this.Shift2End).format(formatTime)) : ""));
                            })
                            //set height for $tableTitle and $tableContaint
                            var heigthTitle = $tableTitle.find("tbody tr:last").css("height");
                            var heigthContaint = $tableContaint.find("tbody tr:last").css("height");
                            var heigth = heigthTitle > heigthContaint ? heigthTitle : heigthContaint;
                            $tableTitle.find("tbody tr:last").css("height", heigth);
                            $tableContaint.find("tbody tr:last").css("height", heigth);
                        })
                    } else {
                        if (data.NoLocation == true)
                            $("#containtNotification").show("slow");
                        else
                            $("#containtNotificationenableappointmentbookings").show("slow");
                    }
                    $('[data-toggle="tooltip"]').tooltip();
                })
            } else {
                console.log("Tag không hợp lệ");
            }
        },
        GetDataCellTable: function (row) {
            if ($(this).is("table")) {
                var data = $.fn.DataTable;
                var index = row.index();
                return data[index];
            } else {
                console.log("Tag không hợp lệ");
            }
        },
    })
})
//#endregion

$(function () {
    //#region Load data && setup control
    CreateBreadcrumb([{ href: "/Home/Index", title: "Home" }, { href: "/Staff/Index", title: "Working Hours" }])
    $("#workinghourform #ContaintDatePicker").InStallDatetimepickerScheul("inputDate", "buttonPrevious", "buttonNext", "buttonToday", function () {
        $("#workinghourform #LocationId").InStallComboboxLocation(function (LocationID) {
            $("#workinghourform #StaffId").InStallComboboxStaff($("#workinghourform #LocationId"));
            var firstday = $.fn.daterangepicker.FirstDay;
            $("#tableContaintChangeStaff").InStallTable("/Staff/GetDataTableWorkingHour", "#tableTitleChangeStaff", "openDialogUpdateCell", "openDialogCreateCell", "openDialogChangeStaff", LocationID, 0, moment().startOf('week').toDate(), moment().endOf('week').toDate());
        });
    });
    //#endregion

    //#region Event
    $(document).on("click", "[name='openDialogChangeStaff']", function () {
        $('#excuteChangeStaff').modal("show");
    })
    $(document).on("click", "[name='openDialogUpdateCell'], [name='openDialogCreateCell']", function () {
        var data = $("#tableContaintChangeStaff").GetDataCellTable($(this).closest("tr"));
        var indexCol = $(this).closest("td").index();
        var start = $("#inputDate").data('daterangepicker').startDate._d;
        $.fn.DateWorkingClickCell = moment(start).add(indexCol, "day");
        $.fn.WorkingHoursDataItem = $.grep(data.WorkingHours, function (item, index) {
            return (moment(item.DateWorking)._d - $.fn.DateWorkingClickCell._d == 0);
        })[0];
        if ($.fn.WorkingHoursDataItem != null) {
            $.fn.WorkingHoursIsUpdate = true;
        } else {
            $.fn.WorkingHoursIsUpdate = false;
        }
        $.fn.LocationIDClickCell = data.LocationID;
        $.fn.UserIDClickCell = data.UserID;
        $.fn.DataItemClickCell = data;
        $("#TitleModalClickCell").find("h3").text("Edit " + data.FirstName + "'s Hours");
        $("#TitleModalClickCell").find("span").text(moment(start).add(indexCol, "day").format("dddd, DD MMMM YYYY"));
        $('#excuteDialogClickCell').modal("show");
    })
    $(document).on("change", "#inputDate, #LocationId, #StaffId", function () {
        if ($("#LocationId").val() != 0 && $("#LocationId").val() != "" && $.fn.daterangepicker.FirstDay != null) {
            $("#tableContaintChangeStaff").InStallTable("/Staff/GetDataTableWorkingHour", "#tableTitleChangeStaff", "openDialogUpdateCell", "openDialogCreateCell", "openDialogChangeStaff", $("#LocationId").val(), $("#StaffId").val() && $("#StaffId").val() != 0 && $("#StaffId").val() != "" ? $("#StaffId").val() : 0,
                $("#inputDate").data('daterangepicker').startDate._d, $("#inputDate").data('daterangepicker').endDate._d);
        }
    })
    //#endregion
})