import React from 'react';

const SessionHeader = ({ steps, currentStep }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="relative flex items-center justify-between gap-4 sm:gap-6 lg:gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 flex flex-col items-center text-xs sm:text-sm">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 z-10
                ${index === currentStep ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-300'}`}
            >
              {index + 1}
            </div>
            <span
              className={`mt-2 text-center ${index === currentStep ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}
            >
              {step}
            </span>
          </div>
        ))}

        {/* Progress Line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-300 z-0">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SessionHeader;
