const STATUS = {
  SUCCESS: {
    code: 200,
    message: "success",
  },
  ERROR: {
    code: 500,
    message: "error",
  },
  NOT_FOUND: {
    code: 404,
    message: "Not Found",
  },
  BAD_REQUEST: {
    code: 400,
    message: "Bad Request",
  },
  UNAUTHORIZED: {
    code: 401,
    message: "Unauthorized",
  },
  FORBIDDEN: {
    code: 403,
    message: "Forbidden",
  },
  CONFLICT: {
    code: 409,
    message: "Conflict",
  },
  CREATED: {
    code: 201,
    message: "Created",
  },
  NO_CONTENT: {
    code: 204,
    message: "No Content",
  },
  ACCEPTED: {
    code: 202,
    message: "Accepted",
  },
};
module.exports = STATUS;
