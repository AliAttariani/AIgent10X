export interface SlackMessage {
  channel: string;
  text: string;
  blocks?: unknown[];
}

export interface SlackClient {
  sendMessage(msg: SlackMessage): Promise<void>;
}

/**
 * In-memory / console Slack mock.
 * - Used for: dev, tests, demos
 * - Later replaced by real Slack provider with tokens
 */
class MockSlackClient implements SlackClient {
  async sendMessage(msg: SlackMessage): Promise<void> {
    console.log("[MockSlack] Message sent:", msg);
  }
}

// Single instance for demo.
const mockSlack = new MockSlackClient();

/**
 * Later this will switch depending on tenant configuration.
 * For now always return the mock client.
 */
export function getSlackClientForTenant(tenantId: string): SlackClient {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _t = tenantId;
  return mockSlack;
}
