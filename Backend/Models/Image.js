const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    image: {
        data: Buffer,
        contentType: String,
        required: true
    }
}, { timestamps: true });

const ImageModel = mongoose.model('image', ImageSchema);

module.exports = ImageModel;