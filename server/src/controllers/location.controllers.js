import { CampusLocation } from '../models/campusLocation.models.js';
import { escapeRegex, sendSuccess } from '../utils/apiResponse.js';
import { getPagination, paginationResult } from '../utils/pagination.js';

export const listLocations = async (req, res) => {
  const query = req.validated.query;
  const { page, limit, skip } = getPagination(query);
  const filter = { active: true };
  if (query.q) {
    const search = new RegExp(escapeRegex(query.q), 'i');
    filter.$or = [{ name: search }, { description: search }, { address: search }];
  }
  const [locations, total] = await Promise.all([
    CampusLocation.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
    CampusLocation.countDocuments(filter),
  ]);
  return sendSuccess(res, 200, 'Campus locations loaded.', {
    items: locations.map((location) => ({
      id: location._id.toString(),
      name: location.name,
      description: location.description,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
    })),
    pagination: paginationResult(page, limit, total),
  });
};
