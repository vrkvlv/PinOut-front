// Спільний код для всіх сторінок: токени, шапка сайту, запити з токеном

// Адреса бекенду
const API_URL = "http://127.0.0.1:8000/api";

// Чи увійшов користувач (чи є збережений токен)
function isLoggedIn() {
    return localStorage.getItem("access") !== null;
}

// Зберігає токени та ім'я користувача після логіну
function saveLogin(access, refresh, username) {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("username", username);
}

// Видаляє збережені токени
function clearLogin() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
}

// Вихід з акаунта
function logout() {
    clearLogin();
    window.location.href = "index.html";
}

// Перенаправляє на логін і запам'ятовує, з якої сторінки прийшли
function goToLogin() {
    const page = window.location.pathname.split("/").pop();
    window.location.href = "login.html?next=" + page;
}

// Для сторінок лише для авторизованих
function requireLogin() {
    if (!isLoggedIn()) {
        goToLogin();
    }
}

// Отримує новий access токен за допомогою refresh токена
async function refreshAccessToken() {
    const response = await fetch(API_URL + "/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: localStorage.getItem("refresh") }),
    });

    if (!response.ok) {
        return false;
    }

    const data = await response.json();
    localStorage.setItem("access", data.access);
    return true;
}

// Відправляє запит з access токеном у хедері
function sendWithToken(url, method, body) {
    return fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("access"),
        },
        body: JSON.stringify(body),
    });
}

// Запит з токеном: якщо access прострочився (401), оновлює його і повторює запит
async function authFetch(url, method, body) {
    let response = await sendWithToken(url, method, body);

    if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
            // refresh теж прострочений - треба увійти заново
            clearLogin();
            goToLogin();
            return response;
        }
        response = await sendWithToken(url, method, body);
    }

    return response;
}

// Малює меню в шапці залежно від того, чи увійшов користувач
function renderNav() {
    const nav = document.getElementById("nav");

    if (isLoggedIn()) {
        nav.innerHTML =
            '<a href="index.html">Головна</a>' +
            '<a href="add.html">Додати категорію</a>' +
            '<span class="username"></span>' +
            '<button id="logout-button">Вийти</button>';
        nav.querySelector(".username").textContent = "👤 " + localStorage.getItem("username");
        document.getElementById("logout-button").addEventListener("click", logout);
    } else {
        nav.innerHTML =
            '<a href="index.html">Головна</a>' +
            '<a href="add.html">Додати категорію</a>' +
            '<a href="register.html">Реєстрація</a>' +
            '<a href="login.html">Увійти</a>';
    }
}

renderNav();