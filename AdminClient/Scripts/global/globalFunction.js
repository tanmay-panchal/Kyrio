//#region cài đặt control web
function methodCallBackFormatResultControlSelect2(entity) {
    entity.text = (entity.text ? entity.text : "");
    if (entity.id == "" || entity.id == 0 || !entity.id)
        return "<strong>" + entity.text + "</strong>";
    return entity.text;
}
function methodCallBackFormatSelectionControlSelect2(entity) {
    entity.text = (entity.text ? entity.text : "");
    if (entity.id == "" || entity.id == 0 || !entity.id)
        return "<strong>" + entity.text + "</strong>";
    return entity.text;
}
$(function () {
    $.fn.extend({
        InStallInputMarsk: function (digits, suffix, allowMinus, useSpinner, min, max) {
            if (typeof ($.fn.inputmask) != 'undefined') {
                $(this).inputmask("numeric", { allowMinus: allowMinus, radixPoint: ".", groupSeparator: ",", digits: digits, autoGroup: true, rightAlign: true, suffix: suffix, removeMaskOnSubmit: true, min: min, max: max });
                $(this).focus(function () {
                    this.select();
                })
                $(this).change(function () {
                    var value = $(this).val();
                    value = $.trim(value) == "" ? 0 : value;
                    $(this).val(value);
                })
                if (useSpinner) {
                    $(this).addClass("has-feedback-right");
                    $(this).after('<span class="fa fa-plus form-control-feedback right spinner-plus" aria-hidden="true"></span>'
                        + '<span class="fa fa-minus form-control-feedback right spinner-minus" aria-hidden="true"></span>');

                }
            } else {
                console.log("Chưa khai báo thư viện inputmask trong code.")
            }
        },
        InStallSelect2: function (urlAjax, pageSize, placeholder, objectArrayParamter, isPagging, methodCallBackFormatResult, methodCallBackFormatSelection, methodCallBackInitSelection, methodCallBackSetDataAjax, flowMultiple, allowClear, methodCompleteAjax) {
            if (typeof ($.fn.select2) != 'undefined') {
                if (!methodCallBackFormatResult || methodCallBackFormatResult == null || methodCallBackFormatResult == undefined)
                    methodCallBackFormatResult = methodCallBackFormatResultControlSelect2;

                if (!methodCallBackFormatSelection || methodCallBackFormatSelection == null || methodCallBackFormatSelection == undefined)
                    methodCallBackFormatSelection = methodCallBackFormatSelectionControlSelect2;

                if (!methodCallBackInitSelection || methodCallBackInitSelection == null || methodCallBackInitSelection == undefined) {
                    methodCallBackInitSelection = function (element, callback) {
                        var id = $(element).val() ? $(element).val() : 0;
                        var url = $(element).attr('urlselection');
                        if (id != "0") {
                            $.ajax({
                                url: url,
                                type: 'post',
                                datatype: 'json',
                                contentType: 'application/json',
                                data: JSON.stringify({
                                    "id": id,
                                }),
                                async: false,
                                cache: false,
                                success: function (data) {
                                    if (data != 'null')
                                        callback({ 'id': data.Id, 'text': data.Text });
                                }
                            })
                        } else {
                            callback({ 'id': "", 'text': placeholder });
                        }
                    }
                }

                if (!methodCallBackSetDataAjax || methodCallBackSetDataAjax == null || methodCallBackSetDataAjax == undefined) {
                    methodCallBackSetDataAjax = function (params) {
                        var dataParamter = {
                            pageSize: pageSize,
                            pageNum: params.page ? params.page : 0,
                            searchTerm: params.term ? params.term : "",
                        };
                        $.each(objectArrayParamter, function (name, value) {
                            if (name != "pageSize" && name != "pageNum" && name != "searchTerm")
                                dataParamter[name] = value;
                        });
                        return dataParamter;
                    };
                }
                var that = this;
                $(this).select2(
                    {
                        minimumInputLength: 0,
                        theme: "bootstrap",
                        multiple: (flowMultiple == undefined || flowMultiple == null || flowMultiple) ? false : true,
                        dropdownAutoWidth: true,
                        allowClear: (allowClear == undefined || allowClear == null || allowClear) ? false : true,
                        placeholder: placeholder ? placeholder : "",
                        debug: true,
                        templateResult: methodCallBackFormatResult,
                        templateSelection: methodCallBackFormatSelection,
                        initSelection: methodCallBackInitSelection,
                        escapeMarkup: function (m) { return m; },
                        ajax: {
                            delay: 250,
                            type: 'POST',
                            url: urlAjax,
                            dataType: 'json',
                            data: methodCallBackSetDataAjax,
                            processResults: function (data, params) {
                                if (methodCompleteAjax)
                                    methodCompleteAjax(data, params, that);
                                return { results: data.Results, pagination: { more: !isPagging ? (((params.page ? params.page : 1) * pageSize) < data.Total) : false } };
                            }
                        }
                    });
            } else {
                console.log("Chưa khai báo thư viện select2 trong code.")
            }
        },
        SetValueSelect2: function (id, data) {
            if ($(this).find("option[value='" + id + "']").length) {
                $(this).val(id).trigger('change');
            } else {
                var newOption = new Option(data, id, true, true);
                $(this).append(newOption).trigger('change');
            }
        },
        SetValueSelect2ID: function (value) {
            if ($(this).is("select") && value != null) {
                if ($(this).find("option[value='" + value + "']").length) {
                    $(this).val(value).trigger('change');
                } else {
                    var that = this;
                    var url = $(this).attr('urlselection');
                    $.ajax({
                        url: url,
                        type: 'post',
                        datatype: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            "id": value,
                        }),
                        async: false,
                        cache: false,
                        success: function (data) {
                            $(that).find("option[value='" + data.Id + "']").remove();
                            $(that).append(new Option(data.Text, data.Id, true, true));
                            $(that).trigger("change");
                        }
                    })
                }
            }
        },
        InStallDropZone: function (urlSave, isUseEventInit, urlLoadImage, idEntity, maxFilesize, acceptedFiles, isDownload) {
            if (typeof Dropzone != 'undefined') {
                var myDropzone = new Dropzone(this.selector, {
                    addRemoveLinks: true,
                    url: urlSave,
                    isDownload: isDownload,
                    maxFilesize: maxFilesize,
                    acceptedFiles: acceptedFiles,
                    init: function () {
                        var _that = this;
                        var IsDownload = isDownload;
                        if (idEntity > 0 && isUseEventInit) {
                            $.ajax({
                                url: urlLoadImage,
                                type: 'post',
                                datatype: 'json',
                                contentType: 'application/json',
                                data: JSON.stringify({
                                    idEntity: idEntity
                                }),
                                async: false,
                                cache: false,
                                success: function (data) {
                                    if (data.length > 0) {
                                        $.each(data, function (key, value) {
                                            _that.on("addedfile", function (file) {
                                                ; debugger;
                                                if (file.ImageUrl) {
                                                    var dowloadButton = Dropzone.createElement('<a type="button" class="btn btn-link" style="padding-left: 26px; padding-top: 1px" href="' + file.ImageUrl + '">Download</a>');
                                                    if ($(file.previewElement).find("a").length == 1)
                                                        file.previewElement.appendChild(dowloadButton);
                                                }
                                                var arrayExtensionImage = ["ANI", "BMP", "CAL", "FAX", "GIF", "IMG", "JBG", "JPE", "JPEG", "JPG",
                                                    "MAC", "PBM", "PCD", "PCX", "PCT", "PGM", "PNG", "PPM", "PSD", "RAS", "TGA", "TIFF", "WMF"];
                                                var imageUrlDefault = "/Extension/dropzone/file.png";
                                                var imageUrl = file.ImageUrl ? file.ImageUrl : imageUrlDefault;
                                                var arrayName = file.name.split('.');
                                                var extension = arrayName[arrayName.length - 1];
                                                if ($.inArray(extension.toUpperCase(), arrayExtensionImage) == 0)
                                                    imageUrl = imageUrlDefault;
                                                var img = $(file.previewElement).find("img");
                                                img.attr("src", imageUrlDefault);
                                                img.css("height", "120px");
                                                img.css("width", "120px");
                                            });
                                            _that.emit("addedfile", value);
                                            _that.createThumbnailFromUrl(value, value.ImageUrl);
                                            _that.emit("success", value);
                                            _that.emit("complete", value);
                                            _that.files.push(value);
                                        });
                                    }
                                }
                            })
                        }
                    },
                });
                return myDropzone;
            } else {
                console.log("Chưa khai báo thư viện Dropzone");
            }
        },
        InStallTinymce: function () {
            if (typeof tinymce != 'undefined' && tinymce.init != 'undefined') {
                tinymce.init({
                    selector: this,
                    theme: "modern",
                    paste_data_images: true,
                    height: 300,
                    plugins: [
                        "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                        "searchreplace wordcount visualblocks visualchars code fullscreen",
                        "insertdatetime media nonbreaking save table contextmenu directionality",
                        "emoticons template paste textcolor colorpicker textpattern"
                    ],
                    toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                    toolbar2: "print preview media | forecolor backcolor emoticons",
                    image_advtab: true,
                    setup: function (editor) {
                        editor.on('init', function (e) {
                            e.target.setContent(decodeURIComponent(e.target.startContent));
                            $(this.targetElm).after('<input type="file" name="uploadTinymce" class="hidden">');
                        });
                        editor.on('GetContent', function (e) {
                            if (e.format == "html")
                                e.content = encodeURIComponent(e.content);
                        });
                    },
                    file_picker_callback: function (callback, value, meta) {
                        if (meta.filetype == 'image') {
                            $(this.targetElm).closest("div").find('input[name="uploadTinymce"]').trigger('click');
                            $('input[name="uploadTinymce"]').on('change', function () {
                                var file = this.files[0];
                                var reader = new FileReader();
                                reader.onload = function (e) {
                                    callback(e.target.result, {
                                        alt: ''
                                    });
                                };
                                reader.readAsDataURL(file);
                            });
                        }
                    },
                    templates: [{
                        title: 'Test template 1',
                        content: 'Test 1'
                    }, {
                        title: 'Test template 2',
                        content: 'Test 2'
                    }]
                });
            }
        },
        InstallColorPicker: function (opition) {
            if ($(this).is("input")) {
                var that = $(this);
                var opitionDefault = {
                    width: "74",
                    classInput: "btn-color",
                };
                if (opition) {
                    opition.width = opition.width ? opition.width : opitionDefault.width;
                    opition.classInput = opition.classInput ? opition.classInput : opitionDefault.classInput;
                } else
                    opition = opitionDefault;

                var excute = function () {
                    that.each(function () {
                        var that = $(this);
                        that.addClass(opition.classInput);
                        that.attr("readonly", true);
                        that.css("width", opition.width);
                        if (that.val()) {
                            that.css('background-color', that.val());
                            that.css('color', that.val());
                        }
                        that.colorpicker().on('colorpickerChange', function (event) {
                            that.css('background-color', event.color.toString());
                            that.css('color', event.color.toString());
                        });
                    })
                }

                if (typeof ($.fn.colorpicker) == 'undefined') {
                    $.getScript("/Extension/js/bootstrap-colorpicker.js").done(function () {
                        $("head").append('<link href="/Extension/css/bootstrap-colorpicker.css" rel="stylesheet" />');
                        excute();
                    }).fail(function () {
                        console.log("Load file js fail");
                    })
                } else
                    excute();
            } else
                console.error("Tag không hợp lệ");
        },
        InStallPickerWeek: function (firstDay) {
            if (typeof ($.fn.daterangepicker) != 'undefined' && $(this).is("input")) {
                var start = moment().startOf('week');
                var end = moment().endOf('week');
                $(this).daterangepicker({
                    "singleDatePicker": true,
                    "showWeekNumbers": true,
                    "autoApply": true,
                    "autoUpdateInput": false,
                    "locale": {
                        "firstDay": parseInt(firstDay),
                    }
                });
                $(this).data('daterangepicker').setStartDate(start.toDate());
                $(this).data('daterangepicker').setEndDate(end.toDate());
                $(this).val(start.format("D MMMM") + "-" + end.format("D MMMM, YYYY"));
                $.fn.daterangepicker.FirstDay = parseInt(firstDay);
                $(this).on('apply.daterangepicker', function (ev, picker) {
                    var data = $(this).data('daterangepicker');
                    var firstday = $.fn.daterangepicker.FirstDay;
                    var start = data.startDate.add((firstday - data.startDate._d.getDay()), "day")._d;
                    data.endDate = moment(start).add(6, 'day');
                    $(this).val(data.startDate.format("D MMMM") + "-" + data.endDate.format("D MMMM, YYYY")).trigger("change");
                });
                $(this).on('show.daterangepicker', function (ev, picker) {
                    $(".daterangepicker").addClass("daterangepickerweek");
                    $(".daterangepicker tr:has(td.active)").find("td").attr("style", "background-color: #357ebd !important;color: #fff !important");
                });
                $(this).on('hide.daterangepicker', function (ev, picker) {
                    $(".daterangepicker").removeClass("daterangepickerweek");
                    $(".daterangepicker tr:has(td.active)").find("td").removeAttr("style");
                });
            }
        },
        InStallDatatable: function (data, url, columns, autoWidth, isPaging, isSearch, flowSelect, orderCol, responsive, rowCallBack, drawCallBack, methodCustomData, opitionOther) {
            var opition = isPaging ? {
                "orderMulti": false,
                "stateSave": true,
                "iDisplayLength": 20,
                "lengthMenu": [[10, 20, 50, 100], [10, 20, 50, 100]],
                "info": true,
            } : {
                "paging": false,
                "info": false,
            };
            var opitionAjax = $.extend({
                "url": url,
                'type': 'post',
                'datatype': 'json',
            }, data ? { "data": data } : {});
            var opitionOrder = $.extend({
                "ordering": (orderCol != null && orderCol != false && orderCol != undefined) ? true : false,
            }, (orderCol != null && orderCol != false && orderCol != undefined) ? { "order": [[orderCol, 'asc']] } : {});
            $.extend(opition, opitionOrder);
            $.extend(opition, opitionOther);
            var t = $(this).on('preXhr.dt', function () {
                StartLoading();
            }).on('xhr.dt', function () {
                EndLoading();
            }).DataTable($.extend(opition, {
                "processing": true,
                "serverSide": true,
                "autoWidth": autoWidth,
                "searching": isSearch,
                "responsive": responsive,
                "ajax": opitionAjax,
                "rowCallback": rowCallBack,
                "select": flowSelect ? {
                    "style": 'multi',
                    "blurable": false,
                    "selector": 'td:first-child'
                } : null,
                "columns": columns,
                "drawCallback": drawCallBack
            }));
            t.on('xhr.dt', methodCustomData);
            return t;
        },
        AddOrUpdateForm: function (url, methodSuccess, validatorExtension, methodSetExtension, methodAfterAjax) {
            if ($(this).is("form")) {
                var allow = true;
                if (validatorExtension != null && validatorExtension != undefined) {
                    allow = validatorExtension(this);
                }
                if (allow) {
                    var entity = new Object();
                    $(this).find("[ispropertiesmodel]").each(function () {
                        if ($(this).is("input[type='text'],input[type='number'],input[type='email'],textarea,select,input[type='hidden'],input[type='password']"))
                            entity[$(this).attr("id")] = $(this).val();
                        if ($(this).is("input[type='checkbox'],input[type='radio']"))
                            entity[$(this).attr("id")] = this.checked;
                        if ($(this).is("[isnumber]"))
                            entity[$(this).attr("id")] = entity[$(this).attr("id")].replace(/,/gi, '');
                        if ($(this).is("[isdate]") && $(this).val() != "") {
                            entity[$(this).attr("id")] = moment(entity[$(this).attr("id")], $(this).attr("formatdate")).format("YYYY/MM/DD");
                        }
                    })
                    if (methodSetExtension != null && methodSetExtension != undefined)
                        entity = methodSetExtension(entity);
                    $.RequestAjax(url, JSON.stringify({
                        entity: entity,
                        isUpdate: $(this).find("[ispropertiesidmodel]").val() != 0,
                    }), methodSuccess, methodAfterAjax);
                } else {
                    console.log("Đối tượng insert or update không hợp lệ. Đối tưởng phải là form");
                }
            }
        },
        InStallButtonFooter: function (idButtonCreate, idTittleCreate, tittle, methodClick) {
            if ($(this).is("div")) {
                $(this).addClass("containtButtonFooter");
                $(this).append('<button type="button" class="btn btn-dark active tittleButtonFooter" id="' + idTittleCreate + '">' + tittle + '</button>'
                    + '<button type="button" class="btn btn-custome buttonFooter" id="' + idButtonCreate + '"><i class="fa fa-plus fa-lg"></i></button>');
                $("#" + idButtonCreate).on("mouseenter", function () {
                    $(this).empty();
                    $(this).append('<i class="fa fa-street-view fa-lg"></i>');
                    $(this).find("i").show('slow')
                    //$(this).closest("div").find("#tittleButton").show('fast');
                })
                $("#" + idButtonCreate).on("mouseleave", function () {
                    $(this).closest("div").find("#tittleButton").hide();
                    $(this).empty();
                    $(this).append('<i class="fa fa-plus fa-lg"></i>');
                    //$(this).find("i").show('fast');
                })
                $(this).click(methodClick);
            } else {
                console.log("InStallButtonFooter đối tượng phải thẻ div");
            }
        },
        InstallButtonColor: function (nameRadio, nameButton, color) {
            if ($(this).is("div")) {
                $(this).append('<div class="containtButtonColor">'
                    + '<input type="radio" name="' + nameRadio + '" checked  valuecolor="' + color + '"/>'
                    + '<button type="button" style="background-color: ' + color + '" class="btn btn-success buttonColor" name="' + nameButton + '" ' + (color == "0000FF" ? 'checked' : '') + '>'
                    + '<i class="fa fa-check fa-lg"></i>'
                    + '</button></div>');
                $(this).find(".containtButtonColor").click(function () {
                    $(this).find("[type='radio']")[0].checked = true;
                })
            } else {
                console.log("Đối tượng không hợp lệ");
            }
        },
        InStallButtonGroupFooter: function (opition) {
            var ArrayButtonOriginal = opition.ArrayButtonOriginal;
            var ArrayButtonLater = opition.ArrayButtonLater;
            var that = this;
            var AppendButton = function (idButtonCreate, classIcon, isShowTitle, title, isArrayOriginal) {
                $(that).append('<div class="btn-group float-right btn" style="display:none" id="' + idButtonCreate + '">'
                    + (isShowTitle ? '<button type="button" class="btn btn-dark active tittleButtonFooter">' + title + '</button>' : '')
                    + '<button type="button" class="btn btn-custome buttonFooter" name="' + (isArrayOriginal ? "buttonFooterOriginal" : "buttonFooterAfter") + '" ><i class="fa ' + classIcon + ' fa-lg hide"></i></button>'
                    + '</div>');
                $(that).find("div:last").show('slow');
                $(that).find("div:last .tittleButtonFooter").show('slow');
                $(that).find("div:last .buttonFooter i").show('slow');
                $(that).append('<div class="clearfix"></div>');
            }
            var AppendArrayButton = function (arrayButton, isArrayOriginal) {
                $.each(arrayButton, function () {
                    AppendButton(this.IdButtonCreate, this.ClassIcon, this.IsShowTitle, this.Title, isArrayOriginal);
                })
            }
            if ($(this).is("div")) {
                $(this).addClass("containtButtonFooter");
                $(this).empty();
                AppendArrayButton(ArrayButtonOriginal, true);
                $(document).on("mouseenter", "#containtButtonCreate button[name='buttonFooterOriginal']", function () {
                    $("#containtButtonCreate").empty();
                    AppendArrayButton(ArrayButtonLater);
                })
                $(this).on("mouseleave", function () {
                    $("#containtButtonCreate").empty();
                    AppendArrayButton(ArrayButtonOriginal, true);
                })
            } else {
                console.log("InStallButtonFooter đối tượng phải thẻ div");
            }
        },
        InStallDatetimepickerScheul: function (idInputDate, idButtonPrevious, idButtonNext, idButtonToday, callbackComplete) {
            if ($(this).is("div")) {
                var that = this;
                $.RequestAjax("/Home/GetStartWeek", null, function (data) {
                    $(that).append('<div class="row">'
                        + '<div class="title">'
                        + '<button type="button" class="btn btn-outline-primary btn-block" id="' + idButtonPrevious + '"><i class="fa fa-chevron-left"></i></button></div>'
                        + '<div class="hidden-xs button-today">'
                        + '<button type="button" class="btn btn-primary btn-block" id="' + idButtonToday + '">Today</button></div>'
                        + '<div class="inputDate">'
                        + '<input type="text" class="form-control" readonly id="' + idInputDate + '"/></div>'
                        + '<div class="title">'
                        + '<button type="button" class="btn btn-outline-primary btn-block" id="' + idButtonNext + '"><i class="fa fa-chevron-right"></i></button></div></div>');
                    $(that).addClass("date-toolbar");
                    $("#" + idInputDate).InStallPickerWeek(data.Result.Value);
                    callbackComplete();
                    var UpdateDisplayPicker = function () {
                        $("#" + idInputDate).val($("#" + idInputDate).data('daterangepicker').startDate.format("D MMMM") + "-" +
                            $("#" + idInputDate).data('daterangepicker').endDate.format("D MMMM, YYYY")).trigger("change");
                    }
                    $("#" + idButtonPrevious).click(function () {
                        $("#" + idInputDate).data('daterangepicker').startDate.add(-7, 'day');
                        $("#" + idInputDate).data('daterangepicker').endDate.add(-7, 'day');
                        UpdateDisplayPicker();
                    })
                    $("#" + idButtonNext).click(function () {
                        $("#" + idInputDate).data('daterangepicker').startDate.add(7, 'day');
                        $("#" + idInputDate).data('daterangepicker').endDate.add(7, 'day');
                        UpdateDisplayPicker();
                    })
                    $("#" + idButtonToday).click(function () {
                        $("#" + idInputDate).data('daterangepicker').setStartDate(moment().startOf('week'));
                        $("#" + idInputDate).data('daterangepicker').setEndDate(moment().endOf('week'));
                        UpdateDisplayPicker();
                    })
                })
            } else {
                console.log("Tag ko hợp lệ");
            }
        },
        InStallDatetimepickerScheulSingle: function (idInputDate, idButtonPrevious, idButtonNext, idButtonToday, callbackComplete) {
            if ($(this).is("div")) {
                var that = this;
                $.RequestAjax("/Home/GetStartWeek", null, function (data) {
                    $(that).append('<div class="row">'
                        + '<div class="title">'
                        + '<button type="button" class="btn btn-outline-primary btn-block" id="' + idButtonPrevious + '"><i class="fa fa-chevron-left"></i></button></div>'
                        + '<div class="hidden-xs button-today">'
                        + '<button type="button" class="btn btn-primary btn-block" id="' + idButtonToday + '">Today</button></div>'
                        + '<div class="inputDateSingle">'
                        + '<input type="text" class="form-control" readonly id="' + idInputDate + '"/></div>'
                        + '<div class="title">'
                        + '<button type="button" class="btn btn-outline-primary btn-block" id="' + idButtonNext + '"><i class="fa fa-chevron-right"></i></button></div></div>');
                    $(that).addClass("date-toolbar");
                    $("#" + idInputDate).daterangepicker({
                        "singleDatePicker": true,
                        "autoApply": true,
                        "autoUpdateInput": false,
                        "locale": {
                            "firstDay": parseInt(data.Result.Value)
                        }
                    });
                    $("#" + idInputDate).data('daterangepicker').setStartDate($.NowTimeZone());
                    $("#" + idInputDate).data('daterangepicker').setEndDate($.NowTimeZone());
                    $("#" + idInputDate).val(moment($.NowTimeZone()).format("dddd DD MMM, YYYY"));
                    $("#" + idInputDate).on('apply.daterangepicker', function (ev, picker) {
                        $(this).val($(this).data('daterangepicker').startDate.format("dddd DD MMM, YYYY")).trigger("change");
                    });
                    callbackComplete();
                    $("#" + idButtonPrevious).click(function () {
                        $("#" + idInputDate).data('daterangepicker').startDate.add(-1, 'day');
                        $("#" + idInputDate).data('daterangepicker').endDate.add(-1, 'day');
                        $("#" + idInputDate).trigger("apply.daterangepicker");
                    })
                    $("#" + idButtonNext).click(function () {
                        $("#" + idInputDate).data('daterangepicker').startDate.add(1, 'day');
                        $("#" + idInputDate).data('daterangepicker').endDate.add(1, 'day');
                        $("#" + idInputDate).trigger("apply.daterangepicker");
                    })
                    $("#" + idButtonToday).click(function () {
                        var firstday = $.fn.daterangepicker.FirstDay;
                        $("#" + idInputDate).data('daterangepicker').setStartDate($.NowTimeZone());
                        $("#" + idInputDate).data('daterangepicker').setEndDate($.NowTimeZone());
                        $("#" + idInputDate).trigger("apply.daterangepicker");
                    })
                })
            } else {
                console.log("Tag ko hợp lệ");
            }
        },
        ModalOpeningHour: function (title, htmlbuttonfooter, callbacksave, isNotifySave, callbackhide) {
            if ($(this).is("button")) {
                $(this).click(function () {
                    var modal = $('<div class="modal fade p-0"><div class="modal-dialog" role="document"><div class="modal-content">'
                        + '<div class="modal-header"><h3 class="modal-title">' + title + '</h3><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>'
                        + '<div class="modal-body"><form novalidate="novalidate">'
                        + '<table class="table table-sm table-bordered datatable no-footer" id="tableStaffMember"><thead>'
                        + '<th>DAY</th><th>OPEN</th><th>CLOSE</th>'
                        + '</thead><tbody></tbody></table>'
                        + '</form></div>'
                        + '<div class="modal-footer"><div class="col-12">' + htmlbuttonfooter + '</div></div>'
                        + '</div></div></div>');
                    var tableModalOpeningHour;
                    var opitionSelect;
                    var LoadTableModalOpeningHour = function (table) {
                        if (tableModalOpeningHour)
                            tableModalOpeningHour.destroy();
                        var InstallSelectHour = function (value, name) {
                            var select = $("<select name=" + name + " class='form-control'>" + opitionSelect + "</select>");
                            select.val(value);
                            select.find("[value='" + value + "']").attr("selected", true);
                            return select[0].outerHTML;
                        }
                        tableModalOpeningHour = table.InStallDatatable(null, "/Setup/GetDataTableModalOpeningHour", [
                            {
                                "data": "NameDay", "name": "NameDay", "width": "33%",
                                "render": function (data, type, row) {
                                    var name = row.NameDay.replace("store_open_", "");
                                    name = name.replace(name.charAt(0), name.charAt(0).toUpperCase());
                                    return "<input type='checkbox' name='CheckDay' " + (row.CheckDay ? "checked" : "") + "/> " + "<span class='font-weight-bold' name='" + row.NameDay + "'>" + name + "</span>";
                                }
                            },
                            { "data": "OpenDay", "name": "OpenDay", "width": "33%", "render": function (data) { return InstallSelectHour(data, "OpenDay"); } },
                            { "data": "CloseDay", "name": "CloseDay", "width": "33%", "render": function (data) { return InstallSelectHour(data, "CloseDay"); } },
                        ], false, false, false, false, false, true, null, function () {
                            $("input[type='checkbox']:not(.switch-input)").iCheck({
                                checkboxClass: 'icheckbox_flat-green',
                                radioClass: 'iradio_flat-green'
                            });
                        }, function (e, settings, json, xhr) {
                            if (json.data && json.data.length > 0) {
                                var result = [];
                                var GetResultItem = function (name) {
                                    var r = null;
                                    $.each(result, function () {
                                        if (this.NameDay == name) {
                                            r = this;
                                            return;
                                        }
                                    })
                                    return r;
                                }
                                var AddResultItem = function (name, item) {
                                    var check = false;
                                    $.each(result, function () {
                                        if (this.NameDay == name) {
                                            this == item;
                                            check = true;
                                            return;
                                        }
                                    })
                                    if (!check)
                                        result.push(item);
                                }
                                $.each(json.data, function () {
                                    var name = "store_open" + this.SettingCode.replace("store_open", "").replace("_close", "").replace("_open", "");
                                    var item = GetResultItem(name);
                                    if (!item) {
                                        item = {
                                            NameDay: name.toString(),
                                            CheckDay: false,
                                            OpenDay: 0,
                                            CloseDay: 0
                                        }
                                    }
                                    if (this.SettingCode.indexOf("_close") != -1) {
                                        item.CloseDay = this.Value;
                                    } else if (this.SettingCode.replace("store_open", "").indexOf("_open") != -1) {
                                        item.OpenDay = this.Value;
                                    } else {
                                        item.CheckDay = parseInt(this.Value) == 1;
                                    }
                                    AddResultItem(name, item);
                                })
                                json.data = result;
                                return json.data;
                            }
                        })
                    }
                    if (!opitionSelect)
                        $.RequestAjaxText("/ContentHtml/ComboboxTime/Combobox24h.html", function (data) { opitionSelect = data; });
                    modal.modal({
                        keyboard: false,
                        show: true,
                        backdrop: "static"
                    });
                    modal.find(".modal-footer button").click(function () {
                        var data = [];
                        modal.find("form table tbody tr").each(function () {
                            var name = $(this).find("td:eq(0) span").attr("name");
                            data.push({
                                SettingCode: name,
                                Value: $(this).find("td:eq(0) [type='checkbox']")[0].checked ? 1 : 0
                            })
                            data.push({
                                SettingCode: name + "_close",
                                Value: $(this).find("[name='CloseDay']").val()
                            })
                            data.push({
                                SettingCode: name + "_open",
                                Value: $(this).find("[name='OpenDay']").val()
                            })
                        })
                        $.RequestAjax("/Setup/SaveModalOpeningHour", JSON.stringify({
                            data: data,
                        }), function (data) {
                            modal.modal("hide");
                            if (isNotifySave)
                                toastr["success"]("Data saved successfully.", "Notification");
                            if (callbacksave)
                                callbacksave();
                        })
                    })
                    modal.on("shown.bs.modal", function () {
                        LoadTableModalOpeningHour(modal.find("table"));
                    })
                    modal.on("hidden.bs.modal", function () {
                        modal.remove();
                        if (callbackhide)
                            callbackhide();
                    })
                })
            } else {
                console.log("Khai báo không hợp lệ");
            }
        },
    })
    $.InStallPopupConfirm = function (pnotify, buttons) {
        if (typeof (PNotify) != 'undefined') {
            var notify = PNotify.notice({
                title: pnotify.title ? pnotify.title : "",
                text: pnotify.text ? pnotify.text : "",
                icon: pnotify.icon ? pnotify.icon : "fa fa-question-circle",
                hide: false,
                type: pnotify.type ? pnotify.type : "",
                width: pnotify.width ? pnotify.width : "460px",
                stack: {
                    'dir1': 'down',
                    'modal': true,
                    'firstpos1': 25
                },
                modules: {
                    Confirm: {
                        confirm: true,
                        buttons: buttons,
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
            return notify;
        } else {
            console.log("Chưa khai báo thư viện PNotify")
        }
    };
    $.InStallNotifyElement = function (element, title, text, autoClose, height, width, color, html) {
        if (typeof (PNotify) != 'undefined' && $(element).is("div")) {
            if ($(element).find(".ui-pnotify").length > 0) {
                $(element).find(".ui-pnotify").find(".ui-pnotify-closer").find("span").trigger("click");
            }
            var opition = {
                dir1: "up",
                dir2: "right",
                context: element,
                firstpos1: 0,
                firstpos2: 0,
                spacing1: -15,
                spacing2: 0,
                push: 'bottom'
            };
            var notify = PNotify.info({
                text: html ? "" : text,
                title: title,
                hide: autoClose ? autoClose : false,
                minHeight: height ? height : "35px",
                width: width ? width : "300px",
                Buttons: {
                    closerHover: false,
                    sticker: false,
                },
                stack: opition,
            });
            $(notify.refs.titleContainer).remove();
            $(notify.refs.container).find(".ui-pnotify-icon").remove();
            $(notify.refs.container).find(".ui-pnotify-sticker").remove();
            $(notify.refs.elem).css("width", width ? width : "300px");
            $(notify.refs.elem).css("height", height ? height : "35px");
            if (color)
                $(notify.refs.container).css("background-color", color);
            $(notify.refs.container).css("padding", "5px");
            $(notify.refs.container).css("margin-top", "35px");
            $(notify.refs.textContainer).css("margin-left", "5px");
            if (html)
                $(notify.refs.textContainer).append(text);
            $(notify.refs.textContainer).css("font-size", "10px");
            return notify;
        } else {
            console.log("Chưa khai báo thư viện PNotify")
        }
    };
    $.InstallNotifyMain = function (title, callbackAfterClose) {
        PNotify.removeAll();
        var notify = PNotify.info({
            title: title,
            hide: false,
            minHeight: $("body header.app-header").height(),
            width: $(document).width(),
            animateSpeed: 'slow',
            Buttons: {
                sticker: false,
                stickerHover: false,
            },
            stack: {
                dir1: "up",
                dir2: "left",
                context: $("body header.app-header")[0],
                firstpos1: 0,
                firstpos2: 0,
                spacing1: 0,
                spacing2: 0,
                push: 'bottom'
            },
        })
        $(notify.refs.elem).css("top", "0px");
        $(notify.refs.elem).css("bottom", "0px");
        $(notify.refs.elem).css("right", "0px");
        $(notify.refs.elem).css("left", "0px");
        $(notify.refs.elem).find(".ui-pnotify-closer").click(function () {
            $("body header.app-header button.sidebar-toggler").trigger("click");
            if (callbackAfterClose)
                callbackAfterClose();
        })
        var marginLeft = $(".sidebar-fixed .sidebar").css("margin-left");
        if (marginLeft == "0px")
            $("body header.app-header button.sidebar-toggler").trigger("click");
        return notify;
    };
    $.InstallNotifyMainError = function (title, callbackAfterClose) {
        PNotify.removeAll();
        var notify = PNotify.error({
            title: title,
            hide: false,
            minHeight: $("body header.app-header").height(),
            width: $(document).width(),
            animateSpeed: 'slow',
            Buttons: {
                sticker: false,
                closer: false,
                closerHover: false,
                stickerHover: false,
            },
            stack: {
                dir1: "up",
                dir2: "left",
                context: $("body header.app-header")[0],
                firstpos1: 0,
                firstpos2: 0,
                spacing1: 0,
                spacing2: 0,
                push: 'bottom'
            },
        })
        $(notify.refs.elem).css("top", "0px");
        $(notify.refs.elem).css("bottom", "0px");
        $(notify.refs.elem).css("right", "0px");
        $(notify.refs.elem).css("left", "0px");
        $(notify.refs.elem).find(".ui-pnotify-closer").click(function () {
            $("body header.app-header button.sidebar-toggler").trigger("click");
            if (callbackAfterClose)
                callbackAfterClose();
        })
        var marginLeft = $(".sidebar-fixed .sidebar").css("margin-left");
        if (marginLeft == "0px")
            $("body header.app-header button.sidebar-toggler").trigger("click");
        return notify;
    };
    $.FormatNumberMoney = function (number) {
        return (Window.CurrencySymbol + $.number(number, Window.NumberDecimal, '.', ','));
    };
    $.WelcomeScheul = function (FirstName) {
        var CreateModal = function (title, htmlBody, htmlFooter) {
            var modal = $('<div class="modal fade modal-welcome"><div class="modal-dialog" role="document"><div class="modal-content">'
                + '<div class="modal-header b-a-0 pb-2"><h3 class="modal-title">' + title + '</h3><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>'
                + '<div class="modal-body b-a-0 p-1">' + htmlBody + '</div>'
                + '<div class="modal-footer b-a-0 p-1">' + htmlFooter + '</div>'
                + '</div></div></div>');
            modal.modal({
                keyboard: false,
                show: true,
                backdrop: "static"
            });
            return modal;
        }
        var count = 0;
        var GetStarted = function (callback) {
            var clickCoutinue = false;
            var modal = CreateModal("Welcome to Kyrio!", '<p class="text-center">Setting up your business with Kyrio is easy. In three quick steps we\'ll have you ready to start adding appointments.</p>',
                '<div class="col-12 pl-0 pr-0"><button type="button" class="btn btn-success btn-block active text-center p-2" id="continueGetStartedButton" data-dismiss="modal">Get started <i class="fa fa-chevron-right"></i></button></div><div class="col-12 pl-0 pr-0">'
                + '<button type="button" class="btn btn-link btn-block active text-center p-2" data-dismiss="modal">I\'ll set up later, show me the calendar!</button></div>');
            modal.on("shown.bs.modal", function () {
                $("#continueGetStartedButton").ModalOpeningHour('When is ' + Window.BusinessName + ' open?', '<button type="button" class="btn btn-success btn-block active text-center p-2" id="continueModalOpeningHour">Continue <i class="fa fa-chevron-right"></i></button>', function () {
                    $("#continueModalOpeningHour").off("click");
                    if (callback)
                        callback();
                }, null, function () {
                    $.RequestAjax("/Home/GenerateWorkingHours");
                });
                $("#continueGetStartedButton").click(function () {
                    clickCoutinue = true;
                    modal.modal("hide");
                })
            })
            modal.on("hidden.bs.modal", function () {
                $("#continueGetStartedButton").off("click");
                if (!clickCoutinue)
                    $.RequestAjax("/Home/GenerateWorkingHours");
                modal.remove();
            })
            modal.modal("show");
        }
        var StaffService = function (callback) {
            var modal = CreateModal("Staff & Services", '<div class="col-12 pl-0 pr-0"> <p class="text-center">To get you started, we\'ve setup your calendar with two staff members and two demo services. You can easily modify staff and services in your settings section.</p></div>'
                + '<div class="col-12 pl-0 pr-0 d-flex justify-content-around mb-3">'
                + '<div class="p-0"><div class="d-flex flex-row justify-content-center"><p><i class="icon-user icons font-5xl"></i></p><div class="d-flex flex-column justify-content-center ml-2"><h4 class="font-weight-bold m-0 mb-1">' + FirstName + '</h4><p class="font-weight-normal">Owner Account</p></div></div></div>'
                + '<div class="p-0"><div class="d-flex flex-row justify-content-center"><p><i class="fa fa-cut font-5xl"></i></p><div class="d-flex flex-column justify-content-center ml-2"><h4 class="font-weight-bold m-0 mb-1">Haircut</h4><p class="font-weight-normal">45 min service</p></div></div></div>'
                + '</div>'
                + '<div class="col-12 pl-0 pr-0 d-flex justify-content-around mb-3">'
                + '<div class="p-0"><div class="d-flex flex-row justify-content-center"><p><i class="icon-user icons font-5xl"></i></p><div class="d-flex flex-column justify-content-center ml-2"><h4 class="font-weight-bold m-0 mb-1">Johnny</h4><p class="font-weight-normal">Staff memeber</p></div></div></div>'
                + '<div class="p-0"><div class="d-flex flex-row justify-content-center"><p><i class="fa fa-cut font-5xl"></i></p><div class="d-flex flex-column justify-content-center ml-2"><h4 class="font-weight-bold m-0 mb-1">Blow Dry</h4><p class="font-weight-normal">45 min service</p></div></div></div>'
                + '</div>',
                '<div class="col-12 pl-0 pr-0"><button type="button" class="btn btn-success btn-block active text-center p-2" id="continueStaffServiceButton">Continue <i class="fa fa-chevron-right"></i></button></div>');
            modal.on("shown.bs.modal", function () {
                if (callback)
                    $("#continueStaffServiceButton").click(callback);
            })
            modal.on("hidden.bs.modal", function () {
                $("#continueStaffServiceButton").off("click");
                modal.remove();
            })
            modal.modal("show");
            return modal;
        }
        var Finish = function () {
            var modal = CreateModal("Your FREE account is ready!", '<div class="col-12 pl-0 pr-0"><p class="text-center">You\'re now setup to start using KYRIO, the world\'s first totally free system for Wellness and Beauty businesses.</p></div>'
                + '<div class="col-12 pl-0 pr-0">'
                + '<div class="p-0 col-12 col-xl-6"><div class="d-flex justify-content-center flex-column"><img src="/img/welcome_1.jpg" height="151" width="256" class="m-auto" /><h6 class="text-center font-weight-normal">Use the date buttons to select different days</h6></div></div>'
                + '<div class="p-0 col-12 col-xl-6"><div class="d-flex justify-content-center flex-column"><img src="/img/welcome_2.jpg" height="151" width="256" class="m-auto" /><h6 class="text-center font-weight-normal">Click anywhere on the calendar to make a booking</h6></div></div>'
                + '</div>',
                '<div class="col-12 pl-0 pr-0"><button type="button" class="btn btn-success btn-block active text-center p-2" data-dismiss="modal">Open my calendar</button></div>');
            modal.modal("show");
            modal.on("hidden.bs.modal", function () {
                location.href = '/Calendar/Index';
            })
        }
        GetStarted(function () {
            var modal = StaffService(function () {
                modal.modal("hide");
                Finish();
            })
        });
    };
    $.CallViewAppointment = function (id, callback, callbackEdit) {
        var modal = $('<div class="modal fade modal-fullsrceen" ismodal id="modalAppointmentView">'
            + '<div class="modal-dialog" role="document"><div class="modal-content">'
            + '<div class="modal-header">'
            + '<h3 class="modal-title">View Appointment</h3>'
            + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'
            + '</div>'
            + '<div class="modal-body p-0"><form novalidate="novalidate" id="appointmentViewForm"></form></div>'
            + '</div></div>'
            + '</div>');
        modal.modal({
            keyboard: false,
            show: true,
        });
        modal.on("shown.bs.modal", function () {
            var ExcuteDestopViewAppointment = function () {
                if (id && id != 0) {
                    var destop = new ModalAppointmentViewDestop(id, null, callbackEdit);
                    destop.Excute();
                }
            }
            if (typeof ModalAppointmentViewDestop != "function") {
                $.getScript("/Scripts/calendar/Appointment/destop-view-appointment.js").done(function () {
                    ExcuteDestopViewAppointment();
                }).fail(function () {
                    console.log("Load file js fail");
                })
            } else
                ExcuteDestopViewAppointment();
        })
        modal.on("hidden.bs.modal", function () {
            modal.modal('dispose');
            modal.remove();
            if (callback)
                callback();
        })
    };
    $.CallCreateAppointmentDestop = function (locationId, startTime, scheduledDate, staffId, callback, clientID) {
        var modal = $('<div class="modal fade modal-fullsrceen" ismodal id="modalAppointmentAction">'
            + '<div class="modal-dialog" role="document"><div class="modal-content">'
            + '<div class="modal-header">'
            + '<h3 class="modal-title">New Appointment</h3>'
            + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'
            + '</div>'
            + '<div class="modal-body p-0"><form novalidate="novalidate" id="appointmentNewForm"></form></div>'
            + '</div></div>'
            + '</div>');
        modal.modal({
            keyboard: false,
            show: true,
        });
        modal.on("shown.bs.modal", function () {
            var ExcuteDestopActionAppointment = function () {
                if (locationId && locationId != 0) {
                    scheduledDate = scheduledDate ? scheduledDate : new Date();
                    startTime = startTime ? startTime : new Date();
                    var minutues = startTime.getHours() * 60 + startTime.getMinutes();
                    var destop = new ModalAppointmentActionDestop(locationId, minutues * 60, scheduledDate, staffId, clientID);
                    destop.ExcuteCreate();
                }
            }
            if (typeof ModalAppointmentActionDestop != "function") {
                $.getScript("/Scripts/calendar/Appointment/destop-action-appointment.js").done(function () {
                    ExcuteDestopActionAppointment();
                }).fail(function () {
                    console.log("Load file js fail");
                })
            } else
                ExcuteDestopActionAppointment();
        })
        modal.on("hidden.bs.modal", function () {
            modal.modal('dispose');
            modal.remove();
            if (callback)
                callback();
        })
    };
    $.CallCreateAppointmentMoblie = function (locationId, startTime, scheduledDate, staffId, callback, clientID) {
        var ExcuteMoblieActionAppointment = function () {
            if (locationId && locationId != 0) {
                scheduledDate = scheduledDate ? scheduledDate : new Date();
                startTime = startTime ? startTime : new Date();
                var minutues = startTime.getHours() * 60 + startTime.getMinutes();
                var moblie = new MoblieEditOrCreateAppointment(locationId, minutues * 60, scheduledDate, staffId, clientID);
                moblie.OpenModal();
            }
        }
        if (typeof MoblieEditOrCreateAppointment != "function") {
            $.getScript("/Scripts/calendar/Appointment/mobile-action-appointment.js").done(function () {
                ExcuteMoblieActionAppointment();
            }).fail(function () {
                console.log("Load file js fail");
            })
        } else
            ExcuteMoblieActionAppointment();
    }
    $.CallCreateAppointment = function (locationId, startTime, scheduledDate, staffId, callback, clientID) {
        //$.CallCreateAppointmentMoblie(locationId, startTime, scheduledDate, staffId, callback, clientID);
        if ($(document).width() <= 768) {
            $.CallCreateAppointmentMoblie(locationId, startTime, scheduledDate, staffId, callback, clientID);
        } else {
            $.CallCreateAppointmentDestop(locationId, startTime, scheduledDate, staffId, callback, clientID);
        }
    }
    $.CallEditAppointmentDestop = function (id, callback) {
        var modal = $('<div class="modal fade modal-fullsrceen" ismodal id="modalAppointmentAction">'
            + '<div class="modal-dialog" role="document"><div class="modal-content">'
            + '<div class="modal-header">'
            + '<h3 class="modal-title">New Appointment</h3>'
            + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'
            + '</div>'
            + '<div class="modal-body p-0"><form novalidate="novalidate" id="appointmentNewForm"></form></div>'
            + '</div></div>'
            + '</div>');
        modal.modal({
            keyboard: false,
            show: true,
        });
        modal.on("shown.bs.modal", function () {
            var ExcuteDestopActionAppointment = function () {
                if (id && id != 0) {
                    var scheduledDate = new Date();
                    var startTime = scheduledDate.getHours() * 60 + scheduledDate.getMinutes();
                    var destop = new ModalAppointmentActionDestop(0, startTime, scheduledDate);
                    destop.ExcuteEdit(id);
                }
            }
            if (typeof ModalAppointmentActionDestop != "function") {
                $.getScript("/Scripts/calendar/Appointment/destop-action-appointment.js").done(function () {
                    ExcuteDestopActionAppointment();
                }).fail(function () {
                    console.log("Load file js fail");
                })
            } else
                ExcuteDestopActionAppointment();
        })
        modal.on("hidden.bs.modal", function () {
            modal.modal('dispose');
            modal.remove();
            if (callback)
                callback();
        })
    };
    $.CallEditAppointmentMoblie = function (id, callback) {
        var ExcuteMoblieActionAppointment = function () {
            if (id && id != 0) {
                var scheduledDate = new Date();
                var startTime = scheduledDate.getHours() * 60 + scheduledDate.getMinutes();
                var moblie = new MoblieEditOrCreateAppointment(0, startTime, scheduledDate, 0, 0, id, callback);
                moblie.OpenModal();
            }
        }
        if (typeof MoblieEditOrCreateAppointment != "function") {
            $.getScript("/Scripts/calendar/Appointment/mobile-action-appointment.js").done(function () {
                ExcuteMoblieActionAppointment();
            }).fail(function () {
                console.log("Load file js fail");
            })
        } else
            ExcuteMoblieActionAppointment();
    }
    $.CallEditAppointment = function (id, callback) {
        //$.CallEditAppointmentMoblie(id, callback);
        if ($(document).width() <= 768) {
            $.CallEditAppointmentMoblie(id, callback);
        } else {
            $.CallEditAppointmentDestop(id, callback);
        }
    };
    $.CheckBrowIE = function () {
        ua = navigator.userAgent;
        var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
        return is_ie;
    }
    $.NowTimeZone = function () {
        return moment(moment(moment().tz(Window.TimeZone).format())._a).toDate();
    }
    $.InstallNotify = function (title, width) {
        var widthFull = $(document).width();
        var widthMargin = 0;
        if (widthFull > width) {
            widthMargin = parseInt(parseInt(widthFull) - width) / 2;
            width = widthFull - (widthMargin * 2);
        }
        var notify = PNotify.error({
            title: title,
            hide: false,
            minHeight: $("body header.app-header").height(),
            width: width + "px",
            animateSpeed: 'slow',
            addClass: "stack-bar-top-center",
            modules: {
                Buttons: {
                    closer: false,
                    closerHover: false,
                    sticker: false,
                    stickerHover: false,
                },
                Callbacks: {
                    afterOpen: function (notice) {
                        //; debugger;
                        $(notice.refs.elem).css("top", "0px");
                        $(notice.refs.elem).css("bottom", "0px");
                        //$(notice.refs.elem).css("right", "760px");
                        //$(notice.refs.elem).css("left", widthMargin + "px");
                    }
                }
            },
            stack: {
                dir1: "up",
                dir2: "left",
                dir3: "right",
                context: $("body header.app-header")[0],
                firstpos1: 0,
                firstpos2: 0,
                spacing1: widthMargin,
                spacing2: widthMargin,
                push: 'bottom'
            },
        })
        return notify;
    };
    $.InstallModalStaff = function (UserID, callback) {
        var ExcuteModalStaff = function () {
            new ModalStaff(UserID, callback);
        }
        if (typeof ModalStaff != "function") {
            $.getScript("/Scripts/staff/staff/ModalClass.js").done(function () {
                ExcuteModalStaff();
            }).fail(function () {
                console.error("Load file js fail");
            })
        } else
            ExcuteModalStaff();
    };
})

//#endregion

//#region method date
Date.prototype.addHours = function (h) {                                                               //add hours for datetime
    this.setHours(this.getHours() + h);
    return this;
}
Date.prototype.subtract = function (day) {                                          //subtract for datetime
    var yearStart = day.getFullYear();
    var yearEnd = this.getFullYear();
    if (typeof (moment) != 'undefined' && yearEnd >= yearStart) {
        var dayStart = parseInt(moment(day).format("DDD"));
        var dayEnd = parseInt(moment(this).format("DDD"));
        if (yearEnd == yearStart)
            return dayEnd - dayStart;
        if (yearEnd > yearStart) {
            var result = dayEnd;
            for (var i = 1; i <= (yearEnd - yearStart - 1) ; i++) {
                result += parseInt(moment("31/12/" + (yearEnd - 1).toString(), "DD/MM/YYYY").format("DDD"));
            }
            result += parseInt(moment("31/12/" + yearStart, "DD/MM/YYYY").format("DDD")) - dayStart;
            return result;
        }
    } else {
        return false;
    }
    return 0;
}
Date.prototype.subtractTime = function (day) {                                          //subtract for datetime
    var hoursStart = day.getHours();
    var hoursEnd = this.getHours();
    if (hoursEnd >= hoursStart) {
        var minutesStart = day.getMinutes();
        var minutesEnd = this.getMinutes();
        if (hoursEnd == hoursStart)
            return { hours: 0, minutes: minutesEnd - minutesStart };
        if (hoursEnd > hoursStart) {
            var result = minutesEnd;
            for (var i = 1; i <= (hoursEnd - hoursStart - 1) ; i++) {
                result += 60;
            }
            result += 60 - minutesStart;
            return { hours: parseInt(result / 60), minutes: result % 60 };
        }
    } else {
        return false;
    }
    return 0;
}
$(function () {
    $.fn.extend({
        ValidatorSingleInputTime: function () {
            if (this.is("input") && this.val().split(":").length >= 2) {
                var hours = this.val().split(":")[0];
                var minutes = this.val().split(":")[1];
                if (parseInt(hours) > 23 || parseInt(minutes) > 60) {
                    toastr["error"]("Giờ phút không hợp lệ. Xin vui lòng nhập lại", "Thông báo");
                    this.focus();
                    return false;
                }
                return true;
            }
            return false;
        },
        ValidatorCompareInputTime: function (elementTo) {
            if (this.is("input") && this.val().split(":").length >= 2 && elementTo.is("input") && elementTo.val().split(":").length >= 2) {
                var timeFrom = new Date('1/1/2000 ' + this.val());
                var timeTo = new Date('1/1/2000 ' + elementTo.val());
                if (timeFrom >= timeTo) {
                    toastr["error"]("Giờ đến phải lớn hơn giờ đi.", "Thông báo");
                    this.focus();
                    return false;
                }
                return true;
            }
            return false;
        }
    })
})
//#endregion

//#region method link
$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return results[1];
    }
}
//#endregion

