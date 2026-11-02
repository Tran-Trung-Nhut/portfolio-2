'use client';

import { usePathname } from 'next/navigation';
import { STANDALONE_PATHS } from '@/shared/constants';

const SiteChrome = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  if (STANDALONE_PATHS.includes(pathname)) return null;
  return <>{children}</>;
};

export default SiteChrome;
