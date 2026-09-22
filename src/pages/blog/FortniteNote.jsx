import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import HarnessPost from '../../components/blog/HarnessPost';
import { fortnitePostsBySlug } from '../../data/blog/fortnite';
import { ROUTES } from '../../config/routes';

/**
 * One route serves every Fortnite synthesis note. The post modules are generated
 * from markdown by scripts/import-synthesis.mjs, so adding a note is a re-run of
 * that script — no new route, no new page component.
 */
const FortniteNote = () => {
  const { slug } = useParams();
  const post = fortnitePostsBySlug[slug];

  if (!post) return <Navigate to={ROUTES.blog} replace />;

  return <HarnessPost post={post} />;
};

export default FortniteNote;
