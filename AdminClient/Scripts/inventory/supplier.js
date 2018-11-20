//#region Method Support
//#endregion
var table;
$(function () {
    //#region Load data && setup control
    CreateBreadcrumb([{ href: "/Inventory/Inventory", title: "Inventory" }])
    var loadTable = function () {
        table = $("#table").InStallDatatable({
        }, "/Inventory/GetDataTableSupplier", [
     {
         "data": "SupplierName", "name": "SupplierName", "width": "40%", "class": "text-left"
     },
     {
         "data": "Telephone", "name": "Telephone", "width": "15%", "class": "text-left"
     },
     {
         "data": "Email", "name": "Email", "width": "15%", "class": "text-left"
     },
     {
         "data": "ProductAssigned", "name": "ProductAssigned", "width": "15%", "class": "text-right"
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
                searchPlaceholder: "Search by supplier name"
            }
        });
    }
    $("#containtButtonCreate").InStallButtonFooter("buttonCreate", "tittleButton", "New Supplier");
    $('#actionForm').validate({
        rules: {
            SupplierName: 'required'
        },
        messages: {
            SupplierName: 'Supplier name is required'
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
    $("#actionForm #CountryID").InStallSelect2('/Home/LoadSelect2ForCountry', 50, null, null);
    $("#actionForm #PCountryID").InStallSelect2('/Home/LoadSelect2ForCountry', 50, null, null);
    var loaddata = function () {
        if ($.fn.DataTable.isDataTable('#table'))
            table.destroy();

        loadTable();
    }
    loaddata();
    //#endregion

    //#region Event
    $("#SameAsPostalAddress").on("ifChanged", function () {
        var x = document.getElementById("divPostalAddress");
        if (this.checked) {
            x.style.display = 'none';
        } else {
            x.style.display = 'block';
        }
    })
    $("#containtButtonCreate, #btnNew").click(function () {
        $("#TitleModal").text("Add Supplier");
        $("#SupplierID").val(0);
        $("#SupplierName").val("");
        $("#Description").val("");
        $("#FirtName").val("");
        $("#LastName").val("");
        $("#MobileNumber").val("");
        $("#Email").val("");
        $("#Telephone").val("");
        $("#Website").val("");
        $("#Street").val("");
        $("#Suburb").val("");
        $("#City").val("");
        $("#State").val("");
        $("#ZipCode").val("");
        $("#CountryID").SetValueSelect2ID(Window.CountryID);
        $("#SameAsPostalAddress")[0].checked = true;
        var x = document.getElementById("divPostalAddress");
        x.style.display = 'none';
        $('#SameAsPostalAddress').iCheck('update');
        $("#PStreet").val("");
        $("#PSuburb").val("");
        $("#PCity").val("");
        $("#PState").val("");
        $("#PZipCode").val("");
        $("#PCountryID").SetValueSelect2ID(Window.CountryID);

        $('#deleteButton').hide();
        $('#actionModal').modal("show");
    })
    $(document).on("click", "#table tbody tr td", function () {
        var data = table.row($(this).closest("tr")).data();
        $("#TitleModal").text("Edit Supplier");

        $("#SupplierID").val(data.SupplierID);
        $("#SupplierName").val(data.SupplierName);
        $("#Description").val(data.Description);
        $("#FirtName").val(data.FirtName);
        $("#LastName").val(data.LastName);
        $("#MobileNumber").val(data.MobileNumber);
        $("#Email").val(data.Email);
        $("#Telephone").val(data.Telephone);
        $("#Website").val(data.Website);
        $("#Street").val(data.Street);
        $("#Suburb").val(data.Suburb);
        $("#City").val(data.City);
        $("#State").val(data.State);
        $("#ZipCode").val(data.ZipCode);
        $("#CountryID").SetValueSelect2ID(data.CountryID);
        $("#SameAsPostalAddress")[0].checked = data.SameAsPostalAddress;
        var x = document.getElementById("divPostalAddress");
        x.style.display = 'none';
        if (data.SameAsPostalAddress == false)
        {
            x.style.display = 'block';
        }
        $('#SameAsPostalAddress').iCheck('update');
        $("#PStreet").val(data.PStreet);
        $("#PSuburb").val(data.PSuburb);
        $("#PCity").val(data.PCity);
        $("#PState").val(data.PState);
        $("#PZipCode").val(data.PZipCode);
        $("#PCountryID").SetValueSelect2ID(data.PCountryID);

        $('#deleteButton').show();
        $('#actionModal').modal("show");
    })
    $("#deleteButton").click(function () {
        PNotify.notice({
            title: 'DELETE SUPPLIER',
            text: 'Are you sure you want to delete this supplier?',
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
                                url: '/Inventory/DeleteSupplier',
                                type: 'post',
                                datatype: 'json',
                                data: {
                                    id: $("#SupplierID").val()
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
                $("form").AddOrUpdateForm("/Inventory/SaveSupplier", success);
            } else
                instance.stop();
        }
    });
    $("#MobileNumber").keyup(function () {
        $("#MobileNumber").val(this.value.match(/[0-9]*/));
    });
    $("#Telephone").keyup(function () {
        $("#Telephone").val(this.value.match(/[0-9]*/));
    });
    //#endregion
})