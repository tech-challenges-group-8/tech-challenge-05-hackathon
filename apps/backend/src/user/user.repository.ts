import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserDocumentType } from './user.schema';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocumentType>
  ) {}

  private toRecord(doc: UserDocumentType): UserRecord {
    return {
      id: doc.id,
      name: doc.name,
      email: doc.email,
      password: doc.password,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findById(id: string): Promise<UserRecord | null> {
    const doc = await this.userModel.findById(id).exec();
    return doc ? this.toRecord(doc) : null;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const doc = await this.userModel
      .findOne({ email: email.toLowerCase() })
      .exec();
    return doc ? this.toRecord(doc) : null;
  }

  async findAll(): Promise<UserRecord[]> {
    const docs = await this.userModel.find().exec();
    return docs.map((doc) => this.toRecord(doc));
  }

  async create(input: {
    name: string;
    email: string;
    password: string;
  }): Promise<UserRecord> {
    const doc = await this.userModel.create({
      name: input.name,
      email: input.email.toLowerCase(),
      password: input.password,
    });
    return this.toRecord(doc);
  }

  async update(
    id: string,
    update: Partial<{ name: string; email: string; password: string }>
  ): Promise<UserRecord | null> {
    const normalizedUpdate = { ...update };
    if (normalizedUpdate.email) {
      normalizedUpdate.email = normalizedUpdate.email.toLowerCase();
    }

    const doc = await this.userModel
      .findByIdAndUpdate(id, { $set: normalizedUpdate }, { new: true })
      .exec();

    return doc ? this.toRecord(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }
}
