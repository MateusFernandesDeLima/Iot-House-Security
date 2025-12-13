// Nome do cache
const CACHE_NAME = 'secuhouse-v1';

// Arquivos para cache inicial
const INITIAL_CACHE = [
  '/',
  '/index.html',
  '/dispositivos.html',
  '/alertas.html',
  '/contato.html',
  '/manifest.json',
  '/main.js',
  '/dashboard.js',
  '/devices.js',
  '/alerts.js',
  '/contact.js',
  '/estilos/main.css',
  '/estilos/index.css',
  '/estilos/dispositivos.css',
  '/estilos/alertas.css',
  '/estilos/contato.css',
  '/imagens/logo.png',
  '/imagens/icon-192x192.png',
  '/imagens/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100;400;700;900&family=Bebas+Neue&display=swap'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(INITIAL_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retorna resposta do cache
        if (response) {
          return response;
        }

        // Clone da requisição
        const fetchRequest = event.request.clone();

        // Fazer requisição à rede
        return fetch(fetchRequest).then(response => {
          // Verificar se resposta é válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone da resposta
          const responseToCache = response.clone();

          // Adicionar ao cache
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Fallback para recursos não encontrados
        if (event.request.url.includes('.jpg') || 
            event.request.url.includes('.png')) {
          return caches.match('/imagens/offline-image.jpg');
        }
        return caches.match('/offline.html');
      })
  );
});

// Sincronização em background
self.addEventListener('sync', event => {
  if (event.tag === 'sync-alerts') {
    event.waitUntil(syncAlerts());
  }
});

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: '/imagens/icon-192x192.png',
    badge: '/imagens/badge.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: 'Ver detalhes'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('SecuHouse Alerta', options)
  );
});

// Ação de notificação
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/alertas.html')
    );
  }
});

// Função para sincronizar alertas
async function syncAlerts() {
  try {
    const alertQueue = await idb.get('alertQueue');
    if (alertQueue && alertQueue.length) {
      // Enviar alertas para o servidor
      await fetch('/api/sync-alerts', {
        method: 'POST',
        body: JSON.stringify(alertQueue),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // Limpar fila após sincronização
      await idb.delete('alertQueue');
    }
  } catch (error) {
    console.error('Erro na sincronização:', error);
  }
}