export interface ICmsFaqItem {
  question?: string;
  answer?: string;
}

export interface ICmsSeo {
  meta_title?: string;
  meta_description?: string;
  keywords?: string[] | string;
}

export interface ICmsEndpointAssignment {
  name?: string;
}

export interface ICmsArticle {
  _id?: string;
  id?: string;
  title?: string;
  slug?: string;
  summary?: string;
  description?: string;
  content?: string;
  category?: string[] | string;
  authorNames?: string[];
  imageUrls?: string[];
  scheduledTime?: string;
  createdAt?: string;
  updatedAt?: string;
  publishState?: "ready" | "needs_review" | "published" | string;
  seo?: ICmsSeo;
  faq?: ICmsFaqItem[];
  schemaMarkup?: Record<string, unknown> | null;
  videoUrls?: string[];
  markdownImages?: string[];
  endpointAssignments?: ICmsEndpointAssignment[] | ICmsEndpointAssignment;
  websiteSection?: string;
}

export interface IArticleListParams {
  page?: number;
  limit?: number;
  category?: string;
  /** Exact CMS endpoint name (accents included), e.g. `Brasileirão`. */
  endpoint?: string;
}
