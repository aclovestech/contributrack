export type StackAuthWebhookData = {
  type: string;
  data: {
    id: string;
    primary_email_verified: boolean;
    primary_email_auth_enabled: boolean;
    signed_up_at_millis: number;
    last_active_at_millis: number;
    is_anonymous: boolean;
    primary_email: string;
    display_name: string;
    selected_team: {
      created_at_millis: number;
      id: string;
      display_name: string;
      server_metadata: {
        [key: string]: any;
      };
      profile_image_url: string;
      client_metadata: {
        [key: string]: any;
      };
      client_read_only_metadata: {
        [key: string]: any;
      };
    };
    selected_team_id: string;
    profile_image_url: string;
    client_metadata: {
      [key: string]: any;
    };
    client_read_only_metadata: {
      [key: string]: any;
    };
    server_metadata: {
      [key: string]: any;
    };
  };
};
