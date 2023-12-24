'use strict'

const { Schema } = require('mongoose');
const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME='Shop'
const COLLECTION_NAME = 'Shops'
const RoleShop = {
    GUEST: '000',
    SHOP: '01',
    ADMIN: '00'
}
// Declare the Schema of the Mongo model
var shopSchema = new mongoose.Schema({
    name:{
        type:String,
        maxLength: 150,
        trim: true
    },
    description:{
        type:String
    },
    email:{
        type:String,
        trim: true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum: ['active',  'inactive'],
        default: 'inactive'
    },
    verify:{
        type: Schema.Types.Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true
    },    
    identification: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "https://archive.org/download/discordprofilepictures/discordyellow.png"
    },
    address: {
        type: String,
        required: true
    },
    roles:{
        type:Array,
        default: []
    },
    follower: {
        type: Array,
        default: []
    },
    numFollow: {
        type: Number,
        default: 0
    }
},{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, shopSchema);