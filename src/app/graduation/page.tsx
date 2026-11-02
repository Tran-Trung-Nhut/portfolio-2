import { Metadata } from 'next';
import GraduationPage from '@/views/GraduationPage';
import { GRADUATION_CONFIG, GUEST_PARAM, GUEST_NAME_MAX_LENGTH } from '@/shared/graduationConfig';

const OG_TITLE = 'Thư mời Lễ Tốt nghiệp – Trần Trung Nhựt';

export const metadata: Metadata = {
  title: 'Graduation',
  description: 'Trân trọng kính mời bạn đến dự Lễ Tốt nghiệp của Trần Trung Nhựt – Cử nhân Khoa học Máy tính, Trường Đại học Bách khoa – ĐHQG-HCM.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/graduation' },
  openGraph: {
    title: OG_TITLE,
    description: 'Trân trọng kính mời bạn đến dự Lễ Tốt nghiệp của Trần Trung Nhựt – Cử nhân Khoa học Máy tính, ĐH Bách khoa – ĐHQG-HCM.',
    type: 'website',
    url: '/graduation',
    locale: 'vi_VN',
  },
};

const getGuestName = (raw: string | string[] | undefined) => {
  const value = (Array.isArray(raw) ? raw[0] : raw) ?? '';
  const name = Array.from(value.normalize('NFC').trim()).slice(0, GUEST_NAME_MAX_LENGTH).join('').trim();
  return name || GRADUATION_CONFIG.khachMacDinh;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  return <GraduationPage guestName={getGuestName(params[GUEST_PARAM])} />;
}
