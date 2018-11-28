//#region variable
var urlGetDataAllPaymentType = "/Home/GetDataAllPaymentType";
var urlSaveInvoice = "/Sale/SaveInvoice";
var urlGetAppointmentBaseId = "/Sale/GetAppointmentBaseId";
var urlGetInvoiceBaseId = "/Sale/GetInvoiceBaseId";
var urlSearchVoucherCode = "/Sale/SearchVoucherCode"
var objectParent = {
    text: "",
    prefix: "m",
    prefixPrev: "",
    idPrev: "0",
    data: [
        {
            text: "Products",
            id: "1",
            prefix: "m",
            prefixPrev: "",
            data: []
        },
        {
            text: "Services",
            id: "2",
            prefix: "m",
            prefixPrev: "",
            data: []
        },
        {
            text: "Vouchers",
            id: "3",
            prefix: "m",
            prefixPrev: "",
            data: []
        }
    ]
};
var objectVouchers = {
    text: "",
    prefix: "v_g",
    prefixPrev: "m",
    idPrev: "3",
    data: [
        {
            text: "Gift Voucher",
            prefix: "v_g",
            prefixPrev: "m",
            idPrev: "3",
            id: "1",
            methodClick: function () {
                $.ModalGiftVoucher(function () {
                    var modal = $(this).closest(".modal");
                    var value = modal.find("#value").val();
                    var VoucherExpiryDate;
                    var expiry = modal.find("#expiry").val();
                    if (expiry == "months_1") {
                        VoucherExpiryDate = moment(moment().tz(Window.TimeZone).format("YYYY-MM-DD")).add(1, 'month').format("YYYY/MM/DD");
                    }
                    else if (expiry == "months_2") {
                        VoucherExpiryDate = moment(moment().tz(Window.TimeZone).format("YYYY-MM-DD")).add(2, 'month').format("YYYY/MM/DD");
                    }
                    else if (expiry == "months_3") {
                        VoucherExpiryDate = moment(moment().tz(Window.TimeZone).format("YYYY-MM-DD")).add(3, 'month').format("YYYY/MM/DD");
                    }
                    else if (expiry == "months_6") {
                        VoucherExpiryDate = moment(moment().tz(Window.TimeZone).format("YYYY-MM-DD")).add(6, 'month').format("YYYY/MM/DD");
                    }
                    else if (expiry == "years_1") {
                        VoucherExpiryDate = moment(moment().tz(Window.TimeZone).format("YYYY-MM-DD")).add(1, 'years').format("YYYY/MM/DD");
                    }
                    else if (expiry == "end_of_month") {
                        VoucherExpiryDate = moment(moment().tz(Window.TimeZone).format("YYYY-MM-DD")).endOf('month').format("YYYY/MM/DD");
                    }
                    else if (expiry == "custom") {
                        VoucherExpiryDate = $("#ExpiryManual").data('daterangepicker').startDate.format("YYYY/MM/DD");
                    }
                    else {
                        VoucherExpiryDate = "";
                    }

                    if (value == null || value == "" || value == "0") {
                        toastr["error"]("Amount is required", "Notification");
                    }
                    else {
                        $("#containtItem").CreateItem(true, true, {
                            ItemID: 0,
                            ItemName: "Gift Voucher",
                            DisplayName: "Gift Voucher",
                            ItemType: "item_type_gift_voucher",
                            OnHand: 0,
                            SpecialPrice: 0,
                            RetailPrice: parseFloat(value),
                            VoucherExpiryDate: VoucherExpiryDate,
                            TaxID: 0,
                            TaxRate: 0,
                            EnableCommission: 0,
                            Duration: 0
                        }, $.GetLocation());
                        $.ModalWizardClose();
                    }
                });
            }
        },
        {
            text: "Service Vouchers",
            prefix: "v_g",
            prefixPrev: "m",
            idPrev: "3",
            id: "2",
        }
    ]
};
var GetObjectServiceGroup = function (item) {
    return {
        id: item.ServiceGroupID,
        text: item.ServiceGroupName
    };
}
var GetObjectProduct = function (item) {
    return $.extend({
        id: item.ProductID,
        ProductName: item.ProductName,
        SpecialPrice: item.SpecialPrice,
        OnHand: item.OnHand,
        RetailPrice: item.RetailPrice,
        TaxID: item.TaxID,
        TaxRate: item.TaxRate,
        Barcode: item.Barcode,
        EnableStockControl: item.EnableStockControl,
        EnableCommission: item.EnableCommission,
        methodClick: function () {
            if (item.OnHand != 0 || item.EnableStockControl == false) {
                $("#containtItem").CreateItem(true, true, {
                    ItemID: item.ProductID,
                    ItemName: item.ProductName,
                    DisplayName: item.ProductName,
                    ItemType: "item_type_product",
                    OnHand: item.OnHand,
                    SpecialPrice: item.SpecialPrice,
                    RetailPrice: item.RetailPrice,
                    TaxID: item.TaxID,
                    TaxRate: item.TaxRate,
                    Barcode: item.Barcode,
                    EnableStockControl: item.EnableStockControl,
                    EnableCommission: item.EnableCommission,
                    Duration: 0
                }, $.GetLocation());
                $.ModalWizardClose();
            }
        }
    }, GetOpitionProduct(item.CategoryID));
}
var GetOpitionProduct = function (idPrev) {
    return {
        prefix: "p",
        prefixPrev: "c_g",
        idPrev: idPrev,
        callbackhtml: ShowDisplayProduct,
    };
}
var GetObjectServiceBaseFlowEnableVoucherSales = function (item) {
    return $.extend({
        id: item.ServiceID,
        ServiceName: item.ServiceName,
        Duration: item.Duration,
        DurationName: item.DurationName,
        RetailPrice: item.RetailPrice,
        SpecialPrice: item.SpecialPrice,
        TaxID: item.TaxID,
        TaxRate: item.TaxRate,
        EnableCommission: item.EnableCommission,
        methodClick: function () {
            $("#containtItem").CreateItem(true, false, {
                ItemID: item.ServiceID,
                ItemName: item.ServiceName,
                DisplayName: "Voucher: " + item.ServiceName,
                ItemType: "item_type_service_voucher",
                SpecialPrice: item.SpecialPrice,
                Duration: item.Duration,
                DurationName: item.DurationName,
                RetailPrice: item.RetailPrice,
                TaxID: item.TaxID,
                TaxRate: item.TaxRate,
                EnableCommission: item.EnableCommission,
            }, $.GetLocation());
            $.ModalWizardClose();
        }
    }, GetOpitionServiceBaseFlowEnableVoucherSales(item.ServiceGroupID));
}
var GetOpitionServiceBaseFlowEnableVoucherSales = function (idPrev) {
    return {
        prefix: "v",
        prefixPrev: "v_g-s_g",
        idPrev: idPrev,
        callbackhtml: ShowDisplayService,
    };
}
var GetObjectService = function (item) {
    return $.extend({
        id: item.ServiceID,
        ServiceName: item.ServiceName,
        Duration: item.Duration,
        DurationName: item.DurationName,
        RetailPrice: item.RetailPrice,
        SpecialPrice: item.SpecialPrice,
        TaxID: item.TaxID,
        TaxRate: item.TaxRate,
        EnableCommission: item.EnableCommission,
        methodClick: function () {
            $("#containtItem").CreateItem(false, true, {
                ItemID: item.ServiceID,
                ItemName: item.ServiceName,
                DisplayName: item.ServiceName,
                ItemType: "item_type_service",
                Duration: item.Duration,
                DurationName: item.DurationName,
                SpecialPrice: item.SpecialPrice,
                RetailPrice: item.RetailPrice,
                TaxID: item.TaxID,
                TaxRate: item.TaxRate,
                EnableCommission: item.EnableCommission,
                StaffID: Window.UserID//gan de show tren service
            }, $.GetLocation());
            $.ModalWizardClose();
        }
    }, GetOpitionService(item.ServiceGroupID));
}
var GetOpitionService = function (idPrev) {
    return {
        prefix: "s",
        prefixPrev: "s_g",
        idPrev: idPrev,
        callbackhtml: ShowDisplayService
    };
}
var GetOpitionServiceGroup = function () {
    return {
        idPrev: 2,
        prefix: "s_g",
        prefixPrev: "m",
    };
}
var GetOpitionServiceGroupVoucher = function () {
    return {
        prefix: "v_g-s_g",
        prefixPrev: "v_g",
        idPrev: 2,
    };
}
var GetOpitionCategory = function () {
    return {
        prefix: "c_g",
        prefixPrev: "m",
        idPrev: "1",
    };
}
var GetObjectCategory = function (item) {
    return $.extend({
        id: item.CategoryID,
        text: item.CategoryName
    }, GetOpitionCategory());
}
var ShowDisplayProduct = function (item) {
    var tag = item.SpecialPrice == 0 ? "span" : "s";
    var desc = "";
    var barcode = (item.Barcode == null || item.Barcode == "") ? "" : item.Barcode + "/ ";
    if (item.EnableStockControl == true) {
        desc = barcode + item.OnHand + " in stock ";
    }
    else {
        desc = barcode + "Unlimited";
    }
    return '<div class="service-item col-12 item-modal-wizard ' + ((parseInt(item.OnHand) == 0 && item.EnableStockControl == true) ? "disable" : "") + '" isItemModalWizard prefix="' + item.prefix + '" prefixPrev="' + item.prefixPrev + '" id-item-modal="' + item.id + '">'
               + '<p class="title-service"><span class="service-name">' + item.ProductName + '</span><span class="special-price">' + (item.SpecialPrice == 0 ? Window.CurrencySymbol + $.number(item.RetailPrice, Window.NumberDecimal, '.', ',') : Window.CurrencySymbol + $.number(item.SpecialPrice, Window.NumberDecimal, '.', ',')) + '</span></p>'
               + '<p class="clearfix"></p>'
               + '<p class="des-service"><span class="duration">' + desc + '</span><' + tag + ' class="retail-price">' + (item.SpecialPrice == 0 ? '' : Window.CurrencySymbol + $.number(item.RetailPrice, Window.NumberDecimal, '.', ',')) + '</' + tag + '></p>'
                + '<p class="clearfix"></p>'
               + '</div>';
}
var ShowDisplayService = function (item) {
    var tag = item.SpecialPrice == 0 ? "span" : "s";
    return '<div class="service-item col-12 item-modal-wizard" isItemModalWizard prefix="' + item.prefix + '" prefixPrev="' + item.prefixPrev + '" id-item-modal="' + item.id + '">'
               + '<p class="title-service"><span class="service-name">' + item.ServiceName + '</span><span class="special-price">' + (item.SpecialPrice == 0 ? Window.CurrencySymbol + $.number(item.RetailPrice, Window.NumberDecimal, '.', ',') : Window.CurrencySymbol + $.number(item.SpecialPrice, Window.NumberDecimal, '.', ',')) + '</span></p>'
               + '<p class="clearfix"></p>'
               + '<p class="des-service"><span class="duration">' + item.DurationName + '</span><' + tag + ' class="retail-price">' + (item.SpecialPrice == 0 ? '' : Window.CurrencySymbol + $.number(item.RetailPrice, Window.NumberDecimal, '.', ',')) + '</' + tag + '></p>'
                + '<p class="clearfix"></p>'
               + '</div>';
}
var isSearchWizard = false;
var HtmlItem;
var HtmlModalGiftVoucher;
var HtmlModalModalInvoiceDetails;
var HtmlModalTip;
var InvoiceTips = [];
var GlobalTotal = 0;//dung de tinh tien tip
var htmlTaxDetail = '<div style="display: flex; flex-direction: row; justify-content: space-between;"><span>@TaxName</span><span>@TaxAmount</span></div>';
var BalanceAmount = 0;
var NotYear = true;
//#endregion

