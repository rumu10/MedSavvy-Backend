const SendResponse = (res, message, data) => {
  res.status(200).json({
    status: 'ok',
    message,
    data
  });
};

export default SendResponse;