import { CommunityPost } from '../models/communityPost.models.js';
import { ContentReport } from '../models/contentReport.models.js';
import { ApiError } from '../utils/apiError.js';
import { escapeRegex, sendSuccess } from '../utils/apiResponse.js';
import { getPagination, paginationResult } from '../utils/pagination.js';

const aliases = [
  'Curious Cardinal',
  'Orange Owl',
  'Quiet Quokka',
  'Clever Fox',
  'Midnight Robin',
  'Golden Finch',
];

const relativeTime = (date) => {
  const elapsed = Math.max(0, Date.now() - new Date(date).getTime());
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const serializePost = (post, viewerId) => ({
  id: post._id.toString(),
  alias: post.alias,
  title: post.title,
  body: post.body,
  category: post.category,
  time: relativeTime(post.createdAt),
  createdAt: post.createdAt,
  likes: post.likedBy.length,
  liked: viewerId ? post.likedBy.some((userId) => userId.toString() === viewerId.toString()) : false,
});

export const listPosts = async (req, res) => {
  const query = req.validated.query;
  const { page, limit, skip } = getPagination(query);
  const filter = { status: 'active' };
  if (query.category && query.category !== 'All') filter.category = query.category;
  if (query.q) {
    const search = new RegExp(escapeRegex(query.q), 'i');
    filter.$or = [{ title: search }, { body: search }];
  }
  const sort = query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
  const [posts, total] = await Promise.all([
    CommunityPost.find(filter).sort(sort).skip(skip).limit(limit),
    CommunityPost.countDocuments(filter),
  ]);
  return sendSuccess(res, 200, 'Community posts loaded.', {
    items: posts.map((post) => serializePost(post, req.user._id)),
    pagination: paginationResult(page, limit, total),
  });
};

export const createPost = async (req, res) => {
  const body = req.body.body.trim();
  const title = req.body.title?.trim() || body.split(/\s+/).slice(0, 10).join(' ').slice(0, 120);
  const alias = aliases[Math.floor(Math.random() * aliases.length)];
  const post = await CommunityPost.create({
    author: req.user._id,
    alias,
    title,
    body,
    category: req.body.category || 'Campus life',
  });
  return sendSuccess(res, 201, 'Post created.', { post: serializePost(post, req.user._id) });
};

export const toggleLike = async (req, res) => {
  const post = await CommunityPost.findOne({ _id: req.params.id, status: 'active' });
  if (!post) throw new ApiError(404, 'Post not found.', 'POST_NOT_FOUND');
  const alreadyLiked = post.likedBy.some((id) => id.toString() === req.user._id.toString());
  if (alreadyLiked) post.likedBy.pull(req.user._id);
  else post.likedBy.addToSet(req.user._id);
  await post.save();
  return sendSuccess(res, 200, alreadyLiked ? 'Like removed.' : 'Post liked.', {
    likes: post.likedBy.length,
    liked: !alreadyLiked,
  });
};

export const reportPost = async (req, res) => {
  const post = await CommunityPost.findOne({ _id: req.params.id, status: 'active' }).select('_id');
  if (!post) throw new ApiError(404, 'Post not found.', 'POST_NOT_FOUND');
  const existing = await ContentReport.exists({ post: post._id, reporter: req.user._id });
  if (existing) throw new ApiError(409, 'You have already reported this post.', 'REPORT_EXISTS');
  const report = await ContentReport.create({
    post: post._id,
    reporter: req.user._id,
    reason: req.body.reason || 'Community guidelines',
  });
  return sendSuccess(res, 201, 'Post reported for review.', { reportId: report._id.toString(), status: report.status });
};
