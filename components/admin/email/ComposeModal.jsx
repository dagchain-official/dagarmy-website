"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";

const IMG = 'https://dagarmy.network/mailer-DAGChain/images';

function buildTemplateHtml({ recipientName = 'Member', bannerHeadline, bannerSub, bodyHtml, ctaText, ctaUrl, priority = 'normal' }) {
  const priorityBadge = priority !== 'normal' ? `
    <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin:0 auto 12px;"><tr>
      <td align="center" style="padding:4px 16px;border-radius:20px;background:${priority==='urgent'?'#fee2e2':'#fef9c3'};border:1px solid ${priority==='urgent'?'#fca5a5':'#fde68a'};">
        <span style="font-size:11px;font-weight:700;font-family:Poppins,sans-serif;color:${priority==='urgent'?'#dc2626':'#d97706'};letter-spacing:1px;text-transform:uppercase;">${priority==='urgent'?'URGENT':'HIGH PRIORITY'}</span>
      </td></tr></table>` : '';

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
<style>body{font-family:Poppins,sans-serif;margin:0;font-size:14px;background:#f1f1f1;}</style>
</head><body>
<div style="background:#fff;width:100%;max-width:700px;margin:0 auto;font-family:Poppins,sans-serif;border:2px solid rgba(112,112,112,0.2);overflow:hidden;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%;"><tbody><tr><td>
    <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%;"><tbody>
      <tr><td background="${IMG}/bg_banner.png" valign="top" style="background-repeat:no-repeat;background-size:cover;height:417px;background-position:center top;">
        <table align="center" valign="top" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr><td style="text-align:center;padding:30px 8% 10px;">
            <a href="https://dagarmy.network" style="text-decoration:none;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr>
                <td style="vertical-align:middle;padding-right:10px;"><img src="https://dagarmy.network/images/logo/logo.png" alt="DAGARMY" width="36" height="36" style="display:block;border-radius:6px;"/></td>
                <td style="vertical-align:middle;"><span style="font-size:22px;font-weight:700;color:#fff;letter-spacing:1px;font-family:Poppins,sans-serif;">DAGChain</span></td>
              </tr></table>
            </a>
          </td></tr>
          <tr><td style="padding:0 8% 5px;">
            ${priorityBadge}
            <h2 style="font-size:32px;line-height:42px;color:#fff;font-weight:400;letter-spacing:-0.64px;text-shadow:rgba(241,179,243,0.8) 2px 2px 0px;text-align:center;margin:0 0 5px;">${bannerHeadline||'Message from DAGChain'}</h2>
            ${bannerSub?`<h3 style="font-size:20px;line-height:22px;color:#fff;font-weight:600;letter-spacing:-0.4px;font-family:Poppins,sans-serif;text-align:center;margin:0 0 30px;">${bannerSub}</h3>`:'<div style="margin-bottom:30px;"></div>'}
          </td></tr>
          <tr><td style="padding:50px 8% 40px;text-align:left;">
            <img src="${IMG}/img_banner.png" alt="Banner" style="width:100%;max-width:273px;object-fit:contain;display:inline-block;margin:0 0 0 70px;"/>
          </td></tr>
        </table>
      </td></tr>
      <tr><td background="${IMG}/bg1.png" style="background-repeat:no-repeat;background-size:auto;background-position:center bottom;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"><tr>
          <td style="padding:5px 8% 10px 8%;">
            <p style="font-size:30px;line-height:40px;font-weight:700;font-family:Outfit,sans-serif;color:#0022FD;margin:0 0 15px;">Dear ${recipientName},</p>
            <div style="font-size:14px;line-height:26px;font-weight:400;font-family:Poppins,sans-serif;color:#000;margin:0 0 25px;">${bodyHtml}</div>
            ${ctaText&&ctaUrl?`<table align="center" border="0" cellpadding="0" cellspacing="0" style="margin:10px 0 25px;"><tr><td align="center"><a href="${ctaUrl}" style="background-color:#4158f9;border-radius:8px;color:#fff;font-size:16px;font-weight:600;font-family:Poppins,sans-serif;text-decoration:none;display:inline-block;padding:14px 40px;">${ctaText}</a></td></tr></table>`:''}
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="background:#ffffff;padding:30px 8% 25px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr><td>
            <div style="background:#ffffff;border-radius:11px;padding:15px 10px;border:2px solid rgba(112,112,112,0.2);box-shadow:rgba(0,0,0,0.1) 2px 4px 3px;margin-bottom:25px;">
              <p style="font-size:13px;line-height:18px;font-weight:500;color:#000000;text-align:center;margin:0;">This Is An Automated Message, Please Do Not Respond To This.</p>
            </div>
          </td></tr>
          <tr><td>
            <div style="width:160px;display:inline-block;text-align:left;margin:0;vertical-align:middle;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td>
                <table><tbody><tr>
                  <td style="background-color:#F0F1FE;width:127px;height:127px;line-height:127px;border-radius:100px;text-align:center;">
                    <img src="${IMG}/logo_dagchain_sm.png" alt="DAGChain" style="width:66px;object-fit:contain;display:inline-block;vertical-align:middle;margin:0;">
                  </td>
                </tr></tbody></table>
              </td></tr></tbody></table>
            </div>
            <div style="width:100%;max-width:400px;display:inline-block;margin:5px 0;vertical-align:middle;text-align:left;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td>
                <table><tbody>
                  <tr><td style="padding:0;">
                    <p style="width:100%;font-size:14px;line-height:26px;font-weight:700;font-family:'Poppins',sans-serif;color:#0022FD;margin:0;display:inline-block;">Warm Regards,</p>
                    <p style="width:100%;font-size:20px;line-height:24px;font-weight:600;font-family:'Poppins',sans-serif;color:#000000;margin:0;display:inline-block;">DAGChain Support Team</p>
                    <p style="width:100%;font-size:14px;line-height:22px;font-weight:500;font-family:'Poppins',sans-serif;color:#000000;margin:0 0 7px;display:inline-block;">DAGChain | DAG Army</p>
                    <p style="width:100%;margin:0;">
                      <img src="${IMG}/icon_web.png" alt="" style="width:14px;object-fit:contain;display:inline-block;float:left;vertical-align:middle;margin:0 7px 5px 0;">
                      <a href="https://www.dagchain.network" style="font-size:12px;line-height:12px;font-weight:500;font-family:'Poppins',sans-serif;color:#000000;margin:0 0 5px;text-decoration:none;float:left;">www.dagchain.network</a>
                      <span style="font-size:12px;line-height:12px;font-weight:500;font-family:'Poppins',sans-serif;color:#000000;float:left;margin:0 7px 5px;">|</span>
                      <a href="https://dagarmy.network" style="font-size:12px;line-height:12px;font-weight:500;font-family:'Poppins',sans-serif;color:#000000;margin:0 0 5px;text-decoration:none;float:left;">www.dagarmy.network</a>
                    </p>
                  </td></tr>
                  <tr><td>
                    <a href="https://www.linkedin.com/company/dag-chain" target="_blank" style="text-decoration:none;display:inline-block;margin:0 5px 5px;vertical-align:middle;"><img src="${IMG}/icon_linkedin.png" alt="LinkedIn" style="display:inline-block;vertical-align:middle;"></a>
                    <a href="https://www.facebook.com/people/DagChain/61584495032870/" target="_blank" style="text-decoration:none;display:inline-block;margin:0 5px 5px;vertical-align:middle;"><img src="${IMG}/icon_facebook.png" alt="Facebook" style="display:inline-block;vertical-align:middle;"></a>
                    <a href="https://x.com/dagchain_ai" target="_blank" style="text-decoration:none;display:inline-block;margin:0 5px 5px;vertical-align:middle;"><img src="${IMG}/icon_twitter.png" alt="X" style="display:inline-block;vertical-align:middle;"></a>
                    <a href="https://www.instagram.com/dagchain.network/" target="_blank" style="text-decoration:none;display:inline-block;margin:0 5px 5px;vertical-align:middle;"><img src="${IMG}/icon_instagrame.png" alt="Instagram" style="display:inline-block;vertical-align:middle;"></a>
                    <a href="https://www.pinterest.com/DAGCHAIN/" target="_blank" style="text-decoration:none;display:inline-block;margin:0 5px 5px;vertical-align:middle;"><img src="${IMG}/icon_pintrest.png" alt="Pinterest" style="display:inline-block;vertical-align:middle;"></a>
                    <a href="https://www.youtube.com/@dagchain.network" target="_blank" style="text-decoration:none;display:inline-block;margin:0 5px 5px;vertical-align:middle;"><img src="${IMG}/icon_youtube.png" alt="YouTube" style="display:inline-block;vertical-align:middle;"></a>
                  </td></tr>
                </tbody></table>
              </td></tr></tbody></table>
            </div>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="background:#F7F7F7;padding:25px 8%;">
        <p style="font-size:10px;line-height:18px;font-weight:400;font-family:'Poppins',sans-serif;color:#747474;text-align:left;margin:0;">
          <strong style="color:#000000;font-weight:600;">Disclaimer :</strong> This message contains confidential information and is intended only for the individual named. If you are not the ${recipientName} named addressee you should not disseminate, distribute or copy this e-mail. You cannot use or forward any attachments in the email. Please notify the sender immediately by e-mail if you have received this e-mail by mistake and delete this e-mail from your system.
        </p>
      </td></tr>
      <tr><td><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"><tr>
        <td height="6px" style="background-color:#4158f9;"></td><td height="6px" style="background-color:#f1b3f3;"></td>
        <td height="6px" style="background-color:#4158f9;"></td><td height="6px" style="background-color:#f1b3f3;"></td>
      </tr></table></td></tr>
      <tr><td style="background:#fff;text-align:center;padding:25px 10% 10px;">
        <p style="font-size:12px;color:#4158F9;font-weight:600;font-family:'Poppins',sans-serif;margin:0;text-align:center;">${new Date().getFullYear()}, DAGChain &amp; Its Affiliates. All Rights Reserved.</p>
        <p style="font-size:12px;color:#000000;font-weight:600;font-family:'Poppins',sans-serif;margin:0 0 8px;text-align:center;">Powered by</p>
        <a href="https://www.dagchain.network" style="display:inline-block;margin:0 10px 10px;"><img src="${IMG}/logo_dagchain2.png" alt="DAGChain" style="width:100%;max-width:85px;object-fit:contain;display:inline-block;"/></a>
        <a href="https://dagarmy.network" style="display:inline-block;margin:0 10px 10px;"><img src="${IMG}/logo_dagarmy.png" alt="DAG Army" style="width:100%;max-width:76px;object-fit:contain;display:inline-block;"/></a>
        <a href="https://daggpt.network" style="display:inline-block;margin:0 10px 10px;"><img src="${IMG}/logo_daggpt.png" alt="DAGGPT" style="width:100%;max-width:85px;object-fit:contain;display:inline-block;"/></a>
      </td></tr>
    </tbody></table>
  </td></tr></tbody></table>
</div>
</body></html>`;
}

const IcoSend   = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IcoClose  = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoMin    = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcoAttach = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>;
const IcoX = <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoFile = <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;

function ToolBtn({ label, onAction, style: extraStyle = {} }) {
  return (
    <button
      onMouseDown={e => { e.preventDefault(); onAction(); }}
      style={{
        height: '26px', padding: '0 8px',
        border: '1px solid #e2e8f0', borderRadius: '5px',
        background: '#fff', cursor: 'pointer',
        fontSize: '12px', color: '#475569', fontWeight: '600',
        transition: 'all 0.15s', ...extraStyle,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#94a3b8'; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
    >
      {label}
    </button>
  );
}

export default function ComposeModal({
  onClose,
  onSent,
  defaultTo = '',
  defaultSubject = '',
  defaultHtml = '',
  replyMode = false,
}) {
  const [to, setTo] = useState(defaultTo);
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState(defaultSubject);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [enhancing, setEnhancing] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [signature, setSignature] = useState('');
  const [sigEnabled, setSigEnabled] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [useTemplate, setUseTemplate]   = useState(false);
  const [recipientName, setRecipientName]   = useState('');
  const [bannerHeadline, setBannerHeadline] = useState('');
  const [bannerSub, setBannerSub]           = useState('');
  const [ctaText, setCtaText]               = useState('');
  const [ctaUrl, setCtaUrl]                 = useState('');
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const previewIframeRef = useRef(null);

  useEffect(() => {
    fetch('/api/admin/email/signature')
      .then(r => r.json())
      .then(d => { if (d.signature) setSignature(d.signature); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;
    const body = defaultHtml || '';
    const sig = signature && sigEnabled
      ? `<br/><br/><div data-signature="1" style="border-top:1px solid #e8edf5;margin-top:16px;padding-top:14px;">${signature}</div>`
      : '';
    editorRef.current.innerHTML = body + sig;
  }, [defaultHtml, signature, sigEnabled]);

  const exec = (cmd, val) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
  };

  const MAX_TOTAL_SIZE = 15 * 1024 * 1024; // 15 MB

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => {
      const existing = new Set(prev.map(f => f.name + f.size));
      const newFiles = files.filter(f => !existing.has(f.name + f.size));
      const combined = [...prev, ...newFiles];
      const totalSize = combined.reduce((sum, f) => sum + f.size, 0);
      if (totalSize > MAX_TOTAL_SIZE) {
        setError(`Total attachment size cannot exceed 15 MB (current: ${(totalSize / 1048576).toFixed(1)} MB)`);
        return prev;
      }
      setError('');
      return combined;
    });
    e.target.value = '';
  };

  const removeAttachment = (idx) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleEnhance = async () => {
    const rawText = editorRef.current?.innerText?.trim();
    if (!rawText) { setError('Write a message first before enhancing.'); return; }
    setEnhancing(true);
    setError('');
    try {
      const res = await fetch('/api/admin/enhance-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText, type: 'body' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Enhancement failed');
      if (editorRef.current) {
        editorRef.current.innerText = data.enhanced;
      }
    } catch (err) {
      setError(err.message || 'Enhancement failed. Please try again.');
    } finally {
      setEnhancing(false);
    }
  };

  const handleEnhanceSubject = async () => {
    if (!subject.trim()) { setError('Write a subject first before enhancing.'); return; }
    setEnhancing(true);
    setError('');
    try {
      const res = await fetch('/api/admin/enhance-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: subject, type: 'title' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Enhancement failed');
      setSubject(data.enhanced);
    } catch (err) {
      setError(err.message || 'Enhancement failed. Please try again.');
    } finally {
      setEnhancing(false);
    }
  };

  const getEmailHtml = useCallback(() => {
    const rawHtml = editorRef.current?.innerHTML || '';
    if (!useTemplate) return rawHtml;
    return buildTemplateHtml({
      recipientName: recipientName.trim() || 'Member',
      bannerHeadline,
      bannerSub,
      bodyHtml: rawHtml,
      ctaText,
      ctaUrl,
    });
  }, [useTemplate, to, recipientName, bannerHeadline, bannerSub, ctaText, ctaUrl]);

  const handlePreview = () => {
    setShowEmailPreview(true);
    setTimeout(() => {
      const doc = previewIframeRef.current?.contentDocument || previewIframeRef.current?.contentWindow?.document;
      if (doc) { doc.open(); doc.write(getEmailHtml()); doc.close(); }
    }, 80);
  };

  const handleSend = async () => {
    if (!to.trim()) { setError('Recipient is required'); return; }
    if (!subject.trim()) { setError('Subject is required'); return; }
    const html = editorRef.current?.innerHTML || '';
    if (!html.replace(/<[^>]+>/g, '').trim()) { setError('Message body is required'); return; }

    setSending(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('to', JSON.stringify(to.split(',').map(s => s.trim()).filter(Boolean)));
      formData.append('cc', JSON.stringify(cc ? cc.split(',').map(s => s.trim()).filter(Boolean) : []));
      formData.append('bcc', JSON.stringify(bcc ? bcc.split(',').map(s => s.trim()).filter(Boolean) : []));
      formData.append('subject', subject);
      formData.append('html', getEmailHtml());
      attachments.forEach(file => formData.append('attachments', file));

      const res = await fetch('/api/admin/email/send', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) { onSent?.(); onClose(); }
      else setError(data.error || 'Failed to send');
    } catch { setError('Network error — please try again'); }
    finally { setSending(false); }
  };

  // ── Minimized pill ──────────────────────────────────────────────────────────
  if (minimized) {
    return (
      <div
        onClick={() => setMinimized(false)}
        style={{
          position: 'fixed', bottom: 0, right: '32px', width: '320px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          borderRadius: '14px 14px 0 0',
          padding: '13px 18px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', zIndex: 9999, cursor: 'pointer',
          boxShadow: '0 -4px 24px rgba(99,102,241,0.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          <span style={{ color: '#fff', fontSize: '13px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {subject || 'New Message'}
          </span>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onClose(); }}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px 6px', marginLeft: '8px', flexShrink: 0, borderRadius: '6px', display: 'flex', alignItems: 'center' }}
        >
          {IcoClose}
        </button>
      </div>
    );
  }

  // ── Full compose window ─────────────────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', bottom: 0, right: '32px', width: '580px',
      background: '#fff', borderRadius: '16px 16px 0 0',
      boxShadow: '0 -8px 60px rgba(99,102,241,0.15), 0 -2px 20px rgba(0,0,0,0.08)',
      zIndex: 9999,
      display: 'flex', flexDirection: 'column', maxHeight: '84vh',
      border: '1.5px solid #e8edf5', borderBottom: 'none',
    }}>

      {/* Title bar */}
      <div
        onClick={() => setMinimized(true)}
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          borderRadius: '14px 14px 0 0',
          padding: '13px 18px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', cursor: 'pointer', flexShrink: 0,
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          <span style={{ color: '#fff', fontSize: '13px', fontWeight: '700', letterSpacing: '0.1px' }}>
            {replyMode ? 'Reply' : 'New Message'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}>
          <button onClick={() => setMinimized(true)}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', padding: '5px 6px', display: 'flex', alignItems: 'center', borderRadius: '7px', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>{IcoMin}</button>
          <button onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', padding: '5px 6px', display: 'flex', alignItems: 'center', borderRadius: '7px', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>{IcoClose}</button>
        </div>
      </div>

      {/* Address fields */}
      <div style={{ flexShrink: 0, borderBottom: '1px solid #f1f5f9' }}>
        {[
          { label: 'To',      value: to,      setter: setTo,      always: true },
          { label: 'Cc',      value: cc,      setter: setCc,      always: showCc },
          { label: 'Bcc',     value: bcc,     setter: setBcc,     always: showBcc },
          { label: 'Subject', value: subject, setter: setSubject, always: true },
        ].filter(f => f.always).map(f => (
          <div key={f.label} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #f8fafc', padding: '0 18px' }}>
            <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#94a3b8', width: '52px', flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              {f.label}
            </span>
            <input
              value={f.value}
              onChange={e => f.setter(e.target.value)}
              placeholder={f.label === 'To' ? 'Recipients, comma-separated' : f.label === 'Subject' ? 'Email subject' : ''}
              style={{
                flex: 1, border: 'none', outline: 'none',
                padding: '11px 0', fontSize: '13px', color: '#0f172a',
                background: 'transparent',
                fontWeight: f.label === 'Subject' ? '600' : '400',
              }}
            />
            {f.label === 'To' && (
              <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                {!showCc  && <button onClick={() => setShowCc(true)}  style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: '10.5px', color: '#64748b', fontWeight: '700', padding: '3px 8px', borderRadius: '6px' }}>Cc</button>}
                {!showBcc && <button onClick={() => setShowBcc(true)} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: '10.5px', color: '#64748b', fontWeight: '700', padding: '3px 8px', borderRadius: '6px' }}>Bcc</button>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Template toggle bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 18px', borderBottom: '1px solid #f1f5f9',
        background: useTemplate ? '#f5f3ff' : '#fafbff', flexShrink: 0,
        transition: 'background 0.2s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={useTemplate ? '#6366f1' : '#94a3b8'} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          <span style={{ fontSize: '11.5px', fontWeight: '700', color: useTemplate ? '#6366f1' : '#94a3b8', letterSpacing: '0.2px' }}>
            {useTemplate ? 'Branded Template Active' : 'Plain Email'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {useTemplate && (
            <button onClick={handlePreview} style={{
              padding: '5px 12px', border: '1.5px solid #c4b5fd', borderRadius: '7px',
              background: '#ede9fe', color: '#7c3aed', fontSize: '11.5px', fontWeight: '700',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Preview Email
            </button>
          )}
          <button
            onClick={() => setUseTemplate(v => !v)}
            style={{
              padding: '5px 12px', borderRadius: '7px', cursor: 'pointer',
              border: `1.5px solid ${useTemplate ? '#a5b4fc' : '#e2e8f0'}`,
              background: useTemplate ? '#eef2ff' : '#fff',
              color: useTemplate ? '#6366f1' : '#64748b',
              fontSize: '11.5px', fontWeight: '700', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {useTemplate
                ? <polyline points="20 6 9 17 4 12"/>
                : <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>}
            </svg>
            {useTemplate ? 'Template On' : 'Use Template'}
          </button>
        </div>
      </div>

      {/* Template extra fields */}
      {useTemplate && (
        <div style={{
          padding: '12px 18px', borderBottom: '1px solid #f1f5f9',
          background: '#faf9ff', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Recipient Name *</label>
              <input
                value={recipientName} onChange={e => setRecipientName(e.target.value)}
                placeholder="e.g. John Smith"
                style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', border: '1.5px solid #ddd6fe', borderRadius: '7px', fontSize: '12.5px', color: '#0f172a', outline: 'none', background: '#fff' }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#ddd6fe'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Banner Headline *</label>
              <input
                value={bannerHeadline} onChange={e => setBannerHeadline(e.target.value)}
                placeholder="e.g. Important Update"
                style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', border: '1.5px solid #ddd6fe', borderRadius: '7px', fontSize: '12.5px', color: '#0f172a', outline: 'none', background: '#fff' }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#ddd6fe'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Banner Sub-line</label>
              <input
                value={bannerSub} onChange={e => setBannerSub(e.target.value)}
                placeholder="e.g. FROM DAG ARMY HR"
                style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', border: '1.5px solid #ddd6fe', borderRadius: '7px', fontSize: '12.5px', color: '#0f172a', outline: 'none', background: '#fff' }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#ddd6fe'}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>CTA Button Label</label>
              <input
                value={ctaText} onChange={e => setCtaText(e.target.value)}
                placeholder="e.g. Visit Dashboard"
                style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', border: '1.5px solid #ddd6fe', borderRadius: '7px', fontSize: '12.5px', color: '#0f172a', outline: 'none', background: '#fff' }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#ddd6fe'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>CTA Button URL</label>
              <input
                value={ctaUrl} onChange={e => setCtaUrl(e.target.value)}
                placeholder="https://dagarmy.network"
                style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', border: '1.5px solid #ddd6fe', borderRadius: '7px', fontSize: '12.5px', color: '#0f172a', outline: 'none', background: '#fff' }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#ddd6fe'}
              />
            </div>
          </div>
        </div>
      )}

      {/* Formatting toolbar */}
      <div style={{
        display: 'flex', gap: '3px', padding: '7px 16px',
        borderBottom: '1px solid #f1f5f9', flexShrink: 0, flexWrap: 'wrap',
        alignItems: 'center', background: '#fafbff',
      }}>
        <ToolBtn label="B" onAction={() => exec('bold')}      style={{ fontWeight: '800' }} />
        <ToolBtn label="I" onAction={() => exec('italic')}    style={{ fontStyle: 'italic' }} />
        <ToolBtn label="U" onAction={() => exec('underline')} style={{ textDecoration: 'underline' }} />
        <div style={{ width: '1px', height: '18px', background: '#e8edf5', margin: '0 3px' }}/>
        <ToolBtn label="H1" onAction={() => exec('formatBlock', 'h1')} />
        <ToolBtn label="H2" onAction={() => exec('formatBlock', 'h2')} />
        <ToolBtn label="P"  onAction={() => exec('formatBlock', 'p')} />
        <div style={{ width: '1px', height: '18px', background: '#e8edf5', margin: '0 3px' }}/>
        <ToolBtn label="UL" onAction={() => exec('insertUnorderedList')} />
        <ToolBtn label="OL" onAction={() => exec('insertOrderedList')} />
        <div style={{ width: '1px', height: '18px', background: '#e8edf5', margin: '0 3px' }}/>
        <ToolBtn label="Link" onAction={() => {
          const url = window.prompt('Enter URL:');
          if (url) exec('createLink', url);
        }} />
        <ToolBtn label="Clear" onAction={() => exec('removeFormat')} />
      </div>

      {/* Rich text editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Write your message here..."
        style={{
          flex: 1, padding: '18px 20px', fontSize: '14px', color: '#0f172a',
          outline: 'none', overflowY: 'auto', minHeight: '200px',
          lineHeight: '1.7', background: '#fff',
        }}
      />

      {/* Attachment list */}
      {attachments.length > 0 && (
        <div style={{
          padding: '8px 18px 10px', borderTop: '1px solid #f1f5f9',
          display: 'flex', flexWrap: 'wrap', gap: '6px', flexShrink: 0,
          background: '#fafbff',
        }}>
          {attachments.map((file, idx) => (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '5px 8px 5px 10px',
              background: '#fff', border: '1.5px solid #e8edf5', borderRadius: '8px',
              fontSize: '12px', color: '#334155', fontWeight: '500',
              maxWidth: '220px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <span style={{ color: '#6366f1', flexShrink: 0, display: 'flex' }}>{IcoFile}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                {file.name}
              </span>
              <span style={{ color: '#94a3b8', flexShrink: 0, fontSize: '10.5px', fontWeight: '500' }}>
                {formatSize(file.size)}
              </span>
              <button
                onClick={() => removeAttachment(idx)}
                style={{
                  background: '#f1f5f9', border: 'none', cursor: 'pointer',
                  color: '#94a3b8', padding: '2px', display: 'flex',
                  alignItems: 'center', flexShrink: 0, borderRadius: '4px',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#94a3b8'; }}
              >
                {IcoX}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding: '11px 18px', borderTop: '1px solid #f1f5f9',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, background: '#fff', gap: '10px',
      }}>
        <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
          <button
            onClick={handleSend}
            disabled={sending}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 22px',
              background: sending ? '#94a3b8' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              border: 'none', borderRadius: '10px', color: '#fff',
              fontSize: '13px', fontWeight: '700',
              cursor: sending ? 'not-allowed' : 'pointer',
              boxShadow: sending ? 'none' : '0 4px 14px rgba(99,102,241,0.35)',
              transition: 'all 0.2s', letterSpacing: '0.1px',
            }}
            onMouseEnter={e => { if (!sending) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(99,102,241,0.45)'; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = sending ? 'none' : '0 4px 14px rgba(99,102,241,0.35)'; }}
          >
            {IcoSend}
            {sending ? 'Sending...' : 'Send'}
          </button>
          <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} />
          {signature && (
            <button
              title={sigEnabled ? 'Signature is ON — click to remove from this email' : 'Signature is OFF — click to add to this email'}
              onClick={() => {
                setSigEnabled(v => !v);
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '9px 13px', borderRadius: '10px',
                border: `1.5px solid ${sigEnabled ? '#a5b4fc' : '#e2e8f0'}`,
                background: sigEnabled ? '#eef2ff' : '#f8faff',
                color: sigEnabled ? '#6366f1' : '#94a3b8',
                fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#a5b4fc'; e.currentTarget.style.color = '#6366f1'; }}
              onMouseLeave={e => {
                e.currentTarget.style.background = sigEnabled ? '#eef2ff' : '#f8faff';
                e.currentTarget.style.borderColor = sigEnabled ? '#a5b4fc' : '#e2e8f0';
                e.currentTarget.style.color = sigEnabled ? '#6366f1' : '#94a3b8';
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              Sig
            </button>
          )}
          <button
            title="Attach file"
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 13px',
              background: attachments.length > 0 ? '#eef2ff' : '#f8faff',
              border: `1.5px solid ${attachments.length > 0 ? '#a5b4fc' : '#e8edf5'}`,
              borderRadius: '10px',
              color: attachments.length > 0 ? '#6366f1' : '#64748b',
              cursor: 'pointer', transition: 'all 0.15s', fontSize: '12px', fontWeight: '600',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#a5b4fc'; e.currentTarget.style.color = '#6366f1'; }}
            onMouseLeave={e => {
              e.currentTarget.style.background = attachments.length > 0 ? '#eef2ff' : '#f8faff';
              e.currentTarget.style.borderColor = attachments.length > 0 ? '#a5b4fc' : '#e8edf5';
              e.currentTarget.style.color = attachments.length > 0 ? '#6366f1' : '#64748b';
            }}
          >
            {IcoAttach}
            {attachments.length > 0 ? `${attachments.length} file${attachments.length > 1 ? 's' : ''}` : 'Attach'}
          </button>
          <button
            title="Fix spelling, grammar & make it professional"
            onClick={handleEnhance}
            disabled={enhancing}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 13px',
              background: enhancing ? '#eef2ff' : '#f8faff',
              border: '1.5px solid #c7d2fe',
              borderRadius: '10px',
              color: '#6366f1',
              cursor: enhancing ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s', fontSize: '12px', fontWeight: '700',
            }}
            onMouseEnter={e => { if (!enhancing) { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#a5b4fc'; }}}
            onMouseLeave={e => { if (!enhancing) { e.currentTarget.style.background = '#f8faff'; e.currentTarget.style.borderColor = '#c7d2fe'; }}}
          >
            {enhancing ? (
              <div style={{ width: '12px', height: '12px', border: '2px solid #c7d2fe', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {enhancing ? 'Enhancing...' : 'Enhance'}
          </button>
        </div>

        {error && (
          <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600', flex: 1, textAlign: 'center', padding: '0 8px' }}>
            {error}
          </span>
        )}

        <button
          onClick={onClose}
          title="Discard draft"
          style={{
            background: '#f8fafc', border: '1.5px solid #e8edf5', cursor: 'pointer',
            color: '#94a3b8', padding: '7px', display: 'flex', alignItems: 'center',
            transition: 'all 0.15s', borderRadius: '9px',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.color = '#94a3b8'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>

      {/* Email Preview Modal */}
      {showEmailPreview && (
        <div
          onClick={() => setShowEmailPreview(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)',
            zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '760px',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 20px', borderBottom: '1px solid #e8edf5',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: '700' }}>Email Preview — Branded Template</span>
              </div>
              <button onClick={() => setShowEmailPreview(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', padding: '5px 6px', borderRadius: '7px', display: 'flex', alignItems: 'center' }}>
                {IcoClose}
              </button>
            </div>
            <iframe
              ref={previewIframeRef}
              title="Email Preview"
              style={{ flex: 1, border: 'none', width: '100%', minHeight: '500px' }}
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      )}

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
