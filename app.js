// 1. Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
    tg.enableClosingConfirmation();
    tg.BackButton?.hide();
}

// 2. Данные меню
const menuData = {
    burgers: [
        { id: 1, name: 'Чизбургер', price: 250, image: 'burger.jpeg' },
        { id: 2, name: 'Бургер с беконом', price: 320, image: 'burger.jpeg' }
    ],
    pizza: [
        { id: 3, name: 'Маргарита', price: 450, image: 'pizza.jpeg' },
        { id: 4, name: 'Пепперони', price: 550, image: 'pizza.jpeg' }
    ],
    sushi: [
        { id: 5, name: 'Филадельфия', price: 380, image: 'sushi.jpg' },
        { id: 6, name: 'Калифорния', price: 350, image: 'sushi.jpg' }
    ]
};

// 3. Корзина
let cart = JSON.parse(localStorage.getItem('dinelCart')) || [];

// 4. Глобальные функции
window.openCategory = function(category) {
    window.location.href = `/menu/index.html?category=${category}`;
};

window.openCart = function() {
    window.location.href = '/cart/index.html';
};

window.addToCart = function(itemId, category) {
    const item = menuData[category].find(item => item.id === itemId);
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    saveCart();
    if (tg) tg.showPopup({ title: 'Добавлено', message: `${item.name} добавлен` });
};

window.saveCart = function() {
    localStorage.setItem('dinelCart', JSON.stringify(cart));
    updateCartCount();
};

window.updateCartCount = function() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count')?.textContent = count;
};

// 5. Инициализация
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    if (tg) {
        tg.setHeaderColor('#ff6b00');
        tg.setBackgroundColor('#f5f5f5');
    }
});

// В конце файла app.js добавьте:

// Экспорт всех необходимых функций
window.openCategory = function(category) {
  window.location.href = `/menu/index.html?category=${encodeURIComponent(category)}`;
};

window.openCart = function() {
  window.location.href = '/cart/index.html';
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
  // Проверяем, что функции доступны
  console.log('openCategory доступна?', typeof window.openCategory === 'function');
  
  // Вешаем обработчики через делегирование событий
  document.body.addEventListener('click', function(e) {
      if (e.target.classList.contains('category-btn')) {
          const category = e.target.dataset.category;
          if (category && window.openCategory) {
              window.openCategory(category);
          }
      }
      
      if (e.target.id === 'cart-button' && window.openCart) {
          window.openCart();
      }
  });
});