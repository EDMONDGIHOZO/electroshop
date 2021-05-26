const expressjwt = require("express-jwt");
const secret = process.env.SECRET_KEY;

authJwt = () => {
  return expressjwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: revoker,
  }).unless({
    path: [
      { url: /\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      "/users/login",
      "/users/register",
    ],
  });
};

revoker = async (req, payload, done) => {
  if (payload.isAdmin) {
    done(null, true);
  } else {
    done();
  }
};

module.exports = authJwt;