//#region load data
var GetCategory = function () {
    var result;
    $.RequestAjax("/Sale/GetCategory", null, function (renponsive) {
        result = $.extend({
            data: renponsive.Results.map(n=> {
                return GetObjectCategory(n);
            })
        }, GetOpitionCategory());
        result.data.push($.extend({
            id: 0,
            text: "No Category"
        }, GetOpitionCategory()));
    })
    return result;
}
var GetServiceGroup = function (opition) {
    var result;
    $.RequestAjax("/Sale/GetServiceGroup", null, function (renponsive) {
        var data = renponsive.Results.map(n=> {
            return $.extend(GetObjectServiceGroup(n), opition);
        });
        result = $.extend({
            data: data
        }, opition);
    })
    return result;
}
var GetProduct = function (search, categoryID, isSearch) {
    var result;
    $.RequestAjax("/Sale/SearchProduct", JSON.stringify({
        Search: search,
        CategoryID: categoryID,
        LocationID: localStorage.getItem("locationidscheul")
    }), function (renponsive) {
        var data = renponsive.Results.map(n=> {
            return GetObjectProduct(n);
        });
        if (!isSearch) {
            result = $.extend({
                data: data
            }, GetOpitionProduct(categoryID))
        } else
            result = data;
    })
    return result;
}
var GetService = function (search, serviceGroupID, isSearch) {
    var result;
    $.RequestAjax("/Sale/SearchService", JSON.stringify({
        Search: search,
        ServiceGroupID: serviceGroupID
    }), function (renponsive) {
        var data = renponsive.Results.map(n=> {
            return GetObjectService(n);
        });
        if (!isSearch) {
            result = $.extend({
                data: data
            }, GetOpitionService(serviceGroupID))
        } else
            result = data;
    })
    return result;
}
var GetServiceBaseFlowEnableVoucherSales = function (search, serviceGroupID, isSearch) {
    var result;
    $.RequestAjax("/Sale/SearchServiceBaseFlowEnableVoucherSales", JSON.stringify({
        Search: search,
        ServiceGroupID: serviceGroupID,
    }), function (renponsive) {
        var data = renponsive.Results.map(n=> {
            return GetObjectServiceBaseFlowEnableVoucherSales(n);
        });
        if (!isSearch) {
            result = $.extend({
                data: data
            }, GetOpitionServiceBaseFlowEnableVoucherSales(serviceGroupID))
        } else
            result = data;
    })
    return result;
}
var AddItem = function (item, locationid) {
    if (!HtmlItem)
        $.RequestAjaxText("/ContentHtml/CheckOut/Desktop/Item.html", function (data) { HtmlItem = data; });
    var Description = '';
    var itemHtml = HtmlItem;
    var staffname = "";
    if ($("#IsRefund").val() == "1") {
        if (item.ItemType == "item_type_product") {
            Description = item.Barcode;
        }
        else if (item.ItemType == "item_type_service") {
            Description = item.StaffIV = "" ? "" : "with " + item.StaffIV;
        }
        else {
            if (item.ExpireDate == null || item.ExpireDate == "") {
                Description = "Code: " + item.VoucherCode + ", No expiration date";
            }
            else {
                Description = "Code: " + item.VoucherCode + ", Expires on " + moment(item.ExpireDate).format(Window.FormatDateWithDayOfWeekJS);
            }
        }
    }
    else {
        if (item.ItemType == "item_type_product") {
            if (item.EnableStockControl == true) {
                Description = item.OnHand + " in stock ";
            }
            else {
                Description = "Unlimited";
            }
            Description = ((item.Barcode == null || item.Barcode == "") ? "" : (item.Barcode + " / ")) + Description;
        }
        else if (item.ItemType == "item_type_service") {
            Description = item.DurationName;
            if (item.StaffID != null) {
                $.RequestAjax("/Home/GetUserBaseId", JSON.stringify({
                    ID: item.StaffID
                }), function (data) {
                    staffname = data.Text;
                }, function () {
                })
            }
        }
        else if (item.ItemType == "item_type_service_voucher") {
            Description = item.DurationName;
        }
        else {
            if (item.VoucherExpiryDate == null || item.VoucherExpiryDate == "") {
                Description = "No expiration date";
            }
            else {
                Description = "Expires on " + moment(item.VoucherExpiryDate).format(Window.FormatDateWithDayOfWeekJS);
            }
        }
    }

    var Price = (item.Price == undefined || item.Price == null) ? (item.SpecialPrice > 0 ? item.SpecialPrice : item.RetailPrice) : item.Price;
    var PriceAfterDiscount = (item.Price == undefined || item.Price == null) ? 0 : item.PriceAfterDiscount;
    var Quantity = (item.Quantity == undefined || item.Quantity == null) ? 1 : item.Quantity;
    var PriceBeforeTax = (item.PriceBeforeTax == undefined || item.PriceBeforeTax == null) ? 0 : item.PriceBeforeTax;
    var SubTotal = 0;
    var SubTotalBeForeTax = 0;
    var DiscountAmount = 0;
    var TaxAmount = 0;
    PriceAfterDiscount = Price - DiscountAmount;
    if (item.TaxRate != 0) {
        if (Window.config_tax_calculation == 'exclude') {
            TaxAmount = parseFloat((item.TaxRate * PriceAfterDiscount) / 100).toFixed(Window.NumberDecimal);
            PriceBeforeTax = PriceAfterDiscount;
        }
        else {
            TaxAmount = parseFloat((item.TaxRate / 100) * ((PriceAfterDiscount) / (1 + item.TaxRate / 100))).toFixed(Window.NumberDecimal);
            PriceBeforeTax = (PriceAfterDiscount - TaxAmount);
        }
    }
    else {
        PriceBeforeTax = PriceAfterDiscount;
    }

    SubTotal = Quantity * PriceAfterDiscount;
    SubTotalBeForeTax = Quantity * PriceBeforeTax;

    itemHtml = itemHtml.replace("@ServiceName", item.DisplayName);
    itemHtml = itemHtml.replace("@CurrencySymbol", Window.CurrencySymbol);
    var itemElement = $(itemHtml);
    itemElement.find("#PriceDisplay").text(Window.CurrencySymbol + $.number(PriceAfterDiscount, Window.NumberDecimal, '.', ','));
    if (item.RetailPrice > PriceAfterDiscount)
        itemElement.find("#OrgPriceDisplay").text(Window.CurrencySymbol + $.number(Quantity * item.RetailPrice, Window.NumberDecimal, '.', ','));
    else
        itemElement.find("#OrgPriceDisplay").text("");


    itemElement.find("#DescriptionDisplay").text(Description + (staffname != "" ? " with " + staffname : ""));
    itemElement.find("[name='priceItem']").val(parseFloat(Price).toFixed(Window.NumberDecimal));
    //Setting min, max, step input amount
    if (Window.NumberDecimal == 0) {
        itemElement.find("[name='priceItem']").attr("step", "1");
        itemElement.find("[name='priceItem']").attr("placeholder", "0");
    }
    else if (Window.NumberDecimal == 1) {
        itemElement.find("[name='priceItem']").attr("step", "0.1");
        itemElement.find("[name='priceItem']").attr("placeholder", "0.0");
    }
    else if (Window.NumberDecimal == 2) {
        itemElement.find("[name='priceItem']").attr("step", "0.01");
        itemElement.find("[name='priceItem']").attr("placeholder", "0.00");
    }

    itemElement.find("[name='quantityItem']").val(Quantity);
    itemElement.find("[name='quantityItemDisplay']").text(Quantity);
    itemElement.attr("Item-Type", item.ItemType);
    itemElement.attr("Item-ID", item.ItemID);
    itemElement.attr("ItemName", item.DisplayName);
    itemElement.attr("Description", Description);
    itemElement.attr("RetailPrice", item.RetailPrice);
    itemElement.attr("SpecialPrice", item.SpecialPrice);
    itemElement.attr("Price", Price);
    itemElement.attr("OrgPrice", Price);
    itemElement.attr("PriceAfterDiscount", PriceAfterDiscount);
    itemElement.attr("PriceBeforeTax", PriceBeforeTax);
    itemElement.attr("TaxID", item.TaxID == null ? '' : item.TaxID);
    itemElement.attr("TaxRate", item.TaxRate);
    itemElement.attr("TaxAmount", TaxAmount);
    itemElement.attr("Quantity", Quantity);
    if (item.ItemType == "item_type_product") {
        itemElement.attr("OnHand", item.OnHand);
    }
    else if (item.ItemType == "item_type_gift_voucher" || item.ItemType == "item_type_service_voucher") {
        itemElement.attr("VoucherExpiryDate", item.VoucherExpiryDate);
        itemElement.find("input[name='priceItem']").attr("readonly", true);
    }
    else if (item.ItemType == "item_type_service") {
        itemElement.find("input[name='quantityItem']").attr("readonly", true);
    }
    if (Quantity < 0) {
        itemElement.find("input[name='quantityItem']").attr("readonly", true);
        itemElement.find("input[name='priceItem']").attr("readonly", true);
        itemElement.find("select[name='staffItem']").prop("disabled", true);
        itemElement.find("select[name='discountItem']").prop("disabled", true);
    }
    itemElement.attr("SubTotal", SubTotal);
    itemElement.attr("SubTotalBeForeTax", SubTotalBeForeTax);
    itemElement.attr("TotalTax", TaxAmount * Quantity);
    itemElement.attr("TotalDiscount", DiscountAmount * Quantity);
    itemElement.attr("Total", SubTotalBeForeTax + (TaxAmount * Quantity));
    itemElement.attr("Duration", item.Duration);
    itemElement.attr("StaffID", item.StaffID != null ? item.StaffID : Window.UserID);
    itemElement.attr("EnableCommission", item.EnableCommission);
    itemElement.attr("DiscountID", 0);
    itemElement.attr("DiscountName", "");
    itemElement.attr("DiscountAmount", DiscountAmount);
    itemElement.attr("DiscountPercent", 0);
    itemElement.attr("AppointmentServiceID", item.AppointmentServiceID);
    itemElement.attr("VoucherCode", item.VoucherCode == undefined ? "" : item.VoucherCode);

    itemElement.attr("InvoiceDetailID", item.InvoiceDetailID == undefined ? "" : item.InvoiceDetailID);
    $("#containtItem").append(itemElement);
    //
    if (item.ItemType == "item_type_product") {
        itemElement.attr("OnHand", item.OnHand);
        itemElement.attr("EnableStockControl", item.EnableStockControl);
        if (item.EnableStockControl) {
            $(".containt-serivce input[name='quantityItem']").attr("max", item.OnHand);
        }
    }
    //clear het payment
    $("#formModalMain #divPayment").html("");
    SumTotal();
    $(".containt-serivce [name='staffItem']:last").InStallSelect2('/Home/LoadSelect2ForUserLocation', 20, 'Select staff', { "LocationId": locationid });
    $(".containt-serivce [name='discountItem']:last").InStallSelect2('/Home/LoadSelect2ForDiscount', 20, 'No discount', {
        "CheckEnableForProductSales": item.ItemType == "item_type_product",
        "CheckEnableForVoucherSales": item.ItemType == "item_type_service_voucher" || item.ItemType == "item_type_gift_voucher",
        "CheckEnableForServiceSales": item.ItemType == "item_type_service",
    }, null, null, null, null, null, null, false);
    $(".containt-serivce [name='staffItem']:last").SetValueSelect2ID(item.StaffID != null ? item.StaffID : Window.UserID);
    $(".containt-serivce input[name='quantityItem']").keyup(function () {
        var itemElement = $(this).closest(".containt-serivce");
        var Quantity = $(this).val() == null ? 0 : ($(this).val() == "" ? 0 : parseInt($(this).val()));
        var OnHand = parseInt(itemElement.attr("OnHand"));
        if (itemElement.attr("Item-Type") == "item_type_product") {

            if(itemElement.attr("EnableStockControl") == "true" && Quantity> OnHand)
            {
                $(this).val(OnHand);
                Quantity = OnHand;
                toastr["error"]("Cannot sell more than " + OnHand, "Error");
            }
        }

        itemElement.attr("Quantity", Quantity)
        CalculateItem(itemElement);
        SumTotal();
    })
    $(".containt-serivce input[name='quantityItem']").change(function () {
        var itemElement = $(this).closest(".containt-serivce");
        var Quantity = $(this).val() == null ? 0 : ($(this).val() == "" ? 0 : parseInt($(this).val()));
        var OnHand = parseInt(itemElement.attr("OnHand"));
        if (itemElement.attr("Item-Type") == "item_type_product") {

            if (itemElement.attr("EnableStockControl") == "true" && Quantity > OnHand) {
                $(this).val(OnHand);
                Quantity = OnHand;
                toastr["error"]("Cannot sell more than " + OnHand, "Error");
            }
        }
        itemElement.attr("Quantity", Quantity)
        CalculateItem(itemElement);
        SumTotal();
    })
    $(".containt-serivce input[name='priceItem']").keyup(function () {
        var itemElement = $(this).closest(".containt-serivce");
        var OrgPrice = parseFloat(itemElement.attr("OrgPrice"));
        var Price = $(this).val() == null ? 0 : ($(this).val() == "" ? 0 : parseFloat($(this).val()));

        if (OrgPrice > Price) {
            itemElement.attr("DiscountAmount", OrgPrice - Price)
            itemElement.find("#divdiscountItem").hide();
            itemElement.find("#divManualDiscountItem").show();
            itemElement.find("input[name='ManualDiscountItem']").val("Manual " + Window.CurrencySymbol + (OrgPrice - Price).toFixed(Window.NumberDecimal));
        }
        else if (OrgPrice < Price) {
            itemElement.attr("DiscountAmount", 0);
            itemElement.find("#divdiscountItem").hide();
            itemElement.find("#divManualDiscountItem").show();
            itemElement.find("input[name='ManualDiscountItem']").val("Increase " + Window.CurrencySymbol + (Price - OrgPrice).toFixed(Window.NumberDecimal));
        }
        itemElement.attr("Price", Price)
        CalculateItem(itemElement);
        SumTotal();
    })
    $(".containt-serivce input[name='priceItem']").change(function () {
        var itemElement = $(this).closest(".containt-serivce");
        var OrgPrice = parseFloat(itemElement.attr("OrgPrice"));
        var Price = $(this).val() == null ? 0 : ($(this).val() == "" ? 0 : parseFloat($(this).val()));
        if (OrgPrice > Price) {
            itemElement.attr("DiscountAmount", OrgPrice - Price)
            itemElement.find("#divdiscountItem").hide();
            itemElement.find("#divManualDiscountItem").show();
            itemElement.find("input[name='ManualDiscountItem']").val("Manual " + Window.CurrencySymbol + (OrgPrice - Price).toFixed(Window.NumberDecimal));
        }
        else if (OrgPrice < Price) {
            itemElement.attr("DiscountAmount", 0);
            itemElement.find("#divdiscountItem").hide();
            itemElement.find("#divManualDiscountItem").show();
            itemElement.find("input[name='ManualDiscountItem']").val("Increase " + Window.CurrencySymbol + (Price - OrgPrice).toFixed(Window.NumberDecimal));
        }
        itemElement.attr("Price", Price)
        CalculateItem(itemElement);
        SumTotal();
    })
    $(".containt-serivce [name='staffItem']").change(function () {
        var itemElement = $(this).closest(".containt-serivce");
        itemElement.attr("StaffID", $(this).val())

        $.RequestAjax("/Home/GetUserBaseId", JSON.stringify({
            ID: $(this).val()
        }), function (data) {

            var Description = itemElement.attr("Description");
            itemElement.find("#DescriptionDisplay").text(Description + " with " + data.Text);

        }, function () {
        })
    })
    $(".containt-serivce [name='discountItem']").change(function () {
        var DiscountID = 0;
        var DiscountName = "";
        var DiscountAmount = 0;
        var DiscountPercent = 0;
        var itemElement = $(this).closest(".containt-serivce");
        if ($(this).val() == null || $(this).val() == "") {
            if (itemElement.attr("Item-Type") == "item_type_gift_voucher" || itemElement.attr("Item-Type") == "item_type_service_voucher") {
                itemElement.find("input[name='priceItem']").attr("readonly", true);
            }
            else {
                itemElement.find("input[name='priceItem']").attr("readonly", false);
            }
        }
        else {
            itemElement.find("input[name='priceItem']").attr("readonly", true);
            //get discountname, percent
            $.RequestAjax("/Home/GetDiscountBaseID", JSON.stringify({
                ID: $(this).val()
            }), function (data) {
                DiscountID = data.Result.DiscountID;
                DiscountName = data.Result.DiscountName + " " + (data.Result.IsPercentage == true ? data.Result.DiscountValue + "% off" : Window.CurrencySymbol + data.Result.DiscountValue.toFixed(Window.NumberDecimal) + " off");
                if (data.Result.IsPercentage == true) {
                    DiscountPercent = data.Result.DiscountValue;
                }
                else {
                    DiscountAmount = data.Result.DiscountValue;
                }
            }, function () {
            })
        }
        itemElement.find("#DescriptionDisplay").text(itemElement.attr("Description") + (DiscountName == "" ? "" : ", " + DiscountName));
        itemElement.attr("DiscountID", DiscountID);
        itemElement.attr("DiscountName", DiscountName);
        itemElement.attr("DiscountAmount", DiscountAmount);
        itemElement.attr("DiscountPercent", DiscountPercent);
        CalculateItem(itemElement);
        SumTotal();
    })
    $(".containt-serivce #deleteManualDiscountItem").click(function () {
        var itemElement = $(this).closest(".containt-serivce");
        itemElement.find("#divdiscountItem").show();
        itemElement.find("#divManualDiscountItem").hide();
        itemElement.attr("Price", itemElement.attr("OrgPrice"));
        itemElement.attr("DiscountAmount", 0)
        itemElement.find("[name='priceItem']").val(parseFloat(itemElement.attr("OrgPrice")).toFixed(Window.NumberDecimal));
        CalculateItem(itemElement);
        SumTotal();
    })
    $(".containt-serivce .delete-service").click(function () {
        var count = 0;
        var that = $(this);
        $("#formModalMain #divPayment .payment").each(function () {
            count++;
        })
        if (count > 0) {
            PNotify.notice({
                title: 'Exceeding Payments',
                text: 'Due to item removal or price change, system will delete all exceeding payments.',
                icon: 'fa fa-question-circle',
                hide: false,
                width: "460px",
                stack: {
                    'dir1': 'down',
                    'modal': true,
                    'firstpos1': 25
                },
                modules: {
                    Confirm: {
                        confirm: true,
                        buttons: [{
                            text: 'YES, PROCEED',
                            primary: true,
                            click: function (notice) {
                                $(that).closest(".containt-serivce").remove();
                                $("#formModalMain #divPayment").html("");
                                SumTotal();
                                notice.close();
                            }
                        },
                            {
                                text: 'CANCEL',
                                click: function (notice) {
                                    notice.close();
                                }
                            }
                        ],
                    },
                    Buttons: {
                        closer: false,
                        sticker: false
                    },
                    History: {
                        history: false
                    }
                }
            })
        }
        else {
            $(this).closest(".containt-serivce").remove();
            SumTotal();
        }
    })
}
var CalculateItem = function (itemElement) {
    var Quantity = parseFloat(itemElement.attr("Quantity"));
    var Price = parseFloat(itemElement.attr("Price"));
    var OrgPrice = parseFloat(itemElement.attr("OrgPrice"));
    var RetailPrice = parseFloat(itemElement.attr("RetailPrice"));
    var TaxRate = parseFloat(itemElement.attr("TaxRate"));
    var DiscountPercent = parseFloat(itemElement.attr("DiscountPercent"));
    var DiscountAmount = parseFloat(itemElement.attr("DiscountAmount"));
    var PriceBeforeTax = 0;
    var PriceAfterDiscount = 0;
    var SubTotal = 0;
    var SubTotalBeForeTax = 0;
    var TaxAmount = 0;

    //tinh discount => tinh lai discount amount khi co discount percent
    if (DiscountPercent != 0) {
        DiscountAmount = parseFloat((OrgPrice * DiscountPercent) / 100).toFixed(Window.NumberDecimal);
    }
    if (DiscountAmount >= OrgPrice) {
        PriceAfterDiscount = 0;
        DiscountAmount = OrgPrice;
    }
    else {
        if (DiscountAmount > 0)
            PriceAfterDiscount = OrgPrice - DiscountAmount;
        else
            PriceAfterDiscount = Price - DiscountAmount;
    }


    //tinh tax
    if (TaxRate != 0) {
        if (Window.config_tax_calculation == 'exclude') {
            TaxAmount = parseFloat((TaxRate * PriceAfterDiscount) / 100).toFixed(Window.NumberDecimal);
            PriceBeforeTax = PriceAfterDiscount;
        }
        else {
            TaxAmount = parseFloat((TaxRate / 100) * ((PriceAfterDiscount) / (1 + TaxRate / 100))).toFixed(Window.NumberDecimal);
            PriceBeforeTax = (PriceAfterDiscount - TaxAmount);
        }
    }
    else {
        PriceBeforeTax = PriceAfterDiscount;
    }
    SubTotal = Quantity * PriceAfterDiscount;
    SubTotalBeForeTax = Quantity * PriceBeforeTax;
    itemElement.attr("DiscountAmount", DiscountAmount)
    itemElement.attr("Quantity", Quantity)
    itemElement.attr("PriceAfterDiscount", PriceAfterDiscount)
    itemElement.find("[name='quantityItemDisplay']").text(Quantity);
    itemElement.find("#PriceDisplay").text(Window.CurrencySymbol + $.number(Quantity * PriceAfterDiscount, Window.NumberDecimal, '.', ','));
    if (RetailPrice > PriceAfterDiscount)
        itemElement.find("#OrgPriceDisplay").text(Window.CurrencySymbol + $.number(Quantity * RetailPrice, Window.NumberDecimal, '.', ','));
    else
        itemElement.find("#OrgPriceDisplay").text("");

    itemElement.attr("PriceBeforeTax", PriceBeforeTax);
    itemElement.attr("TaxAmount", TaxAmount);
    itemElement.attr("SubTotal", SubTotal);
    itemElement.attr("SubTotalBeForeTax", SubTotalBeForeTax);
    itemElement.attr("TotalTax", TaxAmount * Quantity);
    itemElement.attr("TotalDiscount", DiscountAmount * Quantity);
    itemElement.attr("Total", SubTotalBeForeTax + (TaxAmount * Quantity));
}
var SumTotal = function () {
    var Total = 0;
    var SubTotalBeForeTax = 0;
    var TaxAmount = 0;
    var Balance = 0;
    var Tip = 0;
    var countitem = 0;
    var TaxDetail = [];
    $("#formModalMain .order-detail #containtItem .containt-serivce").each(function () {
        countitem++;
        SubTotalBeForeTax = SubTotalBeForeTax + parseFloat($(this).attr("SubTotalBeForeTax"));
        TaxAmount = TaxAmount + (parseFloat($(this).attr("TaxAmount")) * parseFloat($(this).attr("Quantity")));

        //check tax 
        if ($(this).attr("TaxID") != null && $(this).attr("TaxID") != 0) {
            if (TaxDetail.length > 0) {
                var isexist = false;
                for (var i = 0; i < TaxDetail.length; i++) {
                    if ($(this).attr("TaxID") == TaxDetail[i].TaxID) {
                        TaxDetail[i].TaxAmount = TaxDetail[i].TaxAmount + parseFloat($(this).attr("TaxAmount"));
                        isexist = true;
                        break;
                    }
                }
                if (isexist == false) {
                    TaxDetail.push({
                        TaxID: $(this).attr("TaxID"),
                        TaxName: "",
                        TaxAmount: parseFloat($(this).attr("TaxAmount")),
                        TaxRate: $(this).attr("TaxRate")
                    });
                }
            }
            else {
                TaxDetail.push({
                    TaxID: $(this).attr("TaxID"),
                    TaxName: "",
                    TaxAmount: parseFloat($(this).attr("TaxAmount")),
                    TaxRate: $(this).attr("TaxRate")
                });
            }
        }
    })
    //xoa tip neu khong co item
    if (countitem == 0) {
        InvoiceTips = [];
    }
    Total = SubTotalBeForeTax + TaxAmount;


    $("#formModalMain #SubTotalBeForeTax").text(Window.CurrencySymbol + $.number(SubTotalBeForeTax, Window.NumberDecimal, '.', ','));
    //line tax detail
    $("#divTaxDetail").html("");
    if (TaxDetail != null && TaxDetail.length > 0) {
        $.each(TaxDetail, function () {
            var htmltax = htmlTaxDetail.replace("@TaxName", this.TaxName + " " + $.number(this.TaxRate, 0, '.', ',') + "%").replace("@TaxAmount", Window.CurrencySymbol + $.number(this.TaxAmount, Window.NumberDecimal, '.', ','));
            $("#divTaxDetail").append(htmltax);
        })
    }

    $("#formModalMain #Total").text(Window.CurrencySymbol + $.number(Total, Window.NumberDecimal, '.', ','));

    $("#divTipDetail").html("");
    $.each(InvoiceTips, function () {
        Tip = Tip + parseFloat(this.TipAmount);
        var ItemPayment;
        $.RequestAjaxText("/ContentHtml/CheckOut/Desktop/ItemTipDetail.html", function (data) { ItemPayment = data; });
        ItemPayment = ItemPayment.replace('@StaffName', "Tip for " + this.StaffName)
        ItemPayment = ItemPayment.replace('@Amount', Window.CurrencySymbol + $.number(this.TipAmount, Window.NumberDecimal, '.', ','))
        var element = $(ItemPayment);
        element.attr("StaffID", this.StaffID);
        $("#formModalMain #divTipDetail").append(element[0].outerHTML);
        $(".payment [name='deleteTip']").click(function () {
            var that = $(this).closest(".payment");
            $.each(InvoiceTips, function (index) {
                if (InvoiceTips[index].StaffID == $(that).attr("StaffID")) {
                    InvoiceTips.splice(index, 1);
                    return true;
                }
            });
            SumTotal();
        })

    });
    //$("#TipAmount").text(Window.CurrencySymbol + $.number(Tip, Window.NumberDecimal, '.', ','));
    GlobalTotal = Total;
    Balance = Total + Tip;
    var TotalPay = 0;
    $("#formModalMain #divPayment .payment").each(function () {
        TotalPay = TotalPay + parseFloat($(this).attr("Amount"));
    })
    //bo line hr
    if (TotalPay == 0) {
        $("#formModalMain #divPayment").html("");
    }
    Balance = Balance - TotalPay;
    BalanceAmount = Balance;
    if (Balance < 0 && $("#IsRefund").val() == "") {
        Balance = 0;
    }
    $("#formModalMain #Balance").text(Window.CurrencySymbol + $.number(Balance, Window.NumberDecimal, '.', ','));
    $("#formModalMain #Pay").val(parseFloat(Balance).toFixed(Window.NumberDecimal));
    //an hien khung 
    if (countitem == 0) {
        $("#formModalMain #contentLeft .no-order").show();
        $("#formModalMain #contentLeft .order-detail").hide();
    }
    else {
        $("#formModalMain #contentLeft .no-order").hide();
        $("#formModalMain #contentLeft .order-detail").show();
    }
    if ($("#IsRefund").val() == "") {
        if (Balance > 0) {
            $("#formModalMain #contentRight #divPay").show();
            $("#formModalMain #contentRight #divFullPay").hide();
            //show save part paid
            if (TotalPay > 0) {
                $("#formModalMain #btnSavePartPaid").show();
                $("#formModalMain #btnSaveUnpaid").hide();
            }
            else {
                $("#formModalMain #btnSavePartPaid").hide();
                $("#formModalMain #btnSaveUnpaid").show();
            }
        }
        else {
            $("#formModalMain #contentRight #divPay").hide();
            if (TotalPay > 0) {
                $("#formModalMain #contentRight #divFullPay").show();
            }
        }
    }
    else {
        if (Balance < 0) {
            $("#formModalMain #btnSavePartPaid").hide();
            $("#formModalMain #btnSaveUnpaid").hide();
            $("#formModalMain #contentRight #divPay").show();
            $("#formModalMain #contentRight #divFullPay").hide();
            //show save part paid
            if (TotalPay > 0) {
                $("#formModalMain #btnSavePartPaid").show();
                $("#formModalMain #btnSaveUnpaid").hide();
            }
        }
        else {
            $("#formModalMain #contentRight #divPay").hide();
            if (TotalPay < 0) {
                $("#formModalMain #txtFullPayment").text("Your invoice is prepared to be refunded");
                $("#formModalMain #contentRight #divFullPay").show();
                $("#btnCompleteSale").hide();
                $("#btnRefundNow").show();
            }
        }
    }
}
var LoadPaymentType = function () {
    $.RequestAjax(urlGetDataAllPaymentType, JSON.stringify({
        IsAddVoucher: $("#IsRefund").val() == "" ? true : false
    }), function (data) {
        var row = '<div class="d-flex"><div style="flex-basis: 50%" class="p-2" id="div1"></div><div style="flex-basis: 50%" class="p-2" id="div2"></div></div>';
        var button = '';
        button = '<button type="button" PaymentTypeID= "" PaymentTypeName="" class="btn btn-block btn-' + ($("#IsRefund").val() == "" ? 'primary' : 'danger') + ' active" aria-pressed="true">@PaymentTypeName</button>';
        var html = "";
        $("#formModalMain #divPaymentMethod").html('');
        if (data.Result.length > 0) {
            var line;
            var i = 1;
            $.each(data.Result, function () {
                if (i % 2 != 0) {
                    line = $(row);
                    var newButton = button.replace('@PaymentTypeName', this.PaymentTypeName.toUpperCase());
                    var element = $(newButton).attr("PaymentTypeID", this.PaymentTypeID);
                    element = $(element).attr("PaymentTypeName", this.PaymentTypeName);
                    line.find("#div1").append(element[0].outerHTML);
                }
                else {
                    var newButton = button.replace('@PaymentTypeName', this.PaymentTypeName.toUpperCase());
                    var element = $(newButton).attr("PaymentTypeID", this.PaymentTypeID);
                    element = $(element).attr("PaymentTypeName", this.PaymentTypeName);
                    line.find("#div2").append(element[0].outerHTML);
                    $("#formModalMain #divPaymentMethod").append(line[0].outerHTML);
                }
                if (data.Result.length == i && (i % 2 != 0)) {
                    $("#formModalMain #divPaymentMethod").append(line[0].outerHTML);
                }
                i++;
            })
        }
    }, function () {
    })
}
var AddItemTip = function (Item, modal) {
    var index = modal.find(".itemtip").length + 1;
    var ItemTip;
    $.RequestAjaxText("/ContentHtml/CheckOut/Desktop/ItemTip.html", function (data) { ItemTip = data; });
    var id = "Item_" + index;
    ItemTip = ItemTip.replace('@id', id);
    modal.find("#divItemTip").append(ItemTip);
    modal.find("#" + id + " #CurrencySymbol1").text(Item.TipIsAmount == true ? Window.CurrencySymbol : '%');
    modal.find("#" + id + " #CurrencySymbol2").text(Window.CurrencySymbol);
    modal.find("#" + id + " #TipAmount").val(Item.TipIsAmount == true ? Item.TipAmount : Item.TipPercent);
    //$(".containt-serivce [name='staffItem']:last")
    //get danh sach staff da add
    var StaffTips = [];
    modal.find(".itemtip").each(function () {
        var val = $(this).find("#SelectStaffID").val();
        if (val != null && val != "" && val != "0") {
            StaffTips.push(val);
        }
    })
    //end get staff da chon
    modal.find("#" + id + " #SelectStaffID").InStallSelect2('/Home/LoadSelect2ForUserLocationTip', 20, 'Select staff', { "LocationId": $.GetLocation(), "Staff": StaffTips.join(';') });
    modal.find("#" + id + " #SelectStaffID").SetValueSelect2ID(Item.StaffID);
    if (Item.TipIsAmount) {
        if (modal.find("#" + id + " [name='prefixTipAmount']").is(".btn-not-success")) {
            modal.find("#" + id + " [name='prefixTipAmount']").removeClass("btn-not-success").addClass("btn-success");
            modal.find("#" + id + " [name='percentTipAmount']").removeClass("btn-success").addClass("btn-not-success");
        }
        modal.find("#lblTipAmount").text("Tip Amount (" + Item.TipPercent + "%)");
    }
    else {
        if (modal.find("#" + id + " [name='prefixTipAmount']").is(".btn-success")) {
            modal.find("#" + id + " [name='prefixTipAmount']").removeClass("btn-success").addClass("btn-not-success");
            modal.find("#" + id + " [name='percentTipAmount']").removeClass("btn-not-success").addClass("btn-success");
        }
        modal.find("#lblTipAmount").text("Tip Amount (" + Window.CurrencySymbol + ' ' + Item.TipAmount + ")");
    }
    modal.find("#" + id + " #TipAmount").change(function () {
        var isamount = false;
        if (modal.find("#" + id + " [name='prefixTipAmount']").is(".btn-success")) {
            isamount = true;
        }
        if (isamount) {
            var Amount = parseFloat($(this).val() == "" ? 0 : $(this).val());
            var Percent = parseFloat((Amount / GlobalTotal) * 100).toFixed(2);
            modal.find("#" + id + " #lblTipAmount").text("Tip Amount (" + Percent + "%)");
        }
        else {
            var Percent = parseFloat($(this).val() == "" ? 0 : $(this).val());
            var Amount = parseFloat((Percent / 100) * GlobalTotal).toFixed(Window.NumberDecimal);
            modal.find("#" + id + " #lblTipAmount").text("Tip Amount (" + Window.CurrencySymbol + ' ' + Amount + ")");
        }
    });
    modal.find("#" + id + " [name='prefixTipAmount']").click(function () {
        modal.find("#" + id + " #CurrencySymbol1").text(Window.CurrencySymbol);
        var Amount = parseFloat(modal.find("#" + id + " #TipAmount").val() == "" ? 0 : modal.find("#" + id + " #TipAmount").val());
        var Percent = parseFloat((Amount / GlobalTotal) * 100).toFixed(2);
        modal.find("#" + id + " #lblTipAmount").text("Tip Amount (" + Percent + "%)");
        if ($(this).is(".btn-not-success")) {
            $(this).removeClass("btn-not-success").addClass("btn-success");
            modal.find("#" + id + ' [name="percentTipAmount"]').removeClass("btn-success").addClass("btn-not-success");
        }
    });
    modal.find("#" + id + " [name='percentTipAmount']").click(function () {
        modal.find("#" + id + " #CurrencySymbol1").text('%');
        var Percent = parseFloat(modal.find("#" + id + " #TipAmount").val() == "" ? 0 : modal.find("#" + id + " #TipAmount").val());
        var Amount = parseFloat(parseFloat(Percent / 100) * GlobalTotal).toFixed(Window.NumberDecimal);
        modal.find("#" + id + " #lblTipAmount").text("Tip Amount (" + Window.CurrencySymbol + ' ' + Amount + ")");
        if ($(this).is(".btn-not-success")) {
            $(this).removeClass("btn-not-success").addClass("btn-success");
            modal.find("#" + id + ' [name="prefixTipAmount"]').removeClass("btn-success").addClass("btn-not-success");
        }
    });
    modal.find("#" + id + " [name='btnDeleteItemTip']").click(function () {
        $(this).closest(".itemtip").remove();
    })
}
var AddItemPayment = function (PaymentTypeID, PaymentAmount, PaymentTypeName, VoucherID, VoucherCode, PayForServiceID) {
    var findsame = false;
    var count = 0;
    $("#formModalMain #divPayment .payment").each(function () {
        count++;
        if (PaymentTypeID == $(this).attr("PaymentTypeID") && VoucherID == 0) {
            var total = PaymentAmount + parseFloat($(this).attr("Amount"));
            $(this).attr("Amount", total);
            $(this).find("#divAmount").text(Window.CurrencySymbol + $.number(total, Window.NumberDecimal, '.', ','));
            findsame = true;
        }
    })

    if (findsame == false) {
        var ItemPayment;
        $.RequestAjaxText("/ContentHtml/CheckOut/Desktop/ItemPayment.html", function (data) { ItemPayment = data; });
        ItemPayment = ItemPayment.replace('@PaymentTypeName', PaymentTypeName)
        ItemPayment = ItemPayment.replace('@Amount', Window.CurrencySymbol + $.number(PaymentAmount, Window.NumberDecimal, '.', ','))
        var element = $(ItemPayment);
        element.attr("PaymentTypeID", PaymentTypeID);
        element.attr("Amount", PaymentAmount);
        element.attr("VoucherID", VoucherID);
        element.attr("VoucherCode", VoucherCode);
        element.attr("PayForServiceID", PayForServiceID);
        //neu chua co dong nao thi add them hr
        if (count == 0) {
            $("#formModalMain #divPayment").append("<hr/>");
        }
        $("#formModalMain #divPayment").append(element[0].outerHTML);
        $(".payment [name='deletePayment']").click(function () {
            $(this).closest(".payment").remove();
            SumTotal();
        })
    }
    SumTotal();
}
var SaveInvoice = function (InvoiceStatus) {
    var InvoiceDetails = [];
    var InvoicePayments = [];
    var SubTotal = 0;
    var SubTotalBeForeTax = 0;
    var TotalDiscount = 0;
    var TotalTax = 0;
    var Remain = 0;
    var Balance = 0;
    $("#formModalMain .order-detail #containtItem .containt-serivce").each(function () {
        InvoiceDetails.push({
            InvoiceDetailID: $(this).attr("InvoiceDetailID"),
            ItemID: $(this).attr("Item-ID"),
            ItemName: $(this).attr("ItemName"),
            ItemType: $(this).attr("Item-Type"),
            RetailPrice: $(this).attr("RetailPrice"),
            SpecialPrice: $(this).attr("SpecialPrice"),
            DiscountID: $(this).attr("DiscountID"),
            DiscountName: $(this).attr("DiscountName"),
            DiscountAmount: $(this).attr("DiscountAmount"),
            Price: $(this).attr("Price"),//OrgPrice
            PriceAfterDiscount: $(this).attr("PriceAfterDiscount"),
            PriceBeforeTax: $(this).attr("PriceBeforeTax"),
            TaxID: $(this).attr("TaxID"),
            TaxRate: $(this).attr("TaxRate"),
            TaxAmount: $(this).attr("TaxAmount"),
            Quantity: $(this).attr("Quantity"),
            SubTotal: $(this).attr("SubTotal"),
            SubTotalBeForeTax: $(this).attr("SubTotalBeForeTax"),
            TotalTax: $(this).attr("TotalTax"),
            TotalDiscount: $(this).attr("TotalDiscount"),
            Total: $(this).attr("Total"),
            Duration: $(this).attr("Duration"),
            StaffID: $(this).attr("StaffID"),
            EnableCommission: $(this).attr("EnableCommission"),
            VoucherExpiryDate: $(this).attr("VoucherExpiryDate"),
            AppointmentServiceID: $(this).attr("AppointmentServiceID"),
            TaxType: Window.config_tax_calculation
        })
        SubTotal = SubTotal + parseFloat($(this).attr("SubTotal"));
        SubTotalBeForeTax = SubTotalBeForeTax + parseFloat($(this).attr("SubTotalBeForeTax"));
        TotalDiscount = TotalDiscount + (parseFloat($(this).attr("Quantity")) * parseFloat($(this).attr("DiscountAmount")));
        TotalTax = TotalTax + (parseFloat($(this).attr("Quantity")) * parseFloat($(this).attr("TaxAmount")));
    })
    var TotalPayment = 0;
    $("#formModalMain #divPayment .payment").each(function () {
        InvoicePayments.push({
            PaymentTypeID: $(this).attr("PaymentTypeID"),
            PaymentAmount: $(this).attr("Amount"),
            VoucherID: $(this).attr("VoucherID"),
            PayForServiceID: $(this).attr("PayForServiceID"),
            VoucherCode: $(this).attr("VoucherCode"),
            UserPayment: $("#UserID").val(),
            PaymentDate: moment(moment().tz(Window.TimeZone).format()).format("YYYY/MM/DD HH:mm")
        })
        TotalPayment = TotalPayment + parseFloat($(this).attr("Amount"));
    })
    var TotalTip = 0;
    $.each(InvoiceTips, function () {
        TotalTip = TotalTip + parseFloat(this.TipAmount);
    });

    var entity = new Object();
    entity["AppointmentID"] = $("#AppointmentID").val();
    entity["InvoiceDate"] = moment(moment().tz(Window.TimeZone).format()).format("YYYY/MM/DD HH:mm");
    entity["DueDate"] = moment(moment().tz(Window.TimeZone).format()).format("YYYY/MM/DD");
    entity["InvoiceStatus"] = InvoiceStatus;
    entity["LocationID"] = $("#LocationID").val();
    entity["ClientID"] = $("#ClientID").val();
    entity["ClientName"] = "";
    entity["PaymentReceivedBy"] = $("#UserID").val();
    entity["Notes"] = $("#Notes").val();
    entity["SubTotal"] = SubTotal;
    entity["SubTotalBeForeTax"] = SubTotalBeForeTax;
    entity["TotalDiscount"] = TotalDiscount;
    entity["TotalTax"] = TotalTax;
    entity["TipAmount"] = TotalTip;
    entity["Total"] = SubTotalBeForeTax + TotalTax;
    entity["TotalWithTip"] = SubTotalBeForeTax + TotalTax + TotalTip;
    entity["TotalPayment"] = TotalPayment;
    Balance = SubTotalBeForeTax + TotalTax + TotalTip - TotalPayment;
    entity["Balance"] = Balance < 0 ? 0 : Balance;
    entity["Change"] = Balance < 0 ? -(Balance) : 0;
    entity["Channel"] = "channel_offline";
    entity["InvoiceType"] = $("#IsRefund").val() == "1" ? "invoice_type_refund" : "invoice_type_sale";
    entity["RefundInvoiceID"] = $("#InvoiceID").val();

    $.RequestAjax(urlSaveInvoice, JSON.stringify({
        entity: entity,
        InvoiceDetails: InvoiceDetails,
        InvoicePayments: InvoicePayments,
        InvoiceTips: InvoiceTips,
        isUpdate: 0
    }), function (data) {
        if (!JSON.parse(data.Result)) {
            toastr["error"](data.ErrorMessage, "Error");
        } else {
            location.href = "/Sale/Invoices?id=" + data.InvoiceID;
            localStorage.setItem("FromSaveInvoice", "1");
        }
    })
}
var ShowClientInfo = function (renposive, IsCloseSearch) {
    $("#contentSearch").addClass("d-none");
    $("#contentRight").removeClass("d-none");
    $("#contentSearch").html("");
    $("#contentSearch").append(renposive.Html);
    var clientTitle = $($('#contentSearch').find("div:first .align-items-start:first")[0].outerHTML);
    clientTitle.find(".dropdown").remove();
    clientTitle.attr("name", "clienttitle");
    clientTitle.children("div").append('<span class="float-right mr-3" style="font-size: 28px; font-weight: bold"><i class="fa fa-angle-right"></i></span>');
    var containtSearch = $('[name="searchClient"]').closest(".align-items-start");
    containtSearch.hide();
    containtSearch.closest("div.form-group").prepend(clientTitle);//prepend

    var closeClientDetail = $('<div id="divcloseClientDetail" class="form-group modal-backdrop d-flex fade show flex-column position-absolute" style="z-index: 3000">'
                                 + '<div style="flex-grow:1" class="row">'
                                 + '<div class="mx-auto my-auto">'
                                 + ' <button type="button" class="btn btn-block btn-info active mx-auto btn-circle" aria-pressed="true" id="buttonCloseSearchClient"><i class="fa fa-close d-block"></i> <span class="d-block">ESC</span></button>'
                                 + '<p class="text-white">CLICK TO CLOSE</p>'
                                 + '</div></div></div>')
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

    clientTitle.click(function () {
        $("#contentRight").addClass("d-none");
        $("#contentSearch").removeClass("d-none");
        $("#contentLeft").append(closeClientDetail);
        var CloseSearch = function () {
            closeClientDetail.remove();
            $("#contentSearch").addClass("d-none");
            $("#contentRight").removeClass("d-none");
        }
        closeClientDetail.find("#buttonCloseSearchClient").click(function () {
            CloseSearch();
        })
        //phai bo trong day vi luc nay #buttonRemoveClient moi co html
        $("#buttonRemoveClient").click(function () {
            closeClientDetail.remove();
            $("#contentSearch").addClass("d-none");
            $("#contentRight").removeClass("d-none");
            $('[name="searchClient"]').val("");
            containtSearch.show("slow");
            containtSearch.closest("div.form-group").find("[name='clienttitle']").remove();
            $("#ClientID").val(0);
        })
        $("#buttonEditClient").click(function () {
            $("#actionModal #TitleModal").text("Edit Client");
            //lay client
            $.RequestAjax("/Clients/GetClientByID", JSON.stringify({
                ID: $("#ClientID").val(),
            }), function (data) {
                var client = data.data;
                $("#actionModal #ClientID").val(client.ClientID);
                $("#actionModal #FirstName").val(client.FirstName);
                $("#actionModal #LastName").val(client.LastName);
                $("#actionModal #MobileNumber").val(client.MobileNumber);
                $("#actionModal #Telephone").val(client.Telephone);
                $("#actionModal #Email").val(client.Email);
                $("#actionModal #AppointmentNotificationType").val(client.AppointmentNotificationType).change();
                $("#actionModal #AcceptMarketingNotifications").iCheck(client.AcceptMarketingNotifications == true ? 'check' : 'uncheck');
                $("#actionModal #Gender").val(client.Gender).change();
                $("#actionModal #ReferralSource").SetValueSelect2ID(client.ReferralSource);
                if (client.DateOfBirth != null) {
                    if (moment(client.DateOfBirth).year() == 1900) {
                        NotYear = true;
                        $("#actionModal #DateOfBirth").daterangepicker({
                            "singleDatePicker": true,
                            "timePicker": false,
                            "changeYear": false,
                            "locale": {
                                "format": "DD/MM",
                            }
                        });
                        $("#actionModal #setyear").html("Set year");
                    }
                    else {
                        NotYear = false;
                        $("#actionModal #DateOfBirth").daterangepicker({
                            "singleDatePicker": true,
                            "timePicker": false,
                            "locale": {
                                "format": Window.FormatDateJS,
                            }
                        });
                        $("#actionModal #setyear").html("Remove year");
                    }
                }
                $("#actionModal #DateOfBirth").data('daterangepicker').setStartDate(client.DateOfBirth ? moment(client.DateOfBirth)._d : moment()._d);
                $("#actionModal #DisplayOnAllBookings").iCheck(client.DisplayOnAllBookings == true ? 'check' : 'uncheck');
                $("#actionModal #ClientNotes").val(client.ClientNotes);
                $("#actionModal #Address").val(client.Address);
                $("#actionModal #Suburb").val(client.Suburb);
                $("#actionModal #City").val(client.City);
                $("#actionModal #State").val(client.State);
                $("#actionModal #PostCode").val(client.PostCode);
                $("#deleteButton").show();
            }, function () {
            })

            $('#actionModal').modal("show");

            closeClientDetail.remove();
            $("#contentSearch").addClass("d-none");
            $("#contentRight").removeClass("d-none");
            $('[name="searchClient"]').val("");
            containtSearch.show("slow");
            containtSearch.closest("div.form-group").find("[name='clienttitle']").remove();
        })

        $(document).keyup(function (e) {
            if (e.keyCode == 27) {
                closeClientDetail.remove();
                $("#contentSearch").addClass("d-none");
                $("#contentRight").removeClass("d-none");
                $("#contentRight").css('display', 'block');
            }
        })
    })
    if (IsCloseSearch) {
        $("#contentSearch").addClass("d-none");
        $("#contentRight").css('display', 'block');
    }
}
var ShowClientDetail = function (ClientID) {
    var Body;
    var urlGetClientBaseIdForAppointment = "/Calendar/GetClientBaseIdForAppointment";
    $.RequestAjax(urlGetClientBaseIdForAppointment, JSON.stringify({
        "ClientId": ClientID
    }), function (data) {

        var IconNew = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" transform="translate(3 3)"><circle cx="9" cy="9" r="9" fill="#2883D2"></circle><path fill="#FFF" d="M13.3073393 6.6688549l-2.3327276-.1691103-.8803685-2.16361733C9.9102114 3.8884823 9.48246183 3.6 9 3.6c-.4824618 0-.91021143.2884823-1.09424324.73612727L7.02538834 6.4997446l-2.33272764.1691103c-.4824618.03481684-.88534226.35314215-1.03455725.81073477-.149215.45759264-.00497383.95497592.3630898 1.2683274l1.78560602 1.50707133-.5570693 2.2680678c-.08952898.3531422-.00994765.7212058.21387483 1.0047143.22382248.2884823.57199078.4575927.93010676.4575927.21884864 0 .43272346-.0596861.6217291-.1790581L9 12.5727946l1.9845593 1.2335105c.1890057.119372.4028805.1790581.6217292.1790581.3581159 0 .7062843-.1691104.9301067-.4575927.2238224-.2835085.3034038-.6515721.2138748-1.0047143l-.5570693-2.2680678 1.7856061-1.50707133c.3680636-.30837764.5123047-.80576093.3630897-1.2683274-.1492149-.45759262-.5570693-.77591793-1.0345572-.81073476zm-1.918745 2.9967374c-.2018798.16823322-.2859964.4374063-.2243108.6897561l.7065793 2.865572-2.50667456-1.5589609c-.22431087-.1401942-.50469953-.1401942-.72340268 0l-2.51228234 1.5701766.71218718-2.8823955c.0616855-.2523497-.0224311-.5215228-.22431092-.68975602L4.35644692 7.75334173l2.94408087-.21309538c.2579575-.01682332.4878762-.18505652.5888161-.42619075L8.999683 4.3830701l1.11594678 2.73659326c.10094.24113425.3252509.40936744.5888162.42619076l2.9440809.21309538-2.2599326 1.9066428z"></path></g></svg>';
        var IconArrived = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g transform="translate(3 3)" fill-rule="nonzero" fill="none"><circle fill="#F5A623" cx="9" cy="9" r="9"></circle><path d="M13.286214 7.815888l-.43317-.41247C12.70296 7.267806 12.52764 7.2 12.327507 7.2c-.204255 0-.377487.067815-.519984.2034l-2.807496 2.672622-2.80746-2.672532c-.142488-.135594-.315765-.2034-.51993-.2034-.200232 0-.375507.067806-.525636.2034l-.4275.41247c-.146357.13923-.2195.30609-.2195.5004 0 .197946.073224.362916.219492.494865l3.760578 3.57984C8.61876 12.530313 8.791983 12.6 9 12.6c.20412 0 .379368-.06966.5256-.208935l3.760596-3.57984c.142506-.135675.213804-.3006.213804-.494865.000018-.190683-.07128-.357444-.213786-.500472z" fill="#FFF"></path></g></svg>';
        var IconConfirmed = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" transform="translate(3 3)"><circle cx="9" cy="9" r="9" fill="#3093E8"></circle><path fill="#FFF" d="M13.184262 8.7361c.210582-.32027.315738-.672823.315738-1.057905 0-.445708-.163107-.832836-.48959-1.161997-.326643-.32882-.713404-.493195-1.160237-.493195H10.71574c.206204-.42832.309486-.843748.309486-1.246083 0-.506268-.075402-.908626-.225663-1.20719-.15042-.298654-.369603-.518178-.65753-.658867C9.854043 2.770243 9.529723 2.7 9.16879 2.7c-.219252 0-.412542.08004-.580118.240187-.184734.181698-.31795.415407-.39956.70099-.081656.285493-.147215.55921-.196587.820993-.049372.26176-.125722.44673-.2288.55489-.210606.229322-.440468.506313-.6897.83079-.433987.566758-.72837.902124-.882988 1.00601H4.425015c-.22774 0-.422204.081245-.583346.24337-.16108.162285-.24167.358076-.24167.58742v4.15368c0 .229343.0805.425066.24167.58735.16123.162285.3556.243484.58334.243484h1.85617c.09454 0 .39098.08652.88944.2596.52855.186086.9937.327752 1.39542.425137.40177.09739.80892.1461 1.22146.1461h.83143c.60583 0 1.0935-.17426 1.46308-.52261.369442-.34834.552144-.8232.5479-1.42462.25781-.33318.38669-.71826.38669-1.15522 0-.09513-.006344-.18815-.019303-.2791.16322-.28979.245035-.60133.245035-.93451-.00007-.15578-.01937-.30513-.058087-.44782zm-8.05668 2.979c-.081633.082154-.1783.12339-.290026.12339-.111747 0-.208437-.041214-.290092-.12339-.08161-.08213-.12245-.179515-.12245-.292108 0-.112478.04075-.209794.12245-.29204.081745-.08222.178345-.12332.290092-.12332.111726 0 .208393.0411.290026.12332.081655.082223.122493.17954.122493.29204 0 .112592-.040838.209977-.122493.292108zm7.40913-3.504404c-.092402.198997-.207378.300678-.344862.30495.06443.073585.118182.176448.161166.308294.042938.132005.064272.25203.064272.360258 0 .298405-.113712.555914-.341474.772187.077433.138393.11606.287743.11606.447754 0 .1601-.037543.31911-.112787.47701-.075108.15776-.17724.27137-.3061.34057.02147.12978.032126.25096.032126.36344 0 .72254-.41254 1.08382-1.237647 1.08382h-.77966c-.56303 0-1.297698-.15783-2.204436-.47376-.021514-.00864-.083732-.03144-.186923-.06815-.103192-.03672-.17943-.06379-.22887-.08104-.04944-.01744-.12457-.04231-.225617-.07468-.101024-.03253-.182566-.05636-.24492-.07143-.062262-.0151-.133216-.02917-.212636-.04217-.079466-.01298-.14717-.01944-.20302-.01944h-.206248v-4.1535h.206248c.068742 0 .145-.01953.2288-.05838.083778-.03896.169767-.09736.257833-.175265.088112-.07791.17076-.1547.248148-.23046.077366-.0757.163288-.17088.257856-.2855.09453-.11471.16864-.20661.22239-.27586.05369-.06922.12135-.15797.203-.26613.08161-.108137.13108-.17306.14825-.194724.2363-.294175.40173-.491035.49625-.5906.17618-.185994.304-.422886.38349-.71063.07958-.287787.14509-.5593.19648-.814536.05152-.25526.13327-.439207.24513-.55171.41241 0 .68749.101636.82495.30502.13744.20334.206207.517064.206207.941086 0 .25526-.103214.60247-.30951 1.04161-.206202.439184-.309235.784258-.309235 1.035197h2.268704c.215074 0 .406197.083245.573706.249917.167643.16656.25156.360148.25156.580877-.00007.151417-.04628.32668-.13866.52595z"></path></g></svg>';
        var IconStarted = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" transform="translate(3 3)"><circle cx="9" cy="9" r="9" fill="#0BC2B0"></circle><path fill="#FFF" d="M7.81588982 4.7137819L7.4034091 5.14695C7.26781586 5.2970585 7.2 5.4723775 7.2 5.672502c0 .2042521.06781587.377487.2034091.519988l2.67261173 2.80748975-2.6725347 2.8074696c-.13559322.14248073-.2034091.3157561-.2034091.51992724 0 .2002257.06781588.3755041.2034091.52563292l.41248074.4274827c.13923343.14636548.3060863.21950775.50040447.21950775.19793914 0 .36290447-.0732232.49485747-.21948753l3.5798344-3.76058527C12.5303159 9.3812301 12.6 9.2080154 12.6 9c0-.2041105-.0696649-.3793686-.2089368-.5255925L8.8112288 4.713802C8.67555856 4.5713011 8.5106125 4.5 8.31637135 4.5c-.19069723-.0000202-.35745378.0712808-.50048152.2137819z"></path></g></svg>';
        var IconNoShow = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path fill="#F33155" d="M12 3c-4.96246154 0-9 4.0371923-9 9s4.03753846 9 9 9c4.9624615 0 9-4.0371923 9-9s-4.0375385-9-9-9z"></path><path fill="#FFF" d="M15.9616618 13.3259828l-1.3960641-2.37770694 1.4093294-2.40051724c.0281341-.04794828.0295919-.10815517.0039359-.1575-.0258018-.04934483-.0744898-.0799138-.127551-.0799138H9.62837733V8H9v9h.76019354v-3.4137931H15.851312c.0835277 0 .148688-.0693621.148688-.1551724 0-.0405-.0145773-.0772759-.0383382-.1050517z"></path></g></svg>';
        var IconCompleted = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#11CFBD"></circle><path fill="#FFF" d="M17.0175 8.9985l-5.53846152 6.2307692c-.13638462.1533462-.3264231.2322693-.5178462.2322693-.15196152 0-.30461538-.0498462-.43234614-.1516154L7.0673077 12.54069228c-.29838462-.2385-.34684616-.67430766-.108-.97303842.2385-.29873076.67465384-.34719234.97303845-.10834614l2.94819233 2.35834618L15.9825 8.0780769c.2533846-.28592304.6916154-.31153842.9771923-.05746152.2859231.2544231.3118846.69196152.0578077.97788462z"></path></svg>';
        var IconCancelled = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path fill="#F33155" d="M12 3c-4.96246154 0-9 4.0371923-9 9s4.03753846 9 9 9c4.9624615 0 9-4.0371923 9-9s-4.0375385-9-9-9z"></path><path fill="#FFF" d="M12.85570935 12.0000169L15.422774 9.43294924c.2363013-.23630165.2363013-.61942135 0-.8556892-.2363014-.23630166-.6193869-.23630166-.8556883 0l-2.56709836 2.56710145-2.56709847-2.5671353c-.23630137-.23630165-.6193868-.23630165-.8556882 0-.23626756.23630166-.23626756.61942136 0 .85568923l2.56709844 2.56706764-2.5670984 2.5671014c-.23626756.2363017-.23626756.6194214 0 .8556893.2363014.2363016.6193868.2363016.8556882 0l2.56709847-2.56710147 2.56709836 2.56710146c.2362676.2363016.6193869.2363016.8556883 0 .2363013-.2363017.2363013-.6193876 0-.8556893l-2.56706464-2.5670676z"></path></g></svg>';
        var lineService = '<div class="_1EOvhM"><div class="_3xe42K"><div class="_1p62pX tHvQyk _297s6m">@ServiceName</div><div class="_1p62pX tHvQyk _1311Sc">@Price</div></div><div><div class="_1p62pX NvtZlc _297s6m">@DurationNameAndStaff</div></div></div>';
        var lineProduct = '<div class="_2mPFMy _1Ov_P6 ex0yBB _2KNr67" style="display: flex; flex-direction: column;"><div class="UV7tO0"><div class="_1p62pX tHvQyk _1ZsqH8">@ProductName</div><div class="_1p62pX tHvQyk _3eh4EJ">@PriceAfterDiscount</div></div><div class="UV7tO0"><div class="_1p62pX NvtZlc _1ZsqH8">@Quantity</div><div class="_1p62pX NvtZlc">@InvoiceDate</div></div></div>';
        var lineInvoice = '<div class="_2mPFMy _1Ov_P6 ex0yBB _2KNr67" style="display: flex; flex-direction: column;"><div class="UV7tO0">@Status</div><div class="UV7tO0"><div class="_1p62pX tHvQyk _1ZsqH8">@InvoiceNo</div><div class="_1p62pX tHvQyk _3eh4EJ">@Total</div></div><div class="UV7tO0"><div class="_1p62pX NvtZlc _1ZsqH8">@LocationName</div><div class="_1p62pX NvtZlc">@InvoiceDate</div></div></div>';

        $.RequestAjaxText("/ContentHtml/Client/Desktop/Detail/ClientDetail.html", function (html) {
            Body = $(html.replace("@Represent", ($.trim(data.Client.FirstName) == "" ? '' : data.Client.FirstName.toString().charAt(0).toUpperCase()))
                        .replace("@FullName", ($.trim(data.Client.FirstName) == "" ? '' : data.Client.FirstName) + ($.trim(data.Client.LastName) == "" ? '' : ' ' + data.Client.LastName))
                        .replace("@Description", ($.trim(data.Client.MobileNumber) == "" ? '' : data.Client.MobileNumber) + ($.trim(data.Client.Email) == "" ? '' : ', ' + data.Client.Email)));
        });

        var lineAP = '';
        $.RequestAjaxText("/ContentHtml/Client/Desktop/Detail/LineAppointments.html", function (data) {
            lineAP = data;
        });
        //client info

        //summary info
        Body.find("#divClientTotalBookings").html(data.Client.Appointments);
        Body.find("#divClientTotalSales").html(Window.CurrencySymbol + $.number(data.Client.TotalSales, Window.NumberDecimal, '.', ','));
        //show tab Appointment
        Body.find("#divClientAppointmentUpcoming").html("");
        Body.find("#divClientAppointmentPast").html("");
        if (data.Appointments != null && data.Appointments.length > 0) {
            var oldAppointmentID = 0;
            var NewLineAP = '';
            var Item;
            var countUp = 0;
            var countPast = 0;
            $.each(data.Appointments, function () {
                if (this.AppointmentID != oldAppointmentID) {
                    NewLineAP = lineAP.replace("@Date", moment(this.StartTime).format(Window.FormatDayAndMonthNameJS));
                    NewLineAP = NewLineAP.replace("@Time", moment(this.StartTime).format(Window.FormatTimeJS));
                    if (this.Status == "New") {
                        NewLineAP = NewLineAP.replace("@TipStatus", "New Appointment");
                        NewLineAP = NewLineAP.replace("@Icon", IconNew);
                    }
                    else if (this.Status == "Completed") {
                        NewLineAP = NewLineAP.replace("@TipStatus", "Completed");
                        NewLineAP = NewLineAP.replace("@Icon", IconCompleted);
                    }
                    else if (this.Status == "NoShow") {
                        NewLineAP = NewLineAP.replace("@TipStatus", "No Show");
                        NewLineAP = NewLineAP.replace("@Icon", IconNoShow);
                    }
                    else if (this.Status == "Confirmed") {
                        NewLineAP = NewLineAP.replace("@TipStatus", "Confirmed");
                        NewLineAP = NewLineAP.replace("@Icon", IconConfirmed);
                    }
                    else if (this.Status == "Arrived") {
                        NewLineAP = NewLineAP.replace("@TipStatus", "Arrived");
                        NewLineAP = NewLineAP.replace("@Icon", IconArrived);
                    }
                    else if (this.Status == "Started") {
                        NewLineAP = NewLineAP.replace("@TipStatus", "Started");
                        NewLineAP = NewLineAP.replace("@Icon", IconStarted);
                    }
                    else if (this.Status == "Cancelled") {
                        NewLineAP = NewLineAP.replace("@TipStatus", "Cancelled");
                        NewLineAP = NewLineAP.replace("@Icon", IconCancelled);
                    }

                    var newlineservice = lineService.replace("@Price", Window.CurrencySymbol + $.number(this.Price, Window.NumberDecimal, '.', ','));
                    newlineservice = newlineservice.replace("@ServiceName", this.ServiceName);
                    newlineservice = newlineservice.replace("@DurationNameAndStaff", (this.DurationName == "" ? "" : (this.DurationName + " with ")) + this.StaffName);
                    Item = $(NewLineAP);
                    Item.find("#divLineService").append(newlineservice);

                    if (moment(this.StartTime).isBefore(moment(moment().tz(Window.TimeZone).format()))) {
                        Body.find("#divClientAppointmentPast").append(Item);
                        countPast = countPast + 1;
                    }
                    else {
                        Body.find("#divClientAppointmentUpcoming").append(Item);
                        countUp = countUp + 1;
                    }
                }
                else {
                    var newlineservice = lineService.replace("@Price", Window.CurrencySymbol + $.number(this.Price, Window.NumberDecimal, '.', ','));
                    newlineservice = newlineservice.replace("@ServiceName", this.ServiceName);
                    newlineservice = newlineservice.replace("@DurationNameAndStaff", (this.DurationName == "" ? "" : (this.DurationName + " with ")) + this.StaffName);
                    Item.find("#divLineService").append(newlineservice);
                }
                oldAppointmentID = this.AppointmentID;
            })
            if (countPast > 0) {
                Body.find("#divClientPast").html("Past (" + countPast + ")");
            }
            else {
                Body.find("#divPast").css("display", "none");
            }
            if (countUp > 0) {
                Body.find("#divClientUpcoming").html("Upcoming (" + countUp + ")");
            }
            else {
                Body.find("#divUpcoming").css("display", "none");
            }
        }
        else {
            $.RequestAjaxText("/ContentHtml/Client/Desktop/Detail/NoAppointment.html", function (data) {
                Body.find("#divTabAppointment").html(data);
            });
        }
        //show tab product
        Body.find("#divClientProduct").html("");
        if (data.Products != null && data.Products.length > 0) {
            $.each(data.Products, function () {
                var item = lineProduct.replace("@ProductName", this.ItemName);
                item = item.replace("@PriceAfterDiscount", Window.CurrencySymbol + $.number(this.PriceAfterDiscount, Window.NumberDecimal, '.', ','));
                item = item.replace("@Quantity", this.Quantity + " sold");
                item = item.replace("@InvoiceDate", moment(this.InvoiceDate).format(Window.FormatDateWithDayOfWeekJS));
                Body.find("#divClientProduct").append(item);
            })
        }
        else {
            $.RequestAjaxText("/ContentHtml/Client/Desktop/Detail/NoProduct.html", function (data) {
                Body.find("#divTabProduct").html(data);
            });
        }
        //show line invoice
        Body.find("#divClientInvoice").html("");
        if (data.Invoices != null && data.Invoices.length > 0) {
            $.each(data.Invoices, function () {
                var item = lineInvoice;
                if (this.InvoiceStatus == "invoice_status_complete") {
                    item = item.replace("@Status", '<span class="_3GjCeD _2-xB9j _1bAC7l">' + Window.ResourcesEnum[this.InvoiceStatus] + '</span>');
                }
                else if (status == "invoice_status_refund") {
                    item = item.replace("@Status", '<span class="_3GjCeD _3HGXVo _1bAC7l">' + Window.ResourcesEnum[this.InvoiceStatus] + '</span>');
                }
                else {
                    item = item.replace("@Status", '<span class="_3GjCeD GbRcyD _1bAC7l">' + Window.ResourcesEnum[this.InvoiceStatus] + '</span>');
                }

                item = item.replace("@InvoiceNo", this.InvoiceNo);
                item = item.replace("@LocationName", this.LocationName);
                item = item.replace("@Total", Window.CurrencySymbol + $.number(this.TotalWithTip, Window.NumberDecimal, '.', ','));
                item = item.replace("@InvoiceDate", moment(this.InvoiceDate).format(Window.FormatDateWithDayOfWeekJS));
                Body.find("#divClientInvoice").append(item);
            })
        }
        else {
            $.RequestAjaxText("/ContentHtml/Client/Desktop/Detail/NoInvoice.html", function (data) {
                Body.find("#divTabInvoice").html(data);
            });
        }
        //show line info
        var lineinfo = '<div class="_1qZ_Gc"><div class="_1p62pX _1-EIW_">@Name</div><div class="_1p62pX _206u0u">@Value</div></div>';
        Body.find("#divClientInfo").html("");
        if (data.Client.MobileNumber != null && data.Client.MobileNumber != "") {
            var item = lineinfo.replace("@Name", "Mobile");
            item = item.replace("@Value", "+" + data.Client.MobileNumberDialCode + " " + data.Client.MobileNumber);
            Body.find("#divClientInfo").append(item);
        }
        if (data.Client.Email != null && data.Client.Email != "") {
            var item = lineinfo.replace("@Name", "Email");
            item = item.replace("@Value", data.Client.Email);
            Body.find("#divClientInfo").append(item);
        }
        if (data.Client.Gender != null && data.Client.Gender != "gender_unknown") {
            var item = lineinfo.replace("@Name", "Gender");
            item = item.replace("@Value", Window.ResourcesEnum[data.Client.Gender]);
            Body.find("#divClientInfo").append(item);
        }

        Body.find("#btnTabAppointments").addClass("oEUy3Y");
        Body.find("#divTabAppointment").css('display', 'block');
        Body.find("#divTabProduct").css('display', 'none');
        Body.find("#divTabInvoice").css('display', 'none');
        Body.find("#divTabInfo").css('display', 'none');

        Body.find("#btnTabAppointments").click(function () {
            Body.find("#btnTabAppointments").removeClass("oEUy3Y").addClass("oEUy3Y");
            Body.find("#btnTabProducts").removeClass("oEUy3Y");
            Body.find("#btnTabInvoices").removeClass("oEUy3Y");
            Body.find("#btnTabInfo").removeClass("oEUy3Y");

            Body.find("#divTabAppointment").css('display', 'block');
            Body.find("#divTabProduct").css('display', 'none');
            Body.find("#divTabInvoice").css('display', 'none');
            Body.find("#divTabInfo").css('display', 'none');
        })
        Body.find("#btnTabProducts").click(function () {
            Body.find("#btnTabProducts").removeClass("oEUy3Y").addClass("oEUy3Y");
            Body.find("#btnTabAppointments").removeClass("oEUy3Y");
            Body.find("#btnTabInvoices").removeClass("oEUy3Y");
            Body.find("#btnTabInfo").removeClass("oEUy3Y");

            Body.find("#divTabProduct").css('display', 'flex');
            Body.find("#divTabAppointment").css('display', 'none');
            Body.find("#divTabInvoice").css('display', 'none');
            Body.find("#divTabInfo").css('display', 'none');
        })
        Body.find("#btnTabInvoices").click(function () {
            Body.find("#btnTabInvoices").removeClass("oEUy3Y").addClass("oEUy3Y");
            Body.find("#btnTabAppointments").removeClass("oEUy3Y");
            Body.find("#btnTabProducts").removeClass("oEUy3Y");
            Body.find("#btnTabInfo").removeClass("oEUy3Y");

            Body.find("#divTabInvoice").css('display', 'flex');
            Body.find("#divTabAppointment").css('display', 'none');
            Body.find("#divTabProduct").css('display', 'none');
            Body.find("#divTabInfo").css('display', 'none');
        })
        Body.find("#btnTabInfo").click(function () {
            Body.find("#btnTabInfo").removeClass("oEUy3Y").addClass("oEUy3Y");
            Body.find("#btnTabAppointments").removeClass("oEUy3Y");
            Body.find("#btnTabProducts").removeClass("oEUy3Y");
            Body.find("#btnTabInvoices").removeClass("oEUy3Y");

            Body.find("#divTabInfo").css('display', 'flex');
            Body.find("#divTabAppointment").css('display', 'none');
            Body.find("#divTabProduct").css('display', 'none');
            Body.find("#divTabInvoice").css('display', 'none');
        })
    })
    return Body;
}

