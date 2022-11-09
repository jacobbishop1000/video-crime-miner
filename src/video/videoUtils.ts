var ck = require('ckey')
var { RekognitionClient, StartFaceDetectionCommand, GetFaceDetectionCommand} = require("@aws-sdk/client-rekognition");

var region = ck.REGION
var accessKeyId = ck.AWS_ACCESS_KEY_ID
var secretAccessKey = ck.AWS_SECRET_ACCESS_KEY


var attributes = {
    region : region,
    credentials:{
        accessKeyId : accessKeyId,
        secretAccessKey : secretAccessKey
    }
}
const client  = new RekognitionClient(attributes);

async function startVideoFacesDetection(bucketName:string, videoName:string){
    try {
        var attributes = {
            Video: { 
               S3Object: { 
                  Name: videoName,
                  Bucket: bucketName,
               }
            }
         }
        // Returns jobId to get when it's finished by getVideoFacesDetectionOutput
        const command = new StartFaceDetectionCommand(attributes)
        const result = await client.send(command)
        console.log("jobId is: " + JSON.stringify(result.JobId))
        return result.JobId
	} catch (e) {
		console.log('error', e)
	}
}

// Gets the output based on jobId for face recognition
async function getVideoFacesDetectionOutput(id:string){
    try {
        const parameters = {
            JobId: id
        }
        const command = new GetFaceDetectionCommand(parameters)
        var finished = false
        while(!finished){
            var result = await client.send(command)
            if (result.JobStatus == "SUCCEEDED") {
                finished = true;
            }

        }
        console.log(result)
        return result
	} catch (e) {
		console.log('error', e)
	}
}

