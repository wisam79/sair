import { StreamChat } from 'stream-chat';
import { supabase } from './supabase';

let chatClient: StreamChat | null = null;

export interface StreamTokenResponse {
  token: string;
  apiKey: string;
}

/**
 * Fetches the Stream Chat token and API Key for the logged-in user from the Supabase Edge Function.
 */
export async function fetchStreamToken(): Promise<StreamTokenResponse> {
  const { data, error } = await supabase.functions.invoke('stream-chat-token');
  if (error || !data) {
    throw new Error(error?.message || 'Failed to fetch stream token');
  }
  return data as StreamTokenResponse;
}

/**
 * Returns the active Stream Chat client instance if initialized.
 */
export function getStreamClient(): StreamChat | null {
  return chatClient;
}

/**
 * Initializes the Stream Chat client with the given API key.
 */
export function initStreamClient(apiKey: string): StreamChat {
  if (!chatClient) {
    chatClient = StreamChat.getInstance(apiKey);
  }
  return chatClient;
}

/**
 * Connects the user to Stream Chat, automatically fetching the token and API key if needed.
 */
export async function connectStreamUser(userId: string, userName: string): Promise<StreamChat> {
  // 1. Fetch credentials
  const { token, apiKey } = await fetchStreamToken();

  // 2. Initialize
  const client = initStreamClient(apiKey);

  // 3. Connect (disconnect first if connected to a different user)
  if (client.userID === userId) {
    return client;
  }

  if (client.userID) {
    try {
      await client.disconnectUser();
    } catch (e) {
      console.warn('[Stream] Error disconnecting previous user:', e);
    }
  }

  await client.connectUser(
    {
      id: userId,
      name: userName,
      image: `https://getstream.io/random_png/?name=${encodeURIComponent(userName)}`,
    },
    token,
  );

  return client;
}

/**
 * Disconnects the user from Stream Chat client.
 */
export async function disconnectStreamUser(): Promise<void> {
  if (chatClient && chatClient.userID) {
    await chatClient.disconnectUser();
  }
}
