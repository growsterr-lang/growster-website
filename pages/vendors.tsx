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

      <h1 style={{ color: '#fff', marginBottom: 4 }}>Vendor Invoices</h1>
      <p style={{ color: '#888', marginBottom: 32 }}>
        Submit your invoice and registration details below. We will email you once payment is processed.
      </p>

      <form onSubmit={handleSubmit} style={cardStyle}>
        <h2 style={sectionHeading}>Your details</h2>
        <div style={rowStyle}>
          <Field label="Vendor / company name *">
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Contact person">
            <input style={inputStyle} value={contactName} onChange={(e) => setContactName(e.target.value)} />
          </Field>
        </div>
        <div style={rowStyle}>
          <Field label="Email * (payment notifications go here)">
            <input style={inputStyle} type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
          </Field>
          <Field label="Phone">
            <input style={inputStyle} value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </Field>
        </div>
        <div style={rowStyle}>
          <Field label="GST number">
            <input style={inputStyle} value={gst} onChange={(e) => setGst(e.target.value)} />
          </Field>
          <Field label="PAN number">
            <input style={inputStyle} value={pan} onChange={(e) => setPan(e.target.value)} />
          </Field>
        </div>

        <h2 style={{ ...sectionHeading, marginTop: 28 }}>Bank details</h2>
        <div style={rowStyle}>
          <Field label="Account holder name">
            <input style={inputStyle} value={bankAccountName} onChange={(e) => setBankAccountName(e.target.value)} />
          </Field>
          <Field label="Account number *">
            <input style={inputStyle} value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value)} required />
          </Field>
        </div>
        <Field label="IFSC *">
          <input style={inputStyle} value={bankIfsc} onChange={(e) => setBankIfsc(e.target.value)} required />
        </Field>

        <h2 style={{ ...sectionHeading, marginTop: 28 }}>Invoice</h2>
        <div style={rowStyle}>
          <Field label="Invoice number">
            <input style={inputStyle} value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="e.g. INV-2026-014" />
          </Field>
          <Field label="Amount (Rs) *">
            <input style={inputStyle} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </Field>
        </div>
        <Field label="What's this for?">
          <input style={inputStyle} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Reel shoot - Be Neude, Sept batch" />
        </Field>
        <Field label="Invoice link (Drive / Dropbox) *">
          <input style={inputStyle} value={invoiceLink} onChange={(e) => setInvoiceLink(e.target.value)} required />
        </Field>
        <Field label="PO reference (if any)">
          <input style={inputStyle} value={poReference} onChange={(e) => setPoReference(e.target.value)} />
        </Field>

        {error && <p style={{ color: '#ff0080', fontSize: 13 }}>{error}</p>}
        {success && <p style={{ color: '#22c55e', fontSize: 13 }}>Submitted - check status below anytime with your email.</p>}

        <button type="submit" disabled={submitting} style={buttonStyle}>
          {submitting ? 'Submitting...' : 'Submit invoice'}
        </button>
      </form>

      <div style={{ ...cardStyle, marginTop: 32 }}>
        <h2 style={sectionHeading}>Check your submission status</h2>
        <form onSubmit={handleLookup} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <input
            style={inputStyle}
            type="email"
            placeholder="Your email"
            value={lookupEmail}
            onChange={(e) => setLookupEmail(e.target.value)}
          />
          <button type="submit" style={{ ...buttonStyle, padding: '10px 24px' }}>
            {lookupLoading ? '...' : 'Check'}
          </button>
        </form>
        {lookupError && <p style={{ color: '#888', fontSize: 13, marginTop: 12 }}>{lookupError}</p>}
        {lookupSubs && lookupSubs.length > 0 && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {lookupSubs.map((s) => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1f1f28', paddingTop: 10 }}>
                <div>
                  <div style={{ color: '#fff', fontSize: 14 }}>
                    {s.invoice_number || 'No invoice #'} - Rs{Number(s.amount).toLocaleString('en-IN')}
                  </div>
                  <div style={{ color: '#555', fontSize: 12 }}>
                    {new Date(s.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <span style={{ padding: '5px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600, color: '#fff', background: STATUS_COLOR[s.status] }}>
                  {STATUS_LABEL[s.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#050508', fontFamily: 'Montserrat, sans-serif', padding: '48px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ flex: 1, marginBottom: 16 }}>
      <label style={{ display: 'block', color: '#aaa', fontSize: 13, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const sectionHeading: React.CSSProperties = { color: '#fff', fontSize: 16, marginBottom: 16 };
const cardStyle: React.CSSProperties = { background: '#0d0d12', border: '1px solid #1f1f28', borderRadius: 16, padding: 24 };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 16 };
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid #2a2a35',
  background: '#050508',
  color: '#fff',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: 14,
};
const buttonStyle: React.CSSProperties = {
  padding: '12px 28px',
  borderRadius: 99,
  border: 'none',
  background: 'linear-gradient(90deg, #ff0080, #8b5cf6)',
  color: '#fff',
  fontWeight: 600,
  fontFamily: 'Montserrat, sans-serif',
  cursor: 'pointer',
  fontSize: 14,
};
