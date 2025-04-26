// Данные меню (в реальном приложении можно загружать с сервера)
const menuData = {
    burgers: [
        { id: 1, name: 'Чизбургер', price: 250, image: '../assets/dishes/burger.jpg' },
        { id: 2, name: 'Бургер с беконом', price: 320, image: '../assets/dishes/burger.jpg' }
    ],
    pizza: [
        { id: 3, name: 'Маргарита', price: 450, image: '../assets/dishes/pizza.jpg' },
        { id: 4, name: 'Пепперони', price: 550, image: '../assets/dishes/pizza.jpg' }
    ],
    sushi: [
        { id: 5, name: 'Филадельфия', price: 380, image: '../assets/dishes/sushi.jpg' },
        { id: 6, name: 'Калифорния', price: 350, image: '../assets/dishes/sushi.jpg' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category && menuData[category]) {
        renderMenu(category);
    } else {
        window.app.tg.showAlert('Категория не найдена');
        window.history.back();
    }
});

function renderMenu(category) {
    const categoryTitle = document.getElementById('category-title');
    const menuItemsContainer = document.getElementById('menu-items');
    
    // Установка заголовка
    const categoryName = window.app.categories.find(c => c.id === category)?.name || 'Меню';
    categoryTitle.textContent = categoryName;
    
    // Очистка контейнера
    menuItemsContainer.innerHTML = '';
    
    // Добавление элементов меню
    menuData[category].forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        
        // Проверяем, есть ли товар в корзине
        const cartItem = window.app.cart.find(ci => ci.id === item.id);
        const quantity = cartItem ? cartItem.quantity : 0;
        
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-price">${item.price} ₽</span>
            </div>
            <div class="item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn minus" onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${quantity}</span>
                    <button class="quantity-btn plus" onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="add-to-cart" onclick="addToCart(${item.id})">
                    ${quantity > 0 ? 'Изменить' : 'В корзину'}
                </button>
            </div>
        `;
        
        menuItemsContainer.appendChild(menuItem);
    });
}

// Глобальные функции для обработки событий
window.changeQuantity = function(itemId, delta) {
    const item = window.app.cart.find(item => item.id === itemId);
    
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            window.app.cart = window.app.cart.filter(i => i.id !== itemId);
        }
    } else if (delta > 0) {
        // Находим полные данные о товаре
        let productData;
        for (const category in menuData) {
            productData = menuData[category].find(p => p.id === itemId);
            if (productData) break;
        }
        
        if (productData) {
            window.app.cart.push({
                ...productData,
                quantity: 1
            });
        }
    }
    
    window.app.saveCart();
    renderMenu(new URLSearchParams(window.location.search).get('category'));
};

window.addToCart = function(itemId) {
    changeQuantity(itemId, 1);
    window.app.tg.showPopup({
        title: 'Добавлено в корзину',
        message: 'Товар успешно добавлен в вашу корзину'
    });
};