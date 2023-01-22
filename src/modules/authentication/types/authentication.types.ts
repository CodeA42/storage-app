export declare const enum authType {
  accessToken = 'accessToken',
  refreshToken = 'refreshToken',
}

export interface NewPassword {
  oldPassword: string;
  newPassword: string;
}
