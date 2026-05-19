const http = require("http");
const fs = require("fs");
const path = require("path");

const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const PORT = 3000;

const server = http.createServer((req, res) => {
    let filePath = "." + req.url;

    if (filePath === "./") {
        filePath = "./index.html";
    }

    const ext = path.extname(filePath);

    const contentTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript"
    };

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end();
            return;
        }

        res.writeHead(200, {
            "Content-Type": contentTypes[ext] || "text/plain"
        });

        res.end(content);
    });
});

server.listen(PORT);

(async function runTests() {
    let driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(
            new chrome.Options().addArguments("--headless")
        )
        .build();

    try {
        await driver.get(`http://localhost:${PORT}`);

        // TEST 1
        const title = await driver.findElement(By.id("title")).getText();

        if (title !== "Форма обратной связи") {
            throw new Error("Неверный заголовок");
        }

        // TEST 2
        const button = await driver.findElement(By.id("sendBtn")).getText();

        if (button !== "Отправить") {
            throw new Error("Неверный текст кнопки");
        }

        // TEST 3
        await driver.findElement(By.id("sendBtn")).click();

        let result = await driver.findElement(By.id("result")).getText();

        if (result !== "Введите имя") {
            throw new Error("Ошибка валидации");
        }

        // TEST 4
        await driver.findElement(By.id("name")).sendKeys("Alex");
        await driver.findElement(By.id("sendBtn")).click();

        result = await driver.findElement(By.id("result")).getText();

        if (result !== "Привет, Alex!") {
            throw new Error("Ошибка приветствия");
        }

        console.log("Все тесты пройдены");

    } finally {
        await driver.quit();
        server.close();
    }
})();