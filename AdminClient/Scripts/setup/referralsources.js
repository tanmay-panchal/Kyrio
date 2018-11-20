var table;
$(function () {
    //#region Load data && setup control
    CreateBreadcrumb([{ href: "/Setup/Index", title: "Setup" }, { href: "/Setup/ReferralSources", title: "Referral Sources" }])
    table = $("#table").InStallDatatable(null, "/Setup/GetDataTableReferralSources", [
        {
            "data": null, "name": null, "width": "5%", "class": "text-center", "render": function (data, type, row) {
                return '<i class="icon-menu icons "></i>';
            }
        },
         { "data": "ReferralSourceName", "name": "ReferralSourceName", "width": "55%", "class": "text-left" },
         { "data": "CreateDate", "name": "CreateDate", "width": "20%", "class": "text-left", "render": function (data) { return (data == "" ? data : moment(data).format("dddd, DD MMM YYYY")); } },
         { "data": "IsActive", "name": "IsActive", "width": "10%", "class": "text-left", "render": function (data, type, row) { return row.IsActive == true ? '<span class="badge badge-success" style="width:70px">ACTIVE</span>' : '<span class="badge badge-secondary" style="width:70px">INACTIVE</span>'; } },
         { "data": "IsDefault", "name": "IsDefault", "width": "10%", "class": "text-center", "render": function (data, type, row) { return row.IsDefault == true ? '<i class="fa fa-lock fa-lg" data-toggle="tooltip" data-placement="top" title="" data-original-title="This item can not be deleted"></i>' : ''; } },
    ], true, false, false, false, null, true, null, null, null, {
        "rowReorder": true
    });
    table.on('row-reorder', function (e, diff, edit) {
        for (var i = 0, ien = diff.length ; i < ien ; i++) {
            var SortOrderNew = table.row(diff[i].newPosition).data().SortOrder;
            var ID = table.row(diff[i].node).data().ReferralSourceID;
            $.RequestAjax("/Setup/UpdateSortOrderReferralSource", JSON.stringify({
                ID: ID,
                SortOrderNew: SortOrderNew,
            }))
        }
    })
    $('#actionForm').validate({
        rules: {
            ReferralSourceName: 'required',
        },
        messages: {
            ReferralSourceName: 'Please enter name',
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
    $("#containtButtonCreate").InStallButtonFooter("buttonCreate", "tittleButton", "New Referral Source");

    //#endregion

    //#region event 
    $(document).on("click", "#table tbody tr td", function () {
        var data = table.row($(this).closest("tr")).data();
        $("#TitleModal").text("Edit Referral Source");
        $("#ReferralSourceID").val(data.ReferralSourceID);
        $("#ReferralSourceName").val(data.ReferralSourceName);
        if (data.IsDefault) {
            $("#ReferralSourceName").attr("readonly", true);
            $('#deleteButton').hide();
            $('#actionButton').hide();
            $("#IsActive").prop('disabled', true);
        }
        else {
            $("#ReferralSourceName").attr("readonly", false);
            $("#IsActive").prop('disabled', false);
            $('#deleteButton').show();
            $('#actionButton').show();
        }
        $("#IsActive")[0].checked = data.IsActive;
        $('#IsActive').iCheck('update');
        $('#actionModal').modal("show");
    })
    $("#containtButtonCreate").click(function () {
        $("#ReferralSourceName").attr("readonly", false);
        $("#IsActive").prop('disabled', false);
        $('#actionButton').show();

        $("#TitleModal").text("New Referral Source");
        $("#ReferralSourceID").val(0);
        $("#ReferralSourceName").val("");
        $("#IsActive")[0].checked = true;
        $('#IsActive').iCheck('update');
        $('#deleteButton').hide();
        $('#actionModal').modal("show");
    })
    $("#deleteButton").click(function () {
        PNotify.notice({
            title: 'DELETE REFERRAL SOURCE',
            text: 'Are you sure you want to delete this referral source ?',
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
                                url: '/Setup/DeleteReferralSource',
                                type: 'post',
                                datatype: 'json',
                                data: {
                                    id: $("#ReferralSourceID").val()
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
                $("form").AddOrUpdateForm("/Setup/AddOrUpdateReferralSource", success);
            } else
                instance.stop();
        }
    });
    //#endregion
})