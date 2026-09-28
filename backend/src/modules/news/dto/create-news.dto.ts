export class CreateNewsDto {
  titleFa: string;
  titleRu: string;
  titleEn: string;
  summaryFa: string;
  summaryRu: string;
  summaryEn: string;
  contentFa: string;
  contentRu: string;
  contentEn: string;
  imageUrl?: string;
  published: boolean;
}
