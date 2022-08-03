import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema()
export class History {
  @Prop({ type: MongooseSchema.Types.ObjectId })
  id: string;

  @Prop({ type: MongooseSchema.Types.Date, default: Date.now })
  date: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  symbol: string;

  @Prop({ type: Number })
  open: number;

  @Prop({ type: Number })
  high: number;

  @Prop({ type: Number })
  low: number;

  @Prop({ type: Number })
  close: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;
}

export type HistoryDocument = History & Document;

export const HistorySchema = SchemaFactory.createForClass(History);
