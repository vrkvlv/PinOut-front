// Адреса бекенду
const API_URL = "http://127.0.0.1:8000/api";

// Створює HTML-елемент із текстом
function createElement(tag, text, className) {
    const element = document.createElement(tag);
    element.textContent = text;
    if (className) {
        element.className = className;
    }
    return element;
}

// Показує повідомлення замість карток
function showMessage(container, text) {
    container.innerHTML = "";
    container.appendChild(createElement("p", text, "message"));
}

// Завантажує компоненти з API і показує їх
async function loadComponents() {
    const container = document.getElementById("components");

    try {
        const response = await fetch(API_URL + "/components/");
        const components = await response.json();

        if (components.length === 0) {
            showMessage(container, "Компонентів поки немає");
            return;
        }

        container.innerHTML = "";
        for (const component of components) {
            const card = createElement("div", "", "card");
            card.appendChild(createElement("h3", component.name));
            card.appendChild(createElement("span", component.category.name, "tag"));
            card.appendChild(createElement("p", component.description));
            card.appendChild(createElement("p", "Виробник: " + component.manufacturer.name));
            card.appendChild(createElement("p", component.price + " грн", "price"));
            container.appendChild(card);
        }
    } catch (error) {
        showMessage(container, "Не вдалося підключитися до сервера");
    }
}

// Завантажує проєкти з API і показує їх
async function loadProjects() {
    const container = document.getElementById("projects");

    try {
        const response = await fetch(API_URL + "/projects/");
        const projects = await response.json();

        if (projects.length === 0) {
            showMessage(container, "Проєктів поки немає");
            return;
        }

        container.innerHTML = "";
        for (const project of projects) {
            const card = createElement("div", "", "card");
            card.appendChild(createElement("h3", project.title));
            card.appendChild(createElement("span", project.difficulty, "tag"));
            card.appendChild(createElement("p", project.idea));
            card.appendChild(createElement("p", "Час: " + project.time));
            container.appendChild(card);
        }
    } catch (error) {
        showMessage(container, "Не вдалося підключитися до сервера");
    }
}

loadComponents();
loadProjects();
