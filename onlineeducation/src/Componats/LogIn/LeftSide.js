import { Link } from "react-router-dom";
import React from "react";

export default function () {

    return <>

        <div className="account-head" style={{ backgroundImage: "url('/assets/images/background/bg2.jpg')" }}>
            <Link to={"/"}><img src="assets/images/logo-white-2.png" alt=""/></Link>
        </div>

    </>
}