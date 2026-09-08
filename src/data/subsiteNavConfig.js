// ---------------------------------------------------------------------------
// Subsite navigation config — single source of truth for the globe-landing
// directory mini-dropdowns AND each subsite's own NavBar (when subsite-specific
// nav lands). Each entry mirrors the destination subsite's primary nav.
//
// Shape:
//   key (matches GLOBE_CONFIG.serviceLinks key)
//     url:   destination subsite root
//     links: array of sub-entries shown in the dropdown
//       label:    visible text
//       url:      destination route
//       scrollTo: (optional) DOM id to scroll to after route lands; consumed
//                 by location.state.scrollTo on the destination page
// ---------------------------------------------------------------------------

import { ROUTES } from '../config/routes';

export const SUBSITE_NAV = {
  'Game Development': {
    url: ROUTES.interactive,
    links: [
      { label: 'Skills',    url: ROUTES.interactive, scrollTo: 'skills' },
      { label: 'Projects',  url: ROUTES.interactive, scrollTo: 'projects' },
      { label: 'Blog',      url: ROUTES.blog },
      { label: 'Downloads', url: ROUTES.downloads },
    ],
  },
  'Make-Up/Skincare E-Commerce': {
    url: ROUTES.makeup,
    links: [],
  },
  'Stickers E-Commerce': {
    url: ROUTES.stickers,
    links: [],
  },
};

// Helper: returns sub-links for a directory item, or empty array.
export const getSubsiteLinks = (key) => SUBSITE_NAV[key]?.links ?? [];
