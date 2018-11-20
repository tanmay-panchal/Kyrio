//$(function () {
//    var clientId = 133;
//    var HtmlClient = {
//        Index: null,
//        Appointment: {
//            Index: null,
//            Item: null,
//        },
//        Info: {
//            Index: null,
//            Item: null,
//        },
//        Invoice: {
//            Index: null,
//            Item: null,
//        },
//        Product: {
//            Index: null,
//            Item: null,
//        },
//    };
//    $.RequestAjaxText("/ContentHtml/Appointment/Action/Moblile/DetailClient/index.html", function (data) { HtmlClient.Index = data; });
//    $.RequestAjaxText("/ContentHtml/Appointment/Action/Moblile/DetailClient/appointment/index.html", function (data) { HtmlClient.Appointment.Index = data; });
//    $.RequestAjaxText("/ContentHtml/Appointment/Action/Moblile/DetailClient/appointment/item.html", function (data) { HtmlClient.Appointment.Item = data; });
//    $.RequestAjaxText("/ContentHtml/Appointment/Action/Moblile/DetailClient/info/index.html", function (data) { HtmlClient.Info.Index = data; });
//    $.RequestAjaxText("/ContentHtml/Appointment/Action/Moblile/DetailClient/info/item.html", function (data) { HtmlClient.Info.Item = data; });
//    $.RequestAjaxText("/ContentHtml/Appointment/Action/Moblile/DetailClient/invoice/index.html", function (data) { HtmlClient.Invoice.Index = data; });
//    $.RequestAjaxText("/ContentHtml/Appointment/Action/Moblile/DetailClient/invoice/item.html", function (data) { HtmlClient.Invoice.Item = data; });
//    $.RequestAjaxText("/ContentHtml/Appointment/Action/Moblile/DetailClient/product/index.html", function (data) { HtmlClient.Product.Index = data; });
//    $.RequestAjaxText("/ContentHtml/Appointment/Action/Moblile/DetailClient/product/item.html", function (data) { HtmlClient.Product.Item = data; });

//    $.RequestAjax("/Calendar/GetClientBaseIdForAppointment", JSON.stringify({ ClientId: clientId }), function (data) {
//        StartLoading();
//        setTimeout(function () {
//            var Client = data.Client;
//            var htmlIndex = HtmlClient.Index;
//            var htmlAppointment = HtmlClient.Appointment.Index;
//            var htmlInfo = HtmlClient.Info.Index;
//            var htmlProduct = HtmlClient.Product.Index;
//            var htmlInvoice = HtmlClient.Invoice.Index;
//            var EnableNoDataTab = function (html, seletorNoData, seletorData) {
//                var eleContainer = $("<div>" + html + "</div>");
//                eleContainer.find(seletorNoData).removeClass("d-none");
//                eleContainer.find(seletorData).addClass("d-none");
//                return $(eleContainer).html();
//            }

//            //#region main
//            var mobilenumberClient = (Client.MobileNumber == null || Client.MobileNumber == "") ? "" : ("+" + Client.MobileNumberDialCode + " " + Client.MobileNumber);
//            var emailClient = (Client.Email == null || Client.Email == "") ? "" : Client.Email;
//            htmlIndex = htmlIndex.replace("@Represent", ($.trim(Client.FirstName) == "" ? '' : Client.FirstName.toString().charAt(0).toUpperCase()))
//            .replace("@FullName", ($.trim(Client.FirstName) == "" ? '' : Client.FirstName) + ($.trim(Client.LastName) == "" ? '' : ' ' + Client.LastName))
//            .replace("@Description", (mobilenumberClient == "" && emailClient == "") ? "" : (mobilenumberClient == "" ? emailClient : (emailClient == "" ? mobilenumberClient : (mobilenumberClient + ", " + emailClient))))
//            .replace("@TotalBooking", Client.Appointments).replace("@TotalSale", Client.TotalSales);
//            //#endregion

