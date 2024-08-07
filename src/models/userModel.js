import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: [true, "Please provide an username"],
        unique: true,
    },
    email:{
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    isVerified: {
        type: Boolean,
        default:false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    balance: {
        type: Number,
        default: 50000,
    },
    invested: {
        type: Number,
        default: 0,
    },
    tradePositions: {
        type: [{
            symbol: String,
            quantity: Number,
            price: Number,
            takeProfitPrice: Number,
            stopLossPrice: Number,
            orderDate: {
                type: Date,
                default: Date.now
            }
        }],
        default: [],
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date, 

})

const User = mongoose.models.users || mongoose.model
("users", userSchema);

export default User;