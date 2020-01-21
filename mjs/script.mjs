import {fillCanvasTimer} from './canvas-timer-script.mjs';

// const pomodoroTimer = document.querySelector('#pomodoro-timer');
const startButton = document.querySelector('#pomodoro-start');
const stopButton = document.querySelector('#pomodoro-stop');
let workDurationInput = document.querySelector('#input-work-duration');
let breakDurationInput = document.querySelector('#input-break-duration');
let tipText = document.querySelector('.tip-hidden');

// Initial text on the site
let clockTaskInput = document.querySelector('#pomodoro-clock-task');
clockTaskInput.setAttribute('placeholder', 'Enter your task...');

let workLabel = document.querySelector('#work-label');
workLabel.innerHTML = 'Work duration';

let breakLabel = document.querySelector('#break-label');
breakLabel.innerHTML = 'Break duration';

tipText.innerHTML = 'Tip: Changes made here will reflect at the start of the next work/break session';

let sessionListText = document.querySelector('#session-list-text');
sessionListText.innerHTML = 'Yours sessions:';


startButton.addEventListener('click', () => {
    toggleClock();
    checkSessionDuration();
});

stopButton.addEventListener('click', () => {
    toggleClock(true);
});

workDurationInput.addEventListener('input', () => {
    updatedWorkSessionDuration = minuteToSeconds(workDurationInput.value);
});

breakDurationInput.addEventListener('input', () => {
    updatedBreakSessionDuration = minuteToSeconds(breakDurationInput.value);
});

workDurationInput.addEventListener('focus', () => {
    showTip();
});

breakDurationInput.addEventListener('focus', () => {
    showTip();
})

workDurationInput.addEventListener('blur', () => {
    hideTip();
});

breakDurationInput.addEventListener('blur', () => {
    hideTip();
});

const minuteToSeconds = mins => {
    return mins * 60;
}

let clockTimer;
let sessionLabel;
let workSessionLabel;

let isClockRunning = false;

let workSessionDuration = 1500; //1500/60=25mins
let currentTimeLeftInSession = 1500; //1500/60=25mins
let breakSessionDuration = 500; // 300/60=5mins

let type = 'Work :)';

let timeSpentInCurrentSession = 0;

let currentTaskLabel = document.querySelector('#pomodoro-clock-task');

let updatedWorkSessionDuration;
let updatedBreakSessionDuration;

workDurationInput.value = '25';
breakDurationInput.value = '5';

let isClockStopped = true;

let sessionDuration = 0; // for canvas-timer

fillCanvasTimer(workSessionDuration, sessionDuration, '25:00'); // initial pomodoro timer view

const toggleClock = (reset) => {
    togglePlayPauseButton(reset);
    if (reset) {
        //STOP THE TIMER
        stopClock();
    } else {
        // update time from the user input duration break/work
        if (isClockStopped) {
            setUpdatedTimers();
            isClockStopped = false;
        }

        if (isClockRunning === true) {
            //PAUSE THE TIMER
            clearInterval(clockTimer);
            //update icon to the play one
            // set the value of the button to start or pause
            isClockRunning = false;
        } else {
            //START THE TIMER
            isClockRunning = true;
            clockTimer = setInterval(() => {
                stepDown();
            }, 1000);
        }
        showStopIcon();
    }
};