//            //#region appointment
//            if (data.Appointments && data.Appointments.length > 0) {
//                var htmlLsItem = "";
//                var ArrayStatus = [{ Status: "New", Text: "new appointment", Class: "text-primary" }, { Status: "Completed", Text: "completed", Class: "text-success" },
//                { Status: "NoShow", Text: "no show", Class: "text-danger" }, { Status: "Confirmed", Text: "confirmed", Class: "text-info" },
//                { Status: "Arrived", Text: "arrived", Class: "text-warning" }, { Status: "Started", Text: "started", Class: "text-info" },
//                { Status: "Cancelled", Text: "cancelled", Class: "text-danger" }];

//                $.each(data.Appointments, function (index, item) {
//                    var itemStatus = ArrayStatus.filter(n => n.Status == item.Status)[0];
//                    htmlLsItem += HtmlClient.Appointment.Item.replace("@Day", moment(item.StartTime).format("DD")).replace("@Month", moment(item.StartTime).format("MMM"))
//                    .replace("@Time", moment(item.StartTime).startOf('day').add(this.StartTimeInSecond, "seconds").format("ddd, HH:mm"))
//                    .replace("@ServiceName", item.ServiceName).replace("@Price", item.Price)
//                    .replace("@DurationNameAndStaff", (item.DurationName == "" ? "" : (item.DurationName)) + (item.StaffName == null ? "" : " with " + item.StaffName))
//                    .replace("@Status", itemStatus ? itemStatus.Text : "").replace("@ClassStatus", itemStatus ? itemStatus.Class : "");
//                })
//                htmlAppointment = htmlAppointment.replace("@CountItem", data.Appointments.length).replace("@LsItem", htmlLsItem);
//            } else {
//                htmlAppointment = htmlAppointment.replace("@CountItem", 0).replace("@LsItem", "");
//                htmlAppointment = EnableNoDataTab(htmlAppointment, "#container-no-appointment", "#container-appointment");
//            }
//            //#endregion

//            //#region product
//            if (data.Products && data.Products.length > 0) {
//                var htmlLsItem = "";
//                $.each(data.Products, function (index, item) {
//                    htmlLsItem += HtmlClient.Product.Item.replace("@Quantity", item.Quantity + " sold").replace("@ProductName", item.ItemName)
//                    .replace("@InvoiceDate", moment(item.InvoiceDate).format(Window.FormatDateWithDayOfWeekJS))
//                    .replace("@PriceAfterDiscount", item.PriceAfterDiscount);
//                })
//                htmlProduct = htmlProduct.replace("@LsItem", htmlLsItem);
//            } else {
//                htmlProduct = htmlProduct.replace("@LsItem", "");
//                htmlProduct = EnableNoDataTab(htmlProduct, "#container-no-product", "#container-product");
//            }
//            //#endregion

//            //#region invoice
//            if (data.Invoices && data.Invoices.length > 0) {
//                var htmlLsItem = "";
//                var ArrayStatus = [{ Status: "invoice_status_complete", Text: Window.ResourcesEnum["invoice_status_complete"], Class: "text-success" },
//                { Status: "invoice_status_refund", Text: Window.ResourcesEnum["invoice_status_refund"], Class: "text-danger" }];

//                $.each(data.Products, function (index, item) {
//                    var itemStatus = ArrayStatus.filter(n => n.Status == item.InvoiceStatus)[0];
//                    itemStatus = itemStatus ? itemStatus : { Text: Window.ResourcesEnum[item.InvoiceStatus], Class: "text-info" };
//                    htmlLsItem += HtmlClient.Invoice.Item.replace("@InvoiceDate", moment(item.InvoiceDate).format(Window.FormatDateWithDayOfWeekJS))
//                    .replace("@Total", item.TotalWithTip).replace("@ClassStatus", itemStatus.Class).replace("@Status", itemStatus.Text);
//                })
//                htmlInvoice = htmlInvoice.replace("@LsItem", htmlLsItem);
//            } else {
//                htmlInvoice = htmlInvoice.replace("@LsItem", "");
//                htmlInvoice = EnableNoDataTab(htmlInvoice, "#container-no-invoice", "#container-invoice");
//            }
//            //#endregion

