const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const budgetSchema = new Schema({
    categories: {
        type: [{
            name: {
                type: String,
                required: true
            },
            limit: {
                type: Number,
                required: true
            },
            spent: {
                type: Number,
                required: true
            }
        }],
        validate: [arrayLimit, '{PATH} must have exactly 4 categories']
    }
}, { timestamps: true });

function arrayLimit(val) {
    return val.length === 4;
}

module.exports = mongoose.model('budget', budgetSchema);