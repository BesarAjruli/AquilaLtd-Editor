import { useEffect } from 'react'
import '../style/paymentStyle.css'

const Payment = () => {
    useEffect(() => {
        if (window.TwoCoInlineCart) return; // Prevent duplicate script loading

        const script = document.createElement('script');
        script.src = 'https://secure.2checkout.com/checkout/client/twoCoInlineCart.js';
        script.async = true;

        script.onload = () => {
            if (window.TwoCoInlineCart) {
                window.TwoCoInlineCart.setup.setConfig('app', { merchant: '255406192514', iframeLoad: 'checkout' });
                window.TwoCoInlineCart.setup.setConfig('cart', { host: 'https://secure.2checkout.com', customization: 'inline-one-step' });
                window.TwoCoInlineCart.register();
            }
        };

        document.body.appendChild(script);

        return () => {
            document.querySelectorAll("script[src*='twoCoInlineCart.js']").forEach(script => script.remove());
        };
    }, []);

    const handlePayment = (productCode) => {
        if (window.TwoCoInlineCart) {
            window.TwoCoInlineCart.products.add({ code: productCode, quantity: 1 });
            window.TwoCoInlineCart.cart.checkout();
        } else {
            console.error("2Checkout Inline Cart not loaded");
        }
    };

   return(
        <>
            <div className="paymentBody">
                <div>
                    <h2>-Basic Bundle-</h2>
                    <ul>
                        <li>+3 Pages</li>
                        <li>+3 Images</li>
                        <li>Unlock table & calendar</li>
                    </ul>
                    <button data-text="Awesome" onClick={() => handlePayment('1')}>
                        <span className="actual-text">&nbsp;$3.99&nbsp;</span>
                        <span aria-hidden="true" className="hover-text">&nbsp;$3.99&nbsp;</span>
                    </button>
                </div>
                <div>
                <h2>-Extra Bundle-</h2>
                    <ul>
                        <li>+8 Pages</li>
                        <li>+5 Images</li>
                        <li>Unlock table, calendar, charts & gallery</li>
                    </ul>
                    <button data-text="Awesome" onClick={() => handlePayment('2')}>
                        <span className="actual-text">&nbsp;$4.99&nbsp;</span>
                        <span aria-hidden="true" className="hover-text">&nbsp;$4.99&nbsp;</span>
                    </button>
                </div>
                <div>
                <h2>-Monthly Subscription-</h2>
                    <ul>
                        <li>Unlimited Pages</li>
                        <li>Unlimited Images</li>
                        <li>Everything Unlocked</li>
                    </ul>
                    <button data-text="Awesome" onClick={() => handlePayment('3')}>
                        <span className="actual-text">&nbsp;$7.99&nbsp;</span>
                        <span aria-hidden="true" className="hover-text">&nbsp;$7.99&nbsp;</span>
                    </button>
                </div>
                <div>
                <h2>-One time bundle-</h2>
                    <ul>
                        <li>Unlimited Pages</li>
                        <li>Unlimited Images</li>
                        <li>Everything Unlocked</li>
                    </ul>
                    <button data-text="Awesome" onClick={() => handlePayment('4')}>
                        <span className="actual-text">&nbsp;$74.99&nbsp;</span>
                        <span aria-hidden="true" className="hover-text">&nbsp;$74.99&nbsp;</span>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Payment