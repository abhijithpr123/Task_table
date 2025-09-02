
let editIndex = null;

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

showTasks();

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

function showTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let list = document.getElementById("taskList");
    let HTML = "";

    tasks.forEach((task, index) => {
        HTML += `
            <tr>
                <td>${task.taskName}</td>
                <td>${task.taskDate}</td>
                <td>${task.status}</td>
                <td>
                    <button onclick="displayTable(true, ${index})" class="editbtn">Edit</button>
                    <button onclick="deleteTask(${index})" class="deletebtn">Delete</button>
                </td>
            </tr>
        `;
    });

    list.innerHTML = HTML;
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
