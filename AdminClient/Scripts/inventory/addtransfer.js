var htmlItemSourceLocationTemplate = '<div class="col-12 item-modal-wizard" step = "" LocationName="" StreetAddress="" APT="" City="" State="" ZipCode=""><div class="col-6"><div class="col-12"> <strong></strong></div></div><div class="col-6 text-right"><span></span></div></div>'
var htmlItemLocationTemplate = '<div class="col-12 item-modal-wizard" step = "" LocationName="" StreetAddress="" APT="" City="" State="" ZipCode=""><div class="col-6"><div class="col-12"> <strong></strong></div></div><div class="col-6 text-right"><span></span></div></div>'
var htmlItemCategoryTemplate = '<div class="col-12 item-modal-wizard" step = "" CategoryName=""><div class="col-6"><div class="col-12"> <strong></strong></div></div><div class="col-6 text-right"><span></span></div></div>'
var htmlItemProductTemplate = '<div class="col-12 item-modal-wizard" step = "" ProductName="" ReorderQty="" SupplyPrice="" OnHand=""><div class="col-6"><div class="col-12"> <strong></strong></div><div class="col-12">ONHAND</div></div><div class="col-6 text-right">SUPPLYPRICE<span></span></div></div>'
var htmlIconNext = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">'
                + '<path d="M6.187 16.9c-.25.253-.25.66 0 .91.248.253.652.253.9 0l7.285-7.355c.25-.25.25-.66 0-.91L7.088 2.19c-.25-.253-.652-.253-.9 0-.25.25-.25.658-.002.91L12.83 10l-6.643 6.9z"></path>'
                + '</svg>'
var htmlIconPrev = '<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">'
                    + '<path d="M8.80367158,16.7638261 C9.06544281,17.0467987 9.06544281,17.5049548 8.80367158,17.7879275 C8.54229164,18.0704815 8.11774488,18.0709001 7.85597365,17.7879275 L0.196328421,9.51223382 C-0.0654428068,9.22926119 -0.0654428068,8.77068646 0.196328421,8.48771383 L7.85577801,0.212229473 C8.11754924,-0.0707431577 8.54170471,-0.0707431577 8.80347594,0.212229473 C9.06524716,0.495202104 9.06524716,0.953567534 8.80406287,1.23633087 L1.81841007,9.00007847 L8.80367158,16.7638261 Z"></path>'
                    + '</svg>'
