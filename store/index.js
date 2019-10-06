export const strict = false;

export const actions = {
  nuxtClientInit({ dispatch }) {
    dispatch("vials/loadVials");
  }
};
