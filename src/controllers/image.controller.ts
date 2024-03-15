import { Request, Response } from 'express';
import { ImageModel } from '../models/image.model';
import fs from 'node:fs/promises';
import path from 'node:path';
import { IResponseStatus } from '../interfaces/response-status.interface';
import { ZodError } from 'zod';
import { imageIdSchema } from '../libs/image.schema';

export class ImageController {
  static readonly error400ImageCreate: IResponseStatus = { status: 400, message: '400 Bad Request | Image not created' };
  static readonly error400ImageDelete: IResponseStatus = { status: 400, message: '400 Bad Request | Image not deleted' };
  static readonly error400NotFound: IResponseStatus = { status: 400, message: '404 Not Found | Images not found' };
  static readonly error500: IResponseStatus = { status: 500, message: '500 Internal Server Error' };
  static readonly success200ImageCreate: IResponseStatus = { status: 200, message: '200 OK | Image created' };
  static readonly success200ImageDelete: IResponseStatus = { status: 200, message: '200 OK | Image deleted' };

  static async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const validation = imageIdSchema.parse({ id });
      const images = await ImageModel.getById({ id });
      if (images) return res.status(200).json(images);
      return res.status(404).json(ImageController.error400NotFound);
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).json({ status: 400, message: error.name + ' | Error on validation', error: error.issues });
      return res.status(500).json(ImageController.error500);
    }
  }

  static async create(req: Request, res: Response) {
    if (req.file) {
      const image = await ImageModel.create({ id: Number(req.params.id), name: req.file.filename });
      if (image.affectedRows < 1) return res.status(400).json(ImageController.error400ImageCreate);
      return res.status(200).json(ImageController.success200ImageCreate);
    } else {
        res.status(400).json(ImageController.error400ImageCreate);
    }
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const idValidation = imageIdSchema.parse({ id });
      const image = await ImageModel.getOne(id);
      const imagePath = path.resolve(`../room202/images/${image[0].name}`);
      const deletedImage = await ImageModel.delete({ id });
      if (deletedImage.affectedRows < 1) return res.status(400).json(ImageController.error400ImageDelete);
      if (deletedImage.affectedRows === 1) {
        await fs.unlink(imagePath);
      }
      return res.status(200).json(ImageController.success200ImageDelete);
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).json({ status: 400, message: error.name + ' | Error on validation', error: error.issues });
      return res.status(500).json(ImageController.error500);
    }
  }
}
