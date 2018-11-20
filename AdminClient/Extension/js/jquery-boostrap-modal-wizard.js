$(function () {
    var opitionDefault = {
        width: $(document).width() <= "768" ? $(document).width() : $(document).width() / 3,
        height: $(document).width() <= "768" ? $(document).height() : $(document).height() - 60,
        search: {
            methodcallback: function (idPrev, prefix, search) { },
            "class": "",
            placehold: "",
        },
        title: {
            text: "",
            "class": ""
        },
        data: {
            methodcallback: function () { },
            methodNext: function (prefixPrev, idPrev, element) { },
            methodPrev: function (prefix, id, element) { },
            array: [],
        },
        callbackcomplete: function (modal) { },
        htmlTemplate: '<div class="modal fade show modal-wizard"><div class="modal-dialog" role="document"><div class="modal-content">'
                     + '<div class="modal-header"><span class="prevModalWizard"></span><h3 class="modal-title"></h3><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>'
                     + ' <div class="modal-body p-0"><form novalidate="novalidate" id="formModalWizard"></form></div>'
                     + '</div></div></div>',
        htmlSearchTemplate: '<div class="col-12 p-4 search-modal-wizard"><div class="input-group-prepend"><span class="input-group-text"><i class="fa fa-search"></i></span><input type="text" class="form-control"></div></div>',
        htmlItemTemplate: '<div class="col-12 item-modal-wizard"><div class="col-6"><strong></strong></div><div class="col-6 text-right"><span></span></div></div>',
        htmlIconNext: '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">'
                + '<path d="M6.187 16.9c-.25.253-.25.66 0 .91.248.253.652.253.9 0l7.285-7.355c.25-.25.25-.66 0-.91L7.088 2.19c-.25-.253-.652-.253-.9 0-.25.25-.25.658-.002.91L12.83 10l-6.643 6.9z"></path>'
                + '</svg>',
        htmlIconPrev: '<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">'
                    + '<path d="M8.80367158,16.7638261 C9.06544281,17.0467987 9.06544281,17.5049548 8.80367158,17.7879275 C8.54229164,18.0704815 8.11774488,18.0709001 7.85597365,17.7879275 L0.196328421,9.51223382 C-0.0654428068,9.22926119 -0.0654428068,8.77068646 0.196328421,8.48771383 L7.85577801,0.212229473 C8.11754924,-0.0707431577 8.54170471,-0.0707431577 8.80347594,0.212229473 C9.06524716,0.495202104 9.06524716,0.953567534 8.80406287,1.23633087 L1.81841007,9.00007847 L8.80367158,16.7638261 Z"></path>'
                    + '</svg>',
        htmlNoResult: '<div class="col-12 empty-modal-wizard"><span>'
                    + '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 91 91"><defs><path d="M43.7218 45.7152l9.7246 9.7246-2.4389 2.439 1.7904 5.3726 18.9756 18.9742h6.8064l3.6457-3.6457v-6.8064L63.25 52.7979l-5.4278-1.3448-2.4888 2.0044-9.5922-9.0884M60.9366 55l-5.938 5.938-.7655-2.2951 4.407-4.4084L60.9365 55zm16.476 24.406h-4.4718L56.7284 63.1936l6.4652-6.4652L79.406 72.9408v4.4718l-1.9934 1.9934z" id="a"></path></defs>'
                    + '<g fill="none" fill-rule="evenodd"><circle fill="#E1EFFC" cx="46" cy="46" r="44"></circle><g transform="translate(8.436 8.436)" fill-rule="nonzero"> <circle fill="#FFF" opacity=".6864" cx="25.8346" cy="25.8346" r="25.3759"></circle>'
                    + '<path fill="#A4ADBA" d="M58.2594 52.6203l-5.6391 5.6391 1.4098 4.2293 18.327 18.327h5.6391l2.8196-2.8195v-5.639L62.4888 54.03z"></path><use fill="#24334A" xlink:href="#a"></use></g> <circle stroke="#24334A" stroke-width="3" cx="34" cy="34" r="26"></circle></g></svg>'
                    + '</span><p>Not found</p></div>',
        titleNoResult: "Not found"
    };
    var MethodSearchWizard = function (dataWizard, prefix, search) {
        var firstChild = dataWizard.find(function (n) {
            return n.prefixPrev == "";
        });
        search = search.toString().toLowerCase();
        if ($.trim(search) != "") {
            var dataFind = [];
            var dataSearch = [];
            var findChild = function (prefixParent) {
                var child = dataWizard.find(function (n) {
                    return n.prefixPrev == prefixParent;
                });
                if (child) {
                    dataFind.push(child);
                    if (child.data && child.data.length > 0)
                        findChild(child.prefix);
                }
            }
            findChild(prefix);
            $.each(dataFind, function () {
                if (this.data && this.data.length > 0) {
                    $.each(this.data, function () {
                        var text = this.text.toString().toLowerCase();
                        if (text.indexOf(search) != -1) {
                            dataSearch.push(this);
                        }
                    })
                }
            })
            return {
                prefix: prefix,
                prefixPrev: firstChild.prefix,
                methodClick: null,
                methodReturnHtml: null,
                data: dataSearch
            };
        } else {
            return firstChild;
        }
    }
    var CreateModalWizard = function (dataWizard, opition, item, modal, isBack, textParent, isSearch) {
        if (isBack)
            modal.find(".prevModalWizard").show();
        else
            modal.find(".prevModalWizard").hide();
        $(".modal-wizard [isItemModalWizard],.modal-wizard  .prevModalWizard").off("click");
        $(".modal-wizard .search-modal-wizard input").off("keyup");
        var form = modal.find("form");
        form.children(":not(.search-modal-wizard)").remove();
        form.append('<div class="loading-modal-wizard"><div class="sk-circle">'
                             + '<div class="class="sk-circle1 sk-child""></div><div class="sk-circle2 sk-child"></div><div class="sk-circle3 sk-child"></div><div class="sk-circle4 sk-child"></div><div class="sk-circle5 sk-child"></div>'
                             + '<div class="sk-circle6 sk-child"></div><div class="sk-circle7 sk-child"></div><div class="sk-circle8 sk-child"></div><div class="sk-circle9 sk-child"></div>'
                             + '<div class="sk-circle10 sk-child"></div><div class="sk-circle11 sk-child"></div><div class="sk-circle12 sk-child"></div>'
                             + ' </div></div>');
        if (item) {
            var prefix = item.prefix;
            var prefixPrev = item.prefixPrev;
            form.attr("prefixPrev", prefixPrev);
            form.attr("prefix", prefix);
            form.attr("idPrev", item.idPrev);
        }
        if (item && item.data && item.data.length > 0) {
            $.each(item.data, function () {
                var html = "";
                if (this.callbackhtml) {
                    html = this.callbackhtml(this);
                } else {
                    var element = $(opition.htmlItemTemplate);
                    element.attr("prefix", this.prefix);
                    element.attr("prefixPrev", this.prefixPrev);
                    element.attr("isItemModalWizard", "");
                    element.attr("id-item-modal", this.id);
                    element.find("div:first strong").text(this.text);
                    element.find("div:last span").append(opition.htmlIconNext);
                    html = element[0].outerHTML;
                }
                form.append(html);
                if (this.methodClick)
                    $("[isItemModalWizard]:last").click(this.methodClick);
            })
        } else {
            modal.find(".prevModalWizard").show();
            var noResult = $(opition.htmlNoResult);
            noResult.find("p").text(opition.titleNoResult);
            form.append(noResult);
        }
        form.find(".loading-modal-wizard").remove();
        //event
        $(".modal-wizard .prevModalWizard").click(function () {
            var prefixPrev = $(this).closest(".modal-wizard").find("form").attr("prefixPrev");
            var idPrev = $(this).closest(".modal-wizard").find("form").attr("idPrev");
            $(".modal-wizard .search-modal-wizard input").val("");
            var itemWizard = opition.data.methodPrev == null ? MethodPrevWizard(dataWizard, prefixPrev, idPrev) : opition.data.methodPrev(prefixPrev, idPrev, this);
            if (itemWizard)
                CreateModalWizard(dataWizard, opition, itemWizard, modal, itemWizard.prefixPrev != "", textParent, false);
        });
        $(".modal-wizard [isItemModalWizard]").click(function () {
            var prefix = $(this).attr("prefix");
            var id = $(this).attr("id-item-modal");
            $(".modal-wizard .search-modal-wizard input").val("");
            var itemWizard = opition.data.methodNext == null ? MethodNextWizard(dataWizard, prefix, id) : opition.data.methodNext(prefix, id, this);
            if (itemWizard)
                CreateModalWizard(dataWizard, opition, itemWizard, modal, true, $(this).text(), false);
        });
        $(".modal-wizard .search-modal-wizard input").keyup(function () {
            var prefix = $(this).closest(".modal-wizard").find("form").attr("prefix");
            var idPrev = $(this).closest(".modal-wizard").find("form").attr("idPrev");
            if ($(this).val() != "") {
                var itemWizard = opition.search.methodcallback ? opition.search.methodcallback(idPrev, prefix, $(this).val()) : MethodSearchWizard(dataWizard, prefix, $(this).val());
                CreateModalWizard(dataWizard, opition, itemWizard, modal, true, textParent, true);
            } else {
                if (isSearch)
                    $(".modal-wizard .prevModalWizard").trigger("click");
            }
        });
        if (opition.callbackcomplete)
            opition.callbackcomplete(modal, textParent);
    }
    var MethodGetDataWizard = function (item, dataWizard, idPrev, prefixPrev, methodClick, methodReturnHtml) {
        if (item.data && item.data.length > 0) {
            var element = {
                prefix: item.prefix,
                prefixPrev: prefixPrev,
                methodClick: methodClick,
                idPrev: idPrev,
                methodReturnHtml: methodReturnHtml,
                data: [],
            };
            element.data = item.data.map(n=> { return { text: n.text, id: n.id, prefix: item.prefix, prefixPrev: item.prefixPrev }; });
            dataWizard.push(element);
            $.each(item.data, function () {
                if (this.data && this.data.length > 0)
                    MethodGetDataWizard(this, dataWizard, this.id, item.prefix, this.methodClick, this.methodReturnHtml);
            })
        }
    }
    var MethodPrevWizard = function (dataWizard, prefixPrev, idPrev) {
        return dataWizard.find(function (n) {
            return n.prefix == prefixPrev;
        });
    }
    var MethodNextWizard = function (dataWizard, prefix, id) {
        return dataWizard.find(function (n) {
            return n.prefixPrev == prefix && n.idPrev == id;
        });
    }
    var modal;
    $.ModalWizard = function (opition) {

        //#region set vaule opition
        opition.width = opition.width == null ? opitionDefault.width : opition.width;
        opition.height = opition.height == null ? opitionDefault.height : opition.height;
        opition.htmlTemplate = opition.htmlTemplate == null ? opitionDefault.htmlTemplate : opition.htmlTemplate;
        opition.htmlSearchTemplate = opition.htmlSearchTemplate == null ? opitionDefault.htmlSearchTemplate : opition.htmlSearchTemplate;
        opition.htmlItemTemplate = opition.htmlItemTemplate == null ? opitionDefault.htmlItemTemplate : opition.htmlItemTemplate;
        opition.htmlIconPrev = opition.htmlIconPrev == null ? opitionDefault.htmlIconPrev : opition.htmlIconPrev;
        opition.htmlIconNext = opition.htmlIconNext == null ? opitionDefault.htmlIconNext : opition.htmlIconNext;
        opition.htmlNoResult = opition.htmlNoResult == null ? opitionDefault.htmlNoResult : opition.htmlNoResult;
        opition.titleNoResult = opition.titleNoResult == null ? opitionDefault.titleNoResult : opition.titleNoResult;
        opition.data.methodNext = opition.data.methodNext == null ? opitionDefault.data.methodNext : opition.data.methodNext;
        opition.data.methodPrev = opition.data.methodPrev == null ? opitionDefault.data.methodPrev : opition.data.methodPrev;
        opition.callbackcomplete = opition.callbackcomplete == null ? opitionDefault.callbackcomplete : opition.callbackcomplete;
        //#endregion

        var dataModalWizad = [];
        if (opition.data && (opition.data.methodcallback || opition.data.array)) {
            var dataArray = opition.data.array ? opition.data.array : opition.data.methodcallback();
            modal = $(opition.htmlTemplate);
            var search = $(opition.htmlSearchTemplate);
            if (opition.search.class)
                search.addClass(opition.search.class);
            search.find("input").attr("placeholder", opition.search.placehold);
            modal.find(".modal-content").css("height", opition.height);
            modal.find(".modal-content").css("width", opition.width);
            modal.find(".prevModalWizard").append(opition.htmlIconPrev);
            if (opition.title.class)
                modal.find(".modal-title").addClass(opition.title.class);
            modal.find(".modal-title").append(opition.title.text);
            modal.find("form").append(search[0]);
            $("body").append(modal[0]);
            $(modal[0]).modal({
                keyboard: false,
                show: true,
                backdrop: "static"
            })
            $(modal[0]).on('hidden.bs.modal', function (e) {
                $(this).remove();
            })
            MethodGetDataWizard(dataArray, dataModalWizad, 0, "", null, null);
            CreateModalWizard(dataModalWizad, opition, dataModalWizad.find(function (n) { return n.prefixPrev == ""; }), modal, false, opition.title.text, false);
        }
    }
    $.ModalWizardClose = function () {
        if (modal)
            modal.modal("hide");
    }
})

//$.ModalWizard({
//    search: {
//        placehold: "Scan barcode or search any item"
//    },
//    title: {
//        text: "Select Item"
//    },
//    data: {
//        array: {
//            text: "",
//            prefix: "a",
//            data: [
//                {
//                    text: "Nhóm 1",
//                    id: "1",
//                    prefix: "b",
//                    data: [
//                         {
//                             text: "Nhóm 1.1",
//                             id: "2",
//                             prefix: "c",
//                             data: [
//                                 {
//                                     text: "group 1.1.1",
//                                     id: "1",
//                                 },
//                                {
//                                    text: "group 1.1.2",
//                                    id: "2",
//                                }
//                             ]
//                         },
//                        {
//                            text: "Nhóm 1.2",
//                            id: "3",
//                        },
//                        {
//                            text: "Nhóm 1.3",
//                            id: "4",
//                        }
//                    ]
//                },
//                {
//                    text: "Nhóm 2",
//                    id: "2",
//                },
//                {
//                    text: "Nhóm 3",
//                    id: "3",
//                },
//                {
//                    text: "Nhóm 4",
//                    id: "4",
//                }
//            ]
//        }
//    }
//})