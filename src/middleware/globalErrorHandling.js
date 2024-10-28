// import { deleteCloudImage } from "../utils/cloud.js"
// import { deleteFile } from "../utils/file.js"

export const globalErrorHandling = async (err, req, res, next) => {
    // file system rollback
    if(req.file) {
        deleteFile(req.file.path)
    }
    return res.status(err.statusCode || 500).json({message: err.message, success: false, error: err.stack})
}