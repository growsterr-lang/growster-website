import { useState } from 'react';
import Head from 'next/head';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const sb = (path: string, init?: RequestInit) =>
  fetch(SUPABASE_URL + '/rest/v1/' + path, {
    ...init,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

type Submission = {
  id: string;
  invoice_number: string | null;
  amount: number;
  description: string | null;
  status: string;
  review_note: string | null;
  submitted_at: string;
};

const STATUS_LABEL: Record<string, string> = {
  submitted: 'Submitted',
  under_review: 'Under review',
  approved: 'Approved - payment scheduled',
  rejected: 'Rejected',
  paid: 'Paid',
};

const STATUS_COLOR: Record<string, string> = {
  submitted: '#8b5cf6',
  under_review: '#0050ff',
  approved: '#22c55e',
  rejected: '#ff0080',
  paid: '#22c55e',
};

export default function VendorsPage() {
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [gst, setGst] = useState('');
  const [pan, setPan] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [invoiceLink, setInvoiceLink] = useState('');
  const [poReference, setPoReference] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupSubs, setLookupSubs] = useState<Submission[] | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !contactEmail || !amount || !invoiceLink || !bankAccountNumber || !bankIfsc) {
      setError('Please fill in vendor name, email, bank account + IFSC, amount, and invoice link.');
      return;
    }

    setSubmitting(true);

    const vendorRes = await sb('vendors?on_conflict=contact_email', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify({
        contact_email: contactEmail,
        name,
        contact_name: contactName || null,
        contact_phone: contactPhone || null,
        gst_number: gst || null,
        pan_number: pan || null,
        bank_account_name: bankAccountName || null,
        bank_account_number: bankAccountNumber,
        bank_ifsc: bankIfsc,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!vendorRes.ok) {
      setError('Could not save your details. Please try again or reach out to us.');
      setSubmitting(false);
      return;
    }
    const [vendor] = await vendorRes.json();

    const subRes = await sb('vendor_submissions', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        vendor_id: vendor.id,
        invoice_number: invoiceNumber || null,
        amount: parseFloat(amount),
        description: description || null,
        invoice_link: invoiceLink,
        po_reference: poReference || null,
        status: 'submitted',
      }),
    });

    if (!subRes.ok) {
      setError('Your details were saved but the invoice submission failed. Please try again.');
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSuccess(true);
    setInvoiceNumber('');
    setAmount('');
    setDescription('');
    setInvoiceLink('');
    setPoReference('');
    setTimeout(() => setSuccess(false), 5000);
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    setLookupSubs(null);
    if (!lookupEmail) return;
    setLookupLoading(true);

    const vRes = await sb('vendors?contact_email=eq.' + encodeURIComponent(lookupEmail) + '&select=id');
    const [vendor] = await vRes.json();
    if (!vendor) {
      setLookupError('No submissions found for that email.');
      setLookupLoading(false);
      return;
    }
    const sRes = await sb(
      'vendor_submissions?vendor_id=eq.' + vendor.id + '&select=id,invoice_number,amount,description,status,review_note,submitted_at&order=submitted_at.desc'
    );
    setLookupSubs(await sRes.json());
    setLookupLoading(false);
  };

  return (
    <Shell>
      <Head>
        <title>Vendor Invoices | Growster</title>
      </Head>

      <h1 style={{ color: '#fff', marginBottom: 4, fontSize: 'clamp(22px, 5vw, 28px)' }}>Vendor Invoices</h1>
      <p style={{ color: '#888', marginBottom: 32, fontSize: 14, lineHeight: 1.5 }}>
        Submit your invoice and registration details below. We will email you once payment is processed.
      </p>

      <form onSubmit={handleSubmit} className="card">
        <h2 className="section-heading">Your details</h2>
        <div className="row">
          <Field label="Vendor / company name *">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Contact person">
            <input className="input" value={contactName} onChange={(e) => setContactName(e.target.value)} />
          </Field>
        </div>
        <div className="row">
          <Field label="Email * (payment notifications go here)">
            <input className="input" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
          </Field>
          <Field label="Phone">
            <input className="input" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </Field>
        </div>
        <div className="row">
          <Field label="GST number">
            <input className="input" value={gst} onChange={(e) => setGst(e.target.value)} />
          </Field>
          <Field label="PAN number">
            <input className="input" value={pan} onChange={(e) => setPan(e.target.value)} />
          </Field>
        </div>

        <h2 className="section-heading" style={{ marginTop: 28 }}>Bank details</h2>
        <div className="row">
          <Field label="Account holder name">
            <input className="input" value={bankAccountName} onChange={(e) => setBankAccountName(e.target.value)} />
          </Field>
          <Field label="Account number *">
            <input className="input" value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value)} required />
          </Field>
        </div>
        <Field label="IFSC *">
          <input className="input" value={bankIfsc} onChange={(e) => setBankIfsc(e.target.value)} required />
        </Field>

        <h2 className="section-heading" style={{ marginTop: 28 }}>Invoice</h2>
        <div className="row">
          <Field label="Invoice number">
            <input className="input" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="e.g. INV-2026-014" />
          </Field>
          <Field label="Amount (Rs) *">
            <input className="input" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </Field>
        </div>
        <Field label="What's this for?">
          <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Reel shoot - Be Neude, Sept batch" />
        </Field>
        <Field label="Invoice link (Drive / Dropbox) *">
          <input className="input" value={invoiceLink} onChange={(e) => setInvoiceLink(e.target.value)} required />
        </Field>
        <Field label="PO reference (if any)">
          <input className="input" value={poReference} onChange={(e) => setPoReference(e.target.value)} />
        </Field>

        {error && <p style={{ color: '#ff0080', fontSize: 13 }}>{error}</p>}
        {success && <p style={{ color: '#22c55e', fontSize: 13 }}>Submitted - check status below anytime with your email.</p>}

        <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', maxWidth: 260 }}>
          {submitting ? 'Submitting...' : 'Submit invoice'}
        </button>
      </form>

      <div className="card" style={{ marginTop: 32 }}>
        <h2 className="section-heading">Check your submission status</h2>
        <form onSubmit={handleLookup} className="lookup-row">
          <input
            className="input"
            type="email"
            placeholder="Your email"
            value={lookupEmail}
            onChange={(e) => setLookupEmail(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ padding: '10px 24px', flexShrink: 0 }}>
            {lookupLoading ? '...' : 'Check'}
          </button>
        </form>
        {lookupError && <p style={{ color: '#888', fontSize: 13, marginTop: 12 }}>{lookupError}</p>}
        {lookupSubs && lookupSubs.length > 0 && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {lookupSubs.map((s) => (
              <div key={s.id} className="status-row">
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: '#fff', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.invoice_number || 'No invoice #'} - Rs{Number(s.amount).toLocaleString('en-IN')}
                  </div>
                  <div style={{ color: '#555', fontSize: 12 }}>
                    {new Date(s.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <span className="status-pill" style={{ background: STATUS_COLOR[s.status] }}>
                  {STATUS_LABEL[s.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }
        html, body {
          overflow-x: hidden;
          max-width: 100%;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: #fff;
          -webkit-box-shadow: 0 0 0px 1000px #0d0d12 inset;
          transition: background-color 9999s ease-in-out 0s;
          caret-color: #fff;
        }
        .card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 24px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .section-heading {
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .row {
          display: flex;
          gap: 16px;
          margin-bottom: 0;
        }
        .row > div {
          flex: 1;
          min-width: 0;
        }
        .input {
          width: 100%;
          max-width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #2a2a35;
          background: #0d0d12;
          color: #fff;
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .input:focus {
          border-color: #ff0080;
        }
        .input::placeholder {
          color: #555;
        }
        .btn-primary {
          padding: 12px 28px;
          border-radius: 99px;
          border: none;
          background: linear-gradient(90deg, #ff0080, #8b5cf6);
          color: #fff;
          font-weight: 600;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          font-size: 14px;
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .lookup-row {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          flex-wrap: wrap;
        }
        .lookup-row .input {
          flex: 1;
          min-width: 160px;
        }
        .status-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 10px;
        }
        .status-pill {
          padding: 5px 12px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 600;
          color: #fff;
          white-space: nowrap;
          flex-shrink: 0;
        }
        @media (max-width: 640px) {
          .row {
            flex-direction: column;
            gap: 0;
          }
        }
      `}</style>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', width: '100%', overflowX: 'hidden', background: '#050508', fontFamily: 'Montserrat, sans-serif', padding: '48px 16px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', width: '100%' }}>{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', color: '#aaa', fontSize: 13, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}
