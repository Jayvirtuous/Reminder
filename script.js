let time = document.getElementById("time");
let dateInput = document.getElementById("alarmDate");
let tInput = document.getElementById("alarmTime");
let nameInput = document.getElementById("reminderName"); // New input for reminder name
let btn = document.getElementById("setAlarm");
let contan = document.getElementById("alarms");
let maxValue = 3;
let cnt = 0;
let almTimesArray = [];

// Add an audio element for the alarm sound
let alarmSound = new Audio("Kalimba.mp3"); // Ensure you have an alarm.mp3 file in your project

function timeChangeFunction() {
    let curr = new Date();
    let hrs = curr.getHours();
    let min = String(curr.getMinutes()).padStart(2, "0");
    let sec = String(curr.getSeconds()).padStart(2, "0");
    let period = "AM";
    if (hrs >= 12) {
        period = "PM";
        if (hrs > 12) {
            hrs -= 12;
        }
    }
    hrs = String(hrs).padStart(2, "0");
    time.textContent = `${hrs}:${min}:${sec} ${period}`;
}

function showReminderAlert(reminderName) {
    // Display the alert after the sound
    setTimeout(() => {
        alert(`Reminder: ${reminderName}`);
    }, 500); // Adjust this delay as needed (500ms here)
}

function alarmSetFunction() {
    let now = new Date();
    let selectedDate = new Date(dateInput.value + "T" + tInput.value);
    let reminderName = nameInput.value.trim(); // Get the reminder name

    if (selectedDate <= now) {
        alert("Invalid time. Please select a future date and time.");
        return;
    }
    if (almTimesArray.includes(selectedDate.toString())) {
        alert("You cannot set multiple alarms for the same time.");
        return;
    }
    if (!reminderName) {
        alert("Please enter a reminder name.");
        return;
    }
    if (cnt < maxValue) {
        let timeUntilAlarm = selectedDate - now;
        let alarmDiv = document.createElement("div");
        alarmDiv.classList.add("alarm");
        alarmDiv.innerHTML = `
            <span>${selectedDate.toLocaleString()} - ${reminderName}</span>
            <button class="delete-alarm">Delete</button>
        `;
        alarmDiv.querySelector(".delete-alarm").addEventListener("click", () => {
            alarmDiv.remove();
            cnt--;
            clearTimeout(alarmDiv.timeoutId);
            const idx = almTimesArray.indexOf(selectedDate.toString());
            if (idx !== -1) {
                almTimesArray.splice(idx, 1);
            }
        });
        alarmDiv.timeoutId = setTimeout(() => {
            alarmSound.play(); // Play the sound first
            showReminderAlert(reminderName); // Show the alert after a delay
            alarmDiv.remove();
            cnt--;
            const alarmIndex = almTimesArray.indexOf(selectedDate.toString());
            if (alarmIndex !== -1) {
                almTimesArray.splice(alarmIndex, 1);
            }
        }, timeUntilAlarm);
        contan.appendChild(alarmDiv);
        cnt++;
        almTimesArray.push(selectedDate.toString());
    } else {
        alert("You can only set a maximum of 3 alarms.");
    }
}

function showAlarmFunction() {
    // Set up event listeners for already existing alarms (if any)
    let alarms = contan.querySelectorAll(".alarm");
    alarms.forEach((alarm) => {
        let deleteButton = alarm.querySelector(".delete-alarm");
        deleteButton.addEventListener("click", () => {
            alarm.remove();
            cnt--;
            clearTimeout(alarm.timeoutId);
            const alarmTime = alarm.querySelector("span").textContent;
            const idx = almTimesArray.findIndex(time => new Date(time).toLocaleString() === alarmTime);
            if (idx !== -1) {
                almTimesArray.splice(idx, 1);
            }
        });
    });
}

showAlarmFunction();
setInterval(timeChangeFunction, 1000);
btn.addEventListener("click", alarmSetFunction);
timeChangeFunction();
