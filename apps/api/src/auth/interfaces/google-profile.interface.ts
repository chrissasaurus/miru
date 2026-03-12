export interface GoogleProfile {
  id: string;
  emails: Array<{
    value: string;
    type?: string;
  }>;
  displayName?: string;
  name?: {
    familyName?: string;
    givenName?: string;
  };
  photos?: Array<{
    value: string;
  }>;
}
