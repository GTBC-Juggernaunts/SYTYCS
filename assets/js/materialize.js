M.AutoInit();

document.addEventListener('DOMContentLoaded', function () {
    var options = {

    };
    var elems = document.querySelectorAll('.tooltipped');
    var instances = M.Tooltip.init(elems, options);
});