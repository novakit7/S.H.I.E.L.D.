import { Announcement } from '../models/announcement.models.js';
import { ContentReport } from '../models/contentReport.models.js';
import { ApiError } from '../utils/apiError.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { getPagination, paginationResult } from '../utils/pagination.js';
import {
  createAnnouncement,
  deleteAnnouncement,
  listManagedAnnouncements,
  updateAnnouncement,
} from './announcement.controllers.js';
import { listUsers, updateUser } from './user.controllers.js';

export {
  createAnnouncement,
  deleteAnnouncement,
  listManagedAnnouncements,
  listUsers,
  updateAnnouncement,
  updateUser,
};

export const listReports = async (req, res) => {
  const query = req.validated.query;
  const { page, limit, skip } = getPagination(query);
  const filter = {};
  if (query.status) filter.status = query.status;
  const [reports, total] = await Promise.all([
    ContentReport.find(filter)
      .populate({ path: 'post', select: 'title body alias category' })
      .populate({ path: 'reporter', select: 'name emailId' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ContentReport.countDocuments(filter),
  ]);
  return sendSuccess(res, 200, 'Reports loaded.', {
    items: reports.map((report) => ({
      id: report._id.toString(),
      content: report.post
        ? {
            id: report.post._id.toString(),
            title: report.post.title,
            body: report.post.body,
            alias: report.post.alias,
            category: report.post.category,
          }
        : null,
      reason: report.reason,
      status: report.status,
      createdAt: report.createdAt,
      reporter: report.reporter
        ? { id: report.reporter._id.toString(), name: report.reporter.name, email: report.reporter.emailId }
        : null,
    })),
    pagination: paginationResult(page, limit, total),
  });
};

export const reviewReport = async (req, res) => {
  const update = {
    status: req.body.status,
    reviewedBy: req.user._id,
    reviewedAt: new Date(),
  };
  const report = await ContentReport.findByIdAndUpdate(
    req.params.id,
    { $set: update },
    { new: true, runValidators: true },
  );
  if (!report) throw new ApiError(404, 'Report not found.', 'REPORT_NOT_FOUND');
  return sendSuccess(res, 200, 'Report status updated.', {
    id: report._id.toString(),
    status: report.status,
    reviewedAt: report.reviewedAt,
  });
};
