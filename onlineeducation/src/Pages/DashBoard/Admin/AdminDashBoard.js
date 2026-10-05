import Header from "./Componant/Header";
import React from "react";
import "../css/dashboard.css";
import Sidebar from "./Componant/Sidebar";
import Dashboard from "./Componant/Dashboard";


export default function () {

    return <>
        <div className={"ttr-opened-sidebar ttr-pinned-sidebar"}>
            <Header/>
            <Sidebar/>
            <Dashboard/>
        </div>
    </>
}