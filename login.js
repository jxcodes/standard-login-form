(function () {
  // Globals
  var config = window.__APP_SHELL || {};
  var defaultConfig = {
    userId: "usr",
    pwdId: "pwd",
    lgnBntId: "lgn-btn",
    msgId: "msg",
    usrParam: "user",
    pwdParam: "password",
    continueParam: "continue"
  };
  var getCfgParam = function (key) { return config[key] || defaultConfig[key]; };
  // service url is required
  if (!config.loginServiceUrl) {
    throw Error("window.__APP_SHELL.loginServiceUrl is required please fix it!");
  }
  // status
  var redirecting = false, authenticating = false;
  // Params
  var userId = getCfgParam("userId"), pwdId = getCfgParam("pwdId"), lgnBntId = getCfgParam("lgnBntId"), msgId = getCfgParam("msgId"), usrParam = getCfgParam("usrParam"), pwdParam = getCfgParam("pwdParam"), continueParam = getCfgParam("continueParam");
  // Set default login redirect
  if (!config.loginRedirectUrl) {
    var currentUrl = window.location.href, re = new RegExp(`${continueParam}=.+`);
    if (re.test(currentUrl)) {
      config.loginRedirectUrl = re.exec(currentUrl)[1];
    }
    else {
      config.loginRedirectUrl = currentUrl.substr(0, currentUrl.lastIndexOf("/"));
    }
  }
  function doLogin() {
    // Avoid multiple requests
    if (authenticating || redirecting) {
      return;
    }
    var user = $(`#${userId}`).val(), pass = $(`#${pwdId}`).val();
    if (!user) {
      $(`#${userId}`).focus();
      return;
    }
    if (!pass) {
      $(`#${pwdId}`).focus();
      return;
    }
    var credentials = {};
    credentials[usrParam] = user;
    credentials[pwdParam] = pass;
    hideMessage();
    setStatusAuthenticating();
    $.ajax({
      url: config.loginServiceUrl,
      method: "POST",
      dataType: "json",
      data: credentials,
      success: function () {
        setStatusRedirecting();
        window.location.assign(config.loginRedirectUrl);
      },
      error: function (xhr) {
        showMessage(xhr.responseText || "Usuario o contraseña incorrecto!");
      },
      complete: function () {
        setStatusReady();
      }
    });
  }
  // Ready status
  var setStatusReady = function () {
    $(".form-container").removeClass("status-authenticating");
    $(`#${lgnBntId}`).prop("disabled", false);
    authenticating = false;
  };
  // Authenticating status
  var setStatusAuthenticating = function () {
    $(".form-container").addClass("status-authenticating");
    $(`#${lgnBntId}`).prop("disabled", true);
    authenticating = true;
  };
  // Status: Redirecting
  var setStatusRedirecting = function () {
    redirecting = true;
  };
  // Shows a notification
  var showMessage = function (message) {
    var msgEl = $(`#${msgId}`);
    msgEl.html(message);
    msgEl.show();
    msgEl.shake({
      distance: 20,
      interval: 50
    });
  };
  // Hides the notificatión
  var hideMessage = function () {
    $(`#${msgId}`).html("").hide();
  };
  /*Listeners*/
  //On Login Click
  $(`#${lgnBntId}`).on("click", doLogin);
  // Do login on ENTER key press
  $("body").keypress(function (e) {
    if (e.key == "Enter") {
      doLogin();
    }
  });
  // focus user input
  $(document).ready(function () {
    $("input").first().focus();
  });
})();
// Shake effect
(function ($) {
  $.fn.shake = function (options) {
    options = options || {};
    // set defaults
    options = {
      interval: options.interval || 100,
      distance: options.distance || 10,
      times: options.times || 4,
      complete: options.complete || function () { }
    };
    $(this).css("position", "relative");
    for (var i = 0; i < options.times + 1; i++) {
      $(this).animate({ left: i % 2 == 0 ? options.distance : options.distance * -1 }, options.interval);
    }
    $(this).animate({ left: 0 }, options.interval, options.complete);
  };
})(jQuery);
