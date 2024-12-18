const mongoose = require("mongoose");

const connection = async () => {
    try {
        const response = await mongoose.connect("mongodb+srv://kamyajindal15:KamyaJindal15@cluster0.lr0mu.mongodb.net/TickTide");
        if(response){
            console.log("Connected to DB");
        }
    } catch (error) {
        console.log(error);
    }
};

connection();