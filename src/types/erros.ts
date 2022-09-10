const ERRORS = {
    bad_request: 400,
    unauthorized: 401,
    not_found: 404,
    conflict: 409,
    unprocessable_entity: 422
};

type ErrorsTypes = keyof typeof ERRORS; 

export { ERRORS, ErrorsTypes };