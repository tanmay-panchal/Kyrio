var table;
$(function () {

    //#region Method Add data detail service
    $.fn.extend({
        AddRowDuration: function (item, isShowDelete) {
            if ($(this).is("table")) {
                var html = '<tr servicedurationid="' + (item.ServiceDurationID ? item.ServiceDurationID : 0) + '">'
                           + '<td><select style="width: 100%" urlselection="/Home/GetDurationBaseId" name="Duration">' + (item.Duration == "" ? "" : '<option value="' + item.Duration + '" selected>') + '</option></select></td>'
                           + '<td><input type="text" name="RetailPrice" class="form-control" value="' + item.RetailPrice + '" /></td>'
                           + '<td><input type="text" name="SpecialPrice" class="form-control" value="' + item.SpecialPrice + '"/></td>'
                           + '<td><div class="input-group"><input name="Caption" class="form-control" type="text" value="' + item.Caption + '"><span class="input-group-append">'
                           + (isShowDelete ? '<button name="deleteRowDetailService" class="btn btn-danger" type="button"><i class="icon-close icons"></i></button>' : "") + '</span></div></td>'
                           + '</tr>';
                $(this).find("tbody").append(html);
                $(this).find("[name='RetailPrice']:last").rules("add", {
                    validatorretailprice: "",
                });
                $(this).find("[name='SpecialPrice']:last").rules("add", {
                    validatorspecialprice: "",
                });
                $(this).find("[name='Duration']:last").rules("add", {
                    requiredselect: "",
                    messages: {
                        requiredselect: 'Please choose your duration',
                    }
                });
                $(this).find("tbody tr:last select[name='Duration']").InStallSelect2('/Home/LoadSelect2ForDuration', 20, 'Duration', null);
                $(this).find("tbody tr:last input[name='RetailPrice']").InStallInputMarsk(2, "", false);
                $(this).find("tbody tr:last input[name='SpecialPrice']").InStallInputMarsk(2, "", false);
                if (isShowDelete) {
                    $(this).find("tr").find("td:last, th:last").show();
                } else {
                    $(this).find("tr").find("td:last, th:last").hide();
                }
            } else {
                console.log("Đối tượng không hợp lệ");
            }
        },
        AddDataStaff: function (data, nameStaff) {
            if ($(this).is("div")) {
                if (Array.isArray(data)) {
                    var that = this;
                    $.each(data, function () {
                        var html = '<div class="col-fhd-6 col-xlg-6 col-md-6 col-sm-12 col-xs-6 "><hr><div class="btn btn-block btn-checkbox" name="userStaff">'
                                   + '<input type="checkbox" name="' + nameStaff + '" userid="' + this.UserID + '"/> <strong style="margin-left: 5px">' + this.FirstName + " " + (this.LastName == null ? "" : this.LastName) + "</strong>"
                                   + '</div></div>';
                        $(that).append(html);
                    })
                    $(this).attr("servicestaffid", data.ServiceStaffID ? data.ServiceStaffID : 0)
                }
                $(document).on("click", "div[name='userStaff']", function () {
                    $(this).find("input[type='checkbox']").iCheck('toggle');
                })
                $("input[type='checkbox']:not(.switch-input)").iCheck({
                    checkboxClass: 'icheckbox_flat-green',
                    radioClass: 'iradio_flat-green'
                });
            } else {
                console.log("Đối tượng không hợp lệ");
            }
        },
        AddDataResource: function (data, nameResource) {
            if ($(this).is("div")) {
                if (Array.isArray(data)) {
                    var that = this;
                    $.each(data, function () {
                        var html = '<div class="col-fhd-6 col-xlg-6 col-md-6 col-sm-12 col-xs-6 "><div class="card" locationid="' + this.LocationID + '">'
                                   + '<div class="card-header"><strong>' + this.LocationName + '</strong></div>'
                                   + '<div class="card-body">'
                                   + '@containtItem'
                                   + '</div></div></div>';
                        var containtItem = "";
                        if (this.Resources != null && this.Resources[0] != null) {
                            $.each(this.Resources, function (index, item) {
                                if (item)
                                    containtItem += '<div class="form-group"><input type="checkbox" name="' + nameResource + '" resourceid="' + item.ResourceID + '" /> ' + item.ResourceName + '</div>';
                            })
                            html = html.replace("@containtItem", containtItem);
                            $(that).append(html);
                        }
                    })
                    $(this).attr("serviceresourceid", data.ServiceResourceID ? data.ServiceResourceID : 0)
                    $("input[type='checkbox']:not(.switch-input)").iCheck({
                        checkboxClass: 'icheckbox_flat-green',
                        radioClass: 'iradio_flat-green'
                    });
                }
            } else {
                console.log("Đối tượng không hợp lệ");
            }
        }
    })
    //#endregion

    //#region Load data && setup control
    CreateBreadcrumb([{ href: "/Home/Index", title: "Home" }, { href: "/Service/Index", title: "Service" }])
    table = $("#tableService").InStallDatatable(null, "/Service/GetDataTableIndex", [
        {
            "data": null, "name": null, "width": "5%", "class": "text-center", "render": function (data, type, row) {
                return '<i class="icon-menu icons "></i>';
            }
        },
        {
            "data": null, "name": null, "width": "50%", "render": function (data, type, row) {
                return (row.IsGroup ? '<i style="padding-left: 5px; color:' + row.AppointmentColor + '" class="fa fa-circle"></i> <strong>' + row.ServiceGroupName + '</strong>' : '<span style="padding-left: 15px">' + row.ServiceName + '</span>') + '';
            }
        },
          {
              "data": null, "name": null, "width": "20%", "class": "text-right", "render": function (data, type, row) {
                  var html = '';
                  if (!row.IsGroup) {
                      $.each(row.ServiceDurations, function () {
                          html += '<span>' + this.DurationName + '</span></br>';
                      })
                  }
                  return html;
              }
          },
          {
              "data": null, "name": null, "width": "15%", "class": "text-right", "render": function (data, type, row) {
                  var html = '';
                  if (row.IsGroup) {
                      html = '<button type="button" style="float:right" name="createService" class="btn btn-success active hidden-xlg hidden-lg hidden-fhd hidden-rt hidden-rt15 hidden-8k hidden-uhd hidden-4k" aria-pressed="true"><i class="fa fa-plus"></i></button><button style="float:right" type="button" name="createService" class="btn btn-success active hidden-xs" aria-pressed="true">New Service</button>';
                  } else {
                      $.each(row.ServiceDurations, function () {
                          html += "<p style='margin-bottom:0px' ><span><u>" + Window.CurrencySymbol + "</u>" + (parseFloat(this.RetailPrice) > parseFloat(this.SpecialPrice) && parseFloat(this.SpecialPrice) != 0 ? "<del>" + $.number(this.RetailPrice, Window.NumberDecimal, '.', ',') + "</del>" : "<span>" + $.number(this.RetailPrice, Window.NumberDecimal, '.', ',') + "</span>") + "</span><span style='color:red; padding-left: 10px'>" + (parseFloat(this.SpecialPrice) == 0 ? "" : Window.CurrencySymbol + $.number(this.SpecialPrice, Window.NumberDecimal, '.', ',')) + "</span></p>";
                      })
                  }
                  return html;
              }
          },
    ], false, false, true, false, null, true, null, function (setting) {
        var api = this.api();
        $.each(api.rows().data(), function (index, item) {
            if (item.IsGroup) {
                $("#tableService tbody tr:eq(" + index + ")").attr("style", "background-color: rgba(0,0,0,.05)");
            } else {
                $("#tableService tbody tr:eq(" + index + ")").attr("style", "background-color: white");
            }
        })
        $("#tableService tbody tr:eq(0) td:eq(0)").css("width", "5%");
        $("#tableService tbody tr:eq(0) td:eq(1)").css("width", "50%");
        $("#tableService tbody tr:eq(0) td:eq(2)").css("width", "20%");
        $("#tableService tbody tr:eq(0) td:eq(3)").css("width", "15%");
    }, function (e, settings, json, xhr) {
        var result = [];
        if (json.data.length > 0) {
            var CurrencySymbol = json.CurrencySymbol.CurrencySymbol;
            $.each(json.data, function (index, item) {
                result.push({
                    ServiceGroupID: item.ServiceGroupID,
                    ServiceGroupName: item.ServiceGroupName,
                    AppointmentColor: item.AppointmentColor,
                    CurrencySymbol: CurrencySymbol,
                    IsGroup: true
                })
                $.each(item.Services, function () {
                    result.push({
                        ServiceGroupID: item.ServiceGroupID,
                        ServiceID: this.ServiceID,
                        ServiceName: this.ServiceName,
                        ServiceDurations: this.ServiceDurations,
                        CurrencySymbol: CurrencySymbol,
                        IsGroup: false
                    })
                })
            })
            if (result.length > 0)
                json.data = result;
        }
        return json;
    }, {
        "rowReorder": true
    });
    table.on('row-reorder', function (e, diff, edit) {
        //var UpdateSortOrder = function (ServiceIDDrag, ServiceIDBelow, ServiceGroupIDTo) {
        //    $.ajax({
        //        url: '/Service/UpdateSortOrderAfterDrop',
        //        type: 'post',
        //        datatype: 'json',
        //        contentType: 'application/json',
        //        data: JSON.stringify({
        //            ServiceIDDrag: ServiceIDDrag,
        //            ServiceIDBelow: ServiceIDBelow,
        //            ServiceGroupIDTo: ServiceGroupIDTo,
        //        }),
        //        async: false,
        //        cache: false,
        //        success: function (data) {
        //            if (!JSON.parse(data.Result)) {
        //                toastr["error"]("Update position failed. Please contact the developer to fix it.", "Error");
        //                console.log("Cập nhật vị trí thất bại. Lỗi: " + data.ErrorMessage);
        //            }
        //        }
        //    })
        //}
        //for (var i = 0, ien = diff.length ; i < ien ; i++) {
        //    var newData = table.row(diff[i].newPosition).data();
        //    var oldData = table.row(diff[i].node).data();
        //    UpdateSortOrder(LocationID, SortOrderNew);
        //}
    })
    $('#modalServiceGroup, #modalService').modal({
        backdrop: false,
        show: false,
    })
    $('#modalServiceGroup, #modalService').on('hidden.bs.modal', function (e) {
        $("body").find(".modal-backdrop").remove();
    })
    $('#modalServiceGroup, #modalService').on('shown.bs.modal', function (e) {
        $("body").append('<div class="modal-backdrop fade show"></div>');
    })

    //#region group service
    $('#serviceGroupForm').validate({
        rules: {
            ServiceGroupName: 'required',
        },
        messages: {
            LocationName: 'Please enter your group name',
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
    //load color default
    $.RequestAjax("/Home/GetDefaultColor", null, function (data) {
        $.each(data.Result, function () {
            $("#colorGroup").InstallButtonColor("AppointmentColor", "buttonAppointmentColor", this.DefaultColorCode);
        })
    })
    //#endregion

    //#region service
    $("#serviceForm #TreatmentType").InStallSelect2('/Home/LoadSelect2ForTreatmentType', 20, 'Treatment Type', null);
    $("#serviceForm #AvailableFor").InStallSelect2('/Home/LoadSelect2ForAvailableFor', 20, null, null);
    $("#serviceForm #TaxID").InStallSelect2('/Home/LoadSelect2ForTax', 20, 'Tax', null);
    $("#serviceForm #PricingType").InStallSelect2('/Home/LoadSelect2ForPricingType', 20, null, null);
    $("#serviceForm #ExtraTimeType").InStallSelect2('/Home/LoadSelect2ForExtraTimeType', 20, 'Extra Time Type', null);
    $("#serviceForm #ExtraTimeDuration").InStallSelect2('/Home/LoadSelect2ForDuration', 20, 'Duration', null);
    $("#serviceForm #VoucherExpiryPeriod").InStallSelect2('/Home/LoadSelect2ForVoucherExpiryPeriod', 20, 'Voucher Expiry Period', null);
    $.RequestAjax("/Service/GetStaff", null, function (data) {
        $("#containtStaff").AddDataStaff(data.Result, "useridStaff");
    })
    $.RequestAjax("/Service/GetResource", null, function (data) {
        $("#containtResource").AddDataResource(data.Result, "resourceidResource");
    })

    //#endregion

    //#endregion

    //#region event 

    //#region Group Service
    $(document).on("click", "#tableService tbody tr", function () {
        var data = table.row($(this)).data();
        if (data.IsGroup) {
            $("#TitleServiceGroupModal").text("Edit Service Group");
            $("#ServiceGroupID").val(data.ServiceGroupID);
            $("#ServiceGroupName").val(data.ServiceGroupName);
            $("#colorGroup .containtButtonColor:eq(0)").find("[type='radio']")[0].checked = true;
            $("#colorGroup .containtButtonColor").each(function () {
                if ($(this).find("[type='radio']").attr("valueColor") == data.AppointmentColor)
                    $(this).find("[type='radio']")[0].checked = true;
            })
            $("#deleteServiceGroupButton").show();
            $('#modalServiceGroup').modal("show");
        }
    })
    $("#createGroupButton").click(function () {
        $("#TitleServiceGroupModal").text("New Service Group");
        $("#ServiceGroupID").val(0);
        $("#ServiceGroupName").val("");
        $("#colorGroup .containtButtonColor:eq(0)").find("[type='radio']")[0].checked = true;
        $("#deleteServiceGroupButton").hide();
        $('#modalServiceGroup').modal("show");
    })
    $("#deleteServiceGroupButton").click(function () {
        PNotify.notice({
            title: 'DELETE SERVICE GROUP',
            text: 'Are you sure you want to delete this service group?',
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
                            $.RequestAjax("/Service/DeleteGroupService", JSON.stringify({
                                id: $("#ServiceGroupID").val(),
                            }), function (data) {
                                toastr["success"]("Delete data successfully", "Notification");
                                setTimeout("table.ajax.reload()", 500);
                            }, function () {
                                notice.close();
                                $('#modalServiceGroup').modal("hide");
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
    Ladda.bind('#actionServiceGroupButton', {
        callback: function (instance) {
            instance.start();
            if ($("#serviceGroupForm").valid()) {
                var success = function (data) {
                    instance.stop();
                    if (!JSON.parse(data.Result)) {
                        toastr["error"]("Save data failed. Please contact the developer to fix it.", "Error");
                        console.log("Lưu dữ liệu thất bại. Lỗi: " + data.ErrorMessage);
                    } else {
                        toastr["success"]("Data saved successfully.", "Notification");
                        $('#modalServiceGroup').modal("hide");
                        setTimeout("table.ajax.reload()", 500);
                    }
                };
                $("#serviceGroupForm").AddOrUpdateForm("/Service/AddOrUpdateGroupService", success, null, function (entity) {
                    entity.AppointmentColor = $("#serviceGroupForm #colorGroup [type='radio']:checked").attr("valuecolor");
                    return entity;
                });
            } else
                instance.stop();
        }
    });
    //#endregion

    //#region Service
    $(document).on("click", "[name='deleteRowDetailService']", function () {
        $(this).closest("tr").remove();
    })
    $("#newRowDetailService").click(function () {
        $("#tableDetailService").AddRowDuration({
            ServiceDurationID: 0,
            Duration: "",
            RetailPrice: 0,
            SpecialPrice: 0,
            Caption: ""
        }, true);
    })
    $("#PricingType").change(function () {
        $("#tableDetailService tbody tr:not(:eq(0))").remove();
        var item = {
            ServiceDurationID: 0,
            Duration: "",
            RetailPrice: 0,
            SpecialPrice: 0,
            Caption: ""
        }
        if ($(this).val() == null || $(this).val() == "" || $(this).val() == "single") {
            $("#newRowDetailService").hide();
            $("#tableDetailService").find("tr").find("td:last, th:last").hide();
        }
        else {
            $("#newRowDetailService").show();
            $("#tableDetailService").AddRowDuration(item, false);
        }
    })
    $("#serviceForm #ExtraTimeType").change(function () {
        if ($(this).val() == null || $(this).val() == "") {
            $('#serviceForm #ExtraTimeDuration').SetValueSelect2("", "Extra Time Duration");
            $('#serviceForm #ExtraTimeDuration').select2("enable", false);
        }
        else
            $('#serviceForm #ExtraTimeDuration').select2("enable");
    })
    $("#ResourceRequired").change(function () {
        if (this.checked) {
            $("#containtResource").show("slow");
        } else {
            $("#containtResource").hide("slow");
        }
    })
    $('#checkAllStaff').on('ifChecked', function (event) {
        if (this.checked) {
            $("[name='useridStaff']").iCheck('check');
        }
    });
    $('#EnableVoucherSales').on('ifChanged', function (event) {
        if (this.checked) {
            $("#containtVoucherExpiryPeriod").show();
        } else {
            $("#containtVoucherExpiryPeriod").hide();
            $("#VoucherExpiryPeriod").SetValueSelect2("", "Voucher Expiry Period");;
        }
    });
    $(document).on("ifChanged", "[name='useridStaff']", function () {
        if ($("[name='useridStaff']:checked").length == $("[name='useridStaff']").length)
            $("#checkAllStaff").iCheck('check');
        else
            $("#checkAllStaff").iCheck('uncheck');
    })
    $(document).on("click", "#tableService tbody tr button[name='createService']", function (event) {
        event.stopPropagation();
        var data = table.row($(this).closest("tr")).data();
        $("#TitleServiceModal").text("Create Service");
        $("#serviceForm #ServiceID").val("0");
        $("#serviceForm #ServiceGroupID").val(data.ServiceGroupID);
        $("#serviceForm #ServiceName").val("");
        $("#serviceForm #TreatmentType").SetValueSelect2("", "Treatment Type");
        $("#serviceForm #AvailableFor").SetValueSelect2("everyone", "Everyone");
        $("#serviceForm #PricingType").SetValueSelect2("single", "Single");
        $("#serviceForm #ExtraTimeType").SetValueSelect2("", "Extra Time Type");
        $("#serviceForm #VoucherExpiryPeriod").SetValueSelect2ID(Window.business_voucher_expiration_period);//gan default theo setting cua business
        $("#serviceForm #ExtraTimeDuration").SetValueSelect2("", "Extra Time Duration");
        $("#serviceForm #TaxID").SetValueSelect2("", "Tax");
        $('#serviceForm #ExtraTimeDuration').select2("enable", false);
        $("#serviceForm #EnableCommission").iCheck('check');
        $("#serviceForm #EnableCommission").iCheck('check');
        $("#serviceForm #EnableOnlineBookings").iCheck('check');
        $("#serviceForm #EnableVoucherSales").iCheck('check');
        $("#serviceForm #ServiceDescription").val("");
        $("#tableDetailService tbody").html("");
        $("#tableDetailService").AddRowDuration({
            ServiceDurationID: 0,
            Duration: "",
            RetailPrice: 0,
            SpecialPrice: 0,
            Caption: ""
        }, false);
        $('#checkAllStaff').iCheck('check');
        $("#ResourceRequired")[0].checked = false;
        $("#ResourceRequired").trigger("change");
        $("#containtResource").hide();
        $("[name='resourceidResource']").iCheck('uncheck');
        $("#newRowDetailService").hide();
        $("#deleteServiceButton").hide();
        $("#serviceForm a[href='#details']").trigger("click");
        $('#modalService').modal("show");
    })
    $(document).on("click", "#tableService tbody tr", function () {
        var data = table.row($(this)).data();
        $("#serviceForm #ServiceID").val(data.ServiceID);
        if (!data.IsGroup) {
            $.RequestAjax('/Service/GetEntityService', JSON.stringify({
                ServiceID: $("#serviceForm #ServiceID").val()
            }), function (data) {
                var Service = data.Result.Service.Service;
                var service = data.Result.Service;
                var ServiceDurations = data.Result.ServiceDurations;
                var ServiceStaffs = data.Result.ServiceStaffs;
                var ServiceResources = data.Result.ServiceResources;

                //fill service
                $("#TitleServiceModal").text("Edit Service");
                $("#serviceForm #ServiceID").val(Service.ServiceID);
                $("#serviceForm #ServiceGroupID").val(Service.ServiceGroupID);
                $("#serviceForm #ServiceName").val(Service.ServiceName);
                $("#serviceForm #TreatmentType").SetValueSelect2(Service.TreatmentType, service.TreatmentTypeName);
                $("#serviceForm #AvailableFor").SetValueSelect2(Service.AvailableFor, service.AvailableForName);
                $("#serviceForm #PricingType").SetValueSelect2(Service.PricingType, service.PricingTypeName);
                $("#serviceForm #ExtraTimeType").SetValueSelect2(Service.ExtraTimeType, service.ExtraTimeTypeName);
                $("#serviceForm #EnableCommission")[0].checked = Service.EnableCommission;
                $('#serviceForm #EnableCommission').iCheck('update');
                $("#serviceForm #EnableOnlineBookings")[0].checked = Service.EnableOnlineBookings;
                $('#serviceForm #EnableOnlineBookings').iCheck('update');
                $("#serviceForm #EnableVoucherSales")[0].checked = Service.EnableVoucherSales;
                $('#serviceForm #EnableVoucherSales').iCheck('update');
                $("#serviceForm #ResourceRequired")[0].checked = Service.ResourceRequired;
                $("#serviceForm #ResourceRequired").trigger("change");
                if (Service.EnableVoucherSales) {
                    $("#containtVoucherExpiryPeriod").show();
                } else {
                    $("#containtVoucherExpiryPeriod").hide();
                    $("#VoucherExpiryPeriod").SetValueSelect2("", "Voucher Expiry Period");;
                }
                $("#serviceForm #TaxID").SetValueSelect2(Service.TaxID, service.TaxName);
                $("#serviceForm #VoucherExpiryPeriod").SetValueSelect2(Service.VoucherExpiryPeriod, service.VoucherExpiryPeriodName);
                $("#serviceForm #ServiceDescription").val(Service.ServiceDescription);
                if (Service.PricingType == "0" || Service.PricingType == "") {
                    $('#serviceForm #ExtraTimeDuration').select2("enable", false);
                    $('#serviceForm #ExtraTimeDuration').SetValueSelect2("", "Extra Time Duration");
                } else {
                    $('#serviceForm #ExtraTimeDuration').select2("enable");
                    $("#serviceForm #ExtraTimeDuration").SetValueSelect2(Service.ExtraTimeDuration, service.DurationName);
                }

                //fill ServiceDuration
                $("#tableDetailService tbody").html("");
                $.each(ServiceDurations, function (index, item) {
                    if (item)
                        $("#tableDetailService").AddRowDuration(item, index > 1);
                })

                //fill ServiceStaff
                $("[name='useridStaff']").iCheck('uncheck');
                $.each(ServiceStaffs, function (index, item) {
                    if (item)
                        $("[name='useridStaff'][userid='" + item.UserID + "']").iCheck('check');
                })

                //fill ServiceResource
                $("[name='resourceidResource']").iCheck('uncheck');
                $.each(ServiceResources, function (index, item) {
                    if (item)
                        $("[name='resourceidResource'][resourceid='" + item.ResourceID + "']").iCheck('check');
                })

                if (ServiceDurations.length > 2)
                    $("#newRowDetailService").show();
                else
                    $("#newRowDetailService").hide();
                $("#deleteServiceButton").show();
                $("#serviceForm a[href='#details']").trigger("click");
                $('#modalService').modal("show");
            })
        }
    })
    //#endregion

    //#region save, delete
    $.validator.addMethod("requiredselect", function (value, element, arg) {
        return value != null && value != "" && value != "0";
    });
    $.validator.addMethod("validatorretailprice", function (value, element, arg) {
        value = $.isNumeric(value.replace(/,/gi, '')) ? value.replace(/,/gi, '') : 0;
        return parseInt(value) > 0;
    }, 'Is too small (must greater than zero)');
    $.validator.addMethod("validatorspecialprice", function (value, element, arg) {
        value = $.isNumeric(value.replace(/,/gi, '')) ? value.replace(/,/gi, '') : 0;
        var valueRetailPrice = $(element).closest("tr").find("[name='RetailPrice']").val().replace(/,/gi, '');
        return parseInt(value) < parseInt(valueRetailPrice);
    }, 'RetailPrice must be greater than SpecialPrice');
    $.validator.addMethod("validatorresource", function (value, element, arg) {
        if (value == "" && $("#containtResource input[type='checkbox']:checked").length == 0) {
            $("#serviceForm a[href='#resources']").trigger("click");
            return false;
        }
        return true;
    }, 'At least one resource is invalid');
    $('#serviceForm').validate({
        rules: {
            ServiceName: 'required',
            PricingType: 'requiredselect',
            TreatmentType: 'requiredselect',
            AvailableFor: 'requiredselect',
            Duration: 'requiredselect',
            RetailPrice: 'validatorretailprice',
            SpecialPrice: 'validatorspecialprice',
            ResourceRequired: 'validatorresource',
        },
        messages: {
            ServiceName: 'Please enter your service name',
            PricingType: 'Please choose your pricing type',
            TreatmentType: 'Please choose your treatment type',
            AvailableFor: 'Please choose your available for',
            Duration: 'Please choose your duration',
        },
        errorElement: 'em',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            if (element.prop('type') === 'checkbox') {
                error.insertAfter(element.parent('label'));
            } else {
                if (element.attr("name") == "Duration") {
                    element.closest("td").append(error);
                } else {
                    error.insertAfter(element);
                }
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid').removeClass('is-valid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass('is-valid').removeClass('is-invalid');
        },
    });
    $("#deleteServiceButton").click(function () {
        PNotify.notice({
            title: 'DELETE SERVICE',
            text: 'Are you sure you want to delete this service?',
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
                            $.RequestAjax('/Service/DeleteService', JSON.stringify({
                                id: $("#serviceForm #ServiceID").val()
                            }), function (data) {
                                toastr["success"]("Delete data successfully", "Notification");
                                setTimeout("table.ajax.reload()", 500);
                                $('#modalService').modal("hide");
                            }, function () {
                                notice.close();
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
    Ladda.bind('#actionServiceButton', {
        callback: function (instance) {
            instance.start();
            if ($("#serviceForm").valid() && $("[name='RetailPrice']").valid() && $("[name='SpecialPrice']").valid() && $("[name='Duration']").valid()) {
                if ($("#ResourceRequired")[0].checked && $("#containtResource input[type='checkbox']:checked").length == 0) {
                    toastr["error"]("At least one resource is invalid.", "Error");
                    $("#serviceForm a[href='#resources']").trigger("click");
                    instance.stop();
                    return false;
                }
                var entity = new Object();
                $("#serviceForm").find("[ispropertiesmodel]").each(function () {
                    if ($(this).is("input[type='text'],input[type='number'],input[type='email'],textarea,select,input[type='hidden'],input[type='password']"))
                        entity[$(this).attr("id")] = $(this).val() ? $(this).val() : "";
                    if ($(this).is("input[type='checkbox'],input[type='radio']"))
                        entity[$(this).attr("id")] = this.checked;
                    if ($(this).is("[isnumber]"))
                        entity[$(this).attr("id")] = entity[$(this).attr("id")].replace(/,/gi, '');
                    if ($(this).is("[isdate]") && $(this).val() != "") {
                        entity[$(this).attr("id")] = moment(entity[$(this).attr("id")], $(this).attr("formatdate")).format("YYYY/MM/DD");
                    }
                });
                var ServiceDurations = [];
                $("#tableDetailService tbody tr").each(function () {
                    ServiceDurations.push({
                        ServiceDurationID: $(this).attr("servicedurationid"),
                        ServiceID: $("#serviceForm #ServiceID").val(),
                        Duration: $(this).find("[name='Duration']").val(),
                        RetailPrice: $(this).find("[name='RetailPrice']").val().replace(/,/gi, ''),
                        SpecialPrice: $(this).find("[name='SpecialPrice']").val().replace(/,/gi, ''),
                        Caption: $(this).find("[name='Caption']").val(),
                    })
                })
                var ServiceStaffs = [];
                $("#containtStaff input[type='checkbox']:checked").each(function () {
                    ServiceStaffs.push({
                        ServiceStaffID: $("#containtStaff").attr("servicestaffid") ? $("#containtStaff").attr("servicestaffid") : 0,
                        ServiceID: $("#serviceForm #ServiceID").val(),
                        UserID: $(this).attr("userid") ? $(this).attr("userid") : 0,
                    })
                })
                var ServiceResources = [];
                $("#containtResource input[type='checkbox']:checked").each(function () {
                    ServiceResources.push({
                        ServiceResourceID: $("#containtResource").attr("serviceresourceid") ? $("#containtResource").attr("serviceresourceid") : 0,
                        ServiceID: $("#serviceForm #ServiceID").val(),
                        LocationID: $(this).closest("[locationid]").attr("locationid"),
                        ResourceID: $(this).attr("resourceid") ? $(this).attr("resourceid") : 0,
                    })
                })
                $.RequestAjax('/Service/AddOrUpdateService', JSON.stringify({
                    entity: entity,
                    ServiceDurations: ServiceDurations,
                    ServiceStaffs: ServiceStaffs,
                    ServiceResources: ServiceResources,
                    isUpdate: $("#serviceForm [ispropertiesidmodel]").val() != 0,
                }), function (data) {
                    toastr["success"]("Data saved successfully.", "Notification");
                    $('#modalService').modal("hide");
                    setTimeout("table.ajax.reload()", 500);
                }, function () {
                    instance.stop();
                })
            } else
                instance.stop();
        }
    });
    //#endregion

    //#endregion
})