class PrintInvoice {
    constructor(invoiceId, urlRequestData, urlRequestHtml) {
        var that = this;
        this.InvoiceID = invoiceId;
        this.UrlRequestData = urlRequestData ? urlRequestData : "/Sale/GetInvoiceBaseId";
        this.UrlRequestHtml = urlRequestHtml ? urlRequestHtml : "/ContentHtml/Invoice/Print.html";
        $.RequestAjaxText(this.UrlRequestHtml, function (data) { that.HtmlContaint = data; });
    }
    Print() {
        var that = this;
        $.RequestAjax(this.UrlRequestData, JSON.stringify({
            "InvoiceID": this.InvoiceID
        }), function (reponsive) {
            var Invoice = reponsive.Invoice;
            var Client = reponsive.Client;
            var InvoiceDetail = reponsive.InvoiceDetail;
            var InvoicePayment = reponsive.InvoicePayment;
            var Refund = reponsive.Refund;
            var OrgInvoice = reponsive.OrgInvoice;
            var Location = reponsive.Location;
            var htmlTempleteTaxDetail = '<div class="d-flex"><p>@TaxName</p><p style="flex:1; text-align:right">@TaxAmount</p></div>';
            var htmlTempleteInvoice = '<div class="d-flex"><div style="flex: 1"><p>@PaymentTypeName</p><p>@PaymentDate</p></div><p>@PaymentAmount</p></div>';
            var htmlTempleteInvoiceDetail = '<div class="item-invoice-detail"><p>@Quantity</p><div class="item-invoice-name"><p>@ItemName</p><p>@ItemDetail</p></div><div><p>@Price</p><p><del>@OrgPriceDisplay</del></p></div></div>';
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
                    ItemDetail = ItemDetail + (ItemDetail == "" ? "" : ",") + (this.SKU == null ? "" : this.SKU);
                    if (ItemDetail == "")
                        ItemDetail = ((this.DiscountName == null || this.DiscountName == "") ? "" : "" + this.DiscountName);
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
                if (this.RetailPrice > this.PriceAfterDiscount) {
                    htmlInvoiceDetail += htmlTempleteInvoiceDetail
                    .replace("@Quantity", this.Quantity)
                    .replace("@ItemName", this.ItemName + (this.ItemType == "item_type_gift_voucher" ? ": " + $.FormatNumberMoney(this.VoucherValue) : ""))
                .replace("@ItemDetail", ItemDetail)
                    .replace("@ItemDetail", ItemDetail)
                    .replace("@Price", $.number(this.Price, Window.NumberDecimal, '.', ','))
                    .replace("@OrgPriceDisplay", $.number(this.RetailPrice, Window.NumberDecimal, '.', ','));
                }
                else {
                    htmlInvoiceDetail += htmlTempleteInvoiceDetail
                    .replace("@Quantity", this.Quantity)
                    .replace("@ItemName", this.ItemName + (this.ItemType == "item_type_gift_voucher" ? ": " + $.FormatNumberMoney(this.VoucherValue) : ""))
                .replace("@ItemDetail", ItemDetail)
                    .replace("@ItemDetail", ItemDetail)
                    .replace("@Price", $.number(this.Price, Window.NumberDecimal, '.', ','))
                    .replace("@OrgPriceDisplay", "");
                }


            })
            $.each(TaxDetail, function () {
                htmlTaxDetail += htmlTempleteTaxDetail.replace("@TaxName", this.TaxName + " " + $.number(this.TaxRate, 0, '.', ',') + "%").replace("@TaxAmount", $.FormatNumberMoney(this.TaxAmount));
            })
            if (Invoice.TipAmount > 0) {
                htmlInvoice += htmlTempleteInvoice.replace("@PaymentTypeName", "Tips")
                    .replace("@PaymentAmount", $.FormatNumberMoney(Invoice.TipAmount))
                .replace("@PaymentDate", "");
            }
            $.each(InvoicePayment, function () {
                htmlInvoice += htmlTempleteInvoice.replace("@PaymentTypeName", this.PaymentTypeName ? this.PaymentTypeName : "")
                    .replace("@PaymentAmount", $.FormatNumberMoney(this.PaymentAmount))
                .replace("@PaymentDate", moment(this.PaymentDate).format(Window.FormatDateWithDayOfWeekJS));
            })
            var email = (Client == null ? "" : ((Client.Email == null || Client.Email == "") ? "" : Client.Email));
            var mobile = Client == null ? "" : ((Client.MobileNumber == null || Client.MobileNumber == "") ? "" : ("+" + Client.MobileNumberDialCode + " " + Client.MobileNumber));
            var address = Client == null ? "" : ((Client.Address == null || Client.Address == "") ? "" : Client.Address);
            var Suburb = Client == null ? "" : ((Client.Suburb == null || Client.Suburb == "") ? "" : Client.Suburb);
            var City = Client == null ? "" : ((Client.City == null || Client.City == "") ? "" : Client.City);
            var State = Client == null ? "" : ((Client.State == null || Client.State == "") ? "" : Client.State);
            var PostCode = Client == null ? "" : ((Client.PostCode == null || Client.PostCode == "") ? "" : Client.PostCode);

            address = (address == "" && Suburb == "") ? "" : ((address == "" || Suburb == "") ? (address + Suburb) : (address + ", " + Suburb));
            address = (address == "" && City == "") ? "" : ((address == "" || City == "") ? (address + City) : (address + ", " + City));
            address = (address == "" && State == "") ? "" : ((address == "" || State == "") ? (address + State) : (address + ", " + State));
            address = (address == "" && PostCode == "") ? "" : ((address == "" || PostCode == "") ? (address + PostCode) : (address + ", " + PostCode));

            var html = that.HtmlContaint.replace("@BusinessName", Window.BusinessName)
                .replace("@Location", [Location.LocationName, Location.StreetAddress, Location.APT, Location.City, Location.State, Location.ZipCode].filter(n=> n != null && n != "null").map(n=> n = " " + n).join().trim())
                .replace("@Line1", Window.saleCustomHeader1)
                .replace("@Line2", Window.saleCustomHeader2)
                .replace("@InvoiceNo", Window.customInvoiceTitle + " #" + Invoice.InvoiceNo)
                .replace("@InvoiceDate", moment(Invoice.InvoiceDate).format("dddd, DD MMM YYYY"))
                .replace("@InvoiceDesc", OrgInvoice ? "Refund of original invoice " + OrgInvoice.InvoiceNo : "")
                .replace("@ClientName", Invoice.ClientName)
                .replace("@Email", Window.saleShowCustomerInfo == "0" ? "" : (email == "" ? "" : "<br>" + email))
                .replace("@MobileNumber", Window.saleShowCustomerInfo == "0" ? "" : (mobile == "" ? "" : "<br>" + mobile))
                .replace("@Address", Window.saleShowCustomerAddress == "0" ? "" : (address == "" ? "" : "<br>" + address))
                .replace("@TotalValue", $.FormatNumberMoney(Invoice.Total))
                .replace("@BalanceValue", $.FormatNumberMoney(Invoice.Balance))
                .replace("@TaxDetail", htmlTaxDetail)
                .replace("@InvoiceDetail", htmlInvoiceDetail)
                .replace("@InvoiceContaint", htmlInvoice)
                .replace("@ChangeValue", $.FormatNumberMoney(Invoice.Change))
                .replace("@Line3", Window.receiptMessage);

            if (Invoice.Change > 0) {
                html = html.replace("@displayChange", "flex");
            }
            else {
                html = html.replace("@displayChange", "none");
            }
            var win = window.open('', '');
            win.document.close();
            var head = '<title>Print Invoice</title><meta charset="utf-8" /><link href="/Content/coretheme.min.css" rel="stylesheet" />'
            win.document.write(html);
            win.setTimeout(function () {
                win.print();
                win.close();
            }, 500);

        })
    }
}