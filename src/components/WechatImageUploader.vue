<template>
  <div class="wechat-image-uploader">
    <div class="upload-area" :class="{ 'dragover': isDragOver }"
         @dragover.prevent="isDragOver = true"
         @dragleave.prevent="isDragOver = false"
         @drop.prevent="handleDrop">

      <!-- 上传按钮 -->
      <div v-if="!files.length" class="upload-placeholder">
        <i class="upload-icon">📷</i>
        <p>点击或拖拽图片到此处上传</p>
        <button class="upload-btn" @click="handleUploadClick">
          选择图片
        </button>
        <input ref="fileInput" type="file" accept="image/*" multiple @change="handleFileSelect" hidden>
      </div>

      <!-- 图片列表 -->
      <div v-else class="image-list">
        <div v-for="(file, index) in files" :key="file.id" class="image-item">
          <img :src="file.url" :alt="file.name" class="image-preview" />

          <!-- 上传状态 -->
          <div class="upload-status" :class="file.status">
            <span v-if="file.status === 'uploading'" class="status-text">
              <i class="loading-spinner"></i>
              上传中...
            </span>
            <span v-else-if="file.status === 'success'" class="status-text success">
              <i class="success-icon">✓</i>
              已上传
            </span>
            <span v-else-if="file.status === 'error'" class="status-text error">
              <i class="error-icon">✗</i>
              上传失败
            </span>
          </div>

          <!-- 操作按钮 -->
          <div class="image-actions">
            <button @click="removeImage(index)" class="remove-btn" title="删除">
              ✕
            </button>
          </div>
        </div>

        <!-- 添加更多按钮 -->
        <div class="add-more-btn" @click="handleUploadClick">
          <i class="add-icon">+</i>
          <span>添加更多</span>
        </div>
        <input ref="fileInput" type="file" accept="image/*" multiple @change="handleFileSelect" hidden>
      </div>
    </div>

    <!-- 上传结果信息 -->
    <div v-if="uploadResults.length" class="upload-results">
      <h4>上传结果</h4>
      <div class="result-list">
        <div v-for="result in uploadResults" :key="result.id"
             class="result-item" :class="result.success ? 'success' : 'error'">
          <span class="result-name">{{ result.name }}</span>
          <span class="result-status">
            {{ result.success ? '✓ 成功' : '✗ 失败' }}
          </span>
          <span v-if="result.media_id" class="result-media-id">
            Media ID: {{ result.media_id }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { wechatService } from '../services/wechatService';

interface UploadFile {
  id: string;
  name: string;
  file: File;
  url: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  media_id?: string;
  error?: string;
}

interface UploadResult {
  id: string;
  name: string;
  success: boolean;
  media_id?: string;
  error?: string;
}

const files = ref<UploadFile[]>([]);
const uploadResults = ref<UploadResult[]>([]);
const isDragOver = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const handleUploadClick = () => {
  fileInput.value?.click();
};

// 文件选择处理
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const selectedFiles = Array.from(input.files || []);

  addFiles(selectedFiles);
};

// 拖放处理
const handleDrop = (event: DragEvent) => {
  isDragOver.value = false;
  const droppedFiles = Array.from(event.dataTransfer?.files || []);

  // 过滤只保留图片文件
  const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'));
  addFiles(imageFiles);
};

// 添加文件到列表
const addFiles = (newFiles: File[]) => {
  for (const file of newFiles) {
    const uploadFile: UploadFile = {
      id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      name: file.name,
      file: file,
      url: URL.createObjectURL(file),
      status: 'pending'
    };

    files.value.push(uploadFile);
  }

  // 自动开始上传
  setTimeout(() => {
    startUpload();
  }, 100);
};

// 开始上传
const startUpload = async () => {
  const pendingFiles = files.value.filter(f => f.status === 'pending');

  for (const file of pendingFiles) {
    await uploadImage(file);
  }
};

// 上传单个图片
const uploadImage = async (uploadFile: UploadFile) => {
  try {
    uploadFile.status = 'uploading';

    console.log('开始上传图片到微信:', uploadFile.name);

    // 关键：直接调用微信API，无需任何授权
    const result = await wechatService.uploadImage(uploadFile.file);

    // 上传成功
    uploadFile.status = 'success';
    uploadFile.media_id = result.media_id;

    // 添加到结果列表
    uploadResults.value.push({
      id: uploadFile.id,
      name: uploadFile.name,
      success: true,
      media_id: result.media_id,
    });

    console.log('图片上传成功:', uploadFile.name, 'Media ID:', result.media_id);

    // 触发成功事件
    const event = new CustomEvent('image-upload-success', {
      detail: {
        file: uploadFile,
        result: result
      }
    });
    document.dispatchEvent(event);

  } catch (error: any) {
    console.error('图片上传失败:', error);

    uploadFile.status = 'error';
    uploadFile.error = error.message;

    // 添加到结果列表
    uploadResults.value.push({
      id: uploadFile.id,
      name: uploadFile.name,
      success: false,
      error: error.message,
    });

    // 触发失败事件
    const event = new CustomEvent('image-upload-error', {
      detail: {
        file: uploadFile,
        error: error
      }
    });
    document.dispatchEvent(event);
  }
};

// 移除图片
const removeImage = (index: number) => {
  const file = files.value[index];

  // 释放对象URL
  URL.revokeObjectURL(file.url);

  // 从列表中移除
  files.value.splice(index, 1);
};

// 获取所有上传成功的media_id
const getMediaIds = (): string[] => {
  return files.value
    .filter(f => f.status === 'success' && f.media_id)
    .map(f => f.media_id!);
};

// 清空列表
const clear = () => {
  // 释放所有对象URL
  files.value.forEach(file => {
    URL.revokeObjectURL(file.url);
  });

  files.value = [];
  uploadResults.value = [];
};

// 暴露给父组件的方法
defineExpose({
  getMediaIds,
  clear
});
</script>

<style scoped>
.wechat-image-uploader {
  width: 100%;
}

.upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: border-color 0.3s;
}

.upload-area.dragover {
  border-color: #007bff;
  background-color: #f0f8ff;
}

.upload-placeholder {
  color: #666;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
  display: block;
}

.upload-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.upload-btn:hover {
  background: #0056b3;
}

.image-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.image-item {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.upload-status {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
}

.status-text.uploading {
  background: #007bff;
}

.status-text.success {
  background: #28a745;
}

.status-text.error {
  background: #dc3545;
}

.image-actions {
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: flex;
  gap: 8px;
}

.remove-btn {
  background: rgba(220, 53, 69, 0.8);
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.add-more-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  cursor: pointer;
  background: #f8f9fa;
}

.add-more-btn:hover {
  border-color: #007bff;
  background: #e3f2fd;
}

.add-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.upload-results {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.result-list {
  margin-top: 10px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}

.result-item:last-child {
  border-bottom: none;
}

.result-name {
  flex: 1;
  font-weight: 500;
}

.result-status {
  margin-left: 10px;
  font-weight: bold;
}

.result-item.success .result-status {
  color: #28a745;
}

.result-item.error .result-status {
  color: #dc3545;
}

.result-media-id {
  font-size: 12px;
  color: #666;
  margin-left: 10px;
}

.loading-spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>