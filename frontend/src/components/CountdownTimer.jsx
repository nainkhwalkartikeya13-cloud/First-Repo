import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                D: Math.floor(difference / (1000 * 60 * 60 * 24)),
                H: Math.floor((difference / (1000 * 60 * 60)) % 24),
                M: Math.floor((difference / 1000 / 60) % 60),
                S: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const TimeUnit = ({ label, value }) => (
        <div className="flex flex-col items-center">
            <div className="bg-[#212A2C] text-white w-12 h-14 md:w-16 md:h-20 flex items-center justify-center text-xl md:text-3xl font-serif rounded-sm mb-2 shadow-lg">
                {String(value).padStart(2, '0')}
            </div>
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#767676]">
                {label}
            </span>
        </div>
    );

    const timerComponents = Object.keys(timeLeft).map((interval) => {
        if (!timeLeft[interval] && interval !== 'S') {
            return null;
        }

        return <TimeUnit key={interval} label={interval} value={timeLeft[interval]} />;
    });

    return (
        <div className="flex items-center gap-2 md:gap-4">
            {timerComponents.length ? timerComponents : (
                <span className="text-red-500 font-bold uppercase tracking-widest text-sm">Offer Expired</span>
            )}
        </div>
    );
};

export default CountdownTimer;
