import LeftSide from "../../Componats/LogIn/LeftSide";
import React, {useState} from "react";
import {Link} from "react-router-dom";
import {ForgotPassword} from "../../Model/Auth";

export default function () {

    const [email,setEmail]=useState();

    async function forgotpass() {

       await  ForgotPassword(email);
    }

    return <>
        <div className="account-form">
            <LeftSide/>
            <div className="account-form-inner">
                <div className="account-container">
                    <div className="heading-bx left">
                        <h2 className="title-head">Forget <span>Password</span></h2>
                        <p>Login Your Account <Link to={"/SignIn"}>Click here</Link></p>

                    </div>
                    <div className="contact-bx">
                        <div className="row placeani">
                            <div className="col-lg-12">
                                <div className="form-group">
                                    <div className="input-group">
                                        <input value={email} onChange={(e)=>setEmail(e.target.value)} name="dzName" type="email" required="" placeholder={"Your Email Address"} className="form-control"/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 m-b30">
                                <button onClick={forgotpass} name="submit" type="submit" value="Submit" className="btn button-md">Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </>
}