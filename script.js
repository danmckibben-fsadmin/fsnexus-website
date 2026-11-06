const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));
document.querySelector('#year').textContent = new Date().getFullYear();

const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.innerHTML = 'Sending…';
  status.textContent = 'Sending your enquiry securely…';
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(Object.fromEntries(new FormData(form).entries()))
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Your enquiry could not be sent.');
    form.reset();
    status.textContent = 'Thanks — your enquiry has been sent. We’ll be in touch.';
  } catch (error) {
    status.textContent = error.message || 'Something went wrong. Please try again.';
  } finally {
    button.disabled = false;
    button.innerHTML = 'Send enquiry <span>↗</span>';
  }
});
