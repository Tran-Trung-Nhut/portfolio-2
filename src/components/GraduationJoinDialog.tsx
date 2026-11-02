'use client';

import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import { FaTimes } from 'react-icons/fa';
import { checkGuestName, sendGuestResponse } from '@/services/graduationService';
import { GRADUATION_CONFIG as CONFIG, NAME_MAX_LENGTH, WISH_MAX_LENGTH } from '@/shared/graduationConfig';
import { GraduationJoinDialogProps } from '@/shared/interfaces';

type Step = 'name' | 'rsvp' | 'wish' | 'done';

const SAVED_NAME_KEY = 'graduation-guest-name';
const NAME_ERROR = 'Bạn phải nhập tên của mình tui mới biết bạn là ai được chứ!';
const NETWORK_ERROR = 'Kết nối đang trục trặc, bạn thử lại giúp tui nhé.';

const readSavedName = () => {
  try {
    return window.localStorage.getItem(SAVED_NAME_KEY) || '';
  } catch {
    return '';
  }
};

const saveName = (name: string) => {
  try {
    window.localStorage.setItem(SAVED_NAME_KEY, name);
  } catch {
    return;
  }
};

const GraduationJoinDialog = ({ open, guestName, onClose, onWish }: GraduationJoinDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [attending, setAttending] = useState(true);
  const [wish, setWish] = useState('');
  const [sentWish, setSentWish] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setStep('name');
      setWish('');
      setError('');
      setName((current) => current || readSavedName() || guestName);
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
  }, [open, guestName]);

  useEffect(() => {
    if (open) dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
  }, [open, step, error]);

  const closeOnBackdrop = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const submitName = async (e: FormEvent) => {
    e.preventDefault();
    const value = name.replace(/\s+/g, ' ').trim();
    if (!value) return setError(NAME_ERROR);

    setBusy(true);
    setError('');
    try {
      if (await checkGuestName(value)) {
        setName(value);
        setStep('rsvp');
      } else {
        setError(NAME_ERROR);
      }
    } catch {
      setError(NETWORK_ERROR);
    } finally {
      setBusy(false);
    }
  };

  const chooseAttending = (value: boolean) => {
    setAttending(value);
    setStep('wish');
  };

  const send = async (text: string) => {
    setBusy(true);
    setError('');
    try {
      await sendGuestResponse({ name, attending, wish: text });
      saveName(name);
      if (text) onWish({ name, wish: text });
      setSentWish(Boolean(text));
      setStep('done');
    } catch {
      setError(NETWORK_ERROR);
    } finally {
      setBusy(false);
    }
  };

  const submitWish = (e: FormEvent) => {
    e.preventDefault();
    const text = wish.replace(/\s+/g, ' ').trim();
    if (text) send(text);
  };

  const finish = () => {
    onClose();
    if (sentWish) document.getElementById('loi-chuc')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <dialog
      ref={dialogRef}
      className="grad-join"
      aria-labelledby="grad-join-title"
      onClose={onClose}
      onClick={closeOnBackdrop}
    >
      <div className="grad-join-card">
        <div className="grad-join-bar">
          <div className="grad-dots" aria-hidden="true"><span></span><span></span><span></span></div>
          <span className="grad-join-file">tham_gia.ts</span>
          <button type="button" className="grad-join-close" aria-label="Đóng" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="grad-join-body">
          {step === 'name' && (
            <form onSubmit={submitName} noValidate>
              <p className="grad-join-prompt" aria-hidden="true"><b>$</b> whoami</p>
              <h2 id="grad-join-title" className="grad-join-title">Bạn là ai?</h2>
              <input
                data-autofocus
                className="grad-join-field"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                maxLength={NAME_MAX_LENGTH}
                placeholder="Nhập tên của bạn"
                autoComplete="name"
                aria-label="Tên của bạn"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'grad-join-error' : undefined}
              />
              {error && <p id="grad-join-error" className="grad-join-error" role="alert">{error}</p>}
              <div className="grad-join-actions">
                <button type="submit" className="grad-btn grad-btn-primary" disabled={busy}>
                  {busy ? 'Đang kiểm tra…' : 'Tiếp tục'}
                </button>
              </div>
            </form>
          )}

          {step === 'rsvp' && (
            <>
              <p className="grad-join-prompt" aria-hidden="true"><b>$</b> rsvp</p>
              <h2 id="grad-join-title" className="grad-join-title">Chào {name}!</h2>
              <p className="grad-join-text">
                Bạn sẽ tới chung vui cùng Nhựt lúc {CONFIG.gio}, {CONFIG.ngay} chứ?
              </p>
              <div className="grad-join-choices">
                <button data-autofocus type="button" className="grad-btn grad-btn-primary" onClick={() => chooseAttending(true)}>
                  Oke, tham gia cùng Nhựt
                </button>
                <button type="button" className="grad-btn" onClick={() => chooseAttending(false)}>
                  Tui bận mất rồi
                </button>
              </div>
              <button type="button" className="grad-join-link" onClick={() => setStep('name')}>
                Không phải {name}? Sửa tên
              </button>
            </>
          )}

          {step === 'wish' && (
            <form onSubmit={submitWish}>
              <p className="grad-join-prompt" aria-hidden="true"><b>$</b> gui-loi-chuc</p>
              <h2 id="grad-join-title" className="grad-join-title">
                {attending ? 'Tuyệt quá!' : 'Không sao đâu!'} Gửi Nhựt một lời chúc nhé
              </h2>
              <textarea
                data-autofocus
                className="grad-join-field"
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                maxLength={WISH_MAX_LENGTH}
                rows={4}
                placeholder="Viết lời chúc của bạn…"
                aria-label="Lời chúc"
              />
              <p className="grad-join-count" aria-hidden="true">{wish.length}/{WISH_MAX_LENGTH}</p>
              {error && <p className="grad-join-error" role="alert">{error}</p>}
              <div className="grad-join-actions">
                <button type="submit" className="grad-btn grad-btn-primary" disabled={busy || !wish.trim()}>
                  {busy ? 'Đang gửi…' : 'Gửi lời chúc'}
                </button>
                <button type="button" className="grad-btn grad-btn-ghost" disabled={busy} onClick={() => send('')}>
                  Bỏ qua
                </button>
              </div>
            </form>
          )}

          {step === 'done' && (
            <>
              <p className="grad-join-prompt" aria-hidden="true"><b>✓</b> đã lưu</p>
              <h2 id="grad-join-title" className="grad-join-title">Cảm ơn {name}!</h2>
              <p className="grad-join-text">
                {attending
                  ? `Hẹn gặp bạn lúc ${CONFIG.gio}, ${CONFIG.ngay} tại ${CONFIG.diaDiem} nhé.`
                  : 'Nhựt đã nhận được tấm lòng của bạn rồi.'}
              </p>
              <div className="grad-join-actions">
                <button data-autofocus type="button" className="grad-btn grad-btn-primary" onClick={finish}>
                  {sentWish ? 'Xem lời chúc' : 'Đóng'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default GraduationJoinDialog;
