var htmlItemSupplierTemplate = '<div class="col-12 item-modal-wizard" step = "" SupplierName="" Street="" Suburb="" City="" State="" ZipCode=""><div class="col-6"><div class="col-12"> <strong></strong></div></div><div class="col-6 text-right"><span></span></div></div>'
var htmlItemLocationTemplate = '<div class="col-12 item-modal-wizard" step = "" LocationName="" StreetAddress="" APT="" City="" State="" ZipCode=""><div class="col-6"><div class="col-12"> <strong></strong></div></div><div class="col-6 text-right"><span></span></div></div>'
var htmlItemCategoryTemplate = '<div class="col-12 item-modal-wizard" step = "" CategoryName=""><div class="col-6"><div class="col-12"> <strong></strong></div></div><div class="col-6 text-right"><span></span></div></div>'
var htmlItemProductTemplate = '<div class="col-12 item-modal-wizard" step = "" ProductName="" ReorderQty="" SupplyPrice=""><div class="col-6"><div class="col-12"> <strong></strong></div><div class="col-12">ONHAND</div></div><div class="col-6 text-right">SUPPLYPRICE<span></span></div></div>'
var htmlIconNext = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">'
                + '<path d="M6.187 16.9c-.25.253-.25.66 0 .91.248.253.652.253.9 0l7.285-7.355c.25-.25.25-.66 0-.91L7.088 2.19c-.25-.253-.652-.253-.9 0-.25.25-.25.658-.002.91L12.83 10l-6.643 6.9z"></path>'
                + '</svg>'
var htmlIconPrev = '<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">'
                    + '<path d="M8.80367158,16.7638261 C9.06544281,17.0467987 9.06544281,17.5049548 8.80367158,17.7879275 C8.54229164,18.0704815 8.11774488,18.0709001 7.85597365,17.7879275 L0.196328421,9.51223382 C-0.0654428068,9.22926119 -0.0654428068,8.77068646 0.196328421,8.48771383 L7.85577801,0.212229473 C8.11754924,-0.0707431577 8.54170471,-0.0707431577 8.80347594,0.212229473 C9.06524716,0.495202104 9.06524716,0.953567534 8.80406287,1.23633087 L1.81841007,9.00007847 L8.80367158,16.7638261 Z"></path>'
                    + '</svg>'
