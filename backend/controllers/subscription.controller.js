import subscriptionModel from "../models/subscriptionModel.js";

export const addSubscriptionPlan = async (req, res) => {
  try {
    const { name, price, features } = req.body;
    if (!name || !price || !features) throw new Error("All fields are required");
    const createPlanResponse = await subscriptionModel.create({
      name:name.charAt(0).toUpperCase() + name.slice(1),
      price,
      features,
    });

    if (!createPlanResponse) {
      throw new Error(
        "Interna; serval error , Unable to create a Subscription Plan"
      );
    }
    return res.status(200).json({
      success: true,
      message: "Subscription Plan created Successfully",
    });
  } catch (error) {
    console.log("Error while creating subscription plan", error);
    return res.status(400).json({
      success: false,
      message: "Error while creating subscription plan",
      error: error,
    });
  }
};

export const removeSubscriptionPlan = async (req, res) => {
  try {
    const { planId } = req.body;
    if (!planId) throw new Error("Plan ID is required");
    const doesPlanExists = await subscriptionModel.findById(planId);
    if (!doesPlanExists) {
      throw new Error("invalid Subscription Plan ID");
    }
    const deletePlanResponse = await subscriptionModel.findByIdAndDelete(
      planId
    );

    if (!deletePlanResponse) {
      throw new Error(
        "Interna; serval error , Unable to delete a Subscription Plan"
      );
    }
    return res.status(200).json({
      success: true,
      message: "Subscription Plan deleted Successfully",
    });
  } catch (error) {
    console.log("Error while deleting subscription plan", error);
    return res.status(400).json({
      success: false,
      message: "Error while deleting subscription plan",
      error: error,
    });
  }
};


export const fetchSubscriptionPlan = async (req, res) => {
  try {
   const plans=await subscriptionModel.find().sort({ price: 1 });
   if(!plans) throw new Error("Error occured while fetching subscription plans")
    return res.status(200).json({
      success: true,
      message: "Subscription Plan fetched Successfully",
      data:plans
    });
  } catch (error) {
    console.log("Error while fetching subscription plan", error);
    return res.status(400).json({
      success: false,
      message: "Error while fetching subscription plan",
      error: error,
    });
  }
};