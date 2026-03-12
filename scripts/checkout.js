document.addEventListener('DOMContentLoaded', () => {
    const payButton = document.getElementById('payButton');

    if (payButton) {
        payButton.addEventListener('click', () => {
            const btnText = payButton.querySelector('.btn-text');
            const btnLoading = payButton.querySelector('.btn-loading');
            
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            payButton.disabled = true;

            setTimeout(() => {
                window.location.href = 'confirmation.html';
            }, 1500);
        });
    }

    const addressCard = document.querySelector('.address-card');
    const paymentCard = document.querySelector('.payment-card');
    
    [addressCard, paymentCard].forEach(card => {
        if (card) {
            card.addEventListener('click', () => {
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
            });
        }
    });
});
