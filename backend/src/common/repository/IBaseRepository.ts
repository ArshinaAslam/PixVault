import type { Document, FilterQuery } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  create(data: Partial<T>): Promise<T>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  find(filter?: FilterQuery<T>): Promise<T[]>;
  findPaginated(
    filter: FilterQuery<T>,
    page: number,
    limit: number
  ): Promise<{ data: T[]; total: number }>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<T | null>;
  count(filter: FilterQuery<T>): Promise<number>;
}
