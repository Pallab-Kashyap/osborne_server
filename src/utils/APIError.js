class ApiError extends Error {
    constructor(statusCode, message, isOperational = true) {
      super(message);
      this.status = false;
      this.statusCode = statusCode;
      this.isOperational = isOperational; 
      Error.captureStackTrace(this, this.constructor);
    }
  
    static badRequest(message) {
      return new ApiError(400, message);
    }
  
    static unauthorized(message) {
      return new ApiError(401, message);
    }
  
    static forbidden(message) {
      return new ApiError(403, message);
    }
  
    static notFound(message) {
      return new ApiError(404, message);
    }
  
    static internal(message) {
      return new ApiError(500, message);
    }

    static custom(statusCode, message){
      return new ApiError(statusCode, message);
    }

    toJSON() {
      return {
        status: false,
        statusCode: this.statusCode,
        message: this.message
      };
    }
  }
