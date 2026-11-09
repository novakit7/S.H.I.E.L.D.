import { LostFoundItem } from '../models/lostFoundItem.models.js';
import { escapeRegex, sendSuccess } from '../utils/apiResponse.js';
import { getPagination, paginationResult } from '../utils/pagination.js';

const formatDate = (date) => {
  const value = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (value.toDateString() === today.toDateString()) return 'Today';
  if (value.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return value.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const serializeItem = (item) => ({
  id: item._id.toString(),
  title: item.title,
  category: item.category,
  location: item.location,
  date: formatDate(item.createdAt),
  createdAt: item.createdAt,
  status: item.status,
  description: item.description,
});

export const listItems = async (req, res) => {
  const query = req.validated.query;
  const { page, limit, skip } = getPagination(query);
  const filter = {};
  if (query.status && query.status !== 'All') filter.status = query.status;
  if (query.category) filter.category = query.category;
  if (query.q) {
    const search = new RegExp(escapeRegex(query.q), 'i');
    filter.$or = [{ title: search }, { location: search }];
  }
  const [items, total] = await Promise.all([
    LostFoundItem.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    LostFoundItem.countDocuments(filter),
  ]);
  return sendSuccess(res, 200, 'Lost and found listings loaded.', {
    items: items.map(serializeItem),
    pagination: paginationResult(page, limit, total),
  });
};

export const createItem = async (req, res) => {
  const item = await LostFoundItem.create({ ...req.body, creator: req.user._id });
  return sendSuccess(res, 201, 'Listing created.', { item: serializeItem(item) });
};
