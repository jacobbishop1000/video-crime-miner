var ck = require('ckey')
var S3 = require('aws-sdk/clients/s3')
var fs = require('fs')
var path = require('path')

/* Function Name: connect()
// Description: creates an s3 object instance to connect to AWS, needed to create and list buckets, 
// list objects and upload files to specific buckets.
*/
function connect() {
	var region = ck.AWS_BUCKET_REGION
	var accessKeyId = ck.AWS_ACCESS_KEY_ID
	var secretAccessKey = ck.AWS_SECRET_ACCESS_KEY

	const s3 = new S3({
		region,
		accessKeyId,
		secretAccessKey
	})

	return s3

}

/* Function Name: createBucket()
// Parameter: input bucket name, String value
// Description: given a name for a bucket, the function attempts to create the bucket via connect()
// returns the location of the bucket after response.
*/
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

/* Function Name: listBuckets()
// Description: returns list of buckets from our AWS Bucket region from
// connect() which returns an AWS s3 object containing said Bucket Region
// throws error if unsuccesful in reaching the server.
*/
async function listBuckets(){
	try {
		const response = await connect().listBuckets().promise()
		console.log("BUCKETS:")
		console.log(response.Buckets)
		return response.Buckets
		
	} catch (e) {

		console.log('error', e)
	}
 }

/* Function Name: listObjects(bucket)
// Parameters: name of bucket, value string
// Description: pass the name of a bucket to return a list of objects
// contained in the bucket
*/
async function listObjects(bucket:string) {

	try {
		const response = await connect().listObjectsV2({
		Bucket: bucket
		}).promise();
		console.log("Objects in bucket " + bucket + ":")
		console.log(response)
		return response
	
	} catch (e) {
		console.log('error' , e)
	}
}

/* Function Name: upload(bucket, file)
// Parameters: name of bucket, value String. name of file, value string.
// Description: pass the bucket and file names to the upload() function
// upload() then creates a fileStream that will throw an error if failing
// using the uploadParams object, adding a body defined as the file stream
// then the Key defined as the file path. using connect().upload() to send
// the uploadParams and the function recieves and returns  
// return a response. otherwise if failed it throws an error.
*/
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

// Testing code
// listObjects("video-crime-miner-video-test-bucket") // an example
// listBuckets() //another example
// If you're getting 403 errors on these two lines ^^^ then contact Jacob Bishop on Slack

export { connect, createBucket, listBuckets, listObjects, upload }