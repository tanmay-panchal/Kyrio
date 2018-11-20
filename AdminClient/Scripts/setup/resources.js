var table;
$(function () {
    //#region Load data && setup control
    CreateBreadcrumb([{ href: "/Setup/Index", title: "Setup" }, { href: "/Setup/Resources", title: "Resources" }])
    var loadTable = function () {
        table = $("#datatable").InStallDatatable({
            "LocationID": $("#LocationIDIndex").val()
        }, "/Setup/GetDataTableResource", [
            {
                "data": null, "name": null, "width": "5%", "class": "text-center", "render": function (data, type, row) {
                    return '<i class="icon-menu icons "></i>';
                }
            },
         { "data": "ResourceName", "name": "ResourceName", "width": "50%", "class": "text-left" },
          { "data": "Description", "name": "Description", "width": "45%", "class": "text-left" },
        ], true, false, false, false, null, true, null, function (setting) {
            var api = this.api();
            var x = document.getElementById("nodata");
            x.style.display = 'none';

            var y = document.getElementById("divTable");
            y.style.display = 'block';
            if (api.rows().data().count() == 0) {
                x.style.display = 'block';
                y.style.display = 'none';
            }
        }, null, {
            "rowReorder": true
        });
        table.on('row-reorder', function (e, diff, edit) {
            for (var i = 0, ien = diff.length ; i < ien ; i++) {
                var SortOrderNew = table.row(diff[i].newPosition).data().SortOrder;
                var ResourceID = table.row(diff[i].node).data().ResourceID;
                $.RequestAjax("/Setup/UpdateSortOrderResource", JSON.stringify({
                    ResourceID: ResourceID,
                    SortOrderNew: SortOrderNew,
                }))
            }
        })
    }

    $('#actionForm').validate({
        rules: {
            ResourceName: 'required'
        },
        messages: {
            ResourceName: 'Please enter resource name'
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
    $("#containtButtonCreate").InStallButtonFooter("buttonCreate", "tittleButton", "New Resource");

    //#endregion
    $("#LocationIDIndex").InStallSelect2('/Home/LoadSelect2ForLocation', 20, 'Location', null);
    $("#actionForm #LocationID").InStallSelect2('/Home/LoadSelect2ForLocation', 20, 'Location', null);

    if ($("#dLocationID").val() != "" && $("#dLocationName").val() != "") {
        $("#LocationIDIndex").SetValueSelect2($("#dLocationID").val(), $("#dLocationName").val());
    }

    loadTable();

    //#region event 
    $(document).on("click", "#datatable tbody tr td", function () {
        var data = table.row($(this).closest("tr")).data();
        $("#TitleModal").text("Edit Resource");
        $("#ResourceID").val(data.ResourceID);
        $("#ResourceName").val(data.ResourceName);
        $("#Description").val(data.Description);
        //lay location name
        $.RequestAjax("/Home/GetLocationBaseId", JSON.stringify({
            id: data.LocationID,
        }), function (data) {
            $("#dLocationName").val(data.Text);
            $("#LocationID").SetValueSelect2($("#LocationIDIndex").val(), $("#dLocationName").val());
        }, function () {
        })
        //lay service
        $.RequestAjax("/Setup/GetServiceByResource", JSON.stringify({
            ResourceID: $("#ResourceID").val(),
            LocationID: $("#LocationIDIndex").val(),
        }), function (data) {
            $("#containService").html('');
            var has = document.getElementById("hasservice");
            var x = document.getElementById("noservice");
            x.style.display = 'none';
            has.style.display = 'none';
            if (data.data.length == 0) {
                x.style.display = 'block';
            }
            else
            {
                has.style.display = 'block';
                $.each(data.data, function () {
                    var html = '<div class="col-fhd-12 col-xlg-12 col-md-12 col-sm-12 col-xs-12 ">' + this.ServiceName + '</div>';
                    $("#containService").append(html);
                })
            }
        }, function () {
        })

        $('#deleteButton').show();
        $('#actionModal').modal("show");
    })
    $("#containtButtonCreate,#btnNew").click(function () {
        $("#TitleModal").text("New Resource");
        $("#ResourceID").val(0);
        $("#ResourceName").val("");
        $("#Description").val("");

        //lay location name
        $.RequestAjax("/Home/GetLocationBaseId", JSON.stringify({
            id: $("#LocationIDIndex").val(),
        }), function (data) {
            $("#dLocationName").val(data.Text);
            $("#LocationID").SetValueSelect2($("#LocationIDIndex").val(), $("#dLocationName").val());
        }, function () {
        })
        
        var x = document.getElementById("noservice");
        x.style.display = 'block';
        var has = document.getElementById("hasservice");
        has.style.display = 'none';

        $("#containService").html('');

        $('#deleteButton').hide();
        $('#actionModal').modal("show");
    })
    $("#deleteButton").click(function () {
        PNotify.notice({
            title: 'DELETE RESOURCE',
            text: 'Are you sure you want to delete this resource?',
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
                                url: '/Setup/DeleteResource',
                                type: 'post',
                                datatype: 'json',
                                data: {
                                    id: $("#ResourceID").val()
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
                $("form").AddOrUpdateForm("/Setup/AddOrUpdateResource", success);
            } else
                instance.stop();
        }
    });
    $(document).on("click", "#datatable thead tr th:eq(2), #datatable thead tr th:eq(3)", function () {
        var OrderDir = $(this).attr("aria-sort") ? $(this).attr("aria-sort") : "asc";
        var OrderName = "ResourceName";
        table.context[0].ajax.data = new Object({
            "OrderName": OrderName,
            "OrderDir": OrderDir
        });
        table.draw();
    })
    $("#LocationIDIndex").change(function () {
        if ($.fn.DataTable.isDataTable('#datatable'))
            table.destroy();
        loadTable();
    })
    //#endregion
})