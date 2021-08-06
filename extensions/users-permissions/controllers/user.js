const { sanitizeEntity } = require('strapi-utils');

const buildCurrentJob = (user) => {
  return user.current_job ? user.current_job.name : null;
}

const buildKnowledges = (user) => {
  return user.knowledges.map(k => k.name);
}

const buildInterests = (user) => {
  return user.interests.map(i => i.name);
}

const getUserInfo = async (user) => {
  const sanitizedUser = sanitizeEntity(user, { model: strapi.plugins['users-permissions'].models.user });
  const { id, email, firstName, lastName } = sanitizedUser;
  const currentJob = buildCurrentJob(sanitizedUser);
  const knowledges = buildKnowledges(sanitizedUser);
  const interests = buildInterests(sanitizedUser);

  return {
    id,
    email,
    firstName,
    lastName,
    currentJob,
    knowledges,
    interests,
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
