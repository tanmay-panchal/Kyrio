//#region Method Support
//#endregion
var table;
var IsFilter = false;
var urlGetDataAllLocation = "/Home/GetDataAllLocation";
$(function () {
    //#region Load data && setup control
    CreateBreadcrumb([{ href: "/Inventory/Order", title: "Order" }])
    var loadTable = function () {
        table = $("#table").InStallDatatable({
            LocationID: $("#FilterLocationID").val(),
            SupplierID: $("#FilterSupplierID").val(),
            OrderStatus: $("#FilterOrderStatus").val(),
        }, "/Inventory/GetDataTableOrder", [
     {
         "data": "OrderNo", "name": "OrderNo", "width": "10%", "class": "text-left"
     },
     {
         "data": "CreateDate", "name": "CreateDate", "class": "text-left", "width": "10%", "render": function (data, type, row) {
             return moment(data).format(Window.FormatDateJS);
         }
     },
     {
         "data": "OrderType", "name": "OrderType", "width": "15%", "class": "text-left", "render": function (data, type, row) {
             return (Window.ResourcesEnum[data]);
         }
     },
     {
         "data": "LocationName", "name": "LocationName", "width": "20%", "class": "text-left"
     },
     {
         "data": "SupplierName", "name": "SupplierName", "width": "20%", "class": "text-left", "render": function (data, type, row) {
             return (row.OrderType == 'order_type_order' ? row.SupplierName : row.FLocationName);
         }
     },
     {
         "data": "OrderStatus", "name": "OrderStatus", "width": "10%", "class": "text-left", "render": function (data, type, row) {
             var html = "";
             if (row.OrderStatus == "order_status_ordered") {
                 html = '<button type="button" class="btn btn-sm btn-pill btn-primary" style="width:80px">' + Window.ResourcesEnum[data].toUpperCase() + '</button>';
             }
             else if (row.OrderStatus == "order_status_received") {
                 html = '<button type="button" class="btn btn-sm btn-pill btn-success" style="width:80px">' + Window.ResourcesEnum[data].toUpperCase() + '</button>';
             }
             else if (row.OrderStatus == "order_status_canceled") {
                 html = '<button type="button" class="btn btn-sm btn-pill btn-danger" style="width:80px">' + Window.ResourcesEnum[data].toUpperCase() + '</button>';
             }
             return html;
         }
     },
     {
         "data": "TotalCost", "name": "TotalCost", "width": "15%", "class": "text-right", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
         }
     },
        ], true, true, true, false, null, true, null, function (setting) {
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
                searchPlaceholder: "Search by order"
            }
        });

        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file-excel-o"></i>  Excel',
            extend: 'excelHtml5',
            isAutoWidth: false,
            isSTT: false,
            sheetName: "Orders",
            title: null,
            filename: "Orders",
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
                var arrayColWidth = [20, 15, 15, 20, 15, 15, 15];

                //#region fill data header
                rowPos = functions.AddRow(["Order no.", "Created date", "Type", "Location", "Supplier", "Status", "Total cost"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion

                $.RequestAjax("/Inventory/GetAllOrder", null, function (data) {
                    if (data.data.length == 0) {
                    }
                    else {
                        $.each(data.data, function () {
                            var OrderNo = this.OrderNo;
                            var CreateDate = moment(this.CreateDate).format(Window.FormatDateJS);
                            var Type = Window.ResourcesEnum[this.OrderType];
                            var Location = this.LocationName;
                            var Supplier = (this.OrderType == 'order_type_order' ? this.SupplierName : this.FLocationName);
                            var Status = Window.ResourcesEnum[this.OrderStatus];
                            var TotalCost = $.number(this.TotalCost, Window.NumberDecimal, '.', ',');

                            rowPos = functions.AddRow([OrderNo, CreateDate, Type, Location, Supplier, Status,
                                TotalCost], rowPos);
                        })
                    }
                }, function () {
                })
                // Set column widths
                var cols = functions.CreateCellPos(rels, 'cols');
                $('worksheet', rels).prepend(cols);

                for (var i = 0, ien = 7 ; i < ien ; i++) {
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
            filename: "Orders",
            customize: function (output, config) {
                output = 'Order no., Created date, Type, Location, Supplier, Status, Total cost\n';

                $.RequestAjax("/Inventory/GetAllOrder", null, function (data) {
                    if (data.data.length == 0) {
                    }
                    else {
                        $.each(data.data, function () {
                            var OrderNo = this.OrderNo;
                            var CreateDate = moment(this.CreateDate).format(Window.FormatDateJS);
                            var Type = Window.ResourcesEnum[this.OrderType];
                            var Location = this.LocationName;
                            var Supplier = (this.OrderType == 'order_type_order' ? this.SupplierName : this.FLocationName);
                            var Status = Window.ResourcesEnum[this.OrderStatus];
                            var TotalCost = $.number(this.TotalCost, Window.NumberDecimal, '.', ',');

                            output += '"' + OrderNo + '",'
                            + '"' + CreateDate + '",'
                            + '"' + Type + '",'
                            + '"' + Location + '",'
                            + '"' + Supplier + '",'
                            + '"' + Status + '",'
                            + '"' + TotalCost + '"\n';
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
        loadTable();
    }
    loaddata();
    var checkShowButtonTransfer = function () {
        $.RequestAjax(urlGetDataAllLocation, JSON.stringify({
        }), function (data) {
            if (data.Result.length > 1) {
                $("#containtButtonCreate").InStallButtonGroupFooter({
                    ArrayButtonOriginal: [{
                        IdButtonCreate: "",
                        ClassIcon: "fa-plus",
                        IsShowTitle: false,
                        Title: ""
                    }],
                    ArrayButtonLater: [{
                        IdButtonCreate: "btnNewTransferMain",
                        ClassIcon: "fa-refresh",
                        IsShowTitle: true,
                        Title: "New Transfer"
                    }, {
                        IdButtonCreate: "btnNewOrderMain",
                        ClassIcon: "fa-cart-plus",
                        IsShowTitle: true,
                        Title: "New Order"
                    }]
                });
            }
            else {
                $("#containtButtonCreate").InStallButtonGroupFooter({
                    ArrayButtonOriginal: [{
                        IdButtonCreate: "",
                        ClassIcon: "fa-plus",
                        IsShowTitle: false,
                        Title: ""
                    }],
                    ArrayButtonLater: [{
                        IdButtonCreate: "btnNewOrderMain",
                        ClassIcon: "fa-cart-plus",
                        IsShowTitle: true,
                        Title: "New Order"
                    }]
                });
                $("#btnNewTransfer").hide();
            }
        }, function () {
        })
    }
    checkShowButtonTransfer();
    $("#FilterLocationID").InStallSelect2('/Home/LoadSelect2ForLocation', 50, 'All locations', null, null, null, null, null, null, null, false);
    $("#FilterSupplierID").InStallSelect2('/Home/LoadSelect2ForSupplier', 50, 'All suppliers', null, null, null, null, null, null, null, false);
    //#endregion

    //#region Event
    $("#btnView").click(function () {
        IsFilter = true;
        loaddata();
    })
    $(document).on("click", "#btnNewOrderMain", function () {
        window.location = "/Inventory/NewOrder";
    })
    $("#btnNewOrder").click(function () {
        window.location = "/Inventory/NewOrder";
    })
    $(document).on("click", "#table tbody tr td", function () {
        var data = table.row($(this).closest("tr")).data();
        window.location = "/Inventory/ViewOrder?id=" + data.OrderID.toString();
    })
    $(document).on("click", "#btnNewTransferMain", function () {
        window.location = "/Inventory/NewTransfer";
    })
    $("#btnNewTransfer").click(function () {
        window.location = "/Inventory/NewTransfer";
    })
    //#endregion
})
