import { SignUp } from "@auth/controllers/signup";
import express, { Router } from "express";

class AuthRoute {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public route(): Router {
    this.router.post("/signup", SignUp.prototype.create);

    return this.router;
  }
}

export const authRoutes = new AuthRoute();
