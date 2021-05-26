function errorHandler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res
      .status(401)
      .json({ message: "the user is not authenticated", error: err });
  }
  return res.status(500).json(err);
}

module.exports = errorHandler;
