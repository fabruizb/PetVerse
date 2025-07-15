import React from 'react';

const AppointmentCard = ({ type, title, subtitle, date, time }) => {

    const renderIcon = (appointmentType) => {
        switch (appointmentType) {
            case 'checkup':
                return (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                );
            case 'grooming':
                return (
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 8V5c0-1.1.9-2 2-2h2a2 2 0 012 2v3m-4 0v3m-4-3v3m4-3h.01M16 16h.01M21 12h-8l-2 5.5L7 12H3"></path>
                    </svg>
                );
            default:
                return (
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                );
        }
    };

    return (
        <div className="flex items-center bg-white rounded-lg p-4 shadow-sm">
            <div className="flex-shrink-0 mr-4">
                {renderIcon(type)}
            </div>
            <div className="flex-grow">
                <p className="font-semibold text-gray-800">{title}</p>
                <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
            <div className="flex-shrink-0 text-right">
                <p className="font-medium text-gray-700">{date}</p>
                <p className="text-sm text-gray-500">{time}</p>
            </div>
        </div>
    );
};

export default AppointmentCard;