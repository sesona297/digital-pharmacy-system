import React, { useState } from 'react';
import '../styles/contact.css';

const faqs = [
  { q: 'How long does a prescription take to verify?', a: 'Pharmacists review scripts during opening hours. Most are checked the same day. If something is unclear, we will message you through your account.' },
  { q: 'Can someone else collect my order?', a: 'Yes. Ask them to bring the order number and their ID. Orders with scheduled medicines are handed over to the named patient or an authorised person.' },
  { q: 'What if an item I need is out of stock?', a: 'Contact us and the pharmacy team will suggest an equivalent product or tell you when stock is due.' },
  { q: 'How do I change my delivery address?', a: 'Update it before your order is packed by contacting us with your order number. After packing, the courier will call you.' }
];

export default function Contact() {
  const [open, setOpen] = useState(0);

  return <div className="ct">
    <section className="ct-intro">
      <span className="ab-pill">Get in touch</span>
      <h1>Contact us</h1>
      <p>Questions about an order, a prescription or a product? Email or phone the pharmacy team and they will reply during opening hours.</p>
    </section>

    <div className="ct-grid">
      <aside className="ct-side">
        <div className="ct-card"><span aria-hidden="true">✉</span><div><h3>Email</h3><p>support@pharmaflow.co.za</p><small>We reply within one working day.</small></div></div>
        <div className="ct-card"><span aria-hidden="true">☎</span><div><h3>Phone</h3><p>021 555 0142</p><small>Pharmacist on duty during opening hours.</small></div></div>
        <div className="ct-card"><span aria-hidden="true">⌖</span><div><h3>Visit the pharmacy</h3><p>12 Long Street, Cape Town, 8001</p><small>Collection orders are ready at the front counter.</small></div></div>
        <div className="ct-hours">
          <h3>Opening hours</h3>
          <dl>
            <div><dt>Monday to Friday</dt><dd>8:00 – 19:00</dd></div>
            <div><dt>Saturday</dt><dd>8:00 – 14:00</dd></div>
            <div><dt>Sunday and public holidays</dt><dd>Closed</dd></div>
          </dl>
        </div>
        <div className="ct-urgent"><b>Medical emergency?</b> Call 10177 for an ambulance or go to your nearest emergency unit.</div>
      </aside>
    </div>

    {/* FAQs */}
    <section className="ct-faq-section">
      <div className="ct-container">
        <div className="ct-faq">

          <div className="ct-faq-intro">
            <span>NEED SOME ANSWERS?</span>
            <h2>Common questions</h2>
            <p>
              Find quick answers to some of the questions our customers
              ask most often.
            </p>
          </div>

          <div className="ct-faq-list">
            {faqs.map((faq, index) => (
                <div
                    className={`ct-faq-item ${open === index ? 'is-open' : ''}`}
                    key={faq.q}
                >
                  <button
                      type="button"
                      aria-expanded={open === index}
                      onClick={() => setOpen(open === index ? -1 : index)}
                  >
                    {faq.q}
                    <span className="ct-faq-toggle" aria-hidden="true">
                    {open === index ? '−' : '+'}
                  </span>
                  </button>

                  {open === index && <p>{faq.a}</p>}
                </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  </div>;
}
