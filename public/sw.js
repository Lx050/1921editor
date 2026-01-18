/**
 * Service Worker for Performance Optimization
 * 提供缓存、离线支持和性能优化
 */

const CACHE_NAME = 'landing-page-v1.0.1'
const STATIC_CACHE = 'static-v1.0.1'
const DYNAMIC_CACHE = 'dynamic-v1.0.1'
const RUNTIME_CACHE = 'runtime-v1.0.1'

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // 关键CSS和JS会在构建时动态添加
]

// 需要缓存的API响应
const CACHEABLE_APIS = [
  '/api/config',
  '/api/user/profile'
]

// 缓存策略配置
const CACHE_STRATEGIES = {
  // 静态资源：缓存优先
  STATIC: 'cacheFirst',
  // API请求：网络优先
  API: 'networkFirst',
  // 图片：缓存优先，设置过期时间
  IMAGE: 'cacheFirst',
  // 动态内容：网络优先
  DYNAMIC: 'networkFirst'
}

// 安装事件：预缓存静态资源
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...')

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Caching static assets...')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully')
        // 强制激活新的Service Worker
        return self.skipWaiting()
      })
      .catch(error => {
        console.error('[SW] Failed to cache static assets:', error)
      })
  )
})

// 激活事件：清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...')

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .map(cacheName => {
              // 如果不是当前版本的缓存，删除它
              if (cacheName !== STATIC_CACHE &&
                  cacheName !== DYNAMIC_CACHE &&
                  cacheName !== RUNTIME_CACHE) {
                console.log(`[SW] Deleting old cache: ${cacheName}`)
                return caches.delete(cacheName)
              }
            })
        )
      })
      .then(() => {
        console.log('[SW] Old caches cleaned up')
        // 立即控制所有页面
        return self.clients.claim()
      })
  )
})

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // 只处理GET请求
  if (request.method !== 'GET') {
    return
  }

  // 跳过Chrome扩展请求
  if (url.protocol === 'chrome-extension:') {
    return
  }

  // 根据请求类型选择缓存策略
  let strategy = CACHE_STRATEGIES.DYNAMIC

  if (isStaticAsset(request.url)) {
    strategy = CACHE_STRATEGIES.STATIC
  } else if (isAPIRequest(request.url)) {
    strategy = CACHE_STRATEGIES.API
  } else if (isImage(request.url)) {
    strategy = CACHE_STRATEGIES.IMAGE
  }

  event.respondWith(handleRequest(request, strategy))
})

/**
 * 处理请求
 */
async function handleRequest(request, strategy) {
  const url = new URL(request.url)

  try {
    switch (strategy) {
      case CACHE_STRATEGIES.STATIC:
      case CACHE_STRATEGIES.IMAGE:
        return await cacheFirst(request)

      case CACHE_STRATEGIES.API:
      case CACHE_STRATEGIES.DYNAMIC:
        return await networkFirst(request)

      default:
        return await networkFirst(request)
    }
  } catch (error) {
    console.error(`[SW] Request failed for ${request.url}:`, error)

    // 降级处理：尝试从缓存获取
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // 返回离线页面（如果是页面请求）
    if (request.destination === 'document') {
      return caches.match('/') || new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable'
      })
    }

    return new Response('Network Error', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

/**
 * 缓存优先策略
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request)

  if (cachedResponse) {
    // 检查缓存是否过期（图片缓存7天，其他30天）
    const dateHeader = cachedResponse.headers.get('sw-cached')
    if (dateHeader) {
      const cachedTime = new Date(dateHeader).getTime()
      const now = Date.now()
      const maxAge = isImage(request.url) ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000

      if (now - cachedTime > maxAge) {
        // 缓存过期，更新缓存
        updateCache(request)
      }
    }
    return cachedResponse
  }

  // 缓存未命中，从网络获取
  const networkResponse = await fetch(request)

  if (networkResponse.ok) {
    const cache = await openCache(request.url)
    cache.put(request, networkResponse.clone())
  }

  return networkResponse
}

/**
 * 网络优先策略
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      // 缓存成功的响应
      const cache = await openCache(request.url)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (networkError) {
    console.warn(`[SW] Network failed for ${request.url}, trying cache...`)

    // 网络失败，尝试缓存
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    throw networkError
  }
}

/**
 * 更新缓存
 */
async function updateCache(request) {
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await openCache(request.url)
      cache.put(request, networkResponse.clone())
    }
  } catch (error) {
    console.warn(`[SW] Failed to update cache for ${request.url}:`, error)
  }
}

