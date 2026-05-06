
export function renderContact(container) {
  container.innerHTML = `
    <div class="page container">
      <div class="contact-wrap">

        <!-- Left info column -->
        <aside class="contact-aside">
          <h1 class="contact-aside__title">
            Say <em>Hello</em>
          </h1>
          <p class="contact-aside__text">
            Have a question, a suggestion, or just want to talk books?
            Fill in the form and we'll get back to you.
          </p>
          <ul class="contact-aside__list" role="list">
            <li class="contact-aside__item">
              <div class="contact-aside__item-icon" aria-hidden="true">📧</div>
              <div>
                <p class="contact-aside__item-label">Email</p>
                <p class="contact-aside__item-text">hello@bookshelf.example.com</p>
              </div>
            </li>
            <li class="contact-aside__item">
              <div class="contact-aside__item-icon" aria-hidden="true">📚</div>
              <div>
                <p class="contact-aside__item-label">Data Source</p>
                <p class="contact-aside__item-text">Powered by Open Library API (free)</p>
              </div>
            </li>
            <li class="contact-aside__item">
              <div class="contact-aside__item-icon" aria-hidden="true">🔒</div>
              <div>
                <p class="contact-aside__item-label">Privacy</p>
                <p class="contact-aside__item-text">
                  <a href="#/privacy" style="color:var(--clr-accent)">Read our Privacy Policy</a>
                </p>
              </div>
            </li>
          </ul>
        </aside>

        <!-- Right form column -->
        <div class="contact-card">
          <h2 class="contact-card__heading">Send a Message</h2>
          <form id="contact-form" class="contact-form" novalidate aria-label="Contact form">

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="cf-first">
                  First name <span class="req" aria-hidden="true">*</span>
                </label>
                <input
                  type="text" id="cf-first" name="first"
                  class="form-input" autocomplete="given-name"
                  aria-required="true" aria-describedby="cf-first-err"
                  placeholder="Jane"
                />
                <span class="form-error" id="cf-first-err" role="alert" aria-live="polite"></span>
              </div>
              <div class="form-group">
                <label class="form-label" for="cf-last">
                  Last name <span class="req" aria-hidden="true">*</span>
                </label>
                <input
                  type="text" id="cf-last" name="last"
                  class="form-input" autocomplete="family-name"
                  aria-required="true" aria-describedby="cf-last-err"
                  placeholder="Doe"
                />
                <span class="form-error" id="cf-last-err" role="alert" aria-live="polite"></span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="cf-email">
                Email address <span class="req" aria-hidden="true">*</span>
              </label>
              <input
                type="email" id="cf-email" name="email"
                class="form-input" autocomplete="email"
                aria-required="true" aria-describedby="cf-email-err"
                placeholder="jane@example.com"
              />
              <span class="form-error" id="cf-email-err" role="alert" aria-live="polite"></span>
            </div>

            <div class="form-group">
              <label class="form-label" for="cf-subject">
                Subject <span class="req" aria-hidden="true">*</span>
              </label>
              <select
                id="cf-subject" name="subject"
                class="form-input form-select"
                aria-required="true" aria-describedby="cf-subject-err"
              >
                <option value="">— Choose a topic —</option>
                <option value="general">General question</option>
                <option value="bug">Report a bug</option>
                <option value="feature">Feature request</option>
                <option value="data">Data / Privacy request</option>
                <option value="other">Other</option>
              </select>
              <span class="form-error" id="cf-subject-err" role="alert" aria-live="polite"></span>
            </div>

            <div class="form-group">
              <label class="form-label" for="cf-message">
                Message <span class="req" aria-hidden="true">*</span>
              </label>
              <textarea
                id="cf-message" name="message"
                class="form-textarea" rows="5"
                maxlength="1000"
                aria-required="true"
                aria-describedby="cf-message-err cf-char-hint"
                placeholder="What's on your mind?"
              ></textarea>
              <span class="form-error" id="cf-message-err" role="alert" aria-live="polite"></span>
              <span class="char-hint" id="cf-char-hint" aria-live="polite">
                <span id="cf-char-count">0</span>/1000 characters
              </span>
            </div>

            <div class="form-group">
              <label style="display:flex;align-items:flex-start;gap:var(--sp-3);cursor:pointer">
                <input
                  type="checkbox" id="cf-consent" name="consent"
                  aria-required="true" aria-describedby="cf-consent-err"
                  style="margin-top:3px;accent-color:var(--clr-accent);flex-shrink:0"
                />
                <span style="font-size:var(--text-sm);color:var(--clr-text-muted)">
                  I agree to the <a href="#/privacy" style="color:var(--clr-accent)">Privacy Policy</a>
                  and consent to my data being used to handle this enquiry.
                  <span class="req" aria-hidden="true">*</span>
                </span>
              </label>
              <span class="form-error" id="cf-consent-err" role="alert" aria-live="polite"></span>
            </div>

            <button type="submit" class="btn btn--accent btn--lg" id="cf-submit">
              Send Message →
            </button>

            <div id="cf-success" class="form-success-msg" hidden aria-live="polite">
              ✅ Thank you! Your message has been received.
            </div>
          </form>
        </div>

      </div>
    </div>
  `;

  wireForm(container);
}


function wireForm(container) {
  const form      = container.querySelector('#contact-form');
  const submitBtn = container.querySelector('#cf-submit');
  const successEl = container.querySelector('#cf-success');
  const msgArea   = container.querySelector('#cf-message');
  const charCount = container.querySelector('#cf-char-count');

  
  msgArea.addEventListener('input', () => {
    charCount.textContent = msgArea.value.length;
  });

 
  form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(el => {
    el.addEventListener('blur', () => validateField(el));
  });

  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateAll(form)) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      
      setTimeout(() => {
        form.reset();
        charCount.textContent = '0';
        successEl.hidden = false;
        submitBtn.hidden  = true;
        successEl.focus();
      }, 900);
    }
  });
}


const RULES = {
  first:   { label: 'First name',     required: true, min: 2 },
  last:    { label: 'Last name',       required: true, min: 2 },
  email:   { label: 'Email address',   required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  subject: { label: 'Subject',         required: true },
  message: { label: 'Message',         required: true, min: 10 },
};

function validateField(field) {
  const rules = RULES[field.name];
  const errEl = document.getElementById(`cf-${field.name}-err`);
  if (!rules || !errEl) return true;

  const val = field.value.trim();
  let error = '';

  if (rules.required && !val)          error = `${rules.label} is required.`;
  else if (rules.min && val.length < rules.min)  error = `${rules.label} must be at least ${rules.min} characters.`;
  else if (rules.pattern && !rules.pattern.test(val)) error = `Please enter a valid email address.`;

  errEl.textContent = error;
  field.classList.toggle('error', !!error);
  field.setAttribute('aria-invalid', String(!!error));
  return !error;
}

function validateAll(form) {
  let valid = true;
  form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(f => {
    if (!validateField(f)) valid = false;
  });

 
  const consent = form.querySelector('#cf-consent');
  const consentErr = document.getElementById('cf-consent-err');
  if (!consent.checked) {
    consentErr.textContent = 'You must agree to the Privacy Policy to continue.';
    valid = false;
  } else {
    consentErr.textContent = '';
  }

  if (!valid) {
   
    const first = form.querySelector('[aria-invalid="true"]');
    first?.focus();
  }
  return valid;
}
