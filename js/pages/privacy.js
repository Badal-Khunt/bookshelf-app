
export function renderPrivacy(container) {
  const date = new Date().toLocaleDateString('en-GB', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  container.innerHTML = `
    <div class="page container">
      <div class="privacy-doc">
        <header class="page__header">
          <h1 class="page__title">Privacy Policy</h1>
          <p class="page__subtitle">Last updated: ${date}</p>
        </header>

        <h2>1. Who We Are</h2>
        <p>
          Bookshelf is a demonstration web application built as part of an academic
          assessment at the University of Roehampton. Book data is provided by
          <a href="https://openlibrary.org" target="_blank" rel="noopener noreferrer">Open Library</a>,
          a project of the Internet Archive.
        </p>

        <h2>2. What Data We Collect</h2>
        <p>We only store the following data, entirely in your own browser:</p>
        <ul>
          <li><strong>Reading list:</strong> The books you save are stored in your browser's localStorage. This data never leaves your device and is never sent to any server.</li>
          <li><strong>Cookie consent:</strong> Your preference (accept/decline) is saved in localStorage so we don't ask again.</li>
          <li><strong>Contact form:</strong> If you submit the contact form, your name, email, subject and message would be processed to respond to your enquiry. (This is a demo — no data is actually sent.)</li>
        </ul>

        <h2>3. Cookies & Local Storage</h2>
        <p>
          This site uses browser localStorage only — not traditional cookies. We store
          your saved books and your consent preference. We do not use any third-party
          tracking, advertising scripts, or analytics tools.
        </p>
        <p>
          You can delete all stored data at any time by clearing your browser's localStorage
          in your browser settings (Settings → Privacy → Clear browsing data).
        </p>

        <h2>4. Third-Party Services</h2>
        <p>
          When you search for books, your browser makes requests to the
          <a href="https://openlibrary.org/developers/api" target="_blank" rel="noopener noreferrer">Open Library API</a>.
          Please see the <a href="https://archive.org/about/terms.php" target="_blank" rel="noopener noreferrer">
          Internet Archive Terms of Service</a> for details on how they handle requests.
        </p>
        <p>
          Book cover images are loaded from <code>covers.openlibrary.org</code>, which
          is operated by the Internet Archive.
        </p>

        <h2>5. Your Rights Under GDPR</h2>
        <p>Under UK and EU GDPR you have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request erasure of your data ("right to be forgotten")</li>
          <li>Object to or restrict processing</li>
          <li>Data portability</li>
        </ul>
        <p>
          Since all data is stored locally in your own browser, you can exercise the
          right to erasure at any time by clearing your localStorage. To make a formal
          request, <a href="#/contact">contact us</a>.
        </p>

        <h2>6. Data Retention</h2>
        <p>
          localStorage persists until you clear it or uninstall your browser.
          No data is retained on any server by this application.
        </p>

        <h2>7. Changes to This Policy</h2>
        <p>
          We may update this policy from time to time. The date at the top of this
          page shows when it was last revised.
        </p>

        <h2>8. Contact</h2>
        <p>
          Questions about this policy? <a href="#/contact">Get in touch</a>.
        </p>
      </div>
    </div>
  `;
}
