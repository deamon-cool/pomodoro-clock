var canvasTimer = document.getElementById('poomodoro-canvas-timer').getContext('2d');
var startingPoint = 4.72;
var timerWidth = canvasTimer.canvas.width;
var timerHeight = canvasTimer.canvas.height;
var different;

const fillCanvasTimer = (step, duration, time) => {
    console.log(step, duration);

    different = ((step/duration) * Math.PI * 2 * 10);

    canvasTimer.clearRect(0, 0, timerWidth, timerHeight);

    canvasTimer.lineWidth = 8;

    canvasTimer.fillStyle = 'white';

    canvasTimer.strokeStyle = 'black';

    canvasTimer.textAlign = 'center';

    canvasTimer.font = '25px arial';

    canvasTimer.fillText(time, 100, 110);

    canvasTimer.beginPath();
    canvasTimer.arc(100, 100, 90, startingPoint, -different/10+startingPoint);

    canvasTimer.stroke();
}

export {fillCanvasTimer};