//            //#region info
//            var ArrayDataInfo = [{ Value: Client.MobileNumber != null && Client.MobileNumber != undefined && Client.MobileNumber != "" ? ("+" + Client.MobileNumberDialCode + " " + Client.MobileNumber) : null, Name: 'Mobile' },
//            { Value: Client.Email != null && Client.Email != undefined && Client.Email != "" ? Client.Email : null, Name: 'Email' },
//            { Value: Client.Gender != null && Client.Gender != undefined && Client.Gender != "gender_unknown" ? Window.ResourcesEnum[Client.Gender] : null, Name: 'Gender' }];
//            ArrayDataInfo = ArrayDataInfo.filter(n=>n.Value != null);
//            if (ArrayDataInfo.length > 0) {
//                var htmlLsItem = "";
//                ArrayDataInfo.forEach(function (item) {
//                    htmlLsItem += HtmlClient.Info.Item.replace("@Name", item.Name).replace("@Value", item.Value);
//                })
//                htmlInfo = htmlInfo.replace("@LsItem", htmlLsItem);
//            } else {
//                htmlInfo = htmlInfo.replace("@LsItem", "");
//                htmlInfo = EnableNoDataTab(htmlInfo, "#container-no-info", "#container-info");
//            }
//            //#endregion

//            htmlIndex = htmlIndex.replace("@TabAppointments", htmlAppointment).replace("@TabProducts", htmlProduct)
//                .replace("@TabInovices", htmlInvoice).replace("@TabInfo", htmlInfo);
//            $("#container-client-detail").append(htmlIndex);

//            //event
//            $("#buttonShowAction_ClientDetail").click(function () {
//                $("#container-action-client-detail").removeClass("d-none");
//                $("#container-action-client-detail").addClass("d-flex");
//            })
//            $("#container-action-client-detail").find("button").click(function () {
//                $("#container-action-client-detail").addClass("d-none");
//                $("#container-action-client-detail").removeClass("d-flex");
//            })

//            EndLoading();
//        }, 1000);
//    })
//})
var prefixFileMobileAppointment = "/ContentHtml/Appointment/Action/Moblile";
var LinkFileMobileAppointment = {
    AddClient: {
        Index: prefixFileMobileAppointment + "/AddClient/Index.html",
        ItemSearchClient: prefixFileMobileAppointment + "/AddClient/ItemSearchClient.html",
    },
    AddService: {
        Index: prefixFileMobileAppointment + "/AddComboboxService/Index.html",
        Service: prefixFileMobileAppointment + "/AddComboboxService/Service.html",
        ServiceGroup: prefixFileMobileAppointment + "/AddComboboxService/ServiceGroup.html",
    },
    RepeateScheulDate: {
        Index: prefixFileMobileAppointment + "/Repeate_ScheulDate/Index.html",
    },
    AppointmentService: {
        Index: prefixFileMobileAppointment + "/AppointmentService/Index.html",
    },
    ContentShare: {
        ServiceShare: prefixFileMobileAppointment + "/ContentShare/ServiceShare.html",
    },
    Control: {
        Duration: prefixFileMobileAppointment + "/Control/Duration.html",
        Staff_IsRequest: prefixFileMobileAppointment + "/Control/Staff_IsRequest.html",
        Starttime12h: prefixFileMobileAppointment + "/Control/Starttime12h.html",
        Starttime24h: prefixFileMobileAppointment + "/Control/Starttime24h.html",
    },
    DetailClient: {
        Index: prefixFileMobileAppointment + "/DetailClient/Index.html",
        Appointment: {
            Index: prefixFileMobileAppointment + "/DetailClient/Appointment/Index.html",
            Item: prefixFileMobileAppointment + "/DetailClient/Appointment/Item.html",
        },
        Info: {
            Index: prefixFileMobileAppointment + "/DetailClient/Info/Index.html",
            Item: prefixFileMobileAppointment + "/DetailClient/Info/Item.html",
        },
        Invoice: {
            Index: prefixFileMobileAppointment + "/DetailClient/Invoice/Index.html",
            Item: prefixFileMobileAppointment + "/DetailClient/Invoice/Item.html",
        },
        Product: {
            Index: prefixFileMobileAppointment + "/DetailClient/Product/Index.html",
            Item: prefixFileMobileAppointment + "/DetailClient/Product/Item.html",
        }
    },
    Index: {
        Index: prefixFileMobileAppointment + "/Index/Index.html",
        ClientDetail: prefixFileMobileAppointment + "/Index/ClientDetail.html",
        ClientEmpty: prefixFileMobileAppointment + "/Index/ClientEmpty.html",
        Repeat_ScheulDate: prefixFileMobileAppointment + "/Index/Repeat_ScheulDate.html",
        ServiceItem: prefixFileMobileAppointment + "/Index/ServiceItem.html",
    },
};

