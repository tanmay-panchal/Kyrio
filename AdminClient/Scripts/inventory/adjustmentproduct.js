var htmlItemTemplate = '<div class="col-12 item-modal-wizard" onhand="" locationname=""><div class="col-6"><div class="col-12"> <strong></strong></div><div class="col-12"><span><span></div></div><div class="col-6 text-right"><span></span></div></div>'
var htmlIconNext = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">'
                + '<path d="M6.187 16.9c-.25.253-.25.66 0 .91.248.253.652.253.9 0l7.285-7.355c.25-.25.25-.66 0-.91L7.088 2.19c-.25-.253-.652-.253-.9 0-.25.25-.25.658-.002.91L12.83 10l-6.643 6.9z"></path>'
                + '</svg>'
//#endregion
var LocationID;
$(function () {
    $('#formModalWizard').validate({
        rules: {
            DescreaseQuantity: {
                required: true,
                min: 1
            },
            IncreaseQuantity: {
                required: true,
                min: 1
            },
            SupplierPrice: {
                required: true
            }
        },
        messages: {
            DescreaseQuantity: 'Decrease qty. is required',
            IncreaseQuantity: 'Increase qty. is required',
            SupplierPrice: 'Supplier price is required'
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
    $(document).on("click", ".modal-wizard .item-modal-wizard", function () {
        debugger;
        LocationID = $(this).attr("id-item-modal");
        var locationname = $(this).attr("locationname");
        var onhand = $(this).attr("onhand");
        var divLocation = document.getElementById("divLocation");
        var divdecrease = document.getElementById("divdecrease");
        var divincrease = document.getElementById("divincrease");
        var modalfooter = document.getElementById("modalfooter");
        divLocation.style.display = 'none';
        if ($("#StockType").val() == "O") {
            divdecrease.style.display = 'block';
            divincrease.style.display = 'none';
            $("#DescreaseQuantity").val(0)
        }
        else {
            divdecrease.style.display = 'none';
            divincrease.style.display = 'block';
            $("#SavePriceToNextTime").iCheck('uncheck');
            $("#IncreaseQuantity").val(0)
            $("#SupplierPrice").val(0)
        }
        $("#selectlocation").text(onhand + " units currently in stock at " + locationname + ".");
        

        modalfooter.style.display = 'block';
    });
    $("#btnSaveAdjustment").click(function () {
        debugger;
        if ($("#formModalWizard").valid()) {
            $.RequestAjax("/Inventory/SaveStockMovement", JSON.stringify({
                "ProductID": $("#ViewProductID").val(),
                "LocationID": LocationID,
                "Quantity": $("#StockType").val() == "O" ? $("#DescreaseQuantity").val() : $("#IncreaseQuantity").val(),
                "Action": $("#StockType").val() == "O" ? $("#DescreaseReason").val() : $("#IncreaseReason").val(),
                "StockType": $("#StockType").val(),
                "SupplierPrice": $("#StockType").val() == "O" ? 0 : $("#SupplierPrice").val(),
                "SavePriceToNextTime": $("#StockType").val() == "O" ? false : $("#SavePriceToNextTime")[0].checked,
            }), function (data) {
                if (data.Result) {
                    window.location = "/Inventory/Products?id=" + $('#ViewProductID').val();
                    setTimeout("table.ajax.reload()", 500);
                    $('#adjustmentModal').modal("hide");
                }
                else {
                    toastr["error"](data.ErrorMessage, "Error");
                }
            }, function () {
            })
        }
    });
})
