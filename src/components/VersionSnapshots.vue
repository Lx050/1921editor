<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import type { EditorDocument } from '@/types/editor'

const props = defineProps<{
  editor: Editor | null
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

interface Snapshot {
  id: string
  label: string
  timestamp: number
  wordCount: number
  data: EditorDocument
}

const STORAGE_KEY = 'manifold_version_snapshots'
const MAX_SNAPSHOTS = 10

const snapshots = ref<Snapshot[]>([])
const newLabel = ref('')
const confirmRestore = ref<string | null>(null)
const confirmDeleteId = ref<string | null>(null)
const backdropRef = ref<HTMLElement | null>(null)

watch(() => props.visible, (val) => {
  if (val) {
    nextTick(() => backdropRef.value?.focus())
  }
})

function loadSnapshots() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      snapshots.value = JSON.parse(saved)
    }
  } catch { /* ignore */ }
}

function saveSnapshots() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots.value))
  } catch { /* ignore */ }
}

function createSnapshot() {
  if (!props.editor) return
  const doc = props.editor.getJSON() as EditorDocument
  const text = props.editor.getText()
  const label = newLabel.value.trim() || `快照 ${snapshots.value.length + 1}`
  const snapshot: Snapshot = {
    id: Date.now().toString(36),
    label,
    timestamp: Date.now(),
    wordCount: text.length,
    data: doc,
  }
  snapshots.value.unshift(snapshot)
  if (snapshots.value.length > MAX_SNAPSHOTS) {
    snapshots.value = snapshots.value.slice(0, MAX_SNAPSHOTS)
  }
  saveSnapshots()
  newLabel.value = ''
}

function restoreSnapshot(id: string) {
  if (!props.editor) return
  const snapshot = snapshots.value.find(s => s.id === id)
  if (!snapshot) return
  props.editor.commands.setContent(snapshot.data)
  confirmRestore.value = null
}

function deleteSnapshot(id: string) {
  snapshots.value = snapshots.value.filter(s => s.id !== id)
  confirmDeleteId.value = null
  saveSnapshots()
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(loadSnapshots)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      leave-active-class="transition-all duration-100 ease-in"
      enter-from-class="opacity-0 scale-95"
      leave-to-class="opacity-0 scale-95"
    >
    <div
      v-if="visible"
      ref="backdropRef"
      class="fixed inset-0 z-[150] flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      @click.self="emit('close')"
      @keydown.escape="emit('close')"
    >
      <div class="bg-white rounded-xl w-[420px] max-w-[90vw] max-h-[80vh] flex flex-col overflow-hidden" style="box-shadow:var(--shadow-float);">
        <div class="px-5 pt-4 pb-3 border-b flex items-center justify-between">
          <h3 class="text-sm font-semibold" style="color:rgba(0,0,0,0.75);">版本快照</h3>
          <button class="text-lg" style="color:var(--color-text-muted);" onmouseover="this.style.color='rgba(0,0,0,0.55)'" onmouseout="this.style.color='var(--color-text-muted)'" @click="emit('close')" title="关闭" aria-label="关闭版本快照">x</button>
        </div>

        <!-- Create snapshot -->
        <div class="px-5 py-3 border-b flex items-center gap-2" style="background:var(--color-bg-warm);">
          <input
            v-model="newLabel"
            type="text"
            placeholder="快照名称 (可选)"
            class="flex-1 px-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1"
            style="--tw-ring-color:var(--color-accent-primary);"
            @keydown.enter="createSnapshot"
          />
          <button
            class="px-3 py-1.5 text-sm text-white rounded-lg transition-colors whitespace-nowrap"
            style="background-color: var(--color-accent-primary);"
            @mouseover="$event.target.style.backgroundColor='var(--color-accent-hover)'"
            @mouseout="$event.target.style.backgroundColor='var(--color-accent-primary)'"
            @click="createSnapshot"
          >保存快照</button>
        </div>

        <!-- Snapshots list -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="snapshots.length === 0" class="py-10 text-center text-sm" style="color:var(--color-text-muted);">
            暂无快照
          </div>
          <div
            v-for="snap in snapshots"
            :key="snap.id"
            class="px-5 py-3 border-b transition-colors group"
            onmouseover="this.style.background='var(--color-bg-warm)'" onmouseout="this.style.background=''"
          >
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm font-medium" style="color:rgba(0,0,0,0.65);">{{ snap.label }}</span>
                <div class="text-[11px] mt-0.5" style="color:var(--color-text-muted);">
                  {{ formatTime(snap.timestamp) }} / {{ snap.wordCount }} 字
                </div>
              </div>
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <template v-if="confirmRestore === snap.id">
                  <span class="text-[11px] text-amber-600 mr-1">确认恢复?</span>
                  <button
                    class="px-2 py-1 text-[11px] text-white rounded"
                    style="background:var(--color-accent-primary);"
                    @mouseover="$event.target.style.background='var(--color-accent-hover)'"
                    @mouseout="$event.target.style.background='var(--color-accent-primary)'"
                    @click="restoreSnapshot(snap.id)"
                  >确认</button>
                  <button
                    class="px-2 py-1 text-[11px]"
                    style="color:rgba(0,0,0,0.45);"
                    onmouseover="this.style.color='rgba(0,0,0,0.65)'" onmouseout="this.style.color='rgba(0,0,0,0.45)'"
                    @click="confirmRestore = null"
                  >取消</button>
                </template>
                <template v-else-if="confirmDeleteId === snap.id">
                  <span class="text-[11px] text-red-600 mr-1">确认删除？</span>
                  <button
                    class="px-2 py-1 text-[11px] text-white rounded"
                    style="background:var(--color-danger);"
                    @mouseover="($event.target as HTMLElement).style.background='#b91c1c'"
                    @mouseout="($event.target as HTMLElement).style.background='var(--color-danger)'"
                    @click="deleteSnapshot(snap.id)"
                  >确定</button>
                  <button
                    class="px-2 py-1 text-[11px]"
                    style="color:rgba(0,0,0,0.45);"
                    onmouseover="this.style.color='rgba(0,0,0,0.65)'" onmouseout="this.style.color='rgba(0,0,0,0.45)'"
                    @click="confirmDeleteId = null"
                  >取消</button>
                </template>
                <template v-else>
                  <button
                    class="px-2 py-1 text-[11px] rounded"
                    style="color:var(--color-accent-primary);"
                    @mouseover="($event.target as HTMLElement).style.background='var(--color-badge-bg)'"
                    @mouseout="($event.target as HTMLElement).style.background='transparent'"
                    @click="confirmRestore = snap.id"
                  >恢复</button>
                  <button
                    class="px-2 py-1 text-[11px] text-red-500 hover:bg-red-50 rounded"
                    @click="confirmDeleteId = snap.id"
                  >删除</button>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="px-5 py-2 border-t text-[10px] text-center" style="color:var(--color-text-muted);">
          最多保存 {{ MAX_SNAPSHOTS }} 个快照 (存储在浏览器本地)
        </div>
      </div>
    </div>
    </Transition>
  </Teleport>
</template>
