
//#region Destop
class ModalAppointmentViewDestop {
    constructor(AppointmentID, canlendar, callbackEdit) {
        this.AppointmentID = AppointmentID;
        this.CanlendarElement = canlendar;
        this.CallBackEdit = callbackEdit;
        this.AppointmentRepeatCountCancel = 0;
        this.AppointmentParent = null;
    }
    Excute() {
        var that = this;
        if (!that.ButtonStatusArrived && !that.ButtonStatusConfirmed && !that.ButtonStatusNewAppointment && !that.ButtonStatusStarted && !that.DestopViewAppointment && !that.ServiceItem && !that.TotalServiceItem)
            that.LoadData();
        $.RequestAjax("/Calendar/GetAppointmentBaseId", JSON.stringify({
            AppointmentID: that.AppointmentID,
        }), function (renponsive) {
            //; debugger;
            StartLoading();
            setTimeout(function () {
                //get data
                var Appointment = renponsive.Appointment;
                var Client = renponsive.Client == null ? { TelephoneDialCode: "", Telephone: "", Email: "", FirstName: "Walk-In", LastName: "" } : renponsive.Client;
                var AppointmentServices = renponsive.AppointmentServices;
                var UserCreate = renponsive.UserCreate;
                var Message = renponsive.Message;
                var CreateDate = renponsive.CreateDate;
                var UserCancel = renponsive.UserCancel;
                that.Appointment = Appointment;
                that.Client = Client;
                that.AppointmentServices = AppointmentServices;
                that.Invoice = renponsive.Invoice;
                that.AppointmentRepeatCountCancel = parseInt(renponsive.AppointmentRepeatCountCancel);
                that.AppointmentParent = renponsive.AppointmentParent;

                //replace variable html
                var htmlDestopViewAppointment = "";
                var htmlContaintService = "";
                var htmlButtonStatus = "";
                var htmlButtonStautusDropDow = "";
                $.each(AppointmentServices, function (index, item) {
                    htmlContaintService += that.ServiceItem.replace("@StartTime", moment(item.StartTime).startOf('day').add(item.StartTimeInSecond, "seconds").format(Window.FormatTimeJS))
                        .replace("@ServiceName", item.ServiceName)
                        .replace("@SpecialPrice", $.FormatNumberMoney(parseInt(item.SpecialPrice) == 0 ? item.RetailPrice : item.SpecialPrice))
                        .replace("@RetailPrice", $.FormatNumberMoney(parseInt(item.SpecialPrice) == 0 ? "" : item.RetailPrice))
                        .replace("@Des", that.GetTextDuration(item.Duration) + " with " + (item.IsRequest ? '<i class="fa fa-heart text-danger"></i> ' : "") + item.StaffName);
                });
                var statusButton = that.GetHtmlDropDrowStatus(Appointment.Status);

                Client.TelephoneDialCode = Client.TelephoneDialCode == null ? "" : Client.TelephoneDialCode;
                Client.Telephone = Client.Telephone == null ? "" : Client.Telephone;
                Client.Email = Client.Email == null ? "" : Client.Email;
                Appointment.Notes = Appointment.Notes == null ? "" : Appointment.Notes;
                htmlContaintService += that.TotalServiceItem.replace("@TotalMinutes", that.GetTextDuration(Appointment.TotalTimeInMinutes)).replace("@TotalPrice", $.FormatNumberMoney(Appointment.TotalAmount));
                htmlDestopViewAppointment = that.DestopViewAppointment.replace("@ScheduleDate", moment(Appointment.ScheduledDate).format("dddd, DD MMM YYYY"))
                    .replace("@ContaintService", htmlContaintService)
                    .replace("@TotalFooter", "<h4><strong>Total: " + $.FormatNumberMoney(Appointment.TotalAmount) + "</strong> (" + that.GetTextDuration(Appointment.TotalTimeInMinutes) + ")</h4>")
                    .replace("@Represent", ($.trim(Client.FirstName) == "" ? '' : Client.FirstName.toString().charAt(0).toUpperCase()))
                    .replace("@FullName", Client.FirstName + " " + (Client.LastName == null ? "" : Client.LastName))
                    .replace("@Description", [(Client.MobileNumber == null || Client.MobileNumber == "") ? null : ("+" + Client.MobileNumberDialCode + " " + Client.MobileNumber), Client.Email].filter(word => word != null && word != "" && word != "null").join(','))
                    .replace("@ClientNote", Appointment.Notes)
                    .replace("@ButtonStatus", statusButton.HtmlButtonStatus)
                    .replace("@DropDownButtonStatus", statusButton.HtmlDropDownButtonStatus);

                var htmlInvoice = "";
                if (that.Invoice) {
                    var buttonHtmlNotComplete = '<button type="button" class="btn btn-block btn-success active text-uppercase" aria-pressed="true" id="payButton" onclick="location.href = \'/Sale/Pay?id=' + that.Invoice.InvoiceID + '\'">Pay now</button>';
                    var buttonHtmlComplete = '<button type="button" class="btn btn-block btn-success active text-uppercase" aria-pressed="true" onclick="location.href = \'/Sale/Invoices?id=' + that.Invoice.InvoiceID + '\'">View Invoice</button>';
                    var buttonHtmlCompleteNow = '<button type="button" class="btn btn-block btn-success active text-uppercase" aria-pressed="true" id="completeNowButton">Complete Now</button>';
                    switch (that.Invoice.InvoiceStatus) {
                        case "invoice_status_complete":
                            htmlInvoice = that.InvoiceComplete.replace("@DateInvoice", moment(that.Invoice.InvoiceDate).format(Window.FormatDateWithDayOfWeekJS))
                                .replace("@InvoiceID", that.Invoice.InvoiceID).replace("@InvoiceNo", that.Invoice.InvoiceNo);
                            htmlDestopViewAppointment = htmlDestopViewAppointment.replace("@ButtonLeft", Appointment.Status == "Completed" ? buttonHtmlComplete : buttonHtmlCompleteNow);
                            break;
                        case "invoice_status_unpaid":
                            that.ArrayButtonFooterInvoice += '<a class="dropdown-item text-center" href="/Sale/Invoices?id=' + that.Invoice.InvoiceID + '">View Invoice</a>';
                            htmlInvoice = that.InvoiceUnpaid.replace("@InvoiceID", that.Invoice.InvoiceID).replace("@InvoiceNo", that.Invoice.InvoiceNo);
                            htmlDestopViewAppointment = htmlDestopViewAppointment.replace("@ButtonLeft", Appointment.Status == "Completed" ? buttonHtmlNotComplete : buttonHtmlCompleteNow);
                            break;
                        case "invoice_status_part_paid":
                            that.ArrayButtonFooterInvoice += '<a class="dropdown-item text-center" href="/Sale/Invoices?id=' + that.Invoice.InvoiceID + '">View Invoice</a>';
                            htmlInvoice = that.InvoicePartUnpaid.replace("@InvoiceID", that.Invoice.InvoiceID).replace("@InvoiceNo", that.Invoice.InvoiceNo);
                            htmlDestopViewAppointment = htmlDestopViewAppointment.replace("@ButtonLeft", Appointment.Status == "Completed" ? buttonHtmlNotComplete : buttonHtmlCompleteNow);
                            break;
                    }
                } else {
                    htmlDestopViewAppointment = htmlDestopViewAppointment.replace("@ButtonLeft", '<button type="button" class="btn btn-block btn-success active text-uppercase" aria-pressed="true" id="saveButton">CHECKOUT</button>');
                    htmlInvoice = that.NoInvoice;
                }
                htmlDestopViewAppointment = htmlDestopViewAppointment.replace("@InoviceContaint", htmlInvoice);
                if (Appointment.Status == "NoShow")
                    htmlDestopViewAppointment = htmlDestopViewAppointment.replace("@ArrayButtonFooter", that.ArrayButtonFooterNoShow);
                else if (Appointment.Status == "Completed")
                    htmlDestopViewAppointment = htmlDestopViewAppointment.replace("@ArrayButtonFooter", that.ArrayButtonFooterInvoice);
                else
                    htmlDestopViewAppointment = htmlDestopViewAppointment.replace("@ArrayButtonFooter", that.ArrayButtonFooter);

                //#region Appointment history
                var nameUser = UserCreate ? (UserCreate.FirstName ? UserCreate.FirstName : "") + " " + (UserCreate.LastName ? UserCreate.LastName : "") : "";
                var appointmentHistory = "";
                Message.forEach(function (item) {
                    appointmentHistory += "<p class='service-des mb-1 p-0'><span style='color: #718DA6'>" + item.MessageType + " </span> sent at "
                        + moment(item.TimeSentString).format(Window.FormatDateWithDayOfWeekJS) + " at " + moment(item.TimeSentString).format(Window.FormatTimeJS) + "</p>";
                })
                if (AppointmentServices.length > 0) {
                    appointmentHistory += that.Invoice ? "<p class='service-des mb-1 p-0'>Invoice created by " + that.Invoice.UserCreateName + " at " + moment(that.Invoice.CreateDate).format(Window.FormatDateWithDayOfWeekJS + " " + Window.FormatTimeJS) + "</p>" : "";
                    appointmentHistory += UserCancel ? "<p class='service-des mb-1 p-0'>Cancelled by " + (UserCancel.FirstName ? UserCancel.FirstName : "") + " " + (UserCancel.LastName ? UserCancel.LastName : "")
                        + " at " + moment(that.Appointment.DatetimeCancel).format(Window.FormatDateWithDayOfWeekJS + " " + Window.FormatTimeJS) + "</p>" : "";
                    appointmentHistory += "<p class='service-des mb-1 p-0'>" + (that.Appointment.BookingType == "booking_type_online" ? 'Booked online <i class="fa fa-cloud text-primary"></i> ' : "Booked by ") + nameUser + " with ref #" + AppointmentServices[0].RefNo
                        + " at " + moment(CreateDate, "YYYY/MM/DD HH:mm:ss").format(Window.FormatDateWithDayOfWeekJS + " " + Window.FormatTimeJS) + "</p>";
                }
                htmlDestopViewAppointment = htmlDestopViewAppointment.replace("@ContaintAppointmentHistory", that.AppointmentHistory.replace("@AppointmentHistory", appointmentHistory));
                //#endregion

                //#region Repeate
                var RepeatText = "";
                if (Appointment.RepeatCount) {
                    var dateAppointMent = moment(that.AppointmentParent.ScheduledDate).startOf('day');
                    var unitFrequency = Appointment.FrequencyType.toString().split(":")[0];
                    var numberFrequency = Appointment.FrequencyType.toString().split(":")[1];
                    var prefixFrequency = unitFrequency == "daily" ? "days" : (unitFrequency == "weekly" ? "weeks" : "months");
                    RepeatText = "Repeats every " + numberFrequency + " " + prefixFrequency;

                    if (Appointment.RepeatCount != "date" && Appointment.RepeatCount != "ongoing") {
                        var repeatCount = Appointment.RepeatCount.split(":")[1];
                        RepeatText += " until " + dateAppointMent.add((repeatCount - 1) * numberFrequency, prefixFrequency).format("dddd, DD MMM YYYY") + " (" + repeatCount + " times)";
                    } else if (Appointment.RepeatCount == "date") {
                        var date = moment(Appointment.EndRepeat).startOf('day');
                        RepeatText += " until " + date.format("dddd, DD MMM YYYY");
                    } else if (Appointment.RepeatCount == "ongoing")
                        RepeatText += ", ongoing";
                }
                htmlDestopViewAppointment = htmlDestopViewAppointment.replace("@RepeatText", "<p class='font-xs font-weight-normal mb-3'>" + RepeatText + "</p>");
                //#endregion

                $("#appointmentViewForm").html(htmlDestopViewAppointment);
                if (!that.Client.ClientID)
                    $("#detailClient button").remove();
                that.Event();
                that.CreatePopup();
                EndLoading();
            }, 100);
        })
    }
    Event() {
        var that = this;
        $(document).on("click", "[name='status-appointment']", function () {
            var status = $(this).attr("status");
            $.RequestAjax("/Calendar/UpdateStatusAppointment", JSON.stringify({
                AppointmentID: that.AppointmentID,
                Status: status
            }), function (renponsive) {
                //var statusButton = that.GetHtmlDropDrowStatus(status);
                //$("#containtDropdowStatus").find("a").remove();
                //$("#containtDropdowStatus").append($(statusButton.HtmlButtonStatus));
                //$("#containtDropdowStatus").find(".dropdown-menu").append($(statusButton.HtmlDropDownButtonStatus));
                $('#modalAppointmentView').modal("hide");
            });
        })
        $("#saveButton").click(function () {
            location.href = "/Sale/CheckOut?AppointmentID=" + that.AppointmentID;
        })
        $("#completeNowButton").click(function () {
            $.RequestAjax("/Calendar/CompleteAppointment", JSON.stringify({
                AppointmentID: that.AppointmentID,
            }), function (renponsive) {
                $('#modalAppointmentView').modal("hide");
            });
        })

        //#region Button Footer stataus !=  No Show
        $("#buttonAppointmentCancel").click(function () {
            if (that.AppointmentServices.length > 0) {
                if (moment(that.AppointmentServices[0].StartTime).isBefore(moment())) {
                    PNotify.info({
                        title: "Past appointments can't be cancelled, use no show action instead.",
                        icon: "fa fa-warning",
                        addClass: "stack-bar-top",
                        width: "100%",
                        hide: false,
                        stack: {
                            'dir1': 'down',
                            'firstpos1': 25,
                            'modal': true,
                        },
                    });
                } else {
                    $('#modalAppoimentCancel').modal("show");
                    $("#appointmentReasonCancel").val("No reason provided");
                }
            }
        })
        $("#buttonAppointmentNoShow").click(function () {
            if (moment(moment()).isBefore(that.AppointmentServices[0].StartTime)) {
                PNotify.info({
                    title: "Upcoming appointments can't be set to no show, use cancel action instead",
                    icon: "fa fa-warning",
                    addClass: "stack-bar-top",
                    width: "100%",
                    hide: false,
                    stack: {
                        'dir1': 'down',
                        'firstpos1': 25,
                        'modal': true,
                    },
                });
            } else {
                $.RequestAjax("/Calendar/UpadateStatusNoShowAppointment", JSON.stringify({
                    AppointmentID: that.AppointmentID,
                }), function (renponsive) {
                    $('#modalAppointmentView').modal("hide");
                });
            }
        })
        $("#buttonReschedule").click(function () {
            that.ActionForScheulCopyOrCut(true);
        })
        $(document).on("click", "#buttonSaveAppointmentCancel", function () {
            $.RequestAjax("/Calendar/UpadateStatusCancelAppointment", JSON.stringify({
                AppointmentID: that.AppointmentID,
                ReasonCancel: $("#appointmentReasonCancel").val(),
                DatetimeCancel: moment().format("YYYY/MM/DD HH:mm"),
                IsUpdateOnly: $("#checkRepeatCancel").length ? !$("#checkRepeatCancel")[0].checked : true
            }), function (renponsive) {
                $('#modalAppoimentCancel').modal("hide");
                $('#modalAppointmentView').modal("hide");
            });
        })
        //#endregion

        //#region Button Footer stataus =  No Show
        $("#buttonEditNote").click(function () {
            $('#modalAppoimentEditNote').modal("show");
        })
        $(document).on("click", "#buttonSaveAppointmentNote", function () {
            $.RequestAjax("/Calendar/UpdateNoteAppointment", JSON.stringify({
                AppointmentID: that.AppointmentID,
                Note: $("#NoteAppointment").val()
            }), function (renponsive) {
                $('#modalAppoimentEditNote').modal("hide");
            });
        })
        $("#buttonEditAppointment").click(function () {
            $('#modalAppointmentView').modal("hide");
            $.CallEditAppointment(that.AppointmentID, that.CallBackEdit);
        })
        $("#buttonUndoNoShow").click(function () {
            $.RequestAjax("/Calendar/UpadateStatusUndoNoShowAppointment", JSON.stringify({
                AppointmentID: that.AppointmentID,
            }), function (renponsive) {
                $('#modalAppointmentView').modal("hide");
            });
        })
        $("#buttonRebook").click(function () {
            that.ActionForScheulCopyOrCut(false);
        })
        //#endregion

        $('#modalAppointmentView').on('hidden.bs.modal', function (e) {
            $(document).off("click", "[name='status-appointment']");
            $("#saveButton").off("click");
            $("#buttonAppointmentCancel").off("click");
            $("#buttonAppointmentNoShow").off("click");
            $("#buttonReschedule").off("click");
            $(document).off("click", "#buttonSaveAppointmentCancel");
            $("#buttonEditNote").off("click");
            $(document).off("click", "#buttonSaveAppointmentNote");
            $("#buttonEditAppointment").off("click");
            $("#buttonUndoNoShow").off("click");
            $("#buttonRebook").off("click");
            $("#detailClient").off("click");
            $("#modalAppoimentEditNote").modal('hide');
            $("#modalAppoimentCancel").modal('hide');
            $("#modalAppoimentEditNote").remove();
            $("#modalAppoimentCancel").remove();
        })
        $("#detailClient").click(function () {
            if (that.Client && that.Client.ClientID) {
                var Excute = function () {
                    var clientDestop = new ClientDetailDestop(that.Client.ClientID, true);
                    var renposive = clientDestop.CreateClient(function (renposive) {
                        $("#contentRight").children("div").hide();
                        $("#contentRight").children("div").removeClass("d-flex");
                        $("#contentRight").append(renposive.Html);
                        $("#detailClientBackdropContentRight").show();
                        $("#detailClientBackdropContentRight").addClass("d-flex");
                        var ClientId = renposive.Data.Client.ClientID;
                        $("#divTabAppointment").css("max-height", "calc(100vh - 300px)")
                        $("#divTabProduct").css("max-height", "calc(100vh - 300px)")
                        $("#divTabInvoice").css("max-height", "calc(100vh - 300px)")
                        $("#buttonRemoveClient").remove();
                        $("#containtFooter").remove();
                        var remove = function () {
                            $("#contentRight").children("div").show;
                            $("#contentRight").children("div").addClass("d-flex");
                            $("#detailClientBackdropContentRight").hide();
                            $("#detailClientBackdropContentRight").removeClass("d-flex");
                            $("#divClientDetail").remove();
                            $(document).off("keyup");
                            $("#btnTabAppointments").off("click");
                            $("#btnTabProducts").off("click");
                            $("#btnTabInvoices").off("click");
                            $("#btnTabInfo").off("click");
                            $("#buttonCloseDetailClient").off("click");
                        }
                        $(document).keyup(function (e) {
                            if (e.keyCode == 27)
                                remove();
                        })
                        $("#buttonCloseDetailClient").click(function () {
                            remove();
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
                        $("#buttonEditClient").click(function () {
                            LoadClient(ClientId);
                            SaveClient(function (data) {
                                $("#appointmentViewForm").html("");
                                that.Excute();
                            });
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
        })
    }
    CreatePopup() {
        var that = this;
        this.InstalPopup("modalAppoimentEditNote", "appointmentFormEditNote", "Edit Appointment Notes",
            '<div class="col-12"><div class="form-group"><label class="col-form-label">Appointment notes</label>'
            + '<textarea ispropertiesmodel id="NoteAppointment" name="NoteAppointment" class="form-control" rows="4"></textarea></div></div>',
            '<div class="col-12"><button type="button" class="btn btn-block btn-success" id="buttonSaveAppointmentNote" >SAVE</button></div>');
        $.RequestAjax("/Home/GetDataCancelationReason", null, function (renponsive) {
            var data = renponsive.Result;
            var select = $("<select></select>");
            select.append(new Option("No reason provided", "No reason provided", true, true));
            $.each(data, function () {
                select.append(new Option(this.CancellationReasonName, this.CancellationReasonName));
            })
            select.addClass("form-control");
            select.attr("id", "appointmentReasonCancel")
            if (that.AppointmentServices.length > 0) {
                //; debugger;
                var htmlCheckRepeat = "";
                var appointmentSeviceFirst = that.AppointmentServices[0];
                if (that.Appointment.FrequencyType != null && that.Appointment.FrequencyType != "no-repeat") {
                    var countRepeat = that.AppointmentRepeatCountCancel - parseInt(that.Appointment.RepeatOrder ? that.Appointment.RepeatOrder : 0);
                    --countRepeat;
                    if (countRepeat > 0) {
                        htmlCheckRepeat = '<div class="col-12 pl-0 pb-2">'
                                        + '<input type="checkbox" id="checkRepeatCancel" /> <span>Also cancel ' + countRepeat + ' upcoming repeat appointments</span>'
                                        + '</div>';
                    }
                }
                that.InstalPopup("modalAppoimentCancel", "appointmentFormCancel", "Cancel Appointment",
                    '<div class="col-12><div class="form-group"><label class="col-form-label pb-0">The following services will be cancelled: </label>'
                    + '<label class="col-form-label pt-0 pb-3">' + appointmentSeviceFirst.ServiceName + " with " + appointmentSeviceFirst.StaffName + " on " + moment(appointmentSeviceFirst.StartTime).format("dddd,DD MMM YYYY") + " at " + moment(appointmentSeviceFirst.StartTime).format("HH:mm") + '</label>'
                    + htmlCheckRepeat + select[0].outerHTML + '</div>',
                    '<div class="col-12 col-md-6"><button type="button" class="btn btn-block btn-info text-uppercase" data-dismiss="modal" >Close</button></div>'
                    + '<div class="col-12 col-md-6"><button type="button" class="btn btn-block btn-danger text-uppercase" id="buttonSaveAppointmentCancel" >CANCEL APPOINTMENT</button></div>');
            }
        });
    }
    InstalPopup(idModal, idForm, title, childElement, footerHtml) {
        $("body").append('<div class="modal fade" id="' + idModal + '" ismodal style="z-index: 3000">'
            + '<div class="modal-dialog" role="document">'
            + '<div class="modal-content">'
            + '<div class="modal-header"><h3 class="modal-title">' + title + '</h3><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>'
            + '<div class="modal-body"><form novalidate="novalidate" id="' + idForm + '">' + childElement + '</form></div>'
            + '<div class="modal-footer">' + footerHtml + '</div>'
            + '</div></div></div>');
        $('#' + idModal).modal({
            keyboard: false,
            show: false,
        }).on('shown.bs.modal', function (e) {
            $("input[type='checkbox']:not(.switch-input)").iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        })
    }
    GetTextDuration(duration) {
        var minutesTotal = duration / 60;
        var hour = parseInt(minutesTotal / 60);
        var minutes = minutesTotal % 60;
        return (hour > 0 ? hour + "h " : "") + (minutes > 0 ? minutes + "min" : "");
    }
    LoadData() {
        var that = this;
        $.RequestAjaxText("/ContentHtml/Appointment/View/Desktop/ButtonStatusArrived.html", function (data) { that.ButtonStatusArrived = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/View/Desktop/ButtonStatusConfirmed.html", function (data) { that.ButtonStatusConfirmed = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/View/Desktop/ButtonStatusNewAppointment.html", function (data) { that.ButtonStatusNewAppointment = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/View/Desktop/ButtonStatusStarted.html", function (data) { that.ButtonStatusStarted = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/View/Desktop/ButtonStatusCancelled.html", function (data) { that.ButtonStatusCancelled = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/View/Desktop/Index.html", function (data) { that.DestopViewAppointment = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/View/Desktop/ServiceItem.html", function (data) { that.ServiceItem = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/View/Desktop/TotalServiceItem.html", function (data) { that.TotalServiceItem = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/View/Desktop/ButtonStatusNoShow.html", function (data) { that.ButtonStatusNoShow = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/View/Desktop/ArrayButtonFooter.html", function (data) { that.ArrayButtonFooter = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/View/Desktop/ArrayButtonFooterNoShow.html", function (data) { that.ArrayButtonFooterNoShow = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/View/Desktop/InvoiceComplete.html", function (data) { that.InvoiceComplete = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/View/Desktop/InvoicePartUnpaid.html", function (data) { that.InvoicePartUnpaid = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/View/Desktop/InvoiceUnpaid.html", function (data) { that.InvoiceUnpaid = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/View/Desktop/NoInvoice.html", function (data) { that.NoInvoice = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/View/Desktop/ArrayButtonFooterInvoice.html", function (data) { that.ArrayButtonFooterInvoice = data; });
        $.RequestAjaxText("/ContentHtml/Appointment/View/Desktop/AppointmentHistory.html", function (data) { that.AppointmentHistory = data; });
    }
    GetHtmlDropDrowStatus(Status) {
        if (Status == "NoShow")
            return { HtmlButtonStatus: this.ButtonStatusNoShow, HtmlDropDownButtonStatus: "" };
        var htmlButtonStatus = "";
        var htmlDropDownButtonStatus = "";
        var arrayHtmlButtonStatus = [{ Status: "New", Html: this.ButtonStatusNewAppointment }, { Status: "Confirmed", Html: this.ButtonStatusConfirmed },
        { Status: "Arrived", Html: this.ButtonStatusArrived }, { Status: "Started", Html: this.ButtonStatusStarted }];

        if (Status == "Cancelled") {
            htmlButtonStatus = this.ButtonStatusCancelled;
        } else {
            $.each(arrayHtmlButtonStatus, function () {
                var t = $(this.Html);
                if (Status == this.Status) {
                    t.addClass("dropdown-toggle");
                    t.addClass("view-appointment-status");
                    t.addClass("view-appointment-status-choose");
                    t.attr("role", "button");
                    t.attr("data-toggle", "dropdown");
                    t.attr("aria-haspopup", "true");
                    t.attr("aria-expanded", "false");
                    htmlButtonStatus = t[0].outerHTML;
                } else {
                    t.addClass("dropdown-item");
                    t.addClass("view-appointment-status");
                    t.attr("name", "status-appointment");
                    t.attr("status", this.Status);
                    htmlDropDownButtonStatus += t[0].outerHTML;
                }
            })
        }
        return { HtmlButtonStatus: htmlButtonStatus, HtmlDropDownButtonStatus: htmlDropDownButtonStatus };
    }
    ActionForScheulCopyOrCut(isCut) {
        localStorage.setItem("IsViewCopyOrCutAppointment", true);
        localStorage.setItem("locationIdCopyOrCutAppointment", this.Appointment.LocationID);
        localStorage.setItem("CopyOrCutAppointmentID", this.AppointmentID);
        localStorage.setItem("IsCopyOrCutAppointment", isCut);
        location.href = "/Calendar/Index";
    }
};

//#endregion