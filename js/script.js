let square_colors = [3, 4, 6];
let square_count = [3, 5, 7];
let colors = ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF007F','#FF8000'];

var result_save_str = null;

window.addEventListener("DOMContentLoaded", initRes);

function initRes() {
  if(sessionStorage.getItem("result_save_str")) {
    result_save_str = sessionStorage.getItem("result_save_str");
  } else {
    result_save_str = '';
  }
}

var name_file = null;

window.addEventListener("DOMContentLoaded", initName);

function initName() {
  if (sessionStorage.getItem("name_file")) {
    name_file = sessionStorage.getItem("name_file");    
  } else {
    name_file = 'empty';
  }
}

var level = null;

var square_size = 110;
var square_width = square_size + 20;
var attempts_count = 3;
var window_size = [];
var window_count = [];
var window_n = 3, window_m = 10;

window.addEventListener("DOMContentLoaded", initLifeCount);

function initLifeCount() {
  if (sessionStorage.getItem("level")) {
    level = parseInt(sessionStorage.getItem("level"), 10);
    if (level == 3) {
      game_over_good();
      clearInterval(timer_set);
    }      
  } else {
    level = 0;
  }
}

var start_vis = null;

window.addEventListener("DOMContentLoaded", initStartCount);

function initStartCount() {
  if (sessionStorage.getItem("start_vis")){
    start_vis = parseInt(sessionStorage.getItem("start_vis"), 10);
  } else {
    start_vis = 0;
  }
}

for (var j = 0; j < window_m; j++) {
  window_size[j] = Math.floor(document.documentElement.clientWidth / window_m * j + 20);
}

for (var i = 0; i < window_n; i++) {
	for (var j = 0; j < window_m; j++) {
      window_count[i * 10 + j] = i * 10 + j;
    }
}

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function draw_main(rect_main) {
  ctx = rect_main.getContext('2d');
  draw(rect_main, square_width, 10);
}

function draw_main_ram(rect_main) {
  ctx = rect_main.getContext('2d');
  ctx.strokeStyle = '#000000';
  ctx.strokeRect(0, 0, square_size + 20, square_size + 20);
}

function draw_answer(answer_rect) {
  ctx = answer_rect.getContext('2d');
  answer_rect.width = square_width;
  answer_rect.height = square_width;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, square_width, square_width);
  ctx.strokeStyle = '#000000';
  ctx.strokeRect(0, 0, square_size + 20, square_size + 20);
}

