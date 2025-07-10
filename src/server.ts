import { Server } from "http"
import mongoose from "mongoose"
import app from "./app"

let server : Server

const port=5000

const startServer=async()=>{
   try {
     await mongoose.connect("mongodb+srv://mongoose:yGUZ.gTgW9mHcx7@cluster0.hblj92w.mongodb.net/Tour-Management?retryWrites=true&w=majority&appName=Cluster0")
    console.log('connect');
    
    server =app.listen(port,()=>{
        console.log('server is listening to port 5000');
        
    })
   } catch (error) {
     console.log(error);
   }
}

startServer()
