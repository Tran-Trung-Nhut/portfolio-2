import { Metadata } from 'next';
import GraduationPage from '@/views/GraduationPage';
import { findInvitedGuest } from '@/lib/invitations';
import { INVITE_PARAM } from '@/shared/graduationConfig';

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

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const token = (await searchParams)[INVITE_PARAM];
  const invite = await findInvitedGuest(Array.isArray(token) ? token[0] : token);
  return <GraduationPage invite={invite} />;
}
