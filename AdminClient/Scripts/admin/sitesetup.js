$(function () {
    CreateBreadcrumb([{ href: "/AdminSetting/Index", title: "Settings" }])
    $('[iscolorpicker]').InstallColorPicker();
    Ladda.bind('#excuteButton', {
        callback: function (instance) {
            instance.start();
            if ($("#AdminSettingsForm").valid()) {
                var lsConfigs = [];
                $("#AdminSettingsForm").find("[ispropertiesmodel]").each(function (index, item) {

                    var id = $(item).attr("id");
                    var value;
                    if ($(item).is('textarea'))
                        value = $(item).val();
                    if ($(item).is('input'))
                        value = $(item).val();
                    if ($(item).is('[type="radio"]'))
                        value = item.checked ? 1 : 0;
                    var tittle = $.trim($("#lbl" + id).text());
                    lsConfigs.push(new Object({
                        ConfigID: id,
                        Description: tittle,
                        Description2: tittle,
                        Value: value
                    }));
                })

                $.ajax({
                    url: "/AdminSetting/SaveConfig",
                    type: 'post',
                    datatype: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        EntityConfigs: lsConfigs,
                    }),
                    async: true,
                    cache: false,
                    success: function (data) {
                        instance.stop();
                        if (!JSON.parse(data.Result)) {
                            toastr["error"]("Save data failure. Please contact the developer to fix it.", "Error");
                            console.log("Dữ liệu lưu thất bại. Lỗi: " + data.ErrorMessage);
                        } else {
                            toastr["success"]("Data saved successfully.", "Notification");
                        }
                    }
                })
            } else
                instance.stop();
        }
    });
})