//#endregion

//#region Extension
$(function () {
    $.fn.extend({
        CreateItem: function (enableQuantity, enablePrice, item, locationid) {
            if ($(this).is("div")) {
                AddItem(item, locationid);
            }
        }
    })
    //#region Modal
    $.ModalGiftVoucher = function (clickSave) {
        if (!HtmlModalGiftVoucher)
            $.RequestAjaxText("/ContentHtml/CheckOut/Desktop/ModalGiftVoucher.html", function (data) { HtmlModalGiftVoucher = data; });
        var html = HtmlModalGiftVoucher;
        var modal = $(html);
        $("body").append(modal);
        $("#ExpiryManual").daterangepicker({
            "singleDatePicker": true,
            "autoApply": true,
            "autoUpdateInput": false,
            "minDate": moment(moment().tz(Window.TimeZone).format("YYYY-MM-DD")),
            "locale": {
                "firstDay": parseInt(Window.BusinessBeginningOfWeek)
            }
        });
        $("#ExpiryManual").data('daterangepicker').setStartDate(moment(moment().tz(Window.TimeZone).format("YYYY-MM-DD")));
        $("#ExpiryManual").data('daterangepicker').setEndDate(moment(moment().tz(Window.TimeZone).format("YYYY-MM-DD")));
        $("#ExpiryManual").val(moment(moment().tz(Window.TimeZone).format()).format("dddd DD MMM, YYYY"));
        $("#ExpiryManual").on('apply.daterangepicker', function (ev, picker) {
            $(this).val($(this).data('daterangepicker').startDate.format("dddd DD MMM, YYYY")).trigger("change");
        });

        modal.find(".modal-content").css("height", $(document).width() <= "768" ? $(document).height() : $(document).height() - 60);
        modal.find(".modal-content").css("width", $(document).width() <= "768" ? $(document).width() : $(document).width() / 3);
        modal.find("#expiry").change(function () {
            if ($(this).val() == "custom") {
                $("#ExpiryManual").show();
            }
            else {
                $("#ExpiryManual").hide();
            }
        })
        modal.modal({
            keyboard: false,
            show: true,
            backdrop: "static"
        })
        modal.find(".prevModalWizard").click(function () {
            modal.modal("hide");
        })
        modal.on('hidden.bs.modal', function (e) {
            $(this).remove();
        })
        if (clickSave) {
            modal.find("#addButtonGiftVoucher").click(clickSave)
        }
    };
    $.ModalInvoiceDetails = function (clickSave) {
        if (!HtmlModalModalInvoiceDetails)
            $.RequestAjaxText("/ContentHtml/CheckOut/Desktop/ModalInvoiceDetails.html", function (data) { HtmlModalModalInvoiceDetails = data; });
        var modal = $(HtmlModalModalInvoiceDetails);
        modal.find("#staffModalInvoiceDetails").InStallSelect2('/Sale/LoadSelect2ForUserLocation', 20, 'Select staff', { "LocationId": $.GetLocation() });
        modal.find("#staffModalInvoiceDetails").SetValueSelect2ID($("#UserID").val());
        modal.find("#noteModalInvoiceDetails").val($("#Notes").val());
        modal.modal({
            keyboard: false,
            show: true,
            backdrop: "static"
        })
        modal.on('hidden.bs.modal', function (e) {
            $(this).remove();
        })
        if (clickSave) {
            modal.find("#saveModalInvoiceDetailsButton").click(clickSave);
        }
    };
    $.ModalTip = function (clickSave) {
        if (!HtmlModalTip)
            $.RequestAjaxText("/ContentHtml/CheckOut/Desktop/ModalTip.html", function (data) { HtmlModalTip = data; });
        var htmlItem = HtmlModalTip;
        var modal = $(htmlItem);
        modal.find(".modal-content").css("height", $(document).width() <= "768" ? $(document).height() : $(document).height() - 60);
        modal.find(".modal-content").css("width", $(document).width() <= "768" ? $(document).width() : $(document).width() / 3);
        if (InvoiceTips.length > 0) {
            $.each(InvoiceTips, function () {
                AddItemTip(this, modal);
            });
        }
        else {
            AddItemTip({ TipAmount: 0, StaffID: null, TipPercent: 0, TipIsAmount: true }, modal);
        }

        modal.modal({
            keyboard: false,
            show: true,
            backdrop: "static"
        })
        modal.find("#addItemTip").click(function () {
            var NotSelectStaff = false;
            modal.find(".itemtip").each(function () {
                var val = $(this).find("#SelectStaffID").val();
                if (val == null || val == "" || val == "0") {
                    NotSelectStaff = true;
                }
            });
            if (NotSelectStaff == true) {
                toastr["error"]("Staff is required", "Notification");
            }
            else {
                AddItemTip({ TipAmount: 0, StaffID: null, TipPercent: 0, TipIsAmount: true }, modal);
            }
        })
        modal.on('hidden.bs.modal', function (e) {
            $(this).remove();
        })
        if (clickSave)
            modal.find("#btnSaveTip").click(clickSave);
    };
    $.GetLocation = function () {
        var locationId = localStorage.getItem("locationidscheul");
        return locationId ? locationId : 0;
    }
    $.CreatePopupItem = function () {
        $.ModalWizard({
            search: {
                placehold: "Scan barcode or search any item",
                methodcallback: function (idPrev, prefix, search) {
                    idPrev = parseInt(idPrev);
                    search = $.trim(search);
                    isSearchWizard = true;
                    if (search != "") {
                        var result = {
                            prefixPrev: prefix,
                            idPrev: idPrev,
                            data: []
                        };
                        if (prefix == "s_g" || prefix == "s" || prefix == "m")
                            $.merge(result.data, GetService(search, prefix == "s_g" ? 0 : idPrev, true));
                        if (prefix == "c_g" || prefix == "p" || prefix == "m")
                            $.merge(result.data, GetProduct(search, prefix == "c_g" ? 0 : idPrev, true));
                        if (prefix == "v_g" || prefix == "v" || prefix == "m" || prefix == "v_g-s_g")
                            $.merge(result.data, GetServiceBaseFlowEnableVoucherSales(search, prefix == "v_g" ? 0 : idPrev, true));
                        return result;
                    }
                    return null;
                },
            },
            title: {
                text: "Select Item"
            },
            data: {
                array: objectParent,
                methodNext: function (prefixPrev, idPrev, element) {
                    isSearchWizard = false;
                    idPrev = parseInt(idPrev);
                    if (prefixPrev == "m") {
                        if (idPrev == 1) {
                            return GetCategory();
                        } else if (idPrev == 2) {
                            return GetServiceGroup(GetOpitionServiceGroup());
                        } else if (idPrev == 3) {
                            return objectVouchers;
                        }
                    } else if (prefixPrev == "c_g") {
                        return GetProduct("", idPrev, false);
                    } else if (prefixPrev == "s_g") {
                        return GetService("", idPrev, false);
                    } else if (prefixPrev == "v_g") {
                        if (idPrev == 2)
                            return GetServiceGroup(GetOpitionServiceGroupVoucher());
                    } else if (prefixPrev == "v_g-s_g") {
                        return GetServiceBaseFlowEnableVoucherSales("", idPrev, false);
                    }
                },
                methodPrev: function (prefix, id, element) {
                    isSearchWizard = false;
                    id = parseInt(id);
                    if (prefix == "m") {
                        return objectParent;
                    } else if (prefix == "s_g") {
                        return GetServiceGroup(GetOpitionServiceGroup());
                    } else if (prefix == "c_g") {
                        return GetCategory();
                    } else if (prefix == "v_g") {
                        return objectVouchers;
                    } else if (prefix == "v_g-s_g") {
                        return GetServiceGroup(GetOpitionServiceGroupVoucher());
                    } else if (prefix == "s") {
                        return GetService("", id, false);
                    } else if (prefix == "p") {
                        return GetProduct("", id, false);
                    } else if (prefix == "v") {
                        return GetServiceBaseFlowEnableVoucherSales("", id, false);
                    }
                }
            },
            callbackcomplete: function (modal, textParent) {
                var prefix = modal.find("form").attr("prefix");
                //set text title
                var text = textParent;
                if (prefix == "m")
                    text = "Select Item";
                if (prefix == "c_g")
                    text = "Select Product";
                if (prefix == "s_g")
                    text = "Select Service";
                if (prefix == "v_g")
                    text = "Vouchers";
                if (prefix == "v_g-s_g")
                    text = "Service Vouchers";
                //search
                if (isSearchWizard) {
                    $('<div class="col-12 title-search-wizard"><strong>Products</strong></div>').insertBefore("div[prefix='p']:first");
                    $('<div class="col-12 title-search-wizard"><strong>Services</strong></div>').insertBefore("div[prefix='s']:first");
                    $('<div class="col-12 title-search-wizard"><strong>Vouchers</strong></div>').insertBefore("div[prefix='v']:first");
                    text = "Search";
                }
                modal.find(".modal-title").text(text);
            }
        })
    }
    //#endregion
})
//#endregion

