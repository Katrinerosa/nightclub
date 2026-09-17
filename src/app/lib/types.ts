export type LoginError = {
  email?: { errors: string[] };
  password?: { errors: string[] };
  general?: { errors: string[] };
};

export type LoginData = {
  email?: string;
  password?: string;
};

export type LoginFormState = {
  error?: LoginError;
  data?: LoginData;
};

export type AuthResponse =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
      result: {
        accessToken: string;
        user: {
          id: string | number;
          email: string;
          name?: string;
        };
      };
    };

export type Consent = {
  essential: true;
  analytics: boolean;
  consent: boolean;
};
