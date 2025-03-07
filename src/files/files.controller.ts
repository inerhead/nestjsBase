import {
  BadRequestException,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileFilterGao } from './helper/filter.files';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
// import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Post('product')
  @UseInterceptors(
    FilesInterceptor('file', 5, {
      fileFilter: fileFilterGao,
      limits: { fileSize: 1024 * 1024 * 6 },
      /*storage: diskStorage({
        destination: './static/uploads',
        filename: (req, file, callBack) => {
          const fileName = `${uuidv4()}.png`;
          return callBack(null, fileName);
        },
      }),*/
    }),
  )
  async uploadProductFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('MAke sure that the file(s) is an image');
    }
    console.log('uploadProductFiles', files);
    const insertPromises = [];
    files.forEach(async (file) => {
      insertPromises.push(this.uploadFileToAzure(file, 'fotos'));
      // Name should be like = conjuntoResidencial-bloque-apto-uuid.jpg
      // const url = await this.uploadFileToAzure(file, 'fotos');
      // console.log('url', url);
    });
    const urls = await Promise.all(insertPromises);
    return { urls: urls };
  }

  private containerName: string;

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (err) => reject(err));
    });
  }

  private async getBlobServiceInstance() {
    const connectionString = this.configService.get(
      'AZURE_STORAGE_CONNECTION_STRING',
    );
    const blobClientService =
      await BlobServiceClient.fromConnectionString(connectionString);
    return blobClientService;
  }

  private async getBlobClient(imageName: string): Promise<BlockBlobClient> {
    const blobService = await this.getBlobServiceInstance();
    const containerName = this.containerName;
    const containerClient = blobService.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(imageName);

    return blockBlobClient;
  }

  public async uploadFileToAzure(
    file: Express.Multer.File,
    containerName: string,
  ) {
    this.containerName = containerName;
    // const buffer = await this.streamToBuffer(file.stream);
    const extension = file.originalname.split('.').pop();
    const file_name = uuidv4() + '.' + extension;
    const blockBlobClient = await this.getBlobClient(file_name);
    const fileUrl = blockBlobClient.url;
    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    return fileUrl;
  }
}
