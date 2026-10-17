# MachineGuard — Equipment Fault Detector Demo

A predictive-maintenance demo: enter machine sensor readings (temperature, vibration, pressure) and get an instant failure-risk score with a visual gauge and a concrete maintenance recommendation.

## Business problem it solves
Unplanned machine breakdowns are one of the most expensive events in manufacturing — a single hour of stopped production can cost thousands of dollars, not counting repair bills and safety risk. Most small factories still run machines "until they break."

Predictive maintenance flips this: sensor data is scored continuously, and the system warns the team days before a failure — turning emergency repairs into cheap scheduled maintenance.

## What's inside
- `index.html` — complete single-file app (no build step, no backend)
- Three live sensor sliders: bearing temperature, vibration, hydraulic pressure
- Weighted risk model (vibration weighted highest — the strongest real-world failure signal)
- SVG gauge + per-sensor contribution bars, color-coded verdicts
- Three preset scenarios: healthy machine, worn bearing, critical failure risk
- Actionable recommendations: keep running / schedule in 7 days / shut down now

## Try it
Open `index.html`, drag the sliders — or hit the "Critical failure risk" preset and watch the gauge swing red.

## Production version
The live version streams real sensor data (IoT), trains ML models on historical failures, sends SMS/email alerts, and integrates with CMMS work-order systems.

---
**Built by NAN Marketing Agency — need ML dashboards or predictive tools for YOUR operation?**
Fault detectors, data dashboards & custom business apps from **$2,000** → [nidaayesha.com](https://nidaayesha.com)
