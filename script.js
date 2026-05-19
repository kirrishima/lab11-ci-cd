const btn = document.getElementById("sendBtn");
const result = document.getElementById("result");

btn.addEventListener("click", () => {
    const name = document.getElementById("name").value;

    if (!name.trim()) {
        result.textContent = "Введите имя";
        return;
    }

    result.textContent = `Привет, ${name}!`;
});