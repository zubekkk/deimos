// API FETCH-Start
const SERVER_IP = '185.97.255.17:1216'; // Deimos
const API_URL = `http://${SERVER_IP}/status`;
const REFRESH_INTERVAL = 5000;

// Элементы
const playersCount = document.getElementById('players-current');
const serverStatus = document.getElementById('server-status');
const serverRound = document.getElementById('server-round');
const serverMap = document.getElementById('server-map');
const serverIp = document.getElementById('server-ip');
const serverPreset = document.getElementById('server-preset');

async function fetchServerStatus() {
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(API_URL)}`;
    const response = await fetch(proxyUrl, {
      method: 'GET'
    });

    if (!response.ok)
      throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    if (!data.contents)
      throw new Error('Нет полученной информации от прокси');

    const serverData = JSON.parse(data.contents);

    // Обновляем интерфейс
    playersCount.textContent = `${serverData.players} из ${serverData.soft_max_players}` || '—';
    serverRound.textContent = serverData.round_id || '—';
    serverMap.textContent = serverData.map || '—';
    serverPreset.textContent = serverData.preset || '—';
    serverIp.textContent = SERVER_IP;
    serverStatus.textContent = 'Онлайн';
    serverStatus.style.color = '#03da39';

  } catch (error) {
    console.error('Ошибка запроса:', error);
    updateOfflineState();
  }
}

function updateOfflineState() {
  playersCount.textContent = '—';
  serverRound.textContent = '—';
  serverMap.textContent = '—';
  serverPreset.textContent = '—';
  serverIp.textContent = SERVER_IP;
  serverStatus.textContent = 'Недоступен';
  serverStatus.style.color = '#eb2e51';
}
// API FETCH-End

// FOOTER-Start
async function updateFooter() {
    const footer = document.querySelector('footer.footer');

    const files = [];

    // HTML
    files.push({ type: 'HTML', url: window.location.href });

    // CSS
    document.querySelectorAll('link[rel="stylesheet"][href]').forEach(link => {
        files.push({ type: 'CSS', url: link.href });
    });

    // JS
    document.querySelectorAll('script[src]').forEach(script => {
        files.push({ type: 'JS', url: script.src });
    });

    const results = {};

    for (const file of files) {
        try {
            const response = await fetch(file.url, { method: 'HEAD' });
            const lastModified = response.headers.get('Last-Modified');

            if (lastModified) {
                const date = new Date(lastModified);
                const formatted = date.toLocaleDateString('ru-RU'); // 18.01.2026
                results[file.type] = formatted;
            } else {
                results[file.type] = 'н/д';
            }
        } catch (err) {
            results[file.type] = 'ошибка';
        }
    }

    const htmlDate = results.HTML || 'н/д';
    const cssDate = results.CSS || 'н/д';
    const jsDate = results.JS || 'н/д';

    footer.textContent = `HTML: ${htmlDate} | CSS: ${cssDate} | JS: ${jsDate} © botcott`
}
// FOOTER-End

// Запуск
document.addEventListener('DOMContentLoaded', () => {
  fetchServerStatus();
  updateFooter()
  setInterval(fetchServerStatus, REFRESH_INTERVAL);
});
