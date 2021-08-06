const { sanitizeEntity } = require('strapi-utils');

const getUserInfo = async (user) => {
  const sanitizedUser = sanitizeEntity(user, { model: strapi.plugins['users-permissions'].models.user });
  console.log(sanitizedUser);
  const { id, email, firstName, lastName } = sanitizedUser;
  const currentJob = sanitizedUser.current_job;

  return {
    id,
    email,
    firstName,
    lastName,
    currentJob: currentJob.name
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

    return await Promise.all(entities.map(entity => getUserInfo(entity)));
  },
};
