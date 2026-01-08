import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerateImageDto, ImageType } from './dto/generate-image.dto';

@Injectable()
export class NanoBananaService {
  private readonly logger = new Logger(NanoBananaService.name);
  // 火山引擎配置
  private readonly API_URL =
    'https://ark.cn-beijing.volces.com/api/v3/images/generations';
  private readonly API_KEY = 'f70c7540-ad26-4285-a338-318f51f95f81';
  private readonly MODEL = 'doubao-seedream-4-5-251128';

  constructor(private configService: ConfigService) {}

  async generateImage(dto: GenerateImageDto): Promise<{ url: string }> {
    const { text, type } = dto;

    // 构造 Prompt - 核心是把文字做成图片，而不是生成配图
    let prompt = '';

    // 视觉风格词（用户提供的高质量关键词）
    const visualStyle =
      '强视觉冲击力，电影大片质感，动感，对比色，OC渲染，光线追踪，动态模糊，景深，超现实主义，细腻的色彩层次，质感真实，光影效果，艺术幻想感，耀光，反射，极致光影，8k分辨率';

    // 针对不同类型，构造"文字图片化"的 Prompt
    switch (type) {
      case ImageType.TITLE:
        // 标题：震撼的标题字体设计
        prompt = `图片内容为标题文字"${text}"，采用震撼的3D立体字体设计，金属质感或玻璃质感，强烈的光影追踪效果，背景简洁深邃渐变，${visualStyle}，电影海报风格`;
        break;
      case ImageType.SUBTITLE:
        // 副标题：优雅的副标题呈现
        prompt = `图片内容为副标题文字"${text}"，采用现代优雅字体，柔和光晕效果，简约背景，${visualStyle}，杂志封面风格`;
        break;
      case ImageType.QUOTE:
        // 引言：文艺优雅的引文呈现
        prompt = `图片内容为引言文字"${text}"，采用优雅的衬线字体或书法字体，柔和光影，纸质或布料纹理背景，${visualStyle}，文艺海报风格`;
        break;
      case ImageType.BODY:
        // 正文：清晰易读的段落文字图片
        const context = text.length > 200 ? text.substring(0, 200) : text;
        prompt = `图片内容为正文段落"${context}"，采用清晰易读的现代字体，适当的行距和段落排版，简洁背景，${visualStyle}，编辑设计风格`;
        break;
      default:
        prompt = `图片内容为文字"${text}"，视觉化呈现，${visualStyle}`;
    }

    const requestBody = {
      model: this.MODEL,
      prompt: prompt,
      sequential_image_generation: 'disabled',
      response_format: 'url',
      size: '2K',
      stream: false,
      watermark: true,
    };

    this.logger.log(
      `[Volcengine] Requesting image with prompt: ${prompt.substring(0, 50)}...`,
    );
    this.logger.debug(
      `[Volcengine] Full payload: ${JSON.stringify(requestBody)}`,
    );

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      this.logger.log(
        `[Volcengine] Response Status: ${response.status} ${response.statusText}`,
      );

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`[Volcengine] Error Body: ${errorText}`);
        throw new Error(
          `Volcengine API Error (${response.status}): ${errorText}`,
        );
      }

      const data = await response.json();
      this.logger.debug(`[Volcengine] Response Data: ${JSON.stringify(data)}`);

      // 解析返回结构 { data: [{ url: "..." }] }
      const imageUrl = data.data?.[0]?.url;

      if (!imageUrl) {
        this.logger.error('[Volcengine] No image URL in response data');
        throw new Error('No image URL returned from Volcengine');
      }

      this.logger.log(`[Volcengine] Image URL: ${imageUrl}`);
      return { url: imageUrl };
    } catch (error) {
      this.logger.error('[Volcengine] Final Catch Error:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  // 这些辅助方法不再需要，因为已经内联了 Prompt 逻辑，或者可以保留空壳以防 interface 依赖
  private constructPrompt(
    text: string,
    type: ImageType,
    style?: string,
  ): string {
    return '';
  }
  private getMockImage(text: string, type: ImageType): { url: string } {
    return { url: '' };
  }
}
