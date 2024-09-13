import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob'
import fs from 'fs'
import path from 'path'
import { CustomError, ServerError } from '../handlers/error'
import dotenv from 'dotenv'

dotenv.config()

const accountName = process.env.AZURE_ACCOUNT_NAME
const accountKey = process.env.AZURE_ACCOUNT_KEY
const containerName = process.env.AZURE_CONTAINER_NAME

class UploadFilesToBucket {
  private sharedKeyCredential: StorageSharedKeyCredential
  private blobServiceClient: BlobServiceClient
  constructor() {
    this.sharedKeyCredential = new StorageSharedKeyCredential(
      accountName!,
      accountKey!
    )
    this.blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      this.sharedKeyCredential
    )
  }
  async uploadFiles(
    filePath: string
  ): Promise<{ fileUrl: string | null; UploadError: CustomError | null }> {
    let UploadError: CustomError | null = null
    let fileUrl: string | null = null

    try {
      const containerClient = this.blobServiceClient.getContainerClient(
        containerName!
      )
      await containerClient.createIfNotExists()

      const blobName = `${Date.now()}-${path.basename(filePath)}`
      const blockBlobClient = containerClient.getBlockBlobClient(blobName)

      const fileStream = fs.createReadStream(filePath)
      const uploadResponse = await blockBlobClient.uploadStream(fileStream)

      if (uploadResponse._response.status !== 201) {
        UploadError = new ServerError('Error uploading file')
        throw UploadError
      }

      console.log(`Upload completed: ${uploadResponse.requestId}`)
      fileUrl = blockBlobClient.url
    } catch (error) {
      console.error('Error uploading file: ', error)
      UploadError = UploadError || new ServerError('Unknown error occurred')
    }

    return { fileUrl, UploadError }
  }
}

export default UploadFilesToBucket
