export class PaginationMetaDto {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;

  constructor(totalItems: number, itemsPerPage: number, currentPage: number, itemCount: number) {
    this.totalItems = totalItems;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = currentPage;
    this.itemCount = itemCount;
    this.totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  }
}

export class PaginatedResponseDto<T> {
  data: T[];
  meta: PaginationMetaDto;

  constructor(data: T[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
