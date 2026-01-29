import { useEffect, useRef } from "react";

interface StripeEmbeddedCheckoutProps {
    clientSecret: string;
    onClose: () => void;
}

declare global {
    interface Window {
        Stripe: any;
    }
}

export function StripeEmbeddedCheckout({ clientSecret, onClose }: StripeEmbeddedCheckoutProps) {
    const checkoutRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

        let checkout: any;

        async function initialize() {
            checkout = await stripe.initEmbeddedCheckout({
                clientSecret,
            });
            if (checkoutRef.current) {
                checkout.mount(checkoutRef.current);
            }
        }

        initialize();

        return () => {
            if (checkout) {
                checkout.unmount();
                checkout.destroy();
            }
        };
    }, [clientSecret]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="p-8 overflow-y-auto">
                    <div ref={checkoutRef}></div>
                </div>
            </div>
        </div>
    );
}
