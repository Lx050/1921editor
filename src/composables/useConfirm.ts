/**
 * 确认对话框工具函数
 * 通过触发全局自定义事件来显示确认对话框
 * 替代原生 confirm() 和 alert()
 */

interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'info' | 'warning' | 'danger'
}

export const showConfirm = (options: ConfirmOptions | string): Promise<boolean> => {
  return new Promise((resolve) => {
    const opts: ConfirmOptions = typeof options === 'string'
      ? { message: options }
      : options

    const event = new CustomEvent('show-confirm', {
      detail: {
        ...opts,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      }
    })
    window.dispatchEvent(event)
  })
}

export const showAlert = (message: string, title?: string): Promise<void> => {
  return new Promise((resolve) => {
    const event = new CustomEvent('show-confirm', {
      detail: {
        title: title || '',
        message,
        confirmText: '确定',
        cancelText: '',
        type: 'info',
        alertMode: true,
        onConfirm: () => resolve(),
        onCancel: () => resolve(),
      }
    })
    window.dispatchEvent(event)
  })
}

export const confirm = {
  show: showConfirm,
  alert: showAlert,
  delete: (message: string) => showConfirm({
    title: '确认删除',
    message,
    confirmText: '删除',
    cancelText: '取消',
    type: 'danger',
  }),
}

export default confirm
