// payment.controller.js
import paymentModel from "../models/paymentModel.js";
import purchasedItemModel from "../models/purchasedItemModel.js";
import subscriptionModel from "../models/subscriptionModel.js";
import { getEsewaPaymentHash, verifyEsewaPayment } from "../utils/payment.js";

export const initilizeEsewaHandler = async (req, res) => {
  try {
    const { itemId, totalPrice } = req.body;

    const subscriptionData = await subscriptionModel.findOne({
      _id: itemId,
      price: Number(totalPrice),
    });

    if (!subscriptionData) {
      return res.status(400).send({
        success: false,
        message: "Item not found or price mismatch.",
      });
    }

    const purchasedItemData = await purchasedItemModel.create({
      item: itemId,
      paymentMethod: "esewa",
      totalPrice: totalPrice,
    });

    const paymentInitiate = await getEsewaPaymentHash({
      amount: totalPrice,
      transaction_uuid: purchasedItemData._id,
    });

    console.log("Payment initiate data:", paymentInitiate);

    res.json({
      success: true,
      payment: paymentInitiate,
      purchasedItemData,
    });
  } catch (error) {
    console.log("Error while initializing esewa-->", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const completePaymentHandler = async (req, res) => {
  const { data } = req.query;

  try {
    const paymentInfo = await verifyEsewaPayment(data);

    const purchasedItemData = await purchasedItemModel.findById(
      paymentInfo.response.transaction_uuid
    );

    if (!purchasedItemData) {
      return res.status(500).json({
        success: false,
        message: "Purchase not found",
      });
    }

    const paymentData = await paymentModel.create({
      pidx: paymentInfo.decodedData.transaction_code,
      transactionId: paymentInfo.decodedData.transaction_code,
      productId: paymentInfo.response.transaction_uuid,
      amount: purchasedItemData.totalPrice,
      dataFromVerificationReq: paymentInfo,
      apiQueryFromUser: req.query,
      paymentGateway: "esewa",
      status: "success",
    });

    await purchasedItemModel.findByIdAndUpdate(
      paymentInfo.response.transaction_uuid,
      { $set: { status: "completed" } }
    );

    return res.redirect(`http://localhost:5173`);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during payment verification",
      error: error.message,
    });
  }
};
