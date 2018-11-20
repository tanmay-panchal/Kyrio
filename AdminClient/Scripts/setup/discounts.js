var table;
$(function () {
    //#region Load data && setup control
    CreateBreadcrumb([{ href: "/Setup/Index", title: "Setup" }, { href: "/Setup/Discounts", title: "Discounts" }])
    table = $("#table").InStallDatatable(null, "/Setup/GetDataTableDiscounts", [
         { "data": "DiscountName", "name": "DiscountName", "width": "60%", "class": "text-left" },
         {
             "data": "DiscountValue", "name": "DiscountValue", "width": "20%", "class": "text-left", "render": function (data, type, row) {
                 return row.IsPercentage == true ? (data + "% off") : (Window.CurrencySymbol + data + " off");
             }
         },
         { "data": "CreateDate", "name": "CreateDate", "width": "20%", "class": "text-left", "render": function (data) { return (data == "" ? data : moment(data).format("dddd, DD MMM YYYY")); } },
    ], true, false, false, false, null, true, null, null, null);
    $('#actionForm').validate({
        rules: {
            CancellationReasonName: 'required',
        },
        messages: {
            CancellationReasonName: 'Please enter name',
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
    $("#containtButtonCreate").InStallButtonFooter("buttonCreate", "tittleButton", "New Discount");
    $("#CurrencyCode").text(Window.CurrencyCode);
    //#endregion

    //#region event 
    $(document).on("ifChanged", "#IsPercentage", function () {
        debugger;
        if (this.checked) {
            $("#input_group_text").text("%");
        }
        else {
            $("#input_group_text").text(Window.CurrencyCode);
        }
    })
    $(document).on("click", "#table tbody tr td", function () {
        var data = table.row($(this).closest("tr")).data();
        $("#TitleModal").text("Edit Discount");
        $("#DiscountID").val(data.DiscountID);
        $("#DiscountName").val(data.DiscountName);
        $("#DiscountValue").val(data.DiscountValue);

        if (data.IsPercentage) {
            $("#input_group_text").text("%");
        }
        else {
            $("#input_group_text").text(Window.CurrencyCode);
        }
        //phai tra ve trang thai ban dau
        $("[name='IsPercentage']").iCheck(!data.IsPercentage ? 'check' : 'uncheck');
        $("#IsPercentage").iCheck(data.IsPercentage ? 'check' : 'uncheck');

        $("#EnableForServiceSales").iCheck(data.EnableForServiceSales == true ? 'check' : 'uncheck');
        $("#EnableForProductSales").iCheck(data.EnableForProductSales == true ? 'check' : 'uncheck');
        $("#EnableForVoucherSales").iCheck(data.EnableForVoucherSales == true ? 'check' : 'uncheck');
        $('#deleteButton').show();
        $('#actionModal').modal("show");
    })
    $("#containtButtonCreate").click(function () {
        $("#TitleModal").text("New Discount");
        $("#DiscountID").val(0);
        $("#DiscountName").val('');
        $("#DiscountValue").val(0);
        $("#IsPercentage").iCheck('check');
        $("#input_group_text").text("%");
        $("#EnableForServiceSales").iCheck('check');
        $("#EnableForProductSales").iCheck('check');
        $("#EnableForVoucherSales").iCheck('check');
        $('#deleteButton').hide();
        $('#actionModal').modal("show");
    })
    $("#deleteButton").click(function () {
        PNotify.notice({
            title: 'DELETE DISCOUNT',
            text: 'Are you sure you want to delete this discount ?',
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
                                url: '/Setup/DeleteDiscount',
                                type: 'post',
                                datatype: 'json',
                                data: {
                                    id: $("#DiscountID").val()
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
                                        setTimeout("table.ajax.reload()", 500);
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
                var success = function (data) {
                    instance.stop();
                    if (!JSON.parse(data.Result)) {
                        toastr["error"]("Save data failed. Please contact the developer to fix it.", "Error");
                        console.log("Lưu dữ liệu thất bại. Lỗi: " + data.ErrorMessage);
                    } else {
                        toastr["success"](data.ErrorMessage, "Notification");
                        $('#actionModal').modal("hide");
                        setTimeout("table.ajax.reload()", 500);
                    }
                };
                $("form").AddOrUpdateForm("/Setup/AddOrUpdateDiscount", success);
            } else
                instance.stop();
        }
    });
    //#endregion
})