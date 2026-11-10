// Авторизованому користувачу реєстрація не потрібна
if (isLoggedIn()) {
    window.location.href = "index.html";
}

const form = document.getElementById("register-form");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Очищаємо старі помилки
    for (const element of document.querySelectorAll(".error")) {
        element.textContent = "";
    }

    const data = {
        username: form.username.value,
        first_name: form.first_name.value,
        last_name: form.last_name.value,
        email: form.email.value,
        password: form.password.value,
        password_confirmation: form.password_confirmation.value,
    };

    try {
        const response = await fetch(API_URL + "/register/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.status === 201) {
            alert("Реєстрація успішна! Тепер увійдіть.");
            window.location.href = "login.html";
            return;
        }

        // Показуємо помилку під кожним полем
        const errors = await response.json();
        for (const field in errors) {
            const place = document.getElementById("error-" + field);
            if (place) {
                place.textContent = errors[field].join(" ");
            }
        }
    } catch (error) {
        document.getElementById("error").textContent = "Не вдалося підключитися до сервера";
    }
});