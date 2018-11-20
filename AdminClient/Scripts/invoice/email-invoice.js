class EmailInvoice {
    constructor(invoiceId, urlRequestData, urlRequestHtml) {
        var that = this;
        this.InvoiceID = invoiceId;
        this.UrlRequestData = urlRequestData ? urlRequestData : "/Sale/GetInvoiceBaseId";
        this.UrlRequestHtml = urlRequestHtml ? urlRequestHtml : "/ContentHtml/Invoice/Email.html";
        $.RequestAjaxText(this.UrlRequestHtml, function (data) { that.HtmlContaint = data; });
    }
    GetHtml(callback) {
        var that = this;
        $.RequestAjax(this.UrlRequestData, JSON.stringify({
            "InvoiceID": this.InvoiceID
        }), function (reponsive) {
            ; debugger;
            var Invoice = reponsive.Invoice;
            var Client = reponsive.Client;
            var InvoiceDetail = reponsive.InvoiceDetail;
            var InvoicePayment = reponsive.InvoicePayment;
            var Refund = reponsive.Refund;
            var OrgInvoice = reponsive.OrgInvoice;
            var Location = reponsive.Location;
            var htmlTempleteTaxDetail = '<div style="display:flex;"><p>@TaxName</p><p style="flex:1; text-align:right">@TaxAmount</p></div>';
            var htmlTempleteInvoice = '<div style="display:flex;"><div style="flex: 1"><p>@PaymentTypeName</p><p>@PaymentDate</p></div><p>@PaymentAmount</p></div>';
            var htmlTempleteInvoiceDetail = '<div style="display:flex; padding-top: 2px;padding-bottom: 2px;"><p>@Quantity</p><div style="display:flex; flex-direction: column; flex: 1; padding-left: 30px; padding-right: 10px"><p>@ItemName</p><p>@ItemDetail</p></div><p>@Price</p></div>';
            var TaxDetail = [];
            var htmlInvoiceDetail = "";
            var htmlInvoice = "";
            var htmlTaxDetail = htmlTempleteTaxDetail.replace("@TaxName", "Subtotal").replace("@TaxAmount", $.FormatNumberMoney(Invoice.SubTotalBeForeTax));
            $.each(InvoiceDetail, function () {
                if (this.TaxID != null && this.TaxID != 0) {
                    if (TaxDetail.length > 0) {
                        var isexist = false;
                        for (var i = 0; i < TaxDetail.length; i++) {
                            if (this.TaxID == TaxDetail[i].TaxID) {
                                TaxDetail[i].TaxAmount = TaxDetail[i].TaxAmount + this.TotalTaxDetail;
                                isexist = true;
                                break;
                            }
                        }
                        if (isexist == false) {
                            TaxDetail.push({
                                TaxID: this.TaxID,
                                TaxName: this.TaxName,
                                TaxAmount: this.TotalTaxDetail,
                                TaxRate: this.TaxRate
                            });
                        }
                    }
                    else {
                        TaxDetail.push({
                            TaxID: this.TaxID,
                            TaxName: this.TaxName,
                            TaxAmount: this.TotalTaxDetail,
                            TaxRate: this.TaxRate
                        });
                    }
                }
                var ItemDetail = "";
                if (this.ItemType == "item_type_product") {
                    ItemDetail = ItemDetail + (this.Barcode == null ? "" : this.Barcode);
                    if (ItemDetail == "")
                        ItemDetail = ItemDetail == "" ? "" : ((this.DiscountName == null || this.DiscountName == "") ? "" : "" + this.DiscountName);
                    else
                        ItemDetail = ItemDetail + ((this.DiscountName == null || this.DiscountName == "") ? "" : ", " + this.DiscountName);
                }
                else if (this.ItemType == "item_type_service") {
                    if (this.AppointmentServiceID != null && this.AppointmentServiceID != 0) {
                        ItemDetail = ItemDetail + (this.StartTimeAPSService == null ? "" : (moment(this.StartTimeAPSService).format(Window.FormatTimeJS) + ', ' + moment(this.StartTimeAPSService).format(Window.FormatDateMonthNameJS)));
                        ItemDetail = ItemDetail == "" ? "" : (ItemDetail + ", " + (this.StaffAPSService == null ? "" : " with  " + this.StaffAPSService));
                    }
                    else {
                        ItemDetail = (this.StaffIV == null || this.StaffIV == "") ? "" : " with  " + this.StaffIV;
                    }
                }
                else {
                    ItemDetail = "Code: " + this.VoucherCode + ", expires on " + moment(this.ExpireDate).format(Window.FormatDateMonthNameJS);
                }
                htmlInvoiceDetail += htmlTempleteInvoiceDetail.replace("@Quantity", this.Quantity).replace("@ItemName", this.ItemName + (this.ItemType == "item_type_gift_voucher" ? ": " + $.FormatNumberMoney(this.VoucherValue) : ""))
                .replace("@ItemDetail", ItemDetail).replace("@ItemDetail", ItemDetail).replace("@Price", $.number(this.Price, Window.NumberDecimal, '.', ','));
            })
            $.each(TaxDetail, function () {
                htmlTaxDetail += htmlTempleteTaxDetail.replace("@TaxName", this.TaxName + " " + $.number(this.TaxRate, 0, '.', ',') + "%").replace("@TaxAmount", $.FormatNumberMoney(this.TaxAmount));
            })
            $.each(InvoicePayment, function () {
                htmlInvoice += htmlTempleteInvoice.replace("@PaymentTypeName", this.PaymentTypeName ? this.PaymentTypeName : "").replace("@PaymentAmount", $.FormatNumberMoney(this.PaymentAmount))
                .replace("@PaymentDate", moment(this.PaymentDate).format(Window.FormatDateWithDayOfWeekJS));
            })
            var html = that.HtmlContaint.replace("@BusinessName", Window.BusinessName).replace("@Location", [Location.LocationName, Location.StreetAddress, Location.APT, Location.City, Location.State, Location.ZipCode].filter(n=> n != null && n != "null").map(n=> n = " " + n).join().trim())
                .replace("@InvoiceNo", Window.customInvoiceTitle + " #" + Invoice.InvoiceNo).replace("@InvoiceDate", moment(Invoice.InvoiceDate).format("dddd, DD MMM YYYY")).replace("@InvoiceDesc", OrgInvoice ? "Refund of original invoice " + OrgInvoice.InvoiceNo : "")
                .replace("@TotalValue", $.FormatNumberMoney(Invoice.Total)).replace("@BalanceValue", $.FormatNumberMoney(Invoice.Balance)).replace("@TaxDetail", htmlTaxDetail).replace("@InvoiceDetail", htmlInvoiceDetail).replace("@InvoiceContaint", htmlInvoice).replace("@ChangeValue", $.FormatNumberMoney(Invoice.Change));
            if (Invoice.Change > 0) {
                html = html.replace("@displayChange", "flex");
            }
            else {
                html = html.replace("@displayChange", "none");
            }

            if (callback)
                callback($(html).html())
        })
    }
}