const displayCurrentTimeLeftInSession = () => {
    const secondsLeft = currentTimeLeftInSession;
    let result = '';
    const seconds = secondsLeft % 60;
    const minutes = parseInt(secondsLeft / 60) % 60;
    const hours = parseInt(secondsLeft / 3600);
    // add leading zeroes if it's less than 10 example: 07:02 (a.m)
    function addLeadingZeroes(time) {
        return time < 10 ?  `0${time}` : time;
    }
    if (hours > 0) result += `${hours}:`;
    result += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`;

    fillCanvasTimer(timeSpentInCurrentSession, sessionDuration, result);
}

const stopClock = () => {
    displaySessionLog(type);

    setUpdatedTimers();
    isClockStopped = true;

    // 1) Reset the timer we set
    clearInterval(clockTimer);
    // 2) Update our variable to know that the timer is stopped
    isClockRunning = false;
    // 3) Reset the time left and spent in the session to its orginal state
    currentTimeLeftInSession = workSessionDuration;
    timeSpentInCurrentSession = 0;
    // 4) Update the timer displayed
    displayCurrentTimeLeftInSession();

    type = 'Work :)';
}

const stepDown = () => {
    if (currentTimeLeftInSession > 0) {
        // increase time spent for log session
        timeSpentInCurrentSession++;
        // decrease time left, increase time spent
        currentTimeLeftInSession--;
    } else if (currentTimeLeftInSession === 0) {
        // Time is over -> if work switch to break
        if (type === 'Work :)') {
            currentTimeLeftInSession = breakSessionDuration;
            displaySessionLog('Work :)');
            type = 'Break :D';
            currentTaskLabel.value = 'Break :D';
            currentTaskLabel.disabled = true;
        } else {
            currentTimeLeftInSession = workSessionDuration;
            type = 'Work :)';
            // If will be 'Break :D' after end of the time in the input so will be switched to workSessionLabel(input from the user)
            if (currentTaskLabel.value === 'Break :D') {
                currentTaskLabel.value = workSessionLabel;
            }
            currentTaskLabel.disabled = false;

            displaySessionLog('Break :D');
        }
        setUpdatedTimers();
        timeSpentInCurrentSession = 0;
    }
    displayCurrentTimeLeftInSession();
}

const displaySessionLog = (type) => {
    const sessionsList = document.querySelector('#pomodoro-sessions');
    // append <li> to list
    const li = document.createElement('li');

    // If there is any input from user it will be displayed in list log session at the end of time
    if (type === 'Work :)') {
        sessionLabel = currentTaskLabel.value ? currentTaskLabel.value : 'Work :)';
        workSessionLabel = sessionLabel;
    } else {
        sessionLabel = 'Break :D';
    }
    // to label    'Work :)'/ 'Break :D' / $user-input    adds spent time [min]
    let elapsedTime = parseInt(timeSpentInCurrentSession / 60);
    elapsedTime = elapsedTime > 0 ? elapsedTime : '< 1';
    // adds next <li> in html list
    const text = document.createTextNode(`${sessionLabel} : ${elapsedTime} min`);
    li.appendChild(text);
    sessionsList.appendChild(li);
}

const setUpdatedTimers = () => {
    if (type === 'Work :)') {
        currentTimeLeftInSession = updatedWorkSessionDuration ? updatedWorkSessionDuration : workSessionDuration
        workSessionDuration = currentTimeLeftInSession;
    } else {
        currentTimeLeftInSession = updatedBreakSessionDuration ? updatedBreakSessionDuration : breakSessionDuration
        breakSessionDuration = currentTimeLeftInSession;
    }
}

const togglePlayPauseButton = (reset) => {
    const playIcon = document.querySelector('#play-icon');
    const pauseIcon = document.querySelector('#pause-icon');
    if (reset) {
        // when restarting always revert to play icon
        if (playIcon.classList.contains('hidden')) {
            playIcon.classList.remove('hidden');
        }
        if (!pauseIcon.classList.contains('hidden')) {
            pauseIcon.classList.add('hidden');
        }
    } else {
        playIcon.classList.toggle('hidden');
        pauseIcon.classList.toggle('hidden');
    }
}

const showStopIcon = () => {
    const stopButton = document.querySelector('#pomodoro-stop');
    stopButton.classList.remove('hidden');
}

const checkSessionDuration = () => {
    sessionDuration = currentTimeLeftInSession;
}

const showTip = () => {
    tipText.setAttribute('class', 'tip-visible');
}

const hideTip = () => {
    tipText.setAttribute('class', 'tip-hidden');
}