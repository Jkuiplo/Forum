const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Привет, локальная сеть!\n');
});

server.listen(port, hostname, () => {
  console.log(`Сервер запущен на http://${hostname}:${port}/`);
});

console.log("dsfasdfasdf");

fetch("/api/threads")
    .then(res => res.json())
    .then(data => {
        console.log("Треды:", data);
    })
    .catch(err => console.error("Ошибка:", err));

    
    fetch("/api/auth/me")
    .then(res => res.json())
    .then(user => {
        if (user.username) {
            document.getElementById("names").innerText = user.username;
        }
    })
    .catch(() => console.log("Не авторизован"));

    async function loadThreads() {
        const response = await fetch("/api/threads"); // Запрос на API
        const threads = await response.json(); // Получаем JSON
    
        const container = document.getElementById("posts");
        container.innerHTML = "";
    
        threads.forEach(thread => {
            const postDiv = document.createElement("div");
            postDiv.classList.add("post");
            postDiv.innerHTML = `
                <h2>${thread.title}</h2>
                <p>${thread.content}</p>
                <small>Дата: ${new Date(thread.created_at).toLocaleString()} </small>
            `;
            container.appendChild(postDiv);
        });
    }
    
    document.addEventListener("DOMContentLoaded", loadThreads);
    