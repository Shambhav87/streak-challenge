// Current Date Display
document.addEventListener('DOMContentLoaded', function () {
    const currentDateElements = document.querySelectorAll('.current-date');
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString('en-US', options);

    currentDateElements.forEach(element => {
        element.textContent = formattedDate;
    });
});

// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        const isMenuOpen = navLinks.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isMenuOpen);
        hamburger.innerHTML = isMenuOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close Mobile Menu When a Link is Clicked
    navLinks.addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', false);
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});

// Dark Mode Toggle
document.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');

    // Check localStorage for dark mode preference on page load
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // Toggle dark mode on button click
    darkModeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
});

// Back to Top Button
const backToTop = document.getElementById("backToTop");

window.onscroll = function () {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        backToTop.style.display = "flex";
    } else {
        backToTop.style.display = "none";
    }
};

backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Share Button Functionality
const shareFloatingButton = document.getElementById('sharefloatingButton');
const shareOptions = document.getElementById('shareOptions');

shareFloatingButton.addEventListener('click', function (event) {
    event.stopPropagation();
    shareOptions.classList.toggle('show');
});

// Chat Button Functionality
const chatFloatingButton = document.getElementById('chatfloating-Button');
const chatOptions = document.getElementById('chatOptions');

chatFloatingButton.addEventListener('click', function (event) {
    event.stopPropagation();
    const isOpen = chatOptions.classList.toggle('show');
    chatFloatingButton.setAttribute('aria-expanded', isOpen);
});

// Close chat options when clicking outside
document.addEventListener('click', function (event) {
    if (!chatFloatingButton.contains(event.target) && !chatOptions.contains(event.target)) {
        chatOptions.classList.remove('show');
        chatFloatingButton.setAttribute('aria-expanded', 'false');
    }
});

// Prevent chat options from closing when interacting with the dropdown
chatOptions.addEventListener('click', function (event) {
    event.stopPropagation();
});

// Share on WhatsApp
function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://api.whatsapp.com/send?text=${url}`, '_blank');
}

// Copy Link
function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy link: ', err);
    });
}

