import React, { useState, useEffect } from 'react';
import BatchCalendar from "./BatchTime";
import Header from "../Header";
import Sidebar from "../Sidebar";
import BatchCalendarWithFullCalendar from "./BatchCalendarWithFullCalendar";

const CalendarWithTimeSlots = () => {

    return (
        <div className="ttr-opened-sidebar ttr-pinned-sidebar">
            <Header />
            <Sidebar />

            <main className="ttr-wrapper">
                <div className="container-fluid">
                    <div className="db-breadcrumb">
                        <h4 className="breadcrumb-title">Batch Time</h4>

                    </div>

                 <div>
                     <BatchCalendarWithFullCalendar/>

                 </div>

                </div>
            </main>

        </div>

    );
};

export default CalendarWithTimeSlots;