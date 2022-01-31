const myPics = document.getElementById("myPics");
const context = myPics.getContext("2d");
var isRobot = true;

function drawLine(context, x1, y1, x2, y2) {
  context.beginPath();
  context.strokeStyle = "black";
  context.lineWidth = 1;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}

function drawRedCircle(event, context) {
  isRobot = false;
  const centerX = event.offsetX;
  const centerY = event.offsetY;
  const radius = 10;

  context.beginPath();
  context.fillStyle = "red";
  context.lineWidth = 0.1;

  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.fill();
  context.closePath();
}


var timestamp = null;
var lastMouseX = null;
var lastMouseY = null;

var act = (e) => {
    if(isRobot ==
        
        
        
        false) return;
    if (timestamp === null) {
        timestamp = Date.now();
        lastMouseX = e.offsetX;
        lastMouseY = e.offsetY;
        return;
    }
    drawLine(context, lastMouseX, lastMouseY, e.offsetX, e.offsetY);
    // var now = Date.now();
    // var dt =  now - timestamp;
    // var dx = e.offsetX - lastMouseX;
    // var dy = e.offsetY - lastMouseY;
    // var speedX = Math.abs(dx / (dt * dt ) * 100);
    // var speedY = Math.abs(dy / (dt*dt) * 100);

    // timestamp = now;
    lastMouseX = e.offsetX;
    lastMouseY = e.offsetY;
    document.getElementById('xspeed').innerHTML = e.movementX;
    document.getElementById('yspeed').innerHTML = e.movementY;
    movX = Math.abs(e.movementX);
    movY = Math.abs(e.movementY);
    if((movX >= 1 && movY >= 1)){
        drawRedCircle(e, context);
    }
    }
myPics.addEventListener("mousemove", act );