/**
 * Smart Student Academic Decline System Client Scripts
 * Supporting Bootstrap validation and custom interactive elements.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('سامانه هوشمند پایش تحصیلی خوارزمی با موفقیت راه‌اندازی شد.');
    
    // Smooth scroll for page alerts
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 8000);
    });
});
