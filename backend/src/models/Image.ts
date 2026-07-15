import { Document, model, Schema, Types } from 'mongoose';

export interface IImage extends Document {
  userId: Types.ObjectId;
  imageUrl: string;
  publicId: string;
  title: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<IImage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const ImageModel = model<IImage>('Image', ImageSchema);
