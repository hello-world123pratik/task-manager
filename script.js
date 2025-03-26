    function registerUser() {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        if (!username || !password) {
            alert("Username and password are required!");
            return;
        }
        if (localStorage.getItem(username)) {
            alert("Username already exists!");
        } else {
            localStorage.setItem(username, password);
            alert("Registration successful!");
        }
    }

    function loginUser() {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let storedPassword = localStorage.getItem(username);
        if (storedPassword && storedPassword === password) {
            localStorage.setItem("loggedInUser", username);
            alert("Login successful!");
            showTaskManager();
        } else {
            alert("Invalid username or password!");
        }
    }

    function logoutUser() {
        localStorage.removeItem("loggedInUser");
        showLoginForm();
    }

    function checkUserLogin() {
        let loggedInUser = localStorage.getItem("loggedInUser");
        if (loggedInUser) {
            showTaskManager();
        } else {
            showLoginForm();
        }
    }

    function showTaskManager() {
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("task-container").style.display = "block";
        loadTasks();
        updateTaskStats();
    }

    function showLoginForm() {
        document.getElementById("auth-container").style.display = "block";
        document.getElementById("task-container").style.display = "none";
    }

    function addTask() {
        let taskName = document.getElementById("task-name").value;
        let taskDate = document.getElementById("task-date").value;
        let taskPriority = document.getElementById("task-priority").value;

        if (taskName === "") {
            alert("Task name is required!");
            return;
        }

        let taskList = document.getElementById("task-list");
        let taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        taskDiv.setAttribute("data-priority", taskPriority);
        taskDiv.setAttribute("data-date", taskDate || "9999-12-31");

        taskDiv.innerHTML = `${taskName} - ${taskDate || "No Due Date"} - 
        <span style='color:${getPriorityColor(taskPriority)}'>${taskPriority}</span> 
        <button onclick='markCompleted(this)'>Complete</button>
        <button onclick='removeTask(this)'>Remove</button>`;

        taskList.appendChild(taskDiv);
        updateTaskStats();
    }

    function getPriorityColor(priority) {
        return {"high": "red", "medium": "orange", "low": "green"}[priority];
    }

    function markCompleted(button) {
        let task = button.parentElement;
        task.classList.toggle("completed");
        updateTaskStats();
    }

    function removeTask(button) {
        button.parentElement.remove();
        updateTaskStats();
    }

    function clearCompletedTasks() {
        document.querySelectorAll(".task.completed").forEach(task => task.remove());
        updateTaskStats();
    }

    function resetTasks() {
        document.getElementById("task-list").innerHTML = "";
        updateTaskStats();
    }

    function updateTaskStats() {
        let totalTasks = document.querySelectorAll("#task-list .task").length;
        let completedTasks = document.querySelectorAll("#task-list .task.completed").length;
        let pendingTasks = totalTasks - completedTasks;
        document.getElementById("progress-count").innerText = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
        document.getElementById("pending-count").innerText = pendingTasks;
    }

    function sortTasksByPriority() {
        let taskList = document.getElementById("task-list");
        let tasks = Array.from(taskList.children);
        let priorityOrder = { "high": 1, "medium": 2, "low": 3 };

        tasks.sort((a, b) => {
            let priorityA = a.getAttribute("data-priority") || "low";
            let priorityB = b.getAttribute("data-priority") || "low";
            return priorityOrder[priorityA] - priorityOrder[priorityB];
        });

        taskList.innerHTML = "";
        tasks.forEach(task => taskList.appendChild(task));
    }

    function sortTasksByDueDate() {
        let taskList = document.getElementById("task-list");
        let tasks = Array.from(taskList.children);
    
        tasks.sort((a, b) => {
            let dateA = a.getAttribute("data-date") || "9999-12-31"; // Default to a far future date if empty
            let dateB = b.getAttribute("data-date") || "9999-12-31";
            return new Date(dateA) - new Date(dateB);
        });
    
        taskList.innerHTML = "";
        tasks.forEach(task => taskList.appendChild(task));
    }
    