/**
 * 打开对应的缓存
 */
async function openCache(url) {
  if (isStaticAsset(url)) {
    return caches.open(STATIC_CACHE)
  } else if (isAPIRequest(url)) {
    return caches.open(DYNAMIC_CACHE)
  } else {
    return caches.open(RUNTIME_CACHE)
  }
}

/**
 * 判断是否为静态资源
 */
function isStaticAsset(url) {
  return /\.(js|css|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$/.test(url) ||
         url.includes('/static/') ||
         url.includes('/assets/')
}

/**
 * 判断是否为API请求
 */
function isAPIRequest(url) {
  return url.includes('/api/') ||
         CACHEABLE_APIS.some(api => url.includes(api))
}

/**
 * 判断是否为图片
 */
function isImage(url) {
  return /\.(png|jpg|jpeg|gif|svg|webp|avif)$/.test(url)
}

/**
 * 后台同步：离线时缓存操作
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  console.log('[SW] Performing background sync...')

  // 处理离线时的请求队列
  // 这里可以实现离线操作的同步逻辑
}

/**
 * 推送通知处理
 */
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = event.data.json()

    event.waitUntil(
      self.registration.showNotification(options.title, {
        body: options.body,
        icon: options.icon || '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: options.tag || 'default',
        data: options.data,
        requireInteraction: options.requireInteraction || false,
        actions: options.actions || []
      })
    )
  }
})

/**
 * 通知点击处理
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action) {
    // 处理特定的操作按钮点击
    handleNotificationAction(event.action, event.notification.data)
  } else {
    // 默认行为：打开应用
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

/**
 * 处理通知操作
 */
function handleNotificationAction(action, data) {
  console.log(`[SW] Notification action: ${action}`, data)

  switch (action) {
    case 'open':
      clients.openWindow(data.url || '/')
      break
    case 'dismiss':
      // 通知已被忽略，不需要额外操作
      break
    default:
      console.warn(`[SW] Unknown notification action: ${action}`)
  }
}

/**
 * 消息处理：与主线程通信
 */
self.addEventListener('message', (event) => {
  const { type, payload } = event.data

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break

    case 'GET_VERSION':
      event.ports[0].postMessage({
        type: 'VERSION',
        payload: CACHE_NAME
      })
      break

    case 'CACHE_URLS':
      cacheUrls(payload.urls)
        .then(() => {
          event.ports[0].postMessage({ type: 'CACHED', payload: { urls: payload.urls } })
        })
        .catch(error => {
          event.ports[0].postMessage({ type: 'CACHE_ERROR', payload: { error: error.message } })
        })
      break

    default:
      console.warn(`[SW] Unknown message type: ${type}`)
  }
})

/**
 * 缓存指定的URLs
 */
async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE)
  return cache.addAll(urls)
}

/**
 * 定期清理缓存
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEANUP_CACHE') {
    cleanupExpiredCache()
  }
})

async function cleanupExpiredCache() {
  const cacheNames = await caches.keys()

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const requests = await cache.keys()

    for (const request of requests) {
      const response = await cache.match(request)
      const dateHeader = response?.headers.get('sw-cached')

      if (dateHeader) {
        const cachedTime = new Date(dateHeader).getTime()
        const now = Date.now()
        const maxAge = 30 * 24 * 60 * 60 * 1000 // 30天

        if (now - cachedTime > maxAge) {
          await cache.delete(request)
          console.log(`[SW] Removed expired cache entry: ${request.url}`)
        }
      }
    }
  }
}

// 错误处理
self.addEventListener('error', (event) => {
  console.error('[SW] Service Worker error:', event.error)
})

// 未处理的Promise拒绝
self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled promise rejection:', event.reason)
})

console.log('[SW] Service Worker loaded successfully')