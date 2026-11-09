export const sendSuccess = (res, statusCode, message, data = null) =>
  res.status(statusCode).json({ success: true, message, data });

export const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getPublicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.emailId,
  studentId: user.collegeId,
  department: user.department,
  role: user.role,
  status: user.status,
  verified: user.verified,
  avatar: user.avatar,
  bio: user.bio,
  memberSince: user.createdAt,
});
