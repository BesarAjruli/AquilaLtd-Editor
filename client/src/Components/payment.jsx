import '../style/paymentStyle.css'
const Payment = () => {
    return(
        <>
            <div className="paymentBody">
                <div>
                    <h2>-Basic Boundle-</h2>
                    <ul>
                        <li>+3 Pages</li>
                        <li>+3 Images</li>
                        <li>Unlock table & calendar</li>
                    </ul>
                    <button data-text="Awesome">
                        <span class="actual-text">&nbsp;$3.99&nbsp;</span>
                        <span aria-hidden="true" class="hover-text">&nbsp;$3.99&nbsp;</span>
                    </button>
                </div>
                <div>
                <h2>-Extra Boundle-</h2>
                    <ul>
                        <li>+8 Pages</li>
                        <li>+5 Images</li>
                        <li>Unlock table, calendar, charts & gallery</li>
                    </ul>
                    <button data-text="Awesome">
                        <span class="actual-text">&nbsp;$4.99&nbsp;</span>
                        <span aria-hidden="true" class="hover-text">&nbsp;$4.99&nbsp;</span>
                    </button>
                </div>
                <div>
                <h2>-Monthly Subscription-</h2>
                    <ul>
                        <li>Unlimited Pages</li>
                        <li>Unlimited Images</li>
                        <li>Evrything Unlocked</li>
                    </ul>
                    <button data-text="Awesome">
                        <span class="actual-text">&nbsp;$7.99&nbsp;</span>
                        <span aria-hidden="true" class="hover-text">&nbsp;$7.99&nbsp;</span>
                    </button>
                </div>
                <div>
                <h2>-Lifetime Subscription-</h2>
                    <ul>
                        <li>Unlimited Pages</li>
                        <li>Unlimited Images</li>
                        <li>Evrything Unlocked</li>
                    </ul>
                    <button data-text="Awesome">
                        <span class="actual-text">&nbsp;$74.99&nbsp;</span>
                        <span aria-hidden="true" class="hover-text">&nbsp;$74.99&nbsp;</span>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Payment