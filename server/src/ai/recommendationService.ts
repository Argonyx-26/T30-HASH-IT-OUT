import { Incident, RecommendedStep } from '../types';

interface AIResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export class RecommendationService {
  private readonly apiKey = process.env.AI_API_KEY;
  private readonly model = process.env.AI_MODEL || 'gpt-4o-mini';
  private readonly baseUrl = (process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');

  public get isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  public async generate(incident: Incident): Promise<RecommendedStep[]> {
    if (!this.apiKey) {
      throw new Error('AI recommendations are not configured. Set AI_API_KEY on the server.');
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'You are Sentinel response planning AI. Recommend cautious, human-authorized campus safety actions. Never recommend autonomous emergency actions, punishment, identity tracking, or facial recognition. Return JSON only in the shape {"recommendations":[{"step":1,"action":"...","rationale":"...","priority":"immediate|secondary|monitoring"}]}.'
          },
          {
            role: 'user',
            content: JSON.stringify({
              title: incident.title,
              category: incident.category,
              zone: incident.zone,
              location: incident.location,
              severity: incident.severity,
              confidence: incident.confidence,
              summary: incident.summary,
              evidence: incident.events.map(event => ({
                source: event.source,
                sourceType: event.sourceType,
                eventType: event.eventType,
                severity: event.severity,
                confidence: event.confidence,
                evidence: event.evidence
              })),
              uncertainty: incident.evidenceSummary.unknown
            })
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`AI recommendation request failed (${response.status}): ${await response.text()}`);
    }

    const result = await response.json() as AIResponse;
    const content = result.choices?.[0]?.message?.content;
    if (!content) throw new Error('AI recommendation response was empty.');

    const parsed = JSON.parse(content) as { recommendations?: Array<Partial<RecommendedStep>> };
    const recommendations = parsed.recommendations || [];
    if (recommendations.length === 0) throw new Error('AI returned no recommendations.');

    return recommendations.slice(0, 6).map((recommendation, index) => ({
      id: `ai-${incident.id}-${Date.now()}-${index}`,
      step: index + 1,
      action: String(recommendation.action || 'Verify the situation with an authorized operator.'),
      rationale: String(recommendation.rationale || 'Review the available evidence before acting.'),
      completed: false,
      priority: recommendation.priority === 'immediate' || recommendation.priority === 'secondary'
        ? recommendation.priority
        : 'monitoring'
    }));
  }
}
