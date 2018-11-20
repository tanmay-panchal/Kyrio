var prefixFileMobileAddClient = "/ContentHtml/AddClient/Mobile";
var LinkFileMobileAddClient = {
    AddClient: {
        Index: prefixFileMobileAddClient + "/Index.html",
        ItemSearchClient: prefixFileMobileAddClient + "/ItemSearchClient.html",
    },
};
var LinkFileJSAddClient = {
    AddOrEditClient: "/Scripts/calendar/AddOrEditClient/mobile-action-addOrEditClient.js",
}

class MobileAddClient {
    constructor(callbackComplete, callBackHideModal) {
        var that = this;
        this.Modal = null;
        this.HTML = {
            Index: null,
            ItemSearchClient: null,
        };
        this.Data = {
            ClientID: 0,
            LsData: []
        }
        this.Parameter = {
            CallBackComplete: callbackComplete,
            CallBackHideModal: callBackHideModal,
        };

        if (typeof MobileAddOrEditClient != "function") 
            $.RequestAjaxSript(LinkFileJSAddClient.AddOrEditClient);

        that.PageModal = {
            AddOrEditClient: new MobileAddOrEditClient(function () {
                that.CallBackComplete_AddClient();
            }, function () {
                that.CallBackHide_AddClient();
            }),
        };
    }

    //#region Private
    CallBackComplete_AddClient() {
        this.Modal.show("slow");
        this.LoadDataSearchClient();
    }
    CallBackHide_AddClient() {
        this.Modal.show("slow");
    }
    CreatEvent() {
        var that = this;
        this.Modal.find("#searchClient").keyup(function () {
            that.LoadDataSearchClient();
        })
        this.Modal.on("click", "[name='item-client-search']", function () {
            var clientID = parseInt($(this).attr("clientid"));
            var item = that.Data.LsData.find(function (element) {
                return parseInt(element.ClientID) == parseInt(clientID);
            })
            that.HideModal();
            if (that.Parameter.CallBackComplete && item != undefined && item != null)
                that.Parameter.CallBackComplete(item);
        })
        this.Modal.find("[name='closeModal']").click(function () {
            that.HideModal();
        })
        this.Modal.find("#newClientButton").click(function () {
            that.Modal.hide();
            var nameClient = that.Modal.find("").val();
            nameClient = $.trim(nameClient);
            var arrayNameClient = nameClient.split(" ");
            var firstName = "";
            var lastName = "";
            if (arrayNameClient.length > 0) {
                firstName = arrayNameClient[0];
                if (arrayNameClient.length > 1) {
                    arrayNameClient.shift();
                    lastName = arrayNameClient.join(" ");
                }
            }
            that.PageModal.AddOrEditClient.CreateModal(firstName, lastName);
        })
    }
    RemoveEvent() {
        this.Modal.find("#searchClient").off("keyup");
        this.Modal.find("[name='item-client-search']").off("click");
        this.Modal.find("[name='closeModal']").off("click");
        this.Modal.find("#newClientButton").off("click");
    }
    LoadDataSearchClient() {
        var that = this;
        var input = that.Modal.find("#searchClient");
        var value = $.trim(input.val());
        $.RequestAjax("/Home/GetDataClientSearch", JSON.stringify({ search: value }), function (data) {
            that.Modal.find("#container-item-client").html("");
            var length = data.Result.length;
            that.Data.LsData = data.Result;
            $.each(data.Result, function (index, item) {
                var mobilenumber = (item.MobileNumber == null || item.MobileNumber == "") ? "" : ("+" + item.MobileNumberDialCode + " " + item.MobileNumber);
                var email = (item.Email == null || item.Email == "") ? "" : item.Email;
                var html = that.HTML.ItemSearchClient.replace("@Border", (index == length ? '' : 'border-bottom'))
                    .replace("@ClientID", item.ClientID)
                    .replace("@Represent", ($.trim(item.FirstName) == "" ? '' : item.FirstName.toString().charAt(0).toUpperCase()))
                    .replace("@FullName", ($.trim(item.FirstName) == "" ? '' : item.FirstName) + ($.trim(item.LastName) == "" ? '' : ' ' + item.LastName))
                    .replace("@Description", (mobilenumber == "" && email == "") ? "" : (mobilenumber == "" ? email : (email == "" ? mobilenumber : (mobilenumber + ", " + email))));
                that.Modal.find("#container-item-client").append(html);
            })
        })
    }
    //#endregion

    //#region Public
    OpenModal() {
        var that = this;
        if (this.HTML.Index == null || this.HTML.ItemSearchClient == null) {
            $.RequestAjaxText(LinkFileMobileAddClient.AddClient.Index, function (data) { that.HTML.Index = data; });
            $.RequestAjaxText(LinkFileMobileAddClient.AddClient.ItemSearchClient, function (data) { that.HTML.ItemSearchClient = data; });
        }
        if (that.Modal == undefined || that.Modal == null) {
            that.Modal = $(that.HTML.Index);
            $("body").append(that.Modal);
        }
        this.Modal.show("slow");
        that.LoadDataSearchClient();
        that.CreatEvent();
    }
    HideModal() {
        if (this.Parameter.CallBackHideModal)
            this.Parameter.CallBackHideModal();
        if (this.Modal != null) {
            this.Modal.hide();
            this.RemoveEvent();
        }
    }
    RemoveModal() {
        this.PageModal.AddOrEditClient.RemoveModal();
        if (this.Modal != null) {
            this.RemoveEvent();
            this.Modal.remove();
        }
    }
    //#endregion

}