import React from "react";
import "../css/dashboard.css";

import Dashboard from "./Dashboard";
import Sidebar from "./SideBar/Sidebar";

import Header from "./Header/Header";


export default function () {

    return <>
        <div className={"ttr-opened-sidebar ttr-pinned-sidebar"}>
            <Header/>
            <Sidebar/>
            <Dashboard/>
        </div>
    </>
}