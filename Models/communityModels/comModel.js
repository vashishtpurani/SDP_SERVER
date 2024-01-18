const mongoose = require("mongoose");
const { Schema, model } = require('mongoose');

const replySchema = new Schema({
    uId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    content: String,
    upVote: [{
        type: Schema.Types.ObjectId,
        ref: "dataModel"
    }],
    downVote: [{
        type: Schema.Types.ObjectId,
        ref: "dataModel"
    }],
    createDate: {
        type: Date,
        default: Date.now
    },
    Replies: [this]  // This may not work as expected BUT IT DOES SO DO NOT CHANGE
});

replySchema.add({ Replies: [replySchema] });  //add() to define nested Replies

const comModelSchema = new Schema({
    users: {
        type: Schema.Types.ObjectId,
        required: true
    },
    query: {
        type: String,
        required: true
    },
    Classified: {
        type: String,
        required: true
    },
    Replies: [replySchema],
    upVote: [{
        type: Schema.Types.ObjectId,
        ref: "dataModel"
    }],
    downVote: [{
        type: Schema.Types.ObjectId,
        ref: "dataModel"
    }]
}, { timestamps: true });

const comModel = model('comModel', comModelSchema);

module.exports = { comModel };
