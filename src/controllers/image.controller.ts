import { Request, Response } from 'express';
import { ImageModel } from '../models/image.model';

export class ImageController {
  static async getById(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const images = await ImageModel.getById({ id });
    if (images) return res.status(200).json(images);
    return res.status(404).json({ message: '404 Bad Request | Images not found' });
  }

  static async create(req: Request, res: Response) {
    if(req.file) {
      const image = await ImageModel.create({ id: Number(req.params.id), name: req.file.filename });
      if(image[0].affectedRows < 1) return res.status(400).json({ status: 400, message: '400 Bad Request | Image not created' });
      return res.json({ status: 200, message: '200 OK | Image created' });
    }
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const deletedImage = await ImageModel.delete({ id });
    if(deletedImage.affectedRows < 1) return res.status(400).json({ status: 400, message: '400 Bad Request | Image not deleted' });
    return res.status(200).json({ status: 200,message: '200 OK | Image deleted' });
  }
}
