class NetworkError extends Error {}

class NetworkFailedError extends NetworkError {
  constructor(message = "Network failed Error") {
    super(message);
  }
}

class UnsupportedAuthFlow extends NetworkError {
  constructor(message = "UnsupportedAuthFlow") {
    super(message);
  }
}

export { NetworkError, NetworkFailedError, UnsupportedAuthFlow };
