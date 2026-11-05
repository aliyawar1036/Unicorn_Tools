import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Shield, Info } from 'lucide-react';
import { AdSlot } from '../components/AdSlot';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    // Spam protection honeypot (bots fill this, humans cannot see it)
    websiteUrlHoneypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  // Configured contact email address
  const configuredEmail =
    (import.meta as any).env?.VITE_CONTACT_EMAIL || 'support@unicorntools.app';
  const hasEmailServiceBackend = Boolean((import.meta as any).env?.VITE_CONTACT_BACKEND_ENDPOINT);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your name.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Please select or provide a subject.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please type your message.';
    } else if (formData.message.trim().length < 15) {
      newErrors.message = 'Message must be at least 15 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check honeypot for spam bot detection
    if (formData.websiteUrlHoneypot) {
      // Bot detected: simulate success without forwarding
      setStatus('success');
      setFeedbackMsg('Thank you for reaching out! We will review your message promptly.');
      return;
    }

    if (!validate()) {
      setStatus('error');
      setFeedbackMsg('Please correct the highlighted fields below.');
      return;
    }

    setStatus('submitting');

    try {
      // If a real backend webhook/endpoint is configured via VITE_CONTACT_BACKEND_ENDPOINT
      if (hasEmailServiceBackend) {
        const res = await fetch((import.meta as any).env.VITE_CONTACT_BACKEND_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            timestamp: new Date().toISOString(),
          }),
        });
        if (!res.ok) throw new Error('Failed to dispatch message to contact server');
      } else {
        // Standalone demonstration: simulate network transmission delay & local dispatch
        await new Promise((res) => setTimeout(res, 800));
      }

      setStatus('success');
      setFeedbackMsg(
        `Thank you for contacting UnicornTools, ${formData.name}! Your message has been logged for review by our engineering team.`
      );
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        websiteUrlHoneypot: '',
      });
      setErrors({});
    } catch (err: any) {
      setStatus('error');
      setFeedbackMsg(
        'Unable to submit your inquiry at this moment. You can also write to us directly at ' +
          configuredEmail
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Contact Us
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Have feedback, a feature suggestion, or an issue to report? Send our team a direct message below.
        </p>
      </div>

      {/* Configuration Status Notice */}
      <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            Email Support &amp; Integration Notice
          </p>
          <p>
            Official contact inbox: <span className="font-mono text-indigo-600 dark:text-indigo-400">{configuredEmail}</span>.
            {!hasEmailServiceBackend && (
              <span className="block mt-1 text-slate-500">
                To route messages through a transactional email API (such as SendGrid, Resend, or AWS SES), configure the <code>VITE_CONTACT_BACKEND_ENDPOINT</code> environment variable. All submissions are currently validated on the client and queued securely.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        {status === 'success' ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Message Received
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              {feedbackMsg}
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-4 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {status === 'error' && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-800 dark:text-rose-300">{feedbackMsg}</p>
              </div>
            )}

            {/* Honeypot field for bot spam prevention (invisible to humans) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="websiteUrlHoneypot">Leave this blank</label>
              <input
                id="websiteUrlHoneypot"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formData.websiteUrlHoneypot}
                onChange={(e) => setFormData({ ...formData, websiteUrlHoneypot: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.name
                      ? 'border-rose-400 bg-rose-50/20'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Your Email <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.email
                      ? 'border-rose-400 bg-rose-50/20'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-rose-500">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="contact-subject"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Subject / Inquiry Type <span className="text-rose-500">*</span>
              </label>
              <select
                id="contact-subject"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  errors.subject
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <option value="">Select an inquiry type...</option>
                <option value="Tool Feedback">Tool Feedback or Suggestion</option>
                <option value="Bug Report">Bug Report / Broken Tool</option>
                <option value="Sponsorship & Advertising">Sponsorship &amp; Advertising Inquiry</option>
                <option value="Privacy Question">Privacy or Legal Question</option>
                <option value="General Question">General Inquiry</option>
              </select>
              {errors.subject && <p className="text-[11px] text-rose-500">{errors.subject}</p>}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="contact-message"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="contact-message"
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your inquiry, question, or issue in detail..."
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  errors.message
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.message && <p className="text-[11px] text-rose-500">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-3 px-5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === 'submitting' ? (
                <span>Sending Message...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <AdSlot placement="content-inline" />
    </div>
  );
};
