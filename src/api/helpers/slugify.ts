import slugify from "slugify";

export const Slugify = (text: string) => {
  return slugify(text, { lower: true, trim: true });
};
