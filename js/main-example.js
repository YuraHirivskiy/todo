// знаходимо необхідні елементи на сторінці

const form = document.querySelector('#form'); // вся форма де є інпут
const taskInput = document.querySelector('#taskInput'); // інпут
const tasksList = document.querySelector('#tasksList'); // <ul id="tasksList" > список вже готових задач
const emptyList = document.querySelector('#emptyList'); // спиоск пустий + листок



// додавляння задачі
form.addEventListener('submit', addTask); // весь код який нижче викликаємо тут - function addTask(event)

// видалення задачі
tasksList.addEventListener('click', deleteTask);

// відмічаємо задачу виконаною
tasksList.addEventListener('click', doneTask);

// створюємо масив який буде містити всі задачі
let tasks = [];

// коли запускається програма і якщо в localStorage щось є то воно записується в масив і виводиться
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks')); // JSON.parse парсить строку і передає в масив його елементи
    tasks.forEach( (task) => renderTask(task)); // відображаєм всі елементи які є в localStorage і попали в масив, відображаючи елементи масиву
}

checkEmptyList(); // запускаєм на старті щоб зявився блок з листком


// функція з добавляння задачі
function addTask(event) {
    // відміняє відправку форми і перезагрузку сторінки
    event.preventDefault();

    // дістаєм текст з інпута
    const taskText = taskInput.value;

    // описуємо задачу у вигляді обєкту
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };
    // добавляємо задачу в кінець масива
    tasks.push(newTask);
    // добавляємо задачу в сховище браузера localStorage
    saveToLocalStorage();

    renderTask(newTask); // відображає задачі з масиву

    // очищуємо інпут від введеного перд тим значення введенням в нього значення пустого рядка
    taskInput.value = "";
    // і повертаємо фокус на інпут щоб в нього знову можна було вводити
    taskInput.focus();
    checkEmptyList(); // запускаєм щоб після додавання задачі зникав блок з листком

}

// функція з видалення задачі
function deleteTask(event) {
    if (event.target.dataset.action !== 'delete') return; // відміняємо видалення якщо нажали не по хрестику

    const parentNode = event.target.closest('.list-group-item'); // занесли <li> де є хрестик в parentNode

    // визначаємо ID задачі
    const id = Number(parentNode.id); // id тої <li> по якій клікнули хрестик, приводимо до типу даних Number

    // видаляємо задачу з масиву через метод масивів filter
    tasks = tasks.filter((task) => task.id !== id);

    // добавляємо задачу в сховище браузера localStorage
    saveToLocalStorage();

    // видаляємо задачу з розмітки
    parentNode.remove();    // видаляємо li в якому ця кнопка хрестик

    checkEmptyList(); // щоб після видалення всіх задач знову зявлявся блок з листком
}

// функція виконаної задачі
function doneTask(event) {
    if (event.target.dataset.action !== "done") return; // відміняємо позначення якщо нажали не по галочці

        const parentNode = event.target.closest('.list-group-item'); // занесли <li> де є галочка в parentNode

        // визначаємо id задачі
        const id = Number(parentNode.id);
        const task = tasks.find( (task) => task.id === id);
        task.done = !task.done;

        // добавляємо задачу в сховище браузера localStorage
        saveToLocalStorage();

        const taskTitle = parentNode.querySelector('.task-title'); // занесли <span> де є галочка в taskTitle
        taskTitle.classList.add('task-title--done'); // змінили в taskTitle клас щоб закреслити

}

// ф-я перевіряє якщо пустий масив, то відображається пустий блок з листком
function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = '<li id="emptyList" class="list-group-item empty-list">\n' +
            '\t\t\t\t\t<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">\n' +
            '\t\t\t\t\t<div class="empty-list__title">Список дел пуст</div>\n' +
            '\t\t\t\t</li>';

        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

// ф-я яка записує масив даних до localStorage
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ф-я де записаний кусок HTML з задачею яка виводиться
function renderTask(task) {
    // формуємо CSS клас для виконаної задачі, який попадає клас спану нижче
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    // формуємо розмітку для нової задачі
    const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
\t\t\t\t\t<span class="${cssClass}">${task.text}</span>
\t\t\t\t\t<div class="task-item__buttons">
\t\t\t\t\t\t<button type="button" data-action="done" class="btn-action">
\t\t\t\t\t\t\t<img src="./img/tick.svg" alt="Done" width="18" height="18">
\t\t\t\t\t\t</button>
\t\t\t\t\t\t<button type="button" data-action="delete" class="btn-action">
\t\t\t\t\t\t\t<img src="./img/cross.svg" alt="Done" width="18" height="18">
\t\t\t\t\t\t</button>
\t\t\t\t\t</div>
\t\t\t\t</li>`;

    // дабавляємо задачу на сторінку
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}











