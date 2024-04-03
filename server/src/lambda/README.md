# Serverless - AWS Lambda Functions

This is a lambda function that runs everyday at a given time to check if the stories table has any image that was created before a week. If yes, then deletes the record from the database.

## This implementation is optional

You can either use this to upload it to AWS lambda to schedule cleanup of stories table everyday or choose not to. This is an optional implementation. If you do not want to pay for services you can skip this part.

## Setup

### Method 1 (Manual Upload):

-   Convert the folder which contains the root node_modules into ZIP folder.
-   This folder will after convertion must look like below:

```
//ROOT FOLDER
---> /node_modules
    -index.mjs
    -package.lock.json
    -package.json
    -README.md
```

-   This should be used directly in AWS lambda after creating a basic nodejs lambda function. The option to upload the ZIP folder will be then visible after function creation. Upload the zip folder. User will be then able to view the same folder structure in AWS lambda editor.
-   Configure environment variables in lambda for 2 parameters of DB_LINK and DB_KEY.
-   Create a TEST-EVENT to test the created AWS lambda function.
-   Click on TEST option and you should be able to view the response status 200, which means the function was manually run by user successfully.
-   Configure Amazon EventBridge to schedule this function for everyday at a certain time.

### Method 2 (S3 Upload):

-   Upload the zip folder created in method #1 to a new s3 bucket.
-   Select the option in lambda for "link s3 bucket".
-   The file tree will be visible to the user as expected.
-   Create a TEST-EVENT to test the created AWS lambda function.
-   Click on TEST option and you should be able to view the response status 200, which means the function was manually run by user successfully.
-   Configure Amazon EventBridge to schedule this function for everyday at a certain time.
