import '../../style/unlockStyle.css'
import { forwardRef } from 'react'
import limitsImg from '../../images/limitReachedGlowing.png';

const Unlock = forwardRef(({userId}, ref) => {

    const closeDialog = () => {
        ref.current.close()
    }
    return (
        <>
            <dialog className="purchaseDialog" ref={ref}>
                <header>
                    <h1>Limit reached!</h1>
                    <i onClick={closeDialog} className="close-icon" title='close'>✖</i>
                </header>
                <div><img src={limitsImg} alt="limits" /></div>
                <button data-text="Awesome" onClick={() => userId ? location.href = ('/payment'): location.href = '/login'}>
                        <span className="actual-text">&nbsp;Purchase&nbsp;</span>
                        <span aria-hidden="true" className="hover-text">&nbsp;Purchase&nbsp;</span>
                    </button>
            </dialog>
        </>
    )
})

export default Unlock