// Streak Management
document.addEventListener('DOMContentLoaded', () => {
    const streakList = document.getElementById('streak-list');
    const streakNameInput = document.getElementById('streak-name');
    const addStreakButton = document.getElementById('add-streak');
    const calendarContainer = document.getElementById('calendar-container');
    const prevMonthButton = document.getElementById('prev-month');
    const currentDateButton = document.getElementById('current-date');
    const nextMonthButton = document.getElementById('next-month');
    const currentMonthYear = document.getElementById('current-month-year');
    const clearDataButton = document.getElementById('clear-data');
    const dailyNotes = document.getElementById('daily-notes');
    const saveNoteButton = document.getElementById('save-note');
    const progressBar = document.querySelector('.progress');
    const progressText = document.querySelector('.progress-text');
    const pointsDisplay = document.getElementById('points');

    let currentDate = new Date();
    let selectedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    let streaks = [];
    let notes = {};
    let points = 0;

    // Load streaks, notes, and points from localStorage
    if (localStorage.getItem('streaks')) {
        streaks = JSON.parse(localStorage.getItem('streaks'));
        renderStreaks();
        updateProgress();
    }
    if (localStorage.getItem('notes')) {
        notes = JSON.parse(localStorage.getItem('notes'));
    }
    if (localStorage.getItem('points')) {
        points = parseInt(localStorage.getItem('points'));
        pointsDisplay.textContent = points;
    }

    // Add a new streak with additional fields
    addStreakButton.addEventListener('click', () => {
        const streakName = streakNameInput.value.trim();
        const priority = document.getElementById('priority-level').value;
        const reminderTime = document.getElementById('reminder-time').value;
        const deadline = document.getElementById('deadline').value;
        const category = document.getElementById('task-category').value;
        const description = document.getElementById('streak-description').value.trim();
        const recurring = document.getElementById('recurring').value;

        if (streakName) {
            const newStreak = {
                id: Date.now().toString(), // Unique ID
                name: streakName,
                description: description,
                date: new Date().toLocaleDateString(),
                priority: priority,
                reminder: reminderTime,
                deadline: deadline,
                category: category,
                recurring: recurring,
                completed: false,
                tags: [] // Initialize tags
            };
            streaks.push(newStreak);
            streakNameInput.value = '';
            document.getElementById('streak-description').value = '';
            saveStreaks();
            renderStreaks();
            setReminder(newStreak);
            showToast(`Task "${streakName}" added successfully!`, 'success');
        }
    });

    // Render streaks with additional fields
    function renderStreaks() {
        streakList.innerHTML = '';
        streaks.forEach((streak, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" id="streak-${index}" ${streak.completed ? 'checked' : ''}>
                <label for="streak-${index}">${streak.name}</label>
                <span>${streak.description}</span>
                <span>Priority: ${streak.priority}</span>
                <span>Deadline: ${streak.deadline}</span>
                <span>Category: ${streak.category}</span>
                <span>Recurring: ${streak.recurring}</span>
                <span>Tags: ${streak.tags.join(', ')}</span>
                <button onclick="editStreak(${index})"><i class="fas fa-edit"></i></button>
                <button onclick="deleteStreak(${index})"><i class="fas fa-trash"></i></button>
            `;
            li.querySelector('input').addEventListener('change', () => toggleStreakCompletion(index));
            streakList.appendChild(li);
        });
        updateProgress();
    }

    // Delete a streak
    window.deleteStreak = function(index) {
        streaks.splice(index, 1);
        saveStreaks();
        renderStreaks();
    }

    // Save streaks to localStorage
    function saveStreaks() {
        localStorage.setItem('streaks', JSON.stringify(streaks));
    }

    // Clear all streaks data
    clearDataButton.addEventListener('click', () => {
        streaks = [];
        saveStreaks();
        renderStreaks();
    });

    // Edit a streak
    window.editStreak = function(index) {
        const streak = streaks[index];
        const newName = prompt("Edit Task Name:", streak.name);
        const newDescription = prompt("Edit Task Description:", streak.description);
        const newPriority = prompt("Edit Priority (high, medium, low):", streak.priority);
        const newDeadline = prompt("Edit Deadline (YYYY-MM-DD):", streak.deadline);
        const newCategory = prompt("Edit Category (work, study, personal):", streak.category);
        const newRecurring = prompt("Edit Recurring (none, daily, weekly, monthly):", streak.recurring);
        const newTags = prompt("Edit Tags (comma-separated):", streak.tags.join(', '));

        if (newName && newDescription && newPriority && newDeadline && newCategory && newRecurring) {
            streaks[index] = {
                ...streak,
                name: newName,
                description: newDescription,
                priority: newPriority,
                deadline: newDeadline,
                category: newCategory,
                recurring: newRecurring,
                tags: newTags.split(',').map(tag => tag.trim())
            };
            saveStreaks();
            renderStreaks();
            showToast(`Task "${newName}" updated successfully!`, 'success');
        }
    }

    // Toggle streak completion
    function toggleStreakCompletion(index) {
        streaks[index].completed = !streaks[index].completed;
        if (streaks[index].completed) {
            points += 10; // Award points for completing a task
            pointsDisplay.textContent = points;
            localStorage.setItem('points', points);
            showToast(`Task "${streaks[index].name}" completed! +10 points`, 'success');
        }
        saveStreaks();
        renderStreaks();
    }

    // Update progress bar and text
    function updateProgress() {
        const totalTasks = streaks.length;
        const completedTasks = streaks.filter(streak => streak.completed).length;
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${Math.round(progressPercentage)}% Complete`;

        // Award badges based on progress
        const badges = document.querySelectorAll('.badge');
        if (progressPercentage >= 50) badges[0].style.opacity = '1';
        if (progressPercentage >= 75) badges[1].style.opacity = '1';
        if (progressPercentage >= 95) badges[2].style.opacity = '1';
    }

    // Calendar functionality
    function renderCalendar(date) {
        calendarContainer.innerHTML = `
            <div class="day-header">Sun</div>
            <div class="day-header">Mon</div>
            <div class="day-header">Tue</div>
            <div class="day-header">Wed</div>
            <div class="day-header">Thu</div>
            <div class="day-header">Fri</div>
            <div class="day-header">Sat</div>
        `;
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        currentMonthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            calendarContainer.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.textContent = day;
            dayCell.classList.add('day-cell');

            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayCell.classList.add('current-day');
            }

            const cellDate = `${year}-${month + 1}-${day}`;
            dayCell.addEventListener('click', () => {
                selectedDate = cellDate;
                dailyNotes.value = notes[selectedDate] || '';
            });

            calendarContainer.appendChild(dayCell);
        }
    }

    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    currentDateButton.addEventListener('click', () => {
        currentDate = new Date();
        renderCalendar(currentDate);
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    renderCalendar(currentDate);

    // Save note for the selected day
    saveNoteButton.addEventListener('click', () => {
        notes[selectedDate] = dailyNotes.value;
        localStorage.setItem('notes', JSON.stringify(notes));
        showToast(`Note saved for ${selectedDate}`, 'success');
    });

    // Download Data
    document.getElementById('download-data').addEventListener('click', () => {
        const dataStr = JSON.stringify({ streaks, notes, points });
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'streaks_and_notes.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Upload Data
    document.getElementById('upload-data').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const contents = e.target.result;
                const data = JSON.parse(contents);
                streaks = data.streaks || [];
                notes = data.notes || {};
                points = data.points || 0;
                saveStreaks();
                localStorage.setItem('notes', JSON.stringify(notes));
                localStorage.setItem('points', points);
                renderStreaks();
            };
            reader.readAsText(file);
        };
        input.click();
    });
});

// Function to set a reminder
function setReminder(streak) {
    const reminderTime = new Date(streak.reminder).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = reminderTime - currentTime;

    if (timeDifference > 0) {
        setTimeout(() => {
            showToast(`Reminder: ${streak.name} is due!`, 'warning');
        }, timeDifference);
    }
}

// Function to show toast notifications
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`; // Add class based on type
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Request notification permission
function requestNotificationPermission() {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                showToast('Notifications enabled!', 'success');
            }
        });
    }
}

// Request notification permission on page load
document.addEventListener('DOMContentLoaded', () => {
    requestNotificationPermission();
});