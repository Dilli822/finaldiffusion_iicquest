import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";

// const plans = [
//   {
//     id: "free",
//     title: "Free Plan",
//     price: "$0",
//     billing: "forever",
//     features: ["Basic access", "Limited storage", "Community support"],
//   },
//   {
//     id: "monthly",
//     title: "Monthly Plan",
//     price: "$9.99",
//     billing: "per month",
//     features: [
//       "Unlimited access",
//       "100 GB storage",
//       "Priority support",
//       "Cancel anytime",
//     ],
//   },
//   {
//     id: "yearly",
//     title: "Yearly Plan",
//     price: "$99.99",
//     billing: "per year",
//     features: [
//       "Unlimited access",
//       "1 TB storage",
//       "Priority support",
//       "2 months free",
//     ],
//   },
// ];

function Subscription({ onClose }) {
  // const handleSubscribe = (planId) => {
  //   alert(`Subscribed to ${planId} plan!`);
  //   onClose();
  // };

  const [plans, setPlans] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("");
  
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const fetchResponse = await axios.get(
          "http://localhost:8000/api/payment/get_subscription"
        );
        console.log("fetsched subscription plans-->", fetchResponse.data.data);
        const fetchedPlans = fetchResponse.data.data;

        fetchedPlans.sort((a, b) => a.price - b.price);

        console.log("Sorted subscription plans -->", fetchedPlans);
        setPlans(fetchedPlans);
      } catch (error) {
        console.log("error occured while fetching subscription plans", error);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    if (plans && plans.length > 0) {
      setSelectedPlan(plans[0].name);
    }
  }, [plans]);

  const handelPurchase = async (_id,price) => {
    console.log("id and price-->",_id,price)
    try {

      const frontendBaseUrl = "http://localhost:5173/";
      const backendBaseUrl = "http://localhost:8000";
      console.log("slectedplan details-->", _id, price);

      const purchaseResponse = await axios.post(
        "http://localhost:8000/api/payment/initialize-esewa",
        { itemId: _id, totalPrice: price }
      );

      const { success, payment } = purchaseResponse.data;
      if (!success) {
        throw new Error("Failed to initialize payment");
      }

      console.log("eSewa Payment Initialization:", payment);

      const paymentForm = {
        amount: payment.amount,
        tax_amount: payment.tax_amount,
        total_amount: payment.total_amount,
        transaction_uuid: payment.transaction_uuid,
        product_code: payment.product_code,
        product_service_charge: payment.product_service_charge,
        product_delivery_charge: payment.product_delivery_charge,
        success_url: `${backendBaseUrl}/api/payment/complete-esewa`,
        failure_url: `${frontendBaseUrl}`,
        signed_field_names: payment.signed_field_names,
        signature: payment.signature,
      };

      console.log("Submitting form with data:", paymentForm);

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      Object.entries(paymentForm).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.log("Error while making payment:", error);
    }
  };

  const getBorderAndBg = (planId) => {
    switch (planId) {
      case "free":
        return "border-green-500 bg-green-50";
      case "monthly":
        return "border-blue-500 bg-blue-50";
      case "yearly":
        return "border-purple-500 bg-purple-50";
      default:
        return "border-gray-200 bg-white";
    }
  };

  return (
    <div className="fixed inset-0 z-50  flex items-center justify-center bg-black/40 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 sm:px-8 py-4 sm:py-6 border-b">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-800">
            Choose Your Subscription
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-2xl sm:text-3xl font-light"
            aria-label="Close popup"
          >
            &times;
          </button>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
          {plans?.map((plan) => (
            <div
              key={plan.id}
              className={`transition-all duration-300 p-8 rounded-2xl shadow-md border-2 flex flex-col text-center cursor-default ${getBorderAndBg(
                plan.id
              )}`}
            >
              <h3 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-2 sm:mb-3">
                {plan.title}
              </h3>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                {plan.price}
              </p>
              <p className="text-gray-600 text-sm mb-4 sm:mb-6">
                / {plan.billing}
              </p>
              <ul className="text-gray-700 text-sm sm:text-base space-y-2 list-disc list-inside flex-grow mb-4 sm:mb-6 text-left">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <Button
                className="w-full mt-auto"
                // onClick={() => handleSubscribe(plan.id)}
                onClick={()=>handelPurchase(plan._id,plan.price)}
              >
                {plan.id === "free" ? "Get Started" : "Subscribe"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Subscription;
