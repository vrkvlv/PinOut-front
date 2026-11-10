// Неавторизованого користувача перенаправляємо на логін
requireLogin();

const form = document.getElementById("category-form");
const result = document.getElementById("result");

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    result.textContent = "";

    const data = {
        name: form.name.value,
        description: form.description.value,
    };

    try {
        const response = await authFetch(API_URL + "/categories/", "POST", data);
        const answer = await response.json();

        if (response.status === 201) {
            result.className = "success";
            result.textContent = "Категорію «" + answer.name + "» додано!";
            form.reset();
        } else {
            // 400, 401 або 403 - показуємо повідомлення від сервера
            result.className = "error";
            result.textContent = answer.detail;
        }
    } catch (error) {
        result.className = "error";
        result.textContent = "Не вдалося підключитися до сервера";
    }
});