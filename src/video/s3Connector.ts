require("dotenv").config()
const S3 = require('aws-sdk/clients/s3')
const fs = require('fs')
const path = require('path')

  function connect() {
	const region = process.env.AWS_BUCKET_REGION
	const accessKeyId = process.env.AWS_ACCESS_KEY
	const secretAccessKey = process.env.AWS_SECRET_KEY

	const s3 = new S3({
		region,
		accessKeyId,
		secretAccessKey
	})

	return s3

}

async function createBucket(bucketName: string) {
	/**
	 * Bucket name must be globally unique and must not contain spaces or uppercase letters.
	 * see rules for naming buckets: https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html
	 */
	try {
		const response = await connect().createBucket({
			Bucket: bucketName
		}).promise()
		return response.Location

	} catch (e) {
		console.log('error', e)
	}
}


 async function listBuckets(){
	try {
		const response = await connect().listBuckets().promise()
		return response.Buckets
		
	} catch (e) {

		console.log('error', e)
	}
 }

 async function listObjects(bucket:string) {

	try {
		const response = await connect().listObjectsV2({
		Bucket: bucket
		}).promise();
	
		return response
	
	} catch (e) {
		console.log('error' , e)
	}
}


 async function upload(bucket:string, file:string) {
	var uploadParams = {Bucket: bucket, Key: "", Body:""}
	var fileStream = fs.createReadStream(file);

	try {
		fileStream.on('error', function(err:any) {
		console.log('File Error', err);
		});

		uploadParams.Body = fileStream
		uploadParams.Key = path.basename(file)

		const response = await connect().upload(uploadParams, function(data:any) {
			console.log("Upload Success", data.Location)
		}).promise()

		return response.Location

	} catch (error) {
		console.log('error', error)
	}
	
 }


export {listBuckets, listObjects, upload, connect, createBucket}
