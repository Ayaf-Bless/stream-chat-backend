import { SignUp } from "@auth/controllers/signup";
import express, { Router } from "express";

class AuthRouts {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post("/sign-up", SignUp.prototype.create);

    return this.router;
  }
}

export const authRoutes = new AuthRouts();
