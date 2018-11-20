var prefixFileMobileComboboxService = "/ContentHtml/AddComboboxService/Mobile";
var LinkFileMobileComboboxService = {
    AddService: {
        Index: prefixFileMobileComboboxService + "/Index.html",
        Service: prefixFileMobileComboboxService + "/Service.html",
        ServiceGroup: prefixFileMobileComboboxService + "/ServiceGroup.html",
    },
};
class MobileService {
    constructor(callBackComplete, callBackHideModal) {
        this.Modal = null;
        this.HTML = {
            Index: null,
            Service: null,
            ServiceGroup: null,
        };
        this.Parameter = {
            CallBackComplete: callBackComplete,
            CallBackHideModal: callBackHideModal
        };
        this.Data = [];
    }

    //#region Private
    CreatEvent() {
        var that = this;
        this.Modal.find("#searchService").keyup(function () {
            that.LoadDataService();
        });
        this.Modal.find("[name='item-service']").click(function () {
            that.HideModal();
            if (that.Parameter.CallBackComplete) {
                var ServiceID = $(this).attr("serviceid");
                var itemService;
                $.each(that.Data, function (index, item) {
                    if (Array.isArray(item.Service)) {
                        itemService = item.Service.find(function (element) {
                            return parseInt(element.ServiceID) == parseInt(ServiceID);
                        });
                        if (itemService != null && itemService != undefined)
                            return false;
                    }
                });
                that.Parameter.CallBackComplete(itemService);
            }
        })
        this.Modal.find("[name='closeModal']").click(function () {
            that.HideModal(true);
        })
    }
    RemoveEvent() {
        this.Modal.find("#searchService").off("keyup");
        this.Modal.find("[name='item-service']").off("click");
        this.Modal.find("[name='closeModal']").off("click");
    }
    LoadDataService() {
        var that = this;
        var input = that.Modal.find("#searchService");
        var value = $.trim(input.val());
        $.RequestAjax("/Calendar/GetComboboxServiceAppointment", JSON.stringify({ search: value }), function (data) {
            that.Modal.find("#container-service").html("");
            that.Data = data.Result;
            $.each(data.Result, function (index, item) {
                var htmlService = "";
                $.each(item.Service, function () {
                    htmlService += that.HTML.Service.replace("@ServiceName", this.ServiceName)
                        .replace("@SpecialPrice", parseInt(this.SpecialPrice) == 0 ? this.RetailPrice : this.SpecialPrice)
                        .replace("@DurationName", this.DurationName ? this.DurationName : "")
                        .replace("@RetailPrice", parseInt(this.SpecialPrice) == 0 ? "" : this.RetailPrice)
                        .replace("@ServiceID", this.ServiceID);
                })
                that.Modal.find("#container-service").append(that.HTML.ServiceGroup.replace("@AppointmentColor", item.AppointmentColor)
                    .replace("@ServiceGroupName", item.ServiceGroupName)
                    .replace("@LS_SERVICE", htmlService));
            });
        })
    }
    //#endregion

    //#region Public
    OpenModal() {
        var that = this;
        if (this.HTML.Index == null || this.HTML.Service == null || this.HTML.ServiceGroup == null) {
            $.RequestAjaxText(LinkFileMobileComboboxService.AddService.Index, function (data) { that.HTML.Index = data; });
            $.RequestAjaxText(LinkFileMobileComboboxService.AddService.Service, function (data) { that.HTML.Service = data; });
            $.RequestAjaxText(LinkFileMobileComboboxService.AddService.ServiceGroup, function (data) { that.HTML.ServiceGroup = data; });
        }
        if (that.Modal == null || that.Modal == undefined) {
            that.Modal = $(that.HTML.Index);
            $("body").append(that.Modal);
        }
        that.Modal.show("slow");
        that.LoadDataService();
        that.CreatEvent();
    }
    HideModal(isCallCallBack) {
        if (this.Modal != null) {
            this.Modal.hide();
            this.RemoveEvent();
        }
        if (this.Parameter.CallBackHideModal && isCallCallBack == true)
            this.Parameter.CallBackHideModal();
    }
    RemoveModal() {
        if (this.Modal != null) {
            this.RemoveEvent();
            this.Modal.remove();
        }
    }
    //#endregion

}