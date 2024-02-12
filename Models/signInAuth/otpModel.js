const { Schema, model } = require('mongoose');

const otpSchema = new Schema(
    {
        number: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: false },
    }
);

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const Otp = model('otp', otpSchema);

module.exports = { Otp };
