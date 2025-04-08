// Parse duration string like "30 mins", "1 hr", or "1 hr 15 mins"
function parseDuration(durationStr) {
    let minutes = 0;
    const hourMatch = durationStr.match(/(\d+)\s*hr/);
    const minMatch = durationStr.match(/(\d+)\s*min/);

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
    const met = MET_VALUES[activityKey] || 5; // Default MET if unknown
    const durationHours = durationMinutes / 60;

    const calories = met * weightKg * durationHours;
    return Math.round(calories);
}

// Update total workout time
function updateWorkoutTime() {
    const durations = document.querySelectorAll(".activities ul li span:nth-child(2)");
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
        const name = item.querySelector("span:first-child").textContent;
        const durationStr = item.querySelector("span:last-child").textContent;
        const durationMins = parseDuration(durationStr);

        // Extract just the word (e.g., "Running" from "🏃‍♀️ Running")
        const activityKey = name.replace(/[^\w\s]/gi, "").trim().split(" ").pop().toLowerCase();

        totalCalories += calculateCaloriesBurned(activityKey, durationMins, weight);
    });

    document.getElementById("total-calories").textContent = totalCalories;
}

// Step estimation per activity (steps per minute)
const STEPS_PER_MINUTE = {
    running: 130, // Example: 130 steps per minute while running
    walking: 100, // Example: 100 steps per minute while walking
    cycling: 0, // Cycling does not contribute to steps in this example
    yoga: 0, // Yoga does not contribute to steps in this example
    weightlifting: 0, // Weightlifting does not contribute to steps in this example
    swimming: 0, // Swimming does not contribute to steps in this example
    aerobics: 120 // Example: 120 steps per minute while doing aerobics
};

// Function to calculate steps based on activity and duration
function calculateSteps(activity, durationMinutes) {
    const activityKey = activity.toLowerCase();
    const stepsPerMinute = STEPS_PER_MINUTE[activityKey] || 0; // Default to 0 if unknown activity

    const totalSteps = stepsPerMinute * durationMinutes;
    return totalSteps;
}

// Function to update total steps based on activities
function updateSteps() {
    const activities = document.querySelectorAll(".activities ul li");

    let totalSteps = 0;

    activities.forEach(item => {
        const name = item.querySelector("span:first-child").textContent;
        const durationStr = item.querySelector("span:last-child").textContent;
        const durationMins = parseDuration(durationStr); // Reusing the existing parseDuration function

        // Extract just the word (e.g., "Running" from "🏃‍♀️ Running")
        const activityKey = name.replace(/[^\w\s]/gi, "").trim().split(" ").pop().toLowerCase();

        totalSteps += calculateSteps(activityKey, durationMins);
    });

    document.getElementById("total-steps").textContent = totalSteps;
}

// Emoji mapping for activities
const ACTIVITY_EMOJIS = {
    running: "🏃‍♀️",  // Running emoji
    walking: "🚶‍♀️",  // Walking emoji
    cycling: "🚴‍♀️",  // Cycling emoji
    yoga: "🧘‍♀️",     // Yoga emoji
    weightlifting: "🏋️‍♀️",  // Weightlifting emoji
    swimming: "🏊‍♀️",  // Swimming emoji
    aerobics: "🤸‍♀️",  // Aerobics emoji
    hiking: "🥾",      // Hiking emoji
    dancing: "💃",     // Dancing emoji
    tennis: "🎾",      // Tennis emoji
    basketball: "🏀",   // Basketball emoji
    football: "⚽",     // Football emoji
    golf: "⛳",        // Golf emoji
};

// Function to assign an emoji based on the activity name
function getActivityEmoji(activity) {
    const activityKey = activity.toLowerCase();
    return ACTIVITY_EMOJIS[activityKey] || "❓";  // Return a default emoji if activity not found
}

// Handle new activity submission and update time, calories, and steps
document.getElementById("activityForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("activityName").value.trim();
    const duration = document.getElementById("activityDuration").value.trim();

    if (name && duration) {
        const list = document.querySelector(".activities ul");

        // Get the emoji for the activity
        const activityEmoji = getActivityEmoji(name);

        // Add the new activity with emoji
        const newItem = document.createElement("li");
        newItem.innerHTML = `<span>${activityEmoji} ${name}</span><span>${duration}</span>`;
        list.prepend(newItem);

        // Clear input fields
        document.getElementById("activityName").value = "";
        document.getElementById("activityDuration").value = "";

        // Update time, calories, and steps
        updateWorkoutTime();
        updateCaloriesBurned();
        updateSteps();
    }
});

// Recalculate total time, calories, and steps on page load
window.addEventListener("DOMContentLoaded", () => {
    updateWorkoutTime();
    updateCaloriesBurned();
    updateSteps();
});
