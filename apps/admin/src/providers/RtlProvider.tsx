'use client';

import React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

import { useServerInsertedHTML } from 'next/navigation';

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});
cacheRtl.compat = true;

const cacheLtr = createCache({
  key: 'muiltr',
});
cacheLtr.compat = true;

export function RtlProvider({ children, isRtl }: { children: React.ReactNode; isRtl: boolean }) {
  const cache = isRtl ? cacheRtl : cacheLtr;

  useServerInsertedHTML(() => {
    const names = Object.keys(cache.inserted);
    if (names.length === 0) return null;
    const styles = Object.values(cache.inserted)
      .filter((v): v is string => typeof v === 'string')
      .join(' ');

    return (
      <style
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
