import algolia from 'algoliasearch';
import { SearchResult } from '@zoonk/models';
import { analytics, appLanguage, isProduction } from '@zoonk/utils';

const ALGOLIA_APP_ID = isProduction ? 'CEHDTPZ5VM' : 'J75DV0NKA3';
const ALGOLIA_SEARCH_KEY = isProduction
  ? '2c40ec50e48b4dce56529dcab5ee2b62'
  : '3d7f98ebda2a8a9276ce7755dd403556';

const client = algolia(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);

/**
 * Full-text search across all collections.
 */
export const search = async (query: string) => {
  const indexes = ['topics', 'paths', 'chapters', 'posts'];
  const queries = indexes.map((item) => ({
    indexName: `${item}_${appLanguage}`,
    query,
    params: { hitsPerPage: 5 },
  }));
  analytics().logEvent('search', { search_term: query });
  const res = await client.search<SearchResult>(queries);
  return res.results.map((item) => ({
    ...item,
    // Remove the language suffix from the index name.
    index: item.index?.slice(0, item.index.length - 3),
  }));
};