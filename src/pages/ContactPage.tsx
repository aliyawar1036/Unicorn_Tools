import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Loader2, ArrowUpRight } from 'lucide-react';
import { AdSlot } from '../components/AdSlot';

const SUPPORT_EMAIL = 'digital.future1543@gmail.com';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    websiteUrlHoneypot: '', // Invisible anti-bot field
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [lastSubmittedPayload, setLastSubmittedPayload] = useState<string>('');

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your full name.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address (e.g. name@example.com).';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Please select or enter an inquiry subject.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please type your message.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check honeypot for spam bots
    if (formData.websiteUrlHoneypot) {
      setStatus('success');
      setFeedbackMsg('Thank you! Your message has been received.');
      return;
    }

    if (!validate()) {
      setStatus('error');
      setFeedbackMsg('Please correct the highlighted fields before submitting.');
      return;
    }

    // Duplicate submission check
    const currentPayload = JSON.stringify({
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    });

    if (currentPayload === lastSubmittedPayload && status === 'success') {
      setStatus('error');
      setFeedbackMsg('You have already submitted this inquiry. If you have additional details, please edit your message.');
      return;
    }

    setStatus('submitting');
    setFeedbackMsg('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          honeypot: formData.websiteUrlHoneypot,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setStatus('success');
        setLastSubmittedPayload(currentPayload);
        setFeedbackMsg(
          data.message || `Thank you, ${formData.name.trim()}! Your message has been sent to our support team.`
        );
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          websiteUrlHoneypot: '',
        });
        setErrors({});
      } else {
        setStatus('error');
        setFeedbackMsg(
          data.error ||
            `Unable to dispatch inquiry automatically. Please contact us directly at ${SUPPORT_EMAIL}.`
        );
      }
    } catch (err: any) {
      setStatus('error');
      setFeedbackMsg(
        `Network error submitting inquiry. Please send your message directly to ${SUPPORT_EMAIL}.`
      );
    }
  };

  const getDirectMailtoUrl = () => {
    const sub = encodeURIComponent(formData.subject || 'UnicornTools Support Request');
    const body = encodeURIComponent(
      `Hello UnicornTools Team,\n\n${formData.message || ''}\n\nFrom: ${formData.name || ''}\nEmail: ${formData.email || ''}`
    );
    return `mailto:${SUPPORT_EMAIL}?subject=${sub}&body=${body}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Get in Touch
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Have a question, suggestion, or need help using UnicornTools? We&apos;re here to help! Contact our support team and we&apos;ll do our best to assist you.
        </p>
      </div>

      {/* Official Support Info Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center shrink-0 mt-0.5">
            <Mail className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Official Support Email
            </h2>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-sm sm:text-base font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
            >
              <span>{SUPPORT_EMAIL}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
              For support requests, feedback, bug reports, or business inquiries, feel free to reach out to us.
            </p>
          </div>
        </div>

        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="self-start md:self-center px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <Mail className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Email Support Directly</span>
        </a>
      </div>

      {/* Contact Form Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Send Us a Message
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fill in the details below and our team will get back to you promptly.
          </p>
        </div>

        {status === 'success' ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Message Sent
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              {feedbackMsg}
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus('idle');
                setFeedbackMsg('');
              }}
              className="mt-4 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {status === 'error' && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                    {feedbackMsg}
                  </p>
                </div>
                <a
                  href={getDirectMailtoUrl()}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg transition-colors inline-flex items-center gap-1 shrink-0 self-start sm:self-center"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send via Email Client</span>
                </a>
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
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  disabled={status === 'submitting'}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white ${
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
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  disabled={status === 'submitting'}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white ${
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
                Subject <span className="text-rose-500">*</span>
              </label>
              <select
                id="contact-subject"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                disabled={status === 'submitting'}
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white ${
                  errors.subject
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <option value="">Select an inquiry subject...</option>
                <option value="General Question">General Question</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Suggestion">Feature Suggestion</option>
                <option value="Support Request">Support Request</option>
                <option value="Business Inquiry">Business Inquiry</option>
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
                placeholder="How can we help you? Describe your question, request, or issue in detail..."
                disabled={status === 'submitting'}
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white ${
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
              className="w-full py-3 px-5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Message...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Message</span>
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
