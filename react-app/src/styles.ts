export const POSITIVE_NEGATIVE_CLASS_NAMES = {
  POS: "textPositive",
  NEG: "textNegative",
};

export const POSITIVE_NEGATIVE_STYLING = {
  [`& .${POSITIVE_NEGATIVE_CLASS_NAMES.POS}`]: {
    color: "success.light",
  },
  [`& .${POSITIVE_NEGATIVE_CLASS_NAMES.NEG}`]: {
    color: "error.light",
  },
};
