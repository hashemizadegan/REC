import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';

export interface NewsItem {
  id: string;
  title: { fa: string; ru: string; en: string };
  summary: { fa: string; ru: string; en: string };
  content: { fa: string; ru: string; en: string };
  imageUrl?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class NewsService {
  // در صورت استفاده از TypeORM/Prisma با Repository متصل می‌شود
  private newsList: NewsItem[] = [];

  async findAll(lang: 'fa' | 'ru' | 'en' = 'fa', onlyPublished = true) {
    const items = onlyPublished ? this.newsList.filter(n => n.published) : this.newsList;
    return items.map(n => ({
      id: n.id,
      title: n.title[lang] || n.title.en,
      summary: n.summary[lang] || n.summary.en,
      content: n.content[lang] || n.content.en,
      imageUrl: n.imageUrl,
      createdAt: n.createdAt,
    }));
  }

  async findOne(id: string) {
    const item = this.newsList.find(n => n.id === id);
    if (!item) throw new NotFoundException(`News with ID ${id} not found`);
    return item;
  }

  async create(dto: CreateNewsDto): Promise<NewsItem> {
    const newItem: NewsItem = {
      id: Buffer.from(Date.now().toString()).toString('base64url'),
      title: { fa: dto.titleFa, ru: dto.titleRu, en: dto.titleEn },
      summary: { fa: dto.summaryFa, ru: dto.summaryRu, en: dto.summaryEn },
      content: { fa: dto.contentFa, ru: dto.contentRu, en: dto.contentEn },
      imageUrl: dto.imageUrl,
      published: dto.published ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.newsList.unshift(newItem);
    return newItem;
  }
}
