// Parse duration string like "30 mins", "1 hr", "45", etc.
function parseDuration(durationStr) {
    let minutes = 0;
    const cleaned = durationStr.toLowerCase().trim();

    const hourMatch = cleaned.match(/(\d+)\s*(hr|hour)/);
    const minMatch = cleaned.match(/(\d+)\s*(min|minute)/);

    if (!hourMatch && !minMatch && /^\d+$/.test(cleaned)) {
        // Only a number was typed, treat as minutes
        minutes += parseInt(cleaned);
    }

    if (hourMatch) minutes += parseInt(hourMatch[1]) * 60;
    if (minMatch) minutes += parseInt(minMatch[1]);

    return minutes;
}

// MET values for common activities
const MET_VALUES = {
    running: 9.8,
    walking: 3.8,
    cycling: 7.5,
    yoga: 3.0,
    weightlifting: 6.0,
    swimming: 8.0,
    aerobics: 7.3
};

// Calculate calories burned
function calculateCaloriesBurned(activity, durationMinutes, weightKg = 70) {
    const activityKey = activity.toLowerCase();
    const met = MET_VALUES[activityKey] || 5;
    const durationHours = durationMinutes / 60;
    return Math.round(met * weightKg * durationHours);
}

// Update total workout time
function updateWorkoutTime() {
    const durations = document.querySelectorAll(".activities ul li span.duration");
    const totalTime = Array.from(durations)
        .map(el => parseDuration(el.textContent))
        .reduce((sum, mins) => sum + mins, 0);
    document.getElementById("total-time").textContent = totalTime;
}

// Update total calories burned
function updateCaloriesBurned(weight = 70) {
    const activities = document.querySelectorAll(".activities ul li");
    let totalCalories = 0;

    activities.forEach(item => {
        const name = item.querySelector("span.name").textContent;
        const durationStr = item.querySelector("span.duration").textContent;
        const durationMins = parseDuration(durationStr);
        const activityKey = name.replace(/[^\w\s]/gi, "").trim().split(" ").pop().toLowerCase();
        totalCalories += calculateCaloriesBurned(activityKey, durationMins, weight);
    });

    document.getElementById("total-calories").textContent = totalCalories;
}

// Steps calculation
const STEPS_PER_MINUTE = {
    running: 130,
    walking: 100,
    cycling: 0,
    yoga: 0,
    weightlifting: 0,
    swimming: 0,
    aerobics: 120
};

function calculateSteps(activity, durationMinutes) {
    const activityKey = activity.toLowerCase();
    const stepsPerMinute = STEPS_PER_MINUTE[activityKey] || 0;
    return stepsPerMinute * durationMinutes;
}

function updateSteps() {
    const activities = document.querySelectorAll(".activities ul li");
    let totalSteps = 0;

    activities.forEach(item => {
        const name = item.querySelector("span.name").textContent;
        const durationStr = item.querySelector("span.duration").textContent;
        const durationMins = parseDuration(durationStr);
        const activityKey = name.replace(/[^\w\s]/gi, "").trim().split(" ").pop().toLowerCase();
        totalSteps += calculateSteps(activityKey, durationMins);
    });

    document.getElementById("total-steps").textContent = totalSteps;
}

// Emojis
const ACTIVITY_EMOJIS = {
    running: "🏃‍♀️",
    walking: "🚶‍♀️",
    cycling: "🚴‍♀️",
    yoga: "🧘‍♀️",
    weightlifting: "🏋️‍♀️",
    swimming: "🏊‍♀️",
    aerobics: "🤸‍♀️",
    hiking: "🥾",
    dancing: "💃",
    tennis: "🎾",
    basketball: "🏀",
    football: "⚽",
    golf: "⛳",
};

function getActivityEmoji(activity) {
    const activityKey = activity.toLowerCase();
    return ACTIVITY_EMOJIS[activityKey] || "❓";
}

// Create and append new activity
function addActivityToList(name, duration) {
    const list = document.querySelector(".activities ul");
    const emoji = getActivityEmoji(name);

    const li = document.createElement("li");
    li.innerHTML = `
        <span class="name">${emoji} ${name}</span>
        <span class="duration">${duration}</span>
        <button class="delete-btn">Delete</button>
    `;

    // Add delete functionality
    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
        updateWorkoutTime();
        updateCaloriesBurned();
        updateSteps();
    });

    list.prepend(li);
}

// Handle form submission
document.getElementById("activityForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("activityName").value.trim();
    const duration = document.getElementById("activityDuration").value.trim();

    if (name && duration) {
        addActivityToList(name, duration);

        document.getElementById("activityName").value = "";
        document.getElementById("activityDuration").value = "";

        updateWorkoutTime();
        updateCaloriesBurned();
        updateSteps();
    }
});

// Init totals on load
window.addEventListener("DOMContentLoaded", () => {
    // Add delete buttons to existing list items
    document.querySelectorAll(".activities ul li").forEach(li => {
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", () => {
            li.remove();
            updateWorkoutTime();
            updateCaloriesBurned();
            updateSteps();
        });

        li.appendChild(deleteBtn);
        li.querySelector("span:nth-child(1)").classList.add("name");
        li.querySelector("span:nth-child(2)").classList.add("duration");
    });

    updateWorkoutTime();
    updateCaloriesBurned();
    updateSteps();
});
