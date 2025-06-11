import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  features: [
    {
      type: String,
      required: true,
    },
  ],
});

export default mongoose.model("SubscriptionModel", subscriptionSchema);
