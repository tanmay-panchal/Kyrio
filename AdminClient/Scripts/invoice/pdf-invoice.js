class PDFInvoice {
    constructor(invoiceId, urlRequestData, urlRequestPdfMake) {
        this.InvoiceID = invoiceId;
        this.UrlRequestData = urlRequestData ? urlRequestData : "/Sale/GetInvoiceBaseId";
    }
    GeneratePDF(isdownload) {
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
            var TaxDetail = [];
            var rowInvoiceDetail = [];

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
                rowInvoiceDetail.push([this.Quantity, this.ItemName + (this.ItemType == "item_type_gift_voucher" ? ": " + $.FormatNumberMoney(this.VoucherValue) : ""), { text: $.number(this.PriceAfterDiscount, Window.NumberDecimal, '.', ','), style: 'numberCol', }]);
                if (this.RetailPrice > this.PriceAfterDiscount) {
                    rowInvoiceDetail.push(["", ItemDetail, ""]);
                }
                else {
                    rowInvoiceDetail.push(["", ItemDetail, ""]);
                }

            })
            var rowTaxDetail = [["Subtotal", { text: $.FormatNumberMoney(Invoice.SubTotalBeForeTax), style: 'numberCol', }]];
            $.each(TaxDetail, function () {
                rowTaxDetail.push([this.TaxName + " " + $.number(this.TaxRate, 0, '.', ',') + "%", { text: $.FormatNumberMoney(this.TaxAmount), style: 'numberCol', }]);
            })
            var rowInvoice = [];

            if (Invoice.TipAmount > 0) {
                rowInvoice.push(["Tips", { text: $.FormatNumberMoney(Invoice.TipAmount), style: 'numberCol', }]);
                rowInvoice.push([{ text: "", style: 'desc' }, ""]);
            }
            $.each(InvoicePayment, function () {
                rowInvoice.push([this.PaymentTypeName, { text: $.FormatNumberMoney(this.PaymentAmount), style: 'numberCol', }]);
                rowInvoice.push([{ text: moment(this.PaymentDate).format(Window.FormatDateWithDayOfWeekJS), style: 'desc' }, ""]);
            })
            var body = [];
            if (Invoice.Change > 0) {
                body = [
                                [
                                    {
                                        margin: [0, 7, 0, 7],
                                        table: {
                                            widths: ["auto", "*", "auto"],
                                            body: rowInvoiceDetail,
                                        },
                                        layout: 'noBorders'
                                    },
                                ],
                                [
                                    {
                                        margin: [0, 7, 0, 7],
                                        table: {
                                            widths: ["*", "auto"],
                                            body: rowTaxDetail,
                                        },
                                        layout: 'noBorders'
                                    },
                                ],
                                [{
                                    margin: [0, 7, 0, 7],
                                    columns: [
                                        { width: "*", text: "Total" },
                                        { width: "auto", text: $.FormatNumberMoney(Invoice.Total), style: 'numberCol' }
                                    ]
                                }],
                                [
                                    {
                                        margin: [0, 7, 0, 7],
                                        table: {
                                            widths: ["*", "auto"],
                                            body: rowInvoice,
                                        },
                                        layout: 'noBorders'
                                    },
                                ],
                                [{
                                    margin: [0, 7, 0, 7],
                                    columns: [
                                        { width: "*", text: "Change" },
                                        { width: "auto", text: $.FormatNumberMoney(Invoice.Change), style: 'numberCol' }
                                    ]
                                }],
                                [{
                                    margin: [0, 7, 0, 7],
                                    columns: [
                                        { width: "*", text: "Balance" },
                                        { width: "auto", text: $.FormatNumberMoney(Invoice.Balance), style: 'numberCol' }
                                    ]
                                }],
                ];
            }
            else {
                body = [
                                [
                                    {
                                        margin: [0, 7, 0, 7],
                                        table: {
                                            widths: ["auto", "*", "auto"],
                                            body: rowInvoiceDetail,
                                        },
                                        layout: 'noBorders'
                                    },
                                ],
                                [
                                    {
                                        margin: [0, 7, 0, 7],
                                        table: {
                                            widths: ["*", "auto"],
                                            body: rowTaxDetail,
                                        },
                                        layout: 'noBorders'
                                    },
                                ],
                                [{
                                    margin: [0, 7, 0, 7],
                                    columns: [
                                        { width: "*", text: "Total" },
                                        { width: "auto", text: $.FormatNumberMoney(Invoice.Total), style: 'numberCol' }
                                    ]
                                }],
                                [
                                    {
                                        margin: [0, 7, 0, 7],
                                        table: {
                                            widths: ["*", "auto"],
                                            body: rowInvoice,
                                        },
                                        layout: 'noBorders'
                                    },
                                ],
                                [{
                                    margin: [0, 7, 0, 7],
                                    columns: [
                                        { width: "*", text: "Balance" },
                                        { width: "auto", text: $.FormatNumberMoney(Invoice.Balance), style: 'numberCol' }
                                    ]
                                }],
                ];
            }
            pdfMake.createPdf({
                pageSize: "A4",
                pageOrientation: "portrait",
                content: [
                    {
                        stack: [
                            { text: Window.BusinessName, style: 'title' },
                            { text: [Location.LocationName, Location.StreetAddress, Location.APT, Location.City, Location.State, Location.ZipCode].filter(n=> n != null && n != "null").map(n=> n = " " + n).join().trim(), style: 'titleDesc' },
                            { text: Window.saleCustomHeader1, style: 'titleDesc' },
                            { text: Window.saleCustomHeader2, style: 'titleDesc' },
                        ]
                    },
                    {
                        margin: [0, 20, 0, 0],
                        stack: [
                            { text: Window.customInvoiceTitle + ' #' + Invoice.InvoiceNo, style: 'title' },
                            { text: moment(Invoice.InvoiceDate).format("dddd, DD MMM YYYY"), style: 'titleDesc' },
                            { text: OrgInvoice ? "Refund of original invoice " + OrgInvoice.InvoiceNo : "", style: 'titleDesc' }
                        ]
                    },
                    {
                        margin: [0, 5, 0, 0],
                        stack: [
                            { text: "Client" },
                        ],
                    },
                    {
                        margin: [0, 7, 0, 0],
                        stack: [
                            { text: Invoice.ClientName },
                            { text: Window.saleShowCustomerInfo == "0" ? "" : email },
                            { text: Window.saleShowCustomerInfo == "0" ? "" : mobile },
                            { text: Window.saleShowCustomerAddress == "0" ? "" : address },
                        ]
                    },
                    {
                        margin: [0, 0, 0, 0],
                        table: {
                            widths: ["*"],
                            body: body
                        },
                        layout: 'lightHorizontalLines'
                    },
                    {
                        stack: [
                            { text: Window.receiptMessage, style: 'titleDesc' },
                        ]
                    },
                ],
                styles: {
                    title: {
                        alignment: 'center',
                        fontSize: 18,
                        bold: true,
                    },
                    titleDesc: {
                        alignment: 'center',
                        fontSize: 14
                    },
                    desc: {
                        fontSize: 9
                    },
                    numberCol: {
                        alignment: 'right'
                    },
                },
                defaultStyle: {
                    color: "#2C2C2C",
                    fontSize: 11
                }
            }).download("invoice-" + Invoice.InvoiceNo + ".pdf");
        })
    }
}