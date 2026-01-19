/* eslint-disable no-restricted-globals */
// Service Worker 缓存策略优化

const CACHE_NAME = 'paiban-v1'
const STATIC_CACHE = 'paiban-static-v1'
const RUNTIME_CACHE = 'paiban-runtime-v1'

// 需要预缓存的关键资源
const PRECACHE_URLS = [
  '/',
  '/index.html'
]

// 安装事件 - 预缓存关键资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE)
          .map((cacheName) => caches.delete(cacheName))
      )
    })
  )
  self.clients.claim()
})

// 拦截请求 - 实施缓存策略
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // 跳过非 HTTP 请求
  if (!url.protocol.startsWith('http')) {
    return
  }

  // 跳过 API 请求和第三方资源
  if (url.pathname.startsWith('/api') || url.hostname !== 'localhost') {
    return
  }

  // 对于静态资源使用 Cache First 策略
  if (request.destination === 'script' || request.destination === 'style' || request.destination === 'font') {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response
          }
          return fetch(request).then((response) => {
            // 只缓存成功的响应
            if (response.status === 200) {
              cache.put(request, response.clone())
            }
            return response
          })
        })
      })
    )
    return
  }

  // 对于图片使用 Network First，失败时返回缓存
  if (request.destination === 'image') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 成功时更新缓存
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone))
          }
          return response
        })
        .catch(() => {
          // 网络失败时返回缓存
          return caches.match(request)
        })
    )
    return
  }

  // 其他请求使用 Network First
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  )
})
