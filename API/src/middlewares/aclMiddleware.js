const ForbiddenException = require("../exceptions/ForbiddenException");
const { getUserBy } = require("../controller/users");
const { Possession, aclRules } = require("../services/acl.config");

module.exports = (rule) => async (req, res, next) => {
  const rules = Array.isArray(rule) ? rule : [rule];
  let isAllow = false;
  const user = await getUserBy(req.auth.User_ID);

  if (user) {
    for await (const checkRule of rules) {
      if (aclRules[user.role] && aclRules[user.role][checkRule.resource]) {
        for await (const permission of aclRules[user.role][
          checkRule.resource
        ]) {
          const canUseAnyAction =
            permission.possession === Possession.ANY &&
            permission.action === checkRule.action;

          if (checkRule.possession === Possession.ANY) {
            if (canUseAnyAction) {
              isAllow = true;
            }
          } else {
            if (canUseAnyAction) {
              isAllow = true;
            } else {
              try {
                const resource = await checkRule.getResource(req);
                if (checkRule.isOwn(resource, user.User_ID)) {
                  isAllow = true;
                }
              } catch (e) {
                return next(e);
              }
            }
          }
        }
      }
    }
  }

  if (isAllow) {
    return next();
  }
  next(new ForbiddenException("ACL: Forbidden action"));
};
