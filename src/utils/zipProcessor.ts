import JSZip from 'jszip'
import mammoth from 'mammoth'
import type { WechatImage } from '@/stores/appStore'

interface ProcessedZipFile {
  text: string
  images: Array<{
    file: File
    fileName: string
  }>
}

/**
 * 压缩包处理工具
 * 支持 zip/7z 格式，提取 docx 和图片
 */
export class ZipProcessor {
  /**
   * 检查文件是否是支持的压缩包格式
   */
  static isSupportedArchive(fileName: string): boolean {
    const supportedExtensions = ['.zip', '.7z']
    const extension = fileName.toLowerCase().slice(fileName.lastIndexOf('.'))
    return supportedExtensions.includes(extension)
  }

  /**
   * 检查文件是否是图片
   */
  static isImageFile(fileName: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    const extension = fileName.toLowerCase().slice(fileName.lastIndexOf('.'))
    return imageExtensions.includes(extension)
  }

  /**
   * 检查文件是否是Word文档
   */
  static isDocxFile(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.docx')
  }

  /**
   * 处理压缩包文件
   * @param file 压缩包文件
   * @returns 处理后的文本和图片列表
   */
  static async processZipFile(file: File): Promise<ProcessedZipFile> {
    try {
      const zip = await JSZip.loadAsync(file)
      const result: ProcessedZipFile = {
        text: '',
        images: []
      }

      // 查找docx文件
      const docxFile = this.findDocxFile(zip)
      if (docxFile) {
        result.text = await this.extractTextFromDocx(docxFile)
      }

      // 查找所有图片
      const imageFiles = this.findImageFiles(zip)
      for (const imageFile of imageFiles) {
        const blob = await imageFile.async('blob')
        result.images.push({
          file: new File([blob], imageFile.name),
          fileName: imageFile.name
        })
      }

      // 如果没有找到docx，尝试查找txt文件
      if (!result.text) {
        const txtFile = this.findTxtFile(zip)
        if (txtFile) {
          result.text = await txtFile.async('string')
        }
      }

      return result
    } catch (error) {
      throw new Error(`解压文件失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 在压缩包中查找docx文件
   */
  private static findDocxFile(zip: JSZip): JSZip.JSZipObject | null {
    let docxFile: JSZip.JSZipObject | null = null

    zip.forEach((relativePath, file) => {
      if (!file.dir && this.isDocxFile(relativePath)) {
        docxFile = file
      }
    })

    return docxFile
  }

  /**
   * 在压缩包中查找txt文件
   */
  private static findTxtFile(zip: JSZip): JSZip.JSZipObject | null {
    let txtFile: JSZip.JSZipObject | null = null

    zip.forEach((relativePath, file) => {
      if (!file.dir && relativePath.toLowerCase().endsWith('.txt')) {
        txtFile = file
      }
    })

    return txtFile
  }

  /**
   * 在压缩包中查找所有图片文件
   */
  private static findImageFiles(zip: JSZip): JSZip.JSZipObject[] {
    const imageFiles: JSZip.JSZipObject[] = []

    zip.forEach((relativePath, file) => {
      if (!file.dir && this.isImageFile(relativePath)) {
        imageFiles.push(file)
      }
    })

    // 按文件名排序，确保顺序一致
    imageFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))

    return imageFiles
  }

  /**
   * 从docx文件中提取文本
   */
  private static async extractTextFromDocx(docxFile: JSZip.JSZipObject): Promise<string> {
    try {
      const arrayBuffer = await docxFile.async('arraybuffer')
      const result = await mammoth.convertToHtml({ arrayBuffer })

      // 将HTML转换为纯文本格式
      return this.convertHtmlToText(result.value)
    } catch (error) {
      throw new Error(`解析Word文档失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 将HTML转换为自定义文本格式
   */
  private static convertHtmlToText(html: string): string {
    // 创建临时div来解析HTML
    const div = document.createElement('div')
    div.innerHTML = html

    let text = ''

    // 遍历所有节点
    const processNode = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || ''
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return ''

      const element = node as Element
      let content = ''

      // 处理图片
      if (element.tagName === 'IMG') {
        return '\n\n&单图\n\n'
      }

      // 递归处理子节点
      element.childNodes.forEach(child => {
        content += processNode(child)
      })

      // 根据标签类型添加格式
      switch (element.tagName) {
        case 'H1':
        case 'H2':
        case 'H3':
          return `\n\n# ${content.trim()}\n\n`
        case 'P':
          // 如果段落只包含图片，直接返回
          if (content.trim() === '&单图') return content
          return `\n\n${content.trim()}\n\n`
        case 'BR':
          return '\n'
        default:
          return content
      }
    }

    div.childNodes.forEach(node => {
      text += processNode(node)
    })

    // 清理多余的空行
    return text.replace(/\n{3,}/g, '\n\n').trim()
  }

  /**
   * 提取文件名中的数字索引
   * 例如：image1.jpg → 1, double-2.png → 2
   */
  static extractFileIndex(fileName: string): number | null {
    const match = fileName.match(/(\d+)/)
    return match ? parseInt(match[1]) : null
  }

  /**
   * 判断是否是双图的第一个或第二个
   */
  static isDoubleImagePair(fileName1: string, fileName2: string): boolean {
    // 双图命名规则：xxx1-1.jpg, xxx1-2.jpg
    const regex = /(.*)(\d+)-(\d+)\./
    const match1 = fileName1.match(regex)
    const match2 = fileName2.match(regex)

    if (!match1 || !match2) return false

    return match1[1] === match2[1] && match1[2] === match2[2]
  }

  /**
   * 将文件名分组（单图和双图）
   */
  static groupImageFiles(files: Array<{ file: File; fileName: string }>): Array<
    | { type: 'single'; data: { file: File; fileName: string } }
    | { type: 'double'; data: [{ file: File; fileName: string }, { file: File; fileName: string }] }
  > {
    const groups = []
    const used = new Set<number>()

    for (let i = 0; i < files.length; i++) {
      if (used.has(i)) continue

      const current = files[i]
      const currentIndex = this.extractFileIndex(current.fileName)

      // 检查是否是双图的一部分
      let foundPair = false
      for (let j = i + 1; j < files.length; j++) {
        if (used.has(j)) continue

        const next = files[j]

        if (this.isDoubleImagePair(current.fileName, next.fileName)) {
          groups.push({
            type: 'double' as const,
            data: [current, next]
          })
          used.add(i)
          used.add(j)
          foundPair = true
          break
        }
      }

      // 如果没找到配对，作为单图
      if (!foundPair) {
        groups.push({
          type: 'single' as const,
          data: current
        })
        used.add(i)
      }
    }

    return groups
  }
}

export default ZipProcessor
