
//#region Destop
class ModalAppointmentActionDestop {
    constructor(locationId, startTime, ScheduledDate, staffId, clientID) {
        this.AppointmentItem = {
            AppointmentID: 0,
            ScheduledDate: moment(ScheduledDate).format("YYYY/MM/DD"),
            ClientID: clientID ? clientID : 0,
            LocationID: locationId,
            TotalAmount: 0,
            TotalTimeInMinutes: 0,
            FrequencyType: "no-repeat",
            RepeatCount: null,
            EndRepeat: null,
            Notes: ""
        };
        this.AppointmentParent = null;
        this.StartTime = startTime;
        this.StaffID = staffId;
    }

    //#region Load
    LoadData() {
        var that = this;
        $.RequestAjaxText("/ContentHtml/Appointment/Action/Desktop/ClientDetail.html", function (data) { that.DestopClientDetail = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/Action/Desktop/ClientDetailInforEmty.html", function (data) { that.DestopClientDetailInforEmty = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/Action/Desktop/ClientEmty.html", function (data) { that.DestopClientEmty = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/Action/Desktop/ClientList.html", function (data) { that.DestopClientList = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/Action/Desktop/ClientSearchItem.html", function (data) { that.DestopClientSearchItem = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/Action/Desktop/ClientSeriveItem.html", function (data) { that.DestopClientSeriveItem = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/Action/Desktop/ConverContentLeft.html", function (data) { that.DestopConverContentLeft = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/Action/Desktop/Index.html", function (data) { that.DestopIndex = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/Action/Desktop/Repeat.html", function (data) { that.DestopRepeat = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/Action/Desktop/GroupServiceCombobox.html", function (data) { that.DestopGroupServiceCombobox = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/Action/Desktop/ServiceItemCombobox.html", function (data) { that.DestopServiceItemCombobox = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/Action/Desktop/StartTime12hCombobox.html", function (data) { that.DestopStartTime12hCombobox = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/Action/Desktop/StartTime24hCombobox.html", function (data) { that.DestopStartTime24hCombobox = data; });
    }
    LoadHtmlIndex() {
        $("#appointmentNewForm").html("");
        $("#appointmentNewForm").append(this.DestopIndex);
    }
    LoadHtmlClientEmpty() {
        $("#contentRight").html("");
        $("#contentRight").append(this.DestopClientEmty);
    }
    LoadHtmlClientList() {
        $("#contentRight").html("");
        $("#contentLeft").append(this.DestopConverContentLeft);
        $("#contentRight").append(this.DestopClientList);
    }
    LoadHtmlClientDetail(data) {
        $("#contentRight").html("");
        var html = this.DestopClientDetail.replace("@ClientID", data.ClientID).replace("@Represent", ($.trim(data.FirstName) == "" ? '' : data.FirstName.toString().charAt(0).toUpperCase()))
                    .replace("@FullName", ($.trim(data.FirstName) == "" ? '' : data.FirstName) + ($.trim(data.LastName) == "" ? '' : ' ' + data.LastName))
                    .replace("@Description", ($.trim(data.MobileNumber) == "" ? '' : data.MobileNumber) + ($.trim(data.Email) == "" ? '' : ', ' + data.Email))
                    .replace("@Appointments", data.Appointments).replace("@CurrencySymbol", Window.CurrencySymbol).replace("@TotalSales", data.TotalSales);
        $("#contentRight").append(html);
    }
    //#endregion

    //#region main
    ExcuteCreate() {
        this.Main();
        if (this.AppointmentItem.ClientID != 0)
            this.CreateClientDetail(this.AppointmentItem.ClientID);
        $("#modalAppointmentAction .modal-title").text("New Appointment");
    }
    ExcuteEdit(AppointmentID) {
        var that = this;
        this.Main();
        StartLoading();
        setTimeout(function () {
            $.RequestAjax("/Calendar/GetAppointmentBaseId", JSON.stringify({
                "AppointmentID": AppointmentID
            }), function (reponsive) {
                $("#modalAppointmentAction .modal-title").text("Edit Appointment");
                var appointment = reponsive.Appointment;
                var appointmentServices = reponsive.AppointmentServices;
                that.AppointmentParent = reponsive.AppointmentParent;
                //AppointmentItem
                that.AppointmentItem = {
                    AppointmentID: appointment.Id,
                    ScheduledDate: moment(appointment.ScheduledDate, "YYYY/MM/DD").toDate(),
                    ClientID: appointment.ClientID,
                    LocationID: appointment.LocationID,
                    TotalAmount: appointment.TotalAmount,
                    TotalTimeInMinutes: appointment.TotalTimeInMinutes,
                    FrequencyType: appointment.FrequencyType,
                    RepeatCount: appointment.RepeatCount,
                    FrequencyTypeOld: appointment.FrequencyType,
                    EndRepeat: appointment.EndRepeat ? moment(appointment.EndRepeat, "YYYY/MM/DD").toDate() : null,
                    Notes: appointment.Notes
                };
                $('[isdestop] [name="ScheduledDate"]').closest(".input-group").data('daterangepicker').setStartDate(moment(appointment.ScheduledDate, "YYYY/MM/DD").local().toDate());
                $('[isdestop] [name="ScheduledDate"]').closest(".input-group").trigger("apply.daterangepicker");
                $('[isdestop] [name="Notes"]').val(that.AppointmentItem.Notes);
                if (that.AppointmentItem.ClientID)
                    that.CreateClientDetail(that.AppointmentItem.ClientID);
                //AppointmentService
                $("#containt-service").html("");
                that.AddService(0);
                $.each(appointmentServices, function () {
                    var startime =
                    $(".containt-serivce:last").find("[name='rowService2']").show();
                    $(".containt-serivce:last").css("background-color", "white");
                    that.SetValueServiceItem(this);
                })

                if (that.AppointmentItem.RepeatCount) {
                    var dateAppointMent = moment(that.AppointmentParent ? that.AppointmentParent.ScheduledDate : that.AppointmentItem.ScheduledDate).startOf('day');
                    var unitFrequency = that.AppointmentItem.FrequencyType.toString().split(":")[0];
                    var numberFrequency = that.AppointmentItem.FrequencyType.toString().split(":")[1];
                    var textButton = "";
                    if (that.AppointmentItem.RepeatCount != "date" && that.AppointmentItem.RepeatCount != "ongoing") {
                        var repeatCount = that.AppointmentItem.RepeatCount.split(":")[1];
                        --repeatCount;
                        var prefixFrequency = unitFrequency == "daily" ? "days" : (unitFrequency == "weekly" ? "weeks" : "months");
                        textButton = "Repeats until " + dateAppointMent.add(repeatCount * numberFrequency, prefixFrequency).format("dddd, DD MMM YYYY");
                    } else if (that.AppointmentItem.RepeatCount == "date") {
                        var date = moment(that.AppointmentItem.EndRepeat).startOf('day');
                        var duration = moment.duration(date.diff(dateAppointMent));
                        var time = duration.asDays();
                        if (unitFrequency == "weekly")
                            time = duration.asWeeks();
                        else if (unitFrequency == "monthly")
                            time = duration.asMonths();
                        var repeatTime = parseInt(time) / parseInt(numberFrequency) + 1;
                        textButton = "Repeats " + repeatTime + " times";
                    } else if (that.AppointmentItem.RepeatCount == "ongoing")
                        textButton = "Repeats until " + dateAppointMent.add(1, "years").format("dddd, DD MMM YYYY");
                    else {
                        textButton = '<i class="fa fa-refresh"></i> Repeat';
                        $('[name="deleteRepeat"]').hide();
                        $("button[name='buttonRepeat']").removeClass("mr-4");
                    }
                    $("button[name='buttonRepeat']").html("<span>" + textButton + "</span>");
                    $("button[name='buttonRepeat']").addClass("mr-4");
                    $('[name="deleteRepeat"]').show();
                }
                $("#appointmentNewForm").find(".loading-modal-appointment").remove();
                that.CalculatorTotal();
                EndLoading();
            })
        }, 100)
    }
    Main() {
        //; debugger;
        if (!this.DestopClientDetail && !this.DestopClientDetailInforEmty && !this.DestopClientEmty && !this.DestopClientList && !this.DestopClientSearchItem && !this.DestopClientSeriveItem && !this.DestopConverContentLeft && !this.DestopIndex && !this.DestopRepeat)
            this.LoadData();
        this.LoadHtmlIndex();
        this.Repeate();
        this.CreateClientEmpty();
        $('[isdestop] [name="ScheduledDate"]').closest(".input-group").daterangepicker({
            "singleDatePicker": true,
            "opens": "center",
            "autoUpdateInput": false,
            "startDate": moment(this.AppointmentItem.ScheduledDate, "YYYY/MM/DD").toDate(),
            "endDate": moment(this.AppointmentItem.ScheduledDate, "YYYY/MM/DD").toDate(),
        });
        $('[isdestop] [name="ScheduledDate"]').val(moment(this.AppointmentItem.ScheduledDate).format("dddd, DD MMM YYYY"));
        $('[isdestop] [name="ScheduledDate"]').closest(".input-group").on('apply.daterangepicker', function (ev, picker) {
            var date = $(this).data('daterangepicker').startDate.format("dddd, DD MMM YYYY");
            $(this).find("[name='ScheduledDate']").val(date);
        });
        this.MainSave();
        this.Remove();
    }
    Remove() {
        var that = this;
        $('#modalAppointmentAction').on('hidden.bs.modal', function (e) {
            that.RemoveValidateForm();
            that.RemoveRepeate();
            that.RemoveClientDetail();
            that.RemoveClientSearch();
            that.RemoveClientEmpty();
        })
    }
    //#endregion

    //#region Repeate
    Repeate() {
        var that = this;
        var GetRepeateTime = function (dateStart, dateFinish, numberFrequency, unitFrequency) {
            var duration = moment.duration(dateFinish.diff(dateStart));
            var time = duration.asDays();
            if (unitFrequency == "weekly")
                time = duration.asWeeks();
            else if (unitFrequency == "monthly")
                time = duration.asMonths();
            return parseInt(time) / parseInt(numberFrequency) + 1;
        }
        $('[isdestop] [name="ScheduledDate"]').closest(".input-group").on('apply.daterangepicker', function (ev, picker) {
            if (that.AppointmentItem.RepeatCount != "date" && that.AppointmentItem.RepeatCount != "ongoing" && that.AppointmentItem.FrequencyType != "no-repeat") {
                var dateAppointMent = moment($(this).data('daterangepicker').startDate.toDate()).startOf('day');
                var unitFrequency = that.AppointmentItem.FrequencyType.toString().split(":")[0];
                var numberFrequency = that.AppointmentItem.FrequencyType.toString().split(":")[1];
                var repeatCount = that.AppointmentItem.RepeatCount.split(":")[1];
                var textButton;
                repeatCount = --repeatCount;
                var prefixFrequency = unitFrequency == "daily" ? "days" : (unitFrequency == "weekly" ? "weeks" : "months");
                textButton = "Repeats until " + dateAppointMent.add(repeatCount * numberFrequency, prefixFrequency).format("dddd, DD MMM YYYY");
                $("button[name='buttonRepeat']").html("<span>" + textButton + "</span>");
            }
        });
        $('[isdestop] [name="buttonRepeat"]').popover({
            html: true,
            placement: 'bottom',
            template: '<div class="popover" style="min-width: 400px; z-index: 3000" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
            content: this.DestopRepeat
        })
        $('[isdestop] [name="buttonRepeat"]').on('shown.bs.popover', function () {
            if (that.AppointmentItem.FrequencyType)
                $('[name="FrequencyType"]').val(that.AppointmentItem.FrequencyType);
            else
                $('[name="FrequencyType"]').val("no-repeat");

            if (that.AppointmentItem.RepeatCount) {
                $('[name="RepeatCount"]').val(that.AppointmentItem.RepeatCount);
                $('[name="RepeatCount"]').closest("div").show();
                $('[name="RepeatCount"]').closest("div").removeClass("col-6");
            }
            else {
                $('[name="RepeatCount"]').val("count:2");
                $('[name="RepeatCount"]').closest("div").hide();
            }

            $('[name="EndRepeat"]').daterangepicker({
                "singleDatePicker": true,
                "opens": "center",
                "format": "ddd, DD MMM",
                "autoUpdateInput": false,
                "isInvalidDate": function (arg) {
                    var dateAppointMent = moment($('[isdestop] [name="ScheduledDate"]').closest(".input-group").data('daterangepicker').startDate.toDate()).startOf('day');
                    if (moment(arg._d).isSameOrBefore(moment(dateAppointMent)))
                        return true;
                    else {
                        var valueFrequency = $('[name="FrequencyType"]').val();
                        var unitFrequency = valueFrequency.toString().split(":")[0];
                        var numberFrequency = valueFrequency.toString().split(":")[1];
                        var prefixFrequency = unitFrequency == "daily" ? "days" : (unitFrequency == "weekly" ? "weeks" : "months");
                        var subtractNumber = moment(arg.toDate()).diff(moment(dateAppointMent), prefixFrequency);
                        return !(subtractNumber % numberFrequency == 0 && moment(arg._d).isSame(moment(dateAppointMent).add(subtractNumber, prefixFrequency)));
                    }
                },
            });
            $('[name="EndRepeat"]').on('apply.daterangepicker', function (ev, picker) {
                var date = picker.startDate.format("ddd, DD MMM");
                $(this).val(date);
            });
            //; debugger;
            if (that.AppointmentItem.EndRepeat) {
                $('[name="EndRepeat"]').data('daterangepicker').setStartDate(moment(that.AppointmentItem.EndRepeat, "YYYY/MM/DD").toDate());
                $('[name="EndRepeat"]').data('daterangepicker').setEndDate(moment(that.AppointmentItem.EndRepeat, "YYYY/MM/DD").toDate());
                $('[name="EndRepeat"]').closest(".col-6").show();
                $('[name="RepeatCount"]').closest("div").addClass("col-6");
                $('[name="EndRepeat"]').val((moment(that.AppointmentItem.EndRepeat, "YYYY/MM/DD").format("ddd, DD MMM")));
            }
            else {
                $('[name="EndRepeat"]').data('daterangepicker').setStartDate(new Date());
                $('[name="EndRepeat"]').data('daterangepicker').setEndDate(new Date());
                $('[name="EndRepeat"]').closest(".col-6").hide();
            }
            $("body").append('<div class="modal-backdrop fade" id="removeRepeate" style="z-index:2000"></div>');
        })
        $(document).on('change', '[name="FrequencyType"]', function () {
            if ($(this).val() != "no-repeat") {
                $('[name="RepeatCount"]').closest("div").show("slow");
                $('[name="RepeatCount"]').closest("div").removeClass("col-6");
            }
            //else {
            //    $('[name="EndRepeat"]').closest(".col-6").hide();
            //    $('[name="RepeatCount"]').closest("div").hide();
            //}
            //$('[name="RepeatCount"]').val("count:2").trigger("change")
        })
        $(document).on('change', '[name="RepeatCount"]', function () {
            if ($(this).val() == "date") {
                $('[name="EndRepeat"]').closest(".col-6").show("slow");
                $('[name="RepeatCount"]').closest("div").addClass("col-6");
            }
            else {
                $('[name="RepeatCount"]').closest("div").removeClass("col-6");
                $('[name="EndRepeat"]').closest(".col-6").hide();
            }
        })
        $(document).on('click', '#removeRepeate', function () {
            $("#removeRepeate").remove();
            $('[isdestop] [name="buttonRepeat"]').popover('hide');
        })
        $(document).on('click', '#closePopover', function () {
            $('[isdestop] [name="buttonRepeat"]').popover('hide');
            $("#removeRepeate").remove();
        })
        $(document).on('click', '#sumbitPopover', function () {
            var dateAppointMent = moment($('[isdestop] [name="ScheduledDate"]').closest(".input-group").data('daterangepicker').startDate.toDate()).startOf('day');
            var valueFrequency = $('[name="FrequencyType"]').val();
            var unitFrequency = valueFrequency.toString().split(":")[0];
            var numberFrequency = valueFrequency.toString().split(":")[1];
            var valueEnd = $('[name="RepeatCount"]').val();
            var textButton = "";
            $('[name="deleteRepeat"]').show();
            $("button[name='buttonRepeat']").addClass("mr-4");
            if (valueEnd != "date" && valueEnd != "ongoing" && valueFrequency != "no-repeat") {
                var repeatCount = valueEnd.split(":")[1];
                --repeatCount;
                var prefixFrequency = unitFrequency == "daily" ? "days" : (unitFrequency == "weekly" ? "weeks" : "months");
                textButton = "Repeats until " + dateAppointMent.add(repeatCount * numberFrequency, prefixFrequency).format("dddd, DD MMM YYYY");
            } else if (valueEnd == "date") {
                var date = moment($('input[name="EndRepeat"]').data('daterangepicker').startDate.toDate()).startOf('day');
                var repeatTime = GetRepeateTime(dateAppointMent, date, numberFrequency, unitFrequency);
                textButton = "Repeats " + repeatTime + " times";
            } else if (valueEnd == "ongoing") {
                var datefinish = moment().startOf('day').add(1, "years");
                var repeatTime = GetRepeateTime(dateAppointMent, datefinish, numberFrequency, unitFrequency);
                --repeatTime;
                var prefixFrequency = unitFrequency == "daily" ? "days" : (unitFrequency == "weekly" ? "weeks" : "months");
                textButton = "Repeats until " + dateAppointMent.add(repeatTime * numberFrequency, prefixFrequency).format("dddd, DD MMM YYYY");
            }
            else {
                textButton = '<i class="fa fa-refresh"></i> Repeat';
                $('[name="deleteRepeat"]').hide();
                $("button[name='buttonRepeat']").removeClass("mr-4");
            }
            $("button[name='buttonRepeat']").html("<span>" + textButton + "</span>");
            $('[isdestop] [name="buttonRepeat"]').popover('hide');
            $("#removeRepeate").remove();
        })
        $(document).on('click', '[name="deleteRepeat"]', function () {
            $("button[name='buttonRepeat']").html('<i class="fa fa-refresh"></i> Repeat');
            $("button[name='buttonRepeat']").removeClass("mr-4");
            $(this).hide();
        });
    }
    RemoveRepeate() {
        $(document).off('change', '[name="FrequencyType"]');
        $(document).off('change', '[name="RepeatCount"]');
        $(document).off('click', '#removeRepeate');
        $(document).off('click', '#closePopover');
        $(document).off('click', '#sumbitPopover');
        $(document).off('click', '[name="deleteRepeat"]');
    }
    //#endregion

    //#region Client Empty
    CreateClientEmpty() {
        var that = this;
        that.LoadHtmlClientEmpty();
        that.CalculatorTotal();
        if ($(".containt-serivce").length == 0)
            that.AddService(that.StartTime, that.StaffID);
        $("[isdestop] [name='searchClient']").focusin(function () {
            that.RemoveClientEmpty();
            that.CreateClientSearch();
        })
    }
    RemoveClientEmpty() {
        $("#contentRight").html("");
        $("[isdestop] [name='searchClient']").off("focusin");
    }
    //#endregion

    //#region Client Search
    CreateClientSearch() {
        var that = this;
        this.LoadHtmlClientList();
        this.SearchClient();
        $('[isdestop] [name="searchClient"]').focus();
        //event
        $('[isdestop] [name="searchClient"]').keyup(function () {
            that.SearchClient();
        })
        $("#buttonCloseSearchClient").click(function () {
            that.RemoveClientSearch();
            that.CreateClientEmpty();
        })
        $(document).keyup(function (e) {
            if (e.keyCode == 27) {
                that.RemoveClientSearch();
                that.CreateClientEmpty();
            }
        })
        $("#buttonCreateClient").click(function () {
            var nameClient = $.trim($('[isdestop] [name="searchClient"]').val());
            var arrayNameClient = nameClient.split(" ");
            var firstName = "";
            var lastName = "";
            if (arrayNameClient.length > 0) {
                firstName = arrayNameClient[0];
                if (arrayNameClient.length > 1) {
                    arrayNameClient.shift();
                    lastName = arrayNameClient.join(" ");
                }
            }
            ReferClient(firstName, lastName);
            SaveClient(function (data) {
                that.RemoveClientSearch();
                that.CreateClientDetail(data.Client.ClientID);
            });
        })
    }
    RemoveClientSearch() {
        $("#searchBackdropContentRight").remove();
        $("#contentRight").html("");
        $('[isdestop] [name="searchClient"]').trigger("focusout");
        $("#buttonCloseSearchClient").off("click")
        $('[isdestop] [name="searchClient"]').off("keyup")
        $(document).off("keyup")
        $("#buttonCreateClient").off("click")
        $("[isdestop] [name='contantClientItem']").off("click");
    }
    SearchClient() {
        var that = this;
        $.RequestAjax("/Home/GetDataClientSearch", JSON.stringify({ search: $.trim($('[isdestop] [name="searchClient"]').val()), locationId: that.AppointmentItem.LocationID }), function (data) {
            that.ListClientSearch = data.Result;
            var length = data.Result.length;
            $("#listClientSearch [name='contantClientItem']").remove();
            $.each(data.Result, function (index, item) {
                var mobilenumber = (item.MobileNumber == null || item.MobileNumber == "") ? "" : ("+" + item.MobileNumberDialCode + " " + item.MobileNumber);
                var email = (item.Email == null || item.Email == "") ? "" : item.Email;
                var html = that.DestopClientSearchItem.toString().replace("@BorderTop", (index == length ? '' : 'border-top'))
                    .replace("@ClientID", item.ClientID)
                    .replace("@Represent", ($.trim(item.FirstName) == "" ? '' : item.FirstName.toString().charAt(0).toUpperCase()))
                    .replace("@FullName", ($.trim(item.FirstName) == "" ? '' : item.FirstName) + ($.trim(item.LastName) == "" ? '' : ' ' + item.LastName))
                    .replace("@Description", (mobilenumber == "" && email == "") ? "" : (mobilenumber == "" ? email : (email == "" ? mobilenumber : (mobilenumber + ", " + email))));
                $("#listClientSearch").append(html);
                $("#listClientSearch [name='contantClientItem']:last").show("slow");
                $("[isdestop] [name='contantClientItem']:last").click(function () {
                    that.RemoveClientSearch();
                    that.CreateClientDetail(parseInt($(this).attr("clientid")));
                })
            })
        })
    }
    //#endregion

    //#region Client Detail
    CreateClientDetail(clientId) {
        var that = this;
        var Excute = function () {
            var clientDestop = new ClientDetailDestop(clientId, true);
            var renposive = clientDestop.CreateClient(function (renposive) {
                $("#contentRight").html("");
                $("#contentRight").append(renposive.Html);
                var ClientId = renposive.Data.Client.ClientID;
                that.SetValueClientId_AppointmentItem(ClientId);
                that.CalculatorTotal();
                $("#divTabAppointment").css("max-height", "calc(100vh - 400px)")
                $("#divTabProduct").css("max-height", "calc(100vh - 400px)")
                $("#divTabInvoice").css("max-height", "calc(100vh - 400px)")
                $("#buttonRemoveClient").click(function () {
                    that.RemoveClientDetail();
                    that.CreateClientEmpty();
                })
                $("#buttonEditClient").click(function () {
                    LoadClient(clientId);
                    SaveClient(function (data) {
                        that.CreateClientDetail(data.Client.ClientID);
                    });
                })
                $("#btnTabAppointments").click(function () {
                    $("#btnTabAppointments").removeClass("oEUy3Y").addClass("oEUy3Y");
                    $("#btnTabProducts").removeClass("oEUy3Y");
                    $("#btnTabInvoices").removeClass("oEUy3Y");
                    $("#btnTabInfo").removeClass("oEUy3Y");

                    $("#divTabAppointment").css('display', 'block');
                    $("#divTabProduct").css('display', 'none');
                    $("#divTabInvoice").css('display', 'none');
                    $("#divTabInfo").css('display', 'none');
                })
                $("#btnTabProducts").click(function () {
                    $("#btnTabProducts").removeClass("oEUy3Y").addClass("oEUy3Y");
                    $("#btnTabAppointments").removeClass("oEUy3Y");
                    $("#btnTabInvoices").removeClass("oEUy3Y");
                    $("#btnTabInfo").removeClass("oEUy3Y");

                    $("#divTabProduct").css('display', 'flex');
                    $("#divTabAppointment").css('display', 'none');
                    $("#divTabInvoice").css('display', 'none');
                    $("#divTabInfo").css('display', 'none');
                })
                $("#btnTabInvoices").click(function () {
                    $("#btnTabInvoices").removeClass("oEUy3Y").addClass("oEUy3Y");
                    $("#btnTabAppointments").removeClass("oEUy3Y");
                    $("#btnTabProducts").removeClass("oEUy3Y");
                    $("#btnTabInfo").removeClass("oEUy3Y");

                    $("#divTabInvoice").css('display', 'flex');
                    $("#divTabAppointment").css('display', 'none');
                    $("#divTabProduct").css('display', 'none');
                    $("#divTabInfo").css('display', 'none');
                })
                $("#btnTabInfo").click(function () {
                    $("#btnTabInfo").removeClass("oEUy3Y").addClass("oEUy3Y");
                    $("#btnTabAppointments").removeClass("oEUy3Y");
                    $("#btnTabProducts").removeClass("oEUy3Y");
                    $("#btnTabInvoices").removeClass("oEUy3Y");

                    $("#divTabInfo").css('display', 'flex');
                    $("#divTabAppointment").css('display', 'none');
                    $("#divTabProduct").css('display', 'none');
                    $("#divTabInvoice").css('display', 'none');
                })
            });
        }
        if (typeof ClientDetailDestop != "function") {
            $.getScript("/Scripts/calendar/client.js").done(function () {
                Excute();
            }).fail(function () {
                console.log("Load file js fail");
            })
        } else
            Excute();
    }
    RemoveClientDetail() {
        $("#contentRight").html("");
        $("#buttonRemoveClient").off("click")
        $("#buttonEditClient").off("click")
        $("#btnTabAppointments").off("click")
        $("#btnTabProducts").off("click")
        $("#btnTabInvoices").off("click")
        $("#btnTabInfo").off("click")
    }
    //#endregion

    //#region Service item
    LoadComboboxSerivce(search, comboboxService) {
        var that = this;
        $.RequestAjax("/Calendar/GetComboboxServiceAppointment", JSON.stringify({ search: search }), function (data) {
            var containerService = $(comboboxService).closest("div:not(.input-group)").find(".container-list-service");
            containerService.html("");
            $(comboboxService).css("z-index", "3000");
            var arrayData = data.Result;
            $.each(arrayData, function (index, item) {
                containerService.append(that.DestopGroupServiceCombobox.replace("@GroupName", item.ServiceGroupName));
                $.each(item.Service, function () {
                    var serviceItem = this;
                    containerService.append(that.DestopServiceItemCombobox.replace("@AppointmentColor", item.AppointmentColor).replace("@ServiceName", this.ServiceName).replace("@SpecialPrice", $.FormatNumberMoney(parseInt(this.SpecialPrice) == 0 ? this.RetailPrice : this.SpecialPrice)).replace("@DurationName", this.DurationName ? this.DurationName : "")
                        .replace("@RetailPrice", $.FormatNumberMoney(parseInt(this.SpecialPrice) == 0 ? "" : this.RetailPrice)).replace("@ServiceId", this.ServiceID).replace("@Duration", this.Duration));
                    if (parseInt(this.SpecialPrice) > 0)
                        $(".containt-serivce:last").find("[name='retail-price']").css("text-decoration", "line-through");
                    $("#containt-service .service-item[serviceid='" + this.ServiceID + "'][duration='" + this.Duration + "']").click(function () {
                        that.RemoveComboboxSerivce(containerService, comboboxService, serviceItem);
                        $(comboboxService).attr("serviceid", serviceItem.ServiceID);
                        $(comboboxService).attr("specialprice", serviceItem.SpecialPrice);
                        $(comboboxService).attr("retailprice", serviceItem.RetailPrice);
                        $(comboboxService).attr("duration", serviceItem.Duration);
                        $(comboboxService).attr("price", (parseInt(serviceItem.SpecialPrice) > 0 ? serviceItem.SpecialPrice : serviceItem.RetailPrice));
                        that.SetValueDuration($(this).attr("duration"), $(comboboxService).closest(".containt-serivce").find('[name="Duration"]')[0]);
                        $(comboboxService).trigger("change");
                    });
                })
            })
            $(containerService).show("slow", function () {
                var top = parseInt($(this).closest(".col-9").offset().top);
                var bottom = parseInt($(window).height() - top);
                var heigth = top > bottom ? top : bottom;
                if (top > bottom) {
                    var height = (top - (45 + 10));
                    height = height > $(this).height() ? $(this).height() : height;
                    $(this).css("margin-bottom", "45px");
                    $(this).css("bottom", "0px");
                    $(this).css("height", height + "px");
                } else {
                    var height = (bottom - (75 + 10));
                    height = height > $(this).height() ? $(this).height() : height;
                    $(this).css("margin-top", "75px");
                    $(this).css("top", "0px");
                    $(this).css("height", height + "px");
                }
            });
            $(comboboxService).closest("div:not(.input-group)").append('<div class="modal-backdrop fade" name="removeComboboxService" style="z-index:2000"></div>');
            $("[name='removeComboboxService']").click(function () {
                var seriviceItem;
                var serviceid = $(comboboxService).attr("serviceid");
                if (serviceid && serviceid != "0") {
                    $.each(arrayData, function () {
                        $.each(this.Service, function () {
                            if (this.ServiceID == serviceid)
                                seriviceItem = this;
                        })
                    })
                }
                that.RemoveComboboxSerivce(containerService, comboboxService, seriviceItem);
            })
        })
    }
    RemoveComboboxSerivce(containerService, combobox, service) {
        $(containerService).html("");
        $(containerService).hide();
        $(combobox).css("z-index", "0");
        $("[name='removeComboboxService']").remove();
        if (service)
            this.GetTextComboboxService(service, combobox);
    }
    CalculatorTotal() {
        var totalPrice = 0;
        var totalDuration = 0;
        $("#containtTotal").html("");
        var seletor = "";
        if ($("[name='ServiceID']").length == 1)
            seletor = "[name='ServiceID']";
        else
            seletor = "[name='ServiceID']:not(:last)";
        $(seletor).each(function () {
            var duration = $(this).closest(".containt-serivce").find("[name='Duration']").val();
            if ($(this).attr("price")) {
                totalDuration += parseInt(duration);
                totalPrice += parseFloat($(this).attr("price"));
            }
        })
        this.SetValueTotal_AppointmentItem(totalPrice, totalDuration);
        $("#containtTotal").append("<h4><strong>Total: " + $.FormatNumberMoney(totalPrice) + "</strong> (" + this.GetTextDuration(totalDuration) + ")</h4>")
    }
    RefreshNumberService() {
        var length = $(".containt-serivce").length;
        $(".containt-serivce").each(function (index, item) {
            $(item).find(".number-service").text(length != 1 && length - 1 == index ? "" : index + 1);
        })
    }
    GetTextComboboxService(service, combobox) {
        $(combobox).attr("serviceid", service.ServiceID);
        $(combobox).val(service.ServiceName + " (" + service.DurationName + ", " + $.FormatNumberMoney(parseInt(service.SpecialPrice) > 0 ? service.SpecialPrice : service.RetailPrice) + ") ")
    }
    GetTextDuration(duration) {
        var minutuesDuration = duration / 60;
        var hour = parseInt(minutuesDuration / 60);
        return (hour >= 1 ? (hour + "h ") : "") + (minutuesDuration % 60) + "min";
    }
    SetValueStartTime(value, starttime) {
        var valueOpitionFinish = parseInt($(starttime).find("option:last").attr("value"));
        $(starttime).val(valueOpitionFinish);
        $(starttime).find("option").each(function (index, item) {
            var valueOption = parseInt($(item).attr("value"));
            if (parseInt(value) <= valueOption) {
                $(starttime).val(valueOption);
                return false;
            }
        })
    }
    SetValueDuration(value, duration) {
        var valueOpitionFinish = parseInt($(duration).find("option:last").attr("value"));
        $(duration).val(valueOpitionFinish);
        $(duration).find("option").each(function (index, item) {
            var valueOption = parseInt($(item).attr("value"));
            if (parseInt(value) <= valueOption) {
                $(duration).val(valueOption);
                return false;
            }
        })
    }
    GetSecond(time) {
        var hours = time.hour() * 60;
        return hours * 60 + time.minute() * 60;
    }
    ReferStarTimeLast() {
        var length = $(".containt-serivce").length;
        var statTime = parseInt($(".containt-serivce:eq(" + (length - 2) + ")").find("[name='StartTime']").val());
        var duration = parseInt($(".containt-serivce:eq(" + (length - 2) + ")").find("[name='Duration']").val());
        this.SetValueStartTime(statTime + duration, $(".containt-serivce:last").find('[name="StartTime"]')[0]);
    }
    NotifyCheckDateWorkingUserExist(contanitSeriveItem) {
        var that = this;
        contanitSeriveItem.find("[name='ServiceID']").closest(".input-group").find(".ui-pnotify").remove();
        var valueComboboxStarTime = contanitSeriveItem.find("[name='StartTime']").val();
        var valueComboboxDuration = contanitSeriveItem.find("[name='Duration']").val();
        var comboboxStaff = contanitSeriveItem.find("[name='StaffID']");
        var valueStaff = comboboxStaff.val();
        if (valueComboboxDuration && valueComboboxDuration != "" && valueComboboxStarTime && valueComboboxStarTime != "" && valueStaff && valueStaff != "") {
            var startTimeWorkingHour = moment([2000, 0, 1]);
            var endTimeWorkingHour = moment([2000, 0, 1]);
            var dateWorkingHour = moment(this.AppointmentItem.ScheduledDate);
            var dateBlockTime = moment(this.AppointmentItem.ScheduledDate);
            var startTimeBlockTime = moment(dateBlockTime.format("YYYY/MM/DD"), "YYYY/MM/DD");
            var endTimeBlockTime = moment(dateBlockTime.format("YYYY/MM/DD"), "YYYY/MM/DD");
            startTimeWorkingHour.add(valueComboboxStarTime, "seconds");
            endTimeWorkingHour.add(parseInt(valueComboboxStarTime) + parseInt(valueComboboxDuration), "seconds");
            startTimeBlockTime.add(valueComboboxStarTime, "seconds");
            endTimeBlockTime.add(parseInt(valueComboboxStarTime) + parseInt(valueComboboxDuration), "seconds");
            $.RequestAjax("/Calendar/CheckDateWorkingUserExist", JSON.stringify({
                UserID: valueStaff,
                StartTimeWorkingHour: startTimeWorkingHour.local().toDate(),
                EndTimeWorkingHour: endTimeWorkingHour.local().toDate(),
                DateWorkingHour: dateWorkingHour.local().toDate(),
                StartTimeBlockTime: startTimeBlockTime.local().toDate(),
                EndTimeBlockTime: endTimeBlockTime.local().toDate(),
                DateBlockTime: dateBlockTime.local().toDate(),
                LocationID: that.AppointmentItem.LocationID,
            }), function (renponsive) {
                var text = "";
                var textNameStaff = comboboxStaff.find("option[value='" + comboboxStaff.val() + "']:first").text();
                if (!JSON.parse(renponsive.CheckBlockTime))
                    text += "<p>" + textNameStaff + " has a blocked time at " + startTimeWorkingHour.format("HH:mm") + ", but you can still book them." + "</p>";
                if (!JSON.parse(renponsive.CheckWorkingHour))
                    text += "<p>" + textNameStaff + " isn’t working between " + startTimeWorkingHour.format("HH:mm") + " and " + endTimeWorkingHour.format("HH:mm") + ", but you can still book them." + "</p>";
                if (text != "") {
                    var containtComboboxService = contanitSeriveItem.find("[name='ServiceID']").closest("div");
                    $.InStallNotifyElement(containtComboboxService[0], "", text, false, "45px", containtComboboxService.width(), "#EAF5FC", true);
                }
            });
        }
    }
    AddService(valueStartTime, staffId) {
        var that = this;
        $("#containt-service").append(this.DestopClientSeriveItem.replace("@ContentHtml", $.trim(window.TimeFormat) == "24" ? this.DestopStartTime24hCombobox : this.DestopStartTime12hCombobox));
        //; debugger;
        $("[name='deleteService']").hide();
        if ($(".containt-serivce").length > 2) {
            $("[name='deleteService']").show();
            $("[name='deleteService']:last").hide();
        }
        if ($(".containt-serivce").length > 1) {
            var staffOption = $(".containt-serivce:eq(" + ($(".containt-serivce").length - 2) + ")").find("[name='StaffID'] option");
            $(".containt-serivce:last").find("[name='StaffID']").append(new Option(staffOption.text(), staffOption.attr("value")));
            $(".containt-serivce:last").find("[name='StaffID']").val($(staffOption).attr("value"));
            $(".containt-serivce:last").find("[name='rowService2']").hide();
            $(".containt-serivce:last").css("background-color", "#F7F7F8")
        }
        if (valueStartTime)
            that.SetValueStartTime(valueStartTime, $(".containt-serivce:last").find('[name="StartTime"]')[0]);
        else
            that.ReferStarTimeLast();
        $("#containt-service [name='StaffID']:last").InStallSelect2('/Home/LoadSelect2ForUserLocationBooking', 20, 'Select staff', { "LocationId": that.AppointmentItem.LocationID }, null, null, null, null, null, null, null, function (data, params, element) {
            var contanitStaff = $(element).closest(".containt-serivce").find('[name="containtStaff"]');
            var inputIsRequestWidth = contanitStaff.find(".input-group-prepend").width();
            contanitStaff.find("span.select2-container").css("width", (contanitStaff.width() - inputIsRequestWidth) + "px");
        });
        $("#containt-service [name='ResourceID']:last").InStallSelect2('/Calendar/GetComboboxResourceAppointment', 20, 'Select Resource', null, null, null, null, null, function (params) {
            var ServiceID = $(this).closest(".containt-serivce").find("[name='ServiceID']").attr("serviceid");
            return {
                pageSize: 20,
                pageNum: params.page ? params.page : 0,
                searchTerm: params.term ? params.term : "",
                ServiceID: ServiceID ? ServiceID : 0,
                LocationID: that.AppointmentItem.LocationID
            };
        }, null, true, function (data, params, element) {
            //; debugger;
            var contanitStaff = $(element).closest(".containt-serivce").find('[name="containtStaff"]');
            var contanitResource = $(element).closest(".containt-serivce").find('[name="containtResource"]');
            var inputIsRequestWidth = contanitStaff.find(".input-group-prepend").width();
            if (data.Total == 0) {
                contanitStaff.removeClass("min-width-50");
                contanitStaff.addClass("min-width-100");
                contanitResource.hide("slow");
            } else {
                contanitStaff.removeClass("min-width-100");
                contanitStaff.addClass("min-width-50");
                contanitResource.show("slow");
            }
            contanitStaff.find("span.select2-container").css("width", (contanitStaff.width() - inputIsRequestWidth) + "px");
            contanitResource.find("span.select2-container").css("width", contanitResource.width() + "px");
        });
        if (staffId)
            $("#containt-service [name='StaffID']:last").SetValueSelect2ID(staffId);
        this.RefreshNumberService();
        $("[name='deleteService']").click(function () {
            $(this).closest(".containt-serivce").remove();
            if ($(".containt-serivce").length > 2)
                $("[name='deleteService']:not(:last)").show();
            else
                $("[name='deleteService']").hide();
            that.RefreshNumberService();
            that.CalculatorTotal();
        })
        $("#containt-service [name='containtStaff']:last .input-group-prepend").click(function () {
            var checkBox = $(this).find("input[type='checkbox']")[0];
            checkBox.checked = !checkBox.checked;
        })
        $("[name='ServiceID']:last").keypress(function () {
            that.LoadComboboxSerivce($(this).val(), this);
        })
        $("[name='ServiceID']:last").focusin(function () {
            $(this).val("");
            that.LoadComboboxSerivce("", this);
        })
        $("[name='Duration']:last").change(function () {
            that.CalculatorTotal();
        })
        $("[name='Duration']:last, [name='StartTime']:last").change(function () {
            var length = $(".containt-serivce").length;
            if (length > 1 && $(this).closest(".containt-serivce").index() == length - 2)
                that.ReferStarTimeLast();
        })
        $("[name='Duration']:last, [name='StartTime']:last, [name='StaffID']:last, [name='ServiceID']:last").change(function () {
            that.NotifyCheckDateWorkingUserExist($(this).closest(".containt-serivce"));
        })
        $("[name='ServiceID']:last, [name='StaffID']:last").change(function () {
            if ($(this).closest(".containt-serivce").is(".containt-serivce:last")) {
                var staffElemnt = $(this).closest(".containt-serivce").find("[name='StaffID']");
                var serviceElemnt = $(this).closest(".containt-serivce").find("[name='ServiceID']");
                $(".containt-serivce:last").find("[name='rowService2']").show();
                $("#containt-service [name='StaffID']:last").InStallSelect2('/Home/LoadSelect2ForUserLocationBooking', 20, 'Select staff', { "LocationId": that.AppointmentItem.LocationID }, null, null, null, null, null, null, null, function (data, params, element) {
                    var contanitStaff = $(element).closest(".containt-serivce").find('[name="containtStaff"]');
                    var inputIsRequestWidth = contanitStaff.find(".input-group-prepend").width();
                    contanitStaff.find("span.select2-container").css("width", (contanitStaff.width() - inputIsRequestWidth) + "px");
                });
                $(".containt-serivce:last").css("background-color", "white");
                if ($(serviceElemnt).attr("serviceid") != "" && $(serviceElemnt).attr("serviceid") != null && $(serviceElemnt).attr("serviceid") != undefined && $(staffElemnt).val() != null && $(staffElemnt).val() != undefined && $(staffElemnt).val() != "") {
                    that.AddService();
                    if ($(this).is("[name='ServiceID']")) {
                        if ($("[name='ServiceID']").length > 2)
                            $(".containt-serivce [name='deleteService']:not(:last)").show();
                        else
                            $(".containt-serivce [name='deleteService']").hide();
                    }
                }
            }
            if ($(this).is("[name='ServiceID']")) {
                var Resource = $(this).closest(".containt-serivce").find("[name='ResourceID']");
                Resource.val(null).trigger("change");
                Resource.select2("open");
                Resource.select2("close");
                that.CalculatorTotal();
            }
        })
    }
    SetValueServiceItem(item) {
        var appointmentService = $(".containt-serivce:last");
        appointmentService.attr("appointmentserviceid", item.AppointmentServiceID);
        item.DurationName = this.GetTextDuration(item.Duration);
        appointmentService.find("[name='IsRequest']")[0].checked = item.IsRequest;
        var service = appointmentService.find('[name="ServiceID"]');
        service.attr("serviceid", item.ServiceID);
        service.attr("specialprice", item.SpecialPrice);
        service.attr("retailprice", item.RetailPrice);
        service.attr("duration", item.Duration);
        service.attr("price", (parseInt(item.SpecialPrice) > 0 ? item.SpecialPrice : item.RetailPrice));
        this.GetTextComboboxService(item, service);
        this.SetValueDuration(item.Duration, appointmentService.find('[name="Duration"]')[0]);
        this.SetValueStartTime(this.GetSecond(moment(item.StartTime).startOf('day').add(item.StartTimeInSecond, "seconds")), appointmentService.find('[name="StartTime"]')[0]);
        var staff = appointmentService.find('[name="StaffID"]');
        staff.SetValueSelect2ID(item.StaffID);
        staff.select2("open");
        staff.select2("close");
        var resource = appointmentService.find('[name="ResourceID"]');
        resource.SetValueSelect2ID(item.ResourceID);
        resource.select2("open");
        resource.select2("close");
        if (item.ResourceID)
            this.CalculatorTotal();
    }
    //#endregion

    //#region Save
    ValidateForm() {
        var seletor = $(".containt-serivce").length == 1 ? ".containt-serivce" : ".containt-serivce:not(:last)";
        $('#appointmentNewForm').validate({
            messages: {
                Email: 'Please enter a valid email address',
                Password: {
                    required: 'Please provide a password',
                    minlength: 'Your password must be at least 6 characters long'
                },
            },
            errorElement: 'em',
            errorPlacement: function (error, element) {
                error.addClass('invalid-feedback');
                element.closest('div').append(error);
            },
            highlight: function (element, errorClass, validClass) {
                $(element).addClass('is-invalid').removeClass('is-valid');
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).addClass('is-valid').removeClass('is-invalid');
            },
        });
        $(seletor).find("[name='Duration']").rules("add", {
            requiredselect: "",
            messages: {
                requiredselect: 'Duration is required',
            }
        });
        $(seletor).find("[name='ServiceID']").rules("add", {
            requiredservice: "",
            messages: {
                requiredservice: 'Service is required',
            }
        });
        $(seletor).find("[name='StaffID']").rules("add", {
            requiredselect: "",
            messages: {
                requiredselect: 'Employee is required',
            },
        });
        return $(seletor).find("[name='Duration']").valid() && $(seletor).find("[name='ServiceID']").valid() && $(seletor).find("[name='StaffID']").valid()
    }
    RemoveValidateForm() {
        var seletor = $(".containt-serivce").length == 1 ? ".containt-serivce" : ".containt-serivce:not(:last)";
        $(seletor).find("[name='Duration']").rules("remove");
        $(seletor).find("[name='ServiceID']").rules("remove");
        $(seletor).find("[name='StaffID']").rules("remove");
        $(document).off("click", "#saveButton");
        $(document).off("click", "#saveButtonCheckOut");
    }
    CreateMethodVaildate() {
        $.validator.addMethod("requiredselect", function (value, element, arg) {
            return value != null && value != "" && value != "0";
        });
        $.validator.addMethod("requiredservice", function (value, element, arg) {
            return $(element).attr("serviceid");
        });
    }
    EventAppointmentItem() {
        var that = this;
        $('[isdestop] [name="ScheduledDate"]').closest(".input-group").on('apply.daterangepicker', function (ev, picker) {
            that.AppointmentItem.ScheduledDate = $(this).data('daterangepicker').startDate.local().format("YYYY/MM/DD");
        });
        $(document).on("click", "#sumbitPopover", function () {
            that.AppointmentItem.FrequencyType = $('[name="FrequencyType"]').val();
            that.AppointmentItem.RepeatCount = that.AppointmentItem.FrequencyType == "no-repeat" ? null : $('[name="RepeatCount"]').val();
            that.AppointmentItem.EndRepeat = that.AppointmentItem.FrequencyType != "no-repeat" && that.AppointmentItem.RepeatCount == "date" ? $('[name="EndRepeat"]').data('daterangepicker').startDate.format("YYYY/MM/DD") : null;
        })
        $(document).on('click', '[name="deleteRepeat"]', function () {
            that.AppointmentItem.FrequencyType = "no-repeat";
            that.AppointmentItem.RepeatCount = null;
            that.AppointmentItem.EndRepeat = null;
        });
        $('[isdestop] [name="Notes"]').change(function () {
            that.AppointmentItem.Notes = $(this).val();
        });
    }
    SetValueClientId_AppointmentItem(ClientID) {
        this.AppointmentItem.ClientID = ClientID;
    }
    SetValueTotal_AppointmentItem(TotalAmount, TotalTimeInMinutes) {
        this.AppointmentItem.TotalAmount = TotalAmount;
        this.AppointmentItem.TotalTimeInMinutes = TotalTimeInMinutes;
    }
    GetValueSave() {
        var that = this;
        var appointmentServices = [];
        //var lsScheduledDate = [moment(that.AppointmentParent ? that.AppointmentParent.ScheduledDate : that.AppointmentItem.ScheduledDate).format("YYYY/MM/DD")];
        var lsScheduledDate = [moment(that.AppointmentItem.ScheduledDate).format("YYYY/MM/DD")];
        var seletor = $(".containt-serivce").length == 1 ? ".containt-serivce" : ".containt-serivce:not(:last)";

        //#region Service Appointment
        $(seletor).each(function () {
            var startTime = $(this).find('[name="StartTime"]').val() / 60;
            var appointmentSerivceST = $('[isdestop] [name="ScheduledDate"]').closest(".input-group").data('daterangepicker').startDate.toDate();
            appointmentSerivceST.setHours(parseInt(startTime / 60));
            appointmentSerivceST.setMinutes(parseInt(startTime % 60));
            appointmentSerivceST.setSeconds(0);
            appointmentSerivceST.setMilliseconds(0);
            var service = $(this).find('[name="ServiceID"]');
            appointmentServices.push({
                AppointmentServiceID: $(this).attr("appointmentserviceid"),
                ServiceID: service.attr("serviceid"),
                Duration: $(this).find('[name="Duration"]').val(),
                StaffID: $(this).find('[name="StaffID"]').val(),
                ResourceID: $(this).find('[name="ResourceID"]').val(),
                StartTime: moment(appointmentSerivceST).format("YYYY/MM/DD HH:mm"),
                RetailPrice: service.attr("retailprice"),
                SpecialPrice: service.attr("specialprice"),
                IsRequest: $(this).find('[name="IsRequest"]')[0].checked,
                SortOrder: $(this).index()
            });
        })
        //#endregion

        //#region lsScheduledDate
        if (that.AppointmentItem.FrequencyType != "no-repeat") {
            //; debugger;
            //var dateAppointMent = moment(that.AppointmentParent ? that.AppointmentParent.ScheduledDate : that.AppointmentItem.ScheduledDate).startOf('day');
            var dateAppointMent = moment(that.AppointmentItem.ScheduledDate).startOf('day');
            var unitFrequency = that.AppointmentItem.FrequencyType.toString().split(":")[0];
            var numberFrequency = that.AppointmentItem.FrequencyType.toString().split(":")[1];
            var prefixFrequency = unitFrequency == "daily" ? "days" : (unitFrequency == "weekly" ? "weeks" : "months");
            if (that.AppointmentItem.RepeatCount != "ongoing") {
                var repeatCount = 0;
                if (that.AppointmentItem.RepeatCount == "date") {
                    var duration = moment.duration(moment(that.AppointmentItem.EndRepeat).diff(dateAppointMent));
                    var time = duration.asDays();
                    if (unitFrequency == "weekly")
                        time = duration.asWeeks();
                    else if (unitFrequency == "monthly")
                        time = duration.asMonths();
                    repeatCount = parseInt(time) / parseInt(numberFrequency);
                } else
                    repeatCount = parseInt(that.AppointmentItem.RepeatCount.split(":")[1]) - 1;
                for (var i = 1; i <= repeatCount; ++i) {
                    lsScheduledDate.push(moment(dateAppointMent.toDate()).add(numberFrequency * i, prefixFrequency).format("YYYY/MM/DD"))
                }
            } else {
                var date = moment(dateAppointMent.toDate());
                var finish = moment().add(1, "years");
                date.add(numberFrequency, prefixFrequency);
                while (date.isSameOrBefore(finish)) {
                    lsScheduledDate.push(date.format("YYYY/MM/DD"));
                    date.add(numberFrequency, prefixFrequency)
                }
            }
        }
        //#endregion

        return {
            Appointment: that.AppointmentItem,
            AppointmentServices: appointmentServices,
            isUpadate: that.AppointmentItem.AppointmentID != 0,
            StartTime: $($(seletor)[0]).find('[name="StartTime"]').val(),
            lsScheduledDate: lsScheduledDate
        };
    }
    MainSave() {
        var that = this;
        this.EventAppointmentItem();
        this.CreateMethodVaildate();
        var clickSave = 0;
        var SaveCreate = function (callback) {
            StartLoading();
            if (that.ValidateForm() && clickSave <= 1) {
                ++clickSave;
                setTimeout(function () {
                    $.RequestAjax("/Calendar/SaveCreateAppointment", JSON.stringify(that.GetValueSave()), function (renponsive) {
                        EndLoading();
                        if (callback)
                            callback(renponsive);
                    })
                }, 100);
            } else
                EndLoading();
        }
        var SaveEdit = function (isUpdateOnly, callback) {
            StartLoading();
            if (that.ValidateForm() && clickSave <= 1) {
                ++clickSave;
                setTimeout(function () {
                    var data = that.GetValueSave();
                    data.isUpdateOnly = isUpdateOnly;
                    $.RequestAjax("/Calendar/SaveEditAppointment", JSON.stringify(data), function (renponsive) {
                        EndLoading();
                        if (callback)
                            callback(renponsive);
                    })
                }, 100);
            } else
                EndLoading();
        }
        var dataSuccess = function () {
            toastr["success"]("Data saved successfully.", "Notification");
            $('#modalAppointmentAction').modal("hide");
        }
        var Save = function (callback) {
            if (that.AppointmentItem.AppointmentID == null || parseInt(that.AppointmentItem.AppointmentID) == 0)
                SaveCreate(callback ? callback : dataSuccess)
            if (that.AppointmentItem.AppointmentID != null && parseInt(that.AppointmentItem.AppointmentID) != 0 && that.AppointmentItem.FrequencyTypeOld != null && that.AppointmentItem.FrequencyTypeOld == "no-repeat")
                SaveEdit(false, callback ? callback : dataSuccess)
            if (that.AppointmentItem.AppointmentID != null && parseInt(that.AppointmentItem.AppointmentID) != 0 && that.AppointmentItem.FrequencyTypeOld != null && that.AppointmentItem.FrequencyTypeOld != "no-repeat") {
                var notify = $.InStallPopupConfirm({
                    title: "Update Appointment",
                    width: "860",
                    text: "You have edited a repeating appointment. Select which appointments should be updated:",
                }, [
                      {
                          text: 'Close',
                          addClass: ' btn-pnotify',
                          click: function (notice) {
                              notice.close();
                          }
                      },
                       {
                           text: 'Update this appointment only',
                           addClass: 'float-right btn-primary-pnotify',
                           click: function (notice) {
                               notice.close();
                               SaveEdit(true, callback ? callback : dataSuccess)
                           }
                       },
                        {
                            text: 'Update all upcoming appointments',
                            addClass: 'float-right btn-success-pnotify',
                            click: function (notice) {
                                notice.close();
                                SaveEdit(false, callback ? callback : dataSuccess)
                            }
                        },
                ])
            }
        }
        $(document).on("click", "#saveButton", function () {
            Save();
        })
        $(document).on("click", "#saveButtonCheckOut", function () {
            Save(function (rensponsive) {
                toastr["success"]("Data saved successfully.", "Notification");
                $('#modalAppointmentAction').modal("hide");
                location.href = "/Sale/CheckOut?AppointmentID=" + rensponsive.AppointmentID;
            })
        })
    }
    //#endregion

};
//#endregion