import { Announcement } from '../models/announcement.models.js';
import { ApiError } from '../utils/apiError.js';
import { escapeRegex, sendSuccess } from '../utils/apiResponse.js';
import { getPagination, paginationResult } from '../utils/pagination.js';

const serializeAnnouncement = (announcement) => ({
  id: announcement._id.toString(),
  title: announcement.title,
  body: announcement.body,
  category: announcement.category,
  department: announcement.department,
  date: new Date(announcement.publishAt || announcement.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }),
  publishAt: announcement.publishAt,
  pinned: announcement.pinned,
  urgent: announcement.urgent,
  status: announcement.status,
  createdAt: announcement.createdAt,
});

const buildFilter = (query, publicOnly = false) => {
  const filter = {};
  if (publicOnly) {
    filter.status = 'published';
    filter.publishAt = { $lte: new Date() };
  } else if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;
  if (query.department) filter.department = query.department;
  if (query.q) {
    const search = new RegExp(escapeRegex(query.q), 'i');
    filter.$or = [{ title: search }, { body: search }, { department: search }];
  }
  return filter;
};

const list = async (req, res, publicOnly) => {
  const query = req.validated.query;
  const { page, limit, skip } = getPagination(query);
  const filter = buildFilter(query, publicOnly);
  const [announcements, total] = await Promise.all([
    Announcement.find(filter)
      .sort({ pinned: -1, publishAt: -1 })
      .skip(skip)
      .limit(limit),
    Announcement.countDocuments(filter),
  ]);
  return sendSuccess(res, 200, 'Announcements loaded.', {
    items: announcements.map(serializeAnnouncement),
    pagination: paginationResult(page, limit, total),
  });
};

export const listAnnouncements = (req, res) => list(req, res, true);
export const listManagedAnnouncements = (req, res) => list(req, res, false);

export const createAnnouncement = async (req, res) => {
  const values = { ...req.body, author: req.user._id };
  if (values.publishAt) {
    const publishAt = new Date(values.publishAt);
    if (Number.isNaN(publishAt.getTime())) throw new ApiError(400, 'publishAt must be a valid date.', 'INVALID_DATE');
    values.publishAt = publishAt;
  }
  const announcement = await Announcement.create(values);
  return sendSuccess(res, 201, 'Announcement created.', { announcement: serializeAnnouncement(announcement) });
};

export const updateAnnouncement = async (req, res) => {
  if (!Object.keys(req.body).length) throw new ApiError(400, 'Provide at least one field to update.', 'EMPTY_UPDATE');
  const update = { ...req.body };
  if (update.publishAt) {
    update.publishAt = new Date(update.publishAt);
    if (Number.isNaN(update.publishAt.getTime())) throw new ApiError(400, 'publishAt must be a valid date.', 'INVALID_DATE');
  }
  const announcement = await Announcement.findByIdAndUpdate(
    req.params.id,
    { $set: update },
    { new: true, runValidators: true },
  );
  if (!announcement) throw new ApiError(404, 'Announcement not found.', 'ANNOUNCEMENT_NOT_FOUND');
  return sendSuccess(res, 200, 'Announcement updated.', { announcement: serializeAnnouncement(announcement) });
};

export const deleteAnnouncement = async (req, res) => {
  const announcement = await Announcement.findByIdAndDelete(req.params.id);
  if (!announcement) throw new ApiError(404, 'Announcement not found.', 'ANNOUNCEMENT_NOT_FOUND');
  return sendSuccess(res, 200, 'Announcement deleted.', { id: announcement._id.toString() });
};

export { serializeAnnouncement };
