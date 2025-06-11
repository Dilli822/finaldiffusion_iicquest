import express from 'express';
import { addSubscriptionPlan, fetchSubscriptionPlan, removeSubscriptionPlan } from '../controllers/subscription.controller.js';

const subscriptionRouter=express.Router();

subscriptionRouter.post('/create_subscription',addSubscriptionPlan)
subscriptionRouter.post('/delete_subscription',removeSubscriptionPlan)
subscriptionRouter.get('/get_subscription',fetchSubscriptionPlan)

export default subscriptionRouter;