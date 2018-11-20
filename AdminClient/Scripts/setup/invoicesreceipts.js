var table;
$(function () {
    CreateBreadcrumb([{ href: "/Setup/Index", title: "Setup" }, { href: "/Setup/InvoicesReceipts", title: "Invoices & Receipts" }])
    var loadTable = function () {
        table = $("#tableLocation").InStallDatatable(null, "/Setup/GetDataTableLocation", [
         { "data": "LocationName", "name": "LocationName", "width": "50%", "class": "text-left" },
         { "data": "InvoiceNoPrefix", "name": "InvoiceNoPrefix", "width": "20%", "class": "text-left" },
         { "data": "NextInvoiceNumber", "name": "NextInvoiceNumber", "width": "20%", "class": "text-left" },
         {
             "data": null, "name": null, "width": "10%", "class": "text-center", "render": function (data, type, row) {
                 return "<a name='change' style='color:#2B72BD'>Change</a>";
             },
         },
        ], true, false, false, false, null, true, null, null, null);
    }
    loadTable();
    //lay setting
    $.RequestAjax("/Setup/GetBusinessSetting", JSON.stringify({
        SettingGroup: "Invoices & Receipts"
    }), function (data) {
        $.each(data.data, function () {
            if (this.SettingCode == 'printReceipts') {
                if (this.Value == "0") {
                    $("#printReceipts").iCheck('uncheck');
                }
                else {
                    $("#printReceipts").iCheck('check');
                }
            }
            else if (this.SettingCode == 'saleShowCustomerInfo') {
                if (this.Value == "0") {
                    $("#saleShowCustomerInfo").iCheck('uncheck');
                }
                else {
                    $("#saleShowCustomerInfo").iCheck('check');
                }
            }
            else if (this.SettingCode == 'saleShowCustomerAddress') {
                if (this.Value == "0") {
                    $("#saleShowCustomerAddress").iCheck('uncheck');
                }
                else {
                    $("#saleShowCustomerAddress").iCheck('check');
                }
            }
            else if (this.SettingCode == 'customInvoiceTitle') {
                $("#customInvoiceTitle").val(this.Value);
            }
            else if (this.SettingCode == 'saleCustomHeader1') {
                $("#saleCustomHeader1").val(this.Value);
            }
            else if (this.SettingCode == 'saleCustomHeader2') {
                $("#saleCustomHeader2").val(this.Value);
            }
            else if (this.SettingCode == 'receiptMessage') {
                $("#receiptMessage").val(this.Value);
            }
        })
    }, function () {
    })
    $(document).on("click", "a[name='change']", function () {
        if (table != null) {
            var data = table.row($(this).closest("tr")).data();
            var LocationID = data.LocationID

            $("#TitleModal").text("Change Sequencing");
            $("#LocationID").val(data.LocationID);
            $("#LocationName").text('You are about to introduce this change for ' + data.LocationName);
            $("#InvoiceNoPrefix").val(data.InvoiceNoPrefix);
            $("#NextInvoiceNumber").val(data.NextInvoiceNumber);

            $('#actionModal').modal("show");
        }
    })

    $.validator.addMethod("requiredselect", function (value, element, arg) {
        return value != null && value != "" && value != "0";
    });
    $('#busiessForm').validate({
        rules: {

        },
        messages: {

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
    Ladda.bind('#excuteButton', {
        callback: function (instance) {
            instance.start();
            if ($("#busiessForm").valid()) {
                var BusinessSettings = [];
                $("#busiessForm").find("[ispropertiesmodel]").each(function () {
                    if ($(this).is("input[type='text'],input[type='number'],input[type='email'],textarea,select,input[type='hidden'],input[type='password']"))
                        BusinessSettings.push({
                            SettingCode: $(this).attr("id"),
                            SettingGroup: "",
                            BussinessID: 0,
                            Value: $(this).val(),
                            Description: "",
                        })
                    if ($(this).is("input[type='checkbox'],input[type='radio']"))
                        BusinessSettings.push({
                            SettingCode: $(this).attr("id"),
                            SettingGroup: "",
                            BussinessID: 0,
                            Value: this.checked == true ? "1" : "0",
                            Description: "",
                        })
                });

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
                        instance.stop();
                        if (!JSON.parse(data.Result)) {
                            toastr["error"](data.ErrorMessage, "Error");
                            console.log("Dữ liệu lưu thất bại. Lỗi: " + data.ErrorMessage);
                        } else {
                            toastr["success"](data.ErrorMessage, "Notification");
                        }
                    }
                })
            } else
                instance.stop();
        }
    });
    //save Change Sequencing
    Ladda.bind('#actionButton', {
        callback: function (instance) {
            instance.start();

            var LocationID = $("#LocationID").val();
            var InvoiceNoPrefix = $("#InvoiceNoPrefix").val();
            var NextInvoiceNumber = $("#NextInvoiceNumber").val();

            $.ajax({
                url: "/Setup/SaveChangeSequencing",
                type: 'post',
                datatype: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    LocationID: LocationID,
                    InvoiceNoPrefix: InvoiceNoPrefix,
                    NextInvoiceNumber: NextInvoiceNumber
                }),
                async: true,
                cache: false,
                success: function (data) {
                    $('#actionModal').modal("hide");
                    instance.stop();
                    if (!JSON.parse(data.Result)) {
                        toastr["error"](data.ErrorMessage, "Error");
                        console.log("Dữ liệu lưu thất bại. Lỗi: " + data.ErrorMessage);
                    } else {
                        toastr["success"](data.ErrorMessage, "Notification");
                        setTimeout("table.ajax.reload()", 500);
                    }
                }
            })
        }
    });
})