/**
 * 内容块查找工具
 * 提供递归查找内容块和父块的辅助函数
 */
import type { ContentBlock } from '../types'

/**
 * 递归查找内容块
 * @param blocks 内容块数组
 * @param id 要查找的块ID
 * @returns 找到的内容块或 undefined
 */
export function findBlockRecursive(
  blocks: ContentBlock[],
  id: string
): ContentBlock | undefined {
  for (const block of blocks) {
    if (block.id === id) return block
    if (block.children) {
      const found = findBlockRecursive(block.children, id)
      if (found) return found
    }
  }
  return undefined
}

/**
 * 查找父内容块
 * @param blocks 内容块数组
 * @param childId 子块ID
 * @returns 父内容块或 undefined
 */
export function findParentBlock(
  blocks: ContentBlock[],
  childId: string
): ContentBlock | undefined {
  for (const block of blocks) {
    if (block.children) {
      if (block.children.some(child => child.id === childId)) {
        return block
      }
      const found = findParentBlock(block.children, childId)
      if (found) return found
    }
  }
  return undefined
}

/**
 * 内容块查找 Composable
 */
export function useBlockFinder() {
  return {
    findBlockRecursive,
    findParentBlock
  }
}
