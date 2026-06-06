import React from 'react';
import clsx from 'clsx';
import PaginatorNavLink from '@theme/PaginatorNavLink';
import type {Props} from '@theme/DocPaginator';

export default function DocPaginator({className, previous, next}: Props): React.ReactElement {
  return (
    <nav className={clsx(className, 'pagination-nav')} aria-label="Docs pages">
      {previous && (
        <PaginatorNavLink {...previous} subLabel="Previous lesson" />
      )}
      {next && <PaginatorNavLink {...next} subLabel="Next lesson" isNext />}
    </nav>
  );
}
