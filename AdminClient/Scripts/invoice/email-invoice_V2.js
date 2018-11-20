class EmailInvoice {
    constructor(invoiceId, urlRequestData, urlRequestHtml) {
        var that = this;
        this.InvoiceID = invoiceId;
        this.UrlRequestData = urlRequestData ? urlRequestData : "/Sale/GetInvoiceBaseId";
        this.UrlRequestHtml = urlRequestHtml ? urlRequestHtml : "/ContentHtml/Invoice/Email_V2.html";
        $.RequestAjaxText(this.UrlRequestHtml, function (data) { that.HtmlContaint = data; });
    }
    GetHtml(callback) {
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
            var htmlTempleteTaxDetail = '<tr style="font-size: 14px"><td style="padding-left: 8px">@TaxName</td><td style="text-align: right; padding-right: 8px">@TaxAmount</td></tr>';
            var htmlTempleteInvoice = '<tr style="font-size: 14px"><td style="padding-left: 8px">@PaymentTypeName</td><td style="text-align: right; padding-right: 8px">@PaymentAmount</td></tr><tr style="font-size: 11px; color: #626262;"><td colspan="2" style="padding: 0 0 8px 8px">@PaymentDate</td></tr>';
            var htmlTempleteInvoiceDetail = '<tr style="font-size: 14px"><td style="width: 10%; padding-top: 14px; padding-left: 8px; vertical-align: top">@Quantity</td><td style="width: 65%; padding-top: 14px;">@ItemName</td><td style="width: 25%; padding: 14px 8px 0 0; text-align: right; vertical-align: top">@Price</td></tr><tr style="color: #626262"><td style="width: 10%; padding: 0 0 14px 8px">&nbsp;</td><td style="font-size: 13px; width: 65%; padding-bottom: 14px">@ItemDetail</td><td style="width: 25%; padding: 0 8px 14px 0; text-align: right;"><del>@OrgPriceDisplay</del></td></tr>';
            var htmlChange = '<tr style="font-size: 22px"><td style="padding-left: 8px">Change</td><td style="text-align: right; padding-right: 8px;">@ChangeValue</td></tr>';
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
                if (this.RetailPrice > this.PriceAfterDiscount) {
                    htmlInvoiceDetail += htmlTempleteInvoiceDetail
                    .replace("@Quantity", this.Quantity)
                    .replace("@ItemName", this.ItemName + (this.ItemType == "item_type_gift_voucher" ? ": " + $.FormatNumberMoney(this.VoucherValue) : ""))
                .replace("@ItemDetail", ItemDetail).replace("@ItemDetail", ItemDetail)
                    .replace("@Price", $.number(this.PriceAfterDiscount, Window.NumberDecimal, '.', ','))
                        .replace("@OrgPriceDisplay", $.number(this.RetailPrice, Window.NumberDecimal, '.', ','));
                }
                else {
                    htmlInvoiceDetail += htmlTempleteInvoiceDetail
                    .replace("@Quantity", this.Quantity)
                    .replace("@ItemName", this.ItemName + (this.ItemType == "item_type_gift_voucher" ? ": " + $.FormatNumberMoney(this.VoucherValue) : ""))
                .replace("@ItemDetail", ItemDetail).replace("@ItemDetail", ItemDetail)
                    .replace("@Price", $.number(this.PriceAfterDiscount, Window.NumberDecimal, '.', ',')).replace("@OrgPriceDisplay", "");
                }


            })
            $.each(TaxDetail, function () {
                htmlTaxDetail += htmlTempleteTaxDetail.replace("@TaxName", this.TaxName + " " + $.number(this.TaxRate, 0, '.', ',') + "%")
                    .replace("@TaxAmount", $.FormatNumberMoney(this.TaxAmount));
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
                .replace("@Email", Window.saleShowCustomerInfo == "0" ? "" : email)
                .replace("@MobileNumber", Window.saleShowCustomerInfo == "0" ? "" : mobile)
                .replace("@Address", Window.saleShowCustomerAddress == "0" ? "" : address)
                .replace("@TotalValue", $.FormatNumberMoney(Invoice.Total))
                .replace("@BalanceValue", $.FormatNumberMoney(Invoice.Balance))
                .replace("@TaxDetail", htmlTaxDetail)
                .replace("@InvoiceDetail", htmlInvoiceDetail)
                .replace("@InvoiceContaint", htmlInvoice)
                .replace("@Line3", Window.receiptMessage)
                .replace("@SiteName", Window.SiteName)
                .replace("@BrandName", Window.BrandName);
            if (Invoice.Change > 0) {
                html = html.replace("@Change", htmlChange.replace("@ChangeValue", $.FormatNumberMoney(Invoice.Change)));
            }
            else {
                html = html.replace("@Change", "");
            }

            if (callback)
                callback(html)
        })
    }
}