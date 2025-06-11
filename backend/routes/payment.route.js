import experess from "express";
import { completePaymentHandler, initilizeEsewaHandler } from "../controllers/payment.controller.js";


const paymentRoutes = experess.Router();

paymentRoutes.post("/initialize-esewa", initilizeEsewaHandler);
paymentRoutes.get("/complete-esewa", completePaymentHandler);

export default paymentRoutes;
