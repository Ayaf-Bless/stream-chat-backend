import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { joiValidation } from "@global/decorators/joi-validation.decorators";
import { signupSchema } from "@auth/schemes/signup";
import { IAuthDocument, ISignUpData } from "@auth/interfaces/auth.interface";
import { authService } from "@service/db/auth.service";
import { BadRequestError } from "@global/helpers/error-handler";
import { Helper } from "@global/helpers/helpers";
import { UploadApiResponse } from "cloudinary";
import { uploads } from "@global/helpers/cloudirairy-upload";

export class SignUp {
  @joiValidation(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage } = req.body;

    const doesUserExist: IAuthDocument = await authService.getUserByUsernameOrByEmail(username, email);

    if (doesUserExist) {
      throw new BadRequestError("Invalid credentials");
    }
    const authObjectId: ObjectId = new ObjectId();
    const userObjectId: ObjectId = new ObjectId();
    const uId = `${Helper.generateRandomIntegers(12)}`;

    const authData: IAuthDocument = SignUp.prototype.asignupData({
      _id: authObjectId,
      uId,
      username,
      password,
      avatarColor,
      email
    });

    const result: UploadApiResponse = (await uploads({
      file: avatarImage,
      invalidate: true,
      public_id: `${userObjectId}`,
      overwrite: true
    })) as UploadApiResponse;

    if (!result.public_id) {
      throw new BadRequestError("File upload: Error occurred, try again later");
    }
  }

  private asignupData(data: ISignUpData): IAuthDocument {
    const { _id, username, email, uId, password, avatarColor } = data;

    return {
      _id,
      uId,
      username: Helper.firstLetterUpper(username),
      email: Helper.lower(email),
      password,
      avatarColor,
      createdAt: new Date()
    } as IAuthDocument;
  }
}