function draw(rect_new, width_ = square_size, otsup = 0) {
  ctx = rect_new.getContext('2d');
  rect_new.width  = width_;
  rect_new.height = width_;
  ctx.strokeStyle = '#000000';
  var raz_sqv = square_colors[level];
  for (i = 0; i < raz_sqv; i += 1) {
    for (j = 0; j < raz_sqv; j+=1) {         
      ctx.fillStyle = colors[randomInteger(0, level + 2)];
      ctx.fillRect(i * (square_size / square_colors[level]) + otsup, j * (square_size / square_colors[level]) + otsup, (square_size / square_colors[level]), (square_size / square_colors[level]));
    }
  }
  for (i = 0; i <= raz_sqv; i += 1) {
    for (j = 0; j <= raz_sqv; j += 1) {
      if (i == 0) {
        ctx.strokeStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo( otsup, j * (square_size / square_colors[level]) + otsup);
        ctx.lineTo( otsup + square_size, j * (square_size / square_colors[level]) + otsup);
        ctx.closePath();
        ctx.stroke();
      }
      if (j == 0) {
        ctx.strokeStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(i * (square_size / square_colors[level]) + otsup, otsup);
        ctx.lineTo(i * (square_size / square_colors[level]) + otsup , square_size + otsup);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }
  if (otsup == 0) {
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, width_ + otsup,  width_ + otsup);
  }
}

function cloneCanvas(oldCanvas) {
  var newCanvas = document.createElement('canvas');
  var context = newCanvas.getContext('2d');
  newCanvas.width = oldCanvas.width - 20;
  newCanvas.height = oldCanvas.height - 20;
  context.drawImage(oldCanvas, 10, 10, square_size, square_size, 0, 0, square_size, square_size);
  context.lineWidth = 3;
  context.strokeRect(0, 0, newCanvas.width, newCanvas.width);
  return newCanvas;
}

window.onload = function() {
  if (start_vis == 0) {
    document.getElementById("start").style.visibility = "visible";
  }

  if (level >= 0 && getComputedStyle(document.getElementById('good')).visibility == 'hidden' && getComputedStyle(document.getElementById('bad')).visibility == 'hidden' && start_vis == 1) {
    document.getElementById("start").style.display = 'none';
    document.getElementById("start").style.visibility = "hidden";
    document.getElementById("game").style.visibility = "visible";
    start_inter();
  }

  if (level > 2) {
    document.getElementById("game").style.visibility = "hidden";
  }

  var rect_main = document.getElementById("main_rect");
  draw_main(rect_main);

  var rect_answer = cloneCanvas(rect_main);

  draw_main_ram(rect_main);

  var rect_main = document.getElementById("answer_rect");
  draw_answer(rect_main);

  document.getElementById("time").innerHTML = "Время: " + 30 + " сек.";
  document.getElementById("pops").innerHTML = "Попыток: " + attempts_count;
  document.getElementById("level").innerHTML = "Уровень " + (level + 1);

  for (let i = 0; i<square_count[level] - 1; i += 1) {
    var new_rect = document.createElement("canvas");
    new_rect.id = "rect_new";
    draw(new_rect, square_size, 0);

    var x = randomInteger(0,11) * 30;
    var rand_int_wind = randomInteger(0, window_count.length - 1);
      
    new_rect.style.left = window_size[window_count[rand_int_wind] % 10]+'px';
    new_rect.style.top = Math.floor(window_count[rand_int_wind] / 10)* 180 + 200 +'px';
    new_rect.style.transform = 'rotate(' + x + 'deg)';

    window_count.splice(rand_int_wind, 1);
    
    document.getElementById("game").appendChild(new_rect);
  }

  var x = randomInteger(0,12)*30;
  rect_answer.id = "rect_answer";
  var rand_int_wind = randomInteger(0, window_count.length-1);

  rect_answer.style.left = window_size[window_count[rand_int_wind] % 10]+'px';
  rect_answer.style.top = Math.floor(window_count[rand_int_wind]/10)*180+200 +'px';

  window_count.splice(rand_int_wind, 1);
  rect_answer.style.transform = 'rotate(' + x + 'deg)';
  document.getElementById("game").appendChild(rect_answer);
}

function random_posit(){ 
  let parent = document.getElementById('body');
  let all_rax = parent.getBoundingClientRect();
  for (let i=0; i <parent.childNodes.length; i+=1) {
    if(parent.childNodes[i].id == 'rect_new') {
      parent.childNodes[i].style.left = randomInteger(all_rax.x, all_rax.x+all_rax.width-250)+'px';
      parent.childNodes[i].style.top = randomInteger(all_rax.y, all_rax.y+all_rax.height-250)+'px';
    }
  }
}

document.ondragstart = function() {return false}
document.body.onselectstart = function() {return false}

document.onmousedown = function(event) {
  rect_new = event.target;

  if ((rect_new.id !='rect_new' && rect_new.id !='rect_answer')|| rect_new.tagName != 'CANVAS' || rect_new.tagName == 'HTML') {
    return;
  }

  let shiftX = event.clientX - rect_new.offsetLeft;
  let shiftY = event.clientY - rect_new.offsetTop;

  rect_new.style.position = "absolute";
  rect_new.style.zIndex = 1000;
  document.body.append(rect_new);

  moveAt(event.pageX, event.pageY);

  function moveAt(pageX, pageY) {
    rect_new.style.left = pageX - shiftX + 'px';
    rect_new.style.top = pageY - shiftY + 'px';
  }

  document.body.onkeyup = function(e) {
    dom = event.target;

    if(dom.tagName != 'CANVAS' || dom.tagName == 'HTML') {
      return;
    }

    let css_rotate = getComputedStyle(dom);
    var rot_deg = rotate_deg(css_rotate.transform);
    dom.style.transform = 'rotate('+ (rot_deg + 30) +'deg)';

    dom.onmouseup= function() {
      document.onmousemove = null;
      dom.onmouseup=null;
    }

    dom.ondragstart = function() {
      return false;
    };
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);    
  }

  document.addEventListener('mousemove', onMouseMove);

  rect_new.onmouseup = function() {
    document.removeEventListener('mousemove', onMouseMove);
    rect_new.onmouseup = null;
  };

  rect_new.ondragstart = function() {
    return false;
  };
};

function rotate_deg(tr) {
  var values = tr.split('(')[1].split(')')[0].split(',');
  var a = values[0];
  var b = values[1];
  var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
  return angle;
}

function game_over_bad() {
  clearInterval(timer_set);

  document.getElementById("game").style.display = 'none';
  document.getElementById("game").style.visibility = "hidden";
  document.getElementById("bad").style.visibility = "visible";
  document.querySelectorAll('#bad > #score')[0].innerHTML = "Ваш счет: " + level;

  if (result_save_str != '' && result_save_str != null) result_save_str = result_save_str + "\n" + new Date().toLocaleString() + " Ваш счет: " + level;
  else result_save_str = new Date().toLocaleString()+ " Ваш счет: " + level;

  for (let i = 0; i < document.body.childNodes.length; i++) {
    if (document.body.childNodes[i].tagName == 'CANVAS') {
      document.body.childNodes[i].style.visibility = 'hidden';
    }
  }
}

