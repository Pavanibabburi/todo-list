const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("AddUpdateClick");
let updateText;
let todo = JSON.parse(localStorage.getItem("todo-list")) || [];

// Initialize todo items on page load
document.addEventListener("DOMContentLoaded", ReadToDoItems);

todoValue.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addUpdate.click();
    }
});

function ReadToDoItems() {
    listItems.innerHTML = "";  // Clear existing items to avoid duplication
    todo.forEach((element) => {
        let li = document.createElement("li");
        let style = "";
        if (element.status) {
            style = "style='text-decoration: line-through'";
        }
        const todoItems = `
            <div ${style} data-task="${element.item}" title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">
                ${element.item}
                ${style === "" ? "" : '<img class="todo-controls" src="/images/check-mark.png" />'}
                <span class="date">${new Date(element.date).toLocaleDateString()}</span>
            </div>
            <div>
                ${style === "" ? '<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/images/pencil.png" />' : ""}
                <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/images/delete.png" />
            </div>
        `;
        li.innerHTML = todoItems;
        listItems.appendChild(li);
    });
}

function CreateToDoItems() {
    if (todoValue.value === "") {
        setAlertMessage("Please enter your todo text!");
        todoValue.focus();
    } else {
        let IsPresent = todo.some(element => element.item === todoValue.value);

        if (IsPresent) {
            setAlertMessage("This item is already present in the list!");
            return;
        }

        let li = document.createElement("li");
        const todoItems = `
            <div title="Hit Double Click and Complete" data-task="${todoValue.value}" ondblclick="CompletedToDoItems(this)">
                ${todoValue.value}
                <span class="date">${new Date().toLocaleDateString()}</span>
            </div>
            <div>
                <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/images/pencil.png" />
                <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/images/delete.png" />
            </div>
        `;
        li.innerHTML = todoItems;
        listItems.appendChild(li);

        let itemList = { item: todoValue.value, date: new Date(), status: false };
        todo.push(itemList);
        setLocalStorage();

        todoValue.value = "";
        setAlertMessage("Todo item created successfully!");
    }
}

function CompletedToDoItems(e) {
    const todoDiv = e.parentElement.querySelector("div");
    if (todoDiv.style.textDecoration === "") {
        todoDiv.style.textDecoration = "line-through";
        const img = document.createElement("img");
        img.src = "/images/check-mark.png";
        img.className = "todo-controls";
        todoDiv.appendChild(img);
        e.parentElement.querySelector("img.edit").remove();

        todo.forEach((element) => {
            if (element.item === todoDiv.dataset.task) {
                element.status = true;
            }
        });
        setLocalStorage();
        setAlertMessage("Todo item completed successfully!");
    }
}

function UpdateToDoItems(e) {
    const todoDiv = e.parentElement.parentElement.querySelector("div");
    if (todoDiv.style.textDecoration === "") {
        todoValue.value = todoDiv.dataset.task;
        updateText = todoDiv;
        addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()");
        addUpdate.setAttribute("src", "/images/refresh.png");
        todoValue.focus();
    }
}

function UpdateOnSelectionItems() {
    let IsPresent = todo.some(element => element.item === todoValue.value);

    if (IsPresent) {
        setAlertMessage("This item is already present in the list!");
        return;
    }

    todo.forEach((element) => {
        if (element.item === updateText.dataset.task) {
            element.item = todoValue.value;
        }
    });
    setLocalStorage();

    updateText.innerText = todoValue.value;
    updateText.dataset.task = todoValue.value;
    addUpdate.setAttribute("onclick", "CreateToDoItems()");
    addUpdate.setAttribute("src", "/images/plus.png");
    todoValue.value = "";
    setAlertMessage("Todo item updated successfully!");
}

function DeleteToDoItems(e) {
    const todoDiv = e.parentElement.parentElement.querySelector("div");
    let deleteValue = todoDiv.dataset.task;

    if (confirm(`Are you sure you want to delete this "${deleteValue}"?`)) {
        e.parentElement.parentElement.classList.add("deleted-item");
        todoValue.focus();

        todo = todo.filter(element => element.item !== deleteValue);
        setTimeout(() => {
            e.parentElement.parentElement.remove();
        }, 1000);

        setLocalStorage();
        setAlertMessage("Todo item deleted successfully!");
    }
}

function setLocalStorage() {
    localStorage.setItem("todo-list", JSON.stringify(todo));
}

function setAlertMessage(message) {
    todoAlert.removeAttribute("class");
    todoAlert.innerText = message;
    setTimeout(() => {
        todoAlert.classList.add("toggleMe");
    }, 1000);
}
