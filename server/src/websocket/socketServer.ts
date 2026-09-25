import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { ScenarioEngine } from '../simulation/scenarioEngine';

export class SocketServer {
  private io: SocketIOServer;

  constructor(httpServer: HttpServer, private engine: ScenarioEngine) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    this.setupEvents();
    this.wireEngineCallbacks();
  }

  private setupEvents(): void {
    this.io.on('connection', (socket) => {
      // Send initial state on connection
      socket.emit('simulation.state', this.engine.getState());
      socket.emit('incidents.list', this.engine.getIncidents());
      socket.emit('events.list', this.engine.getActiveEvents());

      // Operator client commands over WebSocket
      socket.on('simulation.start', (data) => {
        if (!data?.scenarioId) return;
        const state = this.engine.startScenario(data.scenarioId, false, true);
        if (state.scenarioId) this.io.emit('simulation.state', state);
      });

      socket.on('simulation.event.add', (data) => {
        const event = this.engine.ingestEvent(data);
        if (event) this.io.emit('event.created', event);
      });

      socket.on('simulation.pause', () => {
        const state = this.engine.pause();
        this.io.emit('simulation.state', state);
      });

      socket.on('simulation.resume', () => {
        const state = this.engine.resume();
        this.io.emit('simulation.state', state);
      });

      socket.on('simulation.reset', () => {
        const state = this.engine.reset();
        this.io.emit('simulation.state', state);
        this.io.emit('incidents.list', this.engine.getIncidents());
        this.io.emit('events.list', []);
      });

      socket.on('simulation.speed', (multiplier: number) => {
        const state = this.engine.setSpeed(multiplier);
        this.io.emit('simulation.state', state);
      });

      socket.on('operator.acknowledge', (data) => {
        const incident = this.engine.acknowledgeIncident(data.incidentId, data.operatorName);
        if (incident) {
          this.io.emit('incident.updated', incident);
          this.io.emit('operator.action', { action: 'acknowledge', incidentId: data.incidentId });
        }
      });

      socket.on('operator.resolve', (data) => {
        const incident = this.engine.resolveIncident(data.incidentId, data.operatorName, data.note);
        if (incident) {
          this.io.emit('incident.updated', incident);
          this.io.emit('incident.resolved', { incidentId: data.incidentId });
        }
      });

      socket.on('operator.note', (data) => {
        const incident = this.engine.addOperatorNote(data.incidentId, data.note, data.operatorName);
        if (incident) {
          this.io.emit('incident.updated', incident);
        }
      });

      socket.on('operator.toggleStep', (data) => {
        const incident = this.engine.toggleRecommendationStep(data.incidentId, data.stepId);
        if (incident) {
          this.io.emit('incident.updated', incident);
        }
      });

      socket.on('operator.deleteIncident', async (data) => {
        try {
          const deleted = await this.engine.deleteIncident(data.incidentId);
          if (deleted) {
            this.io.emit('incidents.list', this.engine.getIncidents());
            this.io.emit('events.list', this.engine.getActiveEvents());
          }
        } catch (error) {
          socket.emit('operator.deleteIncident.error', {
            incidentId: data.incidentId,
            message: error instanceof Error ? error.message : 'Incident deletion failed'
          });
        }
      });

      socket.on('operator.clearAudit', async () => {
        try {
          await this.engine.clearAuditLog();
          this.io.emit('audit.cleared');
        } catch (error) {
          socket.emit('operator.clearAudit.error', {
            message: error instanceof Error ? error.message : 'Audit log deletion failed'
          });
        }
      });

      socket.on('operator.deleteAudit', async (data) => {
        try {
          const deleted = await this.engine.deleteAuditEntry(data.auditId);
          if (deleted) this.io.emit('audit.deleted', data.auditId);
        } catch (error) {
          socket.emit('operator.deleteAudit.error', {
            auditId: data.auditId,
            message: error instanceof Error ? error.message : 'Audit entry deletion failed'
          });
        }
      });
    });
  }

  private wireEngineCallbacks(): void {
    this.engine.onSimulationTick = (state) => {
      this.io.emit('simulation.clock', state);
    };

    this.engine.onEventCreated = (event) => {
      this.io.emit('event.created', event);
    };

    this.engine.onIncidentCreated = (incident) => {
      this.io.emit('incident.created', incident);
    };

    this.engine.onIncidentUpdated = (incident) => {
      this.io.emit('incident.updated', incident);
      this.io.emit('confidence.updated', {
        incidentId: incident.id,
        confidence: incident.confidence,
        trajectory: incident.confidenceTrajectory
      });
    };

    this.engine.onAuditCreated = (audit) => {
      this.io.emit('audit.created', audit);
    };
  }

  public getIO(): SocketIOServer {
    return this.io;
  }
}
