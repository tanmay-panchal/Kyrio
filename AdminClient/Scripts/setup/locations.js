var table;
// autocomplete google map
var autocomplete;
function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('StreetAddress'), {
        componentRestrictions: { country: $("#CountryCode").val() }
    });
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        if (place.address_components) {
            for (var i = 0; i < place.address_components.length; i++) {
                if (place.address_components[i].types[0] == "administrative_area_level_1") {
                    $("#CITY").val(place.address_components[i].long_name);
                } else if (place.address_components[i].types[0] == "country") {
                    $("#STATE").val(place.address_components[i].long_name);
                }
            }
        }
    });
}
$(function () {
    //#region Load data && setup control
    CreateBreadcrumb([{ href: "/Setup/Index", title: "Setup" }, { href: "/Setup/Locations", title: "Locations" }])
    table = $("#tableLocation").InStallDatatable(null, "/Setup/GetDataTableLocation", [
        {
            "data": null, "name": null, "width": "5%", "class": "text-center", "render": function (data, type, row) {
                return '<i class="icon-menu icons"></i>';
            }
        },
         { "data": "LocationName", "name": "LocationName", "width": "15%", "class": "text-left" },
         {
             "data": "StreetAddress", "name": "StreetAddress", "width": "80%", "class": "text-left", "render": function (data, type, row) {
                 return (row.StreetAddress != null ? row.StreetAddress + ", " : "") + (row.APT != null ? row.APT + ", " : "") + (row.City != null ? row.City + ", " : "") + (row.State != null ? row.State + ", " : "") + (row.ZipCode != null ? row.ZipCode : "");
             }
         },
    ], true, false, false, false, null, true, null, null, null, {
        "rowReorder": true
    });
    table.on('row-reorder', function (e, diff, edit) {
        $.each(diff, function () {
            var SortOrderNew = table.row(this.newPosition).data().SortOrder;
            var LocationID = table.row(this.node).data().LocationID;
            $.RequestAjax("/Setup/UpdateSortOrderLocation", JSON.stringify({
                LocationID: LocationID,
                SortOrderNew: SortOrderNew,
            }), function () {

            })
        })
    })
    $('#actionForm').validate({
        rules: {
            LocationName: 'required',   
            StreetAddress: 'required',
            CITY: 'required',
        },
        messages: {
            LocationName: 'Please enter your location name',
            StreetAddress: 'Please enter your street address',
            CITY: 'Please enter your city',
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
    $('#actionModal').modal({
        backdrop: false,
        show: false,
    })
    $('#actionModal').on('hidden.bs.modal', function (e) {
        $("body").find(".modal-backdrop").remove();
    })
    $('#actionModal').on('shown.bs.modal', function (e) {
        $("body").append('<div class="modal-backdrop fade show"></div>');
    })
    $("#containtButtonCreate").InStallButtonFooter("buttonCreate", "tittleButton", "New Location");

    //#endregion

    //#region event 
    $(document).on("click", "#tableLocation tbody tr td", function () {
        var data = table.row($(this).closest("tr")).data();
        $("#TitleModal").text("Edit Location");
        $("#LocationID").val(data.LocationID);
        $("#LocationName").val(data.LocationName);
        $("#ContactNumber").val(data.ContactNumber);
        $("#ContactNumberDialCode").val(data.ContactNumberDialCode);
        $("#ContactEmail").val(data.ContactEmail);
        $("#StreetAddress").val(data.StreetAddress);
        $("#APT").val(data.APT);
        $("#CITY").val(data.City);
        $("#STATE").val(data.State);
        $("#ZipCode").val(data.ZipCode);
        $("#EnableOnlineBooking")[0].checked = data.EnableOnlineBooking;
        $('#EnableOnlineBooking').iCheck('update');
        $('#deleteButton').show();
        $('#actionModal').modal("show");
    })
    $("#containtButtonCreate").click(function () {
        $("#TitleModal").text("New Location");
        $("#LocationID").val(0);
        $("#LocationName").val("");
        $("#ContactNumber").val("");
        $("#ContactNumberDialCode").val("");
        $("#ContactEmail").val("");
        $("#StreetAddress").val("");
        $("#APT").val("");
        $("#CITY").val("");
        $("#STATE").val("");
        $("#ZipCode").val("");
        $("#EnableOnlineBooking")[0].checked = true;
        $('#EnableOnlineBooking').iCheck('update');
        $('#deleteButton').hide();
        $('#actionModal').modal("show");
    })
    $("#deleteButton").click(function () {
        PNotify.notice({
            title: 'DELETE LOCATION',
            text: 'Are you sure you want to delete this location?',
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
                            $.RequestAjax("/Setup/DeleteLocation", JSON.stringify({
                                id: $("#LocationID").val()
                            }), function (data) {
                                if (!JSON.parse(data.Result)) {
                                    if (parseInt(data.ErrorStyle) != 0) {
                                        toastr["error"](data.ErrorMessage, "Error");
                                    } else {
                                        toastr["error"]("Delete data failed. Please contact the developer to fix it.", "Error");
                                        console.log("Xóa dữ liệu thất bại: " + data.ErrorMessage);
                                    }
                                }
                                else {
                                    toastr["success"]("Delete data successfully", "Notification");
                                    setTimeout("table.ajax.reload()", 500);
                                }
                                $('#actionModal').modal("hide");
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
    Ladda.bind('#actionButton', {
        callback: function (instance) {
            instance.start();
            if ($("#actionForm").valid()) {
                var success = function (data) {
                    toastr["success"]("Data saved successfully.", "Notification");
                    $('#actionModal').modal("hide");
                    setTimeout("table.ajax.reload()", 500);
                };
                $("form").AddOrUpdateForm("/Setup/AddOrUpdateLocation", success, null, null, function () {
                    instance.stop();
                });
            } else
                instance.stop();
        }
    });
    //#endregion
})