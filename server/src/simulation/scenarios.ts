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
        relativeTime: 7,
        source: 'Smoke Detector SD-04',
        sourceType: 'building_system',
        zone: 'New Classroom Block',
        location: 'West Stairwell, Level 2',
        eventType: 'smoke_report',
        severity: 'high',
        confidence: 0.84,
        evidence: 'Particulate reading crossed the smoke threshold for 3 consecutive samples',
        evidenceCategory: 'confirmed'
      },
      {
        relativeTime: 10,
        source: 'Manual Pull Station MP-02',
        sourceType: 'alarm_panel',
        zone: 'New Classroom Block',
        location: 'West Stairwell, Level 2',
        eventType: 'manual_alarm',
        severity: 'critical',
        confidence: 0.91,
        evidence: 'Manual alarm pull station activated by an authorized occupant',
        evidenceCategory: 'confirmed'
      },
      {
        relativeTime: 13,
        source: 'Safety Dispatch Report DR-01',
        sourceType: 'operator_report',
        zone: 'New Classroom Block',
        location: 'West Stairwell, Level 2',
        eventType: 'smoke_report',
        severity: 'high',
        confidence: 0.86,
        evidence: 'Campus safety dispatch reports visible smoke near the west stairwell landing',
        evidenceCategory: 'confirmed'
      },
      {
        relativeTime: 16,
        source: 'Optical Flow Camera OFC-11',
        sourceType: 'vision_optical',
        zone: 'New Classroom Block',
        location: 'West Stairwell, Level 2',
        eventType: 'smoke_report',
        severity: 'high',
        confidence: 0.89,
        evidence: 'Optical feed detects smoke-like movement and occupant outflow at the stairwell',
        evidenceCategory: 'supporting'
      }
    ]
  },
  {
    id: 'scenario-access-breach',
    name: 'Restricted Access Breach',
    category: 'security_breach',
    description: 'After-hours breach near the BMS College of Engineering PG Block starting with perimeter disturbance followed by unauthorized badge scan and forced access.',
    signalTypes: ['Perimeter Sensor', 'Badge Reader', 'Magnetic Lock Sensor', 'Corridor Cam', 'Security Dispatch Feed'],
    expectedOutcome: 'Consolidates 5 telemetry alerts into 1 Critical Security Incident with forced-entry confirmation and perimeter breach escalation.',
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
        relativeTime: 7,
        source: 'Badge Reader BR-08',
        sourceType: 'access_control',
        zone: 'BMS College of Engineering PG Block',
        location: 'South Perimeter Perimeter Fence',
        eventType: 'access_violation',
        severity: 'medium',
        confidence: 0.81,
        evidence: 'Unrecognized badge attempt recorded immediately after perimeter motion',
        evidenceCategory: 'supporting'
      },
      {
        relativeTime: 9,
        source: 'Magnetic Lock Sensor ML-04',
        sourceType: 'sensor',
        zone: 'BMS College of Engineering PG Block',
        location: 'South Perimeter Perimeter Fence',
        eventType: 'access_violation',
        severity: 'medium',
        confidence: 0.78,
        evidence: 'Lock status changed without authorized release sequence during after-hours window',
        evidenceCategory: 'supporting'
      },
      {
        relativeTime: 10,
        source: 'Corridor Camera CC-03',
        sourceType: 'vision_optical',
        zone: 'BMS College of Engineering PG Block',
        location: 'South Perimeter Perimeter Fence',
        eventType: 'access_violation',
        severity: 'critical',
        confidence: 0.96,
        evidence: 'Optical motion trace confirms forced entry through the restricted perimeter segment and unauthorized access into the service corridor',
        evidenceCategory: 'confirmed'
      },
      {
        relativeTime: 13,
        source: 'Security Dispatch Feed SD-17',
        sourceType: 'operator_report',
        zone: 'BMS College of Engineering PG Block',
        location: 'South Perimeter Perimeter Fence',
        eventType: 'access_violation',
        severity: 'high',
        confidence: 0.89,
        evidence: 'Security dispatch confirms a perimeter breach and reports a person exiting the restricted segment against protocol',
        evidenceCategory: 'confirmed'
      }
    ]
  },
  {
    id: 'scenario-crowd-surge',
    name: 'Plaza Crowd Surge Anomaly',
    category: 'crowd_safety',
    description: 'Spike in pedestrian density around the BMSCE PG Block and inner road choke point triggering velocity drop and assistance request.',
    signalTypes: ['Optical Flow Cam', 'Choke Point Flow Sensor', 'Emergency Callbox', 'Queue Density Sensor', 'Public Address Alert'],
    expectedOutcome: 'Correlates 5 independent crowd signals into 1 high-confidence incident and recommends proactive crowd control before panic escalation.',
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
        relativeTime: 8,
        source: 'Choke Point Flow Sensor CF-02',
        sourceType: 'sensor',
        zone: 'BMSCE PG Block',
        location: 'Central Atrium North Gate',
        eventType: 'crowd_anomaly',
        severity: 'medium',
        confidence: 0.83,
        evidence: 'Average pedestrian velocity dropped below the safe movement threshold',
        evidenceCategory: 'supporting'
      },
      {
        relativeTime: 11,
        source: 'Emergency Callbox CB-01',
        sourceType: 'operator_report',
        zone: 'BMSCE PG Block',
        location: 'Central Atrium North Gate',
        eventType: 'crowd_anomaly',
        severity: 'high',
        confidence: 0.87,
        evidence: 'Assistance request reported congestion at the north gate choke point',
        evidenceCategory: 'confirmed'
      },
      {
        relativeTime: 13,
        source: 'Queue Density Sensor QD-04',
        sourceType: 'sensor',
        zone: 'BMSCE PG Block',
        location: 'Central Atrium North Gate',
        eventType: 'crowd_anomaly',
        severity: 'high',
        confidence: 0.85,
        evidence: 'Queue length at the main gate grew 2.4x faster than expected over a 90-second window',
        evidenceCategory: 'supporting'
      },
      {
        relativeTime: 16,
        source: 'Public Address Alert PA-06',
        sourceType: 'building_system',
        zone: 'BMSCE PG Block',
        location: 'Central Atrium North Gate',
        eventType: 'crowd_anomaly',
        severity: 'medium',
        confidence: 0.8,
        evidence: 'Automated public announcement triggered to ease congestion and redirect foot traffic away from the choke point',
        evidenceCategory: 'confirmed'
      }
    ]
  },
  {
    id: 'scenario-equipment-overheat',
    name: 'HVAC Substation Overheat',
    category: 'equipment_failure',
    description: 'Mechanical vibration and thermal sensors correlate imminent equipment cooling failure near the Mechanical Block.',
    signalTypes: ['Vibration Sensor', 'Core Thermal Probe', 'Coolant Loop Sensor', 'Electrical Load Monitor', 'Maintenance Alarm Panel'],
    expectedOutcome: 'Five independent equipment indicators converge into one preventive incident before the mechanical block trips or overheats.',
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
        relativeTime: 7,
        source: 'Core Thermal Probe TP-09',
        sourceType: 'sensor',
        zone: 'Mechanical Block',
        location: 'Substation Basement Bay 1',
        eventType: 'equipment_overheat',
        severity: 'medium',
        confidence: 0.85,
        evidence: 'Core temperature rose 14°C above the safe operating baseline',
        evidenceCategory: 'supporting'
      },
      {
        relativeTime: 10,
        source: 'Coolant Loop Sensor CL-03',
        sourceType: 'building_system',
        zone: 'Mechanical Block',
        location: 'Substation Basement Bay 1',
        eventType: 'equipment_overheat',
        severity: 'high',
        confidence: 0.88,
        evidence: 'Coolant flow dropped below the minimum threshold for equipment cooling',
        evidenceCategory: 'confirmed'
      },
      {
        relativeTime: 12,
        source: 'Electrical Load Monitor EL-14',
        sourceType: 'building_system',
        zone: 'Mechanical Block',
        location: 'Substation Basement Bay 1',
        eventType: 'equipment_overheat',
        severity: 'high',
        confidence: 0.86,
        evidence: 'Electrical load rose 18% above nominal while coolant flow was falling, indicating thermal stress',
        evidenceCategory: 'confirmed'
      },
      {
        relativeTime: 15,
        source: 'Maintenance Alarm Panel MA-06',
        sourceType: 'alarm_panel',
        zone: 'Mechanical Block',
        location: 'Substation Basement Bay 1',
        eventType: 'equipment_overheat',
        severity: 'critical',
        confidence: 0.9,
        evidence: 'Maintenance alarm panel flagged premature wear and a rapid rise in compressor cycle pressure',
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
