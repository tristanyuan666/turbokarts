// Server-side only imports and initialization
let Client: any = null;
let Charge: any = null;
let Webhook: any = null;
let isInitialized = false;

function initializeCoinbaseCommerce() {
  if (typeof window !== "undefined") {
    throw new Error("This function can only be called on the server side");
  }

  if (isInitialized && Client && Charge && Webhook) {
    return { Client, Charge, Webhook };
  }

  if (!process.env.COINBASE_COMMERCE_API_KEY) {
    throw new Error(
      "COINBASE_COMMERCE_API_KEY environment variable is not set",
    );
  }

  try {
    // Import the module using require
    const coinbaseCommerce = require("coinbase-commerce-node");

    console.log("Coinbase Commerce module structure:", {
      hasDefault: !!coinbaseCommerce.default,
      hasClient: !!coinbaseCommerce.Client,
      hasCharge: !!coinbaseCommerce.Charge,
      hasWebhook: !!coinbaseCommerce.Webhook,
      keys: Object.keys(coinbaseCommerce),
      defaultKeys: coinbaseCommerce.default
        ? Object.keys(coinbaseCommerce.default)
        : null,
    });

    // Try multiple approaches to extract the classes
    let extractedClient = null;
    let extractedCharge = null;
    let extractedWebhook = null;

    // Approach 1: Direct access
    if (
      coinbaseCommerce.Client &&
      coinbaseCommerce.Charge &&
      coinbaseCommerce.Webhook
    ) {
      extractedClient = coinbaseCommerce.Client;
      extractedCharge = coinbaseCommerce.Charge;
      extractedWebhook = coinbaseCommerce.Webhook;
      console.log("Using direct access approach");
    }
    // Approach 2: Default export
    else if (coinbaseCommerce.default) {
      const defaultExport = coinbaseCommerce.default;
      if (
        defaultExport.Client &&
        defaultExport.Charge &&
        defaultExport.Webhook
      ) {
        extractedClient = defaultExport.Client;
        extractedCharge = defaultExport.Charge;
        extractedWebhook = defaultExport.Webhook;
        console.log("Using default export approach");
      }
    }
    // Approach 3: Check if the module itself is the Client class
    else if (
      typeof coinbaseCommerce === "function" ||
      typeof coinbaseCommerce === "object"
    ) {
      // Sometimes the entire module might be structured differently
      // Let's try to find the classes in nested properties
      const findInObject = (obj: any, className: string): any => {
        if (!obj || typeof obj !== "object") return null;

        // Direct property
        if (obj[className]) return obj[className];

        // Search in nested objects
        for (const key of Object.keys(obj)) {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            const found = findInObject(obj[key], className);
            if (found) return found;
          }
        }
        return null;
      };

      extractedClient = findInObject(coinbaseCommerce, "Client");
      extractedCharge = findInObject(coinbaseCommerce, "Charge");
      extractedWebhook = findInObject(coinbaseCommerce, "Webhook");

      if (extractedClient && extractedCharge && extractedWebhook) {
        console.log("Using nested search approach");
      }
    }

    // Final validation
    if (!extractedClient || !extractedCharge || !extractedWebhook) {
      console.error("Failed to extract classes:", {
        Client: !!extractedClient,
        Charge: !!extractedCharge,
        Webhook: !!extractedWebhook,
      });
      throw new Error(
        `Could not find required Coinbase Commerce classes. Module structure: ${JSON.stringify(Object.keys(coinbaseCommerce))}`,
      );
    }

    // Assign to module-level variables
    Client = extractedClient;
    Charge = extractedCharge;
    Webhook = extractedWebhook;

    // Initialize client with API key
    if (typeof Client.init === "function") {
      Client.init(process.env.COINBASE_COMMERCE_API_KEY);
      console.log("Coinbase Commerce client initialized successfully");
    } else {
      console.warn("Client.init is not a function, skipping initialization");
    }

    isInitialized = true;
    return { Client, Charge, Webhook };
  } catch (error) {
    console.error("Failed to initialize Coinbase Commerce:", error);
    Client = null;
    Charge = null;
    Webhook = null;
    isInitialized = false;
    throw new Error(`Failed to initialize Coinbase Commerce: ${error.message}`);
  }
}

export interface CreateChargeData {
  name: string;
  description: string;
  pricing_type: "fixed_price";
  local_price: {
    amount: string;
    currency: string;
  };
  metadata?: {
    order_id?: string;
    customer_email?: string;
    customer_name?: string;
    items?: any[];
  };
  redirect_url?: string;
  cancel_url?: string;
}

export interface CoinbaseChargeResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  hosted_url: string;
  created_at: string;
  expires_at: string;
  timeline: any[];
  metadata: any;
  pricing_type: string;
  pricing: any;
  payments: any[];
  addresses: any;
}

export class CoinbaseCommerceService {
  static async createCharge(
    chargeData: CreateChargeData,
  ): Promise<CoinbaseChargeResponse> {
    if (typeof window !== "undefined") {
      throw new Error("This method can only be called on the server side");
    }

    try {
      const { Charge } = initializeCoinbaseCommerce();

      if (!Charge) {
        throw new Error("Coinbase Commerce Charge class is not available");
      }

      if (typeof Charge.create !== "function") {
        console.error("Charge object:", Charge);
        console.error("Charge methods:", Object.getOwnPropertyNames(Charge));
        throw new Error("Coinbase Commerce Charge.create is not a function");
      }

      console.log("Creating charge with data:", chargeData);
      const charge = await Charge.create(chargeData);
      console.log("Charge created successfully:", charge.id);
      return charge as CoinbaseChargeResponse;
    } catch (error) {
      console.error("Error creating Coinbase Commerce charge:", error);
      throw error;
    }
  }

  static async getCharge(chargeId: string): Promise<CoinbaseChargeResponse> {
    if (typeof window !== "undefined") {
      throw new Error("This method can only be called on the server side");
    }

    try {
      const { Charge } = initializeCoinbaseCommerce();

      if (!Charge) {
        throw new Error("Coinbase Commerce Charge class is not available");
      }

      if (typeof Charge.retrieve !== "function") {
        throw new Error("Coinbase Commerce Charge.retrieve is not a function");
      }

      const charge = await Charge.retrieve(chargeId);
      return charge as CoinbaseChargeResponse;
    } catch (error) {
      console.error("Error retrieving Coinbase Commerce charge:", error);
      throw error;
    }
  }

  static verifyWebhookSignature(
    rawBody: string,
    signature: string,
    webhookSecret: string,
  ): boolean {
    if (typeof window !== "undefined") {
      throw new Error("This method can only be called on the server side");
    }

    try {
      const { Webhook } = initializeCoinbaseCommerce();

      if (!Webhook) {
        throw new Error("Coinbase Commerce Webhook class is not available");
      }

      if (typeof Webhook.verifyEventBody !== "function") {
        throw new Error(
          "Coinbase Commerce Webhook.verifyEventBody is not a function",
        );
      }

      return Webhook.verifyEventBody(rawBody, signature, webhookSecret);
    } catch (error) {
      console.error("Error verifying webhook signature:", error);
      return false;
    }
  }

  static parseWebhookEvent(rawBody: string) {
    try {
      return JSON.parse(rawBody);
    } catch (error) {
      console.error("Error parsing webhook event:", error);
      throw error;
    }
  }
}

// Export types for client-side usage
export type { CoinbaseChargeResponse, CreateChargeData };
