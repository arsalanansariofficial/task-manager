export const cacheUser = async options => {
  const newCache = await caches.open('user-cache');
  const url = '{process.env.REACT_APP_DOMAIN_NAME}/users/view-profile';
  try {
    await newCache.add(new Request(url, options));
    return true;
  } catch (error) {
    return false;
  }
};

export const getCachedUser = async () => {
  const newCache = await caches.open('user-cache');
  const url = '{process.env.REACT_APP_DOMAIN_NAME}/users/view-profile';
  return await newCache.match(url);
};

export const deleteCachedUser = async () => {
  const newCache = await caches.open('user-cache');
  const url = '{process.env.REACT_APP_DOMAIN_NAME}/users/view-profile';
  return await newCache.delete(url);
};
