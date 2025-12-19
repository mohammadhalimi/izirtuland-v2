import { Router } from "express";
import {
  startPayment,
  paymentCallback,
} from "../controllers/paymentController";

const router = Router();

router.post("/start", startPayment);
// router.get("/verify", paymentCallback);
router.get("/callback", paymentCallback);
export default router;