//#region for datatables.net
$(function () {
    //#region method for plugin datatable
    if ($.fn.DataTable != undefined) {
        $.fn.DataTable.Api.register('column().GroupColByVisible()', function () {
            var colspan = this.columns(':visible').count();
            var rowsNode = this.table().rows({ page: 'current' }).nodes();
            var group = null;
            $.each(this.data(), function (index, item) {
                if (item != group) {
                    $(rowsNode).eq(index).before('<tr><td  class="group" colspan="' + colspan + '">' + item + '</td></tr>');
                    group = item;
                }
            })
        })
        $.fn.DataTable.Api.register('column().GroupCol()', function () {
            var colspan = this.columns(':visible').count() - 1;
            var rowsNode = this.table().rows({ page: 'current' }).nodes();
            var group = null;
            $.each(this.data(), function (index, item) {
                if (item != group) {
                    $(rowsNode).eq(index).before('<tr><td  class="group" colspan="' + colspan + '">' + item + '</td></tr>');
                    group = item;
                }
            })
            this.visible(false);
        })
        $.fn.DataTable.Api.register('column().GroupColCutomeTextGroupBaseFunctionCallBack()', function (callBacks) {
            var colspan = this.columns(':visible').count();
            var rowsNode = this.table().rows({ page: 'current' }).nodes();
            var group = null;
            $.each(this.data(), function (index, item) {
                if (item != group) {
                    $(rowsNode).eq(index).before('<tr><td  class="group" colspan="' + colspan + '">' + callBacks(item) + '</td></tr>');
                    group = item;
                }
            })
            this.visible(false);
        })
        $.fn.dataTable.Api.register('column().data().sum()', function () {
            return this.reduce(function (a, b) {
                var x = parseFloat(a) || 0;
                var y = parseFloat(b) || 0;
                return x + y;
            });
        });
        $.fn.DataTable.Api.register('CreateButtonExportExcel', function (opitionButton, seletorContaintButton) {
            $(this.buttons()).each(function () {
                if ($(this.node).closest(seletorContaintButton).length > 0)
                    $(this.node).remove();
            })
            new $.fn.dataTable.Buttons(this, {
                buttons: [opitionButton]
            });
            $(seletorContaintButton).html('');
            this.buttons().container().last().appendTo($(seletorContaintButton));
        })
        //#region use export excel
        var DataTable = $.fn.dataTable;
        DataTable.ext.buttons.ExcelStrings = {
            "_rels/.rels":
                '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
                '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
                '</Relationships>',

            "xl/_rels/workbook.xml.rels":
                '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
                '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
                '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
                '</Relationships>',

            "[Content_Types].xml":
                '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
                '<Default Extension="xml" ContentType="application/xml" />' +
                '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />' +
                '<Default Extension="jpeg" ContentType="image/jpeg" />' +
                '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" />' +
                '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" />' +
                '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" />' +
                '</Types>',

            "xl/workbook.xml":
                '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
                '<fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="24816"/>' +
                '<workbookPr showInkAnnotation="0" autoCompressPictures="0"/>' +
                '<bookViews>' +
                '<workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="19020" tabRatio="500"/>' +
                '</bookViews>' +
                '<sheets>' +
                '<sheet name="" sheetId="1" r:id="rId1"/>' +
                '</sheets>' +
                '</workbook>',

            "xl/worksheets/sheet1.xml":
                '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">' +
                '<sheetData/>' +
                '<mergeCells count="0"/>' +
                '</worksheet>',

            "xl/styles.xml":
                '<?xml version="1.0" encoding="UTF-8"?>' +
                '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">' +
                '<numFmts count="8">' +
                '<numFmt numFmtId="164" formatCode="#,##0.00_-\ [$$-45C]"/>' +
                '<numFmt numFmtId="165" formatCode="&quot;£&quot;#,##0.00"/>' +
                '<numFmt numFmtId="166" formatCode="[$€-2]\ #,##0.00"/>' +
                '<numFmt numFmtId="167" formatCode="0.0%"/>' +
                '<numFmt numFmtId="168" formatCode="#,##0;(#,##0)"/>' +
                '<numFmt numFmtId="169" formatCode="#,##0.00;(#,##0.00)"/>' +
                '<numFmt numFmtId="170" formatCode="#,##0"/>' +
                '<numFmt numFmtId="171" formatCode="#,##0.00"/>' +
                '</numFmts>' +
                '<fonts count="7" x14ac:knownFonts="1">' +
                '<font>' +
                '<sz val="12" />' +
                '<name val="Times New Roman" />' +
                '</font>' +
                '<font>' +
                '<sz val="12" />' +
                '<name val="Times New Roman" />' +
                '<color rgb="FFFFFFFF" />' +
                '</font>' +
                '<font>' +
                '<sz val="12" />' +
                '<name val="Times New Roman" />' +
                '<b />' +
                '</font>' +
                '<font>' +
                '<sz val="12" />' +
                '<name val="Times New Roman" />' +
                '<i />' +
                '</font>' +
                '<font>' +
                '<sz val="12" />' +
                '<name val="Times New Roman" />' +
                '<u />' +
                '</font>' +
                '<font>' +
                '<sz val="18" />' +
                '<name val="Times New Roman" />' +
                '<b />' +
                '</font>' +
                '<font>' +
                '<sz val="13" />' +
                '<name val="Times New Roman" />' +
                '<b />' +
                '</font>' +
                '</fonts>' +
                '<fills count="6">' +
                '<fill>' +
                '<patternFill patternType="none" />' +
                '</fill>' +
                '<fill/>' + // Excel appears to use this as a dotted background regardless of values
                '<fill>' +
                '<patternFill patternType="solid">' +
                '<fgColor rgb="FFD9D9D9" />' +
                '<bgColor indexed="64" />' +
                '</patternFill>' +
                '</fill>' +
                '<fill>' +
                '<patternFill patternType="solid">' +
                '<fgColor rgb="FFD99795" />' +
                '<bgColor indexed="64" />' +
                '</patternFill>' +
                '</fill>' +
                '<fill>' +
                '<patternFill patternType="solid">' +
                '<fgColor rgb="ffc6efce" />' +
                '<bgColor indexed="64" />' +
                '</patternFill>' +
                '</fill>' +
                '<fill>' +
                '<patternFill patternType="solid">' +
                '<fgColor rgb="ffc6cfef" />' +
                '<bgColor indexed="64" />' +
                '</patternFill>' +
                '</fill>' +
                '</fills>' +
                '<borders count="2">' +
                '<border>' +
                '<left />' +
                '<right />' +
                '<top />' +
                '<bottom />' +
                '<diagonal />' +
                '</border>' +
                '<border diagonalUp="false" diagonalDown="false">' +
                '<left style="thin">' +
                '<color auto="1" />' +
                '</left>' +
                '<right style="thin">' +
                '<color auto="1" />' +
                '</right>' +
                '<top style="thin">' +
                '<color auto="1" />' +
                '</top>' +
                '<bottom style="thin">' +
                '<color auto="1" />' +
                '</bottom>' +
                '<diagonal />' +
                '</border>' +
                '</borders>' +
                '<cellStyleXfs count="1">' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" />' +
                '</cellStyleXfs>' +
                '<cellXfs count="73">' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="2" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">' +
                '<alignment horizontal="center" vertical="center"/>' +
                '</xf>' +
                '<xf numFmtId="0" fontId="3" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="4" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="2" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="3" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="4" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="1" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="2" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="3" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="4" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="1" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="2" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="3" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="4" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="1" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="2" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="3" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="4" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="1" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="2" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="3" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="4" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="2" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="3" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="4" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="1" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="2" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="3" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="4" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="1" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="2" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="3" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="4" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="1" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="2" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="3" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="4" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
                '<alignment horizontal="left"/>' +
                '</xf>' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
                '<alignment horizontal="center"/>' +
                '</xf>' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
                '<alignment horizontal="right"/>' +
                '</xf>' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
                '<alignment horizontal="fill"/>' +
                '</xf>' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
                '<alignment textRotation="90"/>' +
                '</xf>' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
                '<alignment wrapText="1"/>' +
                '</xf>' +
                '<xf numFmtId="9"  fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="164" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="0" fontId="5" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"> ' +
                '<alignment horizontal="center"/>' +
                '</xf>' +
                '<xf numFmtId="166" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="167" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="168" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="169" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="3" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="4" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="1" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="2" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
                '<alignment wrapText="1"/>' +
                '</xf>' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
                '<alignment horizontal="center" wrapText="1"/>' +
                '</xf>' +
                '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
                '<alignment horizontal="right" wrapText="1"/>' +
                '</xf>' +
                '<xf numFmtId="170" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
                '<alignment horizontal="right" wrapText="1"/>' +
                '</xf>' +
                '<xf numFmtId="171" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
                '<alignment horizontal="right" wrapText="1"/>' +
                '</xf>' +
                '<xf numFmtId="0" fontId="6" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
                '<alignment wrapText="1"/>' +
                '</xf>' +
                '<xf numFmtId="0" fontId="6" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">' +
                '<alignment wrapText="1" horizontal="center"/>' +
                '</xf>' +
                '</cellXfs>' +
                '<cellStyles count="1">' +
                '<cellStyle name="Normal" xfId="0" builtinId="0" />' +
                '</cellStyles>' +
                '<dxfs count="0" />' +
                '<tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleMedium4" />' +
                '</styleSheet>'
        };
        //#endregion
    };
    //#endregion
})
//#endregion

