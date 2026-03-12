import React, { useEffect } from "react";

const InfoPage = ({ title, description }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="min-h-screen py-24 px-6 max-w-4xl mx-auto flex flex-col justify-center items-center text-center">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 uppercase" style={{ fontFamily: "editorial, cursive" }}>
        {title}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default InfoPage;
