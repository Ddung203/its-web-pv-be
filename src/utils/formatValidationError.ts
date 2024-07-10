const format = (inputJson: any) => {
  const { name, message } = inputJson;

  let details = "";

  if (inputJson.details?.params?.[0]?.message) details += inputJson.details.params[0].message;
  if (inputJson.details?.body?.[0]?.message) details += inputJson.details.body[0].message;

  const standardFormat = {
    success: false,
    message: message || "Unknown error",
    payload: null,
    error: {
      name: name || "Validation Error",
      details: details === "" ? "Unknown details" : details,
    },
  };

  return standardFormat;
};

export default format;
