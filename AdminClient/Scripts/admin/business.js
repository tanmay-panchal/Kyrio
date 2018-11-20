var table;
var autocomplete;
var tableUser;
function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('Address'), {

    });
}
$(function () {

    //#region Install Control
    CreateBreadcrumb([{ href: "/Business", title: "Business" }])
    $("#busiessForm #PackageID").InStallSelect2('/Home/LoadSelect2ForPackage', 20, 'Package', null);
    $("#busiessForm #BusinessTypeID").InStallSelect2('/Home/LoadSelect2ForBusinessType', 20, 'Business Type', null);
    $("#busiessForm #CountryID").InStallSelect2('/Home/LoadSelect2ForCountry', 20, 'Country', null);
    $("#busiessForm #TimeZoneID").InStallSelect2('/Home/LoadSelect2ForTimeZone', 20, 'Time Zone', null);
    $("#busiessForm #CurrencyCode").InStallSelect2('/Home/LoadSelect2ForCurrency', 20, 'Currency', null);
    $("#busiessForm #TimeFormat").InStallSelect2('/Home/LoadSelect2ForTimeFormat', 20, 'Time Format', null);
    $("#busiessForm #ContactNumber").intlTelInput({
        separateDialCode: true,
        initialCountry: "SG",
        preferredCountries: ["SG"],
        utilsScript: "/Extension/js/utils.js"
    });
    $("#busiessForm #ExpireDate").daterangepicker({
        "singleDatePicker": true,
        "locale": {
            "format": "DD/MM/YYYY",
            "firstDay": 1
        }
    });
    //#endregion

    //#region Load Data
    var loadtable = function () {
        table = $("#table").InStallDatatable({
        }, "/Business/GetDataTableBusiness", [
         { "data": null, "name": null, "orderable": false, "class": "select-checkbox", "width": "10%", "render": function () { return ""; } },
         {
             "data": "CompanyName", "name": "CompanyName", "width": "10%", "class": "text-left"
         },
         {
             "data": "Email", "name": "Email", "width": "10%", "class": "text-left"
         },
         {
             "data": "BusinessTypeName", "name": "BusinessTypeName", "width": "10%", "class": "text-left"
         },
         {
             "data": "CountryName", "name": "CountryName", "width": "10%", "class": "text-left"
         },
         {
             "data": "ContactNumber", "name": "ContactNumber", "width": "10%", "class": "text-left", "render": function (data, type, row) {
                 return data == null ? "" : "+" + row.ContactNumberDialCode + " " + data;
             }
         },
         {
             "data": "CreateDate", "name": "CreateDate", "class": "text-left", "width": "15%", "render": function (data, type, row) {
                 return moment(data).format("dddd, DD MMM YYYY");
             }
         },
         {
             "data": "Expiry", "name": "Expiry", "class": "text-left", "width": "15%", "render": function (data, type, row) {
                 return data == null ? "" : moment(data).format("dddd, DD MMM YYYY");
             }
         },
        {
            "data": "PackageName", "name": "PackageName", "width": "10%", "class": "text-left"
        }
        ], true, true, true, true, 1, true, null, null, null, {
            language: {
                search: "",
                searchPlaceholder: "Search"
            }
        });
    }
    var loaddata = function () {
        if ($.fn.DataTable.isDataTable('#table'))
            table.destroy();
        loadtable();
    }
    var loadTableUser = function (BussinessID) {
        if ($.fn.DataTable.isDataTable('#tableUser'))
            tableUser.destroy();
        tableUser = $("#tableUser").InStallDatatable({
            BussinessID: BussinessID
        }, "/Business/GetDataTableUser", [
              { "data": "Name", "name": "Name", "class": "text-left" },
              { "data": "CreateDate", "name": "CreateDate", "class": "text-left", "render": function (data) { return moment(data).format("YYYY/MM/DD"); } },
              { "data": "RoleName", "name": "RoleName", "class": "text-center" },
        ], true, false, false, false, 1, true, null, null, null);
    }
    loaddata();
    //#endregion

    //#region Event
    $(document).on("click", "#table tbody tr td:not(.select-checkbox)", function () {
        $("#TitleModal").text("Business");
        var data = table.row($(this).closest("tr")).data();
        var country = "";
        $.each($.fn.intlTelInput.getCountryData(), function () {
            if (data.ContactNumberDialCode == this.dialCode) {
                country = this.iso2;
                return;
            }
        })

        loadTableUser(data.BusinessID);
        $('#deleteButton').show();
        $("#BusinessID").val(data.BusinessID);
        $("#PackageID").SetValueSelect2ID(data.PackageID);
        $("#CompanyName").val(data.CompanyName);
        $("#Description").val(data.Description);
        $("#Address").val(data.Address);
        $("#Website").val(data.Website);
        $("#ContactNumber").intlTelInput("setCountry", country);
        $("#ContactNumber").val(data.ContactNumber);
        $("#BusinessTypeID").SetValueSelect2ID(data.BusinessTypeID);
        $("#TimeZoneID").SetValueSelect2ID(data.TimeZoneID);
        $("#TimeFormat").SetValueSelect2ID(data.TimeFormat);
        $("#CountryID").SetValueSelect2ID(data.CountryID);
        $("#CurrencyCode").SetValueSelect2ID(data.CurrencyCode);
        $("#ExpireDate").data('daterangepicker').setStartDate(data.Expiry ? moment(data.Expiry)._d : moment()._d);
        $("#ExpireDate").data('daterangepicker').setEndDate(data.Expiry ? moment(data.Expiry)._d : moment()._d);
        //lay location
        $.RequestAjax("/Business/GetLocationByBusiness", JSON.stringify({
            BusinessID: data.BusinessID
        }), function (data) {
            $("#containLocation").html('');
            $.each(data.data, function () {
                var html = '<div class="col-md-12"><strong>' + this.LocationName + '</strong></div>';
                html = html + '<div class="col-md-12">' + this.StreetAddress + '</div>';
                $("#containLocation").append(html);
            })
        }, function () {
        })
        $('#actionModal').modal("show");
    })
    $(document).on("click", "#tableUser tbody tr td", function () {
        var data = tableUser.row($(this).closest("tr")).data();
        $.InstallModalStaff(data.UserID, function () {
            setTimeout("tableUser.ajax.reload()", 500);
        });
    })
    $("#deleteMuliButton").click(function () {
        var itemArray = table.rows({
            selected: true
        }).data();
        if (itemArray.length > 0) {
            if (confirm("Do you want to delete the selected element?")) {
                var lsIdItem = [];
                $.each(itemArray, function (index, value) {
                    lsIdItem.push(value.BusinessID);
                });
                $.RequestAjax("/Business/DeleteMulitiBussines", JSON.stringify({
                    "BusinessIDs": lsIdItem
                }), function (data) {
                    toastr["success"]("Delete data successfully.", "Notification");
                    loaddata();
                })
            }
        }
        else {
            toastr["success"]("Please select at least 1 element.", "Notification");
        }
    })
    Ladda.bind('#actionButton', {
        callback: function (instance) {
            instance.start();
            if ($("#busiessForm").valid()) {
                var entity = new Object();
                $("#busiessForm").find("[ispropertiesmodel]").each(function () {
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
                $.extend(entity, { ContactNumberDialCode: $("#ContactNumber").intlTelInput("getSelectedCountryData").dialCode });
                $.RequestAjax("/Business/SaveCompanyDetails", JSON.stringify({
                    business: entity,
                    ExpireDate: $("#ExpireDate").data('daterangepicker').startDate.format("YYYY/MM/DD")
                }), function (data) {
                    toastr["success"]("Data saved successfully.", "Notification");
                    loaddata();
                    $('#actionModal').modal("hide");
                }, function () {
                    instance.stop();
                })
            } else
                instance.stop();
        }
    });
    //#endregion

});