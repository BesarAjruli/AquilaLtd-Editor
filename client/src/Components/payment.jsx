import '../style/paymentStyle.css'

const Payment = () => {

    const handlePayment = async (productCode) => {
        const response = await fetch(`http://localhost:5000/pay/${productCode}`, {
            method:'POST',
        })
        const data = await response.json()
        
        if (data.approvalUrl) {
            window.location.href = data.approvalUrl; // Redirect user to PayPal for approval
        } else {
            console.error('Error getting PayPal approval URL:', data.error);
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
                    <button data-text="Awesome" onClick={() => handlePayment('001')}>
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
                    <button data-text="Awesome" onClick={() => handlePayment('002')}>
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
                    <button data-text="Awesome" onClick={() => handlePayment('003')}>
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
                    <button data-text="Awesome" onClick={() => handlePayment('004')}>
                        <span className="actual-text">&nbsp;$74.99&nbsp;</span>
                        <span aria-hidden="true" className="hover-text">&nbsp;$74.99&nbsp;</span>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Payment