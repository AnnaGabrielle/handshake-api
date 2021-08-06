const { sanitizeEntity } = require('strapi-utils');

const getUserInfo = (user) => {
  const sanitizedUser = sanitizeEntity(user, { model: strapi.plugins['users-permissions'].models.user });
  const { id, email, firstName, lastName } = sanitizedUser;
  return {
    id,
    email,
    firstName,
    lastName,
  }
}

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */

  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.plugins['users-permissions'].services.user.search(ctx.query);
    } else {
      entities = await strapi.plugins['users-permissions'].services.user.fetchAll(ctx.query);
    }

    return entities.map(entity => getUserInfo(entity));
  },
};
