import { SimulationScenario } from '../types';

export const SCENARIOS: SimulationScenario[] = [
  {
    id: 'scenario-fire-science-annex',
    name: 'Possible Fire Incident',
    category: 'fire_hazard',
    description: 'Multiple independent sensors converge on the New Classroom Block, escalating from a thermal anomaly to confirmed manual alarm and crowd outflow.',
    signalTypes: ['Thermal Sensor', 'Operator Dispatch', 'Manual Pull Station', 'Access Control', 'Crowd Optical Flow'],
    expectedOutcome: 'Correlation engine merges 5 scattered signals into 1 Critical Incident, elevating evidence confidence from 61% to 86%.',
    duration: 40,
    events: [
      {
        relativeTime: 4,
        source: 'Thermal Sensor TH-04',
        sourceType: 'sensor',
        zone: 'New Classroom Block',
        location: 'West Stairwell, Level 2',
        eventType: 'thermal_anomaly',
        severity: 'high',
        confidence: 0.88,
        evidence: 'Temperature registered 48°C (18°C above historical baseline for West Stairwell)',
        evidenceCategory: 'confirmed'
      },
      {
        relativeTime: 9,
        source: 'Campus Safety Dispatch',
        sourceType: 'operator_report',
        zone: 'New Classroom Block',
        location: 'West Stairwell, Level 2',
        eventType: 'smoke_report',
        severity: 'medium',
        confidence: 0.74,
        evidence: 'Student mobile call reported faint acrid odor and light haze near Stairwell 2',
        evidenceCategory: 'supporting'
      },
      {
        relativeTime: 16,
        source: 'Manual Pull Station MP-02',
        sourceType: 'alarm_panel',
        zone: 'New Classroom Block',
        location: 'West Stairwell, Level 2 Exit',
        eventType: 'manual_alarm',
        severity: 'critical',
        confidence: 0.99,
        evidence: 'Physical glass-break pull station mechanical switch engaged',
        evidenceCategory: 'confirmed'
      },
      {
        relativeTime: 23,
        source: 'Access Door Controller DC-08',
        sourceType: 'access_control',
        zone: 'New Classroom Block',
        location: 'Emergency Egress West Door',
        eventType: 'access_violation',
        severity: 'medium',
        confidence: 0.85,
        evidence: 'Egress panic-hardware push bar triggered during active alarm cycle',
        evidenceCategory: 'supporting'
      },
      {
        relativeTime: 30,
        source: 'Optical Density Cam C-03',
        sourceType: 'vision_optical',
        zone: 'New Classroom Block',
        location: 'West Courtyard Perimeter',
        eventType: 'crowd_anomaly',
        severity: 'high',
        confidence: 0.84,
        evidence: 'Directional optical velocity shows 60+ individuals dispersing away from building footprint',
        evidenceCategory: 'supporting'
      }
    ]
  },
  {
    id: 'scenario-access-breach',
    name: 'Restricted Access Breach',
    category: 'security_breach',
    description: 'After-hours breach near the BMS College of Engineering PG Block starting with perimeter disturbance followed by unauthorized badge scan and forced access.',
    signalTypes: ['Perimeter Sensor', 'Badge Reader', 'Magnetic Lock Sensor', 'Corridor Cam'],
    expectedOutcome: 'Consolidates 4 telemetry alerts into 1 Elevated Security Incident with pinpointed physical access trace.',
    duration: 35,
    events: [
      {
        relativeTime: 4,
        source: 'Perimeter PIR Sensor PR-12',
        sourceType: 'sensor',
        zone: 'BMS College of Engineering PG Block',
        location: 'South Perimeter Perimeter Fence',
        eventType: 'perimeter_motion',
        severity: 'low',
        confidence: 0.72,
        evidence: 'Infrared motion detected along secondary fence line at 22:40 simulated time',
        evidenceCategory: 'supporting'
      },
      {
        relativeTime: 10,
        source: 'Card Reader CR-03',
        sourceType: 'access_control',
        zone: 'BMS College of Engineering PG Block',
        location: 'Server Room 102 Egress Door',
        eventType: 'access_violation',
        severity: 'medium',
        confidence: 0.89,
        evidence: 'Unregistered RFID credential scan attempted 3 times within 15 seconds',
        evidenceCategory: 'confirmed'
      },
      {
        relativeTime: 18,
        source: 'Magnetic Door Sensor DS-07',
        sourceType: 'building_system',
        zone: 'BMS College of Engineering PG Block',
        location: 'Server Room 102 Egress Door',
        eventType: 'access_violation',
        severity: 'critical',
        confidence: 0.98,
        evidence: 'Door Forced Open (DFO) tamper circuit opened without valid authorization signal',
        evidenceCategory: 'confirmed'
      },
      {
        relativeTime: 25,
        source: 'Optical Flow Sensor Cam-14',
        sourceType: 'vision_optical',
        zone: 'BMS College of Engineering PG Block',
        location: 'Corridor B Server Annex',
        eventType: 'crowd_anomaly',
        severity: 'medium',
        confidence: 0.77,
        evidence: 'Sudden optical motion cluster in unlit hallway corridor',
        evidenceCategory: 'supporting'
      }
    ]
  },
  {
    id: 'scenario-crowd-surge',
    name: 'Plaza Crowd Surge Anomaly',
    category: 'crowd_safety',
    description: 'Spike in pedestrian density around the BMSCE PG Block and inner road choke point triggering velocity drop and assistance request.',
    signalTypes: ['Optical Flow Cam', 'Choke Point Flow Sensor', 'Emergency Callbox'],
    expectedOutcome: 'Generates crowd management recommendations prior to escalation without collecting any facial or identity data.',
    duration: 30,
    events: [
      {
        relativeTime: 5,
        source: 'Optical Flow Cam OFC-07',
        sourceType: 'vision_optical',
        zone: 'BMSCE PG Block',
        location: 'Central Atrium North Gate',
        eventType: 'crowd_anomaly',
        severity: 'medium',
        confidence: 0.79,
        evidence: 'Pedestrian density calculated at 3.8 persons/sqm exceeding standard 2.0 baseline',
        evidenceCategory: 'supporting'
      },
      {
        relativeTime: 12,
        source: 'Turnstile Array TA-02',
        sourceType: 'access_control',
        zone: 'BMSCE PG Block',
        location: 'Main Entry Turnstiles',
        eventType: 'crowd_anomaly',
        severity: 'high',
        confidence: 0.86,
        evidence: 'Turnstile throughput stalled at 98% queue capacity with physical pressure sensors active',
        evidenceCategory: 'confirmed'
      },
      {
        relativeTime: 20,
        source: 'Emergency Callbox CB-04',
        sourceType: 'alarm_panel',
        zone: 'BMSCE PG Block',
        location: 'Plaza West Kiosk',
        eventType: 'manual_alarm',
        severity: 'high',
        confidence: 0.95,
        evidence: 'Pedestrian pressed physical blue-light assistance button requesting safety personnel',
        evidenceCategory: 'confirmed'
      }
    ]
  },
  {
    id: 'scenario-equipment-overheat',
    name: 'HVAC Substation Overheat',
    category: 'equipment_failure',
    description: 'Mechanical vibration and thermal sensors correlate imminent equipment cooling failure near the Mechanical Block.',
    signalTypes: ['Vibration Sensor', 'Core Thermal Probe', 'Coolant Loop Sensor'],
    expectedOutcome: 'Early preventive incident flagged with elevated confidence before electrical trip occurs.',
    duration: 30,
    events: [
      {
        relativeTime: 4,
        source: 'Vibration Transducer VB-02',
        sourceType: 'sensor',
        zone: 'Mechanical Block',
        location: 'Substation Basement Bay 1',
        eventType: 'equipment_overheat',
        severity: 'medium',
        confidence: 0.81,
        evidence: 'Harmonic vibration oscillation exceeding 45 Hz threshold',
        evidenceCategory: 'supporting'
      },
      {
        relativeTime: 11,
        source: 'Core Thermal Sensor TH-18',
        sourceType: 'sensor',
        zone: 'Mechanical Block',
        location: 'Transformer Unit 3',
        eventType: 'thermal_anomaly',
        severity: 'high',
        confidence: 0.93,
        evidence: 'Core coil temperature reading 84°C (thermal gradient +3.2°C/min)',
        evidenceCategory: 'confirmed'
      },
      {
        relativeTime: 18,
        source: 'Coolant Flow Switch FL-01',
        sourceType: 'building_system',
        zone: 'Mechanical Block',
        location: 'Primary Heat Exchanger Loop',
        eventType: 'equipment_overheat',
        severity: 'high',
        confidence: 0.90,
        evidence: 'Flow rate dropped below 12 L/min minimum operating tolerance',
        evidenceCategory: 'confirmed'
      }
    ]
  },
];

export const CAMPUS_ZONES = [
  { id: 'zone-mechanical', name: 'Mechanical Block', shortName: 'MECH', coordinates: { x: 70, y: 45, width: 145, height: 85 } },
  { id: 'zone-eng-pg', name: 'BMS College of Engineering PG Block', shortName: 'ENG PG', coordinates: { x: 90, y: 175, width: 190, height: 105 } },
  { id: 'zone-new-classroom', name: 'New Classroom Block', shortName: 'NCB', coordinates: { x: 125, y: 285, width: 170, height: 90 } },
  { id: 'zone-bmsce-pg', name: 'BMSCE PG Block', shortName: 'BMSCE PG', coordinates: { x: 300, y: 175, width: 125, height: 90 } },
  { id: 'zone-mca', name: 'MCA Block', shortName: 'MCA', coordinates: { x: 430, y: 150, width: 100, height: 85 } },
  { id: 'zone-admin', name: 'Administration Block', shortName: 'ADMIN', coordinates: { x: 455, y: 275, width: 125, height: 85 } },
];
