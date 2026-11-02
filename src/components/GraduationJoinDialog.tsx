'use client';

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type MouseEvent } from 'react';
import NeoAsis from '@/components/NeoAsis';
import { checkGuestName, sendGuestResponse } from '@/services/graduationService';
import { GRADUATION_CONFIG as CONFIG, GUEST_INPUT_MAX_LENGTH, WISH_MAX_LENGTH } from '@/shared/graduationConfig';
import { GraduationJoinDialogProps } from '@/shared/interfaces';
import { nunito } from '@/shared/fonts';
import { NeoChatLine, NeoMood } from '@/shared/types';

type Step = 'name' | 'rsvp' | 'wish' | 'done';

const SAVED_NAME_KEY = 'graduation-guest-name';
const TYPING_MS = 650;

const STATUS: Record<NeoMood, string> = {
  greet: 'Đang chờ bạn…',
  think: 'Đang suy nghĩ…',
  answer: 'Đang trả lời…',
  happy: 'Vui quá trời!',
  sorry: 'Hơi buồn xíu…',
  smug: 'Đang nhìn bạn đầy nghi ngờ…',
};

const INTRO = ['Chào bạn! Tui là Neo Asis, trợ lý của Nhựt nè.', 'Trước khi vào tiệc, cho tui hỏi: bạn là ai vậy?'];

const NAME_ERRORS = [
  'Hứ, cái đó mà là tên hả? Nhập tên thật đi, tui mới biết bạn là ai chứ!',
  'Tui là rồng chứ đâu phải thầy bói. Tên thật của bạn đâu?',
  'Xì… tên gì kỳ cục vậy. Nghiêm túc lại giùm tui cái!',
];

const WISH_NUDGES = [
  'Ê, chúc cho đàng hoàng coi! Viết lại lời chúc tử tế giúp tui nha.',
  'Lời chúc gì kỳ vậy? Nhựt sắp tốt nghiệp đó, chúc cho dễ thương chút đi!',
  'Hông được đâu nha. Viết lại một lời chúc tử tế hơn giùm tui!',
];

const NETWORK_ERROR = 'Ui, kết nối đang trục trặc rồi. Bạn thử lại giúp tui nhé!';

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const pickFallback = (messages: string[], previous: string) => {
  const options = messages.filter((message) => message !== previous);
  return options[Math.floor(Math.random() * options.length)];
};

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

const SendButton = ({ disabled }: { disabled: boolean }) => (
  <button type="submit" className="neo-chat-send" aria-label="Gửi" disabled={disabled}>
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
);

