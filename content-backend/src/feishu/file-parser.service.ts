import { Injectable, Logger } from '@nestjs/common';
import * as mammoth from 'mammoth';
import * as AdmZip from 'adm-zip';
import * as path from 'path';
import * as fs from 'fs/promises';

export interface ParsedContent {
  text: string;
  images: Array<{
    name: string;
    path: string;
    buffer: Buffer;
  }>;
}

@Injectable()
export class FileParserService {
  private readonly logger = new Logger(FileParserService.name);

  /**
   * 解析上传的文件（支持 .docx 和 .zip）
   */
  async parseFile(filePath: string): Promise<ParsedContent> {
    const ext = path.extname(filePath).toLowerCase();

    this.logger.log(`Parsing file: ${filePath} (${ext})`);

    switch (ext) {
      case '.docx':
        return this.parseDocx(filePath);
      case '.zip':
        return this.parseZip(filePath);
      default:
        throw new Error(`Unsupported file type: ${ext}`);
    }
  }

  /**
   * 解析 .docx 文件
   */
  private async parseDocx(filePath: string): Promise<ParsedContent> {
    try {
      const result = await mammoth.extractRawText({ path: filePath });

      this.logger.log(`Extracted ${result.value.length} characters from DOCX`);

      // TODO: 解析 DOCX 中的图片（mammoth 支持图片提取，需要额外配置）
      // 暂时只返回文本
      return {
        text: result.value,
        images: [],
      };
    } catch (error) {
      this.logger.error(`Failed to parse DOCX: ${error.message}`);
      throw error;
    }
  }

  /**
   * 解析 .zip 文件
   * 期待结构：
   * - content.txt 或 content.docx（文本内容）
   * - images/（图片文件夹）
   */
  private async parseZip(filePath: string): Promise<ParsedContent> {
    try {
      const zip = new AdmZip(filePath);
      const zipEntries = zip.getEntries();

      let text = '';
      const images: Array<{ name: string; path: string; buffer: Buffer }> = [];

      for (const entry of zipEntries) {
        const entryName = entry.entryName;

        // 提取文本内容
        if (entryName === 'content.txt' || entryName === 'README.txt') {
          text = entry.getData().toString('utf8');
          this.logger.log(
            `Extracted text from ${entryName}: ${text.length} chars`,
          );
        }
        // 如果包含 .docx，解析它
        else if (entryName.endsWith('.docx')) {
          const tempDocxPath = path.join('/tmp', `temp_${Date.now()}.docx`);
          await fs.writeFile(tempDocxPath, entry.getData());
          const docxContent = await this.parseDocx(tempDocxPath);
          text += docxContent.text;
          await fs.unlink(tempDocxPath); // 清理临时文件
        }
        // 提取图片
        else if (this.isImageFile(entryName)) {
          images.push({
            name: path.basename(entryName),
            path: entryName,
            buffer: entry.getData(),
          });
          this.logger.log(`Extracted image: ${entryName}`);
        }
      }

      this.logger.log(
        `ZIP parsing complete - Text: ${text.length} chars, Images: ${images.length}`,
      );

      return { text, images };
    } catch (error) {
      this.logger.error(`Failed to parse ZIP: ${error.message}`);
      throw error;
    }
  }

  /**
   * 判断是否为图片文件
   */
  private isImageFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'].includes(ext);
  }
}