//#region Detail Client
class MobileDetailClient {
    constructor(clientId) {
        this.Modal = null;
        this.HTML = {
            Index: null,
            Appointment: {
                Index: null,
                Item: null,
            },
            Info: {
                Index: null,
                Item: null,
            },
            Invoice: {
                Index: null,
                Item: null,
            },
            Product: {
                Index: null,
                Item: null,
            }
        };
        this.ClientID = clientId;
    }

    //#region Private
    CreatEvent() {
        var that = this;
        that.Modal.find("#buttonShowAction_ClientDetail").click(function () {
            that.Modal.find("#container-action-client-detail").removeClass("d-none");
            that.Modal.find("#container-action-client-detail").addClass("d-flex");
        })
        that.Modal.find("#container-action-client-detail").find("button").click(function () {
            that.Modal.find("#container-action-client-detail").addClass("d-none");
            that.Modal.find("#container-action-client-detail").removeClass("d-flex");
        })
        this.Modal.find("#container-tab-detail-client li a").on('click', function (e) {
            e.preventDefault()
            $(this).tab('show');
        })
    }
    RemoveEvent() {
        $(document).off("click", "#buttonShowAction_ClientDetail");
        $(document).off("click", "#container-action-client-detail");
    }
    LoadDataDetailClient() {
        var that = this;
        $.RequestAjax("/Calendar/GetClientBaseIdForAppointment", JSON.stringify({ ClientId: that.ClientID }), function (data) {
            StartLoading();
            setTimeout(function () {
                var Client = data.Client;
                var htmlIndex = that.HTML.Index;
                var htmlAppointment = that.HTML.Appointment.Index;
                var htmlInfo = that.HTML.Info.Index;
                var htmlProduct = that.HTML.Product.Index;
                var htmlInvoice = that.HTML.Invoice.Index;
                var EnableNoDataTab = function (html, seletorNoData, seletorData) {
                    var eleContainer = $("<div>" + html + "</div>");
                    eleContainer.find(seletorNoData).removeClass("d-none");
                    eleContainer.find(seletorData).addClass("d-none");
                    return $(eleContainer).html();
                }

                //#region Main
                var mobilenumberClient = (Client.MobileNumber == null || Client.MobileNumber == "") ? "" : ("+" + Client.MobileNumberDialCode + " " + Client.MobileNumber);
                var emailClient = (Client.Email == null || Client.Email == "") ? "" : Client.Email;
                htmlIndex = htmlIndex.replace("@Represent", ($.trim(Client.FirstName) == "" ? '' : Client.FirstName.toString().charAt(0).toUpperCase()))
                .replace("@FullName", ($.trim(Client.FirstName) == "" ? '' : Client.FirstName) + ($.trim(Client.LastName) == "" ? '' : ' ' + Client.LastName))
                .replace("@Description", (mobilenumberClient == "" && emailClient == "") ? "" : (mobilenumberClient == "" ? emailClient : (emailClient == "" ? mobilenumberClient : (mobilenumberClient + ", " + emailClient))))
                .replace("@TotalBooking", Client.Appointments).replace("@TotalSale", Client.TotalSales);
                //#endregion

                //#region Appointment
                if (data.Appointments && data.Appointments.length > 0) {
                    var htmlLsItem = "";
                    var ArrayStatus = [{ Status: "New", Text: "new appointment", Class: "text-primary" }, { Status: "Completed", Text: "completed", Class: "text-success" },
                    { Status: "NoShow", Text: "no show", Class: "text-danger" }, { Status: "Confirmed", Text: "confirmed", Class: "text-info" },
                    { Status: "Arrived", Text: "arrived", Class: "text-warning" }, { Status: "Started", Text: "started", Class: "text-info" },
                    { Status: "Cancelled", Text: "cancelled", Class: "text-danger" }];

                    $.each(data.Appointments, function (index, item) {
                        var itemStatus = ArrayStatus.filter(n => n.Status == item.Status)[0];
                        htmlLsItem += that.HTML.Appointment.Item.replace("@Day", moment(item.StartTime).format("DD")).replace("@Month", moment(item.StartTime).format("MMM"))
                        .replace("@Time", moment(item.StartTime).startOf('day').add(this.StartTimeInSecond, "seconds").format("ddd, HH:mm"))
                        .replace("@ServiceName", item.ServiceName).replace("@Price", item.Price)
                        .replace("@DurationNameAndStaff", (item.DurationName == "" ? "" : (item.DurationName)) + (item.StaffName == null ? "" : " with " + item.StaffName))
                        .replace("@Status", itemStatus ? itemStatus.Text : "").replace("@ClassStatus", itemStatus ? itemStatus.Class : "");
                    })
                    htmlAppointment = htmlAppointment.replace("@CountItem", data.Appointments.length).replace("@LsItem", htmlLsItem);
                } else {
                    htmlAppointment = htmlAppointment.replace("@CountItem", 0).replace("@LsItem", "");
                    htmlAppointment = EnableNoDataTab(htmlAppointment, "#container-no-appointment", "#container-appointment");
                }
                //#endregion

                //#region Product
                if (data.Products && data.Products.length > 0) {
                    var htmlLsItem = "";
                    $.each(data.Products, function (index, item) {
                        htmlLsItem += that.HTML.Product.Item.replace("@Quantity", item.Quantity + " sold").replace("@ProductName", item.ItemName)
                        .replace("@InvoiceDate", moment(item.InvoiceDate).format(Window.FormatDateWithDayOfWeekJS))
                        .replace("@PriceAfterDiscount", item.PriceAfterDiscount);
                    })
                    htmlProduct = htmlProduct.replace("@LsItem", htmlLsItem);
                } else {
                    htmlProduct = htmlProduct.replace("@LsItem", "");
                    htmlProduct = EnableNoDataTab(htmlProduct, "#container-no-product", "#container-product");
                }
                //#endregion

                //#region Invoice
                if (data.Invoices && data.Invoices.length > 0) {
                    var htmlLsItem = "";
                    var ArrayStatus = [{ Status: "invoice_status_complete", Text: Window.ResourcesEnum["invoice_status_complete"], Class: "text-success" },
                    { Status: "invoice_status_refund", Text: Window.ResourcesEnum["invoice_status_refund"], Class: "text-danger" }];

                    $.each(data.Products, function (index, item) {
                        var itemStatus = ArrayStatus.filter(n => n.Status == item.InvoiceStatus)[0];
                        itemStatus = itemStatus ? itemStatus : { Text: Window.ResourcesEnum[item.InvoiceStatus], Class: "text-info" };
                        htmlLsItem += that.HTML.Invoice.Item.replace("@InvoiceDate", moment(item.InvoiceDate).format(Window.FormatDateWithDayOfWeekJS))
                        .replace("@Total", item.TotalWithTip).replace("@ClassStatus", itemStatus.Class).replace("@Status", itemStatus.Text);
                    })
                    htmlInvoice = htmlInvoice.replace("@LsItem", htmlLsItem);
                } else {
                    htmlInvoice = htmlInvoice.replace("@LsItem", "");
                    htmlInvoice = EnableNoDataTab(htmlInvoice, "#container-no-invoice", "#container-invoice");
                }
                //#endregion

                //#region Info
                var ArrayDataInfo = [{ Value: Client.MobileNumber != null && Client.MobileNumber != undefined && Client.MobileNumber != "" ? ("+" + Client.MobileNumberDialCode + " " + Client.MobileNumber) : null, Name: 'Mobile' },
                { Value: Client.Email != null && Client.Email != undefined && Client.Email != "" ? Client.Email : null, Name: 'Email' },
                { Value: Client.Gender != null && Client.Gender != undefined && Client.Gender != "gender_unknown" ? Window.ResourcesEnum[Client.Gender] : null, Name: 'Gender' }];
                ArrayDataInfo = ArrayDataInfo.filter(n=>n.Value != null);
                if (ArrayDataInfo.length > 0) {
                    var htmlLsItem = "";
                    ArrayDataInfo.forEach(function (item) {
                        htmlLsItem += that.HTML.Info.Item.replace("@Name", item.Name).replace("@Value", item.Value);
                    })
                    htmlInfo = htmlInfo.replace("@LsItem", htmlLsItem);
                } else {
                    htmlInfo = htmlInfo.replace("@LsItem", "");
                    htmlInfo = EnableNoDataTab(htmlInfo, "#container-no-info", "#container-info");
                }
                //#endregion

                htmlIndex = htmlIndex.replace("@TabAppointments", htmlAppointment).replace("@TabProducts", htmlProduct)
                    .replace("@TabInovices", htmlInvoice).replace("@TabInfo", htmlInfo);
                that.Modal = $(htmlIndex);
                $("body").append(that.Modal);

                //event
                that.CreatEvent();

                EndLoading();
            }, 1000);
        })
    }
    //#endregion