function game_over_good() {
  clearInterval(timer_set);

  if(result_save_str != '' && result_save_str != null) result_save_str = result_save_str + '\n' + new Date().toLocaleString() + " Ваш счет: 3";
  else result_save_str = new Date().toLocaleString() + " Ваш счет: 3";
  sessionStorage.setItem("result_save_str", result_save_str);

  level = 1;

  document.getElementById("game").style.display = 'none';
  document.getElementById("game").style.visibility = "hidden";
  document.getElementById("good").style.visibility = "visible";
  document.querySelectorAll('#good > #score')[0].innerHTML = "Ваш счет: " + 3;

  for (let i = 0; i < document.body.childNodes.length; i++) {
    if (document.body.childNodes[i].tagName == 'CANVAS') {
      document.body.childNodes[i].style.visibility = 'hidden';
    }
  }
}

function click_button() {
  var rect_answer = document.getElementById("rect_answer").getBoundingClientRect();
  var rect_for = document.getElementById("answer_rect").getBoundingClientRect();
  
  if ((rect_for.right <= rect_answer.right + 50) && (rect_answer.right <= rect_for.width + rect_for.right + 50)) {
    if ((rect_for.left <= rect_answer.left + 50) && (rect_answer.left <= rect_for.width + rect_for.left + 50)) {
      if ((rect_for.bottom <= rect_answer.bottom + 50) && (rect_answer.bottom <= rect_for.height + rect_for.bottom + 50)) {
        if ((rect_for.top <= rect_answer.top + 50) && (rect_answer.top <= rect_for.height + rect_for.top + 50)) {
          sessionStorage.setItem("level", level + 1);
          sessionStorage.setItem("name_file", name_file);
          localStorage.setItem("result_save_str", result_save_str);
          clearInterval(timer_set);
          end_level();
          document.querySelector('#id').onclick = '';
          setTimeout(() => window.location.reload(), 2000);
        } else {
          attempts_count--;
          if (attempts_count <= 0) {
            game_over_bad();
          }
          document.getElementById("pops").innerHTML = "Попыток: " + attempts_count;
        }
      } else {
        attempts_count--;
        if (attempts_count <= 0) {
          game_over_bad();
        }
        document.getElementById("pops").innerHTML = "Попыток: " + attempts_count;
      }
    } else {
      end_level_bad()
      attempts_count--;
      if (attempts_count <= 0) {
        game_over_bad();
      }
      document.getElementById("pops").innerHTML = "Попыток: " + attempts_count;
    }
  } else {
    end_level_bad()
    attempts_count--;
    if (attempts_count <= 0) {
      game_over_bad();
    }
    document.getElementById("pops").innerHTML = "Попыток: " + attempts_count;
  }
}

function new_game() {
  sessionStorage.setItem("name_file", name_file);
  if(name_file == null || name_file == 'empty') {
    document.getElementById('name_player').style.display = 'block';
  } else {
    localStorage.setItem("result_save_str", result_save_str);
    sessionStorage.setItem("start_vis", 1);
    sessionStorage.setItem("result_save_str", result_save_str);
    document.getElementById("start").style.display = 'none';
    document.getElementById("start").style.visibility = "hidden";
    document.getElementById("game").style.visibility = "visible";
    start_inter();
  }
}

function new_game_new() {
  sessionStorage.setItem("level", 0);
  sessionStorage.setItem("start_vis", 0);
  sessionStorage.setItem("result_save_str", result_save_str);
  sessionStorage.setItem("name_file", name_file);
  window.location.reload();
}

function fillRectangleWithColor(rectangle) {
  var context2d = rectangle.getContext('2d');
  context2d.fillStyle = 'rgb(0, 255, 0)';
  context2d.fillRect(0, 0, rectangle.width, rectangle.height);
}

function end_level() {
  var new_rect = document.createElement("div");
  var rect_answer = document.getElementById("rect_answer");
  fillRectangleWithColor(rect_answer);
  new_rect.id = "end_level";
  new_rect.innerHTML = "Правильно";
  document.getElementById("game").appendChild(new_rect);
}

function end_level_bad() {
  var new_rect = document.createElement("div");
  new_rect.id = "end_level_bad";
  new_rect.innerHTML = "Неправильно";
  document.getElementById("game").appendChild(new_rect);
  setTimeout(() => new_rect.innerHTML = "", 2000);
}

const downloadToFile = (content, filename, contentType) => {
  const a = document.createElement('a');
  const file = new Blob([content], {type: contentType});
  
  a.href= URL.createObjectURL(file);
  a.download = filename;
  a.click();
  
  URL.revokeObjectURL(a.href);
};

function result_save() {
  downloadToFile(result_save_str, name_file + '.txt', 'text/plain');
}

function input_name() {
  if (document.getElementById('name_input').value != '') {
    name_file = document.getElementById('name_input').value;
    sessionStorage.setItem("name_file", name_file);
    document.getElementById('name_player').style.display = 'none';
  } else {
    alert("Введите имя");
  }
}