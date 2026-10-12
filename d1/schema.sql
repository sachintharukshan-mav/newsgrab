-- NewsGrab D1 Database Schema
-- Run locally: npx wrangler d1 execute newsgrab_db --local --file=d1/schema.sql
-- Run production: npx wrangler d1 execute newsgrab_db --remote --file=d1/schema.sql

-- 1. Emoji Reactions Table
CREATE TABLE IF NOT EXISTS reactions (
  article_id TEXT NOT NULL,
  reaction_type TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (article_id, reaction_type)
);

CREATE INDEX IF NOT EXISTS idx_reactions_article_id ON reactions (article_id);

-- 2. Reader Discussion & Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_location TEXT,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 1,
  flagged INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments (article_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments (created_at);
