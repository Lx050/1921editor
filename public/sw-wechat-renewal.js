/**
 * Service Worker for WeChat Token Renewal
 * 支持后台自动续期功能
 */

const CACHE_NAME = 'wechat-renewal-v1';
const RENEWAL_QUEUE = 'wechat-renewal-queue';

// 续期任务队列
let renewalQueue = [];
let isProcessing = false;

// Service Worker 事件监听
self.addEventListener('install', (event) => {
  console.log('[SW] WeChat Renewal Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/offline.html',
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] WeChat Renewal Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 消息监听 - 处理来自主应用的续期请求
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'RENEWAL_REQUEST':
      handleRenewalRequest(data);
      break;

    case 'RENEWAL_STATUS':
      sendRenewalStatus();
      break;

    case 'CLEAR_QUEUE':
      clearRenewalQueue();
      break;
  }
});

// 网络请求监听 - 支持离线续期
self.addEventListener('fetch', (event) => {
  // 只处理微信API相关请求
  if (event.request.url.includes('/api/wechat/') ||
      event.request.url.includes('/auth/wechat/')) {
    event.respondWith(handleWechatRequest(event.request));
  }
});

// 周期性同步 - 如果浏览器支持
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'wechat-renewal-check') {
    console.log('[SW] Periodic sync triggered for WeChat renewal');
    event.waitUntil(processPeriodicRenewalCheck());
  }
});

// 后台同步 - 如果浏览器支持
self.addEventListener('sync', (event) => {
  if (event.tag === 'wechat-renewal') {
    console.log('[SW] Background sync triggered for WeChat renewal');
    event.waitUntil(processRenewalQueue());
  }
});

/**
 * 处理续期请求
 */
function handleRenewalRequest(data) {
  const renewalTask = {
    id: data.id,
    accountId: data.accountId,
    priority: data.priority || 'normal',
    scheduledAt: data.scheduledAt || Date.now(),
    retryCount: data.retryCount || 0,
    maxRetries: data.maxRetries || 3,
    timeout: data.timeout || 15000,
    createdAt: Date.now(),
  };

  // 添加到队列
  renewalQueue.push(renewalTask);

  // 按优先级和时间排序
  renewalQueue.sort((a, b) => {
    const priorityOrder = { high: 3, normal: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return a.scheduledAt - b.scheduledAt;
  });

  // 保存到 IndexedDB
  saveRenewalQueue();

  // 处理队列
  processRenewalQueue();

  // 通知主应用
  notifyMainApp({
    type: 'RENEWAL_QUEUED',
    data: renewalTask,
  });
}

/**
 * 处理续期队列
 */
async function processRenewalQueue() {
  if (isProcessing) {
    console.log('[SW] Renewal queue processing already in progress');
    return;
  }

  isProcessing = true;

  try {
    const now = Date.now();
    const readyTasks = renewalQueue.filter(task => task.scheduledAt <= now);

    for (const task of readyTasks) {
      // 从队列中移除
      renewalQueue = renewalQueue.filter(t => t.id !== task.id);

      // 处理任务（不等待，继续处理下一个）
      processRenewalTask(task).catch(error => {
        console.error(`[SW] Failed to process renewal task ${task.id}:`, error);
      });
    }

    // 保存更新后的队列
    await saveRenewalQueue();

  } finally {
    isProcessing = false;
  }
}

/**
 * 处理单个续期任务
 */
async function processRenewalTask(task) {
  const startTime = Date.now();

  try {
    console.log(`[SW] Processing renewal task: ${task.id}`);

    // 检查网络连接
    if (!navigator.onLine) {
      throw new Error('Network offline');
    }

    // 检查电池状态（低电量时延迟执行）
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        if (battery.level < 0.2 && !battery.charging) {
          console.log('[SW] Low battery, delaying renewal');
          // 延迟1小时后重试
          task.scheduledAt = Date.now() + 60 * 60 * 1000;
          renewalQueue.push(task);
          return;
        }
      } catch (e) {
        console.log('[SW] Could not check battery level');
      }
    }

    // 执行续期操作
    const result = await performRenewalOperation(task);

    const duration = Date.now() - startTime;

    // 通知主应用成功
    notifyMainApp({
      type: 'RENEWAL_SUCCESS',
      data: {
        taskId: task.id,
        accountId: task.accountId,
        duration,
        tokenData: result,
      },
    });

    // 更新统计信息
    updateRenewalStats(true, duration);

  } catch (error) {
    console.error(`[SW] Renewal task ${task.id} failed:`, error);

    const duration = Date.now() - startTime;

    // 处理重试逻辑
    if (task.retryCount < task.maxRetries) {
      console.log(`[SW] Scheduling retry for task ${task.id}, attempt ${task.retryCount + 1}`);

      // 指数退避重试
      const delay = Math.min(1000 * Math.pow(2, task.retryCount), 30000);
      task.scheduledAt = Date.now() + delay;
      task.retryCount++;

      // 重新加入队列
      renewalQueue.push(task);

      // 通知主应用重试
      notifyMainApp({
        type: 'RENEWAL_RETRY',
        data: {
          taskId: task.id,
          accountId: task.accountId,
          retryCount: task.retryCount,
          nextAttempt: task.scheduledAt,
        },
      });

    } else {
      // 重试次数用尽，通知主应用失败
      notifyMainApp({
        type: 'RENEWAL_FAILED',
        data: {
          taskId: task.id,
          accountId: task.accountId,
          error: error.message,
          totalRetries: task.retryCount,
        },
      });
    }

    // 更新统计信息
    updateRenewalStats(false, duration);
  }
}

