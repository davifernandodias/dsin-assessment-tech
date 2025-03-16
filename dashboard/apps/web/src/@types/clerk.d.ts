interface ErrorMessages {
  session_exists: string;
  identifier_already_signed_in: string;
  account_transfer_invalid: string;
  client_state_invalid: string;
  strategy_for_user_invalid: string;
  identification_claimed: string;
  resource_forbidden: string;
  resource_not_found: string;
  identification_belongs_to_different_user: string;
  no_second_factors: string;
  sign_in_no_identification_for_user: string;
  sign_in_identification_or_user_deleted: string;
}

interface ClerkError {
  code: string;
  shortMessage?: string;
  longMessage?: string;
  meta?: Record<string, any>;
}