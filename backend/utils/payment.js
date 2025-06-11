import axios from "axios";
import crypto from "crypto";

export function getEsewaPaymentHash({ amount, transaction_uuid }) {
  const secretKey = process.env.ESEWA_SECRET_KEY; // Use environment variable
  
  const signedFields = "total_amount,transaction_uuid,product_code";
  
  const data = {
    total_amount: Number(amount).toFixed(2),
    transaction_uuid,
    product_code: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST"
  };

  const stringToSign = signedFields
    .split(',')
    .map(field => `${field}=${data[field]}`)
    .join(',');

  console.log("String to sign:", stringToSign);

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(stringToSign)
    .digest("base64");

  return {
    total_amount: data.total_amount,
    transaction_uuid: data.transaction_uuid,
    product_code: data.product_code,
    product_service_charge: "0.00",
    product_delivery_charge: "0.00",
    tax_amount: "0.00",
    amount: data.total_amount,
    signed_field_names: signedFields,
    signature,
  };
}

export const verifyEsewaPayment = async (encodedData) => {
  try {
    const decodedData = JSON.parse(atob(encodedData));
    const secretKey = process.env.ESEWA_SECRET_KEY;

    const signedFieldNames = decodedData.signed_field_names.split(',');
    const dataToSign = signedFieldNames
      .map(field => `${field}=${decodedData[field]}`)
      .join(',');

    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(dataToSign)
      .digest("base64");

    console.log("Verification Signed Fields:", dataToSign);
    console.log("Verification Signature:", hash);
    console.log("Received Signature:", decodedData.signature);

    if (hash !== decodedData.signature) {
      throw new Error("Invalid signature");
    }

    const reqOptions = {
      url: `${process.env.ESEWA_GATEWAY_URL}/api/epay/transaction/status/?product_code=${process.env.ESEWA_PRODUCT_CODE}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const response = await axios.request(reqOptions);
    if (
      response.data.status !== "COMPLETE" ||
      response.data.transaction_uuid !== decodedData.transaction_uuid ||
      Number(response.data.total_amount) !== Number(decodedData.total_amount)
    ) {
      throw new Error("Invalid transaction details");
    }

    return { response: response.data, decodedData };
  } catch (error) {
    throw error;
  }
};

