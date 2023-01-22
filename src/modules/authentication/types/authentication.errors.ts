export class EmailExistsError extends Error {
  constructor(message = 'Email exists') {
    super(message);
    this.name = 'EmailExistsError';
  }
}

export class UsernameExistsError extends Error {
  constructor(message = 'Username exists') {
    super(message);
    this.name = 'UsernameExistsError';
  }
}

export class MissingTokenError extends Error {
  constructor(message = 'Missing token') {
    super(message);
    this.name = 'MissingTokenError';
  }
}

export class SessionExpiredError extends Error {
  constructor(message = 'Session expired') {
    super(message);
    this.name = 'SessionExpiredError';
  }
}

export class WrongCredentialsError extends Error {
  constructor(message = 'Wrong credentials') {
    super(message);
    this.name = 'WrongCredentialsError';
  }
}
