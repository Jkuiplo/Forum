document.querySelectorAll(".menu-btn").forEach(button => {
    button.addEventListener("click", () => {
        let submenu = button.nextElementSibling;
        let      isActive = submenu.classList.contains("active");

        // Закрываем все открытые меню
        document.querySelectorAll(".submenu").forEach(el => {
            el.classList.remove("active");
        });
        document.querySelectorAll(".menu-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        // Если меню не было открыто, открываем его
        if (!isActive) {
            submenu.classList.add("active");
            button.classList.add("active");
        }
    });
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