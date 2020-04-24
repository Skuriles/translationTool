"use strict";
// main
var languageState = 0; // 0 == en, 1 == de
(() => {
  function init() {
    initRoutes();
    enableGlobalListener();
    enableListener();
  }
  init();
})();

function initRoutes() {
  var router = new Router([
    new Route("home", "home.html", true),
    new Route("about", "about.html"),
    new Route("contact", "contact.html"),
  ]);

  var route = router.getActiveRoute();
  $(".navButton").each((index, ele) => {
    if (!route) {
      if ($(ele).attr("data-name") == "home") {
        $(ele).removeClass("is-white");
        $(ele).addClass("is-dark");
      }
    } else if ($(ele).attr("data-name") == route.name) {
      $(ele).removeClass("is-white");
      $(ele).addClass("is-dark");
    }
  });
}

function enableGlobalListener() {
  // menu
  $("#menuBtn").click(() => {
    $("#mainNavBar").toggle(300);
    $("#app").toggleClass("menuActive");
  });

  $("#mainNavBar").on("click", ".navButton", (e) => {
    $(".navButton").removeClass("is-dark");
    $(".navButton").addClass("is-white");
    var target = $(e.target).closest(".navButton");
    if (target.hasClass("is-white")) {
      target.removeClass("is-white");
      target.addClass("is-dark");
    }
  });

  $(window).on("resize", function () {
    var win = $(this); //this = window
    if (win.width() >= 1023) {
      $("#mainNavBar").show();
      $("#app").removeClass("menuActive");
    }
    if (win.width() < 1023) {
      $("#mainNavBar").hide();
    }
  });
}

function enableListener() {
  // home
  $("#app").on("click", "#translateBtn", (e) => {
    translate($("#translateInput").val());
  });

  $("#app").on("click", "#saveBtn", (e) => {
    save();
  });

  $("#app").on("click", "#translateMsgCloseBtn", () => {
    $("#translateResultMsgBox").hide();
  });

  $("#app").on("click", "#switchBtn", () => {
    switchLanguage();
  });

  // contact
  $("#app").on("click", "#terms", (e) => {
    e.preventDefault();
    $("#termsModal").addClass("is-active");
  });

  $("#app").on("click", "#closeTermsModal", () => {
    $("#termsModal").removeClass("is-active");
  });

  $("#app").on("click", "#okBtn", () => {
    $("#termsModal").removeClass("is-active");
  });

  $("#app").on("click", "#termsChecked", () => {
    var checked = $("#termsChecked").prop("checked");
    if (checked) {
      $("#submit").prop("disabled", false);
    } else {
      $("#submit").prop("disabled", true);
    }
  });

  $("#app").on("click", "#msgCloseBtn", () => {
    $("#emailResultMsgBox").hide();
  });

  $("#app").on("click", "#submit", () => {
    var checked = $("#termsChecked").prop("checked");
    if (checked) {
      $("#emailResultMsgBox").show();
    }
  });
}

function translate(translateTxt) {
  $("#translateResultMsgBox").hide();
  $("#translateResult").val("");
  $.get("php/translate.php", {
    text: translateTxt,
  }).done((data) => {
    var result = JSON.parse(data);
    if (result.success) {
      $("#translateResult").val(result.result);
    } else {
      $("#translateResultMsgBox").show();
      $("#translateMsgBody").html(result.err);
    }
  });
}

function save() {
  var output = $("#translateResult").val();
  var input = $("#translateInput").val();
  $.get("php/download.php", {
    input: input,
    output: output,
  }).done((data) => {
    var file = new Blob([data], {
      type: "text/plain",
    });
    var filename = "result.txt";
    if (window.navigator.msSaveOrOpenBlob)
      // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
    else {
      // Others
      var a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  });
}

function hideMenu() {
  var win = $(this); //this = window
  if (win.width() < 1023) {
    $("#mainNavBar").hide();
  }
}

function switchLanguage() {
  if (languageState == 0) {
    setGerman();
    languageState = 1;
  } else {
    setEnglish();
    languageState = 0;
  }
}

function setEnglish() {
  $("#translateBtn").text("TRANSLATE");
  $("#inputLabel").html('Enter text <span class="flag-icon flag-icon-us"></span>');
  $("#outputLabel").html('Your result <span class="flag-icon flag-icon-de"></span>');
  $("#saveBtn").text("SAVE");
}

function setGerman() {
  $("#translateBtn").text("ÜBERSETZEN");
  $("#inputLabel").html('Text eingeben <span class="flag-icon flag-icon-de"></span>');
  $("#outputLabel").html('Ihr Ergebnis <span class="flag-icon flag-icon-us"></span>');
  $("#saveBtn").text("SPEICHERN");
}