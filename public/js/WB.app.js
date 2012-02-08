var WB = WB || {};

WB.app = (function(){
  var socket,
      canvas,
      ctx,
      colorPicker,
      startPos = {};
      mouseDown = false;

  function init() {
    setObjects();
    setListeners();
  }

  function setObjects() {
    socket = io.connect(window.location.hostname);
    canvas = $('#drawzone');
    $('#color-picker').miniColors();
    colorPicker = $('#color-picker');

    ctx = canvas[0].getContext('2d');
    ctx.strokeStyle = colorPicker.val();
    ctx.lineCap = "round"
    ctx.lineWidth = 15;
    setTwitter();
  }

  function setListeners() {
    canvas.bind('mousedown',function(e){
      mouseDown=true;
      startPos.x = e.pageX - canvas.offset().left;
      startPos.y= e.pageY - canvas.offset().top;
    });
    
    canvas.bind('mousemove',drawSegment);
    canvas.bind('mouseup',function(e){ drawSegment(e); mouseDown=false;});
    socket.on('new_line',receiveLine);
    socket.on('people_count',peopleOnline);
  }

  function setTwitter() {
    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
  }
  function peopleOnline(data) {
    $('span','#people-online').html(data.count);
  }

  function receiveLine(data) {
    ctx.beginPath();
    ctx.moveTo(data.line.startX,data.line.startY);
    ctx.lineTo(data.line.endX, data.line.endY);
    ctx.strokeStyle = data.line.color;
    ctx.stroke();
    ctx.strokeStyle = colorPicker.val();
    
  }

  function drawSegment(e)
  {
    ctx.strokeStyle = colorPicker.val();
    if(mouseDown) {
      socket.emit("line",{'startX':startPos.x,'startY':startPos.y,'endX':e.offsetX,'endY':e.offsetY, 'color': colorPicker.val()});
      ctx.beginPath();
      ctx.moveTo(startPos.x,startPos.y);
      ctx.lineTo( e.pageX - canvas.offset().left,  e.pageY - canvas.offset().top);
      ctx.stroke();
      startPos.x =  e.pageX - canvas.offset().left;
      startPos.y =  e.pageY - canvas.offset().top;
    }
  }

  return {init:init};
}());

$(document).ready(WB.app.init);