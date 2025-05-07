const mongoose = require('mongoose');
const timestamps = require("mongoose-timestamps");
const { listingSchema } = require('../schema');
const Schema = mongoose.Schema;

const Review = require("./Review");
const User = require("./User");

const ListingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: { type: String },
    image: {
        url : String,
        filename : String
    },
    price: {
        type: Number
    },
    location: { type: String },
    country: { type: String },

    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    },],
    owner : {
        type : Schema.Types.ObjectId,
        ref:"User",
    },

    createdAt: Date,
    updatedAt: Date,
})




ListingSchema.plugin(timestamps, { index: true });
ListingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})
module.exports = mongoose.model('Listing', ListingSchema);