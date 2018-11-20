var table;
$(function () {
    $("#Form #DateUpdate").daterangepicker({
        "singleDatePicker": true,
        "locale": {
            "format": "DD/MM/YYYY",
            "firstDay": 1
        }
    });
    var loadtable = function () {
        table = $("#table").InStallDatatable({
        }, "/UpdateHistory/GetDataTable", [
            { "data": null, "name": null, "orderable": false, "class": "select-checkbox", "width": "10%", "render": function () { return ""; } },
         {
             "data": "DateUpdate", "name": "DateUpdate", "width": "15%", "class": "text-left", "render": function (data, type, row) {
                 return moment(data).format("DD MMM YYYY");
             }
         },
         {
             "data": "Subject", "name": "Subject", "width": "65%", "class": "text-left"
         },
         {
             "data": "IsShow", "name": "IsShow", "width": "10%", "class": "text-left"
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
    loaddata();
    $("#containtButtonCreate").InStallButtonFooter("buttonCreate", "tittleButton", "New");
    $("#containtButtonCreate").click(function () {
        $("#TitleModal").text("New Update history");
        $("#UpdateID").val(0);
        $("#Subject").val("");
        $("#Detail").val("");
        $("#Link").val("");
        $("#IsShow")[0].checked = true;
        $("#IsShow").trigger("change");
        $('#actionModal').modal("show");
    })
    $(document).on("click", "#table tbody tr td:not(.select-checkbox)", function () {
        $("#TitleModal").text("Update data");
        var data = table.row($(this).closest("tr")).data();
        $("#UpdateID").val(data.UpdateID);
        $("#Subject").val(data.Subject);
        $("#Detail").val(data.Detail);
        $("#Link").val(data.Link);
        $("#DateUpdate").data('daterangepicker').setStartDate(data.DateUpdate ? moment(data.DateUpdate)._d : moment()._d);
        $("#DateUpdate").data('daterangepicker').setEndDate(data.DateUpdate ? moment(data.DateUpdate)._d : moment()._d);
        $("#IsShow")[0].checked = data.IsShow;
        $("#IsShow").trigger("change");
        $('#actionModal').modal("show");
    })
    $("#deleteMuliButton").click(function () {
        var itemArray = table.rows({
            selected: true
        }).data();
        if (itemArray.length > 0) {
            if (confirm("Do you want to delete the selected element?")) {
                var lsIdItem = [];
                $.each(itemArray, function (index, value) {
                    lsIdItem.push(value.UpdateID);
                });
                $.RequestAjax("/UpdateHistory/DeleteMulti", JSON.stringify({
                    "UpdateIDs": lsIdItem
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
            if ($("#Form").valid()) {
                var entity = new Object();
                $("#Form").find("[ispropertiesmodel]").each(function () {
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
                debugger;
                $.RequestAjax("/UpdateHistory/AddOrUpdate", JSON.stringify({
                    entity: entity,
                    isUpdate: $("#Form [ispropertiesidmodel]").val() != 0,
                }), function (data) {
                    if (data.Result == true) {
                        toastr["success"]("Data saved successfully.", "Notification");
                        loaddata();
                        $('#actionModal').modal("hide");
                    }
                    else {
                        toastr["error"]("Save data not success (" + data.ErrorMessage + ")", "Error");
                    }
                }, function () {
                    instance.stop();
                })
            } else
                instance.stop();
        }
    });
});