var table;
$(function () {
    //#region Load data && setup control
    CreateBreadcrumb([{ href: "/Setup/Index", title: "Setup" }, { href: "/Setup/PaymentTypes", title: "Payment Types" }])
    table = $("#table").InStallDatatable(null, "/Setup/GetDataTablePaymentTypes", [
        {
            "data": null, "name": null, "width": "5%", "class": "text-center", "render": function (data, type, row) {
                return '<i class="icon-menu icons "></i>';
            }
        },
         { "data": "PaymentTypeName", "name": "PaymentTypeName", "width": "75%", "class": "text-left" },
         { "data": "IsDefault", "name": "IsDefault", "width": "20%", "class": "text-center", "render": function (data, type, row) { return row.IsDefault == true ? '<i class="fa fa-lock fa-lg" data-toggle="tooltip" data-placement="top" title="" data-original-title="This item can not be deleted"></i>' : ''; } },
    ], true, false, false, false, null, true, null, null, null, {
        "rowReorder": true
    });
    table.on('row-reorder', function (e, diff, edit) {
        for (var i = 0, ien = diff.length ; i < ien ; i++) {
            var SortOrderNew = table.row(diff[i].newPosition).data().SortOrder;
            var ID = table.row(diff[i].node).data().PaymentTypeID;
            $.RequestAjax("/Setup/UpdateSortOrderPaymentType", JSON.stringify({
                ID: ID,
                SortOrderNew: SortOrderNew,
            }))
        }
    })
    $('#actionForm').validate({
        rules: {
            PaymentTypeName: 'required',
        },
        messages: {
            PaymentTypeName: 'Please enter name',
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
    $("#containtButtonCreate").InStallButtonFooter("buttonCreate", "tittleButton", "New Payment Type");

    //#endregion

    //#region event 
    $(document).on("click", "#table tbody tr td", function () {
        var data = table.row($(this).closest("tr")).data();
        $("#TitleModal").text("Edit Payment Type");
        $("#PaymentTypeID").val(data.PaymentTypeID);
        $("#PaymentTypeName").val(data.PaymentTypeName);
        if (data.IsDefault) {
            $("#PaymentTypeName").attr("readonly", true);
            $('#deleteButton').hide();
            $('#actionButton').hide();
        }
        else {
            $("#PaymentTypeName").attr("readonly", false);
            $('#deleteButton').show();
            $('#actionButton').show();
        }
        $('#actionModal').modal("show");
    })
    $("#containtButtonCreate").click(function () {
        $("#PaymentTypeName").attr("readonly", false);
        $('#actionButton').show();

        $("#TitleModal").text("New Payment Type");
        $("#PaymentTypeID").val(0);
        $("#PaymentTypeName").val("");
        $('#deleteButton').hide();
        $('#actionModal').modal("show");
    })
    $("#deleteButton").click(function () {
        PNotify.notice({
            title: 'DELETE PAYMENT TYPE',
            text: 'Are you sure you want to delete this payment type ?',
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
                                url: '/Setup/DeletePaymentType',
                                type: 'post',
                                datatype: 'json',
                                data: {
                                    id: $("#PaymentTypeID").val()
                                },
                                async: false,
                                cache: false,
                                success: function (data) {
                                    if (!JSON.parse(data.Result)) {
                                        if (parseInt(data.ErrorStyle) != 0) {
                                            toastr["error"](data.ErrorMessage, "Error");
                                        } else {
                                            toastr["error"]("Delete data failed. Please contact the developer to fix it.", "Error");
                                            console.log("Xóa dữ liệu thất bại: " + data.ErrorMessage);
                                        }
                                    }
                                    else {
                                        toastr["success"]("Delete data successfully", "Notification");
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
                        toastr["success"]("Data saved successfully.", "Notification");
                        $('#actionModal').modal("hide");
                        setTimeout("table.ajax.reload()", 500);
                    }
                };
                $("form").AddOrUpdateForm("/Setup/AddOrUpdatePaymentType", success);
            } else
                instance.stop();
        }
    });
    //#endregion
})