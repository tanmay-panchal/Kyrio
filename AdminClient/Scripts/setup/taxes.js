var table;
$(function () {
    //#region Load data && setup control
    CreateBreadcrumb([{ href: "/Setup/Index", title: "Setup" }, { href: "/Setup/Taxes", title: "Taxes" }])
    table = $("#table").InStallDatatable(null, "/Setup/GetDataTableTaxes", [
         { "data": "TaxName", "name": "TaxName", "width": "30%", "class": "text-left" },
         {
             "data": "TaxRate", "name": "TaxRate", "width": "20%", "class": "text-left", "render": function (data) {
                 return data + "%";
             }
         },
    ], true, false, false, false, null, true);
    $('#actionForm').validate({
        rules: {
            TaxName: 'required',
        },
        messages: {
            TaxName: 'Please enter name',
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
    $("#containtButtonCreate").InStallButtonFooter("buttonCreate", "tittleButton", "New Tax Rate");

    //lay setting gan vao lable
    var loadtaxsetting = function () {
        $.RequestAjax("/Setup/GetBusinessSetting", JSON.stringify({
            SettingGroup: "Tax Settings"
        }), function (data) {
            if (data.data.length == 0) {
                $("#taxcalculation").text("including taxes");
                $("input[name=config_tax_calculation]").iCheck('uncheck');
                $("input[name=config_tax_calculation][value='include']").iCheck('check');
            }
            else {
                $.each(data.data, function () {
                    if (this.SettingCode == 'config_tax_calculation') {
                        if (this.Value == 'exclude') {
                            $("#taxcalculation").text("excluding taxes");
                            //$("input[name=config_tax_calculation][value='exclude']").prop("checked", true);
                            $("[name='config_tax_calculation']").iCheck('uncheck');
                            $("#config_tax_calculation").iCheck('check');
                        }
                        else {
                            $("#taxcalculation").text("including taxes");
                            //$("input[name=config_tax_calculation][value='include']").prop("checked", true);
                            $("[name='config_tax_calculation']").iCheck('check');
                            $("#config_tax_calculation").iCheck('uncheck');
                        }
                    }
                })
            }
        }, function () {
        })
    }

    loadtaxsetting();
    //#endregion

    //#region event 
    $(document).on("click", "#table tbody tr td", function () {
        var data = table.row($(this).closest("tr")).data();
        $("#TitleModal").text("Edit Tax Rate");
        $("#TaxID").val(data.TaxID);
        $("#TaxName").val(data.TaxName);
        $("#TaxRate").val(data.TaxRate);
        $('#deleteButton').show();
        $('#actionModal').modal("show");
    })
    $("#containtButtonCreate").click(function () {
        $("#TitleModal").text("New Tax Rate");
        $("#TaxID").val(0);
        $("#TaxName").val("");
        $("#TaxRate").val(0);
        $('#deleteButton').hide();
        $('#actionModal').modal("show");
    })
    $("#deleteButton").click(function () {
        PNotify.notice({
            title: 'DELETE TAX',
            text: 'Are you sure you want to delete this tax ?',
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
                                url: '/Setup/DeleteTax',
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

    $("#changetaxcalculation").click(function () {
        //lay setting gan vao radio button
        loadtaxsetting();
        $('#actionModalSetting').modal("show");
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
                $("form").AddOrUpdateForm("/Setup/AddOrUpdateTax", success);
            } else
                instance.stop();
        }
    });
    //save tax setting
    Ladda.bind('#actionButtonSaveSetting', {
        callback: function (instance) {
            instance.start();
            //debugger;
            var BusinessSettings = [];
            BusinessSettings.push({
                SettingCode: $("input[name=config_tax_calculation][value='include']").attr("name"),
                SettingGroup: "",
                BussinessID: 0,
                Value: $("input:radio[name='config_tax_calculation'][value='include']").is(":checked") == true ? "include" : "exclude",
                Description: "",
            })

            $.ajax({
                url: "/Setup/SaveBusinessSettings",
                type: 'post',
                datatype: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    businessSettings: BusinessSettings,
                }),
                async: true,
                cache: false,
                success: function (data) {
                    $('#actionModalSetting').modal("hide");
                    loadtaxsetting();
                    instance.stop();
                    if (!JSON.parse(data.Result)) {
                        toastr["error"](data.ErrorMessage, "Error");
                        console.log("Dữ liệu lưu thất bại. Lỗi: " + data.ErrorMessage);
                    } else {
                        toastr["success"](data.ErrorMessage, "Notification");
                    }
                }
            })
        }
    });
    //#endregion
})