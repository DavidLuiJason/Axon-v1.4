import { AIAccount, AIModelOption } from '../types';

export const AVAILABLE_AI_MODELS: AIModelOption[] = [
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash',
    provider: 'gemini',
    providerName: 'Google',
    badge: 'Recommended',
    description: 'High-speed multimodal reasoning and responsive chat assistance.',
  },
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'gemini',
    providerName: 'Google',
    badge: 'Next Gen',
    description: 'Ultra-fast multimodal reasoning and responsive assistance.',
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'gemini',
    providerName: 'Google',
    badge: 'Workhorse',
    description: 'High performance multimodal model optimized for real-time chat and workspace tasks.',
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'gemini',
    providerName: 'Google',
    badge: 'Reasoning',
    description: 'Complex reasoning, advanced coding synthesis, and architectural design.',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'claude',
    providerName: 'Anthropic',
    badge: 'Coding Specialist',
    description: 'Advanced systems architecture, nuanced reasoning, and deep code generation.',
  },
  {
    id: 'gpt-4o',
    name: 'ChatGPT 4o',
    provider: 'chatgpt',
    providerName: 'OpenAI',
    badge: 'Omni Multimodal',
    description: 'Versatile multimodal intelligence with advanced vision and structured responses.',
  },
];

export const DEFAULT_AI_ACCOUNTS: AIAccount[] = [
  {
    id: 'account-axon-default',
    provider: 'gemini',
    label: 'Primary Gemini Account',
    apiKey: '',
    isActive: true,
    isRateLimited: false,
    createdAt: new Date().toISOString(),
  },
];

export function isAccountInCooldown(account?: AIAccount): boolean {
  if (!account || !account.cooldownUntil) return false;
  // AXON local/offline core is strictly excluded from usage limits and cooldown tracking
  if (account.provider === 'axon' || account.id?.includes('axon')) {
    return false;
  }
  return Date.now() < account.cooldownUntil;
}

export function getRemainingCooldownString(accountOrCooldownUntil?: AIAccount | number): string {
  if (!accountOrCooldownUntil) return '';
  if (typeof accountOrCooldownUntil === 'object' && (accountOrCooldownUntil.provider === 'axon' || accountOrCooldownUntil.id?.includes('axon'))) {
    return '';
  }
  const cooldownUntil =
    typeof accountOrCooldownUntil === 'number'
      ? accountOrCooldownUntil
      : accountOrCooldownUntil.cooldownUntil;
  if (!cooldownUntil) return '';

  const remainingMs = cooldownUntil - Date.now();
  if (remainingMs <= 0) return '';
  const remainingMin = Math.ceil(remainingMs / (1000 * 60));
  if (remainingMin >= 60) {
    const hours = Math.floor(remainingMin / 60);
    const mins = remainingMin % 60;
    return `${hours}h ${mins}m`;
  }
  return `${remainingMin}m`;
}

export function findAccountByLabel(
  accounts: AIAccount[],
  label: string,
  preferredProvider?: string
): AIAccount | undefined {
  const norm = label.trim().toLowerCase();
  if (preferredProvider) {
    const matched = accounts.find(
      (a) =>
        a.provider === preferredProvider &&
        (a.label.toLowerCase() === norm || a.id.toLowerCase() === norm)
    );
    if (matched) return matched;
  }
  return accounts.find(
    (a) => a.label.toLowerCase() === norm || a.id.toLowerCase() === norm
  );
}
