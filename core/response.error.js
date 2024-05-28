export class ResponseError extends Error {
  constructor(message = "Internal server error!", statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class Continue extends ResponseError {
  constructor(
    message = "Everything up to now is fine,please ignore the response if the request is complete!",
    statusCode = 100
  ) {
    super(message, statusCode);
  }
}

export class Switching_Protocol extends ResponseError {
  constructor(
    message = "Header request upgrade from the client!",
    statusCode = 101
  ) {
    super(message, statusCode);
  }
}

export class Processing extends ResponseError {
  constructor(
    message = "The server has received and is processing the request, but the response is not yet available!",
    statusCode = 102
  ) {
    super(message, statusCode);
  }
}

export class Early_Hints extends ResponseError {
  constructor(
    message = "Returns some response headers before the final HTTP message!",
    statusCode = 103
  ) {
    super(message, statusCode);
  }
}


export class Multiple_Choice extends ResponseError {
  constructor(
    message = "There may be more than 1 available response!",
    statusCode = 300
  ) {
    super(message, statusCode);
  }
}

export class NotFound extends ResponseError {
  constructor(message = "ID Not Found!", statusCode = 404) {
    super(message, statusCode);
  }
}
