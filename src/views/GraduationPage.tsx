import { GRADUATION_CONFIG as CONFIG } from '@/shared/graduationConfig';
import { GraduationPageProps } from '@/shared/interfaces';
import GraduationCountdown from '@/components/GraduationCountdown';

const EVENT_TITLE = 'Lễ Tốt nghiệp – Trần Trung Nhựt';
const EVENT_DETAILS = 'Lễ Tốt nghiệp Cử nhân Khoa học Máy tính của Trần Trung Nhựt.';

const MAP_LINK = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(CONFIG.mapQuery);
const MAP_EMBED = 'https://maps.google.com/maps?hl=vi&z=17&output=embed&q=' + encodeURIComponent(CONFIG.mapQuery);

const parseTime = (iso: string) => {
  if (!iso) return null;
  const time = new Date(iso).getTime();
  return Number.isNaN(time) ? null : time;
};

const toGCalDate = (iso: string) => {
  const time = parseTime(iso);
  if (time === null) return null;
  return new Date(time).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
};

const buildCalendarUrl = () => {
  if (!CONFIG.batDau || !CONFIG.ketThuc) return null;
  const start = toGCalDate(CONFIG.batDau);
  const end = toGCalDate(CONFIG.ketThuc);
  if (!start || !end) return null;

  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', EVENT_TITLE);
  url.searchParams.set('dates', `${start}/${end}`);
  url.searchParams.set('location', CONFIG.mapQuery);
  url.searchParams.set('details', EVENT_DETAILS);
  return url.toString();
};

const CALENDAR_URL = buildCalendarUrl();

const START_TIME = parseTime(CONFIG.batDau);
const END_TIME = parseTime(CONFIG.ketThuc);
const COUNTDOWN_END = START_TIME !== null && END_TIME !== null && END_TIME > START_TIME ? END_TIME : START_TIME;

const splitLastWord = (name: string) => {
  const index = name.lastIndexOf(' ');
  const lastWord = name.slice(index + 1);
  if (Array.from(lastWord).length > 14) return [name, ''];
  return [name.slice(0, index + 1), lastWord];
};

const GraduationPage = ({ guestName }: GraduationPageProps) => {
  const [nameHead, nameTail] = splitLastWord(guestName);

  return (
    <div className="grad-page" lang="vi">
      <div className="grad-window">
        <div className="grad-titlebar">
          <div className="grad-dots" aria-hidden="true"><span></span><span></span><span></span></div>
          <span className="grad-filename">thiep_moi.ts</span>
          <span className="grad-tag">BÁCH KHOA · KHMT</span>
        </div>

        <main className="grad-body">
          <div className="grad-code" aria-hidden="true">
            <span className="grad-ln"><span className="grad-c">{'// TRƯỜNG ĐẠI HỌC BÁCH KHOA – ĐHQG-HCM'}</span></span>
            <span className="grad-ln">{' '}</span>
            <span className="grad-ln"><span className="grad-k">const</span>{' khachMoi = '}<span className="grad-s">&quot;{guestName}&quot;</span>;</span>
            <span className="grad-ln">{' '}</span>
            <span className="grad-ln"><span className="grad-k">await</span>{' moiDuLe(khachMoi, {'}</span>
            <span className="grad-ln">{'  su_kien:     '}<span className="grad-s">&quot;Lễ Tốt nghiệp&quot;</span>,</span>
            <span className="grad-ln">{'  tan_cu_nhan: '}<span className="grad-s">&quot;Trần Trung Nhựt&quot;</span>,</span>
            <span className="grad-ln">{'  nganh:       '}<span className="grad-s">&quot;Khoa học Máy tính&quot;</span>,</span>
            <span className="grad-ln">{'  thoi_gian:   '}<span className="grad-s">&quot;{CONFIG.gio} · {CONFIG.ngay}&quot;</span>,</span>
            <span className="grad-ln">{'  dia_diem:    '}<span className="grad-s">&quot;{CONFIG.diaDiem}&quot;</span>,</span>
            <span className="grad-ln">{'});'}</span>
            <span className="grad-ln">{' '}</span>
            <span className="grad-ln"><span className="grad-c">{'// Rất hân hạnh được đón tiếp!'}</span></span>
          </div>

          <div className="grad-run">
            <div className="grad-output">
              <p className="grad-prompt grad-reveal" aria-hidden="true"><b>$</b> npm run tot-nghiep</p>
              <p className="grad-lead grad-reveal grad-d1">Trân trọng kính mời</p>
              <div className="grad-guest grad-reveal grad-d2">
                <h1>
                  {nameHead}
                  <span className="grad-nowrap">
                    {nameTail}
                    <span className="grad-cursor" aria-hidden="true"></span>
                  </span>
                </h1>
              </div>
              <p className="grad-desc grad-reveal grad-d3">
                đến dự Lễ Tốt nghiệp của <strong className="grad-nowrap">Trần Trung Nhựt</strong> – Cử nhân Khoa học Máy tính,
                Trường Đại học Bách khoa – <span className="grad-nowrap">ĐHQG-HCM</span>.
              </p>

              <dl className="grad-details grad-reveal grad-d4">
                <div>
                  <dt>THỜI GIAN</dt>
                  <dd>{CONFIG.gio}<small>{CONFIG.ngay}</small></dd>
                </div>
                <div>
                  <dt>ĐỊA ĐIỂM</dt>
                  <dd>{CONFIG.diaDiem}<small>Trường ĐH Bách khoa – <span className="grad-nowrap">ĐHQG-HCM</span></small></dd>
                </div>
              </dl>

              {START_TIME !== null && COUNTDOWN_END !== null && (
                <GraduationCountdown
                  start={START_TIME}
                  end={COUNTDOWN_END}
                  initialNow={Date.now()}
                  className="grad-reveal grad-d5"
                />
              )}
            </div>

            <div className="grad-footer">
              <div className="grad-actions grad-reveal grad-d7">
                <a className="grad-btn grad-btn-primary" href={MAP_LINK} target="_blank" rel="noopener noreferrer">
                  Mở Google Maps
                </a>
                {CALENDAR_URL && (
                  <a className="grad-btn" href={CALENDAR_URL} target="_blank" rel="noopener noreferrer">
                    Thêm vào Google Calendar
                  </a>
                )}
              </div>

              <p className="grad-signoff grad-reveal grad-d8">{'// Rất hân hạnh được đón tiếp!'}</p>
            </div>
          </div>

          <div className="grad-map-pane">
            <div className="grad-map grad-reveal grad-d6">
              <iframe
                src={MAP_EMBED}
                title={`Bản đồ: ${CONFIG.mapQuery}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GraduationPage;
