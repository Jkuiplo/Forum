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