export class ResponseSuccess {
  constructor(
    data,
    meta = {
      success: true,
      error: null,
      code: "00",
      statusCode: 200,
    }
  ) {
    this.meta = meta;
    this.data = data;
  }

  send(res) {
    return res.status(this.meta.statusCode).json(this);
  }
}

export class OK extends ResponseSuccess {
  constructor(
    data,
    meta = {
      success: true,
      error: null,
      code: "01",
      statusCode: 200,
    }
  ) {
    super(data, meta);
  }
}

export class Created extends ResponseSuccess {
  constructor(
    data,
    meta = {
      success: true,
      error: null,
      code: "02",
      statusCode: 201,
    }
  ) {
    super(data, meta);
  }
}

export class Accepted extends ResponseSuccess {
  constructor(
    data,
    meta = {
      success: true,
      error: null,
      code: "03",
      statusCode: 202,
    }
  ) {
    super(data, meta);
  }
}

export class NoContent extends ResponseSuccess {
  constructor(
    meta = {
      success: true,
      error: null,
      code: "04",
      statusCode: 204,
    }
  ) {
    super(null, meta);
  }
}

export class PartialContent extends ResponseSuccess {
  constructor(
    data,
    meta = {
      success: true,
      error: null,
      code: "05",
      statusCode: 206,
    }
  ) {
    super(data, meta);
  }
}
