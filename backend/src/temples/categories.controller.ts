import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { TempleCategoriesRepository } from '../database/repositories/temple-categories.repository';
import { Public } from '../common/decorators/public.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesRepository: TempleCategoriesRepository) {}

  @Public()
  @Get()
  async getCategories() {
    try {
      const categories = await this.categoriesRepository.findAllActive();
      return categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        description: cat.description,
        image: cat.icon // Some frontend expects 'image'
      }));
    } catch (error) {
      throw new HttpException('Failed to fetch categories', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
