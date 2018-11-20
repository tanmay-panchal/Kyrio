
$(function () {
    CreateBreadcrumb([{ href: "/OnlineBookingSetting/Index", title: "Online Booking" }])
    //Load Data APPOINTMENT COLOR
    $.RequestAjax('/Home/GetDefaultColor', null, function (data) {
        $.each(data.Result, function () {
            $("#colorGroup").InstallButtonColor("AppointmentColor", "buttonAppointmentColor", this.DefaultColorCode);
            $(document).on("click", "[name='buttonAppointmentColor']", function () {

                var color = $(this).closest("div").find('[type="radio"]').attr("valuecolor");

                $('#booking_button_code').text($("#booking_button_code_hide").val().replace('BACKGROUND_COLOR', color));
                $('#booking_button_code').text($("#booking_button_code").val().replace('BOOKING_PAGE_LINK', link));
                $('#booking_button_code').text($("#booking_button_code").val().replace('BUTTON_TEXT', $('#online_button_customizations_text').val()));
                //set background button
                $("#online_button_customizations_preview").css("background", color)
            })
        })
    })
    //#endregion

    var link = Window.booking_page_link + Window.BusinessID + '/link';
    var linkfacebook = Window.booking_page_link + Window.BusinessID + '/facebook';
    $('#booking_page_link').text(link);
    $("#booking_page_link").prop("href", link)
    $("#booking_page_link_facebook").prop("href", "https://www.facebook.com/dialog/pagetab?app_id=" + Window.FaceBookAppID + "&next=" + linkfacebook)
    $("#online_button_customizations_preview").prop("href", link)
    $("#online_button_customizations_preview").css("background", $('[name="AppointmentColor"]:checked').attr("valuecolor"))

    $('#booking_button_code').text($("#booking_button_code_hide").val().replace('BACKGROUND_COLOR', $('[name="AppointmentColor"]:checked').attr("valuecolor")));
    $('#booking_button_code').text($("#booking_button_code").val().replace('BOOKING_PAGE_LINK', link));
    $('#booking_button_code').text($("#booking_button_code").val().replace('BUTTON_TEXT', $('#online_button_customizations_text').val()));
    //facebook
    $('#facebook_button_link').text(linkfacebook);
    $("#facebook_button_link").prop("href", linkfacebook)
    //widget
    $('#code_embed_booking_widget').text($("#code_embed_booking_widget_hide").val().replace('BOOKING_PAGE_LINK', link));
    $('#code_embed_booking_widget').text($("#code_embed_booking_widget").val().replace('HEIGHT_PX', $('#frame_height').val()));
    $("#shedulWidget").prop("src", link)

    //#region event
    document.getElementById("copylinkbooking").addEventListener("click", function () {
        copyToClipboard(document.getElementById("booking_page_link"));
    });

    document.getElementById("copyembedcode").addEventListener("click", function () {
        copyToClipboard(document.getElementById("booking_button_code"));
    });

    document.getElementById("copylinkfacebook").addEventListener("click", function () {
        copyToClipboard(document.getElementById("facebook_button_link"));
    });

    document.getElementById("copy_code_embed_booking_widget").addEventListener("click", function () {
        copyToClipboard(document.getElementById("code_embed_booking_widget"));
    });

    //chua xu ly su kien click doi mau va replace mau 

    $('#online_button_customizations_text').on('input', function (e) {
        var input = $(this);
        $('#online_button_customizations_preview').text(input.val());

        $('#booking_button_code').text($("#booking_button_code_hide").val().replace('BACKGROUND_COLOR', $('[name="AppointmentColor"]:checked').attr("valuecolor")));
        $('#booking_button_code').text($("#booking_button_code").val().replace('BOOKING_PAGE_LINK', link));
        $('#booking_button_code').text($("#booking_button_code").val().replace('BUTTON_TEXT', $('#online_button_customizations_text').val()));
    });

    $('#frame_height').on('input', function (e) {
        var input = $(this);
        $('#code_embed_booking_widget').text($("#code_embed_booking_widget_hide").val().replace('BOOKING_PAGE_LINK', link));
        $('#code_embed_booking_widget').text($("#code_embed_booking_widget").val().replace('HEIGHT_PX', $('#frame_height').val()));
        $('#shedulWidget').css('height', $('#frame_height').val() + "px")
    });
    //#endregion
})

function copyToClipboard(elem) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch (e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}