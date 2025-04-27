// Получаем категорию из URL (например: menu.html?category=burgers)
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');

document.addEventListener('DOMContentLoaded', () => {
    // Загружаем корзину
    window.loadCart();

    // Устанавливаем заголовок
    document.getElementById('category-title').textContent = 
        category === 'burgers' ? 'Бургеры' :
        category === 'pizza' ? 'Пицца' : 'Суши';

    // Показываем товары
    renderMenu(category);
});

function renderMenu(category) {
    const menuItemsContainer = document.getElementById('menu-items');
    menuItemsContainer.innerHTML = '';

    // Берем товары из app.js (там уже есть menuData)
    const items = window.menuData[category];

    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'menu-item';
        itemElement.innerHTML = `
            <img src="../assets/${item.image}" alt="${item.name}">
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-price">${item.price} ₽</span>
            </div>
            <button class="add-to-cart" onclick="window.addToCart(${item.id}, '${category}')">
                В корзину
            </button>
        `;
        menuItemsContainer.appendChild(itemElement);
    });
}