$(function () {
    //#region Client
    var country = "vn";
    $.each($.fn.intlTelInput.getCountryData(), function () {
        if ($("#MobileNumberDialCode").val() == this.dialCode) {
            country = this.iso2;
            return;
        }
    })
    $("#MobileNumber").intlTelInput({
        separateDialCode: true,
        initialCountry: country,
        preferredCountries: [Window.CountryCode],
        utilsScript: "/Extension/js/utils.js"
    });
    $.each($.fn.intlTelInput.getCountryData(), function () {
        if ($("#TelephoneDialCode").val() == this.dialCode) {
            country = this.iso2;
            return;
        }
    })
    $("#Telephone").intlTelInput({
        separateDialCode: true,
        initialCountry: country,
        preferredCountries: [Window.CountryCode],
        utilsScript: "/Extension/js/utils.js"
    });
    $("#DateOfBirth").prop("formatdate", Window.FormatDateJS)
    $("#DateOfBirth").daterangepicker({
        "singleDatePicker": true,
        "timePicker": false,
        "changeYear": false,
        "locale": {
            "format": "DD/MM",
        }
    });
    $("#actionForm #ReferralSource").InStallSelect2('/Home/LoadSelect2ForReferralSource', 20, 'Referral Source', null);
    $('#actionForm').validate({
        rules: {
            FirstName: 'required',
        },
        messages: {
            FirstName: 'Please enter first name',
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
    $("#setyear").click(function () {
        if (NotYear) {
            $("#DateOfBirth").daterangepicker({
                "singleDatePicker": true,
                "timePicker": false,
                "locale": {
                    "format": Window.FormatDateJS,
                }
            });
            $(this).html("Remove year");
            NotYear = false;
        }
        else {
            $("#DateOfBirth").daterangepicker({
                "singleDatePicker": true,
                "timePicker": false,
                "changeYear": false,
                "locale": {
                    "format": "DD/MM",
                }
            });
            $(this).html("Set year");
            NotYear = true;
        }

    })
    //#endregion
    $("#titleModalMain").text("Checkout");
    $("#formModalMain #contentLeft .no-order").show();
    $("#formModalMain #contentLeft .order-detail").hide();
    //show refund
    if ($("#InvoiceID").val() != 0 && $("#IsRefund").val() == "1") {
        $("#titleModalMain").text("Refund");
        $.RequestAjax(urlGetInvoiceBaseId, JSON.stringify({
            "InvoiceID": $("#InvoiceID").val()
        }), function (reponsive) {
            dataInvoice = reponsive;
            var Invoice = reponsive.Invoice;
            var Client = reponsive.Client;
            var InvoiceDetail = reponsive.InvoiceDetail;
            var InvoicePayment = reponsive.InvoicePayment;

            $("#LocationID").val(Invoice.LocationID);
            $("#ClientID").val(Invoice.ClientID);
            //show client
            var Excute = function () {
                var clientDestop = new ClientDetailDestop(parseInt(Invoice.ClientID), false);
                var renposive = clientDestop.CreateClient(function (renposive) {
                    ShowClientInfo(renposive);
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

            //show service
            $.each(InvoiceDetail, function () {
                AddItem({
                    InvoiceDetailID: this.InvoiceDetailID,
                    ItemID: this.ItemID,
                    ItemName: this.ItemName,
                    DisplayName: this.ItemName,
                    ItemType: this.ItemType,
                    Duration: this.Duration,
                    DurationName: this.DurationName,
                    SpecialPrice: this.SpecialPrice,
                    RetailPrice: this.RetailPrice,
                    Price: this.PriceAfterDiscount,
                    PriceAfterDiscount: this.PriceAfterDiscount,
                    PriceBeforeTax: this.PriceBeforeTax,
                    Quantity: -this.Quantity,
                    TaxID: this.TaxID,
                    TaxRate: this.TaxRate,
                    EnableCommission: this.EnableCommission,
                    StaffID: this.StaffID,
                    DiscountID: this.DiscountID,
                    DiscountName: this.DiscountName,
                    DiscountAmount: this.DiscountAmount,
                    AppointmentServiceID: this.AppointmentServiceID,
                    Barcode: this.Barcode,
                    VoucherCode: this.VoucherCode,
                    ExpireDate: this.ExpireDate,
                    StaffIV: this.StaffIV
                }, Invoice.LocationID);
            });

        })
    }
    else if ($("#AppointmentID").val() == 0) {
        $.CreatePopupItem();
        $("#LocationID").val(localStorage.getItem("locationidscheul"));
    }
    else {
        $.RequestAjax(urlGetAppointmentBaseId, JSON.stringify({
            "AppointmentID": $("#AppointmentID").val()
        }), function (reponsive) {
            var appointment = reponsive.Appointment;
            var appointmentServices = reponsive.AppointmentServices;
            var client = reponsive.Client;
            $("#ClientID").val(appointment.ClientID == null ? 0 : appointment.ClientID);//gan de luu cho Invoice
            $("#LocationID").val(appointment.LocationID);
            //show client
            if (client != null) {
                var Excute = function () {
                    var clientDestop = new ClientDetailDestop(parseInt(reponsive.Client.ClientID), false);
                    var renposive = clientDestop.CreateClient(function (renposive) {
                        ShowClientInfo(renposive);
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

            //show service
            $.each(appointmentServices, function () {
                AddItem({
                    ItemID: this.ServiceID,
                    ItemName: this.ServiceName,
                    DisplayName: this.ServiceName,
                    ItemType: "item_type_service",
                    Duration: this.Duration,
                    DurationName: moment(appointment.ScheduledDate).startOf('day').add(this.StartTimeInSecond, "seconds").format(Window.FormatTimeJS),//this.DurationName,
                    SpecialPrice: this.SpecialPrice,
                    RetailPrice: this.RetailPrice,
                    TaxID: this.TaxID,
                    TaxRate: this.TaxRate,
                    EnableCommission: this.EnableCommission,
                    StaffID: this.StaffID,
                    AppointmentServiceID: this.AppointmentServiceID
                }, localStorage.getItem("locationidscheul"));
            });
        })
    }
    LoadPaymentType();
    if (Window.NumberDecimal == 0) {
        $("#Pay").attr("step", "1");
    }
    else if (Window.NumberDecimal == 1) {
        $("#Pay").attr("step", "0.1");
    }
    else if (Window.NumberDecimal == 2) {
        $("#Pay").attr("step", "0.01");
    }
    $("#CurrencySymbol").text(Window.CurrencySymbol);
    //#region event
    $("#addItemButton, #addItemButton2").click(function () {
        $.CreatePopupItem();
    })
    $("#openModalTip").click(function () {
        if ($("#IsRefund").val() == "") {
            $.ModalTip(function () {
                var modal = $(this).closest(".modal");
                InvoiceTips = [];
                modal.find(".itemtip").each(function () {
                    var isamount = false;
                    var Amount = 0;
                    var Percent = 0;
                    if ($(this).find("[name='prefixTipAmount']").is(".btn-success")) {
                        isamount = true;
                        Amount = parseFloat($(this).find("#TipAmount").val());
                        Percent = parseFloat((Amount / GlobalTotal) * 100).toFixed(2);
                    }
                    else {
                        Percent = parseFloat($(this).find("#TipAmount").val());
                        Amount = parseFloat((Percent / 100) * GlobalTotal).toFixed(Window.NumberDecimal);
                    }
                    if (Amount > 0) {
                        //debugger;
                        InvoiceTips.push({
                            TipAmount: Amount,
                            TipPercent: Percent,
                            TipIsAmount: isamount,
                            StaffID: $(this).find("#SelectStaffID").val(),
                            StaffName: $(this).find("#SelectStaffID option:selected").text()//$(this).find("#SelectStaffID").text(),
                        });
                    }
                })
                //clear het pay sau khi add tip
                $("#formModalMain #divPayment").html("");
                SumTotal();
            })
        }
    })
    $("#btnInvoiceDetails").click(function () {
        $.ModalInvoiceDetails(function () {
            var modal = $(this).closest(".modal");
            $("#UserID").val(modal.find("#staffModalInvoiceDetails").val());
            $("#Notes").val(modal.find("#noteModalInvoiceDetails").val());
        });
    })
    $('[name="searchClient"]').focus(function () {
        $("#contentRight").css('display', 'none');
        var Excute = function () {
            var clientDestop = new ClientSearchDestop($.GetLocation(), false);
            var renposive = clientDestop.Excute(function (renposive) {
                var clientId = renposive.Data.Client.ClientID;
                if (clientId != 0 && clientId) {
                    $("#ClientID").val(clientId);

                    var clientDestop = new ClientDetailDestop(clientId, false);
                    var renposive = clientDestop.CreateClient(function (renposive) {
                        ShowClientInfo(renposive);
                    });
                    $("#divTabAppointment").css("max-height", "calc(100vh - 300px)")
                    $("#divTabProduct").css("max-height", "calc(100vh - 300px)")
                    $("#divTabInvoice").css("max-height", "calc(100vh - 300px)")
                    $("#contentRight").css('display', 'block');
                }
                else {
                    $("#contentRight").css('display', 'block');
                }
            });
        }
        if (typeof ClientSearchDestop != "function") {
            $.getScript("/Scripts/calendar/client.js").done(function () {
                Excute();
            }).fail(function () {
                console.log("Load file js fail");
            })
        } else
            Excute();
    })
    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            $("#contentSearch").addClass("d-none");
            $("#contentRight").css('display', 'block');
        }
    })
    $("#closeModalMain").click(function () {
        var count = 0;
        var that = $(this);
        $("#formModalMain .order-detail #containtItem .containt-serivce").each(function () {
            count++;
        })
        if (count > 0) {
            PNotify.notice({
                title: 'Checkout Not Saved',
                text: 'This checkout will be deleted. Are you sure you want to exit without saving?',
                icon: 'fa fa-question-circle',
                hide: false,
                width: "460px",
                stack: {
                    'dir1': 'down',
                    'modal': true,
                    'firstpos1': 25
                },
                modules: {
                    Confirm: {
                        confirm: true,
                        buttons: [{
                            text: 'YES, EXIT NOW',
                            primary: true,
                            click: function (notice) {
                                location.href = "/Calendar";
                                notice.close();
                            }
                        },
                            {
                                text: 'CANCEL',
                                click: function (notice) {
                                    notice.close();
                                }
                            }
                        ],
                    },
                    Buttons: {
                        closer: false,
                        sticker: false
                    },
                    History: {
                        history: false
                    }
                }
            })
        }
        else {
            location.href = "/Calendar";
        }
    })
    $("#formModalMain #divPaymentMethod").find(":button").click(function () {
        //find same payment type
        var that = $(this);
        //kiem tra la voucher
        if ($(that).attr("PaymentTypeID") == 0) {
            $("#formRedeemVoucher #VoucherID").val("");
            $("#formRedeemVoucher #ServiceID").val("");
            $("#formRedeemVoucher #txtSearchVoucherCode").val("");
            $("#formRedeemVoucher #divSearchVoucherCode").css('display', 'flex');
            $("#formRedeemVoucher #divNotFoundVoucher").css('display', 'none');
            $("#formRedeemVoucher #divFoundVoucher").css('display', 'none');
            $("#actionModalRedeemVoucher").modal("show");
            return;
        }
        AddItemPayment($(that).attr("PaymentTypeID"), parseFloat($("#Pay").val()), $(that).attr("PaymentTypeName"), 0, "", 0);
    })
    $("#btnBackToPayment").click(function () {
        $("#formModalMain #divPayment").html("");
        SumTotal();
    })
    $("#btnCompleteSale").click(function () {
        SaveInvoice("invoice_status_complete");

    })
    $("#btnSaveUnpaid").click(function () {
        SaveInvoice("invoice_status_unpaid");
    })
    $("#btnSavePartPaid").click(function () {
        SaveInvoice("invoice_status_part_paid");
    })
    $("#btnRefundNow").click(function () {
        SaveInvoice("invoice_status_refund");
    })
    $("#actionModalRedeemVoucher #txtSearchVoucherCode").on("input", function (e) {
        var code = $(this).val();
        if (code == "") {
            $("#formRedeemVoucher #divSearchVoucherCode").css('display', 'flex');
            $("#formRedeemVoucher #divNotFoundVoucher").css('display', 'none');
            $("#formRedeemVoucher #divFoundVoucher").css('display', 'none');
        }
        else {
            $.RequestAjax(urlSearchVoucherCode, JSON.stringify({
                "Search": code
            }), function (data) {
                if (data.Results.length > 0) {
                    var Voucher = data.Results[0];
                    //show thong tin voucher
                    $("#formRedeemVoucher #txtCurrency").html(Window.CurrencySymbol);
                    if (Voucher.VoucherType == "voucher_type_gift_voucher") {
                        $("#formRedeemVoucher #txtVoucherType").html("GIFT");
                        $("#formRedeemVoucher #divVoucherType").html("Outstanding <span>" + Window.CurrencySymbol + $.number(Voucher.Remaining, Window.NumberDecimal, '.', ',') + "</span>");
                        $("#formRedeemVoucher #divVoucherServiceName").html("");
                    }
                    else {
                        $("#formRedeemVoucher #txtVoucherType").html("SERVICE");
                        $("#formRedeemVoucher #divVoucherType").html("Voucher of <span>" + Window.CurrencySymbol + $.number(Voucher.Remaining, Window.NumberDecimal, '.', ',') + "</span>");
                        $("#formRedeemVoucher #divVoucherServiceName").html(Voucher.ServiceName + " (" + Voucher.DurationName + ")");
                    }
                    if (Voucher.RedeemedDate != null) {
                        $("#formRedeemVoucher #txtExpire").html("Redeemed " + moment(Voucher.RedeemedDate).format(Window.FormatDateWithDayOfWeekJS) + ", invoice " + Voucher.RedeemedInvoiceNo);
                    }
                    else {
                        if (Voucher.ExpireDate != null) {
                            $("#formRedeemVoucher #txtExpire").html("Expires " + moment(Voucher.ExpireDate).format(Window.FormatDateWithDayOfWeekJS));
                        }
                        else {
                            $("#formRedeemVoucher #txtExpire").html("No Expiry");
                        }
                    }
                    $("#formRedeemVoucher #txtPurchase").html("Purchased " + moment(Voucher.IssueDate).format(Window.FormatDateWithDayOfWeekJS));
                    //
                    $("#formRedeemVoucher #divMessageVoucher").css('display', 'block');
                    $("#formRedeemVoucher #lblRedeemInput").css('display', 'none');
                    $("#formRedeemVoucher #btnRedeem").css('display', 'none');
                    $("#formRedeemVoucher #divFoundVoucher").css('display', 'flex');
                    $("#formRedeemVoucher #divSearchVoucherCode").css('display', 'none');
                    $("#formRedeemVoucher #divNotFoundVoucher").css('display', 'none');
                    //kiem tra neu la service voucher thi co service khop khong
                    var existService = false;
                    if (Voucher.VoucherType == "voucher_type_service_voucher") {
                        $("#formModalMain .order-detail #containtItem .containt-serivce").each(function () {
                            if ($(this).attr("Item-Type") == "item_type_service") {
                                if ($(this).attr("Item-ID") == Voucher.ServiceID) {
                                    existService = true;
                                }
                            }
                        })
                        if (existService == false) {
                            $("#formRedeemVoucher #divMessageVoucher").html("This voucher cannot be redeemed, the service type does not match.");
                            return;
                        }
                    }
                    //check ExpireDate
                    if (Voucher.ExpireDate != null) {
                        if (moment(Voucher.ExpireDate).isBefore(moment(moment().tz(Window.TimeZone).format()))) {
                            $("#formRedeemVoucher #divMessageVoucher").html("This voucher has been expired.");
                            return;
                        }
                    }
                    //kiem tra voucher con remaining khong
                    if (Voucher.Remaining == 0) {
                        $("#formRedeemVoucher #divMessageVoucher").html("This voucher was already fully redeemed.");
                        return;
                    }
                    //kiem tra voucher nay co status = unpaid hoac da refund
                    if (Voucher.VoucherStatus == "voucher_status_refunded_invoice" || Voucher.VoucherStatus == "voucher_status_unpaid") {
                        $("#formRedeemVoucher #divMessageVoucher").html("This voucher cannot be redeemed, the original sale is unpaid.");
                        return;
                    }
                    //kiem tra xem voucher nay da add trong invoice nay chua
                    var isexist = false
                    $("#formModalMain #divPayment .payment").each(function () {
                        if (Voucher.VoucherID == $(this).attr("VoucherID")) {
                            isexist = true;
                        }
                    })
                    if (isexist == true) {
                        $("#formRedeemVoucher #divMessageVoucher").html("This voucher was already selected for payment on this invoice.");
                        return;
                    }
                    //--------------------------------------------EVERYTHING IS OK
                    $("#formRedeemVoucher #VoucherID").val(Voucher.VoucherID);
                    $("#formRedeemVoucher #divMessageVoucher").css('display', 'none');
                    $("#formRedeemVoucher #lblRedeemInput").css('display', 'flex');
                    $("#formRedeemVoucher #btnRedeem").css('display', 'block');
                    $("#formRedeemVoucher #divFoundVoucher").css('display', 'flex');
                    $("#formRedeemVoucher #divSearchVoucherCode").css('display', 'none');
                    $("#formRedeemVoucher #divNotFoundVoucher").css('display', 'none');

                    //Setting min, max, step input amount
                    if (Window.NumberDecimal == 0) {
                        $("#formRedeemVoucher #txtPayAmount").attr("step", "1");
                    }
                    else if (Window.NumberDecimal == 1) {
                        $("#formRedeemVoucher #txtPayAmount").attr("step", "0.1");
                    }
                    else if (Window.NumberDecimal == 2) {
                        $("#formRedeemVoucher #txtPayAmount").attr("step", "0.01");
                    }
                    //Set readonly input amount and set redeem amount
                    if (Voucher.VoucherType == "voucher_type_service_voucher") {
                        $("#formRedeemVoucher #txtPayAmount").attr("readonly", true);
                        $("#formRedeemVoucher #txtPayAmount").attr("disabled", true);
                        //Lay tong tien service can phai thanh toan
                        var ServiceAmount = 0;
                        $("#formModalMain .order-detail #containtItem .containt-serivce").each(function () {
                            if ($(this).attr("Item-Type") == "item_type_service") {
                                if ($(this).attr("Item-ID") == Voucher.ServiceID) {
                                    ServiceAmount = ServiceAmount + parseFloat($(this).attr("SubTotal"));
                                }
                            }
                        })
                        //Lay tong tien da thanh toan cho service nay
                        var PayForService = 0;
                        $("#formModalMain #divPayment .payment").each(function () {
                            if ($(this).attr("PayForServiceID") == Voucher.ServiceID) {
                                PayForService = PayForService + parseFloat($(this).attr("Amount"));
                            }
                        })
                        //So tien con lai phai thanh toan cho service
                        var RedeemAmount = 0;
                        ServiceAmount = ServiceAmount - PayForService;
                        //kiem tra tong tien con lai phai thanh toan so voi tien thanh toan cho service
                        if (BalanceAmount <= ServiceAmount) {
                            RedeemAmount = BalanceAmount;
                        }
                        else {
                            RedeemAmount = ServiceAmount;
                        }
                        if (RedeemAmount > Voucher.Remaining) {
                            RedeemAmount = Voucher.Remaining;
                        }

                        if (RedeemAmount == 0) {
                            $("#formRedeemVoucher #divMessageVoucher").html("This service has been pay full.");
                            $("#formRedeemVoucher #divMessageVoucher").css('display', 'block');
                            $("#formRedeemVoucher #lblRedeemInput").css('display', 'none');
                            $("#formRedeemVoucher #btnRedeem").css('display', 'none');
                            $("#formRedeemVoucher #divFoundVoucher").css('display', 'flex');
                            $("#formRedeemVoucher #divSearchVoucherCode").css('display', 'none');
                            $("#formRedeemVoucher #divNotFoundVoucher").css('display', 'none');
                            return;
                        }

                        $("#formRedeemVoucher #txtPayAmount").val(RedeemAmount);
                        $("#formRedeemVoucher #txtPayAmount").attr("max", RedeemAmount);
                        $("#formRedeemVoucher #ServiceID").val(Voucher.ServiceID);
                    }
                    else {
                        if (parseFloat(Voucher.Remaining) >= parseFloat($("#Pay").val())) {
                            $("#formRedeemVoucher #txtPayAmount").val($("#Pay").val());
                            $("#formRedeemVoucher #txtPayAmount").attr("max", $("#Pay").val());
                        }
                        else {
                            $("#formRedeemVoucher #txtPayAmount").val(Voucher.Remaining);
                            $("#formRedeemVoucher #txtPayAmount").attr("max", Voucher.Remaining);
                        }

                        $("#formRedeemVoucher #txtPayAmount").attr("readonly", false);
                        $("#formRedeemVoucher #txtPayAmount").attr("disabled", false);
                    }
                }
                else {
                    $("#formRedeemVoucher #divSearchVoucherCode").css('display', 'none');
                    $("#formRedeemVoucher #divFoundVoucher").css('display', 'none');
                    $("#formRedeemVoucher #divNotFoundVoucher").css('display', 'flex');
                }
            }, function () {
            })
        }
    })
    $("#actionModalRedeemVoucher #txtPayAmount").on("input", function (e) {
        var amount = $(this).val();
        if (amount == 0) {
            $("#actionModalRedeemVoucher #btnRedeem").css("", "");
        }
    })
    $("#actionModalRedeemVoucher #btnRedeem").click(function () {
        AddItemPayment(0, parseFloat($("#formRedeemVoucher #txtPayAmount").val()), "Voucher (" + $("#formRedeemVoucher #txtSearchVoucherCode").val() + ")", $("#formRedeemVoucher #VoucherID").val(), $("#formRedeemVoucher #txtSearchVoucherCode").val(), $("#formRedeemVoucher #ServiceID").val());
        $("#actionModalRedeemVoucher").modal("hide");
    })
    $("#actionModal #actionButtonCancel").click(function () {
        //show client
        if ($("#ClientID").val() != null && $("#ClientID").val() != 0) {
            var Excute = function () {
                var clientDestop = new ClientDetailDestop($("#ClientID").val(), false);
                var renposive = clientDestop.CreateClient(function (renposive) {
                    ShowClientInfo(renposive, true);
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
        else {
            $("#contentSearch").addClass("d-none");
            $("#contentRight").css('display', 'block');
        }
    })
    Ladda.bind('#actionButton', {
        callback: function (instance) {
            instance.start();
            if ($("#actionForm").valid()) {
                var entity = new Object();
                $("#actionForm").find("[ispropertiesmodel]").each(function () {
                    if ($(this).is("input[type='text'],input[type='number'],input[type='email'],textarea,select,input[type='hidden'],input[type='password']"))
                        entity[$(this).attr("id")] = $(this).val();
                    if ($(this).is("input[type='checkbox'],input[type='radio']"))
                        entity[$(this).attr("id")] = this.checked;
                    if ($(this).is("[isnumber]"))
                        entity[$(this).attr("id")] = entity[$(this).attr("id")].replace(/,/gi, '');
                    if ($(this).is("[isdate]") && $(this).val() != "") {
                        if ($(this).attr("id") == "DateOfBirth") {
                            if (NotYear) {
                                entity[$(this).attr("id")] = "1900/" + moment(entity[$(this).attr("id")], Window.FormatDateJS).format("MM/DD");
                            }
                            else {
                                entity[$(this).attr("id")] = moment(entity[$(this).attr("id")], Window.FormatDateJS).format("YYYY/MM/DD");
                            }
                        }
                        else
                            entity[$(this).attr("id")] = moment(entity[$(this).attr("id")], Window.FormatDateJS).format("YYYY/MM/DD");
                    }
                })
                $.extend(entity, { MobileNumberDialCode: $("#MobileNumber").intlTelInput("getSelectedCountryData").dialCode });
                $.extend(entity, { TelephoneDialCode: $("#Telephone").intlTelInput("getSelectedCountryData").dialCode });
                $.RequestAjax("/Clients/AddOrUpdate", JSON.stringify({
                    entity: entity,
                    isUpdate: $("#actionForm [ispropertiesidmodel]").val() != 0,
                }), function (data) {
                    toastr["success"]("Data saved successfully.", "Notification");
                    $('#actionModal').modal("hide");
                    $("#ClientID").val(data.Client.ClientID);//gan de luu cho Invoice
                    //show client
                    var Excute = function () {
                        var clientDestop = new ClientDetailDestop(data.Client.ClientID, false);
                        var renposive = clientDestop.CreateClient(function (renposive) {
                            ShowClientInfo(renposive, true);
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

                }, function () {
                    instance.stop();
                })
            } else
                instance.stop();
        }
    });
    //#endregion
})