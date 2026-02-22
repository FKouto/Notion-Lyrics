import { Client } from '@notionhq/client';

export const getNotionClient = (token) => {
  return new Client({
    auth: token,
  });
};
