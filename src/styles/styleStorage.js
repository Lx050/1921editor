/**
 * 样式存储管理模块
 * 混合存储方案：默认样式（代码） + 用户自定义样式（LocalStorage）
 */

import { titleDecorations, bodyDecorations, introDecorations, containerDecorations } from './styleTemplates'

const STORAGE_KEY = 'custom_style_templates'

/**
 * 获取所有样式（默认 + 自定义）
 */
export function getAllStyles() {
    const customStyles = getCustomStyles()

    return {
        title: [...titleDecorations, ...customStyles.title],
        body: [...bodyDecorations, ...customStyles.body],
        intro: [...introDecorations, ...customStyles.intro],
        container: [...(containerDecorations || []), ...(customStyles.container || [])]
    }
}

/**
 * 获取用户自定义样式
 */
export function getCustomStyles() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            return JSON.parse(stored)
        }
    } catch (error) {
        console.error('读取自定义样式失败:', error)
    }

    return {
        title: [],
        body: [],
        intro: [],
        container: []
    }
}

/**
 * 保存用户自定义样式
 */
export function saveCustomStyles(customStyles) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customStyles))
        return true
    } catch (error) {
        console.error('保存自定义样式失败:', error)
        return false
    }
}

/**
 * 添加新样式
 */
export function addCustomStyle(style) {
    const customStyles = getCustomStyles()
    const typeArray = customStyles[style.type] || []

    // 生成唯一ID
    const newStyle = {
        ...style,
        id: `custom_${style.type}_${Date.now()}`,
        isCustom: true // 标记为自定义样式
    }

    typeArray.push(newStyle)
    customStyles[style.type] = typeArray

    return saveCustomStyles(customStyles) ? newStyle : null
}

/**
 * 更新样式
 */
export function updateStyle(styleId, updates) {
    // 检查是否为自定义样式
    if (!styleId.startsWith('custom_')) {
        console.warn('只能编辑自定义样式，默认样式不可修改')
        return false
    }

    const customStyles = getCustomStyles()
    let updated = false

    // 遍历所有类型查找并更新
    for (const type of ['title', 'body', 'intro', 'container']) {
        const typeArray = customStyles[type] || []
        const index = typeArray.findIndex(s => s.id === styleId)

        if (index !== -1) {
            typeArray[index] = { ...typeArray[index], ...updates }
            customStyles[type] = typeArray
            updated = true
            break
        }
    }

    return updated ? saveCustomStyles(customStyles) : false
}

/**
 * 删除样式
 */
export function deleteStyle(styleId) {
    // 检查是否为自定义样式
    if (!styleId.startsWith('custom_')) {
        console.warn('只能删除自定义样式，默认样式不可删除')
        return false
    }

    const customStyles = getCustomStyles()
    let deleted = false

    // 遍历所有类型查找并删除
    for (const type of ['title', 'body', 'intro', 'container']) {
        const typeArray = customStyles[type] || []
        const index = typeArray.findIndex(s => s.id === styleId)

        if (index !== -1) {
            typeArray.splice(index, 1)
            customStyles[type] = typeArray
            deleted = true
            break
        }
    }

    return deleted ? saveCustomStyles(customStyles) : false
}

/**
 * 导出所有自定义样式为JSON
 */
export function exportCustomStyles() {
    const customStyles = getCustomStyles()
    const dataStr = JSON.stringify(customStyles, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `custom-styles-${Date.now()}.json`
    link.click()

    URL.revokeObjectURL(url)
}

/**
 * 导入自定义样式
 */
export function importCustomStyles(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result)

                // 验证数据格式
                if (!imported.title || !imported.body) {
                    reject(new Error('导入文件格式不正确'))
                    return
                }

                // 合并导入的样式
                const currentCustom = getCustomStyles()
                const merged = {
                    title: [...currentCustom.title, ...imported.title],
                    body: [...currentCustom.body, ...imported.body],
                    intro: [...(currentCustom.intro || []), ...(imported.intro || [])],
                    container: [...(currentCustom.container || []), ...(imported.container || [])]
                }

                if (saveCustomStyles(merged)) {
                    resolve(merged)
                } else {
                    reject(new Error('保存导入的样式失败'))
                }
            } catch (error) {
                reject(error)
            }
        }

        reader.onerror = () => reject(new Error('读取文件失败'))
        reader.readAsText(file)
    })
}

/**
 * 清除所有自定义样式
 */
export function clearCustomStyles() {
    try {
        localStorage.removeItem(STORAGE_KEY)
        return true
    } catch (error) {
        console.error('清除自定义样式失败:', error)
        return false
    }
}

/**
 * 检查是否为自定义样式
 */
export function isCustomStyle(styleId) {
    return styleId && styleId.startsWith('custom_')
}
