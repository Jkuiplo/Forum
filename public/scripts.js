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