//file store parameter global for web application

//ajax
var urlAjaxGetAllMenu = "/Menu/GetMenuForWeb";                             //url for get all menu 

//xml url
var urlXmlOrderModuleOfMenu = "/XML/OrderModuleOfMenu.xml";

//json language
var languageDatatable = "../Extension/datatables.net/language/vi.json";

//file js
var fileInputMask = ["/Extension/jquery.inputmask/dist/min/inputmask/inputmask.min.js", "/Extension/jquery.inputmask/dist/min/inputmask/inputmask.extensions.min.js", "/Extension/jquery.inputmask/dist/min/inputmask/inputmask.numeric.extensions.min.js", "/Extension/jquery.inputmask/dist/min/jquery.inputmask.bundle.min.js"];

//parameter notification plugin (toarstr plugin)
toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": true,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
var reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;