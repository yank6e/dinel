// Делаем функции глобальными для всех страниц
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
// 1. Инициализация Telegram WebApp
// ======================
const tg = window.Telegram.WebApp;
tg.expand(); // Раскрываем приложение на весь экран

// Данные пользователя (есть сразу при открытии Mini App)
const user = {
  id: tg.initDataUnsafe.user?.id,
  name: tg.initDataUnsafe.user?.first_name || 'Гость',
  username: tg.initDataUnsafe.user?.username ? '@' + tg.initDataUnsafe.user.username : ''
};

console.log("Пользователь:", user); // Для отладки

// ======================
// 2. Данные меню (вместо базы данных)
// ======================
const menuData = {
  burgers: [
    { id: 1, name: 'Чизбургер', price: 250, image: 'assets/burger.jpeg' },
    { id: 2, name: 'Бургер с беконом', price: 320, image: 'assets/burger.jpeg' }
  ],
  pizza: [
    { id: 3, name: 'Маргарита', price: 450, image: 'assets/pizza.jpeg' },
    { id: 4, name: 'Пепперони', price: 550, image: 'assets/pizza.jpeg' }
  ],
  sushi: [
    { id: 5, name: 'Филадельфия', price: 380, image: 'assets/sushi.jpg' },
    { id: 6, name: 'Калифорния', price: 350, image: 'assets/sushi.jpg' }
  ]
};

// ======================
// 3. Корзина и заказы
// ======================
let cart = [];
let orders = [];

// Загрузка корзины из localStorage
function loadCart() {
  const savedCart = localStorage.getItem('dinelCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
  }
}

// Сохранение корзины
function saveCart() {
  localStorage.setItem('dinelCart', JSON.stringify(cart));
  updateCartCount();
}

// Обновление счетчика в корзине
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
}

// Добавление товара в корзину
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
  tg.showPopup({
    title: 'Добавлено в корзину',
    message: `${item.name} добавлен в корзину`
  });
}

// ======================
// 4. Отправка заказа в Telegram
// ======================
async function sendOrderToBot() {
  if (cart.length === 0) {
    tg.showAlert('Корзина пуста!');
    return;
  }

  const botToken = "7821916445:AAEFS-mJFRFyJRETehVNQ6MlroKkpRUOt6g"; // Замените на токен от @BotFather
  const chatId = "818368195";     // Ваш ID (узнать у @userinfobot)

  // Формируем текст заказа
  const orderItems = cart.map(item => 
    `${item.name} x${item.quantity} - ${item.price * item.quantity} руб.`
  ).join('\n');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const orderText = `
    🍔 *Новый заказ Dinel!*
    👤 Пользователь: ${user.name} ${user.username}
    📅 ${new Date().toLocaleString()}
    
    🛒 *Состав заказа:*
    ${orderItems}
    
    💰 *Итого: ${total} руб.*
  `;

  // Отправляем сообщение ботом
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: orderText,
        parse_mode: "Markdown"
      })
    });

    const result = await response.json();
    if (result.ok) {
      // Сохраняем заказ локально
      orders.push({
        user_id: user.id,
        items: [...cart],
        total: total,
        date: new Date().toLocaleString()
      });

      // Очищаем корзину
      cart = [];
      saveCart();
      tg.showAlert('Заказ отправлен! Ожидайте звонка.');
    }
  } catch (error) {
    console.error("Ошибка отправки:", error);
    tg.showAlert('Ошибка при отправке заказа. Попробуйте ещё раз.');
  }
}

// ======================
// 5. Вспомогательные функции
// ======================
function openCategory(category) {
  window.location.href = `menu/index.html?category=${category}`;
}

function openCart() {
  if (cart.length === 0) {
    tg.showAlert('Корзина пуста');
    return;
  }
  window.location.href = 'cart/index.html';
}

// ======================
// 6. Инициализация при загрузке
// ======================
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  
  // Пример: кнопка "Оформить заказ"
  document.getElementById('checkout-btn')?.addEventListener('click', sendOrderToBot);
  
  // Кнопка "Назад" в Telegram
  if (tg.BackButton) {
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        tg.close();
      }
    });
  }
});

// Делаем функции глобальными для HTML
window.addToCart = addToCart;
window.openCategory = openCategory;
window.openCart = openCart;