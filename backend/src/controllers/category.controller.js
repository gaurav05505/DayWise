import mongoose from 'mongoose';
import Category from '../models/category.model.js';

export const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Category name is required' });
    }

    if (!type || !['income', 'expense'].includes(type)) {
      return res
        .status(400)
        .json({ message: 'Type must be either income or expense' });
    }

    const category = await Category.create({
      name: name.trim(),
      type,
    });

    res.status(201).json({
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};

    if (type) {
      if (!['income', 'expense'].includes(type)) {
        return res
          .status(400)
          .json({ message: 'Type query must be either income or expense' });
      }
      filter.type = type;
    }

    const categories = await Category.find(filter).sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name !== undefined) {
      if (!name || name.trim() === '') {
        return res
          .status(400)
          .json({ message: 'Category name cannot be empty' });
      }
      category.name = name.trim();
    }

    if (type !== undefined) {
      if (!['income', 'expense'].includes(type)) {
        return res
          .status(400)
          .json({ message: 'Type must be either income or expense' });
      }
      category.type = type;
    }

    await category.save();

    res.status(200).json({
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

