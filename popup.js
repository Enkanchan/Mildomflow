function runSettings() {
    var elem = document.getElementById('commentSlider');
    var target = document.getElementById('commentAmount');
    target.innerHTML = 30;
    var rangeValue = function (elem, target) {
        return function(evt){
            target.innerHTML = elem.value;
        }
    }
    elem.addEventListener('input', rangeValue(elem, target));
}

window.onload = runSettings;