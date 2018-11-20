$(function () {
    //#region Method Add data detail service
    $.fn.extend({
        AddDataChangeStaff: function (data, nameChangeStaff) {
            if ($(this).is("div")) {
                if (Array.isArray(data)) {
                    var that = this;
                    $(this).html("");
                    $.each(data, function () {
                        var html = '<div class="col-fhd-6 col-xlg-6 col-md-6 col-sm-12 col-xs-6 "><hr><div class="btn btn-block btn-checkbox" name="userChangeStaff">'
                                   + '<input type="checkbox" ' + (this.ExcitLocation == true ? "checked" : "") + ' name="' + nameChangeStaff + '" userid="' + this.UserID + '"/> <strong style="margin-left: 5px">' + this.FirstName + " " + this.LastName + "</strong>"
                                   + '</div></div>';
                        $(that).append(html);
                    })
                }
                $(document).on("click", "div[name='userChangeStaff']", function () {
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
    $('#excuteChangeStaff').modal({
        backdrop: false,
        show: false,
    })
    $('#excuteChangeStaff').on('hidden.bs.modal', function (e) {
        $("body").find(".modal-backdrop").remove();
    })
    $('#excuteChangeStaff').on('shown.bs.modal', function (e) {
        $("body").append('<div class="modal-backdrop fade show"></div>');
        $.RequestAjax('/Staff/GetChangeStaff', JSON.stringify({
            LocationID: $("#LocationId").val(),
        }), function (data) {
            $("#TitleModalChangeStaff").text($("#select2-LocationId-container").text() + " Roster");
            $("#checkAllChangeStaff").iCheck('uncheck');
            if (data.Result.length == 0) {
                $("#checkAllChangeStaff").closest("div.form-group").hide();
                $("#excuteButtonChangeStaff").closest("div").hide();
            } else {
                $("#checkAllChangeStaff").closest("div.form-group").show();
                $("#excuteButtonChangeStaff").closest("div").show();
            }
            $("#containtChangeStaff").AddDataChangeStaff(data.Result, "useridChangeStaff");
            $("[name='useridChangeStaff']").trigger("ifChanged");
        })
    })
    //#endregion

    //#region event 
    $(document).on("ifChanged", "[name='useridChangeStaff']", function () {
        if ($("[name='useridChangeStaff']:checked").length == $("[name='useridChangeStaff']").length)
            $("#checkAllChangeStaff").iCheck('check');
        else
            $("#checkAllChangeStaff").iCheck('uncheck');
    })
    $(document).on('ifChanged', '#checkAllChangeStaff', function () {
        if (this.checked) {
            $("[name='useridChangeStaff']").attr("checked", true);
        } else {
            $("[name='useridChangeStaff']").removeAttr("checked");
        }
        $("[name='useridChangeStaff']").iCheck('update');
    });
    Ladda.bind('#excuteButtonChangeStaff', {
        callback: function (instance) {
            instance.start();
            var userLocations = [];
            debugger;
            $("[name='useridChangeStaff']").each(function () {
                if (this.checked) {
                    debugger;
                    userLocations.push({
                        UserID: $(this).attr("userid"),
                        LocationID: $("#LocationId").val()
                    });
                }
            })
            $.RequestAjax("/Staff/SaveDialogChangeStaff", JSON.stringify({
                UserLocations: userLocations,
                LocationID: $("#LocationId").val()
            }), function (data) {
                toastr["success"]("Data saved successfully.", "Notification");
                $('#excuteChangeStaff').modal("hide");
                $("#workinghourform #LocationId").trigger("change");
            }, function () {
                instance.stop();
            });
        }
    });
    //#endregion
})