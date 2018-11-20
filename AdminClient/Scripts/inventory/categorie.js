//#region Method Support
//#endregion
var table;
$(function () {
    //#region Load data && setup control
    CreateBreadcrumb([{ href: "/Inventory/Inventory", title: "Inventory" }])
    var loadtable = function () {
        table = $("#table").InStallDatatable({
        }, "/Inventory/GetDataTableCategory", [
     {
         "data": "CategoryName", "name": "CategoryName", "width": "60%", "class": "text-left"
     },
     {
         "data": "ProductAssigned", "name": "ProductAssigned", "width": "20%", "class": "text-right"
     },
     {
         "data": "ModifyDate", "name": "ModifyDate", "class": "text-left", "width": "20%", "render": function (data, type, row) {
             return row.ModifyDate == null ? moment(row.CreateDate).format(Window.FormatDateWithTimeJS) : moment(row.ModifyDate).format(Window.FormatDateWithTimeJS);
         }
     },
        ], true, true, true, false, 1, true, null, function (setting) {
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
        }, null, {
            language: {
                search: "",
                searchPlaceholder: "Search by category name"
            }
        });
    }
    var loaddata = function () {
        if ($.fn.DataTable.isDataTable('#table'))
            table.destroy();
        loadtable();
    }
    loaddata();
    $("#containtButtonCreate").InStallButtonFooter("buttonCreate", "tittleButton", "New Category");
    $('#actionForm').validate({
        rules: {
            CategoryName: 'required'
        },
        messages: {
            CategoryName: 'Category name is required'
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
    //#endregion

    //#region Event
    $("#containtButtonCreate, #btnNew").click(function () {
        $("#TitleModal").text("Add Category");
        $("#CategoryID").val(0);
        $("#CategoryName").val("");
        $('#deleteButton').hide();
        $('#actionModal').modal("show");
    })
    $(document).on("click", "#table tbody tr td", function () {
        var data = table.row($(this).closest("tr")).data();
        $("#TitleModal").text("Edit Category");
        $("#CategoryID").val(data.CategoryID);
        $("#CategoryName").val(data.CategoryName);
        $('#deleteButton').show();
        $('#actionModal').modal("show");
    })
    $("#deleteButton").click(function () {
        PNotify.notice({
            title: 'DELETE CATEGORY',
            text: 'Are you sure you want to delete this category?',
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
                                url: '/Inventory/DeleteCategory',
                                type: 'post',
                                datatype: 'json',
                                data: {
                                    id: $("#CategoryID").val()
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
                        toastr["error"](data.ErrorMessage, "Error");
                        console.log("Lưu dữ liệu thất bại. Lỗi: " + data.ErrorMessage);
                    } else {
                        toastr["success"](data.ErrorMessage, "Notification");
                        $('#actionModal').modal("hide");
                        setTimeout("table.ajax.reload()", 500);
                    }
                };
                $("form").AddOrUpdateForm("/Inventory/SaveCategory", success);
            } else
                instance.stop();
        }
    });
    //#endregion
})