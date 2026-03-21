<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
    <div
      v-if="visible"
      class="fixed inset-0 z-[150] flex items-center justify-center bg-black/40"
      @click.self="emit('close')"
    >
      <div class="bg-white rounded-xl shadow-2xl w-[420px] max-w-[90vw] max-h-[80vh] flex flex-col overflow-hidden">
        <div class="px-5 pt-4 pb-3 border-b flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-800">版本快照</h3>
          <button class="text-gray-400 hover:text-gray-600 text-lg" @click="emit('close')">x</button>
        </div>

        <!-- Create snapshot -->
        <div class="px-5 py-3 border-b bg-gray-50 flex items-center gap-2">
          <input
            v-model="newLabel"
            type="text"
            placeholder="快照名称 (可选)"
            class="flex-1 px-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
            @keydown.enter="createSnapshot"
          />
          <button
            class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            @click="createSnapshot"
          >保存快照</button>
        </div>

        <!-- Snapshots list -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="snapshots.length === 0" class="py-10 text-center text-sm text-gray-400">
            暂无快照
          </div>
          <div
            v-for="snap in snapshots"
            :key="snap.id"
            class="px-5 py-3 border-b hover:bg-gray-50 transition-colors group"
          >
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm font-medium text-gray-700">{{ snap.label }}</span>
                <div class="text-[11px] text-gray-400 mt-0.5">
                  {{ formatTime(snap.timestamp) }} / {{ snap.wordCount }} 字
                </div>
              </div>
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <template v-if="confirmRestore === snap.id">
                  <span class="text-[11px] text-amber-600 mr-1">确认恢复?</span>
                  <button
                    class="px-2 py-1 text-[11px] bg-blue-600 text-white rounded hover:bg-blue-700"
                    @click="restoreSnapshot(snap.id)"
                  >确认</button>
                  <button
                    class="px-2 py-1 text-[11px] text-gray-500 hover:text-gray-700"
                    @click="confirmRestore = null"
                  >取消</button>
                </template>
                <template v-else>
                  <button
                    class="px-2 py-1 text-[11px] text-blue-600 hover:bg-blue-50 rounded"
                    @click="confirmRestore = snap.id"
                  >恢复</button>
                  <button
                    class="px-2 py-1 text-[11px] text-red-500 hover:bg-red-50 rounded"
                    @click="deleteSnapshot(snap.id)"
                  >删除</button>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="px-5 py-2 border-t text-[10px] text-gray-400 text-center">
          最多保存 {{ MAX_SNAPSHOTS }} 个快照 (存储在浏览器本地)
        </div>
      </div>
    </div>
  </Teleport>
</template>
