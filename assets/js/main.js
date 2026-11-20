(function () {
  var form = document.getElementById('join');
  var input = document.getElementById('email');
  var msg = document.querySelector('.msg');
  var thanks = document.querySelector('.thanks');
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // Booking buttons go to Calendly when a link is set, otherwise to the sign-up.
  var booking = window.BYB_BOOKING_URL;
  document.querySelectorAll('[data-book]').forEach(function (a) {
    if (booking) {
      a.href = booking;
      a.target = '_blank';
      a.rel = 'noopener';
    } else if (a.textContent === 'Book your session') {
      a.textContent = 'Request a session';
    }
  });

  // Only one service card open at a time.
  var cards = document.querySelectorAll('details.svc');
  cards.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) cards.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  // Every "Keep me close" link scrolls to the form and focuses the field.
  document.querySelectorAll('a[href="#join"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(function () { input.focus({ preventScroll: true }); }, 450);
    });
  });

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function fail(text) {
    form.classList.add('is-error');
    msg.textContent = text;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = input.value.trim().toLowerCase();
    msg.textContent = '';
    form.classList.remove('is-error');

    if (form.website.value) return; // bot filled the hidden field
    if (!EMAIL.test(email)) return fail('Please enter a valid email address.');

    var url = window.BYB_SIGNUP_URL;
    if (!url) return fail('Sign-up is not connected yet. Please try again soon.');

    var params = new URLSearchParams();
    params.append('email', email);
    params.append('source', 'landing');
    params.append('page', location.href);
    params.append('referrer', document.referrer || '');

    form.setAttribute('aria-busy', 'true');
    // Google Apps Script does not send CORS headers, so the request is sent
    // "no-cors": the browser delivers it but we cannot read the reply.
    // A network failure still rejects, which we report.
    fetch(url, { method: 'POST', mode: 'no-cors', body: params })
      .then(function () {
        form.style.display = 'none';
        thanks.style.display = 'block';
        thanks.focus();
      })
      .catch(function () {
        fail('Something went wrong. Please check your connection and try again.');
      })
      .then(function () { form.removeAttribute('aria-busy'); });
  });
})();
