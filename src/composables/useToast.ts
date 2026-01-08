/**
 * Toast 通知工具函数
 * 通过触发全局自定义事件来显示 Toast
 */

type ToastType = 'success' | 'error' | 'warning' | 'info'

export const showToast = (type: ToastType, message: string, duration = 3000) => {
    const event = new CustomEvent('show-toast', {
        detail: { type, message, duration }
    })
    window.dispatchEvent(event)
}

export const toast = {
    success: (message: string, duration = 3000) => showToast('success', message, duration),
    error: (message: string, duration = 5000) => showToast('error', message, duration),
    warning: (message: string, duration = 4000) => showToast('warning', message, duration),
    info: (message: string, duration = 3000) => showToast('info', message, duration),
}

export default toast
