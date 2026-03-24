import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const steps = [
    {
        title: "Welcome to CMS Platform",
        description: "We're excited to have you on board! Let's take a quick tour to help you get started with your new digital workspace.",
        image: "M13 10V3L4 14h7v7l9-11h-7z", // Lightning bolt
        color: "text-primary"
    },
    {
        title: "Your Personalized Dashboard",
        description: "Everything you need is right here. View your daily tasks, track key metrics, and stay updated with live notifications tailored just for your sector.",
        image: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
        color: "text-accent"
    },
    {
        title: "Stay Connected",
        description: "Use the bell icon in the top right to check your notifications. We'll alert you about important updates, messages, and task deadlines.",
        image: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
        color: "text-warning"
    }
];

const UserOnboardingModal = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (!user) return;
        
        // Check if user has seen onboarding
        const hasSeen = localStorage.getItem(`onboarding_complete_${user.id}`);
        if (!hasSeen && user.role === 'USER') {
            // Add a small delay so it doesn't pop up instantly on first paint
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [user]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        if (user) {
            localStorage.setItem(`onboarding_complete_${user.id}`, 'true');
        }
    };

    if (!isOpen) return null;

    const stepInfo = steps[currentStep];

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle bg-base-300/60 backdrop-blur-sm z-[100]">
            <div className="modal-box p-0 overflow-hidden max-w-lg relative animate-fade-in-up">
                
                {/* Decorative header graphic */}
                <div className="h-32 bg-base-200 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary via-base-200 to-base-200"></div>
                    <div className={`w-16 h-16 rounded-full bg-base-100 shadow-xl flex items-center justify-center z-10 ${stepInfo.color}`}>
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stepInfo.image} />
                        </svg>
                    </div>
                </div>
                
                {/* Content */}
                <div className="p-8 text-center">
                    <h3 className="font-bold text-2xl mb-4">{stepInfo.title}</h3>
                    <p className="text-base-content/70 leading-relaxed min-h-[5rem]">
                        {stepInfo.description}
                    </p>
                    
                    {/* Progress dots */}
                    <div className="flex justify-center gap-2 my-8">
                        {steps.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`h-2 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-8 bg-primary' : 'w-2 bg-base-300'}`}
                            ></div>
                        ))}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-between items-center">
                        <button 
                            className="btn btn-ghost text-base-content/50" 
                            onClick={handleClose}
                        >
                            Skip Tour
                        </button>
                        <button 
                            className="btn btn-primary px-8" 
                            onClick={handleNext}
                        >
                            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                        </button>
                    </div>
                </div>
                
            </div>
            <style>{`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
                .animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>
    );
};

export default UserOnboardingModal;
