//#region Method Support
//#endregion
var table;
var tableStockLocation;
$(function () {
    //#region Load data && setup control
    CreateBreadcrumb([{ href: "/Inventory/Inventory", title: "Inventory" }, { href: "/Inventory/Products?id=0", title: "Products" }, { href: "", title: "View Product" }])
    var loadtable = function () {
        table = $("#tableStockHistory").InStallDatatable({
            ProductID: $("#ViewProductID").val()
        }, "/Inventory/GetDataTableStockHistory", [
            {
                "data": "TransactionTime", "name": "TransactionTime", "class": "text-left", "width": "15%", "render": function (data, type, row) {
                    return moment(row.TransactionTime).format(Window.FormatDateWithTimeJS);
                }
            },
     {
         "data": "FirstName", "name": "FirstName", "width": "15%", "class": "text-left", "render": function (data, type, row) {
             return (row.FirstName + ' ' + (row.LastName == null ? '' : row.LastName));
         }
     },
     {
         "data": "LocationName", "name": "LocationName", "width": "15%", "class": "text-left"
     },
     {
         "data": "Action", "name": "Action", "width": "10%", "class": "text-left", "render": function (data, type, row) {
             return row.OrderID != null ? ('<a href="/Inventory/ViewOrder?id=' + row.OrderID + '"><span name="viewOrder">' + (Window.ResourcesEnum[row.Action]) + ' ' + row.OrderNo + '</span></a>') : (row.InvoiceID != null ? ((Window.ResourcesEnum[row.Action]) + ' ' + row.OrderNo) : (Window.ResourcesEnum[row.Action]));
         }
     },
     {
         "data": "Adjustment", "name": "Adjustment", "width": "15%", "class": "text-right", "render": function (data, type, row) {
             return (data < 0 ? ($.number(data, 0, '.', ',')) : "+" + ($.number(data, 0, '.', ',')));
         }
     },
     {
         "data": "CostPrice", "name": "CostPrice", "width": "15%", "class": "text-right", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
         }
     },
     {
         "data": "OnHand", "name": "OnHand", "width": "15%", "class": "text-right", "render": function (data, type, row) {
             return ($.number(data, 0, '.', ','));
         }
     },
        ], true, true, false, false, null, true, null, function (setting) {
            var api = this.api();
            var x = document.getElementById("divNoData");
            var y = document.getElementById("divTable");
            if (api.rows().data().count() == 0) {
                x.style.display = 'block';
                y.style.display = 'none';
            }
            else {
                x.style.display = 'none';
                y.style.display = 'block';
            }
        }, null, null);

        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file-excel-o"></i>  Excel',
            extend: 'excelHtml5',
            isAutoWidth: false,
            isSTT: false,
            sheetName: "Stock movement log",
            title: null,
            filename: "product_stock_movement_log",
            ArrayColWidth: [25],
            exportOptions: {
                columns: [1],
                modifier: {
                    page: 'current'
                },
                orthogonal: "export",
                trim: false
            },
            methodCustomeAll: function (data, functions, rels, rowPos) {
                var arrayColWidth = [20, 20, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15];

                //#region fill data header
                rowPos = functions.AddRow(["Time & Date", "Product", "SKU", "Barcode", "Brand", "Category", "Supplier", "Location", "Staff", "Action", "Adjustment", "Cost Price", "Adjustment Cost", "On Hand", "On Hand Cost"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion
                //debugger;
                $.RequestAjax("/Inventory/GetAllStockMovement", JSON.stringify({
                    "ProductID": $("#ViewProductID").val(),
                }), function (data) {
                    if (data.data.length == 0) {
                    }
                    else {
                        //debugger;
                        $.each(data.data, function () {
                            var TransactionTime = moment(this.TransactionTime).format(Window.FormatDateWithTimeJS);
                            var ProductName = this.ProductName == null ? '' : this.ProductName.toString() + '';
                            var SKU = this.SKU == null ? '' : this.SKU.toString() + '';
                            var Barcode = this.Barcode == null ? '' : this.Barcode.toString() + '';
                            var BrandName = this.BrandName == null ? '' : this.BrandName;
                            var CategoryName = this.CategoryName == null ? '' : this.CategoryName;
                            var SupplierName = this.SupplierName == null ? '' : this.SupplierName;
                            var LocationName = this.LocationName == null ? '' : this.LocationName;
                            var Staff = this.FirstName + ' ' + (this.LastName == null ? '' : this.LastName);
                            var Action = Window.ResourcesEnum[this.Action] + (this.OrderNo == null ? '' : ' ' + this.OrderNo) + (this.InvoiceNo == null ? '' : ' ' + this.InvoiceNo);
                            var Adjustment = $.number(this.Adjustment, 0, '.', ',');
                            var CostPrice = $.number(this.CostPrice, Window.NumberDecimal, '.', ',');
                            var AdjustmentCost = $.number(this.AdjustmentCost, Window.NumberDecimal, '.', ',');
                            var OnHand = $.number(this.OnHand, 0, '.', ',');
                            var OnHandCost = $.number(this.OnHandCost, Window.NumberDecimal, '.', ',');
                            rowPos = functions.AddRow([TransactionTime, ProductName, SKU, Barcode, BrandName, CategoryName,
                                SupplierName, LocationName, Staff, Action, Adjustment, CostPrice, AdjustmentCost,
                                OnHand, OnHandCost], rowPos);
                        })
                    }
                }, function () {
                })
                // Set column widths
                var cols = functions.CreateCellPos(rels, 'cols');
                $('worksheet', rels).prepend(cols);

                for (var i = 0, ien = 15 ; i < ien ; i++) {
                    cols.appendChild(functions.CreateCellPos(rels, 'col', {
                        attr: {
                            min: i + 1,
                            max: i + 1,
                            width: arrayColWidth[i],
                            customWidth: 1,
                        }
                    }));
                }
            },
        }, '#buttonExcel');
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i>  CSV',
            filename: "product_stock_movement_log",
            customize: function (output, config) {
                output = 'Time & Date, Product, SKU, Barcode, Brand, Category, Supplier, Location, Staff, Action, Adjustment, Cost Price, Adjustment Cost, On Hand, On Hand Cost\n';

                $.RequestAjax("/Inventory/GetAllStockMovement", JSON.stringify({
                    "ProductID": $("#ViewProductID").val(),
                }), function (data) {
                    if (data.data.length == 0) {
                    }
                    else {
                        $.each(data.data, function () {
                            var TransactionTime = moment(this.TransactionTime).format(Window.FormatDateWithTimeJS);
                            var ProductName = this.ProductName == null ? '' : this.ProductName.toString() + '';
                            var SKU = this.SKU == null ? '' : this.SKU.toString() + '';
                            var Barcode = this.Barcode == null ? '' : this.Barcode.toString() + '';
                            var BrandName = this.BrandName == null ? '' : this.BrandName;
                            var CategoryName = this.CategoryName == null ? '' : this.CategoryName;
                            var SupplierName = this.SupplierName == null ? '' : this.SupplierName;
                            var LocationName = this.LocationName == null ? '' : this.LocationName;
                            var Staff = this.FirstName + ' ' + (this.LastName == null ? '' : this.LastName);
                            var Action = Window.ResourcesEnum[this.Action] + (this.OrderNo == null ? '' : ' ' + this.OrderNo) + (this.InvoiceNo == null ? '' : ' ' + this.InvoiceNo);
                            var Adjustment = $.number(this.Adjustment, 0, '.', ',');
                            var CostPrice = $.number(this.CostPrice, Window.NumberDecimal, '.', ',');
                            var AdjustmentCost = $.number(this.AdjustmentCost, Window.NumberDecimal, '.', ',');
                            var OnHand = $.number(this.OnHand, 0, '.', ',');
                            var OnHandCost = $.number(this.OnHandCost, Window.NumberDecimal, '.', ',');

                            output += '"' + TransactionTime + '",'
                            + '"' + ProductName + '",'
                            + '"' + SKU + '",'
                            + '"' + Barcode + '",'
                            + '"' + BrandName + '",'
                            + '"' + CategoryName + '",'
                            + '"' + SupplierName + '",'
                            + '"' + LocationName + '",'
                            + '"' + Staff + '",'
                            + '"' + Action + '",'
                            + '"' + Adjustment + '",'
                            + '"' + CostPrice + '",'
                            + '"' + AdjustmentCost + '",'
                            + '"' + OnHand + '",'
                            + '"' + OnHandCost + '"\n';
                        })
                    }
                }, function () {
                })
                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCVX');
    }
    var loaddata = function () {
        if ($.fn.DataTable.isDataTable('#tableStockHistory'))
            table.destroy();
        loadtable();
    }
    //load table location stock
    var loadtableStockLocation = function () {
        tableStockLocation = $("#tableStockLocation").InStallDatatable({
            ProductID: $("#ViewProductID").val(),

        }, "/Inventory/GetProductStockLocationByProductID", [
     {
         "data": "LocationName", "name": "LocationName", "width": "40%", "class": "text-left"
     },
     {
         "data": "InitialStock", "name": "InitialStockInitialStock", "width": "20%", "class": "text-left", "render": function (data, type, row) {
             return '';
         }
     },
     {
         "data": "ReorderPoint", "name": "ReorderPoint", "width": "20%", "class": "text-left", "render": function (data, type, row) {
             return '<input id="detailReorderPoint" name="detailReorderPoint" class="form-control" type="number" value="' + data + '"/>';
         }
     },
     {
         "data": "ReorderQty", "name": "ReorderQty", "width": "20%", "class": "text-left", "render": function (data, type, row) {
             return '<input id="detailReorderQty" name="detailReorderQty" class="form-control" type="number" value="' + data + '"/>';
         }
     },
        ], true, false, false, false, null, true, null, null, null, null);
    }
    var loaddatatableStockLocation = function () {
        if ($.fn.DataTable.isDataTable('#tableStockLocation'))
            tableStockLocation.destroy();
        loadtableStockLocation();
    }
    loaddata();
    $("#actionForm #CategoryID").InStallSelect2('/Home/LoadSelect2ForCategory', 50, 'Select category', null);
    $("#actionForm #BrandID").InStallSelect2('/Home/LoadSelect2ForBrand', 50, 'Select brand', null);
    $("#actionForm #TaxID").InStallSelect2('/Home/LoadSelect2ForTax', 50, 'Select tax', null);
    $("#actionForm #SupplierID").InStallSelect2('/Home/LoadSelect2ForSupplier', 50, 'Select supplier', null);
    $.validator.addMethod("validatorspecialprice", function (value, element, arg) {
        value = $.isNumeric(value.replace(/,/gi, '')) ? value.replace(/,/gi, '') : 0;
        var RetailPrice = $('#actionModal #RetailPrice').val();
        if (parseFloat(RetailPrice) == 0)
            return true;
        else
            return parseFloat(value) < parseFloat(RetailPrice) ? true : false;
    }, 'Special price must be lower than full price');
    $('#actionForm').validate({
        rules: {
            ProductName: 'required',
            SpecialPrice: 'validatorspecialprice',
            RetailPrice: {
                required: true,
                min: 0.01
            }
        },
        messages: {
            CategoryName: 'Product name is required',
            RetailPrice: 'Retail price is required'
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
    $('#actionModal').modal({
        backdrop: false,
        show: false,
    })
    $('#actionModal').on('hidden.bs.modal', function (e) {
        $("body").find(".modal-backdrop").remove();
    })
    $('#actionModal').on('shown.bs.modal', function (e) {
        $("body").append('<div class="modal-backdrop fade show"></div>');
    })
    $("#input_group_text1").text(Window.CurrencySymbol);
    $("#input_group_text2").text(Window.CurrencySymbol);
    $("#input_group_text3").text(Window.CurrencySymbol);
    //#endregion

    //#region Event
    $('#EnableRetailSales').on('change', function () {
        var x = document.getElementById("hasEnableRetailSales");
        var y = document.getElementById("noEnableRetailSales");
        if (this.checked) {
            x.style.display = 'block';
            y.style.display = 'none';
        } else {
            x.style.display = 'none';
            y.style.display = 'block';
        }
    });
    $('#EnableStockControl').on('change', function () {
        var x = document.getElementById("hasEnableStockControl");
        var y = document.getElementById("noEnableStockControl");
        if (this.checked) {
            x.style.display = 'block';
            y.style.display = 'none';
        } else {
            x.style.display = 'none';
            y.style.display = 'block';
        }
    });
    $("#btnEditProduct").click(function () {
        $("#TitleModal").text("Edit Product");
        //lay client
        $.RequestAjax("/Inventory/GetProductByID", JSON.stringify({
            ID: $("#ViewProductID").val(),
        }), function (data) {
            var product = data.data;
            $("#TitleModal").text("Edit Product");
            $("#ProductID").val(product.ProductID);
            $("#ProductName").val(product.ProductName);
            $("#CategoryID").SetValueSelect2ID(product.CategoryID);
            $("#BrandID").SetValueSelect2ID(product.BrandID);
            $("#Barcode").val(product.Barcode);
            $("#SKU").val(product.SKU);
            $("#Description").val(product.Description);
            $("#EnableRetailSales").iCheck(product.EnableRetailSales == true ? 'check' : 'uncheck');
            var x = document.getElementById("hasEnableRetailSales");
            var y = document.getElementById("noEnableRetailSales");
            if (product.EnableRetailSales) {
                x.style.display = 'block';
                y.style.display = 'none';
            } else {
                x.style.display = 'none';
                y.style.display = 'block';
            }

            $("#RetailPrice").val(product.RetailPrice);
            $("#SpecialPrice").val(product.SpecialPrice);
            $("#TaxID").SetValueSelect2ID(product.TaxID);
            $("#EnableCommission").iCheck(product.EnableCommission == true ? 'check' : 'uncheck');
            $("#EnableStockControl").iCheck(product.EnableStockControl == true ? 'check' : 'uncheck');
            var x = document.getElementById("hasEnableStockControl");
            var y = document.getElementById("noEnableStockControl");
            if (product.EnableStockControl) {
                x.style.display = 'block';
                y.style.display = 'none';
            } else {
                x.style.display = 'none';
                y.style.display = 'block';
            }
            $("#SupplyPrice").val(product.SupplyPrice);
            $("#SupplierID").SetValueSelect2ID(product.SupplierID);

            $('#deleteButton').show();
            $('#actionModal').modal("show");
        }, function () {
        })
        //kiem tra hide col Initial Stock
        var th = document.getElementById("thInitialStock");
        th.style.visibility = "hidden";
        loaddatatableStockLocation();
        $('#actionModal').modal("show");
    })
    $("#deleteButton").click(function () {
        PNotify.notice({
            title: 'DELETE PRODUCT',
            text: 'Are you sure you want to delete this product?',
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
                        text: 'DELETE',
                        primary: true,
                        click: function (notice) {
                            $.ajax({
                                url: '/Inventory/DeleteProduct',
                                type: 'post',
                                datatype: 'json',
                                data: {
                                    id: $("#ProductID").val()
                                },
                                async: false,
                                cache: false,
                                success: function (data) {
                                    if (!JSON.parse(data.Result)) {
                                        if (parseInt(data.ErrorStyle) != 0) {
                                            toastr["error"](data.ErrorMessage, "Error");
                                        } else {
                                            toastr["error"](data.ErrorMessage, "Error");
                                            console.log("Xóa dữ liệu thất bại: " + data.ErrorMessage);
                                        }
                                    }
                                    else {
                                        toastr["success"](data.ErrorMessage, "Notification");
                                        window.location.href = '/Inventory/Inventory'
                                    }
                                    notice.close();
                                    $('#actionModal').modal("hide");
                                }
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
    Ladda.bind('#actionButton', {
        callback: function (instance) {
            instance.start();
            if ($("#actionForm").valid()) {
                //debugger;
                var entity = new Object();
                $("#actionForm").find("[ispropertiesmodel]").each(function () {
                    if ($(this).is("input[type='text'],input[type='number'],input[type='email'],textarea,select,input[type='hidden'],input[type='password']"))
                        entity[$(this).attr("id")] = $(this).val();
                    if ($(this).is("input[type='checkbox'],input[type='radio']"))
                        entity[$(this).attr("id")] = this.checked;
                    if ($(this).is("[isnumber]"))
                        entity[$(this).attr("id")] = entity[$(this).attr("id")].replace(/,/gi, '');
                    if ($(this).is("[isdate]") && $(this).val() != "") {
                        entity[$(this).attr("id")] = moment(entity[$(this).attr("id")], $(this).attr("formatdate")).format("YYYY/MM/DD");
                    }
                })
                var ProductLocations = [];
                $("#tableStockLocation tbody tr").each(function () {
                    var data = tableStockLocation.row($(this).closest("tr")).data();
                    ProductLocations.push({
                        LocationID: data.LocationID,
                        InitialStock: $(this).find("[name='detailInitialStock']").val(),
                        ReorderPoint: $(this).find("[name='detailReorderPoint']").val(),
                        ReorderQty: $(this).find("[name='detailReorderQty']").val(),
                    })
                })
                $.RequestAjax("/Inventory/SaveProduct", JSON.stringify({
                    entity: entity,
                    ProductLocations: ProductLocations,
                    isUpdate: $("#ProductID").val() != 0
                }), function (data) {
                    instance.stop();
                    if (!JSON.parse(data.Result)) {
                        toastr["error"](data.ErrorMessage, "Error");
                    } else {
                        toastr["success"](data.ErrorMessage, "Notification");
                        $('#actionModal').modal("hide");
                        window.location = "/Inventory/Products?id=" + $('#ViewProductID').val();
                    }
                })

            } else
                instance.stop();
        }
    });
    $("#btnStockDecrease").click(function () {
        $("#adjustmentModal").find(".modal-title").html("Descrease Stock");
        $("#selectlocation").text("Select a location to decrease stock at");
        $.RequestAjax("/Inventory/GetProductLocationByProductID", JSON.stringify({
            "ProductID": $("#ViewProductID").val(),
        }), function (data) {
            var html = "";
            $("#divLocation").html('');
            if (data.data.length == 0) {
            }
            else {
                $.each(data.data, function () {
                    var element = $(htmlItemTemplate);
                    element.attr("id-item-modal", this.LocationID);
                    element.attr("onhand", this.OnHand);
                    element.attr("locationname", this.LocationName);
                    element.find("div:first strong").text(this.LocationName);
                    element.find("div:first span").text(this.OnHand + ' in stock');
                    element.find("div:last span").append(htmlIconNext);
                    html = element[0].outerHTML;
                    $("#divLocation").append(html);
                })
            }
        }, function () {
        })

        $("#adjustmentModal #StockType").val("O");
        $('#adjustmentModal').modal("show");

        var divLocation = document.getElementById("divLocation");
        var divdecrease = document.getElementById("divdecrease");
        var divincrease = document.getElementById("divincrease");
        var modalfooter = document.getElementById("modalfooter");
        divLocation.style.display = 'block';
        divdecrease.style.display = 'none';
        divincrease.style.display = 'none';
        modalfooter.style.display = 'none';
    })
    $("#btnStockIncrease").click(function () {
        $("#adjustmentModal").find(".modal-title").html("Increase Stock");
        $("#selectlocation").text("Select a location to increase stock at");
        $.RequestAjax("/Inventory/GetProductLocationByProductID", JSON.stringify({
            "ProductID": $("#ViewProductID").val(),
        }), function (data) {
            var html = "";
            $("#divLocation").html('');
            if (data.data.length == 0) {
            }
            else {
                $.each(data.data, function () {
                    var element = $(htmlItemTemplate);
                    element.attr("id-item-modal", this.LocationID);
                    element.attr("onhand", this.OnHand);
                    element.attr("locationname", this.LocationName);
                    element.find("div:first strong").text(this.LocationName);
                    element.find("div:first span").text(this.OnHand + ' in stock');
                    element.find("div:last span").append(htmlIconNext);
                    html = element[0].outerHTML;
                    $("#divLocation").append(html);
                })
            }
        }, function () {
        })
        $("#adjustmentModal #StockType").val("I");
        $('#adjustmentModal').modal("show");

        var divLocation = document.getElementById("divLocation");
        var divdecrease = document.getElementById("divdecrease");
        var divincrease = document.getElementById("divincrease");
        var modalfooter = document.getElementById("modalfooter");
        divLocation.style.display = 'block';
        divdecrease.style.display = 'none';
        divincrease.style.display = 'none';
        modalfooter.style.display = 'none';
    })
    $(document).on("click", "span[name='viewOrder']", function () {
        if (table != null) {
            localStorage.setItem("PreLink", '/Inventory/Products?id=' + $("#ViewProductID").val());
        }
    })
    //#endregion
})