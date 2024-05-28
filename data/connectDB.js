import mongoose from "mongoose";


function connectMongodb(stringConnect) {
    return new Promise((resolve, reject) => {
        mongoose.connect(stringConnect)
        .then(() => resolve({message : "connect success",error : null}))
        .catch((err) => reject({message : "connect error",error : err}))
    })
}


export default connectMongodb