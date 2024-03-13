const mongoose = require('mongoose');
const { Schema } = mongoose;

const ConversationSchema = new Schema({
    userIds:
        [{
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: 'user'
        }],
    lastmessage:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message',
        // required: true
    }

}, { timestamps: true })

const ConversationModel = mongoose.model('conversation', ConversationSchema)
ConversationModel.createIndexes();

module.exports = ConversationModel;