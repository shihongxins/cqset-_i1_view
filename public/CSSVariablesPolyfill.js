(function () {
  document.documentElement.style.setProperty('--test-css-variables', '1');
  let testCSSVariables =
    parseInt(document.documentElement.style.getPropertyValue('--test-css-variables') || '0') || 0;
  if (!testCSSVariables || (window.MSInputMethodContext && document.documentMode)) {
    console.log('add ie11CustomProperties polyfill');
    document.write(
      '<script src="https://cdn.jsdelivr.net/gh/nuxodin/ie11CustomProperties@4.1.0/ie11CustomProperties.min.js"></script>'
    );
  }
})();
