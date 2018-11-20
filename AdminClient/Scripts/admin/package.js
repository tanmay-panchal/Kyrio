var table;
$(function () {
    //#region Load data && setup control
    CreateBreadcrumb([{ href: "/AdminSetting/Index", title: "Settings" }])
    table = $("#table").InStallDatatable(null, "/AdminSetting/GetDataTablePackage", [
         { "data": "PackageName", "name": "PackageName", "width": "60%", "class": "text-left" },
         { "data": "PricePerMonth", "name": "PricePerMonth", "width": "60%", "class": "text-right" },
    ], true, false, false, false, null, true, null, null, null, null);
    $('#actionForm').validate({
        rules: {
            PackageName: 'required',
        },
        messages: {
            PackageName: 'Please enter name',
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
    $("#containtButtonCreate").InStallButtonFooter("buttonCreate", "tittleButton", "New Package");

    //#endregion

    //#region event 
    $(document).on("click", "#table tbody tr td", function () {
        var data = table.row($(this).closest("tr")).data();
        $("#TitleModal").text("Edit Package");
        $("#PackageID").val(data.PackageID);
        $("#PackageName").val(data.PackageName);
        $("#PricePerMonth").val(data.PricePerMonth);
        $("#Description").val(data.Description);
        $('#deleteButton').show();
        $('#actionModal').modal("show");
    })
    $("#containtButtonCreate").click(function () {
        $('#actionButton').show();
        $("#TitleModal").text("New Package");
        $("#PackageID").val(0);
        $("#PackageName").val("");
        $("#PricePerMonth").val(0);
        $("#Description").val("");
        $('#deleteButton').hide();
        $('#actionModal').modal("show");
    })
    $("#deleteButton").click(function () {
        PNotify.notice({
            title: 'DELETE PACKAGE',
            text: 'Are you sure you want to delete this package ?',
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
                                url: '/AdminSetting/DeletePackage',
                                type: 'post',
                                datatype: 'json',
                                data: {
                                    id: $("#PackageID").val()
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
                        toastr["error"](data.ErrorMessage, "Error");
                    } else {
                        toastr["success"](data.ErrorMessage, "Notification");
                        $('#actionModal').modal("hide");
                        setTimeout("table.ajax.reload()", 500);
                    }
                };
                $("form").AddOrUpdateForm("/AdminSetting/AddOrUpdatePackage", success);
            } else
                instance.stop();
        }
    });
    //#endregion
})