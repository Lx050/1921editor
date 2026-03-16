/**
 * 组织级模板配置 Store
 * 管理组织的首尾图、字体、字号等全局样式预设
 * 所有同组织用户共享同一套配置
 *
 * 存储策略：
 * - 读取优先级：API > localStorage > 默认值
 * - 写入：同时写 localStorage + API（后端可用时）
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/** 组织样式预设 */
export interface OrgStylePreset {
	/** 小标题字体 */
	titleFontFamily: string
	/** 小标题字号(px) */
	titleFontSize: number
	/** 小标题是否加粗 */
	titleBold: boolean
	/** 正文字体 */
	bodyFontFamily: string
	/** 正文字号(px) */
	bodyFontSize: number
	/** 正文是否首行缩进 */
	bodyIndent: boolean
	/** 正文行高倍数 */
	bodyLineHeight: number
	/** 正文字间距(px) */
	bodyLetterSpacing: number
	/** 引言字体 */
	introFontFamily: string
	/** 引言字号(px) */
	introFontSize: number
}

/** 组织模板配置（完整） */
export interface OrgTemplateConfig {
	/** 配置版本号 */
	version: number
	/** 最后更新时间 */
	updatedAt: string
	/** 组织名称（用于 footer 显示） */
	orgName: string
	/** 各模式的首图 HTML */
	headers: Record<string, string>
	/** 各模式的尾图 HTML */
	footers: Record<string, string>
	/** 样式预设 */
	stylePreset: OrgStylePreset
}

const STORAGE_KEY = 'org_template_config'

/** 默认样式预设 */
const DEFAULT_STYLE_PRESET: OrgStylePreset = {
	titleFontFamily: '微软雅黑, Microsoft YaHei, SimHei, STHeiti',
	titleFontSize: 16,
	titleBold: true,
	bodyFontFamily: '微软雅黑, Microsoft YaHei, SimHei, STHeiti',
	bodyFontSize: 14,
	bodyIndent: true,
	bodyLineHeight: 1.75,
	bodyLetterSpacing: 1.5,
	introFontFamily: '微软雅黑, Microsoft YaHei, SimHei, STHeiti',
	introFontSize: 14
}

export const useOrgConfigStore = defineStore('orgConfig', () => {
	// === State ===
	const config = ref<OrgTemplateConfig>({
		version: 1,
		updatedAt: new Date().toISOString(),
		orgName: '',
		headers: {},
		footers: {},
		stylePreset: { ...DEFAULT_STYLE_PRESET }
	})

	const isLoaded = ref(false)

	// === Getters ===
	const stylePreset = computed(() => config.value.stylePreset)

	const hasCustomHeader = computed(() => {
		return Object.keys(config.value.headers).length > 0
	})

	const hasCustomFooter = computed(() => {
		return Object.keys(config.value.footers).length > 0
	})

	// === Actions ===

	/** 从 localStorage 加载配置 */
	function loadFromStorage() {
		try {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored) {
				const parsed = JSON.parse(stored) as OrgTemplateConfig
				config.value = {
					...config.value,
					...parsed,
					stylePreset: { ...DEFAULT_STYLE_PRESET, ...parsed.stylePreset }
				}
			}
		} catch (e) {
			console.error('[OrgConfig] Failed to load from localStorage', e)
		}
		isLoaded.value = true
	}

	/** 保存到 localStorage */
	function saveToStorage() {
		config.value.updatedAt = new Date().toISOString()
		localStorage.setItem(STORAGE_KEY, JSON.stringify(config.value))
	}

	/** 获取指定模式的自定义 header，无则返回 null */
	function getCustomHeader(mode: string): string | null {
		return config.value.headers[mode] || null
	}

	/** 获取指定模式的自定义 footer，无则返回 null */
	function getCustomFooter(mode: string): string | null {
		return config.value.footers[mode] || null
	}

	/** 设置指定模式的 header HTML */
	function setHeader(mode: string, html: string) {
		config.value.headers[mode] = html
		saveToStorage()
	}

	/** 设置指定模式的 footer HTML */
	function setFooter(mode: string, html: string) {
		config.value.footers[mode] = html
		saveToStorage()
	}

	/** 清除指定模式的自定义 header（回退到默认） */
	function clearHeader(mode: string) {
		delete config.value.headers[mode]
		saveToStorage()
	}

	/** 清除指定模式的自定义 footer */
	function clearFooter(mode: string) {
		delete config.value.footers[mode]
		saveToStorage()
	}

	/** 更新样式预设 */
	function updateStylePreset(updates: Partial<OrgStylePreset>) {
		config.value.stylePreset = { ...config.value.stylePreset, ...updates }
		saveToStorage()
	}

	/** 重置样式预设为默认值 */
	function resetStylePreset() {
		config.value.stylePreset = { ...DEFAULT_STYLE_PRESET }
		saveToStorage()
	}

	/** 设置组织名称 */
	function setOrgName(name: string) {
		config.value.orgName = name
		saveToStorage()
	}

	/** 导出配置（用于跨设备同步或备份） */
	function exportConfig(): string {
		return JSON.stringify(config.value, null, 2)
	}

	/** 导入配置 */
	function importConfig(json: string): boolean {
		try {
			const parsed = JSON.parse(json) as OrgTemplateConfig
			if (!parsed.version) return false
			config.value = {
				...config.value,
				...parsed,
				stylePreset: { ...DEFAULT_STYLE_PRESET, ...parsed.stylePreset }
			}
			saveToStorage()
			return true
		} catch {
			return false
		}
	}

	// 初始化
	loadFromStorage()

	return {
		config,
		isLoaded,
		stylePreset,
		hasCustomHeader,
		hasCustomFooter,
		getCustomHeader,
		getCustomFooter,
		setHeader,
		setFooter,
		clearHeader,
		clearFooter,
		updateStylePreset,
		resetStylePreset,
		setOrgName,
		exportConfig,
		importConfig,
		loadFromStorage,
		saveToStorage,
		DEFAULT_STYLE_PRESET
	}
})