//#endregion
var LocationID;
var SupplierID;
var CategoryID = 0;
var step = '1';
var TitleModal;
var LocationName;
var urlGetDataAllCategory = "/Home/GetDataAllCategory";
var urlGetDataAllLocation = "/Home/GetDataAllLocation";
var urlGetProductBaseCategoryAndLocation = "/Inventory/GetProductBaseCategoryAndLocation";
var width = $(document).width() <= "768" ? $(document).width() : $(document).width() / 3;
var height = $(document).width() <= "768" ? $(document).height() : $(document).height() - 60;
var pdfGeneral = function () {
    if (typeof pdfMake != undefined) {
        var rows = [];
        rows.push($.map(["PRODUCT", "ORDER QTY", "SUPPLY PRICE", "TOTAL COST"], function (d) {
            return {
                text: typeof d === 'string' ? d : d + '',
                style: 'tableHeader'
            };
        }));
        $("#tableViewProduct tbody tr").each(function (index, row) {
            var td = $(row).find("td");
            rows.push($.map([$(td[0]).text(), $(td[1]).text(), $(td[2]).text(), $(td[3]).text()], function (d) {
                return {
                    text: typeof d === 'string' ? d : d + '',
                    style: index % 2 ? 'tableBodyEven' : 'tableBodyOdd'
                };
            }));
        });
        var tableDetail = [
             [{ text: $("#SupplierName").text(), style: "titleDetail", alignment: 'center' }],
             [{
                 stack: [
                     { text: "DELIVER TO", bold: true, fontSize: 13 },
                     { text: $("#LocationName").text(), bold: true, fontSize: 12 },
                     { text: $("#StreetAddress").text() },
                     { text: $("#LCity").text() },
                     { text: $("#LState").text() },
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
                        widths: ["*", "auto", "auto", "auto"],
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
    //#region Load data && setup control
    $.fn.extend({
        AddRowProduct: function (item) {
            if ($(this).is("table")) {
                var html = '<tr ProductID="' + item.ProductID + '">'
                           + '<td style="width:35%">' + item.ProductName + '</td>'
                           + '<td style="width:15%"><input type="number" min="0" placeholder="0" name="Quantity" class="form-control" value="' + item.Quantity + '" /></td>'
                           + '<td style="width:20%"><div class="input-group-prepend"><span class="input-group-text" id="input_group_text">' + Window.CurrencySymbol + '</span><input type="number" min="0" placeholder="' + $.number(0, Window.NumberDecimal, '.', ',') + '" name="SupplyPrice" class="form-control" value="' + item.SupplyPrice + '"/></td>'
                           + '<td style="width:20%"><div class="input-group-prepend"><span class="input-group-text" id="input_group_text">' + Window.CurrencySymbol + '</span><input name="TotalCost" class="form-control" type="text" readonly="true" value="' + item.TotalCost + '"/></td>'
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
                           + '<td style="width:25%">' + item.ProductName + '</td>'
                           + '<td style="width:15%"><input type="text" readonly="true" placeholder="0" name="Quantity" class="form-control" value="' + $.number(item.Quantity, 0, '.', ',') + '" /></td>'
                           + '<td style="width:15%"><input type="number" min="0" placeholder="0" name="ReceivedQuantity" class="form-control" value="' + item.Quantity + '" /></td>'
                           + '<td style="width:20%"><div class="input-group-prepend"><span class="input-group-text" id="input_group_text">' + Window.CurrencySymbol + '</span><input type="text" readonly="true" placeholder="' + $.number(0, Window.NumberDecimal, '.', ',') + '" name="SupplyPrice" class="form-control" value="' + $.number(item.SupplyPrice, Window.NumberDecimal, '.', ',') + '"/></td>'
                           + '<td style="width:25%"><div class="input-group-prepend"><span class="input-group-text" id="input_group_text">' + Window.CurrencySymbol + '</span><input name="TotalCost" class="form-control" type="text" readonly="true" value="' + $.number(item.TotalCost, Window.NumberDecimal, '.', ',') + '"/></td>'
                           + '</tr>';
                $(this).find("tbody").append(html);
                $(this).find("tbody tr:last input[name='SupplyPrice']").InStallInputMarsk(Window.NumberDecimal, "", false);
            } else {
                console.log("Đối tượng không hợp lệ");
            }
        }
    })
    $('#actionModalMain').modal({
        backdrop: false,
        show: false,
    })
    $('#actionModalMain').on('hidden.bs.modal', function (e) {
        $("body").find(".modal-backdrop").remove();
    })
    $('#actionModalMain').on('shown.bs.modal', function (e) {
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
    $('#modalAddProduct').find(".modal-content").css("height", height);
    $('#modalAddProduct').find(".modal-content").css("width", width);
    var loadCategory = function () {
        step = '1';
        CategoryID = 0;
        $('#modalAddProduct').find(".prevModalWizard").html('');
        $("#modalAddProduct #txtSearch").val('');
        $("#modalAddProduct #TitleModalAddProduct").text("Select Product");
        var divCategory = document.getElementById("divCategory");
        var divProduct = document.getElementById("divProduct");
        $("#modalAddProduct #divCategory").show();
        $("#modalAddProduct #divProduct").hide();
        //get category
        $.RequestAjax(urlGetDataAllCategory, JSON.stringify({
        }), function (data) {
            var html = "";
            $("#modalAddProduct #divCategory").html('');
            if (data.Result.length > 0) {
                $.each(data.Result, function () {
                    var element = $(htmlItemCategoryTemplate);
                    element.attr("id-item-modal", this.CategoryID);
                    element.attr("CategoryName", this.CategoryName);
                    element.attr("step", "1");
                    element.find("div:first strong").text(this.CategoryName);
                    element.find("div:last span").append(htmlIconNext);
                    html = element[0].outerHTML;
                    $("#modalAddProduct #divCategory").append(html);
                })
            }
            var element = $(htmlItemCategoryTemplate);
            element.attr("id-item-modal", 0);
            element.attr("CategoryName", "No Category");
            element.attr("step", "1");
            element.find("div:first strong").text("No Category");
            element.find("div:last span").append(htmlIconNext);
            html = element[0].outerHTML;
            $("#modalAddProduct #divCategory").append(html);
        }, function () {
        })
    }
    var searchProduct = function (CategoryID, LocationID, search) {
        $("#modalAddProduct #divCategory").hide();
        $("#modalAddProduct #divProduct").show();
        if (search.length == 1 || search.length == 2) {
            $("#modalAddProduct #divProduct").html('<span style="display: flex; justify-content: center">Please put at least 3 characters.</span>');
        }
        else {
            $.RequestAjax(urlGetProductBaseCategoryAndLocation, JSON.stringify({
                "CategoryID": CategoryID,
                "LocationID": LocationID,
                "Search": search
            }), function (data) {
                var html = "";
                $("#modalAddProduct #divProduct").html('');
                if (data.Result.length > 0) {
                    $.each(data.Result, function () {
                        var htmlItemProduct = htmlItemProductTemplate.replace('ONHAND', this.OnHand + ' in stock');
                        htmlItemProduct = htmlItemProduct.replace('PRODUCTID', this.ProductID);
                        htmlItemProduct = htmlItemProduct.replace('SUPPLYPRICE', this.SupplyPrice == 0 ? '' : (Window.CurrencySymbol + $.number(this.SupplyPrice, Window.NumberDecimal, '.', ',')));
                        var element = $(htmlItemProduct);
                        element.attr("id-item-modal", this.ProductID);
                        element.attr("step", "2");
                        element.find("div:first strong").text(this.ProductName);
                        element.attr("ProductName", this.ProductName);
                        element.attr("ReorderQty", this.ReorderQty);
                        element.attr("SupplyPrice", this.SupplyPrice);
                        html = element[0].outerHTML;
                        $("#modalAddProduct #divProduct").append(html);
                    })
                }
                else {
                    $("#modalAddProduct #divProduct").html('<span style="display: flex;justify-content: center">Oops! No items found.</span>');
                }
            }, function () {
            })
        }
    }
    var calculateTotalAmount = function () {
        var total = 0;
        $("#actionModalMain #tableAddProduct tbody tr").each(function () {
            total = total + parseFloat($(this).find("[name='TotalCost']").val().replace(/,/gi, '') == "" ? 0 : $(this).find("[name='TotalCost']").val().replace(/,/gi, ''));
        })
        $("#actionModalMain #TotalAmount").html(Window.CurrencySymbol + $.number(total, Window.NumberDecimal, '.', ','));
    }
    var calculateTotalAmountReceive = function () {
        var total = 0;
        $("#actionModalMain #tableViewProduct tbody tr").each(function () {
            total = total + parseFloat($(this).find("[name='TotalCost']").val().replace(/,/gi, '') == "" ? 0 : $(this).find("[name='TotalCost']").val().replace(/,/gi, ''));
        })
        $("#actionModalMain #TotalAmount").html(Window.CurrencySymbol + $.number(total, Window.NumberDecimal, '.', ','));
    }
    var newOrder = function () {
        //load select supplier
        $("#actionModalMain #TitleModal").text("Select Supplier");
        $("#actionModalMain #OrderID").val(0);

        $("#actionModalMain #divSelectSupplier").show();
        $("#actionModalMain #divSelectLocation").hide();
        $("#actionModalMain #divOrder").hide();
        $("#actionModalMain #addOrderDetail").show();
        $("#actionModalMain #viewOrderDetail").hide();
        $("#actionModalMain #divbtnCreateOrder").show();
        $("#actionModalMain #divbtnReceiveStock").hide();
        $("#actionModalMain #divbtnCancelOrder").hide();
        $("#actionModalMain #divbtnCloseOrder").hide();
        $("#actionModalMain #divbtnConfirmReceive").hide();

        $.RequestAjax("/Home/GetDataAllSupplier", JSON.stringify({
        }), function (data) {
            var html = "";
            $("#actionModalMain #divSupplier").html('');
            if (data.Result.length > 0) {
                $("#actionModalMain #titleSupplier").show();
                $.each(data.Result, function () {
                    var element = $(htmlItemSupplierTemplate);
                    element.attr("id-item-modal", this.SupplierID);
                    element.attr("SupplierName", this.SupplierName);
                    element.attr("Street", this.Street == null ? '' : this.Street);
                    element.attr("Suburb", this.Suburb == null ? '' : this.Suburb);
                    element.attr("City", this.City == null ? '' : this.City);
                    element.attr("State", this.State == null ? '' : this.State);
                    element.attr("ZipCode", this.ZipCode == null ? '' : this.ZipCode);
                    element.attr("step", "1");
                    element.find("div:first strong").text(this.SupplierName);
                    element.find("div:last span").append(htmlIconNext);
                    html = element[0].outerHTML;
                    $("#actionModalMain #divSupplier").append(html);
                })
            }
            else {
                $("#actionModalMain #titleSupplier").hide();
                $("#actionModalMain #divSupplier").html('<div style="display: flex;justify-content: center" class="col-md-12"><h3>No Suppliers Found<h3></div><div style="display: flex;justify-content: center" class="col-md-12">Setup your suppliers before creating purchase orders.</div>');
            }
        }, function () {
        })

        $('#actionModalMain').modal("show");
    }
    var viewOrder = function (OrderID) {
        $.RequestAjax("/Inventory/GetOrderByOrderID", JSON.stringify({
            "OrderID": OrderID
        }), function (data1) {
            if (data1.Result != null) {
                data = data1.Result;
                $("#actionModalMain #divSelectSupplier").hide();
                $("#actionModalMain #divSelectLocation").hide();
                $("#actionModalMain #divOrder").show();
                $("#actionModalMain #addOrderDetail").hide();
                $("#actionModalMain #viewOrderDetail").show();
                $("#actionModalMain #divbtnCreateOrder").hide();
                $("#actionModalMain #divbtnReceiveStock").hide();
                $("#actionModalMain #divbtnCancelOrder").hide();
                $("#actionModalMain #divbtnCloseOrder").hide();
                $("#actionModalMain #divbtnConfirmReceive").hide();
                TitleModal = Window.ResourcesEnum[data.OrderType] + ' ' + data.OrderNo;
                $("#actionModalMain #TitleModal").text(TitleModal);
                if (data.OrderStatus == 'order_status_ordered') {
                    $("#actionModalMain #OrderStatus").text('Stock Ordered');
                    $("#actionModalMain #OrderRemark").text('Ordered ' + moment(data.CreateDate).format(Window.FormatDateWithTimeJS) + ' at ' + data.LocationName + ' by ' + data.StaffNameCreate);
                    $("#actionModalMain #divbtnReceiveStock").show();
                    $("#actionModalMain #divbtnCancelOrder").show();
                    $("#actionModalMain #btnEmailOrder").show();
                    $("#actionModalMain #btnDownloadPDFOrder").show();
                }
                else if (data.OrderStatus == 'order_status_received') {
                    $("#actionModalMain #OrderStatus").text('Stock Received');
                    $("#actionModalMain #OrderRemark").text('Received  ' + moment(data.ReceiveDate).format(Window.FormatDateWithTimeJS) + ' at ' + data.LocationName + ' by ' + data.StaffNameReceive);
                    $("#actionModalMain #divbtnCloseOrder").show();
                    $("#actionModalMain #btnEmailOrder").hide();
                    $("#actionModalMain #btnDownloadPDFOrder").show();
                }
                else {
                    $("#actionModalMain #OrderStatus").text('Order Canceled');
                    $("#actionModalMain #OrderRemark").text('No stock received, order canceled on ' + moment(data.CancelDate).format(Window.FormatDateWithTimeJS) + ' at ' + data.LocationName + ' by ' + data.StaffNameCancel);
                    $("#actionModalMain #divbtnCloseOrder").show();
                    $("#actionModalMain #btnEmailOrder").hide();
                    $("#actionModalMain #btnDownloadPDFOrder").hide();
                }

                $("#actionModalMain #OrderID").val(data.OrderID);
                $("#actionModalMain #TotalAmount").html(Window.CurrencySymbol + $.number(data.TotalCost, Window.NumberDecimal, '.', ','));
                //supplier
                $("#actionModalMain #SupplierName").text(data.SupplierName);
                $("#actionModalMain #Street").text(data.Street);
                $("#actionModalMain #Suburb").text(data.Suburb);
                $("#actionModalMain #City").text(data.City);
                $("#actionModalMain #State").text(data.State);
                $("#actionModalMain #ZipCode").text(data.ZipCode);
                //location
                LocationName = data.LocationName;
                $("#actionModalMain #LocationName").text(data.LocationName);
                $("#actionModalMain #StreetAddress").text(data.TStreetAddress);
                $("#actionModalMain #APT").text(data.TAPT);
                $("#actionModalMain #LCity").text(data.TCity);
                $("#actionModalMain #LState").text(data.TState);
                $("#actionModalMain #LZipCode").text(data.TZipCode);

                $("#actionModalMain #tableViewProduct tbody").html("");
                var showReceivedQuantity = data.OrderStatus == 'order_status_received' ? true : false;
                //hide col recevice qty
                if (showReceivedQuantity == false) {
                    $("#actionModalMain #tableViewProduct").find('tr :nth-child(' + (3) + ')').hide();
                }
                else {
                    $("#actionModalMain #tableViewProduct").find('tr :nth-child(' + (3) + ')').show();
                }
                $.RequestAjax("/Inventory/GetOrderDetailByOrderID", JSON.stringify({
                    "OrderID": data.OrderID
                }), function (data) {
                    if (data.Result.length > 0) {
                        $.each(data.Result, function () {
                            $("#actionModalMain #tableViewProduct").AddRowProductView(this, showReceivedQuantity);
                        })
                    }
                }, function () {
                })
                $('#actionModalMain').modal("show");
            }
        }, function () {
        })
    }
    var OrderID = $("#OrderID").val();
    if (OrderID != 0) {
        viewOrder(OrderID);
    }
    else {
        newOrder();
    }
    //#endregion

    //#region Event
    $(document).on("click", "#actionModalMain .item-modal-wizard", function () {
        var divOrder = document.getElementById("divOrder");
        if ($(this).attr("step") == "1") {
            $("#actionModalMain #TitleModal").text("Select Target Location");
            $("#actionModalMain #divSelectSupplier").hide();
            $("#actionModalMain #divSelectLocation").show();
            $("#actionModalMain #divOrder").hide();
            SupplierID = $(this).attr("id-item-modal");
            $("#actionModalMain #SupplierName").text($(this).attr("SupplierName"));
            $("#actionModalMain #Street").text($(this).attr("Street"));
            $("#actionModalMain #Suburb").text($(this).attr("Suburb"));
            $("#actionModalMain #City").text($(this).attr("City"));
            $("#actionModalMain #State").text($(this).attr("State"));
            $("#actionModalMain #ZipCode").text($(this).attr("ZipCode"));

            //load select location
            $.RequestAjax(urlGetDataAllLocation, JSON.stringify({
            }), function (data) {
                var html = "";
                $("#actionModalMain #divLocation").html('');
                if (data.Result.length > 0) {
                    $.each(data.Result, function () {
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
                        $("#actionModalMain #divLocation").append(html);
                    })
                }
            }, function () {
            })
        }
        else {
            $("#actionModalMain #TitleModal").text("Create Order");
            LocationID = $(this).attr("id-item-modal");
            $("#actionModalMain #LocationName").text($(this).attr("LocationName"));
            $("#actionModalMain #StreetAddress").text($(this).attr("StreetAddress"));
            $("#actionModalMain #APT").text($(this).attr("APT"));
            $("#actionModalMain #LCity").text($(this).attr("City"));
            $("#actionModalMain #LState").text($(this).attr("State"));
            $("#actionModalMain #LZipCode").text($(this).attr("ZipCode"));
            $("#actionModalMain #divSelectSupplier").hide();
            $("#actionModalMain #divSelectLocation").hide();
            $("#actionModalMain #divOrder").show();
            $("#actionModalMain #divTableData").hide();
            $("#actionModalMain #divNoDataProduct").show();
            document.getElementById("btnCreateOrder").disabled = true;
            $("#actionModalMain #tableAddProduct tbody").html("");
            calculateTotalAmount();
        }
    });
    $("#actionModalMain #btnAddProduct").click(function () {
        loadCategory();
        $('#modalAddProduct').modal("show");
    });
    $(document).on("click", "#modalAddProduct .item-modal-wizard", function () {
        if ($(this).attr("step") == "1") {
            $("#modalAddProduct #TitleModalAddProduct").text($(this).attr("CategoryName"));
            $('#modalAddProduct').find(".prevModalWizard").append(htmlIconPrev);
            CategoryID = $(this).attr("id-item-modal");
            //load select Product
            searchProduct(CategoryID, LocationID, '');
            step = '2';
        }
        else {
            //add product to order
            var ProductID = $(this).attr("id-item-modal");
            $("#actionModalMain #divTableData").show();
            $("#actionModalMain #divNoDataProduct").hide();
            $("#actionModalMain #tableAddProduct").AddRowProduct({
                ProductID: ProductID,
                ProductName: $(this).attr("ProductName"),
                Quantity: $(this).attr("ReorderQty"),
                SupplyPrice: $(this).attr("SupplyPrice"),
                TotalCost: $(this).attr("ReorderQty") * $(this).attr("SupplyPrice")
            });
            calculateTotalAmount();
            $('#modalAddProduct').modal("hide");
            document.getElementById("btnCreateOrder").disabled = false;
        }
    });
    $(document).on("click", "#modalAddProduct .prevModalWizard", function () {
        loadCategory();
    })
    $("#modalAddProduct #txtSearch").on("input", function (e) {
        txtSearch = $(this).val();
        if (txtSearch == '' && step == '1') {
            loadCategory();
        }
        else {
            //load select Product
            searchProduct(CategoryID, LocationID, txtSearch);
        }

    })
    $(document).on("click", "#actionModalMain #tableAddProduct tbody tr button[name='btnDeleteRowProduct']", function (event) {
        $(this).closest("tr").remove();
        if ($("#actionModalMain #tableAddProduct tbody tr").length == 0) {
            document.getElementById("btnCreateOrder").disabled = true;
        }
        calculateTotalAmount();
    })
    $(document).on("change", "#actionModalMain #tableAddProduct tbody tr input[name='Quantity']", function (event) {
        var Quantity = parseFloat($(this).val());
        var SupplyPrice = parseFloat($(this).closest("tr").find("[name='SupplyPrice']").val().replace(/,/gi, '') == "" ? 0 : $(this).closest("tr").find("[name='SupplyPrice']").val().replace(/,/gi, ''));
        $(this).closest("tr").find("[name='TotalCost']").val($.number(Quantity * SupplyPrice, Window.NumberDecimal, '.', ','));
        calculateTotalAmount();
    })
    $(document).on("change", "#actionModalMain #tableAddProduct tbody tr input[name='SupplyPrice']", function (event) {
        var SupplyPrice = $(this).val().replace(/,/gi, '');
        var Quantity = $(this).closest("tr").find("[name='Quantity']").val().replace(/,/gi, '') == "" ? 0 : $(this).closest("tr").find("[name='Quantity']").val().replace(/,/gi, '');
        $(this).closest("tr").find("[name='TotalCost']").val($.number(Quantity * SupplyPrice, Window.NumberDecimal, '.', ','));
        calculateTotalAmount();
    })
    $(document).on("change", "#actionModalMain #tableViewProduct tbody tr input[name='ReceivedQuantity']", function (event) {
        var ReceivedQuantity = $(this).val();
        var SupplyPrice = $(this).closest("tr").find("[name='SupplyPrice']").val().replace(/,/gi, '') == "" ? 0 : $(this).closest("tr").find("[name='SupplyPrice']").val().replace(/,/gi, '');
        $(this).closest("tr").find("[name='TotalCost']").val($.number(ReceivedQuantity * SupplyPrice, Window.NumberDecimal, '.', ','));
        calculateTotalAmountReceive();
    })
    $("#actionModalMain #btnCreateOrder").click(function () {
        var error = "";
        $("#actionModalMain #tableAddProduct tbody tr").each(function () {
            if (parseFloat($(this).closest("tr").find("[name='Quantity']").val().replace(/,/gi, '') == "" ? 0 : $(this).closest("tr").find("[name='Quantity']").val().replace(/,/gi, '')) == 0) {
                error = "All quantities must be greater than 0";
            }
        })
        if (error != "") {
            toastr["error"](error, "Notification");
        }
        else {
            var totalcost = 0;
            var OrderProducts = [];
            $("#actionModalMain #tableAddProduct tbody tr").each(function () {
                totalcost = totalcost + parseFloat($(this).find("[name='TotalCost']").val().replace(/,/gi, '') == "" ? 0 : $(this).find("[name='TotalCost']").val().replace(/,/gi, ''));
                OrderProducts.push({
                    ProductID: $(this).attr("ProductID"),
                    ItemName: $(this).find("[name='ItemName']").val(),
                    Quantity: $(this).find("[name='Quantity']").val(),
                    ReceivedQuantity: 0,
                    SupplyPrice: $(this).find("[name='SupplyPrice']").val().replace(/,/gi, ''),
                    TotalCost: $(this).find("[name='TotalCost']").val().replace(/,/gi, ''),
                })
            })

            var entity = new Object();
            entity["OrderType"] = "order_type_order";
            entity["LocationID"] = LocationID;
            entity["SupplierID"] = SupplierID;
            entity["OrderStatus"] = "order_status_ordered";
            entity["TotalCost"] = totalcost;

            $.RequestAjax("/Inventory/SaveOrder", JSON.stringify({
                entity: entity,
                OrderProducts: OrderProducts,
                isUpdate: $("#actionModalMain #OrderID").val() != 0
            }), function (data) {
                if (!JSON.parse(data.Result)) {
                    toastr["error"](data.ErrorMessage, "Error");
                } else {
                    toastr["success"](data.ErrorMessage, "Notification");
                    $("#actionModalMain #OrderID").val(data.OrderID);
                    viewOrder(data.OrderID);
                }
            })
        }
    });
    $("#actionModalMain #btnCancelOrder").click(function () {
        PNotify.notice({
            title: 'Cancel Order',
            text: 'Are you sure you want to cancel this order? This action is permanent and cannot be undone.',
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
                        text: 'CANCEL ORDER',
                        primary: true,
                        click: function (notice) {
                            $.RequestAjax("/Inventory/CancelOrder", JSON.stringify({
                                OrderID: $("#actionModalMain #OrderID").val()
                            }), function (data) {
                                if (!JSON.parse(data.Result)) {
                                    toastr["error"](data.ErrorMessage, "Error");
                                }
                                else {
                                    viewOrder($("#actionModalMain #OrderID").val());
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
    $("#actionModalMain #btnReceiveStock").click(function () {
        $("#actionModalMain #TitleModal").text('Receive ' + $("#actionModalMain #TitleModal").text());
        $("#actionModalMain #OrderStatus").text('');
        $("#actionModalMain #OrderRemark").text('');
        $("#actionModalMain #divbtnConfirmReceive").show();
        $("#actionModalMain #divbtnCloseOrder").hide();
        $("#actionModalMain #divbtnReceiveStock").hide();
        $("#actionModalMain #divbtnCancelOrder").hide();
        $("#actionModalMain #tableViewProduct tbody").html("");
        $("#actionModalMain #tableViewProduct").find('tr :nth-child(' + (3) + ')').toggle();
        $.RequestAjax("/Inventory/GetOrderDetailByOrderID", JSON.stringify({
            "OrderID": $("#actionModalMain #OrderID").val()
        }), function (data) {
            if (data.Result.length > 0) {
                $.each(data.Result, function () {
                    $("#actionModalMain #tableViewProduct").AddRowProductEdit(this);
                })
            }
        }, function () {
        })
    })
    $("#actionModalMain #btnCloseOrder").click(function () {
        var PreLink = localStorage.getItem("PreLink");
        localStorage.setItem("PreLink", '');
        $('#actionModalMain').modal("hide");
        if (PreLink != null && PreLink != '') {
            window.location = PreLink;
        }
        else {
            window.location = "/Inventory/Orders";
        }
    })
    $("#actionModalMain #btnConfirmReceive").click(function () {
        var OrderProducts = [];
        $("#actionModalMain #tableViewProduct tbody tr").each(function () {
            debugger;
            OrderProducts.push({
                OrderProductID: $(this).attr("OrderProductID"),
                OrderID: $("#actionModalMain #OrderID").val(),
                ProductID: $(this).attr("ProductID"),
                Quantity: $(this).find("[name='Quantity']").val().replace(/,/gi, '') == "" ? "0" : $(this).find("[name='Quantity']").val().replace(/,/gi, ''),
                ReceivedQuantity: $(this).find("[name='ReceivedQuantity']").val().replace(/,/gi, '') == "" ? "0" : $(this).find("[name='ReceivedQuantity']").val().replace(/,/gi, ''),
                SupplyPrice: $(this).find("[name='SupplyPrice']").val().replace(/,/gi, ''),
                TotalCost: $(this).find("[name='TotalCost']").val().replace(/,/gi, ''),
            })
        })

        $.RequestAjax("/Inventory/ReceiveOrder", JSON.stringify({
            OrderID: $("#actionModalMain #OrderID").val(),
            OrderProducts: OrderProducts
        }), function (data) {
            if (!JSON.parse(data.Result)) {
                toastr["error"](data.ErrorMessage, "Error");
            } else {
                toastr["success"](data.ErrorMessage, "Notification");
                viewOrder($("#actionModalMain #OrderID").val());
            }
        })
    });
    $("#actionModalMain #btnCloseModal").click(function () {
        var PreLink = localStorage.getItem("PreLink");
        localStorage.setItem("PreLink", '');
        if (PreLink != null && PreLink != '') {
            window.location = PreLink;
        }
        else {
            window.location = "/Inventory/Orders";
        }

    })
    $("#actionModalMain #btnEmailOrder").click(function () {
        $("#actionModalSendEmail #TitleModalSendEmail").text('Send ' + TitleModal);
        $("#actionModalSend Email #FromEmail").val(Window.BusinessEmail);
        $("#actionModalSendEmail #EmailSubject").val(TitleModal + ' from ' + LocationName);
        $("#actionModalSendEmail #EmailContent").val("Hi \nPlease see attached purchase order\nHave a great day!\n");
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