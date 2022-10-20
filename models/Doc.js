const mongoose = require('mongoose');

const DocSchema = new mongoose.Schema(
  {
    
    documentType: {
      
      type: String,
      max: 20,
    },
    documentDesc: {
      type: String,
    },
    docUrl: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doc', DocSchema);
