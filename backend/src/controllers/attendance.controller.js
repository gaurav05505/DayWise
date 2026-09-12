import mongoose from 'mongoose';
import Subject from '../models/subject.model.js';

export const getAttendanceSummary = async (req, res) => {
  try {
    const subjects = await Subject.find();

    const totalClasses = subjects.reduce(
      (sum, subject) => sum + subject.totalClasses,
      0
    );
    const totalAttendedClasses = subjects.reduce(
      (sum, subject) => sum + subject.attendedClasses,
      0
    );

    const targetAttendance = 75;
    const overallAttendancePercentage =
      totalClasses === 0
        ? 0
        : Number(((totalAttendedClasses / totalClasses) * 100).toFixed(2));

    let recommendation = '';

    if (totalClasses === 0) {
      recommendation = 'No classes recorded yet';
    } else if (overallAttendancePercentage >= targetAttendance) {
      const canMiss = Math.floor(
        (4 * totalAttendedClasses - 3 * totalClasses) / 3
      );
      if (canMiss > 0) {
        recommendation = `You can miss the next ${canMiss} class${
          canMiss > 1 ? 'es' : ''
        } and maintain 75% attendance.`;
      } else {
        recommendation =
          'You are at target attendance. Avoid missing any upcoming classes.';
      }
    } else {
      const mustAttend = Math.max(1, 3 * totalClasses - 4 * totalAttendedClasses);
      recommendation = `You must attend the next ${mustAttend} consecutive class${
        mustAttend > 1 ? 'es' : ''
      } to reach 75% attendance.`;
    }

    res.status(200).json({
      totalClasses,
      totalAttendedClasses,
      overallAttendancePercentage,
      targetAttendance,
      recommendation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { attendance } = req.body;

    if (!Array.isArray(attendance) || attendance.length === 0) {
      return res
        .status(400)
        .json({ message: 'Attendance array is required and cannot be empty' });
    }

    const subjectIds = [];

    for (const record of attendance) {
      if (!record.subjectId || !mongoose.Types.ObjectId.isValid(record.subjectId)) {
        return res
          .status(400)
          .json({ message: `Invalid subject ID: ${record.subjectId}` });
      }

      if (!record.status || !['present', 'absent'].includes(record.status)) {
        return res.status(400).json({
          message: `Status must be either 'present' or 'absent' for subject ID: ${record.subjectId}`,
        });
      }

      subjectIds.push(record.subjectId);
    }

    const uniqueSubjectIds = [...new Set(subjectIds)];
    if (uniqueSubjectIds.length !== subjectIds.length) {
      return res
        .status(400)
        .json({ message: 'Duplicate subject IDs found in attendance array' });
    }

    const existingSubjects = await Subject.find({ _id: { $in: uniqueSubjectIds } });
    if (existingSubjects.length !== uniqueSubjectIds.length) {
      return res
        .status(404)
        .json({ message: 'One or more subjects not found' });
    }

    const updatePromises = attendance.map((record) => {
      const inc =
        record.status === 'present'
          ? { totalClasses: 1, attendedClasses: 1 }
          : { totalClasses: 1 };

      return Subject.findByIdAndUpdate(record.subjectId, { $inc: inc }, { new: true });
    });

    const updatedSubjects = await Promise.all(updatePromises);

    res.status(200).json({
      message: 'Attendance marked successfully',
      updatedSubjects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
