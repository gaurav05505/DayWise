import mongoose from 'mongoose';
import Subject from '../models/subject.model.js';

const formatSubject = (subject) => {
  const obj = subject.toObject ? subject.toObject() : subject;
  const percentage =
    obj.totalClasses === 0
      ? 0
      : Number(((obj.attendedClasses / obj.totalClasses) * 100).toFixed(2));
  const status = percentage >= 75 ? 'On Track' : 'Below Target';
  return {
    ...obj,
    attendancePercentage: percentage,
    status,
  };
};

export const createSubject = async (req, res) => {
  try {
    const { name, totalClasses = 0, attendedClasses = 0 } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Subject name is required' });
    }

    if (totalClasses < 0 || attendedClasses < 0) {
      return res
        .status(400)
        .json({ message: 'Class counts must be non-negative' });
    }

    if (Number(attendedClasses) > Number(totalClasses)) {
      return res
        .status(400)
        .json({ message: 'Attended classes cannot be greater than total classes' });
    }

    const subject = await Subject.create({
      name: name.trim(),
      totalClasses: Number(totalClasses),
      attendedClasses: Number(attendedClasses),
    });

    res.status(201).json({
      message: 'Subject created successfully',
      subject: formatSubject(subject),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: -1 });
    res.status(200).json(subjects.map(formatSubject));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid subject ID' });
    }

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json(formatSubject(subject));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, totalClasses, attendedClasses } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid subject ID' });
    }

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    if (name !== undefined) {
      if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Subject name cannot be empty' });
      }
      subject.name = name.trim();
    }

    if (totalClasses !== undefined) {
      if (totalClasses < 0) {
        return res
          .status(400)
          .json({ message: 'Total classes must be non-negative' });
      }
      subject.totalClasses = Number(totalClasses);
    }

    if (attendedClasses !== undefined) {
      if (attendedClasses < 0) {
        return res
          .status(400)
          .json({ message: 'Attended classes must be non-negative' });
      }
      subject.attendedClasses = Number(attendedClasses);
    }

    if (subject.attendedClasses > subject.totalClasses) {
      return res
        .status(400)
        .json({ message: 'Attended classes cannot be greater than total classes' });
    }

    await subject.save();

    res.status(200).json({
      message: 'Subject updated successfully',
      subject: formatSubject(subject),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markPresent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid subject ID' });
    }

    const subject = await Subject.findByIdAndUpdate(
      id,
      { $inc: { totalClasses: 1, attendedClasses: 1 } },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json({
      message: 'Marked present successfully',
      subject: formatSubject(subject),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAbsent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid subject ID' });
    }

    const subject = await Subject.findByIdAndUpdate(
      id,
      { $inc: { totalClasses: 1 } },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json({
      message: 'Marked absent successfully',
      subject: formatSubject(subject),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid subject ID' });
    }

    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
