import sanitizeHtml from "sanitize-html";

export const sanitizeInput = (input) => {
  const sanitizedInput = sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });

  if (!sanitizedInput) {
    return null;
  } else {
    return sanitizedInput;
  }
};
