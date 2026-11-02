'use client';

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type MouseEvent } from 'react';
import { NeoChatHeader, NeoChatLog, NeoChatMascot, NeoChatSend, NeoChatTyping } from '@/components/NeoChat';
import { checkGuestName, sendGuestResponse } from '@/services/graduationService';
import { nunito } from '@/shared/fonts';
import { GRADUATION_CONFIG as CONFIG, GUEST_INPUT_MAX_LENGTH, WISH_MAX_LENGTH } from '@/shared/graduationConfig';
import { GraduationJoinDialogProps } from '@/shared/interfaces';
import { NeoChatLine, NeoMood } from '@/shared/types';
import { cleanText, pickRandom, readStorage, writeStorage } from '@/shared/utils';

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

const INVITE_GREETINGS = [
  'Ồ, {name} tới rồi! Tui là Neo Asis, Nhựt dặn tui đón bạn tận cửa luôn đó.',
  'Chào {name}! Tui là Neo Asis, bạn là khách mời đặc biệt của Nhựt nè.',
  'A, {name}! Tui là Neo Asis, trợ lý của Nhựt. Nhựt mong bạn lắm luôn.',
];

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

const ASK_ATTENDANCE = `Bạn có tới chung vui cùng Nhựt lúc ${CONFIG.gio}, ${CONFIG.ngay} không?`;
const NETWORK_ERROR = 'Ui, kết nối đang trục trặc rồi. Bạn thử lại giúp tui nhé!';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const pickOther = (messages: string[], previous: string) => pickRandom(messages.filter((message) => message !== previous));

const GraduationJoinDialog = ({ open, invite, onClose, onWish }: GraduationJoinDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
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

  const lastAssistantLine = () => [...lines].reverse().find((line) => line.from === 'assistant')?.text ?? '';

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
      setMood('greet');
      setLines([]);
      setTyping(false);
      setSentWish(false);
      setDraft('');
      dialog.showModal();
      if (invite) {
        setName(invite.name);
        setStep('rsvp');
        assistantSays([pickRandom(INVITE_GREETINGS).replace('{name}', invite.name), ASK_ATTENDANCE], 'happy');
      } else {
        setStep('name');
        setDraft(readStorage('localStorage', SAVED_NAME_KEY) ?? '');
        assistantSays(INTRO, 'greet');
      }
    }
    if (!open && dialog.open) dialog.close();
  }, [open, invite]);

  useEffect(() => {
    if (open && !typing) composerRef.current?.querySelector<HTMLElement>('input, textarea, button:not([disabled])')?.focus();
  }, [open, step, typing]);

  const closeOnBackdrop = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const submitOnEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  const submitName = async (e: FormEvent) => {
    e.preventDefault();
    const value = cleanText(draft);
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
        await assistantSays([review.reply || `Chào ${value}!`, ASK_ATTENDANCE], 'happy');
      } else {
        await assistantSays([review.reply || pickOther(NAME_ERRORS, previous)], 'smug');
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
      const guest = invite ? { invite: invite.token } : { name };
      const result = await sendGuestResponse({ ...guest, attending, wish: text });
      if (current !== session.current) return;
      setDraft('');
      if (!result.valid) {
        await assistantSays([result.reply || pickOther(WISH_NUDGES, previous)], 'smug');
        return;
      }
      if (!invite) writeStorage('localStorage', SAVED_NAME_KEY, name);
      if (text) onWish({ name, wish: text });
      setSentWish(Boolean(text));
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
    const text = cleanText(draft);
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
        <NeoChatMascot mood={mood} className="grad-chat-mascot" />

        <div className="neo-chat-card">
          <NeoChatHeader titleId="grad-chat-title" status={STATUS[mood]} closeLabel="Đóng" onClose={onClose} />

          <NeoChatLog label="Trò chuyện với Neo Asis" scrollKey={`${lines.length}-${typing}`}>
            {lines.map((line, index) => (
              <p key={index} className={`neo-chat-bubble is-${line.from}`}>{line.text}</p>
            ))}
            {typing && <NeoChatTyping label="Neo Asis đang gõ" />}
          </NeoChatLog>

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
                <NeoChatSend label="Gửi" disabled={typing || !draft.trim()} />
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
                {!invite && (
                  <div className="neo-chat-meta">
                    <button type="button" className="neo-chat-link" disabled={typing} onClick={changeName}>
                      Đổi tên
                    </button>
                  </div>
                )}
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
                  <NeoChatSend label="Gửi" disabled={typing || !draft.trim()} />
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
