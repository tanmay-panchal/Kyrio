$(function () {
    $.fn.extend({
        AddDataOrderStaff: function (data, nameOrderStaff) {
            var preGrproup = "";
            var htmlgroup = '<div class="row"> '
                    + '<div style="width: 60%"> <strong style="margin-left: 5px"> GROUPNAME </strong> </div> '
                    + '<div style="width: 10%"> <strong> LOW </strong> </div> '
                    + '<div style="width: 10%"> <strong> MEDIUM </strong> </div> '
                    + '<div style="width: 10%"> <strong> HIGH </strong> </div> '
                    + '<div style="width: 10%"> <strong> OWNER </strong> </div> '
                    + '</div>';
            if ($(this).is("div")) {
                if (Array.isArray(data)) {
                    var that = this;
                    var html = '';


                    $.each(data, function () {
                        if (preGrproup != this.FunctionGroup) {
                            html = htmlgroup.replace("GROUPNAME", this.FunctionGroup);
                            $(that).append(html);
                        }
                        preGrproup = this.FunctionGroup;

                        html = '<div class="row">';

                        html = html + '<div style="width: 60%"> <lable style="margin-left: 15px"> ' + this.FormName + ' </lable> </div>';

                        html = html + '<div style="width: 10%">' + '<div class="btn btn-block btn-checkbox" name="orderStaff">'
                                   + '<input type="checkbox" formcode="' + this.FormCode + '" role="Low" orderstaffid="0" name="' + nameOrderStaff + '" userid="Low_' + this.FormCode + '"/> '
                                   + '</div> </div>';

                        html = html + '<div style="width: 10%">' + '<div class="btn btn-block btn-checkbox" name="orderMedium">'
                                   + '<input type="checkbox" formcode="' + this.FormCode + '" role="Medium" orderstaffid="0" name="' + nameOrderStaff + '" userid="Medium_' + this.FormCode + '"/> '
                                   + '</div> </div>';

                        html = html + '<div style="width: 10%">' + '<div class="btn btn-block btn-checkbox" name="orderStaff">'
                                   + '<input type="checkbox" formcode="' + this.FormCode + '" role="High" orderstaffid="0" name="' + nameOrderStaff + '" userid="High_' + this.FormCode + '"/> '
                                   + '</div> </div>';

                        html = html + '<div style="width: 10%">' + '<div class="btn btn-block btn-checkbox" name="orderStaff">'
                                  + '<input type="checkbox" formcode="' + this.FormCode + '" role="Owner" orderstaffid="0" name="' + nameOrderStaff + '" userid="Owner_' + this.FormCode + '"/> '
                                  + '</div> </div>';
                        html = html + ' </div>';
                        $(that).append(html);
                    })

                }
                $(document).on("click", "div[name='orderStaff']", function () {
                    //debugger;
                    $(this).find("input[type='checkbox']").iCheck('toggle');
                })
                //debugger;
                $("input[type='checkbox']:not(.switch-input)").iCheck({

                    checkboxClass: 'icheckbox_flat-green',
                    radioClass: 'iradio_flat-green'
                });
            } else {
                console.log("Đối tượng không hợp lệ");
            }
        },
    })

    $.ajax({
        url: '/Staff/GetDataTablePermission',
        type: 'post',
        datatype: 'json',
        contentType: 'application/json',
        async: false,
        cache: false,
        success: function (data) {
            if (JSON.parse(data.Error)) {
                toastr["error"]("Get data staff failed. Please contact the developer to fix it.", "Error");
                console.log("Get data staff failed: " + data.ErrorMessage);
            } else {
                var result = [];
                if (data.data.length > 0) {
                    $.each(data.data, function (index, item) {
                        result.push({
                            FormCode: this.FormCode,
                            FormName: this.FormName,
                            Low: this.Low,
                            Medium: this.Medium,
                            High: this.High,
                            Owner: this.Owner,
                            AllowChangeRole: this.AllowChangeRole,
                            FunctionGroup: this.FunctionGroup
                        })
                    })
                    if (result.length > 0)
                        data.data = result;
                }
                $("#containtServiceCustomer").AddDataOrderStaff(result, "useridOrderStaff");

                var ServiceCustomers = data.data;

                $.each(ServiceCustomers, function (index, item) {
                    if (item.Low) {
                        $("[userid='Low_" + item.FormCode + "']").iCheck('check');
                        $("[userid='Low_" + item.FormCode + "']").attr("orderstaffid", 'Low_' + item.FormCode);
                    }
                    if (item.Medium) {
                        $("[userid='Medium_" + item.FormCode + "']").iCheck('check');
                        $("[userid='Medium_" + item.FormCode + "']").attr("orderstaffid", 'Medium_' + item.FormCode);
                    }
                    if (item.High) {
                        $("[userid='High_" + item.FormCode + "']").iCheck('check');
                        $("[userid='High_" + item.FormCode + "']").attr("orderstaffid", 'High_' + item.FormCode);
                    }
                    if (item.Owner) {
                        $("[userid='Owner_" + item.FormCode + "']").iCheck('check');
                        $("[userid='Owner_" + item.FormCode + "']").attr("orderstaffid", 'Owner_' + item.FormCode);
                    }
                })
            }
        }
    })

    Ladda.bind('#excuteButton', {
        callback: function (instance) {
            instance.start();
            var entity = new Object();
            var PermissionLevels = [];
            $("#containtServiceCustomer input[type='checkbox']:checked").each(function () {
                PermissionLevels.push({
                    FormCode: $(this).attr("formcode") ? $(this).attr("formcode") : '',
                    Low: $(this).attr("role") == 'Low' ? 1 : 0,
                    Medium: $(this).attr("role") == 'Medium' ? 1 : 0,
                    High: $(this).attr("role") == 'High' ? 1 : 0,
                    Owner: $(this).attr("role") == 'Owner' ? 1 : 0,
                })
            })
            //; debugger;
            $.ajax({
                url: "/Staff/UpdatePermissionLevel",
                type: 'post',
                datatype: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    PermissionLevels: PermissionLevels,
                }),
                async: true,
                cache: false,
                success: function (data) {
                    instance.stop();
                    if (!JSON.parse(data.Result)) {
                        toastr["error"]("Data failure. Please contact the developer to fix it.", "Error");
                        console.log("Dữ liệu lưu thất bại. Lỗi: " + data.ErrorMessage);
                    } else {
                        toastr["success"]("Data saved successfully.", "Notification");
                    }
                }
            })
        }
    });
})