    //#region Public
    OpenModal() {
        if (this.ClientID != undefined && this.ClientID != null && $.isNumeric(this.ClientID)) {
            var that = this;
            if (that.HTML.Index == null || that.HTML.Info.Index || that.HTML.Info.Item
                || that.HTML.Appointment.Index || that.HTML.Appointment.Item
                || that.HTML.Invoice.Index || that.HTML.Invoice.Item
                || that.HTML.Product.Index || that.HTML.Product.Item) {
                $.RequestAjaxText(LinkFileMobileAppointment.DetailClient.Index, function (data) { that.HTML.Index = data; });

                $.RequestAjaxText(LinkFileMobileAppointment.DetailClient.Info.Index, function (data) { that.HTML.Info.Index = data; });
                $.RequestAjaxText(LinkFileMobileAppointment.DetailClient.Info.Item, function (data) { that.HTML.Info.Item = data; });

                $.RequestAjaxText(LinkFileMobileAppointment.DetailClient.Appointment.Index, function (data) { that.HTML.Appointment.Index = data; });
                $.RequestAjaxText(LinkFileMobileAppointment.DetailClient.Appointment.Item, function (data) { that.HTML.Appointment.Item = data; });

                $.RequestAjaxText(LinkFileMobileAppointment.DetailClient.Invoice.Index, function (data) { that.HTML.Invoice.Index = data; });
                $.RequestAjaxText(LinkFileMobileAppointment.DetailClient.Invoice.Item, function (data) { that.HTML.Invoice.Item = data; });

                $.RequestAjaxText(LinkFileMobileAppointment.DetailClient.Product.Index, function (data) { that.HTML.Product.Index = data; });
                $.RequestAjaxText(LinkFileMobileAppointment.DetailClient.Product.Item, function (data) { that.HTML.Product.Item = data; });
            }
            that.LoadDataDetailClient();
        }
    }
    HideModal() {
        this.Modal.hide();
        this.RemoveEvent();
    }
    RemoveModal() {
        this.Modal.remove();
        this.RemoveEvent();
    }
    //#endregion

}
//#endregion

$(function () {
    var t = new MobileDetailClient(133);
    t.OpenModal();
})