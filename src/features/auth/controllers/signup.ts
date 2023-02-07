import { IAuthDocument, ISignUpData } from "@auth/interfaces/auth.interface";
import { signupSchema } from "@auth/schemes/signup";
import { joiValidation } from "@global/decorators/joi-validation-decorators";
import { uploads } from "@global/helpers/cloudirairy-upload";
import { BadRequestError } from "@global/helpers/error-handler";
import { Helpers } from "@global/helpers/helpers";
import { authService } from "@service/db/auth.service";
import { UploadApiResponse } from "cloudinary";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import HTTP_STATUS from "http-status-codes";

export class SignUp {
  @joiValidation(signupSchema)
  public async create(req: Request, res: Response) {
    const { username, password, email, avatarColor, avatarImage } = req.body;
    const checkUserExists: IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);
    if (checkUserExists) {
      throw new BadRequestError("username or email already taken");
    }

    const authObjectId: ObjectId = new ObjectId();
    const userObjectId: ObjectId = new ObjectId();
    const uId = `${Helpers.generateRandomIntegers(12)}`;

    const authData: IAuthDocument = SignUp.prototype.signupDate({
      _id: authObjectId,
      uId,
      username,
      password,
      avatarColor,
      email
    });
    const result: UploadApiResponse = (await uploads({
      file: avatarImage,
      public_id: `${userObjectId}`,
      overwrite: true,
      invalidate: true
    })) as UploadApiResponse;

    if (!result.public_id) {
      throw new BadRequestError("File upload: Error occured, try again");
    }

    res.status(HTTP_STATUS.CREATED).json({ message: "user created", authData });
  }

  private signupDate(data: ISignUpData): IAuthDocument {
    const { _id, avatarColor, email, password, uId, username } = data;
    return {
      _id,
      uId,
      avatarColor,
      email: email.toLocaleLowerCase(),
      password,
      username: Helpers.firstLetterUpperCase(username),
      createdAt: new Date()
    } as IAuthDocument;
  }
}
