// Angular-Video Connector Module

// TODO: Figure out how to connect this to the frontend

var s3 = require("./s3Connector.js")

/* Function Name: UploadVideoOrImage()
// Parameters: form, data type any
// Descriptions: input file of either video or image type, in which the function will send to the upload() function
// set to upload the file with the instruction to be added to the video-crime-miner-video-test-bucket
*/ 
function UploadVideoOrImage(form:any){
    // get file path
    try{
        console.log(form)
        s3.upload("video-crime-miner-video-test-bucket", form).then((response: any) => {
            console.log(response)
        })
    } catch (error){
        console.log(error)
    }
    // call upload in S3Connector with that file path

}