//#region Request Ajax
$.RequestAjax;
$(function () {
    $.RequestAjax = function (url, data, methodExcute, methodAfterAjax) {
        if (data) {
            var d = JSON.parse(data);
            var d1 = {};
            $.each(d, function (key, item) {
                if (moment(item).isValid() && item.toString().split("-").length == 3)
                    item = moment(item).format("YYYY-MM-DD HH:mm:ss");
                d1[key] = item;
            })
            data = JSON.stringify(d1);
        }
        StartLoading();
        $.ajax({
            url: url,
            type: 'post',
            datatype: 'json',
            contentType: 'application/json',
            data: data,
            async: false,
            cache: false,
            success: function (data) {
                if (data != null && data != "null" && typeof data === "string" && data.split("{").length >= 2 && data.split("}").length >= 2)
                    data = JSON.parse(data);
                EndLoading();
                if (methodAfterAjax)
                    methodAfterAjax();
                if (methodExcute)
                    methodExcute(data);
            },
            error: function (jqXHR, textStatus, errorThrow) {
                EndLoading();
                if (methodAfterAjax)
                    methodAfterAjax();
                toastr["error"](jqXHR.responseJSON.ContentError, jqXHR.responseJSON.TitleError);
            }
        })
    }
    $.RequestAjaxText = function (url, methodSuccess) {
        StartLoading();
        $.ajax({
            url: url,
            async: false,
            cache: false,
            success: function (data) {
                EndLoading();
                methodSuccess(data);
            },
            error: function (jqXHR, textStatus, errorThrow) {
                EndLoading();
                console.log("Not found " + url);
            }
        })
    }
    $.RequestAjaxSript = function (url) {
        $.ajax({
            url: url,
            async: false,
            dataType: "script",
            cache: false,
            error: function (jqXHR, textStatus, errorThrow) {
                console.log("Not found " + url);
            }
        })
    }
})
//#endregion

//#region Loading
var StartLoading, EndLoading;
$(function () {
    var countCallLoading = 0;
    StartLoading = function () {
        ++countCallLoading;
        if ($(".loading").length == 0)
            $("body").append('<div class="loading"><div class="sk-cube-grid">'
                + '<div class="sk-cube sk-cube1"></div><div class="sk-cube sk-cube2"></div><div class="sk-cube sk-cube3"></div><div class="sk-cube sk-cube4"></div><div class="sk-cube sk-cube5"></div>'
                + '<div class="sk-cube sk-cube6"></div><div class="sk-cube sk-cube7"></div><div class="sk-cube sk-cube8"></div><div class="sk-cube sk-cube9">'
                + ' </div></div>');
    }
    EndLoading = function () {
        --countCallLoading;
        if (countCallLoading <= 0) {
            countCallLoading = 0;
            $('.loading').remove();
        }
    }
})
//#endregion

//#region Create Event EnterKey
$.fn.enterKey = function (fnc) {
    return this.each(function () {
        $(this).keypress(function (ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
                fnc.call(this, ev);
            }
        })
    })
}
//#endregion