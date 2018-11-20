var urlGetService = "/OnlineBookingsData/GetService";
var urlGetStaff = "/OnlineBookingsData/GetStaff";
var urlGetLocation = "/OnlineBookingsData/GetLocation";
var urlGetOpenHour = "/OnlineBookingsData/GetOpenHour";
var urlSaveAppointment = "/OnlineBookingsData/SaveAppointment";
var htmlServiceGroup = '<div class="group-name"></div>';
var htmlServiceGroupPricingLevel = '<div class="group service-pricing-level-group"></div>';
var htmlService = '<div aria-checked="false" class="item" role="checkbox" tabindex="0" ServiceID="" Duration="" RetailPrice="" SpecialPrice=""  Price="" ServiceName="" DurationName=""><div class="input"><input type="checkbox"></div><div class="right"><div class="js-price text-right">@SpecialPrice</div><s>@RetailPrice</s></div><div class="title">@ServiceName</div><div class="subtitle">@DurationName</div></div>';
var htmlStaff = '<div aria-checked="false" class="item one-line without-checkbox" role="checkbox" tabindex="0" staffid="" staffname=""><div class="input-arrow"><input type="checkbox"></div><div class="title">STAFFNAME</div></div>';
var htmlStaffNoPreference = '<div aria-checked="false" class="item one-line without-checkbox selected preselected" staffid = "0" staffname="No Preference" role="checkbox" tabindex="0"><div class="input-arrow"><input type="checkbox" checked="checked"></div><div class="title">No Preference</div></div>';
var htmlItemTime = '<div aria-checked="false" class="item one-line without-checkbox" role="checkbox" tabindex="0"><div class="input-arrow"><input type="checkbox" name="online_booking_form_time_start_in_seconds" id="online_booking_form_time_start_in_seconds" value=""></div><div class="title time" id="divTimeName"></div></div>'
var htmlItemLocation = '<div aria-checked="false" class="item without-checkbox" role="checkbox" tabindex="0" locationid="" locationname = ""><div class="input-arrow"><input type="checkbox" name="online_booking_form" id="online_booking_form_location_id"></div><div class="title">@LocationName</div><div class="subtitle">@Address</div></div>';
var fromdate = moment();
var dateselect;
var services = [];
var lstStaff = [];
var lstService = [];
var staffname = "";
var totalprice = 0;
var durationselect = 0;
var StaffIDSelect = 0;
var OrgStaffIDSelect = 0;
var LocationIDSelect = 0;
var LocationNameSelect = "";
var TotalDuration = 0;
var IsRequest = false;
var ShowLocation = false;
$(function () {
    $("#online_booking_form_customer_attributes_normalized_contact_number").intlTelInput({
        separateDialCode: true,
        initialCountry: $("#CountryCode").val(),
        preferredCountries: [$("#CountryCode").val()],
        utilsScript: "/Extension/js/utils.js"
    });

    $("#online-booking-welcome").show();
    var LoadCalendar = function (Type) {
        if (Type == 0) {//tuan hien tai
            fromdate = moment();
        }
        else if (Type == 1) {//back
            if (moment().isAfter(moment(fromdate).add(-6, 'day'))) {

            }
            else {
                fromdate = moment(fromdate).add(-7, 'day');
            }
        }
        else if (Type == 2) {//next
            fromdate = moment(fromdate).add(7, 'day');
        }
        else {

        }
        for (var i = 0; i < 7; i++) {
            $("#new_online_booking_form #week-calendar .calendar-day-" + i + " .week-day-name").html(moment(fromdate).add(i, 'day').format("ddd"));
            $("#new_online_booking_form #week-calendar .calendar-day-" + i + " .week-day-name").attr("date", moment(fromdate).add(i, 'day').format("YYYY/MM/DD"));
            $("#new_online_booking_form #week-calendar .calendar-day-" + i + " .day-number").html(moment(fromdate).add(i, 'day').format("DD"));
            $("#new_online_booking_form #week-calendar .calendar-day-" + i + " .month-name").html(moment(fromdate).add(i, 'day').format("MMM"));
        }

        //bo select date
        $("#new_online_booking_form #week-calendar .calendar-day").each(function () {
            $(this).removeClass("selected");
        })
        //bo time slot
        $("#divtimeslotsavailable #divtimeslot").html("");
        $("#divtimeslotsavailable").hide();
        $("#divtimeslotsunavailable").show();
    }
    var LoadService = function () {
        $.RequestAjax(urlGetService, JSON.stringify({
            "BusinessID": parseInt($("#BusinessID").val()),
            "LocationID": LocationIDSelect,
            "Token": $("#authenticity_token").val()
        }), function (data) {
            var ServiceGroupID = '';
            $("#new_online_booking_form #divService").html('');
            if (data.Result == true && data.Service.length > 0) {
                var elementGPL = $(htmlServiceGroupPricingLevel);
                $.each(data.Service, function () {
                    //Nhom cu
                    if (ServiceGroupID == this.ServiceGroupID) {

                    }
                    else {//group dau tien hoac chuyen sang group moi
                        //gan hoan tat dong cu truoc
                        if (ServiceGroupID != '') {
                            $("#new_online_booking_form #divService").append(elementGPL[0].outerHTML);
                            elementGPL = $(htmlServiceGroupPricingLevel);
                        }
                        var elementSG = $(htmlServiceGroup);
                        elementSG.append(this.ServiceGroupName);
                        $("#new_online_booking_form #divService").append(elementSG[0].outerHTML);
                    }
                    ServiceGroupID = this.ServiceGroupID;
                    var element = htmlService.replace('@ServiceName', this.ServiceName);
                    element = element.replace('@SpecialPrice', Window.CurrencySymbol + (this.SpecialPrice == 0 ? $.number(this.RetailPrice, Window.NumberDecimal, '.', ',') : $.number(this.SpecialPrice, Window.NumberDecimal, '.', ',')));
                    element = element.replace('@RetailPrice', this.SpecialPrice == 0 ? '' : (Window.CurrencySymbol + $.number(this.RetailPrice, Window.NumberDecimal, '.', ',')));
                    element = element.replace('@DurationName', this.DurationName);
                    var elementS = $(element);
                    elementS.attr("ServiceID", this.ServiceID);
                    elementS.attr("SpecialPrice", this.SpecialPrice);
                    elementS.attr("RetailPrice", this.RetailPrice);
                    elementS.attr("Price", this.SpecialPrice == 0 ? this.RetailPrice : this.SpecialPrice);
                    elementS.attr("Duration", this.Duration);
                    elementS.attr("DurationName", this.DurationName);
                    elementS.attr("ServiceName", this.ServiceName);
                    elementGPL.append(elementS);
                })
                //gan cai cuoi cung
                $("#new_online_booking_form #divService").append(elementGPL[0].outerHTML);
                $("#online-booking-welcome").hide();
                $("#online-booking-location-form").hide();
                $("#online-booking-services-form").show();
                $("#online-booking-disabled-form").hide();
            }
        }, function () {
        })
    }
    var CalMinSlot = function (date) {
        var hasTime = false;
        for (i = 0; i < lstStaff.length; i++) {
            hasTime = false;
            $.RequestAjax(urlGetOpenHour, JSON.stringify({
                "BusinessID": parseInt($("#BusinessID").val()),
                "Token": $("#authenticity_token").val(),
                "date": date,
                "StaffID": lstStaff[i].UserID,
                "LocationID": LocationIDSelect,
                "lstService": lstService,
                "TotalDuration": TotalDuration
            }), function (data) {
                if (data.Result == true) {
                    if (data.store_open == true) {
                        var open = parseInt(data.open);
                        var close = parseInt(data.close);
                        var lstRemove = data.lstRemove;
                        var hour = 0;
                        var minute = 0;
                        var remove = false;

                        if (open == 0 && close == 0) {
                            lstStaff[i].MinSlot = 100000;//maximum 24h
                        }
                        else {
                            while (open <= close && hasTime == false) {
                                if (lstRemove != null) {
                                    remove = false;
                                    $.each(lstRemove, function () {
                                        if (this.from <= open && this.to > open) {
                                            remove = true;
                                        }

                                        if (this.from < (open + TotalDuration) && this.to > (open + TotalDuration)) {
                                            remove = true;
                                        }

                                        if (open < this.from && (open + TotalDuration) > this.to) {
                                            remove = true;
                                        }

                                    })
                                }
                                if (remove == false) {
                                    lstStaff[i].MinSlot = open;
                                    hasTime = true;
                                    return true;
                                }
                                open = open + 900;
                            }
                        }
                    }
                    else {
                        lstStaff[i].MinSlot = 100000;//maximum 24h
                    }
                }
                else {
                }
            }, function () {
            });
        }
    }
    var LoadOpenHour = function (date, staffid) {
        var hasTime = false;
        $.RequestAjax(urlGetOpenHour, JSON.stringify({
            "BusinessID": parseInt($("#BusinessID").val()),
            "Token": $("#authenticity_token").val(),
            "date": date,
            "StaffID": staffid,//OrgStaffIDSelect,
            "LocationID": LocationIDSelect,
            "lstService": lstService,
            "TotalDuration": TotalDuration
        }), function (data) {
            $("#online-booking-employee-form #divStaff").html('');
            $("#online-booking-employee-form #divStaff").append(htmlStaffNoPreference)
            if (data.Result == true) {
                if (data.store_open == true) {
                    var open = parseInt(data.open);
                    var close = parseInt(data.close);
                    var lstRemove = data.lstRemove;
                    var hour = 0;
                    var minute = 0;
                    $("#divtimeslotsavailable #divtimeslot").html("");
                    var remove = false;
                    StaffIDSelect = data.StaffID;
                    while (open <= close) {
                        if (lstRemove != null) {
                            remove = false;
                            $.each(lstRemove, function () {
                                if (this.from <= open && this.to > open) {
                                    remove = true;
                                }

                                if (this.from < (open + TotalDuration) && this.to > (open + TotalDuration)) {
                                    remove = true;
                                }
                                if (open < this.from && (open + TotalDuration) > this.to) {
                                    remove = true;
                                }
                            })
                        }
                        if (remove == false) {
                            hasTime = true;
                            hour = parseInt(open / 3600);
                            minute = open - (hour * 3600);
                            minute = parseInt(minute / 60);
                            var item = $(htmlItemTime);
                            item.find("#online_booking_form_time_start_in_seconds").attr("value", open);
                            item.find("#divTimeName").html((hour < 10 ? '0' + hour : hour) + ":" + (minute < 10 ? '0' + minute : minute));
                            $("#divtimeslotsavailable #divtimeslot").append(item[0].outerHTML);
                        }
                        open = open + 900;
                    }
                    $("#divtimeslotsavailable").show();
                    $("#divtimeslotsunavailable").hide();
                }
                else {
                    $("#divtimeslotsavailable").hide();
                    $("#divtimeslotsunavailable").show();
                }
            }
            else {
                $("#divtimeslotsavailable").hide();
                $("#divtimeslotsunavailable").hide();
            }
        }, function () {
        });
        return hasTime;
    }
    $('#new_online_booking_form_confirm').validate({
        rules: {
            online_booking_form_customer_attributes_first_name: 'required',
            online_booking_form_customer_attributes_last_name: 'required',
            online_booking_form_customer_attributes_normalized_contact_number: 'required',
            online_booking_form_customer_attributes_email: {
                required: true,
                email: true
            },
        },
        messages: {
            online_booking_form_customer_attributes_first_name: 'Please enter first name',
            online_booking_form_customer_attributes_last_name: 'Please enter last name',
            online_booking_form_customer_attributes_normalized_contact_number: 'Please enter contact number',
            online_booking_form_customer_attributes_email: 'Please enter email',
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
    //#region event
    $("#new_online_booking_form #btnBookNow").click(function () {
        if ($("#authenticity_token").val() != "") {
            if ($("#business_online_booking").val() == "1") {
                //get location, neu co 1  location thi khong cho location, nguoc lai chon location
                $.RequestAjax(urlGetLocation, JSON.stringify({
                    "BusinessID": parseInt($("#BusinessID").val()),
                    "Token": $("#authenticity_token").val()
                }), function (data) {
                    if (data.Result == true && data.Location.length > 0) {
                        if (data.Location.length == 1) {
                            ShowLocation = false;
                            LocationIDSelect = data.Location[0].LocationID;
                            LocationNameSelect = data.Location[0].LocationName;
                            LoadService();
                        }
                        else {
                            ShowLocation = true;
                            $("#divLocation").html('');
                            //goi load va chon location
                            $.each(data.Location, function () {
                                var linel = htmlItemLocation.replace("@LocationName", this.LocationName);
                                linel = linel.replace("@Address", this.StreetAddress == null ? "" : this.StreetAddress);
                                var element = $(linel);
                                element.attr("locationid", this.LocationID);
                                element.attr("locationname", this.LocationName);
                                $("#divLocation").append(element);
                            })
                            $("#online-booking-welcome").hide();
                            $("#online-booking-location-form").show();
                        }
                    }
                    else {
                        //chua xu ly do khong co location, truong hop nay khong co xay ra
                    }
                })
            }
            else {
                $("#online-booking-welcome").hide();
                $("#online-booking-services-form").hide();
                $("#online-booking-disabled-form").show();
            }
        }
    })

    $(document).on("click", "#online-booking-location-form .scrollable .item", function () {
        LocationIDSelect = $(this).attr("locationid");
        LocationNameSelect = $(this).attr("locationname");
        LoadService();
    })

    $("#online-booking-services-form #btnBack").on('click', function (event) {
        if (ShowLocation == true) {
            $("#online-booking-welcome").hide();
            $("#online-booking-location-form").show();
            $("#online-booking-services-form").hide();
            $("#online-booking-disabled-form").hide();
        }
        else {
            $("#online-booking-welcome").show();
            $("#online-booking-location-form").hide();
            $("#online-booking-services-form").hide();
            $("#online-booking-disabled-form").hide();
        }
    })

    $(document).on("click", "#new_online_booking_form .item", function () {
        if ($(this).attr("aria-checked") == "true") {
            $(this).attr("aria-checked", false);
            $(this).attr("class", "item");
        }
        else {
            //chan khong cho check >5
            if ($("#divfloatingsummary #countitem").text() == '' || parseInt($("#divfloatingsummary #countitem").text()) < 5) {
                $(this).attr("aria-checked", true);
                $(this).attr("class", "item selected");
            }
        }
        //show book
        var countitem = 0;
        var TotalAmount = 0;
        $("#new_online_booking_form .scrollable .item").each(function () {
            if ($(this).attr("aria-checked") == "true") {
                countitem = countitem + 1;
                TotalAmount = TotalAmount + parseFloat($(this).attr("Price"))
            }
        })
        totalprice = TotalAmount;
        if (countitem > 0) {
            if (countitem == 5) {
                $("#divfloatingsummary #divTextNormal").hide();
                $("#divfloatingsummary #divMaximum").show();
            }
            else {
                $("#divfloatingsummary #divTextNormal").show();
                $("#divfloatingsummary #divMaximum").hide();
            }

            $("#divfloatingsummary #countitem").html(countitem);
            $("#divfloatingsummary #itemtext").html(countitem == 1 ? 'item,' : 'items,');
            $("#divfloatingsummary #totalprice").html(Window.CurrencySymbol + $.number(TotalAmount, Window.NumberDecimal, '.', ','));
            $("#divregularsummary").show();
            $("#divfloatingsummary").show();
        }
        else {
            $("#divregularsummary").hide();
            $("#divfloatingsummary").hide();
        }
    })
    $("#online-booking-services-form #commit").click(function () {
        $("#online-booking-services-form").hide();
        lstService = [];
        services = [];
        TotalDuration = 0;
        $("#online-booking-services-form .item").each(function () {
            if ($(this).attr("aria-checked") == "true") {
                TotalDuration = TotalDuration + parseInt($(this).attr("Duration"));
                var same = false;
                for (i = 0; i < lstService.length; i++) {
                    if (lstService[i] == $(this).attr("ServiceID")) {
                        same = true;
                    }
                }
                if (same == false) {
                    lstService.push($(this).attr("ServiceID"));
                }
                services.push({
                    ServiceID: $(this).attr("ServiceID"),
                    Duration: $(this).attr("Duration"),
                    DurationName: $(this).attr("DurationName"),
                    Price: $(this).attr("Price"),
                    ServiceName: $(this).attr("ServiceName"),
                    RetailPrice: $(this).attr("RetailPrice"),
                    SpecialPrice: $(this).attr("SpecialPrice"),
                });
            }
        })
        if ($("#business_widget_allows_employee_selection").val() == "1") {
            //get staff
            $.RequestAjax(urlGetStaff, JSON.stringify({
                "BusinessID": parseInt($("#BusinessID").val()),
                "LocationID": LocationIDSelect,
                "Token": $("#authenticity_token").val(),
                lstService: lstService
            }), function (data) {
                $("#online-booking-employee-form #divStaff").html('');
                $("#online-booking-employee-form #divStaff").append(htmlStaffNoPreference)
                if (data.Result == true && data.Staff.length > 0) {
                    lstStaff = [];
                    lstStaff = data.Staff;
                    $.each(data.Staff, function () {
                        var html = htmlStaff.replace('STAFFNAME', this.FirstName + ' ' + (this.LastName == null ? '' : this.LastName));
                        var element = $(html);
                        element.attr("StaffID", this.UserID);
                        element.attr("StaffName", this.FirstName + ' ' + (this.LastName == null ? '' : this.LastName));
                        $("#online-booking-employee-form #divStaff").append(element[0].outerHTML);
                    })
                }
            }, function () {
            })
            $("#online-booking-employee-form").show();
        }
        else {
            LoadCalendar(0);
            $("#online-booking-time-slot-form").show();
        }
    })
    $(document).on("click", "#online-booking-employee-form .item", function () {
        //xu ly chon va bo chon
        $("#online-booking-employee-form .scrollable .item").each(function () {
            $(this).attr("class", "item one-line without-checkbox");
        })
        $(this).attr("class", "item one-line without-checkbox selected preselected");
        //gan id
        StaffIDSelect = $(this).attr("staffid");
        OrgStaffIDSelect = $(this).attr("staffid");
        staffname = $(this).attr("staffname");
        if (StaffIDSelect == 0)
            IsRequest = false
        else
            IsRequest = true;
        $("#online-booking-employee-form").hide();
        $("#online-booking-time-slot-form").show();
        LoadCalendar(0);
    })
    $("#online-booking-employee-form #btnBack").click(function () {
        $("#online-booking-services-form").show();
        $("#online-booking-employee-form").hide();
    })
    $("#online-booking-time-slot-form #btnBack").click(function () {
        $("#online-booking-time-slot-form").hide();
        if ($("#business_widget_allows_employee_selection").val() == "1") {
            //get staff
            $.RequestAjax(urlGetStaff, JSON.stringify({
                "BusinessID": parseInt($("#BusinessID").val()),
                "LocationID": LocationIDSelect,
                "Token": $("#authenticity_token").val(),
                lstService: lstService
            }), function (data) {
                $("#online-booking-employee-form #divStaff").html('');
                $("#online-booking-employee-form #divStaff").append(htmlStaffNoPreference)
                if (data.Result == true && data.Staff.length > 0) {
                    $.each(data.Staff, function () {
                        var html = htmlStaff.replace('STAFFNAME', this.FirstName + ' ' + (this.LastName == null ? '' : this.LastName));
                        var element = $(html);
                        element.attr("StaffID", this.UserID);
                        element.attr("StaffName", this.FirstName + ' ' + (this.LastName == null ? '' : this.LastName));
                        $("#online-booking-employee-form #divStaff").append(element[0].outerHTML);
                    })
                }
            }, function () {
            })
            $("#online-booking-employee-form").show();
        }
        else {
            $("#online-booking-services-form").show();
        }
    })
    $(".calendar-prev-week").on('click', function (event) {
        LoadCalendar(1);
    })
    $(".calendar-next-week").on('click', function (event) {
        LoadCalendar(2);
    })
    $("#new_online_booking_form #week-calendar .calendar-day").on('click', function (event) {
        $("#new_online_booking_form #week-calendar .calendar-day").each(function () {
            $(this).removeClass("selected");
        })
        $(this).addClass("selected");
        var date = moment($(this).find(".week-day-name").attr("date")).format("YYYY/MM/DD");
        dateselect = date;
        if (OrgStaffIDSelect == 0) {
            if (lstStaff.length > 0) {

                CalMinSlot(date);

                lstStaff.sort(function (a, b) {
                    var a1 = a.MinSlot;
                    var b1 = b.MinSlot;
                    if (a1 == b1) return 0;
                    return a1 > b1 ? 1 : -1;
                });
                LoadOpenHour(date, lstStaff[0].UserID);//lay phan tu dau tien
                //for (i = 0; i < lstStaff.length; i++) {
                //    if (LoadOpenHour(date, lstStaff[i].UserID) == true) {
                //        return false;
                //    }
                //}
            }
        }
        else {
            LoadOpenHour(date, OrgStaffIDSelect);
        }

    })
    $(document).on("click", "#online-booking-time-slot-form .item", function () {
        $("#online-booking-time-slot-form").hide();
        $("#online-booking-confirm-form").show();

        durationselect = parseInt($(this).find("#online_booking_form_time_start_in_seconds").attr("value"));

        //show infor
        $("#online-booking-confirm-form .summary-column").html("");
        $("#online-booking-confirm-form .summary-column").append('<div class="title">Your booking</div>');
        var htmlServiceSelect = '<div class="service-item open"><div class="title"></div><div class="subtitle"></div><div class="description"></div></div>'
        var htmlSummary = '<div class="summary-item"><div class="title"></div><div class="content">Wednesday, 22 Aug 2018 at  9:00</div></div>';
        $.each(services, function () {
            var element = $(htmlServiceSelect);
            element.find(".title").html(this.ServiceName + (this.DurationName != null && this.DurationName != "" ? " (" + this.DurationName + ")" : ""));
            element.find(".subtitle").html("with " + staffname);
            element.find(".description").html("");
            $("#online-booking-confirm-form .summary-column").append(element[0].outerHTML);
        });
        var element = $(htmlSummary);
        element.find(".title").html("Date");
        element.find(".content").html(moment(dateselect).format("dddd, DD MMM YYYY") + " at " + $(this).find("#divTimeName").text());
        $("#online-booking-confirm-form .summary-column").append(element[0].outerHTML);
        element = $(htmlSummary);
        element.find(".title").html("At");
        element.find(".content").html(LocationNameSelect);
        $("#online-booking-confirm-form .summary-column").append(element[0].outerHTML);
        element = $(htmlSummary);
        element.find(".title").html("Total price");
        element.find(".content").html(Window.CurrencySymbol + $.number(totalprice, Window.NumberDecimal, '.', ','));
        $("#online-booking-confirm-form .summary-column").append(element[0].outerHTML);

        var time = $(this).attr("value");
        var countDown = 300;
        var timer = setInterval(function () {
            countDown--;
            var minute = parseInt(countDown / 60);
            var second = countDown - (minute * 60);
            $("#divTimer").html(minute + ":" + (second < 10 ? "0" + second : second));
            if (countDown == -1) {
                $("#online-booking-confirm-form").hide();
                $("#online-booking-timeout-form").show();
                clearInterval(timer);
            }
        }, 1000);
    })
    $("#online-booking-confirm-form #btnBack").on('click', function (event) {
        $("#online-booking-time-slot-form").show();
        $("#online-booking-confirm-form").hide();
        LoadCalendar(3);
        if (OrgStaffIDSelect == 0) {
            if (lstStaff.length > 0) {
                for (i = 0; i < lstStaff.length; i++) {
                    if (LoadOpenHour(dateselect, lstStaff[i].UserID) == true) {
                        return false;
                    }
                }
            }
        }
        else {
            LoadOpenHour(dateselect, OrgStaffIDSelect);
        }
    })
    $("#online-booking-confirm-form #confirm-button").on('click', function (event) {
        if ($('#new_online_booking_form_confirm').valid()) {
            var Client = new Object();
            var Appointment = new Object();
            var AppointmentServices = [];
            //client
            Client["BusinessID"] = $("#BusinessID").val();
            Client["FirstName"] = $("#online_booking_form_customer_attributes_first_name").val();
            Client["LastName"] = $("#online_booking_form_customer_attributes_last_name").val();
            Client["MobileNumberDialCode"] = $("#online_booking_form_customer_attributes_normalized_contact_number").intlTelInput("getSelectedCountryData").dialCode;
            Client["MobileNumber"] = $("#online_booking_form_customer_attributes_normalized_contact_number").val();
            Client["Email"] = $("#online_booking_form_customer_attributes_email").val();

            //service
            var starttime = moment(dateselect).add(durationselect, 'seconds').format("YYYY/MM/DD HH:mm");
            var totalDuration = 0;
            $.each(services, function () {
                AppointmentServices.push({
                    BusinessID: $("#BusinessID").val(),
                    ServiceID: this.ServiceID,
                    ServiceName: this.ServiceName,
                    RetailPrice: this.RetailPrice,
                    SpecialPrice: this.SpecialPrice,
                    Price: this.Price,
                    StartTime: starttime,
                    EndTime: moment(starttime).add(this.Duration, 'seconds').format("YYYY/MM/DD HH:mm"),
                    Duration: this.Duration,
                    StaffID: StaffIDSelect,
                    IsRequest: IsRequest
                });
                starttime = moment(starttime).add(this.Duration, 'seconds').format("YYYY/MM/DD HH:mm");
                totalDuration = totalDuration + parseInt(this.Duration);
            });
            //appointment
            Appointment["BusinessID"] = $("#BusinessID").val();
            Appointment["ScheduledDate"] = moment(dateselect).format("YYYY/MM/DD");
            Appointment["CreateDate"] = moment().format("YYYY/MM/DD HH:mm");
            Appointment["LocationID"] = LocationIDSelect;
            Appointment["TotalAmount"] = totalprice;
            Appointment["TotalTimeInMinutes"] = totalDuration;
            Appointment["Status"] = "New";
            Appointment["Notes"] = $("#online_booking_form_notes").val();
            $.RequestAjax(urlSaveAppointment, JSON.stringify({
                Client: Client,
                Appointment: Appointment,
                AppointmentServices: AppointmentServices,
            }), function (data) {
                if (!JSON.parse(data)) {

                } else {
                    //toastr["success"](data.ErrorMessage, "Notification");
                    $("#online-booking-confirm-form").hide();
                    $("#online-booking-complete-form").show();
                }
            })
        }
    })
    $("#online_booking_form_customer_attributes_normalized_contact_number").keyup(function () {
        $("#online_booking_form_customer_attributes_normalized_contact_number").val(this.value.match(/[0-9]*/));
    });
    //#endregion
})
