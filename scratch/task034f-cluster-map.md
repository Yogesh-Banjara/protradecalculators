# Task 034F: Calculator Topical Cluster Map & Authority Plan

**Document Version**: 1.0  
**Strategic Objective**: Establish semantic topical clusters around all 15 active trade calculators to guide high-intent organic authority and user decision-making without creating low-value programmatic SEO filler.

---

## 1. Concrete & Subgrade Cluster

### Primary Calculator: `/construction/concrete-calculator`
- **Primary Calculation Intent**: Estimating ready-mix volume in cubic yards, cubic feet, and 40lb/60lb/80lb bag counts for slabs, footings, and circular columns with customizable waste margins.
- **Key Supporting Questions**:
  1. *How many 80-lb bags equal 1 cubic yard?* (Addressed on-page: 45 bags per cu yd).
  2. *What is the standard gravel base depth under a 4-inch concrete slab?* (Addressed on-page: 4 inches compacted #57 stone).
  3. *When does ready-mix delivery become cheaper than buying bagged concrete?* (Addressed on-page: ~1.0 cubic yard break-even point).
- **Existing On-Page Content**: Complete step-by-step HowTo measurement schema, bag yield conversion chart, and 8 comprehensive FAQ items.
- **Recommended Future Content (P1)**: *Ready-Mix Truck Ordering vs. Bagged Concrete Hand-Mixing Guide (Labor & Cost Break-Even)*.
- **Related Calculators**: `/materials/gravel-calculator`, `/construction/deck-calculator`, `/construction/stair-calculator`.
- **Primary Internal-Link Target**: `/materials/gravel-calculator` ("Calculate gravel subgrade cushion").

---

## 2. Wall Framing & Lumber Takeoff Cluster

### Primary Calculator: `/construction/framing-calculator`
- **Primary Calculation Intent**: Estimating 16″ OC and 24″ OC wall studs, top/bottom plates, window/door headers, cripples, king/jack studs, and total board feet.
- **Key Supporting Questions**:
  1. *How do I calculate stud count with corners and intersections?* (Addressed on-page: 1 stud per foot rule + 2 per corner).
  2. *What is the difference between single and double top plates?* (Addressed on-page: Bearing walls require doubled top plates for load distribution).
  3. *How much waste should be budgeted for bowed/crowned studs?* (Addressed on-page: Standard 10% lumber culling factor).
- **Existing On-Page Content**: 16″ vs 24″ stud spacing comparison, header sizing rule-of-thumb table, and HowTo framing guide.
- **Recommended Future Content (P2)**: *Lumber Sizing Guide: When to Frame with 2x4 vs 2x6 Exterior Walls (Insulation & Structural Span)*.
- **Related Calculators**: `/materials/drywall-calculator`, `/construction/deck-calculator`, `/construction/concrete-calculator`.
- **Primary Internal-Link Target**: `/materials/drywall-calculator` ("Estimate drywall sheets for framed walls").

---

## 3. Deck Assembly & Framing Cluster

### Primary Calculator: `/construction/deck-calculator`
- **Primary Calculation Intent**: Estimating composite and wood surface boards, 12″/16″ OC joists, drop beams, concrete sonotube piers, and fastener packages.
- **Key Supporting Questions**:
  1. *Why does composite decking require 12-inch joist spacing?* (Addressed on-page: Prevents sagging and thermal deflection).
  2. *How deep must sonotube concrete pier footings be poured?* (Addressed on-page: Below regional frost line, minimum 12″ diameter).
  3. *How is picture frame perimeter border framing supported?* (Addressed on-page: Requires double rim joists and perimeter ladder blocking).
- **Existing On-Page Content**: Interactive isometric structural model, IRC Table R507 joist span limits, fastener count formulas, and FAQ schedule.
- **Recommended Future Content (P1)**: *IRC Table R507 Prescriptive Deck Beam & Joist Span Reference Guide*.
- **Related Calculators**: `/construction/concrete-calculator`, `/construction/framing-calculator`, `/construction/stair-calculator`.
- **Primary Internal-Link Target**: `/construction/concrete-calculator` ("Calculate sonotube pier concrete volume").

---

## 4. Stair Geometry & Stringer Layout Cluster

### Primary Calculator: `/construction/stair-calculator`
- **Primary Calculation Intent**: Calculating exact riser heights, tread depths, total stair run, stringer stock board length, and bottom riser deduction.
- **Key Supporting Questions**:
  1. *What is the 17–18 inch stair comfort rule?* (Addressed on-page: $\text{Riser} + \text{Tread} = 17″ \text{ to } 18″$).
  2. *Why must the bottom riser be cut shorter than the other risers?* (Addressed on-page: Deduct tread thickness to maintain uniform step height).
  3. *What is the minimum IRC headroom clearance over stairs?* (Addressed on-page: 6 ft 8 in / 80 inches continuous).
- **Existing On-Page Content**: Sawtooth stringer SVG model, IRC R311 code boundaries, and step-by-step layout guide.
- **Recommended Future Content (P2)**: *Cutting Stair Stringers: Step-by-Step Framing Square & Gauge Setup*.
- **Related Calculators**: `/construction/deck-calculator`, `/construction/framing-calculator`, `/construction/concrete-calculator`.
- **Primary Internal-Link Target**: `/construction/deck-calculator` ("Calculate deck platform framing").

---

## 5. Roof Pitch & Rafter Geometry Cluster

### Primary Calculator: `/construction/roof-pitch-calculator`
- **Primary Calculation Intent**: Calculating pitch ratios ($X/12$), slope angles, common rafter line length, overhang, ridge rise, birdsmouth cuts, and roofing squares.
- **Key Supporting Questions**:
  1. *How do I convert roof pitch in inches per foot to degrees?* (Addressed on-page: $\theta = \arctan(\text{Pitch}/12)$).
  2. *How many bundles of 3-tab or architectural shingles make 1 square?* (Addressed on-page: 3 bundles = 100 sq ft).
  3. *What is the minimum roof pitch for standard asphalt shingles?* (Addressed on-page: 2:12 minimum with double underlayment, 4:12 standard).
- **Existing On-Page Content**: Pitch conversion reference table, rafter triangle diagram, and roofing square material formulas.
- **Recommended Future Content (P3)**: *Birdsmouth Seat Cut Geometry & Maximum Rafter Overhang Guidelines*.
- **Related Calculators**: `/construction/framing-calculator`, `/construction/stair-calculator`.
- **Primary Internal-Link Target**: `/construction/framing-calculator` ("Calculate wall top plate lumber").

---

## 6. Electrical Voltage Drop & Conductor Sizing Cluster

### Primary Calculator: `/electrical/voltage-drop-calculator`
- **Primary Calculation Intent**: Sizing single-phase, 3-phase, and DC conductors to maintain $<3\%$ voltage drop over distance per NEC guidelines.
- **Key Supporting Questions**:
  1. *What size wire do I need for a 100-amp subpanel 150 feet away?* (Addressed on-page: #1 AWG Copper or 2/0 AWG Aluminum).
  2. *Why does voltage drop increase with circuit distance?* (Addressed on-page: Conductor resistance accumulates linearly: $V_d = \frac{2KIL}{CM}$).
  3. *When must aluminum wire be upsized compared to copper?* (Addressed on-page: Aluminum requires approximately 1 to 2 gauge sizes larger for equivalent resistance).
- **Existing On-Page Content**: NEC 310.16 ampacity table, continuous load $125\%$ multiplier rules, and single/3-phase formulas.
- **Recommended Future Content (P1)**: *Subpanel Feeder Sizing Guide: 100A, 150A, and 200A Conductors by Distance*.
- **Related Calculators**: `/electrical/conduit-fill-calculator`, `/electrical/residential-load-calculator`.
- **Primary Internal-Link Target**: `/electrical/conduit-fill-calculator` ("Verify conduit trade size for upsized conductors").

---

## 7. Electrical Raceway & Box Fill Cluster

### Primary Calculators: `/electrical/conduit-fill-calculator` & `/electrical/box-fill-calculator`
- **Primary Calculation Intent**: Calculating raceway fill percentages across EMT/PVC/RMC/FMC per NEC Chapter 9 Table 1 (40% limit) and junction box cubic-inch volume per NEC 314.16.
- **Key Supporting Questions**:
  1. *What is the maximum number of #12 THHN wires in a 1/2″ EMT conduit?* (Addressed on-page: 9 conductors at 40% fill).
  2. *How do device yokes and internal cable clamps count toward box fill?* (Addressed on-page: Device yoke = 2 volume allowances based on largest conductor).
  3. *What causes conductor jamming during wire pulls?* (Addressed on-page: Jamming ratio between 2.8 and 3.2 in 3-wire pulls).
- **Existing On-Page Content**: Circular wire cross-section diagram, NEC raceway area tables, and box volume allowance calculators.
- **Recommended Future Content (P2)**: *NEC 40% Conduit Fill vs. 60% Nipple Exemptions Explained*.
- **Related Calculators**: `/electrical/voltage-drop-calculator`, `/electrical/residential-load-calculator`.
- **Primary Internal-Link Target**: `/electrical/voltage-drop-calculator` ("Calculate wire gauge for feeder distance").

---

## 8. Residential Service Load & Panel Upgrades Cluster

### Primary Calculator: `/electrical/residential-load-calculator`
- **Primary Calculation Intent**: Sizing 100A, 150A, 200A, and 400A electrical service entrances using the NEC 220.82 optional calculation method.
- **Key Supporting Questions**:
  1. *Do I need a 200-amp service upgrade to install a 48-amp Level 2 EV charger?* (Addressed on-page: Load calculation determines remaining service capacity).
  2. *How is general lighting and small appliance load calculated under NEC 220.82?* (Addressed on-page: 3 VA/sq ft + two 1,500 VA small appliance circuits + laundry, first 10 kVA @ 100%, remainder @ 40%).
- **Existing On-Page Content**: Interactive load schedule with dedicated inputs for heat pumps, EV chargers, electric ranges, and water heaters.
- **Recommended Future Content (P1)**: *Home EV Charger Electrical Load Calculation & 200A Panel Sizing (NEC 220.82)*.
- **Related Calculators**: `/electrical/voltage-drop-calculator`, `/electrical/conduit-fill-calculator`.
- **Primary Internal-Link Target**: `/electrical/voltage-drop-calculator` ("Size service entrance feeder conductors").

---

## 9. HVAC BTU Sizing & Duct CFM Cluster

### Primary Calculators: `/hvac/btu-calculator` & `/hvac/duct-sizing-calculator`
- **Primary Calculation Intent**: Sizing cooling/heating BTU/hr, AC tonnage ($1.5–5\text{ tons}$), mini-split heat pumps, and sizing round/rectangular duct dimensions via equal friction airflow.
- **Key Supporting Questions**:
  1. *How many square feet does 1 ton of AC cool?* (Addressed on-page: $400–600\text{ sq ft}$ per ton depending on climate zone).
  2. *What round duct diameter is needed for a 400 CFM room supply branch?* (Addressed on-page: 10-inch round duct @ 733 FPM).
  3. *Why are rectangular ducts sized using equivalent hydraulic diameter?* (Addressed on-page: Huebscher formula equates rectangular aspect ratios to circular friction loss).
- **Existing On-Page Content**: Climate zone multiplier matrix, insulation levels, sensible/latent heat tables, and duct friction schedules.
- **Recommended Future Content (P2)**: *Mini-Split BTU Sizing: Room-by-Room Load Calculation Guide*.
- **Related Calculators**: `/hvac/btu-calculator` $\longleftrightarrow$ `/hvac/duct-sizing-calculator`.
- **Primary Internal-Link Target**: `/hvac/duct-sizing-calculator` ("Size ductwork for calculated room CFM").

---

## 10. Plumbing Drainage (DFU) & Potable Supply (WSFU) Cluster

### Primary Calculators: `/plumbing/dfu-calculator` & `/plumbing/wsfu-calculator`
- **Primary Calculation Intent**: Sizing sanitary branch drains, soil stacks, and building sewers using Drainage Fixture Units (DFU), and sizing potable water lines via Water Supply Fixture Units (WSFU) and Hunter's Curve.
- **Key Supporting Questions**:
  1. *What is the minimum pipe size for a residential water closet (toilet)?* (Addressed on-page: 3-inch minimum horizontal branch / vertical stack).
  2. *Why is 1/4″ per foot standard slope required for drainage?* (Addressed on-page: Maintains 2.0 FPS self-scouring velocity).
  3. *How does Hunter's Curve convert intermittent fixture units to continuous GPM?* (Addressed on-page: Non-linear probability curve models simultaneous fixture usage).
- **Existing On-Page Content**: IPC and UPC fixture unit assignment tables, maximum DFU capacity limits by slope, and pipe velocity guidelines.
- **Recommended Future Content (P1)**: *IPC vs UPC Drain Pipe Sizing: Maximum DFU Tables by Pipe Slope*.
- **Related Calculators**: `/plumbing/dfu-calculator` $\longleftrightarrow$ `/plumbing/wsfu-calculator`.
- **Primary Internal-Link Target**: `/plumbing/wsfu-calculator` ("Size potable water supply lines").
