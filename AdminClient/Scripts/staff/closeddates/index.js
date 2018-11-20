var table;
$(function () {
    //#region Method Add data location
    $.fn.extend({
        AddDataLocation: function (data, nameInputLocation) {
            if ($(this).is("div")) {
                if (Array.isArray(data)) {
                    var that = this;
                    $(this).html("");
                    $.each(data, function () {
                        var html = '<div class="col-fhd-12 col-xlg-12 col-md-12 col-sm-12 col-xs-12"><hr><div class="btn-block btn-checkbox" name="locationCloseDay">'
                                   + '<input type="checkbox" name="' + nameInputLocation + '" locationID="' + this.LocationID + '"/> <strong style="margin-left: 5px">' + this.LocationName + "</strong>"
                                   + '</div></div>';
                        $(that).append(html);
                    })
                }
                $(document).on("click", "div[name='locationCloseDay']", function () {
                    $(this).find("input[type='checkbox']").iCheck('toggle');
                })
                $("input[type='checkbox']:not(.switch-input)").iCheck({
                    checkboxClass: 'icheckbox_flat-green',
                    radioClass: 'iradio_flat-green'
                });
            } else {
                console.log("Đối tượng không hợp lệ");
            }
        }
    })
    //#endregion

    //#region Load data && setup control
    CreateBreadcrumb([{ href: "/Home/Index", title: "Home" }, { href: "/Staff/CloseDate", title: "Closed Dates" }])
    $('#excuteCloseDate').modal({
        backdrop: false,
        show: false,
    })
    $('#excuteCloseDate').on('hidden.bs.modal', function (e) {
        $("body").find(".modal-backdrop").remove();
    })
    $('#excuteCloseDate').on('shown.bs.modal', function (e) {
        $("body").append('<div class="modal-backdrop fade show"></div>');
    })
    table = $("#tableCloseDay").InStallDatatable(null, "/Staff/GetDataTableCloseDay", [
      {
          "data": null, "name": null, "width": "30%", "class": "text-left", "render": function (data, type, row) {
              return moment(row.StartDate).format("ddd, DD MMM YYYY") + " - " + moment(row.EndDate).format("ddd, DD MMM YYYY");
          }
      },
      {
          "data": "NoOfDays", "name": "NoOfDays", "width": "10%", "class": "text-left", "render": function (data) {
              return parseInt(data) == 1 ? "1 Day" : data + " Days";
          }
      },
      { "data": "LocationName", "name": "LocationName", "width": "30%", "class": "text-left" },
      { "data": "Description", "name": "Description", "width": "30%", "class": "text-left" },
    ], false, false, false, false, 1, true, null, function () {
        if (this.api().rows().data().count() > 0) {
            $("#containtNotification").hide();
            $("#containtTable").show();
        } else {
            $("#containtNotification").show();
            $("#containtTable").hide();
        }
    });
    $.RequestAjax("/Staff/GetLocation", null, function (data) {
        if (JSON.parse(data.Error)) {
            toastr["error"]("Get data location failed. Please contact the developer to fix it.", "Error");
            console.log("Get data location failed: " + data.ErrorMessage);
        } else {
            $("#containtCloseDay").AddDataLocation(data.Result, "locationIDCloseDay");
        }
    })
    $('#RangerCloseDate').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        "linkedCalendars": false,
        "showCustomRangeLabel": false,
        "autoUpdateInput": false,
        "alwaysShowCalendars": true,
    });
    //#endregion

    //#region event
    $('#RangerCloseDate').on('apply.daterangepicker', function (ev, picker) {
        $('#RangerCloseDate').val($('#RangerCloseDate').data('daterangepicker').startDate.format("ddd, DD MMM YYYY") + " - " + $('#RangerCloseDate').data('daterangepicker').endDate.format("ddd, DD MMM YYYY"));
    });
    $("[name='createCloseDay']").click(function () {
        $("#TitleModalCloseDate").text("Create Closed Date");
        $("#ClosedDateID").val(0);
        $("#Description").val("");
        $('#RangerCloseDate').data('daterangepicker').setStartDate(moment(moment().tz(Window.TimeZone).format("YYYY-MM-DD")));
        $('#RangerCloseDate').data('daterangepicker').setEndDate(moment(moment().tz(Window.TimeZone).format("YYYY-MM-DD")));
        $('#RangerCloseDate').trigger("apply.daterangepicker");
        $("#checkAllCloseDate").iCheck('check');
        $("#deleteButtonCloseDay").hide();
        $('#excuteCloseDate').modal("show");
    })
    $("#checkAllCloseDate").on("ifChanged", function () {
        if (this.checked) {
            $("[name='locationIDCloseDay']").iCheck('check');
        } else {
            $("[name='locationIDCloseDay']").iCheck('uncheck');
        }
    })
    $("[name='locationIDCloseDay']").on("ifChanged", function () {
        var checkAll = $("#checkAllCloseDate")[0].checked;
        if ($("[name='locationIDCloseDay']:checked").length == $("[name='locationIDCloseDay']").length && this.checked && !checkAll)
            $("#checkAllCloseDate").iCheck('check');
        if (!this.checked && checkAll) {
            $("#checkAllCloseDate")[0].checked = false
            $("#checkAllCloseDate").iCheck('update');
        }
    })
    $(document).on("click", "#tableCloseDay tbody tr", function () {
        var data = table.row($(this)).data();
        $("#TitleModalCloseDate").text("Edit Closed Date");
        $("#ClosedDateID").val(data.ClosedDateID);
        $("#Description").val(data.Description);
        $('#RangerCloseDate').data('daterangepicker').setStartDate(moment(data.StartDate)._d);
        $('#RangerCloseDate').data('daterangepicker').setEndDate(moment(data.EndDate)._d);
        $('#RangerCloseDate').trigger("apply.daterangepicker");
        $("#checkAllCloseDate").iCheck(data.Locations.length > 0 ? 'uncheck' : 'check');
        $.each(data.Locations, function () {
            $("[locationID='" + this.LocationID + "']").iCheck('check');
        })
        $("#deleteButtonCloseDay").show();
        $('#excuteCloseDate').modal("show");
    })
    //#endregion

    //#region Save, Delete
    $('#excuteFormCloseDay').validate({
        rules: {
            Description: {
                required: true,
                maxlength: 200
            }
        },
        messages: {
            Description: {
                required: 'Please enter description',
                maxlength: 'Length must not exceed 200 characters',
            }
        },
        errorElement: 'em',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            error.insertAfter(element);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid').removeClass('is-valid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass('is-valid').removeClass('is-invalid');
        },
    });
    Ladda.bind('#excuteButtonCloseDay', {
        callback: function (instance) {
            instance.start();
            if ($("#excuteFormCloseDay").valid()) {
                var CloseLocations = [];
                $("[name='locationIDCloseDay']").each(function () {
                    if (this.checked) {
                        CloseLocations.push({
                            LocationID: $(this).attr("locationID")
                        });
                    }
                })
                $.RequestAjax("/Staff/SaveCloseDate", JSON.stringify({
                    entity: {
                        ClosedDateID: $("#excuteFormCloseDay #ClosedDateID").val(),
                        StartDate: $('#RangerCloseDate').data('daterangepicker').startDate._d,
                        EndDate: $('#RangerCloseDate').data('daterangepicker').endDate._d,
                        Description: $("#excuteFormCloseDay #Description").val(),
                        NoOfDays: $('#RangerCloseDate').data('daterangepicker').endDate._d.subtract($('#RangerCloseDate').data('daterangepicker').startDate._d)
                    },
                    CloseLocations: CloseLocations,
                    isUpdate: $("#excuteFormCloseDay #ClosedDateID").val() != 0,
                }), function (data) {
                    toastr["success"]("Data saved successfully.", "Notification");
                    $('#excuteCloseDate').modal("hide");
                    setTimeout("table.ajax.reload()", 500);
                }, function () {
                    instance.stop();
                })
            } else
                instance.stop();
        }
    });
    Ladda.bind('#deleteButtonCloseDay', {
        callback: function (instance) {
            instance.start();
            $.RequestAjax("/Staff/DeleteCloseDate", JSON.stringify({
                id: $("#excuteFormCloseDay #ClosedDateID").val(),
            }), function (data) {
                toastr["success"]("Delete saved successfully.", "Notification");
                $('#excuteCloseDate').modal("hide");
                setTimeout("table.ajax.reload()", 500);
            }, function () {
                instance.stop();
            })
        }
    });
    //#endregion
})