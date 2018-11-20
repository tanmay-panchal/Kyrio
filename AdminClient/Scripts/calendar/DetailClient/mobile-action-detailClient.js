var prefixFileMobilDetailClient = "/ContentHtml/DetailClient/Mobile";
var LinkFileMobileDetailClient = {
    DetailClient: {
        Index: prefixFileMobilDetailClient + "/Index.html",
        Appointment: {
            Index: prefixFileMobilDetailClient + "/Appointment/Index.html",
            Item: prefixFileMobilDetailClient + "/Appointment/Item.html",
        },
        Info: {
            Index: prefixFileMobilDetailClient + "/Info/Index.html",
            Item: prefixFileMobilDetailClient + "/Info/Item.html",
        },
        Invoice: {
            Index: prefixFileMobilDetailClient + "/Invoice/Index.html",
            Item: prefixFileMobilDetailClient + "/Invoice/Item.html",
        },
        Product: {
            Index: prefixFileMobilDetailClient + "/Product/Index.html",
            Item: prefixFileMobilDetailClient + "/Product/Item.html",
        }
    },
};
var LinkFileJSDetailClient = {
    AddOrEditClient: "/Scripts/calendar/AddOrEditClient/mobile-action-addOrEditClient.js",
}

class MobileDetailClient {
    constructor(callBackRemoveClient, callBackHideModal) {
        var that = this;
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
        this.Data = {
            Client: null,
        };
        this.Parameter = {
            CallBackRemoveClient: callBackRemoveClient,
            CallBackHideModal: callBackHideModal
        }

        if (typeof MobileAddOrEditClient != "function")
            $.RequestAjaxSript(LinkFileJSDetailClient.AddOrEditClient)
        that.PageModal = {
            AddOrEditClient: new MobileAddOrEditClient(function () {
                that.Modal.show("slow");
                that.LoadDataDetailClient();
            }),
        };
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
        that.Modal.find("#container-tab-detail-client li a").on('click', function (e) {
            e.preventDefault()
            $(this).tab('show');
        })
        that.Modal.find("#buttonEditClient_ClientDetail").click(function () {
            that.Modal.hide();
            that.PageModal.AddOrEditClient.CreateModal("", "", that.Parameter.ClientID);
        })
        that.Modal.find("#buttonRemoveClient_ClientDetail").click(function () {
            that.RemoveModal();
            if (that.Parameter.CallBackRemoveClient)
                that.Parameter.CallBackRemoveClient();
        })
        this.Modal.find("[name='closeModal']").click(function () {
            that.HideModal();
        })
    }
    RemoveEvent() {
        this.Modal.find("#buttonShowAction_ClientDetail").off("click");
        this.Modal.find("#container-action-client-detail").find("button").off("click");
        this.Modal.find("#container-tab-detail-client li a").off("click");
        this.Modal.find("#buttonEditClient_ClientDetail").off("click");
        this.Modal.find("#buttonRemoveClient_ClientDetail").off("click");
        this.Modal.find("[name='closeModal']").off("click");
    }
    LoadDataDetailClient() {
        var that = this;
        if (this.Modal)
            this.RemoveModal();
        $.RequestAjax("/Calendar/GetClientBaseIdForAppointment", JSON.stringify({ ClientId: that.Parameter.ClientID }), function (data) {
            StartLoading();
            setTimeout(function () {
                var Client = data.Client;
                that.Data.Client = Client;
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
    OpenModal(ClientID) {
        if (ClientID != undefined && ClientID != null && $.isNumeric(ClientID)) {
            this.Parameter.ClientID = ClientID;
            var that = this;
            if (that.HTML.Index == null || that.HTML.Info.Index || that.HTML.Info.Item == null
                || that.HTML.Appointment.Index == null || that.HTML.Appointment.Item == null
                || that.HTML.Invoice.Index == null || that.HTML.Invoice.Item == null
                || that.HTML.Product.Index == null || that.HTML.Product.Item == null) {
                $.RequestAjaxText(LinkFileMobileDetailClient.DetailClient.Index, function (data) { that.HTML.Index = data; });

                $.RequestAjaxText(LinkFileMobileDetailClient.DetailClient.Info.Index, function (data) { that.HTML.Info.Index = data; });
                $.RequestAjaxText(LinkFileMobileDetailClient.DetailClient.Info.Item, function (data) { that.HTML.Info.Item = data; });

                $.RequestAjaxText(LinkFileMobileDetailClient.DetailClient.Appointment.Index, function (data) { that.HTML.Appointment.Index = data; });
                $.RequestAjaxText(LinkFileMobileDetailClient.DetailClient.Appointment.Item, function (data) { that.HTML.Appointment.Item = data; });

                $.RequestAjaxText(LinkFileMobileDetailClient.DetailClient.Invoice.Index, function (data) { that.HTML.Invoice.Index = data; });
                $.RequestAjaxText(LinkFileMobileDetailClient.DetailClient.Invoice.Item, function (data) { that.HTML.Invoice.Item = data; });

                $.RequestAjaxText(LinkFileMobileDetailClient.DetailClient.Product.Index, function (data) { that.HTML.Product.Index = data; });
                $.RequestAjaxText(LinkFileMobileDetailClient.DetailClient.Product.Item, function (data) { that.HTML.Product.Item = data; });
            }
            that.LoadDataDetailClient();
            this.ClientID = null;
        }
    }
    HideModal() {
        if (this.Modal != null) {
            this.Modal.hide();
            this.RemoveEvent();
        }
        if (this.Parameter.CallBackHideModal)
            this.Parameter.CallBackHideModal(this.Data.Client);
    }
    RemoveModal() {
        if (this.Modal != null) {
            this.Modal.remove();
            this.RemoveEvent();
        }
    }
    //#endregion

}