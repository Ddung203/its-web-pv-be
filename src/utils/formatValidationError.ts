const format = (inputJson: any) => {
  const { name, message, statusCode, error } = inputJson;

  const standardFormat = {
    success: false,
    message: message || "Unknown error",
    error: {
      name: name || "Error",
      details: inputJson.details.body[0].message || "Unknown details",
    },
  };

  return standardFormat;
};

export default format;
