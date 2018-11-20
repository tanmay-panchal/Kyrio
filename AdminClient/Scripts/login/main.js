var pageIs = 0;
var loadPage = function () {
    var fileJSLogin = "/Scripts/login/login.js";
    var fileJSRegister = "/Scripts/login/register.js";
    var fileJSForgotPassword = "/Scripts/login/forgotpassword.js";
    var fileJSChangePassword = "/Scripts/login/changepassword.js";
    var urlFileJSLoad = "";
    var hash = window.location.hash;
    if (!hash || hash == "#login") {
        $("#containLogin").show();
        $("#containRegister").hide();
        $("#containForgotPassword").hide();
        $("#containChangePassword").hide();
        if (parseInt($(window).width()) >= 1024) {
            $("#containLogin .py-5").show();
            $("#containLogin .card-footer").hide();
        } else {
            $("#containLogin .py-5").hide();
            $("#containLogin .card-footer").show();
        }
        urlFileJSLoad = fileJSLogin;
        pageIs = 0;
        document.title = "Login";
    } else if (hash == "#register") {
        $("#containLogin").hide();
        $("#containRegister").show();
        $("#containForgotPassword").hide();
        $("#containChangePassword").hide();
        urlFileJSLoad = fileJSRegister;
        document.title = "Sign up";
        pageIs = 1;
    } else if (hash == "#forgotpassword") {
        $("#containLogin").hide();
        $("#containRegister").hide();
        $("#containForgotPassword").show();
        $("#containChangePassword").hide();
        urlFileJSLoad = fileJSForgotPassword;
        document.title = "Recovery Password";
        pageIs = 2;
    } else if (hash == "#changepassword") {
        $("#containLogin").hide();
        $("#containRegister").hide();
        $("#containForgotPassword").hide();
        $("#containChangePassword").show();
        urlFileJSLoad = fileJSChangePassword;
        document.title = "Change Password";
        pageIs = 3;
    }

    $.getScript(urlFileJSLoad).done(function (script, textStatus) {
        console.log("Load file js success");
    }).fail(function (jqxhr, settings, exception) {
        console.log("Load file js failed");
    });
}
$(function () {
    loadPage();
})
window.onhashchange = loadPage
$(window).resize(function () {
    loadPage();
});
$(document).enterKey(function () {
    switch (pageIs) {
        case 0:
            $("#loginButton").trigger("click");
            break;
        case 1:
            $("#buttonExcuteRegister").trigger("click");
            break;
        case 2:
            $("#forgotPasswordButton").trigger("click");
            break;
        case 3:
            $("#changePasswordButton").trigger("click");
            break;
    }
})