const GraduationJoinDialog = ({ open, guestName, onClose, onWish }: GraduationJoinDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const session = useRef(0);
  const [step, setStep] = useState<Step>('name');
  const [mood, setMood] = useState<NeoMood>('greet');
  const [lines, setLines] = useState<NeoChatLine[]>([]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState('');
  const [name, setName] = useState('');
  const [attending, setAttending] = useState(true);
  const [sentWish, setSentWish] = useState(false);

  const addLines = (from: NeoChatLine['from'], texts: string[]) =>
    setLines((current) => [...current, ...texts.map((text) => ({ from, text }))]);

  const assistantSays = async (texts: string[], nextMood: NeoMood) => {
    const current = session.current;
    setTyping(true);
    await wait(TYPING_MS);
    if (current !== session.current) return;
    setTyping(false);
    setMood(nextMood);
    addLines('assistant', texts);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      session.current += 1;
      setStep('name');
      setMood('greet');
      setLines([]);
      setTyping(false);
      setSentWish(false);
      setDraft(readSavedName() || guestName);
      dialog.showModal();
      assistantSays(INTRO, 'greet');
    }
    if (!open && dialog.open) dialog.close();
  }, [open, guestName]);

  useEffect(() => {
    if (open && !typing) composerRef.current?.querySelector<HTMLElement>('input, textarea, button:not([disabled])')?.focus();
  }, [open, step, typing]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines, typing]);

  const closeOnBackdrop = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const submitOnEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  const lastAssistantLine = () => [...lines].reverse().find((line) => line.from === 'assistant')?.text ?? '';

  const submitName = async (e: FormEvent) => {
    e.preventDefault();
    const value = normalize(draft);
    if (!value || typing) return;

    const current = session.current;
    const previous = lastAssistantLine();
    addLines('user', [value]);
    setDraft('');
    setMood('think');
    setTyping(true);
    try {
      const review = await checkGuestName(value);
      if (current !== session.current) return;
      if (review.valid) {
        setName(value);
        setStep('rsvp');
        await assistantSays(
          [review.reply || `Chào ${value}!`, `Bạn có tới chung vui cùng Nhựt lúc ${CONFIG.gio}, ${CONFIG.ngay} không?`],
          'happy'
        );
      } else {
        await assistantSays([review.reply || pickFallback(NAME_ERRORS, previous)], 'smug');
      }
    } catch {
      await assistantSays([NETWORK_ERROR], 'sorry');
    }
  };

  const chooseAttending = (value: boolean) => {
    setAttending(value);
    setStep('wish');
    addLines('user', [value ? 'Oke, tham gia cùng Nhựt!' : 'Tui bận mất rồi…']);
    assistantSays(
      value
        ? ['Tuyệt vời! Nhựt mà biết chắc vui lắm luôn.', 'Gửi Nhựt một lời chúc nhé?']
        : ['Tiếc ghê… nhưng không sao đâu!', 'Vậy gửi Nhựt một lời chúc nhé?'],
      value ? 'happy' : 'sorry'
    );
  };

  const changeName = () => {
    setStep('name');
    setDraft(name);
    addLines('user', ['Khoan, tui nhập lộn tên…']);
    assistantSays(['Vậy rốt cuộc bạn là ai?'], 'think');
  };

  const send = async (text: string) => {
    if (typing) return;
    const current = session.current;
    const previous = lastAssistantLine();
    addLines('user', [text || 'Thôi, để dịp khác nha.']);
    setMood('think');
    setTyping(true);
    try {
      const result = await sendGuestResponse({ name, attending, wish: text });
      if (current !== session.current) return;
      if (!result.valid) {
        setDraft('');
        await assistantSays([result.reply || pickFallback(WISH_NUDGES, previous)], 'smug');
        return;
      }
      saveName(name);
      if (text) onWish({ name, wish: text });
      setSentWish(Boolean(text));
      setDraft('');
      setStep('done');
      await assistantSays(
        [
          attending
            ? `Cảm ơn ${name}! Hẹn gặp bạn lúc ${CONFIG.gio}, ${CONFIG.ngay} tại ${CONFIG.diaDiem} nha.`
            : `Cảm ơn ${name}! Tui sẽ chuyển lời của bạn tới Nhựt liền.`,
        ],
        'happy'
      );
    } catch {
      await assistantSays([NETWORK_ERROR], 'sorry');
    }
  };

  const submitWish = (e: FormEvent) => {
    e.preventDefault();
    const text = normalize(draft);
    if (text) send(text);
  };

  const finish = () => {
    onClose();
    document.getElementById('loi-chuc')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <dialog
      ref={dialogRef}
      className={`grad-chat neo-chat ${nunito.className}`}
      aria-labelledby="grad-chat-title"
      onClose={onClose}
      onClick={closeOnBackdrop}
    >
      <div className="grad-chat-stage">
        <div key={mood} className="neo-chat-mascot grad-chat-mascot">
          <NeoAsis mood={mood} />
        </div>

        <div className="neo-chat-card">
          <header className="neo-chat-header">
            <h2 id="grad-chat-title" className="neo-chat-name">Neo Asis</h2>
            <p className="neo-chat-status">
              <span className="neo-chat-dot" aria-hidden="true" />
              {STATUS[mood]}
            </p>
            <button type="button" className="neo-chat-close" aria-label="Đóng" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div ref={logRef} className="neo-chat-log" role="log" aria-live="polite" aria-label="Trò chuyện với Neo Asis">
            {lines.map((line, index) => (
              <p key={index} className={`neo-chat-bubble is-${line.from}`}>{line.text}</p>
            ))}
            {typing && (
              <div className="neo-chat-bubble is-assistant is-typing" role="status" aria-label="Neo Asis đang gõ">
                <span /><span /><span />
              </div>
            )}
          </div>

          <div ref={composerRef} className="neo-chat-composer">
            {step === 'name' && (
              <form className="neo-chat-form" onSubmit={submitName}>
                <input
                  className="neo-chat-field"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  maxLength={GUEST_INPUT_MAX_LENGTH}
                  placeholder="Nhập tên của bạn…"
                  autoComplete="name"
                  aria-label="Tên của bạn"
                  disabled={typing}
                />
                <SendButton disabled={typing || !draft.trim()} />
              </form>
            )}

            {step === 'rsvp' && (
              <>
                <div className="neo-chat-choices is-stacked">
                  <button type="button" className="neo-chat-choice is-primary" disabled={typing} onClick={() => chooseAttending(true)}>
                    Oke, tham gia cùng Nhựt
                  </button>
                  <button type="button" className="neo-chat-choice" disabled={typing} onClick={() => chooseAttending(false)}>
                    Tui bận mất rồi
                  </button>
                </div>
                <div className="neo-chat-meta">
                  <button type="button" className="neo-chat-link" disabled={typing} onClick={changeName}>
                    Đổi tên
                  </button>
                </div>
              </>
            )}

            {step === 'wish' && (
              <form onSubmit={submitWish}>
                <div className="neo-chat-form">
                  <textarea
                    className="neo-chat-field"
                    rows={2}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={submitOnEnter}
                    maxLength={WISH_MAX_LENGTH}
                    placeholder="Viết lời chúc của bạn…"
                    aria-label="Lời chúc"
                    disabled={typing}
                  />
                  <SendButton disabled={typing || !draft.trim()} />
                </div>
                <div className="neo-chat-meta">
                  <button type="button" className="neo-chat-link" disabled={typing} onClick={() => send('')}>
                    Bỏ qua
                  </button>
                  <span aria-hidden="true">{draft.length}/{WISH_MAX_LENGTH}</span>
                </div>
              </form>
            )}

            {step === 'done' && (
              <div className="neo-chat-choices">
                {sentWish && (
                  <button type="button" className="neo-chat-choice is-primary" disabled={typing} onClick={finish}>
                    Xem lời chúc
                  </button>
                )}
                <button type="button" className={`neo-chat-choice${sentWish ? '' : ' is-primary'}`} disabled={typing} onClick={onClose}>
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default GraduationJoinDialog;
