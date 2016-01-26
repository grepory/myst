const config = require('config');
const ua = require('universal-analytics');

const ACCOUNT_ID = config.google_analytics.account_id;

/**
 * @param {string} user.id - the visitor's Opsee user ID, if authenticated
 * @param {string} user.uuid - will be used if user.id undefined, as is the
 *    case with unauthenticated visitors
 */
function makeVisitor(user) {
  const userID = user.id || user.uuid;

  return ua(ACCOUNT_ID, userID, {
    https: true,
    strictCidFormat: false
  });
}

module.exports = {

  pageview(path, name, user) {
    const visitor = makeVisitor(user);

    return new Promise((resolve, reject) => {
      visitor.pageview(path, name, err => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  track(category, action, user, data) {
    const actionString = action || 'test action';
    const visitor = makeVisitor(user);

    const hasData = data && !!Object.keys(data).length;
    const label = hasData ? JSON.stringify(data) : null;

    return new Promise((resolve, reject) => {
      visitor.event(category, actionString, label, err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

