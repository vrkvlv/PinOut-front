// Авторизований користувач не може відкрити сторінку логіну
if (isLoggedIn()) {
    window.location.href = "index.html";
}

const form = document.getElementById("login-form");
const errorText = document.getElementById("error");

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    errorText.textContent = "";

    const username = form.username.value;

    try {
        const response = await fetch(API_URL + "/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, password: form.password.value }),
        });

        if (!response.ok) {
            errorText.textContent = "Неправильне ім'я користувача або пароль";
            return;
        }

        const data = await response.json();
        saveLogin(data.access, data.refresh, username);

        // Повертаємо на сторінку, з якої перенаправили на логін
        const next = new URLSearchParams(window.location.search).get("next");
        window.location.href = next || "index.html";
    } catch (error) {
        errorText.textContent = "Не вдалося підключитися до сервера";
    }
});