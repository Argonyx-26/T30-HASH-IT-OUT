import { SimulationScenario } from '../types';

export const SCENARIOS: SimulationScenario[] = [
  {
    id: 'scenario-fire-science-annex',
    name: 'Possible Fire Incident',
    category: 'fire_hazard',
    description: 'Multiple independent sensors converge on West Stairwell in the Science Annex, escalating from a thermal anomaly to confirmed manual pull station and crowd outflow.',
    signalTypes: ['Thermal Sensor', 'Operator Dispatch', 'Manual Pull Station', 'Access Control', 'Crowd Optical Flow'],
    expectedOutcome: 'Correlation engine merges 5 scattered signals into 1 Critical Incident, elevating evidence confidence from 61% to 86%.',
    duration: 40,
    events: [
      {
        relativeTime: 4,
        source: 'Thermal Sensor TH-04',
        sourceType: 'sensor',
        zone: 'Science Annex',
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
        zone: 'Science Annex',
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
        zone: 'Science Annex',
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
        zone: 'Science Annex',
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
        zone: 'Science Annex',
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
    description: 'After-hours breach in Engineering Block Server Room starting with perimeter fence disturbance followed by unauthorized badge scan and door forced open.',
    signalTypes: ['Perimeter Sensor', 'Badge Reader', 'Magnetic Lock Sensor', 'Corridor Cam'],
    expectedOutcome: 'Consolidates 4 telemetry alerts into 1 Elevated Security Incident with pinpointed physical access trace.',
    duration: 35,
    events: [
      {
        relativeTime: 4,
        source: 'Perimeter PIR Sensor PR-12',
        sourceType: 'sensor',
        zone: 'Engineering Block',
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
        zone: 'Engineering Block',
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
        zone: 'Engineering Block',
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
        zone: 'Engineering Block',
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
    description: 'Spike in pedestrian density at Student Center Plaza choke point triggering velocity drop and callbox help request.',
    signalTypes: ['Optical Flow Cam', 'Choke Point Flow Sensor', 'Emergency Callbox'],
    expectedOutcome: 'Generates crowd management recommendations prior to escalation without collecting any facial or identity data.',
    duration: 30,
    events: [
      {
        relativeTime: 5,
        source: 'Optical Flow Cam OFC-07',
        sourceType: 'vision_optical',
        zone: 'Student Center',
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
        zone: 'Student Center',
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
        zone: 'Student Center',
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
    description: 'Mechanical vibration and secondary thermal sensors correlate imminent transformer cooling failure at Hostel Substation.',
    signalTypes: ['Vibration Sensor', 'Core Thermal Probe', 'Coolant Loop Sensor'],
    expectedOutcome: 'Early preventive incident flagged with elevated confidence before electrical trip occurs.',
    duration: 30,
    events: [
      {
        relativeTime: 4,
        source: 'Vibration Transducer VB-02',
        sourceType: 'sensor',
        zone: 'Hostel',
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
        zone: 'Hostel',
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
        zone: 'Hostel',
        location: 'Primary Heat Exchanger Loop',
        eventType: 'equipment_overheat',
        severity: 'high',
        confidence: 0.90,
        evidence: 'Flow rate dropped below 12 L/min minimum operating tolerance',
        evidenceCategory: 'confirmed'
      }
    ]
  },
  {
    id: 'scenario-false-alarm',
    name: 'Dust Sensor False Alarm',
    category: 'false_alarm',
    description: 'Isolated particulate spike in Library east wing during routine ventilation cleaning without thermal or optical corroboration.',
    signalTypes: ['Optical Particulate Sensor'],
    expectedOutcome: 'System prevents alarm fatigue by classifying single uncorroborated anomaly as Low Confidence False Alarm.',
    duration: 25,
    events: [
      {
        relativeTime: 5,
        source: 'Particulate Sensor OP-11',
        sourceType: 'sensor',
        zone: 'Library',
        location: 'Archive Stacks East, Level 3',
        eventType: 'dust_spike',
        severity: 'low',
        confidence: 0.42,
        evidence: 'Micro-particle threshold pulse detected; zero ambient temperature or optical flow deviation',
        evidenceCategory: 'supporting'
      }
    ]
  }
];

export const CAMPUS_ZONES = [
  { id: 'zone-science', name: 'Science Annex', shortName: 'SCI', coordinates: { x: 80, y: 70, width: 140, height: 110 } },
  { id: 'zone-engineering', name: 'Engineering Block', shortName: 'ENG', coordinates: { x: 260, y: 50, width: 150, height: 120 } },
  { id: 'zone-library', name: 'Library Complex', shortName: 'LIB', coordinates: { x: 450, y: 60, width: 130, height: 110 } },
  { id: 'zone-student-center', name: 'Student Center', shortName: 'STU', coordinates: { x: 180, y: 210, width: 160, height: 120 } },
  { id: 'zone-admin', name: 'Administration', shortName: 'ADM', coordinates: { x: 380, y: 200, width: 140, height: 100 } },
  { id: 'zone-main-gate', name: 'Main Campus Gate', shortName: 'GATE', coordinates: { x: 280, y: 350, width: 120, height: 70 } },
  { id: 'zone-parking', name: 'South Parking', shortName: 'PRK', coordinates: { x: 80, y: 340, width: 140, height: 80 } },
  { id: 'zone-hostel', name: 'Hostel Quad', shortName: 'HST', coordinates: { x: 450, y: 330, width: 150, height: 90 } },
];
