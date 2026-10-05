export const loadRazorpay = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        script.onload = () => {
            console.log("✅ Razorpay SDK loaded");
            resolve(true);
        };

        script.onerror = () => {
            console.error("❌ Razorpay SDK failed to load");
            resolve(false);
        };

        document.body.appendChild(script);
    });
};
export const handlePayment = async (amount,successPayment) => {
    const loaded = await loadRazorpay();

    if (!loaded) {
        alert("Razorpay SDK failed to load");
        return;
    }

    const options = {
        key: "rzp_test_RBa0tSCQ5MtVL5", // TEST KEY
        amount: amount*100, // ₹500 (paise)
        currency: "INR",
        name: "OnlineLearning",
        description: "Frontend Script Loader Payment",

        handler: function (response) {
            console.log("✅ Payment Success");
            console.log("Payment ID:", response.razorpay_payment_id);
            successPayment(response.razorpay_payment_id);
        },

        prefill: {
            name: "Nayan Bhutada",
            email: "nayanbhutada20@gmail.com",
            contact: "8010958863",
        },

        theme: {
            color: "#0d6efd",
        },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
};
