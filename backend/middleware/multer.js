import multer from "multer";

const storage = multer.diskStorage({
    destination:(req, file,callback) =>{
        callback(null , "./public" )
    },

    filename : (req , filename , callback) =>{
        callback (null , filename.originalname)
    }
})

export const upload= multer({storage})