import React from "react";
import {loadRazorpay} from "./loader";


export default function RazorpayPayment() {



    function Pay() {
        handlePayment(4500, function (payId) {
            //store studentID,amount,courseId,transactionId
            alert(payId);
        }).then(r =>{})
    }

    return (
        <button onClick={Pay}>
            Pay ₹500
        </button>
    );
}
