var canvasTimer = document.getElementById('pomodoro-canvas-timer').getContext('2d');
var canvasShadowring = document.getElementById('pomodoro-canvas-shadow').getContext('2d');
var canvasCircle = document.getElementById('pomodoro-canvas-circle').getContext('2d');
var startingPoint = 4.72;
var timerWidth = canvasTimer.canvas.width;
var timerHeight = canvasTimer.canvas.height;
var different;

canvasShadowring.arc(100, 100, 95, 0, 2 * Math.PI);
canvasShadowring.fillStyle = 'rgba(255, 0, 0, .1)';
canvasShadowring.fill();

canvasCircle.arc(100, 100, 80, 0, 2 * Math.PI);
canvasCircle.fillStyle = 'red';
canvasCircle.fill();

const fillCanvasTimer = (step, duration, time) => {
    different = ((step/duration) * Math.PI * 2 * 10);

    canvasTimer.clearRect(0, 0, timerWidth, timerHeight);

    canvasTimer.lineWidth = 5;

    canvasTimer.fillStyle = 'lightyellow';

    canvasTimer.strokeStyle = 'red';

    canvasTimer.textAlign = 'center';

    canvasTimer.font = '25px arial';

    canvasTimer.fillText(time, 100, 110);

    canvasTimer.beginPath();
    canvasTimer.arc(100, 100, 88, startingPoint, -different/10+startingPoint);

    canvasTimer.stroke();
}

export {fillCanvasTimer};