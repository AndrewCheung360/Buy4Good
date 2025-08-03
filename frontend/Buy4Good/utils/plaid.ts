import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { PLAID_CLIENT_ID, PLAID_SECRET } from "../constants";

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_SECRET,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);
