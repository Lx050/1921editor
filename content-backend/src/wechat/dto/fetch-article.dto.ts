import { IsUrl, IsNotEmpty } from 'class-validator';

export class FetchWechatArticleDto {
    @IsUrl()
    @IsNotEmpty()
    url: string;
}
