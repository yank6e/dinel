// 1. Объявляем данные
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

let cart = [];
let orders = [];

// 2. Инициализируем Telegram WebApp
window.tg = window.Telegram?.WebApp;
if (window.tg) {
  window.tg.expand();
  window.tg.BackButton?.hide(); // Скрываем кнопку "Назад" на главной
}

// 3. Делаем данные и функции глобальными
window.menuData = menuData;
window.cart = cart;
window.loadCart = loadCart;
window.saveCart = saveCart;
window.updateCartCount = updateCartCount;
window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.removeItem = removeItem;
window.sendOrderToBot = sendOrderToBot;
window.openCart = openCart;
window.openCategory = openCategory;

// ======================
// Функции корзины
// ======================
function loadCart() {
  const savedCart = localStorage.getItem('dinelCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
  }
}

function saveCart() {
  localStorage.setItem('dinelCart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count')?.textContent = count;
}

function addToCart(itemId, category) {
  const item = menuData[category].find(item => item.id === itemId);
  
  const existingItem = cart.find(item => item.id === itemId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...item,
      quantity: 1
    });
  }
  
  saveCart();
  if (window.tg) {
    window.tg.showPopup({
      title: 'Добавлено в корзину',
      message: `${item.name} добавлен в корзину`
    });
  }
}

// ======================
// Навигация
// ======================
function openCategory(category) {
  // Правильный путь к папке menu
  window.location.href = '/menu/index.html?category=' + category;
}

function openCart() {
  // Всегда разрешаем переход в корзину, даже если она пустая
  window.location.href = '/cart/index.html';
}

// ======================
// Инициализация
// ======================
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  updateCartCount();
});