export interface SignInResponseAttributes {
  status: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface SignInAttributes {
  email: string;
  password: string;
}

export interface SignUpResponseAttributes {
  status: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface SignUpAttributes {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