/**
 * 执行实际的续期操作
 */
async function performRenewalOperation(task) {
  const renewalUrl = '/api/wechat/token/renewal';

  const response = await fetch(renewalUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-SW-Renewal': 'true', // 标识这是SW发起的请求
    },
    body: JSON.stringify({
      account_id: task.accountId,
      task_id: task.id,
    }),
  });

  if (!response.ok) {
    throw new Error(`Renewal request failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Renewal failed');
  }

  return result.token_data;
}

/**
 * 处理微信API请求（支持离线续期）
 */
async function handleWechatRequest(request) {
  try {
    // 先尝试网络请求
    const response = await fetch(request);
    return response;
  } catch (error) {
    console.log('[SW] Network request failed, trying offline renewal');

    // 如果是续期相关请求且网络失败，尝试离线续期
    if (request.url.includes('/token/renewal') || request.url.includes('/token/refresh')) {
      return handleOfflineRenewal(request);
    }

    throw error;
  }
}

/**
 * 处理离线续期
 */
async function handleOfflineRenewal(request) {
  // 创建离线续期任务
  const offlineTask = {
    id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    accountId: extractAccountIdFromRequest(request),
    priority: 'high',
    scheduledAt: Date.now() + 5000, // 5秒后尝试
    retryCount: 0,
    maxRetries: 5,
    timeout: 30000,
    isOffline: true,
  };

  // 添加到队列
  handleRenewalRequest(offlineTask);

  // 返回离线响应
  return new Response(JSON.stringify({
    success: false,
    message: '网络连接失败，已加入离线续期队列',
    taskId: offlineTask.id,
  }), {
    status: 202,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 处理周期性续期检查
 */
async function processPeriodicRenewalCheck() {
  console.log('[SW] Performing periodic renewal check');

  try {
    // 检查所有账号状态
    const response = await fetch('/api/wechat/accounts/check');
    const accounts = await response.json();

    // 为需要续期的账号创建任务
    for (const account of accounts) {
      if (shouldScheduleRenewal(account)) {
        const renewalTask = {
          id: `periodic_${account.id}_${Date.now()}`,
          accountId: account.id,
          priority: 'normal',
          scheduledAt: Date.now() + Math.random() * 300000, // 5分钟内随机分散
          retryCount: 0,
          maxRetries: 3,
          timeout: 15000,
          source: 'periodic',
        };

        handleRenewalRequest(renewalTask);
      }
    }

  } catch (error) {
    console.error('[SW] Periodic renewal check failed:', error);
  }
}

/**
 * 判断是否需要调度续期
 */
function shouldScheduleRenewal(account) {
  const now = Date.now();
  const expiresAt = account.tokenData.expires_at;
  const daysToExpiry = (expiresAt - now) / (24 * 60 * 60 * 1000);

  // 提前3天续期
  return daysToExpiry <= 3 && daysToExpiry > 0 && account.autoRenewalEnabled !== false;
}

/**
 * 从请求中提取账号ID
 */
function extractAccountIdFromRequest(request) {
  const url = new URL(request.url);
  return url.searchParams.get('account_id') ||
         url.searchParams.get('accountId') ||
         'unknown';
}

/**
 * 发送续期状态到主应用
 */
function sendRenewalStatus() {
  const status = {
    queueLength: renewalQueue.length,
    isProcessing,
    activeTasks: renewalQueue.filter(task => task.scheduledAt <= Date.now()).length,
    pendingTasks: renewalQueue.filter(task => task.scheduledAt > Date.now()).length,
  };

  notifyMainApp({
    type: 'RENEWAL_STATUS',
    data: status,
  });
}

/**
 * 通知主应用
 */
function notifyMainApp(message) {
  // 向所有客户端发送消息
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      if (client.url.includes(window.location.origin)) {
        client.postMessage(message);
      }
    });
  });
}

/**
 * 更新续期统计信息
 */
async function updateRenewalStats(success, duration) {
  try {
    // 从 IndexedDB 获取现有统计
    const stats = await getRenewalStats();

    stats.totalProcessed = (stats.totalProcessed || 0) + 1;
    stats.totalDuration = (stats.totalDuration || 0) + duration;

    if (success) {
      stats.successful = (stats.successful || 0) + 1;
    } else {
      stats.failed = (stats.failed || 0) + 1;
    }

    stats.averageDuration = stats.totalDuration / stats.totalProcessed;
    stats.successRate = (stats.successful / stats.totalProcessed) * 100;
    stats.lastUpdate = Date.now();

    // 保存统计信息
    await saveRenewalStats(stats);

  } catch (error) {
    console.error('[SW] Failed to update renewal stats:', error);
  }
}

/**
 * 保存续期队列到 IndexedDB
 */
async function saveRenewalQueue() {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction(['renewal-queue'], 'readwrite');
    const store = tx.objectStore('renewal-queue');

    // 清除现有数据
    await store.clear();

    // 保存队列
    for (const task of renewalQueue) {
      await store.add(task);
    }

    await tx.complete;
    db.close();
  } catch (error) {
    console.error('[SW] Failed to save renewal queue:', error);
  }
}

/**
 * 从 IndexedDB 加载续期队列
 */
async function loadRenewalQueue() {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction(['renewal-queue'], 'readonly');
    const store = tx.objectStore('renewal-queue');

    const tasks = await store.getAll();
    renewalQueue = tasks.filter(task => {
      // 过滤过期任务（超过24小时）
      const hoursOld = (Date.now() - task.createdAt) / (60 * 60 * 1000);
      return hoursOld < 24 && task.retryCount < task.maxRetries;
    });

    await tx.complete;
    db.close();

    console.log(`[SW] Loaded ${renewalQueue.length} renewal tasks from IndexedDB`);
  } catch (error) {
    console.error('[SW] Failed to load renewal queue:', error);
    renewalQueue = [];
  }
}

/**
 * 清空续期队列
 */
async function clearRenewalQueue() {
  renewalQueue = [];

  try {
    const db = await openIndexedDB();
    const tx = db.transaction(['renewal-queue'], 'readwrite');
    const store = tx.objectStore('renewal-queue');
    await store.clear();
    await tx.complete;
    db.close();
  } catch (error) {
    console.error('[SW] Failed to clear renewal queue:', error);
  }
}

/**
 * 打开 IndexedDB
 */
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('WechatRenewalDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 创建续期队列存储
      if (!db.objectStoreNames.contains('renewal-queue')) {
        const queueStore = db.createObjectStore('renewal-queue', { keyPath: 'id' });
        queueStore.createIndex('scheduledAt', 'scheduledAt');
        queueStore.createIndex('accountId', 'accountId');
        queueStore.createIndex('priority', 'priority');
      }

      // 创建统计信息存储
      if (!db.objectStoreNames.contains('renewal-stats')) {
        db.createObjectStore('renewal-stats', { keyPath: 'id' });
      }
    };
  });
}

/**
 * 获取续期统计信息
 */
async function getRenewalStats() {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction(['renewal-stats'], 'readonly');
    const store = tx.objectStore('renewal-stats');

    const stats = await store.get('current-stats');
    await tx.complete;
    db.close();

    return stats || {
      id: 'current-stats',
      totalProcessed: 0,
      successful: 0,
      failed: 0,
      totalDuration: 0,
      averageDuration: 0,
      successRate: 0,
      lastUpdate: Date.now(),
    };
  } catch (error) {
    console.error('[SW] Failed to get renewal stats:', error);
    return {
      totalProcessed: 0,
      successful: 0,
      failed: 0,
    };
  }
}

/**
 * 保存续期统计信息
 */
async function saveRenewalStats(stats) {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction(['renewal-stats'], 'readwrite');
    const store = tx.objectStore('renewal-stats');
    await store.put(stats);
    await tx.complete;
    db.close();
  } catch (error) {
    console.error('[SW] Failed to save renewal stats:', error);
  }
}

// Service Worker 启动时加载队列
loadRenewalQueue().then(() => {
  console.log('[SW] WeChat Renewal Service Worker ready');
  processRenewalQueue();
});