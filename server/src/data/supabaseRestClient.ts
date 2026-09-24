type SupabaseConfig = {
  url: string;
  serviceRoleKey: string;
};

export class SupabaseRestClient {
  private readonly config: SupabaseConfig | null;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    this.config = url && serviceRoleKey ? { url, serviceRoleKey } : null;
  }

  public get isConfigured(): boolean {
    return this.config !== null;
  }

  public async select<T>(table: string, query = ''): Promise<T[]> {
    return this.request<T[]>(`/${table}?${query}`, { method: 'GET' });
  }

  public async insert<T>(table: string, value: Record<string, unknown>): Promise<T> {
    const rows = await this.request<T[]>(`/${table}`, {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(value)
    });
    return rows[0];
  }

  public async upsert<T>(table: string, value: Record<string, unknown>): Promise<T> {
    const rows = await this.request<T[]>(`/${table}`, {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(value)
    });
    return rows[0];
  }

  public async remove(table: string, query: string): Promise<void> {
    await this.request<unknown>(`/${table}?${query}`, { method: 'DELETE' });
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    if (!this.config) {
      throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    }

    const response = await fetch(`${this.config.url}/rest/v1${path}`, {
      ...init,
      headers: {
        apikey: this.config.serviceRoleKey,
        Authorization: `Bearer ${this.config.serviceRoleKey}`,
        'Content-Type': 'application/json',
        ...(init.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error(`Supabase request failed (${response.status}): ${await response.text()}`);
    }

    return response.json() as Promise<T>;
  }
}
