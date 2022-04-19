function runSettings() {
    let elem = document.getElementById('commentSlider');
    let target = document.getElementById('commentAmount');
    target.innerHTML = 30;
    let rangeValue = function (elem, target) {
        return function(evt){
            target.innerHTML = elem.value;
        }
    }
    elem.addEventListener('input', rangeValue(elem, target));
}

window.onload = runSettings;