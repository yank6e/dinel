document.addEventListener('DOMContentLoaded', () => {
    // 1. Проверяем Telegram WebApp
    const tg = window.Telegram?.WebApp;
    
    // 2. Настройка кнопки "Назад"
    if (tg?.BackButton) {
        tg.BackButton.show();
        tg.BackButton.onClick(() => {
            window.location.href = '/index.html';
        });
    }

    // 3. Загрузка категории
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (!category || !window.menuData?.[category]) {
        if (tg) tg.showAlert("Категория не найдена");
        window.location.href = '/index.html';
        return;
    }

    // 4. Установка заголовка
    const titles = { burgers: 'Бургеры', pizza: 'Пицца', sushi: 'Суши' };
    document.getElementById('category-title').textContent = titles[category] || 'Меню';

    // 5. Рендер меню
    renderMenu(category);
    window.updateCartCount();
});

function renderMenu(category) {
    const container = document.getElementById('menu-items');
    container.innerHTML = '';
    
    window.menuData[category].forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'menu-item';
        itemElement.innerHTML = `
            <img src="/assets/${item.image}" alt="${item.name}">
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-price">${item.price} ₽</span>
            </div>
            <button class="add-to-cart" data-id="${item.id}" data-category="${category}">
                В корзину
            </button>
        `;
        container.appendChild(itemElement);
    });

    // Вешаем обработчики на кнопки
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = parseInt(btn.dataset.id);
            const category = btn.dataset.category;
            window.addToCart(itemId, category);
        });
    });
}