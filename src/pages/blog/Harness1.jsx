import React, { useMemo } from 'react';
import HarnessPost from '../../components/blog/HarnessPost';
import post from '../../data/blog/harness-1';

// The draft opens on "Good morning(<-variable)!", so the greeting follows the reader's clock.
const greetingFor = (hour) => {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const Harness1 = () => {
  const greeted = useMemo(() => {
    const greeting = greetingFor(new Date().getHours());
    return {
      ...post,
      body: post.body.map((block) =>
        block.text ? { ...block, text: block.text.replace('{greeting}', greeting) } : block
      ),
    };
  }, []);

  return <HarnessPost post={greeted} />;
};

export default Harness1;
