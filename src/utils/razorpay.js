// src/utils/razorpay.js

// Dynamically load Razorpay script (frontend demo only)
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.querySelector("#razorpay-script")) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Frontend-only demo of Razorpay checkout.
 * In a REAL app you must:
 *  - Create an order on your backend
 *  - Use your real key_id from environment variables
 */
export const openRazorpayCheckout = async ({
  amountInRupees,
  user,
  onSuccess,
  onFailure,
}) => {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    alert("Failed to load Razorpay. Check your network.");
    onFailure && onFailure();
    return;
  }

  const options = {
    key: "https://checkout.razorpay.com/v1/checkout.js", // TODO: replace with your Razorpay key_id (public)
    amount: amountInRupees * 100, // rupees -> paise
    currency: "INR",
    name: "ThriftHub",
    description: "Thrift order payment (No returns / exchange)",
    image:
      "https://images.pexels.com/photos/6159954/pexels-photo-6159954.jpeg?auto=compress&cs=tinysrgb&w=200",
    handler: function (response) {
      console.log("Razorpay success:", response);
      onSuccess && onSuccess(response);
    },
    prefill: {
      name: user?.name || user?.storeName || "",
      email: user?.email || "",
      contact: user?.phone || "",
    },
    notes: {
      platform_fee_note: "Rs. 50 per delivery included. No return / exchange.",
    },
    theme: {
      color: "#7C3AED",
    },
    retry: {
      enabled: false,
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.on("payment.failed", function (response) {
    console.log("Razorpay failed:", response);
    onFailure && onFailure(response);
  });
  rzp.open();
};
