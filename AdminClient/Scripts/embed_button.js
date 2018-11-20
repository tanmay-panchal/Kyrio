'use strict';

(function () {
    addClassClickEvent('shedul-embed-button-link', function () {
        var url = this.getAttribute('href');
        var win = window.open(url, '_blank');
        win.focus();
    });

    /* utility methods */

    function addClassClickEvent(klass, callback) {
        document.addEventListener('click', function (event) {
            var targetClass = event.target && event.target.getAttribute("class");
            if (event.button === 0 && targetClass && targetClass.indexOf(klass) >= 0) {
                event.preventDefault();
                callback.call(event.target);
            }
        }, false);
    }
})();
