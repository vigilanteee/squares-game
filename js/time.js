var countDownDate;
var timer_set;

function start_inter() {
    countDownDate = new Date().getTime() + 32 * 1000;
    timer_set = setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById("time").innerHTML = "Время: " + seconds + " сек.";
        if (distance < 0) {
            clearInterval(timer_set);
            if (distance <= 0) {
                game_over_bad();
            }
        }
    }, 1000);
}