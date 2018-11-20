var table;
$(function () {
    //#region Load data && setup control
    CreateBreadcrumb([{ href: "/Setup/Index", title: "Setup" }, { href: "/Setup/CancellationReasons", title: "Cancellation Reasons" }])
    table = $("#table").InStallDatatable(null, "/Setup/GetDataTableCancellationReasons", [
        {
            "data": null, "name": null, "width": "5%", "class": "text-center", "render": function (data, type, row) {
                return '<i class="icon-menu icons "></i>';
            }
        },
         { "data": "CancellationReasonName", "name": "CancellationReasonName", "width": "60%", "class": "text-left" },
         { "data": "CreateDate", "name": "CreateDate", "width": "20%", "class": "text-left", "render": function (data) { return (data == "" ? data : moment(data).format("dddd, DD MMM YYYY")); } },
         { "data": "IsDefault", "name": "IsDefault", "width": "10%", "class": "text-center", "render": function (data, type, row) { return row.IsDefault == true ? '<i class="fa fa-lock fa-lg" data-toggle="tooltip" data-placement="top" title="" data-original-title="This item can not be deleted"></i>' : ''; } },
    ], true, false, false, false, null, true, null, null, null, {
        "rowReorder": true
    });
    table.on('row-reorder', function (e, diff, edit) {
        for (var i = 0, ien = diff.length ; i < ien ; i++) {
            var SortOrderNew = table.row(diff[i].newPosition).data().SortOrder;
            var ID = table.row(diff[i].node).data().CancellationReasonID;
            $.RequestAjax("/Setup/UpdateSortOrderCancellationReason", JSON.stringify({
                ID: ID,
                SortOrderNew: SortOrderNew,
            }))
        }
    })
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
        backdrop: 'static',
        show: false,
    })
    $('#actionModal').on('hidden.bs.modal', function (e) {
        $("body").off();
    })
    $('#actionModal').on('shown.bs.modal', function (e) {
        $("body").enterKey(function () {
            $("#actionButton").trigger("click");
        })
    })
    $("#containtButtonCreate").InStallButtonFooter("buttonCreate", "tittleButton", "New Cancellation Reason");

    //#endregion

    //#region event 
    $(document).on("click", "#table tbody tr td", function () {
        var data = table.row($(this).closest("tr")).data();
        $("#TitleModal").text("Edit Cancellation Reason");
        $("#CancellationReasonID").val(data.CancellationReasonID);
        $("#CancellationReasonName").val(data.CancellationReasonName);
        if (data.IsDefault) {
            $("#CancellationReasonName").attr("readonly", true);
            $('#deleteButton').hide();
            $('#actionButton').hide();
        }
        else {
            $("#CancellationReasonName").attr("readonly", false);
            $('#deleteButton').show();
            $('#actionButton').show();
        }
        $('#actionModal').modal("show");
    })
    $("#containtButtonCreate").click(function () {
        $("#CancellationReasonName").attr("readonly", false);
        $('#actionButton').show();

        $("#TitleModal").text("New Cancellation Reason");
        $("#CancellationReasonID").val(0);
        $("#CancellationReasonName").val("");
        $('#deleteButton').hide();
        $('#actionModal').modal("show");
    })
    $("#deleteButton").click(function () {
        PNotify.notice({
            title: 'DELETE CANCELLATION REASON',
            text: 'Are you sure you want to delete this cancellation reason ?',
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
                                url: '/Setup/DeleteCancellationReason',
                                type: 'post',
                                datatype: 'json',
                                data: {
                                    id: $("#CancellationReasonID").val()
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
                $("form").AddOrUpdateForm("/Setup/AddOrUpdateCancellationReason", success);
            } else
                instance.stop();
        }
    });
    //#endregion
})