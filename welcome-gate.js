(() => {
  const gate = document.querySelector('#welcomeGate');
  const form = document.querySelector('#welcomeForm');
  if (!gate || !form) return;
  const status = document.querySelector('#gateStatus');
  const otpArea = form.querySelector('.gate-otp');
  let token = '';

  document.querySelector('.gate-close')?.addEventListener('click', () => { gate.hidden = true; });

  fetch('/api/auth/me', { credentials: 'same-origin' })
    .then(response => { if (response.ok) gate.hidden = true; })
    .catch(() => {});

  document.querySelectorAll('[data-gate-tab]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-gate-tab]').forEach(tab => tab.classList.toggle('active', tab === button));
    const isLogin = button.dataset.gateTab === 'login';
    document.querySelector('.gate-kicker').textContent = isLogin ? 'WELCOME BACK TO ZLOON' : 'WELCOME TO ZLOON';
    document.querySelector('.gate-lead').textContent = isLogin ? 'Enter your registered details and verify your WhatsApp number to continue.' : 'Create your ZLOON profile to enter the store, access offers and receive WhatsApp updates.';
    form.querySelector('.gate-member').hidden = isLogin;
  }));

  form.querySelector('.gate-send').addEventListener('click', async () => {
    if (!form.reportValidity()) return;
    status.textContent = '';
    try {
      const data = Object.fromEntries(new FormData(form));
      const response = await fetch('/api/auth/request-verification', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to send verification code.');
      token = result.token;
      otpArea.hidden = false;
      form.querySelector('.gate-send').hidden = true;
      document.querySelector('#gateOtpHelp').innerHTML = result.devCode ? `Test code: <strong>${result.devCode}</strong>` : 'Your verification code has been sent to WhatsApp.';
    } catch (error) { status.textContent = error.message; }
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!token) return;
    try {
      const response = await fetch('/api/auth/verify', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, code: form.otp.value }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Verification failed.');
      gate.hidden = true;
      window.location.reload();
    } catch (error) { status.textContent = error.message; }
  });
})();
