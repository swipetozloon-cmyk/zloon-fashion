const careerForm = document.querySelector('#careerForm');
const careerStatus = document.querySelector('#careerStatus');

careerForm?.addEventListener('submit', async event => {
  event.preventDefault();
  if (!careerForm.reportValidity()) return;
  const application = Object.fromEntries(new FormData(careerForm));
  application.id = `CA-${Date.now().toString(16).slice(-6).toUpperCase()}`;
  application.createdAt = new Date().toISOString();
  const saved = JSON.parse(localStorage.getItem('zloonCareerApplications') || '[]');
  saved.unshift(application);
  localStorage.setItem('zloonCareerApplications', JSON.stringify(saved.slice(0, 30)));

  try {
    const response = await fetch('/api/careers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(application) });
    if (!response.ok) throw new Error('Saved locally');
  } catch (_) {
    // Local test fallback: the same browser's admin preview can still show it.
  }

  careerStatus.textContent = 'Application submitted. Opening WhatsApp to share it with the ZLOON team.';
  const message = `Hello ZLOON Team, I have submitted a career application.\n\nName: ${application.name}\nApplying for: ${application.type}\nRole: ${application.role}\nCity: ${application.city}\nEmail: ${application.email}\nPhone: ${application.phone}\n\nPortfolio: ${application.portfolio || 'Not added'}\n\nMessage: ${application.message}`;
  setTimeout(() => window.open(`https://wa.me/919782326637?text=${encodeURIComponent(message)}`, '_blank', 'noopener'), 350);
  careerForm.reset();
});
