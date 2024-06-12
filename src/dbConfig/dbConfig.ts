import mongoose from "mongoose";

let isConnected = false;

export async function connect(){
    if (isConnected) {
        return;
    }
    try{
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("MongoDB connected successfully");
        })

        connection.on('error', (err) => {
            console.log(`Connection error: ${err}`);
            console.log(err);
            process.exit();
        })

    } catch(error){
        console.log('some error');
        console.log(error);
    }
}