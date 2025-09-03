let editIndex = null;
let selectedIndex = -1;

function displayTable(isEdit = false, index = null) {
    document.getElementById("popup").style.display = "flex";

    if (isEdit) {
        let tasks = JSON.parse(localStorage.getItem("tasks"));
        document.getElementById("taskName").value = tasks[index].taskName;
        document.getElementById("taskDate").value = tasks[index].taskDate;
        editIndex = index;
    } else {
        document.getElementById("taskName").value = "";
        document.getElementById("taskDate").value = "";
        editIndex = null;
    }
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function addTask() {
    let name = document.getElementById("taskName").value;
    let date = document.getElementById("taskDate").value;

    if (name === "" || date === "") {
        alert("Please fill all fields!");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (editIndex !== null) {
        tasks[editIndex].taskName = name;
        tasks[editIndex].taskDate = date;
        alert("Task updated successfully!");
    } else {
        let newTask = {
            taskName: name,
            taskDate: date,
            status: "Pending"
        };
        tasks.push(newTask);
        alert("Task added successfully!");
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
    closePopup();
    showTasks();
}

function showTasks(filter = "All", search = "") {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let list = document.getElementById("taskList");
    let HTML = "";

    let filteredTasks = tasks.map((task, i) => ({ ...task, realIndex: i }));

    if (filter !== "All") {
        filteredTasks = filteredTasks.filter(t =>
            filter === "Completed" ? t.status === "Complete" : t.status === "Pending"
        );
    }

    if (search.trim() !== "") {
        filteredTasks = filteredTasks.filter(t =>
            t.taskName.toLowerCase().includes(search.toLowerCase()) ||
            t.taskDate.toLowerCase().includes(search.toLowerCase())
        );
    }

    filteredTasks.forEach(task => {
        let checked = task.status === "Complete" ? "checked" : "";
        HTML += `
            <tr>
                <td>
                    <input type="checkbox" ${checked} onchange="toggleStatus(${task.realIndex}, this)">
                </td>
                <td>${task.taskName}</td>
                <td>${task.taskDate}</td>
                <td>${task.status}</td>
                <td>
                    <button onclick="displayTable(true, ${task.realIndex})" class="editbtn">Edit</button>
                    <button onclick="deleteTask(${task.realIndex})" class="deletebtn">Delete</button>
                </td>
            </tr>
        `;
    });

    list.innerHTML = HTML;
}

function filterTasks() {
    let selected = document.getElementById("filter").value;
    let search = document.getElementById("searchBox").value;
    showTasks(selected, search);
}

function toggleStatus(index, checkbox) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (tasks[index].status === "Complete") {
        checkbox.checked = true;
        alert("Completed task cannot be reverted to Pending!");
        return;
    }

    if (checkbox.checked) {
        let confirmComplete = confirm("Are you sure this task is Completed?");
        if (confirmComplete) {
            tasks[index].status = "Complete";
        } else {
            checkbox.checked = false;
            return;
        }
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
    showTasks();
}

function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));

    if (confirm("Are you sure delete this task?")) {
        let item = tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        showTasks();
        alert("Deleted: " + item[0].taskName);
    }
}

function showSuggestions(query) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let suggestionBox = document.getElementById("suggestions");

    if (query.trim() === "") {
        suggestionBox.style.display = "none";
        return;
    }

    let matches = tasks.filter(task =>
        task.taskName.toLowerCase().includes(query.toLowerCase()) ||
        task.taskDate.toLowerCase().includes(query.toLowerCase())
    );

    let HTML = "";
    matches.forEach((task, i) => {
        HTML += `<li class="slist" 
                     onclick="selectSuggestion('${task.taskName}')"
                     id="suggestion-${i}">
                     ${task.taskName} (${task.taskDate})
                 </li>`;
    });

    if (matches.length > 0) {
        suggestionBox.innerHTML = HTML;
        suggestionBox.style.display = "block";
    } else {
        suggestionBox.style.display = "none";
    }

    selectedIndex = -1;
}

function selectSuggestion(value) {
    document.getElementById("searchBox").value = value;
    document.getElementById("suggestions").style.display = "none";
}

document.getElementById("searchBox").addEventListener("keydown", function (e) {
    let suggestionBox = document.getElementById("suggestions");
    let items = suggestionBox.getElementsByTagName("li");

    if (suggestionBox.style.display === "none") return;

    if (e.key === "ArrowDown") {
        selectedIndex = (selectedIndex + 1) % items.length;
        highlightSuggestion(items);
    } else if (e.key === "ArrowUp") {
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        highlightSuggestion(items);
    } else if (e.key === "Enter") {
        if (selectedIndex >= 0) {
            this.value = items[selectedIndex].innerText;
            suggestionBox.style.display = "none";
            e.preventDefault();
        }
    }
});

function highlightSuggestion(items) {
    for (let i = 0; i < items.length; i++) {
        items[i].style.background = i === selectedIndex ? "#ddd" : "#fff";
    }
}

function searchOK() {
    let value = document.getElementById("searchBox").value;
    let filter = document.getElementById("filter").value || "All";
    showTasks(filter, value);
}

showTasks();
