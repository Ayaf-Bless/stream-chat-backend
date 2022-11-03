import { IAuthDocument } from "@auth/interfaces/auth.interface";
import { AuthModel } from "@auth/models/auth.schema";
import { Helper } from "@global/helpers/helpers";

class AuthService {
  public async getUserByUsernameOrByEmail(username: string, email: string): Promise<IAuthDocument> {
    const query = {
      $or: [
        {
          username: Helper.firstLetterUpper(username)
        },
        {
          email: Helper.lower(email)
        }
      ]
    };
    const user: IAuthDocument = (await AuthModel.findOne(query).exec()) as IAuthDocument;
    return user;
  }
}

export const authService: AuthService = new AuthService();
