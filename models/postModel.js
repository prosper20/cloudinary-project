const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user_id: {
        type: String
    },
    caption: {
        type: String
    },
    images: [
        {
          public_id: {
            type: String,
            required: true,
          },
          secure_url: {
            type: String,
            required: true,
          },
        },
      ]
});

module.exports = mongoose.model('post', postSchema);