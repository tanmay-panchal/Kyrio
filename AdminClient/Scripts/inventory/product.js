//#region Method Support
//#endregion
var table;
var tableStockLocation;
var IsFilter = false;
$(function () {
    //#region Load data && setup control
    CreateBreadcrumb([{ href: "/Inventory/Inventory", title: "Inventory" }])
    var loadtable = function () {
        table = $("#table").InStallDatatable({
            CategoryID: $("#FilterCategoryID").val(),
            BrandID: $("#FilterBrandID").val(),
            SupplierID: $("#FilterSupplierID").val(),

        }, "/Inventory/GetDataTableProduct", [
     {
         "data": "ProductName", "name": "ProductName", "width": "40%", "class": "text-left"
     },
     {
         "data": "Barcode", "name": "Barcode", "width": "15%", "class": "text-left"
     },
     {
         "data": "RetailPrice", "name": "RetailPrice", "width": "15%", "class": "text-right", "render": function (data, type, row) {
             return ((row.SpecialPrice > 0 && row.RetailPrice > 0) ? '<span><del>' + ((Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ',')) + '</del><span style="color:red; padding-left: 10px">' + (Window.CurrencySymbol + $.number(row.SpecialPrice, Window.NumberDecimal, '.', ',')) + '</span>') : (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ',')));
         }
     },
     {
         "data": "StockOnHand", "name": "StockOnHand", "width": "15%", "class": "text-right", "render": function (data, type, row) {
             return (row.EnableStockControl == false ? 'Unlimited' : ($.number(data, 0, '.', ',')));
         }
     },
     {
         "data": "ModifyDate", "name": "ModifyDate", "class": "text-left", "width": "15%", "render": function (data, type, row) {
             return row.ModifyDate == null ? moment(row.CreateDate).format(Window.FormatDateWithTimeJS) : moment(row.ModifyDate).format(Window.FormatDateWithTimeJS);
         }
     },
        ], true, true, true, false, 1, true, null, function (setting) {
            var api = this.api();
            var x = document.getElementById("divNoData");
            var y = document.getElementById("divTable");
            if (api.rows().data().count() == 0) {
                if (IsFilter == true) {
                    x.style.display = 'none';
                    y.style.display = 'block';
                    IsFilter = false;
                }
                else {
                    x.style.display = 'block';
                    y.style.display = 'none';
                }
            }
            else {
                x.style.display = 'none';
                y.style.display = 'block';
            }
        }, null, {
            language: {
                search: "",
                searchPlaceholder: "Search by product name or barcode or SKU"
            }
        });

        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file-excel-o"></i>  Excel',
            extend: 'excelHtml5',
            isAutoWidth: false,
            isSTT: false,
            sheetName: "Products",
            title: null,
            filename: "Products",
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
                var arrayColWidth = [20, 15, 15, 20, 15, 15, 15, 20, 20, 20, 20, 15];

                //#region fill data header
                rowPos = functions.AddRow(["Product name", "SKU", "Barcode", "Description", "Cost price", "Full price", "Special price", "Tax rate", "Category", "Brand", "Supplier", "Stock on hand"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion

                $.RequestAjax("/Inventory/GetAllProduct", null, function (data) {
                    if (data.data.length == 0) {
                    }
                    else {
                        $.each(data.data, function () {
                            var ProductName = this.ProductName;
                            var SKU = this.SKU == null ? '' : this.SKU.toString() + '';
                            var Barcode = this.Barcode == null ? '' : this.Barcode.toString() + '';
                            var Description = this.Description == null ? '' : this.Description;
                            var SupplyPrice = $.number(this.SupplyPrice, Window.NumberDecimal, '.', ',');
                            var RetailPrice = $.number(this.RetailPrice, Window.NumberDecimal, '.', ',');
                            var SpecialPrice = $.number(this.SpecialPrice, Window.NumberDecimal, '.', ',');
                            var TaxName = this.TaxName == null ? '' : this.TaxName;
                            var CategoryName = this.CategoryName == null ? '' : this.CategoryName;
                            var BrandName = this.BrandName == null ? '' : this.BrandName;
                            var SupplierName = this.SupplierName == null ? '' : this.SupplierName;
                            var StockOnHand = $.number(this.StockOnHand, 0, '.', ',');

                            rowPos = functions.AddRow([ProductName, SKU, Barcode, Description, SupplyPrice, RetailPrice,
                                SpecialPrice, TaxName, CategoryName, BrandName, SupplierName, StockOnHand], rowPos);
                        })
                    }
                }, function () {
                })
                // Set column widths
                var cols = functions.CreateCellPos(rels, 'cols');
                $('worksheet', rels).prepend(cols);

                for (var i = 0, ien = 12 ; i < ien ; i++) {
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
            filename: "Products",
            customize: function (output, config) {
                output = 'Product name, SKU, Barcode, Description, Cost price, Full price, Special price, Tax rate, Category, Brand, Supplier, Stock on hand\n';

                $.RequestAjax("/Inventory/GetAllProduct", null, function (data) {
                    if (data.data.length == 0) {
                    }
                    else {
                        $.each(data.data, function () {
                            var ProductName = this.ProductName;
                            var SKU = this.SKU == null ? '' : this.SKU.toString() + '';
                            var Barcode = this.Barcode == null ? '' : this.Barcode.toString() + '';
                            var Description = this.Description == null ? '' : this.Description;
                            var SupplyPrice = $.number(this.SupplyPrice, Window.NumberDecimal, '.', ',');
                            var RetailPrice = $.number(this.RetailPrice, Window.NumberDecimal, '.', ',');
                            var SpecialPrice = $.number(this.SpecialPrice, Window.NumberDecimal, '.', ',');
                            var TaxName = this.TaxName == null ? '' : this.TaxName;
                            var CategoryName = this.CategoryName == null ? '' : this.CategoryName;
                            var BrandName = this.BrandName == null ? '' : this.BrandName;
                            var SupplierName = this.SupplierName == null ? '' : this.SupplierName;
                            var StockOnHand = $.number(this.StockOnHand, 0, '.', ',');

                            output += '"' + ProductName + '",'
                            + '"' + SKU + '",'
                            + '"' + Barcode + '",'
                            + '"' + Description + '",'
                            + '"' + SupplyPrice + '",'
                            + '"' + RetailPrice + '",'
                            + '"' + SpecialPrice + '",'
                            + '"' + TaxName + '",'
                            + '"' + CategoryName + '",'
                            + '"' + BrandName + '",'
                            + '"' + SupplierName + '",'
                            + '"' + StockOnHand + '"\n';
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
        if ($.fn.DataTable.isDataTable('#table'))
            table.destroy();
        loadtable();
    }
    //load table location stock
    var loadtableStockLocation = function () {
        tableStockLocation = $("#tableStockLocation").InStallDatatable({
            ProductID: $("#ProductID").val(),

        }, "/Inventory/GetProductStockLocationByProductID", [
     {
         "data": "LocationName", "name": "LocationName", "width": "40%", "class": "text-left"
     },
     {
         "data": "InitialStock", "name": "InitialStock", "width": "20%", "class": "text-left", "render": function (data, type, row) {
             return '<input id="detailInitialStock" name="detailInitialStock" class="form-control" type="number" value="' + data + '"/>';
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
    $("#FilterCategoryID").InStallSelect2('/Home/LoadSelect2ForCategory', 50, 'All categories', null, null, null, null, null, null, null, false);
    $("#FilterBrandID").InStallSelect2('/Home/LoadSelect2ForBrand', 50, 'All brands', null, null, null, null, null, null, null, false);
    $("#FilterSupplierID").InStallSelect2('/Home/LoadSelect2ForSupplier', 50, 'All suppliers', null, null, null, null, null, null, null, false);
    $("#containtButtonCreate").InStallButtonFooter("buttonCreate", "tittleButton", "New Product");
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
    $("#containtButtonCreate, #btnNew").click(function () {
        $("#TitleModal").text("Add Product");
        $("#ProductID").val(0);
        $("#ProductName").val("");
        $("#CategoryID").SetValueSelect2("", "Select category");
        $("#BrandID").SetValueSelect2("", "Select brand");
        $("#Barcode").val("");
        $("#SKU").val("");
        $("#Description").val("");
        $("#EnableRetailSales").iCheck('check');
        var x = document.getElementById("hasEnableRetailSales");
        x.style.display = 'block';
        var y = document.getElementById("noEnableRetailSales");
        y.style.display = 'none';
        $("#RetailPrice").val(0);
        $("#SpecialPrice").val(0);
        $("#TaxID").SetValueSelect2("", "Select tax");
        $("#EnableCommission").iCheck('check');
        $("#EnableStockControl").iCheck('check');
        var x = document.getElementById("hasEnableStockControl");
        x.style.display = 'block';
        var y = document.getElementById("noEnableStockControl");
        y.style.display = 'none';
        $("#SupplyPrice").val(0);
        $("#SupplierID").SetValueSelect2("", "Select supplier");

        loaddatatableStockLocation();

        $('#deleteButton').hide();
        $('#actionModal').modal("show");
    })
    $(document).on("click", "#table tbody tr td", function () {
        var data = table.row($(this).closest("tr")).data();
        window.location = "/Inventory/Products?id=" + data.ProductID.toString();
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
                        setTimeout("table.ajax.reload()", 500);
                    }
                })
            } else
                instance.stop();
        }
    });
    $("#btnView").click(function () {
        IsFilter = true;
        loaddata();
    })
    //#endregion
})