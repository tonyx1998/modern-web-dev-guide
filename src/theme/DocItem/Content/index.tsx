import React from 'react';
import Content from '@theme-original/DocItem/Content';
import DocLessonChrome from '@site/src/components/DocLessonChrome';

export default function ContentWrapper(
  props: React.ComponentProps<typeof Content>,
): React.ReactElement {
  return (
    <>
      <DocLessonChrome />
      <Content {...props} />
    </>
  );
}