//#endregion
var LocationID;
var SourceLocationID;
var CategoryID;
var step = '1';
var TitleModal;
var LocationName;
var width = $(document).width() <= "768" ? $(document).width() : $(document).width() / 3;
var height = $(document).width() <= "768" ? $(document).height() : $(document).height() - 60;
var pdfGeneral = function () {
    if (typeof pdfMake != undefined) {
        var rows = [];
        rows.push($.map(["PRODUCT", "TRANSFER QTY.", "RECEIVED QTY", "SUPPLY PRICE", "TOTAL COST"], function (d) {
            return {
                text: typeof d === 'string' ? d : d + '',
                style: 'tableHeader'
            };
        }));
        $("#tableViewProduct tbody tr").each(function (index, row) {
            var td = $(row).find("td");
            rows.push($.map([$(td[0]).text(), $(td[1]).text(), $(td[2]).text(), $(td[3]).text(), $(td[4]).text()], function (d) {
                return {
                    text: typeof d === 'string' ? d : d + '',
                    style: index % 2 ? 'tableBodyEven' : 'tableBodyOdd'
                };
            }));
        });
        var tableDetail = [
             [{
                 stack: [
                     { text: $("#SupplierName").text(), style: "titleDetail" },
                     { text: $("#Street").text() },
                     { text: $("#City").text() },
                     { text: $("#State").text() },
                 ]
             }],
             [{
                 stack: [
                     { text: "DELIVER TO", bold: true, fontSize: 13 },
                     { text: $("#LocationName").text(), bold: true, fontSize: 12 },
                     { text: $("#StreetAddress").text() },
                     { text: $("#APT").text() },
                     { text: $("#LCity").text() },
                     { text: $("#LState").text() },
                     { text: $("#LZipCode").text() },
                 ]
             }],
             [{
                 columns: [
                     { width: "*", text: "Order Total:", style: "titleDetail" },
                     { width: "auto", text: $("#TotalAmount").text(), alignment: 'right', style: "titleDetail" }
                 ]
             }]
        ];
        var pdf = pdfMake.createPdf({
            pageSize: "A4",
            pageOrientation: "portrait",
            content: [
                 {
                     table: {
                         widths: ["*"],
                         body: tableDetail
                     },
                 },
                {
                    margin: [0, 20, 0, 0],
                    table: {
                        widths: ["*", "auto", "auto", "auto", "auto"],
                        headerRows: 1,
                        body: rows
                    },
                }
            ],
            styles: {
                tableHeader: {
                    bold: true,
                    fontSize: 11,
                    color: 'white',
                    fillColor: '#2d4154',
                    alignment: 'center'
                },
                tableBodyEven: {},
                tableBodyOdd: {
                    fillColor: '#f3f3f3'
                },
                tableFooter: {
                    bold: true,
                    fontSize: 11,
                    color: 'white',
                    fillColor: '#2d4154'
                },
                title: {
                    alignment: 'center',
                    fontSize: 15
                },
                titleDetail: {
                    bold: true,
                    fontSize: 15
                }
            },
            defaultStyle: {
                fontSize: 10
            }
        });
        return pdf;
    } else {
        console.log("Chưa khai báo plugin pdfMake")
    }
}
$(function () {
    $.fn.extend({
        AddRowProductTransfer: function (item) {
            if ($(this).is("table")) {
                var html = '<tr ProductID="' + item.ProductID + '">'
                           + '<td style="width:30%">' + item.ProductName + '</td>'
                           + '<td style="width:15%"><input type="number" readonly="true" placeholder="0" name="AvailableQuantity" class="form-control" value="' + item.AvailableQuantity + '" /></td>'
                           + '<td style="width:15%"><input type="number" min="0" max="' + item.AvailableQuantity + '" placeholder="0" name="Quantity" class="form-control" value="' + item.Quantity + '" /></td>'
                           + '<td style="width:20%"><div class="input-group-prepend"><span class="input-group-text" id="input_group_text">' + Window.CurrencySymbol + '</span><input type="number" readonly="true" placeholder="' + $.number(0, Window.NumberDecimal, '.', ',') + '" name="SupplyPrice" class="form-control" value="' + item.SupplyPrice + '"/></td>'
                           + '<td style="width:25%"><div class="input-group-prepend"><span class="input-group-text" id="input_group_text">' + Window.CurrencySymbol + '</span><input name="TotalCost" class="form-control" type="text" readonly="true" value="' + $.number(item.TotalCost, Window.NumberDecimal, '.', ',') + '"/></td>'
                           + '<td style="text-align:center"><button type="button" id="btnDeleteRowProduct" name="btnDeleteRowProduct" class="close" aria-label="Close"><span aria-hidden="true">×</span></button></td>'
                           + '</tr>';
                $(this).find("tbody").append(html);
                $(this).find("tbody tr:last input[name='SupplyPrice']").InStallInputMarsk(Window.NumberDecimal, "", false);
            } else {
                console.log("Đối tượng không hợp lệ");
            }
        },
        AddRowProductView: function (item, showReceivedQuantity) {
            if ($(this).is("table")) {
                var html = '<tr ProductID="' + item.ProductID + '">'
                           + '<td style="width:30%">' + item.ProductName + '</td>'
                           + '<td style="width:15%; text-align:center">' + $.number(item.Quantity, 0, '.', ',') + '</td>'
                           + (showReceivedQuantity == false ? '' : '<td style="width:15%; text-align:center">' + $.number(item.ReceivedQuantity, 0, '.', ',') + '</td>')
                           + '<td style="width:20%; text-align:right">' + Window.CurrencySymbol + $.number(item.SupplyPrice, Window.NumberDecimal, '.', ',') + '</td>'
                           + '<td style="width:20%; text-align:right">' + Window.CurrencySymbol + $.number(item.TotalCost, Window.NumberDecimal, '.', ',') + '</td>'
                           + '</tr>';
                $(this).find("tbody").append(html);
                $(this).find("tbody tr:last input[name='SupplyPrice']").InStallInputMarsk(Window.NumberDecimal, "", false);
            } else {
                console.log("Đối tượng không hợp lệ");
            }
        },
        AddRowProductEdit: function (item) {
            if ($(this).is("table")) {
                var html = '<tr ProductID="' + item.ProductID + '" OrderProductID = "' + item.OrderProductID + '">'
                           + '<td style="width:30%">' + item.ProductName + '</td>'
                           + '<td style="width:15%"><input type="text" readonly="true" placeholder="0" name="Quantity" class="form-control" value="' + $.number(item.Quantity, 0, '.', ',') + '" /></td>'
                           + '<td style="width:15%"><input type="number" min="0" placeholder="0" name="ReceivedQuantity" class="form-control" value="' + item.Quantity + '" /></td>'
                           + '<td style="width:20%"><div class="input-group-prepend"><span class="input-group-text" id="input_group_text">' + Window.CurrencySymbol + '</span><input type="number" readonly="true" placeholder="' + $.number(0, Window.NumberDecimal, '.', ',') + '" name="SupplyPrice" class="form-control" value="' + $.number(item.SupplyPrice, Window.NumberDecimal, '.', ',') + '"/></td>'
                           + '<td style="width:25%"><div class="input-group-prepend"><span class="input-group-text" id="input_group_text">' + Window.CurrencySymbol + '</span><input name="TotalCost" class="form-control" type="text" readonly="true" value="' + $.number(item.TotalCost, Window.NumberDecimal, '.', ',') + '"/></td>'
                           + '</tr>';
                $(this).find("tbody").append(html);
                $(this).find("tbody tr:last input[name='SupplyPrice']").InStallInputMarsk(Window.NumberDecimal, "", false);
            } else {
                console.log("Đối tượng không hợp lệ");
            }
        }
    })
    //#region Load data && setup control
    $('#actionModalMainTransfer').modal({
        backdrop: false,
        show: false,
    })
    $('#actionModalMainTransfer').on('hidden.bs.modal', function (e) {
        $("body").find(".modal-backdrop").remove();
    })
    $('#actionModalMainTransfer').on('shown.bs.modal', function (e) {
        $("body").append('<div class="modal-backdrop fade show"></div>');
    })
    $('#actionModalSendEmail').modal({
        backdrop: false,
        show: false,
    })
    $('#actionModalSendEmail').on('hidden.bs.modal', function (e) {
        $("body").find(".modal-backdrop").remove();
    })
    $('#actionModalSendEmail').on('shown.bs.modal', function (e) {
        $("body").append('<div class="modal-backdrop fade show"></div>');
    })
    $('#actionFormSendEmail').validate({
        rules: {
            ToEmail: {
                required: true,
                email: true
            },
            FromEmail: {
                required: true,
                email: true
            },
            EmailSubject: 'required',
            EmailContent: 'required',
        },
        messages: {
            ToEmail: 'Recipient Email Address must be filled',
            FromEmail: 'Sender Email Address must be filled',
            EmailSubject: 'Message Subject must be filled',
            EmailContent: 'Message Content must be filled',
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
    $('#modalAddProductTransfer').find(".modal-content").css("height", height);
    $('#modalAddProductTransfer').find(".modal-content").css("width", width);
    var loadCategoryTransfer = function () {
        step = '1';
        CategoryID = 0;
        $('#modalAddProductTransfer').find(".prevModalWizard").html('');
        $("#modalAddProductTransfer #txtSearch").val('');
        $("#modalAddProductTransfer #TitleModalAddProduct").text("Select Product");
        $('#modalAddProductTransfer #divCategory').show();
        $('#modalAddProductTransfer #divProduct').hide();

        //get category
        $.RequestAjax("/Home/GetDataAllCategory", JSON.stringify({
        }), function (data) {
            var html = "";
            $("#modalAddProductTransfer #divCategory").html('');
            if (data.Result.length > 0) {
                $.each(data.Result, function () {
                    var element = $(htmlItemCategoryTemplate);
                    element.attr("id-item-modal", this.CategoryID);
                    element.attr("CategoryName", this.CategoryName);
                    element.attr("step", "1");
                    element.find("div:first strong").text(this.CategoryName);
                    element.find("div:last span").append(htmlIconNext);
                    html = element[0].outerHTML;
                    $("#modalAddProductTransfer #divCategory").append(html);
                })
            }
            var element = $(htmlItemCategoryTemplate);
            element.attr("id-item-modal", 0);
            element.attr("CategoryName", "No Category");
            element.attr("step", "1");
            element.find("div:first strong").text("No Category");
            element.find("div:last span").append(htmlIconNext);
            html = element[0].outerHTML;
            $("#modalAddProductTransfer #divCategory").append(html);
        }, function () {
        })
    }
    var searchProduct = function (CategoryID, LocationID, search) {
        $("#modalAddProductTransfer #divCategory").hide();
        $("#modalAddProductTransfer #divProduct").show();
        if (search.length == 1 || search.length == 2) {
            $("#modalAddProductTransfer #divProduct").html('<span style="display: flex; justify-content: center">Please put at least 3 characters.</span>');
        }
        else {
            $.RequestAjax("/Inventory/GetProductBaseCategoryAndLocation", JSON.stringify({
                "CategoryID": CategoryID,
                "LocationID": SourceLocationID,
                "Search": search
            }), function (data) {
                var html = "";
                $("#modalAddProductTransfer #divProduct").html('');
                if (data.Result.length > 0) {
                    $.each(data.Result, function () {
                        var htmlItemProduct = htmlItemProductTemplate.replace('ONHAND', this.OnHand + ' in stock at source');
                        htmlItemProduct = htmlItemProduct.replace('PRODUCTID', this.ProductID);
                        var avgcost = (this.OnHand == 0 || this.OnHandCost == 0) ? 0 : parseFloat(this.OnHandCost / this.OnHand).toFixed(Window.NumberDecimal);
                        htmlItemProduct = htmlItemProduct.replace('SUPPLYPRICE', avgcost == 0 ? '' : (Window.CurrencySymbol + $.number(avgcost, Window.NumberDecimal, '.', ',')));
                        var element = $(htmlItemProduct);
                        element.attr("id-item-modal", this.ProductID);
                        element.attr("step", "2");
                        element.find("div:first strong").text(this.ProductName);
                        element.attr("OnHand", this.OnHand);
                        element.attr("ProductName", this.ProductName);
                        element.attr("ReorderQty", this.ReorderQty);
                        element.attr("SupplyPrice", avgcost);
                        html = element[0].outerHTML;
                        $("#modalAddProductTransfer #divProduct").append(html);
                    })
                }
                else {
                    $("#modalAddProductTransfer #divProduct").html('<span style="display: flex;justify-content: center">Oops! No items found.</span>');
                }
            }, function () {
            })
        }
    }
    var calculateTotalAmountTransfer = function () {
        //debugger;
        var total = 0;
        $("#actionModalMainTransfer #tableAddProduct tbody tr").each(function () {
            total = total + parseFloat($(this).find("[name='TotalCost']").val().replace(/,/gi, '') == "" ? 0 : $(this).find("[name='TotalCost']").val().replace(/,/gi, ''));
        })
        $("#actionModalMainTransfer #TotalAmount").html(Window.CurrencySymbol + $.number(total, Window.NumberDecimal, '.', ','));
    }
    var calculateTotalAmountReceiveTransfer = function () {
        var total = 0;
        $("#actionModalMainTransfer #tableViewProduct tbody tr").each(function () {
            total = total + parseFloat($(this).find("[name='TotalCost']").val().replace(/,/gi, '') == "" ? 0 : $(this).find("[name='TotalCost']").val().replace(/,/gi, ''));
        })
        $("#actionModalMainTransfer #TotalAmount").html(Window.CurrencySymbol + $.number(total, Window.NumberDecimal, '.', ','));
    }
    var newOrderTransfer = function () {
        //load select supplier
        $("#actionModalMainTransfer #TitleModal").text("Select Source Location");
        $("#actionModalMainTransfer #OrderID").val(0);
        $("#actionModalMainTransfer #addTransferDetail").show();
        $("#actionModalMainTransfer #viewTransferDetail").hide();
        $("#actionModalMainTransfer #divSelectSourceLocation").show();
        $("#actionModalMainTransfer #divSelectLocation").hide();
        $("#actionModalMainTransfer #divTransfer").hide();
        $("#actionModalMainTransfer #divbtnCreateTransfer").show();
        $("#actionModalMainTransfer #divbtnReceiveStockTransfer").hide();
        $("#actionModalMainTransfer #divbtnCancelTransfer").hide();
        $("#actionModalMainTransfer #divbtnCloseTransfer").hide();
        $("#actionModalMainTransfer #divbtnConfirmReceiveTransfer").hide();

        $.RequestAjax("/Home/GetDataAllLocation", JSON.stringify({
        }), function (data) {
            var html = "";
            $("#actionModalMainTransfer #divSourceLocation").html('');
            if (data.Result.length > 0) {
                $.each(data.Result, function () {
                    var element = $(htmlItemSourceLocationTemplate);
                    element.attr("id-item-modal", this.LocationID);
                    element.attr("LocationName", this.LocationName);
                    element.attr("StreetAddress", this.StreetAddress == null ? '' : this.StreetAddress);
                    element.attr("APT", this.APT == null ? '' : this.APT);
                    element.attr("City", this.City == null ? '' : this.City);
                    element.attr("State", this.State == null ? '' : this.State);
                    element.attr("ZipCode", this.ZipCode == null ? '' : this.ZipCode);
                    element.attr("step", "1");
                    element.find("div:first strong").text(this.LocationName);
                    element.find("div:last span").append(htmlIconNext);
                    html = element[0].outerHTML;
                    $("#actionModalMainTransfer #divSourceLocation").append(html);
                })
            }
        }, function () {
        })

        $('#actionModalMainTransfer').modal("show");
    }
    var viewOrder = function (OrderID) {
        $.RequestAjax("/Inventory/GetOrderByOrderID", JSON.stringify({
            "OrderID": OrderID
        }), function (data1) {
            if (data1.Result != null) {
                data = data1.Result;
                $("#actionModalMainTransfer #divSelectSourceLocation").hide();
                $("#actionModalMainTransfer #divSelectLocation").hide();
                $("#actionModalMainTransfer #divTransfer").show();
                $("#actionModalMainTransfer #addTransferDetail").hide();
                $("#actionModalMainTransfer #viewTransferDetail").show();
                $("#actionModalMainTransfer #divbtnCreateTransfer").hide();
                $("#actionModalMainTransfer #divbtnReceiveStockTransfer").hide();
                $("#actionModalMainTransfer #divbtnCancelTransfer").hide();
                $("#actionModalMainTransfer #divbtnCloseTransfer").hide();
                $("#actionModalMainTransfer #divbtnConfirmReceiveTransfer").hide();
                TitleModal = Window.ResourcesEnum[data.OrderType] + ' ' + data.OrderNo;
                $("#actionModalMainTransfer #TitleModal").text(TitleModal);
                if (data.OrderStatus == 'order_status_ordered') {
                    $("#actionModalMainTransfer #OrderStatus").text('Stock Ordered');
                    $("#actionModalMainTransfer #OrderRemark").text('Ordered ' + moment(data.CreateDate).format(Window.FormatDateWithTimeJS) + ' at ' + data.LocationName + ' by ' + data.StaffNameCreate);
                    $("#actionModalMainTransfer #divbtnReceiveStockTransfer").show();
                    $("#actionModalMainTransfer #divbtnCancelTransfer").show();
                    $("#actionModalMainTransfer #btnEmailOrder").show();
                    $("#actionModalMainTransfer #btnDownloadPDFOrder").show();
                }
                else if (data.OrderStatus == 'order_status_received') {
                    $("#actionModalMainTransfer #OrderStatus").text('Stock Received');
                    $("#actionModalMainTransfer #OrderRemark").text('Received  ' + moment(data.ReceiveDate).format(Window.FormatDateWithTimeJS) + ' at ' + data.LocationName + ' by ' + data.StaffNameReceive);
                    $("#actionModalMainTransfer #divbtnCloseTransfer").show();
                    $("#actionModalMainTransfer #btnEmailOrder").hide();
                    $("#actionModalMainTransfer #btnDownloadPDFOrder").show();
                }
                else {
                    $("#actionModalMainTransfer #OrderStatus").text('Transfer Canceled');
                    $("#actionModalMainTransfer #OrderRemark").text('No stock received, transfer canceled on ' + moment(data.CancelDate).format(Window.FormatDateWithTimeJS) + ' at ' + data.LocationName + ' by ' + data.StaffNameCancel);
                    $("#actionModalMainTransfer #divbtnCloseTransfer").show();
                    $("#actionModalMainTransfer #btnEmailOrder").hide();
                    $("#actionModalMainTransfer #btnDownloadPDFOrder").hide();
                }

                $("#actionModalMainTransfer #OrderID").val(data.OrderID);
                $("#actionModalMainTransfer #TotalAmount").html(Window.CurrencySymbol + $.number(data.TotalCost, Window.NumberDecimal, '.', ','));
                //supplier
                $("#actionModalMainTransfer #SupplierName").text(data.FLocationName);
                $("#actionModalMainTransfer #Street").text(data.FStreetAddress);
                $("#actionModalMainTransfer #Suburb").text(data.FAPT);
                $("#actionModalMainTransfer #City").text(data.FCity);
                $("#actionModalMainTransfer #State").text(data.FState);
                $("#actionModalMainTransfer #ZipCode").text(data.FZipCode);
                //location
                LocationName = data.LocationName;
                $("#actionModalMainTransfer #LocationName").text(data.LocationName);
                $("#actionModalMainTransfer #StreetAddress").text(data.TStreetAddress);
                $("#actionModalMainTransfer #APT").text(data.TAPT);
                $("#actionModalMainTransfer #LCity").text(data.TCity);
                $("#actionModalMainTransfer #LState").text(data.TState);
                $("#actionModalMainTransfer #LZipCode").text(data.TZipCode);

                $("#actionModalMainTransfer #tableViewProduct tbody").html("");
                var showReceivedQuantity = data.OrderStatus == 'order_status_received' ? true : false;
                //hide col recevice qty
                if (showReceivedQuantity == false) {
                    $("#actionModalMainTransfer #tableViewProduct").find('tr :nth-child(' + (3) + ')').hide();
                }
                else {
                    $("#actionModalMainTransfer #tableViewProduct").find('tr :nth-child(' + (3) + ')').show();
                }
                $.RequestAjax("/Inventory/GetOrderDetailByOrderID", JSON.stringify({
                    "OrderID": data.OrderID
                }), function (data) {
                    if (data.Result.length > 0) {
                        $.each(data.Result, function () {
                            $("#actionModalMainTransfer #tableViewProduct").AddRowProductView(this, showReceivedQuantity);
                        })
                    }
                }, function () {
                })
                $('#actionModalMainTransfer').modal("show");
            }
        }, function () {
        })
    }
    var OrderID = $("#OrderID").val();
    if (OrderID != 0) {
        viewOrder(OrderID);
    }
    else {
        newOrderTransfer();
    }
    //#endregion

    //#region Event
    $(document).on("click", "#actionModalMainTransfer .item-modal-wizard", function () {
        if ($(this).attr("step") == "1") {
            $("#actionModalMainTransfer #TitleModal").text("Select Target Location");
            $("#actionModalMainTransfer #divSelectSourceLocation").hide();
            $("#actionModalMainTransfer #divSelectLocation").show();
            $("#actionModalMainTransfer #divTransfer").hide();
            SourceLocationID = $(this).attr("id-item-modal");

            $("#actionModalMainTransfer #SupplierName").text($(this).attr("LocationName"));
            $("#actionModalMainTransfer #Street").text($(this).attr("StreetAddress"));
            $("#actionModalMainTransfer #Suburb").text($(this).attr("APT"));
            $("#actionModalMainTransfer #City").text($(this).attr("City"));
            $("#actionModalMainTransfer #State").text($(this).attr("State"));
            $("#actionModalMainTransfer #ZipCode").text($(this).attr("ZipCode"));

            //load select location
            $.RequestAjax("/Home/GetDataAllLocation", JSON.stringify({
            }), function (data) {
                var html = "";
                $("#actionModalMainTransfer #divLocation").html('');
                if (data.Result.length > 0) {
                    $.each(data.Result, function () {
                        if (this.LocationID != SourceLocationID) {
                            var element = $(htmlItemLocationTemplate);
                            element.attr("id-item-modal", this.LocationID);
                            element.attr("LocationName", this.LocationName);
                            element.attr("StreetAddress", this.StreetAddress == null ? '' : this.StreetAddress);
                            element.attr("APT", this.APT == null ? '' : this.APT);
                            element.attr("City", this.City == null ? '' : this.City);
                            element.attr("State", this.State == null ? '' : this.State);
                            element.attr("ZipCode", this.ZipCode == null ? '' : this.ZipCode);
                            element.attr("step", "2");
                            element.find("div:first strong").text(this.LocationName);
                            element.find("div:last span").append(htmlIconNext);
                            html = element[0].outerHTML;
                            $("#actionModalMainTransfer #divLocation").append(html);
                        }
                    })
                }
            }, function () {
            })
        }
        else {
            $("#actionModalMainTransfer #TitleModal").text("Create Transfer");
            LocationID = $(this).attr("id-item-modal");
            $("#actionModalMainTransfer #LocationName").text($(this).attr("LocationName"));
            $("#actionModalMainTransfer #StreetAddress").text($(this).attr("StreetAddress"));
            $("#actionModalMainTransfer #APT").text($(this).attr("APT"));
            $("#actionModalMainTransfer #LCity").text($(this).attr("City"));
            $("#actionModalMainTransfer #LState").text($(this).attr("State"));
            $("#actionModalMainTransfer #LZipCode").text($(this).attr("ZipCode"));

            $("#actionModalMainTransfer #divSelectSourceLocation").hide();
            $("#actionModalMainTransfer #divSelectLocation").hide();
            $("#actionModalMainTransfer #divTableData").hide();
            $("#actionModalMainTransfer #divTransfer").show();
            $("#actionModalMainTransfer #divNoDataProduct").show();

            document.getElementById("btnCreateTransfer").disabled = true;
            $("#actionModalMainTransfer #tableAddProduct tbody").html("");
            calculateTotalAmountTransfer();
        }
    });
    $("#actionModalMainTransfer #btnAddProduct").click(function () {
        loadCategoryTransfer();
        $('#modalAddProductTransfer').modal("show");
    });
    $(document).on("click", "#modalAddProductTransfer .item-modal-wizard", function () {
        if ($(this).attr("step") == "1") {
            $("#modalAddProductTransfer #TitleModalAddProduct").text($(this).attr("CategoryName"));
            $('#modalAddProductTransfer').find(".prevModalWizard").append(htmlIconPrev);
            CategoryID = $(this).attr("id-item-modal");
            //load select Product
            searchProduct(CategoryID, LocationID, '');
            step = '2';
        }
        else {
            //add product to order
            if ($(this).attr("OnHand") > 0) {
                var ProductID = $(this).attr("id-item-modal");
                $('#actionModalMainTransfer #divTableData').show();
                $('#actionModalMainTransfer #divNoDataProduct').show();

                var hasadd = false;
                $("#actionModalMainTransfer #tableAddProduct tbody tr").each(function () {
                    if (ProductID == $(this).attr("ProductID")) {
                        hasadd = true;
                    }
                })
                if (hasadd == false) {
                    $("#actionModalMainTransfer #tableAddProduct").AddRowProductTransfer({
                        ProductID: ProductID,
                        ProductName: $(this).attr("ProductName"),
                        AvailableQuantity: $(this).attr("OnHand"),
                        Quantity: $(this).attr("ReorderQty"),
                        SupplyPrice: $(this).attr("SupplyPrice"),
                        TotalCost: $(this).attr("ReorderQty") * $(this).attr("SupplyPrice")
                    });
                    calculateTotalAmountTransfer();
                    $('#modalAddProductTransfer').modal("hide");
                    document.getElementById("btnCreateTransfer").disabled = false;
                }
            }
        }
    });
    $(document).on("click", "#modalAddProductTransfer .prevModalWizard", function () {
        loadCategoryTransfer();
    })
    $("#modalAddProductTransfer #txtSearch").on("input", function (e) {
        txtSearch = $(this).val();
        if (txtSearch == '' && step == '1') {
            loadCategoryTransfer();
        }
        else {
            //load select Product
            searchProduct(CategoryID, LocationID, txtSearch);
        }

    })
    $(document).on("click", "#actionModalMainTransfer #tableAddProduct tbody tr button[name='btnDeleteRowProduct']", function (event) {
        $(this).closest("tr").remove();
        if ($("#modalAddProductTransfer #tableAddProduct tbody tr").length == 0) {
            document.getElementById("btnCreateOrder").disabled = true;
        }
        calculateTotalAmountTransfer();
    })
    $(document).on("change", "#actionModalMainTransfer #tableAddProduct tbody tr input[name='Quantity']", function (event) {
        //debugger;
        var Quantity = $(this).val();
        var SupplyPrice = $(this).closest("tr").find("[name='SupplyPrice']").val().replace(/,/gi, '') == "" ? 0 : $(this).closest("tr").find("[name='SupplyPrice']").val().replace(/,/gi, '');
        $(this).closest("tr").find("[name='TotalCost']").val($.number(Quantity * SupplyPrice, Window.NumberDecimal, '.', ','));
        calculateTotalAmountTransfer();
    })
    $(document).on("change", "#actionModalMainTransfer #tableAddProduct tbody tr input[name='SupplyPrice']", function (event) {
        var SupplyPrice = $(this).val().replace(/,/gi, '');
        var Quantity = $(this).closest("tr").find("[name='Quantity']").val().replace(/,/gi, '') == "" ? 0 : $(this).closest("tr").find("[name='Quantity']").val().replace(/,/gi, '');
        $(this).closest("tr").find("[name='TotalCost']").val($.number(Quantity * SupplyPrice, Window.NumberDecimal, '.', ','));
        calculateTotalAmountTransfer();
    })
    $(document).on("change", "#actionModalMainTransfer #tableViewProduct tbody tr input[name='ReceivedQuantity']", function (event) {
        var ReceivedQuantity = $(this).val();
        var SupplyPrice = $(this).closest("tr").find("[name='SupplyPrice']").val().replace(/,/gi, '') == "" ? 0 : $(this).closest("tr").find("[name='SupplyPrice']").val().replace(/,/gi, '');
        $(this).closest("tr").find("[name='TotalCost']").val($.number(ReceivedQuantity * SupplyPrice, Window.NumberDecimal, '.', ','));
        calculateTotalAmountReceiveTransfer();
    })
    $("#actionModalMainTransfer #btnCreateTransfer").click(function () {
        var error = "";
        $("#actionModalMainTransfer #tableAddProduct tbody tr").each(function () {
            var Quantity = parseFloat($(this).closest("tr").find("[name='Quantity']").val().replace(/,/gi, '') == "" ? 0 : $(this).closest("tr").find("[name='Quantity']").val().replace(/,/gi, ''));
            var AvailableQuantity = parseFloat($(this).closest("tr").find("[name='AvailableQuantity']").val().replace(/,/gi, '') == "" ? 0 : $(this).closest("tr").find("[name='AvailableQuantity']").val().replace(/,/gi, ''));
            if (Quantity == 0) {
                error = "All quantities must be greater than 0";
            }
            else if (Quantity > AvailableQuantity) {
                error = "Such quantity isn't available at the source location";
            }

        })
        if (error != "") {
            toastr["error"](error, "Notification");
        }
        else {
            var totalcost = 0;
            var OrderProducts = [];
            $("#actionModalMainTransfer #tableAddProduct tbody tr").each(function () {
                totalcost = totalcost + parseFloat($(this).find("[name='TotalCost']").val().replace(/,/gi, '') == "" ? 0 : $(this).find("[name='TotalCost']").val().replace(/,/gi, ''));
                OrderProducts.push({
                    ProductID: $(this).attr("ProductID"),
                    Quantity: $(this).find("[name='Quantity']").val(),
                    ReceivedQuantity: 0,
                    SupplyPrice: $(this).find("[name='SupplyPrice']").val().replace(/,/gi, ''),
                    TotalCost: $(this).find("[name='TotalCost']").val().replace(/,/gi, ''),
                })
            })

            var entity = new Object();
            entity["OrderType"] = "order_type_transfer";
            entity["LocationID"] = LocationID;
            entity["FromLocationID"] = SourceLocationID;
            entity["OrderStatus"] = "order_status_ordered";
            entity["TotalCost"] = totalcost;

            $.RequestAjax("/Inventory/SaveOrder", JSON.stringify({
                entity: entity,
                OrderProducts: OrderProducts,
                isUpdate: $("#actionModalMainTransfer #OrderID").val() != 0
            }), function (data) {
                if (!JSON.parse(data.Result)) {
                    toastr["error"](data.ErrorMessage, "Error");
                } else {
                    toastr["success"](data.ErrorMessage, "Notification");
                    $("#actionModalMainTransfer #OrderID").val(data.OrderID);
                    viewOrder(data.OrderID);
                }
            })
        }
    });
    $("#actionModalMainTransfer #btnCancelTransfer").click(function () {
        PNotify.notice({
            title: 'Cancel Transfer',
            text: 'Are you sure you want to cancel this transfer? This action is permanent and cannot be undone.',
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
                        text: 'CANCEL TRANSFER',
                        primary: true,
                        click: function (notice) {
                            $.RequestAjax("/Inventory/CancelOrder", JSON.stringify({
                                OrderID: $("#actionModalMainTransfer #OrderID").val()
                            }), function (data) {
                                if (!JSON.parse(data.Result)) {
                                    toastr["error"](data.ErrorMessage, "Error");
                                }
                                else {
                                    viewOrder($("#actionModalMainTransfer #OrderID").val());
                                }
                            }, function () {
                                notice.close();
                            })
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
    })
    $("#actionModalMainTransfer #btnReceiveStockTransfer").click(function () {
        $("#actionModalMainTransfer #TitleModal").text('Receive ' + $("#actionModalMainTransfer #TitleModal").text());
        $("#actionModalMainTransfer #OrderStatus").text('');
        $("#actionModalMainTransfer #OrderRemark").text('');
        $("#actionModalMainTransfer #divbtnConfirmReceiveTransfer").show();
        $("#actionModalMainTransfer #divbtnReceiveStockTransfer").hide();
        $("#actionModalMainTransfer #divbtnCloseTransfer").hide();
        $("#actionModalMainTransfer #divbtnCancelTransfer").hide();
        $("#actionModalMainTransfer #tableViewProduct tbody").html("");
        $("#actionModalMainTransfer #tableViewProduct").find('tr :nth-child(' + (3) + ')').toggle();
        $.RequestAjax("/Inventory/GetOrderDetailByOrderID", JSON.stringify({
            "OrderID": $("#actionModalMainTransfer #OrderID").val()
        }), function (data) {
            if (data.Result.length > 0) {
                $.each(data.Result, function () {
                    $("#actionModalMainTransfer #tableViewProduct").AddRowProductEdit(this);
                })
            }
        }, function () {
        })
    })
    $("#actionModalMainTransfer #btnCloseTransfer").click(function () {
        $('#actionModalMainTransfer').modal("hide");
        var PreLink = localStorage.getItem("PreLink");
        localStorage.setItem("PreLink", '');
        if (PreLink != null && PreLink != '') {
            window.location = PreLink;
        }
        else {
            window.location = "/Inventory/Orders";
        }
    })
    $("#actionModalMainTransfer #btnConfirmReceiveTransfer").click(function () {
        var OrderProducts = [];
        $("#actionModalMainTransfer #tableViewProduct tbody tr").each(function () {
            OrderProducts.push({
                OrderProductID: $(this).attr("OrderProductID"),
                OrderID: $("#actionModalMainTransfer #OrderID").val(),
                ProductID: $(this).attr("ProductID"),
                Quantity: $(this).find("[name='Quantity']").val().replace(/,/gi, '') == "" ? "0" : $(this).find("[name='Quantity']").val().replace(/,/gi, ''),
                ReceivedQuantity: $(this).find("[name='ReceivedQuantity']").val().replace(/,/gi, '') == "" ? "0" : $(this).find("[name='ReceivedQuantity']").val().replace(/,/gi, ''),
                SupplyPrice: $(this).find("[name='SupplyPrice']").val().replace(/,/gi, ''),
                TotalCost: $(this).find("[name='TotalCost']").val().replace(/,/gi, ''),
            })
        })

        $.RequestAjax("/Inventory/ReceiveOrder", JSON.stringify({
            OrderID: $("#actionModalMainTransfer #OrderID").val(),
            OrderProducts: OrderProducts
        }), function (data) {
            if (!JSON.parse(data.Result)) {
                toastr["error"](data.ErrorMessage, "Error");
            } else {
                toastr["success"](data.ErrorMessage, "Notification");
                viewOrder($("#actionModalMainTransfer #OrderID").val());
            }
        })
    });
    $("#actionModalMainTransfer #btnCloseModal").click(function () {
        var PreLink = localStorage.getItem("PreLink");
        localStorage.setItem("PreLink", '');
        if (PreLink != null && PreLink != '') {
            window.location = PreLink;
        }
        else {
            window.location = "/Inventory/Orders";
        }
    })
    $("#actionModalMainTransfer #btnEmailOrder").click(function () {
        $("#actionModalSendEmail #TitleModalSendEmail").text('Send ' + TitleModal);
        $("#actionModalSendEmail #FromEmail").val(Window.BusinessEmail);
        $("#actionModalSendEmail #EmailSubject").val(TitleModal + ' from ' + LocationName);
        $("#actionModalSendEmail #EmailContent").val("Hi \nPlease see attached transfer order\nHave a great day!\n");
        $("#actionModalSendEmail").modal("show");
    })
    $("#actionModalSendEmail #btnSendEmail").click(function () {
        if ($("#actionFormSendEmail").valid()) {
            pdfGeneral().getBuffer(function (buffer) {
                var blob = new Blob([buffer], { type: "application/octet-stream" });
                var formData = new FormData();
                formData.append($("#OrderID").val() + ".pdf", blob);
                $.ajax({
                    url: "/Home/SavePDF",
                    type: 'post',
                    contentType: false,
                    processData: false,
                    data: formData,
                    async: true,
                    cache: false,
                    success: function (data) {
                        var entity = {
                            SendFrom: $("#actionFormSendEmail #FromEmail").val(),
                            Destination: $("#actionFormSendEmail #ToEmail").val(),
                            MessageSubject: $("#actionFormSendEmail #EmailSubject").val(),
                            MessageBody: $("#actionFormSendEmail #EmailContent").val() + '<a href = "http://@LinkFile/Files/' + $("#OrderID").val() + '.pdf">Download PDF</a>',
                        }
                        $.RequestAjax("/Messages/SendMessage", JSON.stringify({
                            entity: entity
                        }), function (data) {
                            if (!JSON.parse(data.Result)) {
                                toastr["error"](data.ErrorMessage, "Error");
                            } else {
                                $("#actionModalSendEmail").modal("hide");
                            }
                        })
                    }
                })
            });
        }
    })
    $("#btnDownloadPDFOrder").click(function () {
        pdfGeneral().open();
    })
    //#endregion
})
