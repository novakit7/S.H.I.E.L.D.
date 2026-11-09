import { CommunityPost } from '../models/communityPost.models.js';
import { Announcement } from '../models/announcement.models.js';
import { ContentReport } from '../models/contentReport.models.js';
import { LostFoundItem } from '../models/lostFoundItem.models.js';
import { User } from '../models/user.models.js';
import { ApiError } from '../utils/apiError.js';
import { getPublicUser, sendSuccess } from '../utils/apiResponse.js';
import { getPagination, paginationResult } from '../utils/pagination.js';

export const getProfile = async (req, res) => {
  const [posts, likedPosts] = await Promise.all([
    CommunityPost.countDocuments({ author: req.user._id, status: 'active' }),
    CommunityPost.aggregate([
      { $match: { author: req.user._id, status: 'active' } },
      { $project: { likes: { $size: '$likedBy' } } },
      { $group: { _id: null, total: { $sum: '$likes' } } },
    ]),
  ]);
  return sendSuccess(res, 200, 'Profile loaded.', {
    user: getPublicUser(req.user),
    activity: { posts, helpfulLikes: likedPosts[0]?.total || 0 },
  });
};

export const updateProfile = async (req, res) => {
  if (!Object.keys(req.body).length) throw new ApiError(400, 'Provide at least one field to update.', 'EMPTY_UPDATE');
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: req.body },
    { new: true, runValidators: true },
  );
  return sendSuccess(res, 200, 'Profile updated.', { user: getPublicUser(user) });
};

export const getDashboard = async (req, res) => {
  const [
    communityPosts,
    activeListings,
    announcementCount,
    recentAnnouncements,
    recentPosts,
    recentItems,
  ] = await Promise.all([
    CommunityPost.countDocuments({ status: 'active' }),
    LostFoundItem.countDocuments(),
    Announcement.countDocuments({
      status: 'published',
      publishAt: { $lte: new Date() },
    }),
    Announcement.find({
      status: 'published',
      publishAt: { $lte: new Date() },
    }).sort({ pinned: -1, publishAt: -1 }).limit(3),
    CommunityPost.find({ status: 'active' }).sort({ createdAt: -1 }).limit(3),
    LostFoundItem.find().sort({ createdAt: -1 }).limit(3),
  ]);

  const dateLabel = (date) => new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const dashboardPosts = recentPosts.map((post) => ({
    id: post._id.toString(),
    alias: post.alias,
    title: post.title,
    body: post.body,
    category: post.category,
    time: 'Recently',
    likes: post.likedBy.length,
  }));
  const dashboardItems = recentItems.map((item) => ({
    id: item._id.toString(),
    title: item.title,
    category: item.category,
    location: item.location,
    date: dateLabel(item.createdAt),
    status: item.status,
    description: item.description,
  }));
  const announcements = recentAnnouncements.map((item) => ({
    id: item._id.toString(),
    title: item.title,
    category: item.category,
    department: item.department,
    date: dateLabel(item.publishAt || item.createdAt),
    pinned: item.pinned,
    urgent: item.urgent,
  }));

  return sendSuccess(res, 200, 'Dashboard loaded.', {
    greetingName: req.user.name,
    stats: {
      communityPosts,
      activeListings,
      announcements: announcementCount,
      savedPlaces: 0,
    },
    announcements,
    posts: dashboardPosts,
    lostFoundItems: dashboardItems,
  });
};

export const adminSummary = async (_req, res) => {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [totalUsers, announcementCount, pendingReports, activeToday] = await Promise.all([
    User.countDocuments({ role: 'student', status: { $ne: 'banned' } }),
    Announcement.countDocuments(),
    ContentReport.countDocuments({ status: 'pending' }),
    User.countDocuments({ lastLoginAt: { $gte: since }, status: 'active' }),
  ]);
  return sendSuccess(res, 200, 'Administration summary loaded.', {
    totalStudents: totalUsers,
    announcements: announcementCount,
    pendingReports,
    activeToday,
  });
};

export const listUsers = async (req, res) => {
  const query = req.validated.query;
  const { page, limit, skip } = getPagination(query);
  const filter = {};
  if (query.role) filter.role = query.role;
  if (query.status) filter.status = query.status;
  if (query.department) filter.department = query.department;
  if (query.q) {
    const search = new RegExp(query.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: search }, { emailId: search }, { collegeId: search }];
  }
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);
  return sendSuccess(res, 200, 'Users loaded.', {
    items: users.map(getPublicUser),
    pagination: paginationResult(page, limit, total),
  });
};

export const updateUser = async (req, res) => {
  const { role, status } = req.body;
  if (!role && !status) throw new ApiError(400, 'Provide a role or status to update.', 'EMPTY_UPDATE');
  if (req.params.id === req.user._id.toString() && status && status !== 'active') {
    throw new ApiError(400, 'You cannot deactivate your own administrator account.', 'SELF_DEACTIVATION');
  }
  if (req.params.id === req.user._id.toString() && role && role !== 'admin') {
    throw new ApiError(400, 'You cannot remove your own administrator role.', 'SELF_DEMOTION');
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { ...(role ? { role } : {}), ...(status ? { status } : {}) } },
    { new: true, runValidators: true },
  );
  if (!user) throw new ApiError(404, 'User not found.', 'USER_NOT_FOUND');
  return sendSuccess(res, 200, 'User updated.', { user: getPublicUser(user) });
};
