import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    totalClasses: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    attendedClasses: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.totalClasses;
        },
        message: 'Attended classes cannot be greater than total classes',
      },
    },
  },
  {
    timestamps: true,
  }
);

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;

