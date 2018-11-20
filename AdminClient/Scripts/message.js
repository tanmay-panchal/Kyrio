var table;
$(function () {
    //#region Load data && setup control
    CreateBreadcrumb([{ href: "/Messages/Index", title: "Messages" }]);
    table = $("#table").InStallDatatable(null, "/Messages/GetDataTable", [
         {
             "data": "TimeSent", "name": "TimeSent", "width": "15%", "class": "text-left", "render": function (data, type, row) {
                 return moment(data).format(Window.FormatDateWithTimeJS);
             }
         },
         {
             "data": "ClientName", "name": "ClientName", "width": "15%", "class": "text-left", "render": function (data, type, row) {
                 return row.ClientID ? ('<span > <a href="/Clients/Clients?id=' + row.ClientID + '">' + data + '</a></span>') : data;
             }
         },
         {
             "data": "AppointmentNo", "name": "AppointmentNo", "width": "10%", "class": "text-left", "render": function (data, type, row) {
                 return row.AppointmentID ? ("<a style='color:#2B72BD'>" + '<span name="openAppointmentView">' + data + '</span>' + "</a>") : data;
             }
         },
         { "data": "Destination", "name": "Destination", "width": "15%", "class": "text-left" },
         { "data": "MessageType", "name": "MessageType", "width": "15%", "class": "text-left" },
         {
             "data": "MessageSubject", "name": "MessageSubject", "width": "20%", "class": "text-left", "render": function (data, type, row) {
                 return "<a name='viewmessage' style='color:#2B72BD'>" + data + "</a>";
             }
         },
         {
             "data": "MessageStatus", "name": "MessageStatus", "width": "10%", "class": "text-left", "render": function (data, type, row) {
                 var html = "";
                 if (data == 'message_status_sent') {
                     html = '<span class="badge badge-success" style="width:70px">' + Window.ResourcesEnum[data].toUpperCase() + '</span>';
                 }
                 else if (data == "message_status_sending") {
                     html = '<span class="badge badge-secondary" style="width:70px">' + Window.ResourcesEnum[data].toUpperCase() + '</span>';
                 }
                 else {
                     html = '<span class="badge badge-warning" style="width:70px">' + Window.ResourcesEnum[data].toUpperCase() + '</span>';
                 }
                 return html;
             }
         },
    ], true, true, true, false, null, true, null, null, null, {
        language: {
            search: "",
            searchPlaceholder: "Search by name, e-mail or booking reference",
            "info": "Displaying _START_ - _END_ of _TOTAL_ total messages",
            "infoEmpty": "",
        }
    });
    //#endregion

    //#region event 
    $(document).on("click", "a[name='viewmessage']", function () {
        if (table != null) {
            var html = "";
            var data = table.row($(this).closest("tr")).data();
            if (data.MessageSubject != null && data.MessageSubject != "" && data.MessageSubject != "Invoice copy") {
                var ret = "";
                var lstr = data.MessageBody.split(/\n/);
                $.each(lstr, function (index, value) {
                    ret = ret + "<p>" + value.replace("\n", "<br>") + "</p>";
                });

                html = '<div class="col-fhd-12 col-xlg-12 col-md-12 col-sm-12 col-xs-12 ">' + ret + '</div>';

            }
            else {
                html = '<div class="col-fhd-12 col-xlg-12 col-md-12 col-sm-12 col-xs-12 ">' + data.MessageBody + '</div>';
            }
            $('#frame').attr("srcdoc", html);
            $('#actionModal').modal("show");
        }
    })
    $(document).on("click", "span[name='openAppointmentView']", function () {
        if (table != null) {
            var data = table.row($(this).closest("tr")).data();
            $.CallViewAppointment(data.AppointmentID);
        }
    })
    //#endregion
})