/* eslint-disable no-redeclare */
function Createline(element, config) {
  var flow = new Object();
  var c = 0;
  var lines = [];

  flow.genLines = function(config) {
    lines = [];
    c = 0;
    if (config.fx == "w") {
      var number =
        config.canvas_w / (config.width + config.width / 2 + config.jiange * 2);
      number = Math.ceil(number) + 1;
      for (var n = 0; n < number; n++) {
        var mxx =
          config.canvas_w -
          n * (config.width + config.width / 2 + config.jiange * 2);
        var lines_data = {
          mx: mxx,
          lx: mxx - config.width,
          my: config.my,
          ly: config.ly,
          vx: config.vx,
          vy: config.vy,
        };
        lines.push(lines_data);
        var lines_data2 = {
          mx: mxx - config.width - config.jiange,
          lx: mxx - config.width - config.jiange - config.width / 2,
          my: config.my,
          ly: config.ly,
          vx: config.vx,
          vy: config.vy,
        };
        lines.push(lines_data2);
      }
    }
    if (config.fx == "h") {
      var number =
        config.canvas_w / (config.width + config.width / 2 + config.jiange * 2);
      number = Math.ceil(number) + 1;
      for (var n = 0; n < number; n++) {
        var myy =
          config.canvas_h -
          n * (config.width + config.width / 2 + config.jiange * 2);
        var lines_data3 = {
          mx: config.mx,
          lx: config.lx,
          my: myy,
          ly: myy - config.width,
          vx: config.vx,
          vy: config.vy,
        };
        lines.push(lines_data3);
        var lines_data4 = {
          mx: config.mx,
          lx: config.lx,
          my: myy - config.width - config.jiange,
          ly: myy - config.width - config.jiange - config.width / 2,
          vx: config.vx,
          vy: config.vy,
        };
        lines.push(lines_data4);
      }
    }
  };
  flow.render = function(newConfig) {
    config = { ...newConfig };
    flow.genLines(newConfig);
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    flow.begin();
  };

  let timer = null;
  flow.begin = function() {
    var canvasObj =
      typeof element === "object" ? element : document.querySelector(element);
    var canvas = {
      line_w: config.line_w || 3,
      vx: config.vx || 0,
      vy: config.vy || 0,
      color: config.color || "blue",
      canvas_w: config.canvas_w || 0,
      canvas_h: config.canvas_h || 0,
      mx: config.mx || 0,
      my: config.my || 0,
      lx: config.lx || 0,
      ly: config.ly || 0,
      fx: config.fx || "w",
      width: config.width || 20,
      jiange: config.jiange || 10,
    };
    if (canvasObj.getContext("2d")) {
      (canvas.ctx = canvasObj.getContext("2d")),
        (canvasObj.width = canvas.canvas_w);
      canvasObj.height = canvas.canvas_h;
    } else {
      console.log("当前环境不支持canvas");
      return null;
    }
    timer = setInterval(function() {
      createline(canvas);
      if (canvas.fx == "w") {
        updateline_w(canvas);
      }
      if (canvas.fx == "h") {
        updateline_h(canvas);
      }
      addline(canvas);
    }, config.time);
  };
  function createline(canvas) {
    var content = canvas.ctx;
    content.clearRect(0, 0, canvas.canvas_w, canvas.canvas_h);
    for (var i = 0; i < lines.length; i++) {
      content.beginPath();
      content.moveTo(lines[i].mx, lines[i].my);
      content.lineTo(lines[i].lx, lines[i].ly);
      content.lineWidth = canvas.line_w;
      content.strokeStyle = canvas.color;
      content.stroke();
      content.closePath();
    }
  }
  function updateline_w(canvas) {
    for (var i = 0; i < lines.length; i++) {
      lines[i].mx = lines[i].mx + lines[i].vx;
      lines[i].lx = lines[i].lx + lines[i].vx;
    }
    var cnt = [];
    for (var j = 0; j < lines.length; j++) {
      if (lines[j].lx > canvas.canvas_w) {
        cnt.push(j);
      }
    }
    for (var k = 0; k < cnt.length; k++) {
      lines.splice(k, 1);
    }
  }
  function updateline_h(canvas) {
    console.log(lines.length);
    for (var i = 0; i < lines.length; i++) {
      lines[i].my = lines[i].my + lines[i].vy;
      lines[i].ly = lines[i].ly + lines[i].vy;
    }
    var cnt = [];
    for (var j = 0; j < lines.length; j++) {
      if (lines[j].ly > canvas.canvas_h) {
        cnt.push(j);
      }
    }
    for (var k = 0; k < cnt.length; k++) {
      lines.splice(k, 1);
    }
  }
  function addline(canvas) {
    var length = lines.length;
    if (canvas.fx == "w") {
      if (lines[length - 1].lx > 0) {
        var ww = lines[length - 1].lx - canvas.jiange;
        if (c == 0) {
          var jg = canvas.width;
          c = 10;
        } else {
          var jg = canvas.width / 2;
          c = 0;
        }
        var lxx = ww - jg;
        var data = {
          mx: ww,
          lx: lxx,
          my: canvas.my,
          ly: canvas.ly,
          vx: canvas.vx,
          vy: canvas.vy,
        };
        lines.push(data);
      }
    }
    if (canvas.fx == "h") {
      if (length > 0) {
        if (lines[length - 1].ly > 0) {
          var my = lines[length - 1].ly - canvas.jiange;
          if (c == 0) {
            var jg = canvas.width;
            c = 10;
          } else {
            var jg = canvas.width / 2;
            c = 0;
          }
          var ly = my - jg;
          var data = {
            mx: canvas.mx,
            lx: canvas.lx,
            my: my,
            ly: ly,
            vx: canvas.vx,
            vy: canvas.vy,
          };
          lines.push(data);
        }
      } else {
        var data = {
          mx: canvas.mx,
          my: canvas.my,
          lx: canvas.lx,
          ly: canvas.ly,
          vx: canvas.vx,
          vy: canvas.vy,
        };
        lines.push(data);
      }
    }
  }
  return flow;
}

export default Createline;
