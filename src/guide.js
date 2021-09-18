window.onload = function () {
  var script = document.createElement("script");
  script.src =
    "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.head.appendChild(script);
  googleTranslateElementInit();
};

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "it" },
    "google_translate_element"
  );
}
