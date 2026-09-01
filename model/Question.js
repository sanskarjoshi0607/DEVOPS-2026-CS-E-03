const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: {
    type: [String],
    validate: {
      validator: function (arr) {
        return arr.length >= 2;
      },
      message: 'A question must have at least 2 options'
    },
    required: true
  },
  correctAnswerIndex: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    validate: {
      validator: function (value) {
        return value >= 0 && value < this.options.length;
      },
      message: 'correctAnswerIndex must be a valid index into options'
    }
  }
});

// Exported both as a schema (for embedding in Quiz) and as a model
// in case standalone question documents are ever needed.
module.exports = mongoose.model('Question', questionSchema);
module.exports.questionSchema = questionSchema;
