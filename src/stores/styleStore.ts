import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { styleService, StyleTemplate } from '../services/styleService';
// @ts-ignore
import { getAllStyles, updateStyle as updateLocalStorageStyle, deleteStyle as deleteLocalStorageStyle } from '../styles/styleStorage';
import { useUserStore } from './userStore';

// 扩展 StyleTemplate 接口，添加来源标记
export interface StyleTemplateWithSource extends StyleTemplate {
    source: 'api' | 'local';
}

export const useStyleStore = defineStore('style', () => {
    // API 样式列表
    const apiStyles = ref<StyleTemplateWithSource[]>([]);
    // 本地样式列表
    const localStyles = ref<StyleTemplateWithSource[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // 合并后的样式列表（API 在前，本地在后）
    const styles = computed(() => [...apiStyles.value, ...localStyles.value]);

    const titleStyles = computed(() => styles.value.filter(s => s.type === 'title'));
    const bodyStyles = computed(() => styles.value.filter(s => s.type === 'body'));
    const introStyles = computed(() => styles.value.filter(s => s.type === 'intro'));
    const containerStyles = computed(() => styles.value.filter(s => s.type === 'container'));

    // API 样式分类
    const apiTitleStyles = computed(() => apiStyles.value.filter(s => s.type === 'title'));
    const apiBodyStyles = computed(() => apiStyles.value.filter(s => s.type === 'body'));
    const apiIntroStyles = computed(() => apiStyles.value.filter(s => s.type === 'intro'));
    const apiContainerStyles = computed(() => apiStyles.value.filter(s => s.type === 'container'));

    // 本地样式分类
    const localTitleStyles = computed(() => localStyles.value.filter(s => s.type === 'title'));
    const localBodyStyles = computed(() => localStyles.value.filter(s => s.type === 'body'));
    const localIntroStyles = computed(() => localStyles.value.filter(s => s.type === 'intro'));
    const localContainerStyles = computed(() => localStyles.value.filter(s => s.type === 'container'));

    async function fetchStyles() {
        loading.value = true;
        error.value = null;

        // 并行获取 API 样式和本地样式
        const [apiResult, localResult] = await Promise.allSettled([
            fetchApiStyles(),
            fetchLocalStyles()
        ]);

        // 处理 API 样式结果
        if (apiResult.status === 'fulfilled') {
            apiStyles.value = apiResult.value;
            console.log('[StyleStore] 从后端加载样式成功:', apiStyles.value.length, '个');
        } else {
            console.warn('[StyleStore] 后端 API 加载失败:', apiResult.reason);
            apiStyles.value = [];
        }

        // 处理本地样式结果
        if (localResult.status === 'fulfilled') {
            localStyles.value = localResult.value;
            console.log('[StyleStore] 加载本地样式:', localStyles.value.length, '个');
        } else {
            console.error('[StyleStore] 本地样式加载失败:', localResult.reason);
            localStyles.value = [];
        }

        loading.value = false;
    }

    // 获取 API 样式
    async function fetchApiStyles(): Promise<StyleTemplateWithSource[]> {
        const styles = await styleService.getAllStyles();
        return styles.map(s => ({ ...s, source: 'api' as const }));
    }

    // 获取本地样式
    async function fetchLocalStyles(): Promise<StyleTemplateWithSource[]> {
        const localStyles = getAllStyles();
        return [
            ...localStyles.title.map((s: StyleTemplate) => ({ ...s, type: 'title' as const, source: 'local' as const })),
            ...localStyles.body.map((s: StyleTemplate) => ({ ...s, type: 'body' as const, source: 'local' as const })),
            ...localStyles.intro.map((s: StyleTemplate) => ({ ...s, type: 'intro' as const, source: 'local' as const })),
            ...(localStyles.container || []).map((s: StyleTemplate) => ({ ...s, type: 'container' as const, source: 'local' as const })),
        ];
    }

    async function addStyle(data: {
        name: string;
        type: string;
        preview: string;
        fullExample: string;
    }) {
        try {
            const newStyle = await styleService.createStyle(data);
            // 新添加的样式是 API 样式
            apiStyles.value.unshift({ ...newStyle, source: 'api' });
            return newStyle;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '添加样式失败';
            error.value = message;
            throw err;
        }
    }

    async function updateStyle(id: string, data: Partial<StyleTemplate>) {
        try {
            // 判断样式来源
            const style = [...apiStyles.value, ...localStyles.value].find(s => s.id === id);

            if (!style) {
                throw new Error('样式未找到');
            }

            // 本地样式：只有管理员可以修改
            if (style.source === 'local') {
                const userStore = useUserStore();
                if (!userStore.isAdmin) {
                    throw new Error('只有管理员可以修改本地样式');
                }

                const success = updateLocalStorageStyle(id, data);
                if (!success) {
                    throw new Error('更新本地样式失败');
                }

                // 重新加载本地样式
                await fetchLocalStyles();
                return { ...style, ...data };
            }

            // 云端样式：所有人都可以修改
            const updated = await styleService.updateStyle(id, data);
            const index = apiStyles.value.findIndex(s => s.id === id);
            if (index !== -1) {
                apiStyles.value[index] = { ...updated, source: 'api' };
            }
            return updated;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '更新样式失败';
            error.value = message;
            throw err;
        }
    }

    async function deleteStyle(id: string) {
        try {
            // 判断样式来源
            const style = [...apiStyles.value, ...localStyles.value].find(s => s.id === id);

            if (!style) {
                throw new Error('样式未找到');
            }

            // 本地样式：只有管理员可以删除
            if (style.source === 'local') {
                const userStore = useUserStore();
                if (!userStore.isAdmin) {
                    throw new Error('只有管理员可以删除本地样式');
                }

                const success = deleteLocalStorageStyle(id);
                if (!success) {
                    throw new Error('删除本地样式失败');
                }

                // 重新加载本地样式
                await fetchLocalStyles();
                return;
            }

            // 云端样式：所有人都可以删除
            await styleService.deleteStyle(id);
            apiStyles.value = apiStyles.value.filter(s => s.id !== id);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '删除样式失败';
            error.value = message;
            throw err;
        }
    }

    return {
        // 合并后的样式
        styles,
        loading,
        error,
        titleStyles,
        bodyStyles,
        introStyles,
        containerStyles,
        // API 样式分类
        apiStyles,
        apiTitleStyles,
        apiBodyStyles,
        apiIntroStyles,
        apiContainerStyles,
        // 本地样式分类
        localStyles,
        localTitleStyles,
        localBodyStyles,
        localIntroStyles,
        localContainerStyles,
        // 方法
        fetchStyles,
        addStyle,
        updateStyle,
        deleteStyle,
    };
});
