import MDXComponents from '@theme-original/MDXComponents';
import ReaderLevel from '@site/src/components/ReaderLevel';
import PageAudience from '@site/src/components/PageAudience';
import Quiz, {Question} from '@site/src/components/Quiz';

/**
 * Register components that should be available in every MDX file
 * without an explicit import statement.
 */
export default {
  ...MDXComponents,
  ReaderLevel,
  PageAudience,
  Quiz,
  Question,
};
