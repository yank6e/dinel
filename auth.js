const tg = window.Telegram.WebApp;

export async function loginWithTelegram() {
  if (!tg.initData) {
    tg.showAlert('Требуется авторизация в Telegram');
    return null;
  }

  try {
    const response = await fetch('https://YOUR_SUPABASE_URL/functions/v1/auth-telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData: tg.initData })
    });

    const { token, user } = await response.json();
    localStorage.setItem('supabase_token', token);
    return user;
  } catch (error) {
    tg.showAlert('Ошибка входа: ' + error.message);
    return null;
  }
}