import { categoryRepository } from '../db/categoryRepository.js';

export const categoryService = {
  async getCategories(type) {
    return categoryRepository.getAll(type);
  },

  async getCategoryById(id) {
    return categoryRepository.getById(id);
  },

  async createCategory(data) {
    return categoryRepository.create(data);
  },

  async updateCategory(id, data) {
    return categoryRepository.update(id, data);
  },

  async deleteCategory(id) {
    return categoryRepository.delete(id);
  },
};

