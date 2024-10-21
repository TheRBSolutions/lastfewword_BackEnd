exports.sendSuccessResponse = (res, code, data, message = 'Successfull') =>
  res.status(code).send({
    status: 'success',
    data,
    message,
  });
