# Task 034C: Product UX Architecture & Calculator Interaction Specification

**Document Version**: 1.0  
**Classification**: Strategy & UX Architecture (No Code Implementation)  
**Target Metric**: Category Authority & $500/month AdSense Monetization via Extreme High-Engagement Utility

---

## 1. Product UX Principles

We are building a **Professional Digital Trade Calculation Hub**. The system must NOT be a clone of Calculator.net, a flat form directory, a cyberpunk tech demo, or a fake CAD application. 

Instead, the product acts like a **Master Tradesperson's Digital Workshop**:
Every instrument looks related and cohesive, but each instrument is tailored specifically to its physical engineering discipline.

### Core Interaction Paradigm
$$\text{Job / Question} \longrightarrow \text{Simple Input} \longrightarrow \text{Understand Physical Model} \longrightarrow \text{Live Visual Sync} \longrightarrow \text{Primary Answer} \longrightarrow \text{Decision / Takeoff} \longrightarrow \text{Trust / Methodology}$$

### The 4 Non-Negotiable Product Laws:
1. **Never Output Isolated Numbers**: A number without a jobsite decision (e.g. `6.84 yd³` vs `Order 7.00 yd³ Truck` or `18.4A` vs `Use #10 AWG on 20A Breaker`) is an unfinished thought.
2. **Visuals Must Be Meaningful, Not Decorative**: If an SVG or canvas does not visually morph or convey technical spatial relationships when inputs change, it must not exist.
3. **Restrained Engineering Aesthetic**: Use dark high-contrast blueprint drafting visuals (`bg-slate-950`, `.bg-blueprint-grid`, `.glass-dock`, `.glass-canvas`) with zero cartoonish neon glows or gaming visual noise.
4. **Uncompromising Engineering Trust**: Explicitly state governing code references (NEC 2023/2026, IRC 2024, IPC/UPC 2024, ASHRAE Fundamentals) with clear disclaimers that digital estimates do not replace stamped engineered drawings or local AHJ requirements.

---

## 2. Product UX Archetypes

Every calculator belongs to one of 6 distinct UX Archetypes:

| Archetype | Name | Core Interaction Model | Flagship Example |
| :--- | :--- | :--- | :--- |
| **A** | **Visual Estimating Instrument** | 3D/Isometric volumetric morphing + concrete truck / bulk aggregate ordering. | Concrete Slab, Gravel / Aggregate |
| **B** | **Geometric Layout Tool** | True cut-profile 2D CAD elevation with live slope triangles, run/rise extension lines, and fractional cut callouts. | Stairs, Roof Pitch |
| **C** | **Material Takeoff Tool** | Architectural framing/surface elevation + full bill-of-materials (BOM) schedule with waste factors. | Wall Framing, Drywall, Deck |
| **D** | **Engineering Sizing Tool** | Physics-driven circuit/thermal/airflow model with threshold safety margins and equipment sizing decisions. | Voltage Drop, HVAC BTU, Duct Sizing |
| **E** | **Code / Table Lookup + Sizing Tool** | Complex mixed-inventory schedule evaluated against prescriptive code tables for raceway/box/pipe sizing. | Conduit Fill, Box Fill, Plumbing DFU, Plumbing WSFU |
| **F** | **Load & Capacity Analysis Tool** | Stepwise multi-category electrical demand schedule with NEC 220 diversity factors and service panel rating output. | Residential Electrical Load |

---

## 3. The 15-Calculator Master Architecture Matrix

| # | Calculator | Category | Archetype | Visual Model Type | Primary Decision Output | Commercial Value | Next Priority |
| :- | :--- | :--- | :-: | :--- | :--- | :-: | :-: |
| 1 | **Concrete Calculator** | Construction | **A** | Isometric 3D Slab + Rebar Mesh | Ready-Mix Delivery Truck Order (yd³) | **HIGH** | *Completed (Reference)* |
| 2 | **Wall Framing Calculator** | Construction | **C** | Architectural Wall Elevation CAD | Total Studs with Culling + Plate LF | **HIGH** | *Completed (Flagship)* |
| 3 | **Stair Stringer Calculator** | Construction | **B** | Sawtooth Stringer Cut Profile CAD | Stringer Board Stock Order + Exact Cuts | **HIGH** | *Completed (Flagship)* |
| 4 | **Deck Calculator** | Construction | **C** | 3D Structural Deck Framing Plan | Complete Lumber Takeoff (Joists, Beams, Decking) | **HIGH** | **PRIORITY 1** |
| 5 | **Roof Pitch & Rafters** | Construction | **B** | Rafter Slope Triangle & Ridge Profile | Common Rafter Length + Cut Angles + Pitch | **HIGH** | **PRIORITY 2** |
| 6 | **Drywall Takeoff** | Materials | **C** | Multi-Room Wall & Ceiling Surface Net | Sheet Count (4x8 / 4x12) + Mud/Tape/Screws | **MEDIUM** | Standard Rollout |
| 7 | **Gravel & Aggregate** | Materials | **A** | Volumetric Trench/Bed Profile | Bulk Delivery Truckloads (Tons / Yards) | **HIGH** | Standard Rollout |
| 8 | **Residential Electrical Load**| Electrical | **F** | Electrical Service Panel Load Schedule | Main Service Rating (100A / 200A / 400A) | **HIGH** | **PRIORITY 3** |
| 9 | **Voltage Drop Calculator** | Electrical | **D** | Single-Line Circuit Loop Schematic | Minimum AWG Upsize for <3% Drop | **HIGH** | **PRIORITY 4** |
| 10| **Conduit Fill Calculator** | Electrical | **E** | Raceway Cross-Section Wire Packing | Minimum Trade Size Raceway (EMT/PVC/RMC) | **HIGH** | *Completed (Flagship)* |
| 11| **Electrical Box Fill** | Electrical | **E** | Gang Box Volume & Device Fill Profile | Minimum Box Volume (cu in) + Gang Type | **MEDIUM** | Standard Rollout |
| 12| **HVAC BTU Load** | HVAC | **D** | Building Thermal Envelope Blueprint | Recommended AC Tonnage + Heating BTU | **HIGH** | *Completed (Flagship)* |
| 13| **HVAC Duct Sizing** | HVAC | **D** | Equal Friction Airflow Duct Cross-Section | Round Diameter / Rectangular Duct Size | **MEDIUM** | Standard Rollout |
| 14| **Plumbing DFU Calculator** | Plumbing | **E** | Sanitary Soil Stack & Drain Slope CAD | Recommended Building Drain & Stack Size | **HIGH** | *Completed (Flagship)* |
| 15| **Plumbing WSFU Sizing** | Plumbing | **E** | Water Supply Meter & Branch Schematic | Meter & Main Water Service Pipe Size | **HIGH** | Standard Rollout |

---

## 4. Comprehensive Calculator Specifications (1 through 15)

---

### 1. Concrete Calculator
- **Archetype**: `A — Visual Estimating Instrument`
- **1. User Job**: "How many cubic yards of ready-mix concrete do I need to order for my slab/footing/piers, how many delivery trucks is that, and how much gravel and rebar do I need to prepare the site?"
- **2. Primary Inputs**:
  - *Essential*: Shape (Slab / Footing / Round Pier), Length, Width, Thickness (or Diameter / Depth).
  - *Optional*: Multi-section addition, Unit selection (Imperial / Metric), Rebar grid spacing (12″ / 18″ / 24″), Gravel sub-base depth.
  - *Advanced*: Jobsite waste factor (0% to 25%, default 10%), Premix bag size (40lb / 50lb / 60lb / 80lb), Custom $/yd³ cost rate.
- **3. Visual Model**: `Isometric 3D Slab + Plan View Toggle`.
  - *Why*: Concrete is a 3-dimensional volume. A 3D isometric model communicates depth vs width/length intuitively and proves to the user that rebar and gravel sub-base layers have been accounted for.
- **4. What Must Physically Change**:
  - Length input $\to$ Extends top and bottom isometric edges.
  - Width input $\to$ Extends angled isometric side edges.
  - Thickness input $\to$ Visibly thickens vertical corner extrusion vertices and updates depth bracket ticks.
  - Rebar toggle $\to$ Renders red dashed rebar mesh inside the transparent slab.
- **5. Primary Answer**: Total concrete volume in **Cubic Yards (`yd³`)** and **Cubic Meters (`m³`)**.
- **6. Decision Output**: **Ready-Mix Delivery Order Recommendation** (e.g. `7.00 yd³ Truck` rounded up to the nearest 0.25–0.5 yd³ commercial batch charge) OR exact **Premixed Bags Count** (e.g. `309 bags of 80-lb Premix`).
- **7. Takeoff**: **YES**. Full Bill of Materials: Concrete volume (yd³), 80-lb bags, Compacted gravel subgrade (tons), Rebar 20ft sticks (#4), Tie wire, and Estimated total cost.
- **8. Unit System**:
  - Dimensions: `ft`, `in`, `m`, `cm`, `mm`.
  - Output: `yd³`, `cu ft`, `m³`, `tons`, `bags`.
- **9. Trust / Methodology**:
  - Calculation basis: $V = \frac{L \times W \times (T/12)}{27}$.
  - Concrete density assumed: $145\text{ lbs/cu ft} \approx 4,000\text{ lbs/yd³}$.
  - Note: Ready-mix suppliers typically have 1.0–2.0 yd³ minimum dispatch charges.
- **10. Mobile Flow**: `Dimensions & Units → Live Isometric 3D Canvas → Ordering Decision HUD → Itemized Takeoff → Pouring Methodology`.
- **11. Search Intent**:
  - *Primary*: `concrete calculator`, `how many yards of concrete do i need`, `concrete slab calculator`.
  - *Secondary*: `how many 80lb bags of concrete in a yard`, `concrete driveway cost calculator`.
  - *Commercial*: Ready-mix suppliers, concrete delivery, rebar, plate compactors.
- **12. Commercial Value**: **HIGH** (Extremely high contractor and DIY search volume with intent to purchase materials immediately).
- **13. Differentiation**: Live 3D isometric morphing with non-destructive Imperial $\leftrightarrow$ Metric conversion, combined multi-section project scheduling, and ready-mix truck rounding.

---

### 2. Wall Framing & Stud Calculator
- **Archetype**: `C — Material Takeoff Tool`
- **1. User Job**: "How many 2x4 or 2x6 studs, top/bottom plates, headers, and corner packs do I need to buy to frame my exterior or interior walls with window/door cutouts?"
- **2. Primary Inputs**:
  - *Essential*: Wall Length (ft), Wall Height (ft), Stud Spacing (16″ OC / 24″ OC), Lumber Size (2x4 / 2x6).
  - *Optional*: Double Top Plate toggle, Corner count (2/3/4-stud corners), Intersection T-posts, Window & Door rough openings (Width × Height).
  - *Advanced*: Waste factor (5% to 20%, default 10%), Stock plate board length (10′, 12′, 14′, 16′), Board foot cost.
- **3. Visual Model**: `Architectural Wall Elevation Blueprint (2D CAD)`.
  - *Why*: Wall framing is an elevation layout. Showing the physical array of studs, double top plates, continuous sole plate, and king/jack studs around window/door headers immediately establishes credibility.
- **4. What Must Physically Change**:
  - Wall Length $\to$ Dynamically scales wall frame width and regenerates the vertical stud array.
  - Spacing (16″ $\to$ 24″) $\to$ Stud array spacing visibly widens, decreasing stud density on screen.
  - Adding Window/Door $\to$ Inserts colored opening box with double trimmer/jack studs, king studs, top header block, and bottom sill plate.
  - Layer Filter (`Studs`, `Plates`, `Headers`) $\to$ Highlights selected members and dims others.
- **5. Primary Answer**: Total **Studs to Purchase (including culling/waste)**.
- **6. Decision Output**: **Itemized Lumber Yard Purchase List** (e.g. `31 Studs (2x4 96″) + 6 Plate Boards (2x4 16′) + 1 Header (2x8 10′)`).
- **7. Takeoff**: **YES**. Complete framing schedule: Stud pieces, Top/bottom plate lineal feet, Plate boards (16′ stock), Header lumber, Total Board Feet (BF), and Corner/T-post backing breakdown.
- **8. Unit System**:
  - Length: `ft`, `in`, `m`, `mm`.
  - Spacing: `16″ OC`, `24″ OC`, `12″ OC`, `19.2″ OC` (engineered joist standard).
  - Output: `Pieces`, `Linear Feet (LF)`, `Board Feet (BF)`.
- **9. Trust / Methodology**:
  - Formula: $\text{Base Studs} = \text{ceil}\left(\frac{\text{Length} \times 12}{\text{Spacing}}\right) + 1 + \text{Corners} + \text{Intersections} + 2 \times \text{Openings}$.
  - Plate LF: $3 \times \text{Length}$ for double top plate + single bottom plate.
  - Prescriptive guidance: Compliant with IRC 2024 Table R602.3(1) fastener and stud schedules.
- **10. Mobile Flow**: `Wall Dimensions & Spacing → Live Elevation Blueprint → Lumber Ordering HUD → Member Takeoff → Framing Guide`.
- **11. Search Intent**:
  - *Primary*: `framing calculator`, `how many studs do i need for a 20 foot wall`, `wall stud calculator`.
  - *Secondary*: `2x4 vs 2x6 framing calculator`, `lumber takeoff calculator`.
  - *Commercial*: Lumber yards, Home Depot/Lowe's lumber delivery, framing nailers.
- **12. Commercial Value**: **HIGH** (High material spend per project, high commercial CPC from building suppliers).
- **13. Differentiation**: Live architectural elevation showing openings with exact king/jack stud placement and layer filters.

---

### 3. Stair Stringer & Riser Calculator
- **Archetype**: `B — Geometric Layout Tool`
- **1. User Job**: "How do I cut my 2x12 stair stringers so that every riser and tread is identical, code-compliant, and the bottom step doesn't end up too tall or short after floor finishes?"
- **2. Primary Inputs**:
  - *Essential*: Total Rise (finished floor to finished floor in inches).
  - *Optional*: Target Riser Height (default 7.5″), Target Tread Depth (default 10.5″), Stair Width (in), Stringer stock lumber (2x12, 2x14, LVL).
  - *Advanced*: Tread thickness (default 1.0″), Finished lower floor thickness (default 0.75″), Finished upper floor thickness (default 0.75″), Wellhole opening length (for headroom check), Code Standard (IRC Residential / IBC Commercial).
- **3. Visual Model**: `Sawtooth Stringer Cut Profile (2D CAD Section)`.
  - *Why*: Stair building is purely geometric. Carpenters need to see the exact sawtooth notch cut profile, stringer slope angle, and bottom riser deduction.
- **4. What Must Physically Change**:
  - Total Rise input $\to$ Step notches physically increase/decrease in count (e.g. $14 \to 16$ steps) and incline angle shifts.
  - Story Height Presets ($8', 9', 10'$) $\to$ Total rise adjusts and regenerates the entire stringer geometry.
  - Tread Depth $\to$ Step runs visibly widen or tighten.
- **5. Primary Answer**: **Exact Unit Rise & Unit Tread** in precise trade fractions (e.g. `7-11/16″ Rise`, `10-1/2″ Tread`).
- **6. Decision Output**: **Stringer Stock Board Order + Cut Guide** (e.g. `Order 3 pieces of 2x12 × 16′ Stock Lumber; Cut bottom riser by 0.25″ for floor finish compensation`).
- **7. Takeoff**: **YES**. Number of stringer boards, stringer stock length (10′, 12′, 14′, 16′, 20′), tread boards, riser boards, stringer hanger brackets, and structural screws.
- **8. Unit System**:
  - Inputs: `inches`, `feet-and-inches`, `mm`, `cm`.
  - Outputs: Fractional inches (to nearest $1/16''$), decimal inches, degrees ($^\circ$).
- **9. Trust / Methodology**:
  - IRC 2024 Section R311.7: Max riser 7-3/4″, Min tread 10.0″, Min headroom 80″ (6′ 8″), Max variation between steps 3/8″.
  - Blondel's Comfort Formula check: $2R + T = 24'' \text{ to } 25''$.
  - Bottom Riser Deduction formula: $\text{Deduction} = \text{Tread Thickness} - \text{Lower Floor Finish}$.
- **10. Mobile Flow**: `Total Rise Input → Live Sawtooth CAD Profile → Cut Geometry HUD → Prescriptive Code Badges → Takeoff & Cut Schedule`.
- **11. Search Intent**:
  - *Primary*: `stair calculator`, `how to calculate stair stringers`, `stair riser and tread calculator`.
  - *Secondary*: `irc stair code requirements`, `stair stringer cut layout`.
  - *Commercial*: Stair parts, oak treads, railing systems, stringer hangers.
- **12. Commercial Value**: **HIGH** (Carpenters and homeowners actively look up stair calculators on mobile on the jobsite).
- **13. Differentiation**: Live sawtooth profile with fractional dimensions, bottom riser deduction math, and instant IRC compliance verification.

---

### 4. Deck Calculator (Recommended Priority Redesign #1)
- **Archetype**: `C — Material Takeoff Tool`
- **1. User Job**: "What lumber, joists, beams, footings/posts, decking boards, and fasteners do I need to build a code-compliant residential deck of a given size and height?"
- **2. Primary Inputs**:
  - *Essential*: Deck Length (along house, ft), Deck Width / Projection (out from house, ft), Deck Height off ground (ft).
  - *Optional*: Joist spacing (12″ OC for composite / 16″ OC for wood), Decking material (5/4x6 treated wood / composite boards), Attached to ledger vs Free-standing.
  - *Advanced*: Post spacing, Soil bearing capacity for footing diameter, Beam size (double 2x8 / 2x10 / 2x12), Fastener type (hidden clips / screws).
- **3. Visual Model**: `Structural Deck Framing Plan (Isometric 3D / Plan CAD Toggle)`.
  - *Why*: A deck consists of 4 distinct structural layers: Footings/Piers $\to$ Posts $\to$ Beams $\to$ Joists $\to$ Decking boards. Visualizing this assembly eliminates framing mistakes.
- **4. What Must Physically Change**:
  - Deck Length / Projection $\to$ Deck framing expands in 3D/Plan.
  - Joist Spacing (12″ vs 16″) $\to$ Joist array density visibly changes.
  - Deck Height $\to$ Support posts elongate, showing diagonal bracing when height $> 6'$.
  - Layer Filters (`Footings`, `Framing`, `Decking Surface`) $\to$ Toggles visibility of structural sub-layers.
- **5. Primary Answer**: Total **Square Footage + Complete Bill of Materials (BOM)**.
- **6. Decision Output**: **Lumber Yard Order Schedule** (e.g. `1 Ledger (2x10 16′) + 14 Joists (2x8 12′) + 2 Built-up Beams + 4 Footings (12″ dia) + 42 Decking Boards (16′)`).
- **7. Takeoff**: **YES**. Full Bill of Materials: Joists, Ledger, Rim Joists, Beams, 4x4 or 6x6 Posts, Concrete for footings (bags/yards), Decking boards, Ledger bolts, Joist hangers, Deck screws.
- **8. Unit System**: `ft`, `in`, `sq ft`, `m`, `m²`.
- **9. Trust / Methodology**:
  - Based on American Wood Council (AWC) DCA 6 *Prescriptive Residential Wood Deck Construction Guide* and IRC 2024 Section R507.
  - Maximum joist spans table for Southern Pine / Douglas Fir #2.
- **10. Mobile Flow**: `Deck Dimensions & Material → Structural Framing Canvas → Deck Takeoff HUD → Layer Schedule → IRC Span Tables`.
- **11. Search Intent**:
  - *Primary*: `deck calculator`, `deck material calculator`, `how much lumber for a 12x16 deck`.
  - *Secondary*: `deck joist span calculator`, `deck footing calculator`.
  - *Commercial*: Trex/TimberTech composite decking, treated lumber, Simpson Strong-Tie hardware, CAMO hidden fasteners.
- **12. Commercial Value**: **HIGH** (Very high ticket size, major home improvement ad categories).
- **13. Differentiation**: Multi-layer framing plan showing ledger, joists, beams, and footings with AWC DCA 6 prescriptive span limits.

---

### 5. Roof Pitch & Rafter Calculator (Recommended Priority Redesign #2)
- **Archetype**: `B — Geometric Layout Tool`
- **1. User Job**: "Given my roof span and pitch (e.g. 6/12), what is my rafter line length, cut angles (plumb cut and seat cut for birdsmouth), roof surface area, and bundle count of shingles?"
- **2. Primary Inputs**:
  - *Essential*: Building Span (or Run, ft), Roof Pitch (X/12) or Rise (in).
  - *Optional*: Eave Overhang (in), Ridge Board Thickness (1.5″ for 2x), Rafter Spacing (16″ / 24″ OC).
  - *Advanced*: Rafter lumber size (2x6 / 2x8) for birdsmouth heel depth, Roofing material (Asphalt shingles / Metal standing seam).
- **3. Visual Model**: `Rafter Slope Triangle & Ridge-to-Eave Section CAD Profile`.
  - *Why*: Roof framing requires precise birdsmouth notch geometry, plumb cuts, and slope pitch triangles.
- **4. What Must Physically Change**:
  - Pitch input (e.g. 4/12 $\to$ 10/12) $\to$ Rafter angle visibly steepens in real time.
  - Building Span $\to$ Horizontal run extends, rafter length recalculates.
  - Overhang input $\to$ Eave tail extends past the exterior wall line.
- **5. Primary Answer**: **Common Rafter Line Length & Plumb/Level Cut Angles** (e.g. `14′ 5-1/8″ Rafter Length`, `26.57° Plumb Cut (6/12)`).
- **6. Decision Output**: **Rafter Stock Lumber Order + Shingle Bundle Takeoff** (e.g. `Order 16′ Rafter Stock; Order 24 Bundles of Architectural Shingles (8 Squares)`).
- **7. Takeoff**: **YES**. Rafter board pieces, ridge board length, roof surface area (sq ft / squares), shingle bundles, underlayment rolls, drip edge lineal feet.
- **8. Unit System**:
  - Pitch: `X/12 Pitch`, `Degrees (°)`, `Percentage Grade (%)`.
  - Dimensions: `ft-in`, `inches`, `meters`.
  - Output: `Squares (100 sq ft)`, `Bundles`, `Linear Feet`.
- **9. Trust / Methodology**:
  - Pythagoras theorem with ridge deduction: $\text{Rafter Run} = \frac{\text{Span} - \text{Ridge}}{2}$.
  - Shingle packaging standard: 3 bundles = 1 Square ($100\text{ sq ft}$).
  - IRC 2024 Table R802.5.1(1) rafter spans.
- **10. Mobile Flow**: `Pitch & Span Input → Dynamic Rafter Section Canvas → Cut Angles & Length HUD → Roofing Takeoff → Framing Guide`.
- **11. Search Intent**:
  - *Primary*: `roof pitch calculator`, `rafter length calculator`, `roof slope calculator`.
  - *Secondary*: `how many shingles do i need`, `birdsmouth cut calculator`.
  - *Commercial*: Roofing shingles (GAF, CertainTeed), ridge vents, metal roofing panels.
- **12. Commercial Value**: **HIGH** (High search volume from roofers and DIYers, high roofing contractor leads and material advertising RPMs).
- **13. Differentiation**: Live slope triangle morphing, birdsmouth cut layout diagrams, and automatic shingle bundle rounding with waste factors.

---

### 6. Drywall Takeoff Calculator
- **Archetype**: `C — Material Takeoff Tool`
- **1. User Job**: "How many 4x8 or 4x12 drywall sheets, joint compound buckets, rolls of tape, and boxes of screws do I need to hang drywall in a room or entire house after subtracting doors and windows?"
- **2. Primary Inputs**:
  - *Essential*: Room Length, Width, Ceiling Height (ft).
  - *Optional*: Ceiling inclusion toggle, Sheet size preference (4x8 / 4x12 / 4x14), Board thickness (1/2″ standard / 5/8″ Type X fire-rated).
  - *Advanced*: Window and door cutout dimensions, Waste factor (5% / 10% / 15%), Finish level (Level 3 / 4 / 5).
- **3. Visual Model**: `Unfolded Room Net CAD View (Walls + Ceiling Surface)`.
  - *Why*: An unfolded box net visually illustrates the wall perimeter and ceiling plane, showing where cutouts reduce surface square footage.
- **4. What Must Physically Change**:
  - Room dimensions $\to$ Net wall rectangles scale proportionally.
  - Sheet orientation toggle (Horizontal vs Vertical) $\to$ Grid pattern of 4x8/4x12 panels changes across the wall surfaces.
- **5. Primary Answer**: Total **Drywall Sheets Needed (4x8 or 4x12)**.
- **6. Decision Output**: **Complete Finishing Takeoff** (e.g. `34 Sheets (4x8) OR 23 Sheets (4x12) + 3 Buckets (4.5 gal) All-Purpose Joint Compound + 2 Rolls Paper Tape + 1 Box (5lb) 1-1/4″ Screws`).
- **7. Takeoff**: **YES**. Drywall sheets, Joint compound (gallons/buckets), Joint tape (linear feet/rolls), Drywall screws (lbs/count), Corner bead (8′/10′ sticks).
- **8. Unit System**: `sq ft`, `m²`, `ft`, `in`, `gallons`, `lbs`.
- **9. Trust / Methodology**:
  - Net Area: $(\text{Perimeter} \times \text{Height}) + \text{Ceiling Area} - \text{Openings}$.
  - Rule of thumb: $0.053\text{ gal compound/sq ft}$ for Level 4 finish; $1\text{ lb screws per 500 sq ft}$; $0.75\text{ LF tape per sq ft}$.
  - Gypsum Association GA-216 installation standard.
- **10. Mobile Flow**: `Room Dimensions → Unfolded Surface Canvas → Sheet Sizing HUD → Finishing Material Takeoff → Hanging Tips`.
- **11. Search Intent**:
  - *Primary*: `drywall calculator`, `how many sheets of drywall do i need`, `sheetrock calculator`.
  - *Secondary*: `how much joint compound do i need`, `4x8 vs 4x12 drywall calculator`.
  - *Commercial*: Drywall sheets, USG Sheetrock compound, drywall lifts, screw guns.
- **12. Commercial Value**: **MEDIUM** (Solid consistent search volume, moderate material price per job).
- **13. Differentiation**: Dual 4x8 vs 4x12 comparison HUD, full itemized tape/mud/screw takeoff, and door/window opening deductions.

---

### 7. Gravel & Bulk Aggregate Calculator
- **Archetype**: `A — Visual Estimating Instrument`
- **1. User Job**: "How many tons (or cubic yards) of crushed stone, gravel, sand, or topsoil do I need to order for my driveway, walkway, or trench, and how many dump truck deliveries will that be?"
- **2. Primary Inputs**:
  - *Essential*: Area Shape (Rectangle / Circle / Triangle), Dimensions (Length, Width / Diameter), Depth (inches).
  - *Optional*: Material type selector (Crushed Stone / Pea Gravel / Crushed Concrete / Sand / Topsoil / River Rock).
  - *Advanced*: Custom material density (lbs/cu yd or tons/cu yd), Compaction factor (10% to 20%), Delivery truck size (10-wheel tandem vs tri-axle).
- **3. Visual Model**: `Trench / Driveway Volumetric Cross-Section (Isometric 3D)`.
  - *Why*: Demonstrates the depth profile and material compaction settling visually.
- **4. What Must Physically Change**:
  - Length / Width / Diameter $\to$ Ground footprint expands.
  - Depth $\to$ Vertical cross-section thickness grows with layer strata texture.
  - Material Selector $\to$ Visual texture/color shifts (e.g. grey crushed stone vs tan pea gravel).
- **5. Primary Answer**: Total Weight in **Tons** and Volume in **Cubic Yards (`yd³`)**.
- **6. Decision Output**: **Quarry Delivery Dispatch Order** (e.g. `Order 14.5 Tons (10.5 yd³) of #57 Crushed Stone; Dispatched as 1 Tri-Axle Dump Truck`).
- **7. Takeoff**: **YES**. Tons, Cubic Yards, Cubic Feet, Dump Truck loads (single-axle 5-ton, tandem 10-ton, tri-axle 15-ton), Geotextile fabric square footage.
- **8. Unit System**: `ft`, `in`, `yd³`, `tons`, `m³`, `metric tonnes`.
- **9. Trust / Methodology**:
  - Material bulk densities: #57 Stone $\approx 2,700\text{ lbs/yd³} = 1.35\text{ tons/yd³}$; Pea Gravel $\approx 2,800\text{ lbs/yd³}$; Sand $\approx 2,700\text{ lbs/yd³}$; Topsoil $\approx 2,200\text{ lbs/yd³}$.
  - Note: Compaction settling adds 10–15% to volume requirements.
- **10. Mobile Flow**: `Dimensions & Material Selection → 3D Excavation Canvas → Quarry Tonnage HUD → Truckload Delivery Breakdown → Compaction Guide`.
- **11. Search Intent**:
  - *Primary*: `gravel calculator`, `how many tons of gravel for driveway`, `crushed stone calculator`.
  - *Secondary*: `cubic yards to tons gravel calculator`, `pea gravel calculator`.
  - *Commercial*: Landscape supply yards, quarry bulk delivery, skid steer rentals.
- **12. Commercial Value**: **HIGH** (Massive DIY and landscaping search volume with immediate material purchase intent).
- **13. Differentiation**: Material density presets with compaction factors, dump truck dispatch rounding, and geotextile fabric takeoff.

---

### 8. Residential Electrical Load Calculator (Recommended Priority Redesign #3)
- **Archetype**: `F — Load & Capacity Analysis Tool`
- **1. User Job**: "Based on my home's square footage, appliances, HVAC, EV charger, and electric range, what size main electrical service panel (100A, 150A, 200A, or 400A) is required by the National Electrical Code (NEC Article 220)?"
- **2. Primary Inputs**:
  - *Essential*: Conditioned Living Area (sq ft), Small Appliance & Laundry circuits count, Major Appliances (Electric Range, Dryer, Water Heater).
  - *Optional*: Heating vs AC method (Heat Pump, Central AC + Gas, Electric Resistance Furnace), EV Charger rating (32A / 40A / 48A / 80A), Hot Tub / Pool Pump.
  - *Advanced*: NEC calculation method (Standard Method Article 220 Part III vs Optional Method Article 220 Part IV), Future expansion reserve margin (10% to 25%).
- **3. Visual Model**: `Interactive Electrical Service Panel Load Bar / Distribution Schematic`.
  - *Why*: Electrical load is an aggregate capacity problem. A visual service bus load meter showing the contribution of each category (General Lighting, Cooking, HVAC, EV, Motor Loads) instantly reveals what is driving service upgrades.
- **4. What Must Physically Change**:
  - Adding an EV Charger or Heat Pump $\to$ Bus load gauge fills up in real-time, shifting color from Green ($<80\%$) $\to$ Amber $\to$ Red (Exceeding panel rating).
  - Square Footage change $\to$ General lighting demand block expands.
  - Heating vs AC toggle $\to$ Automatically omits smaller of heating vs cooling load per NEC 220.82(C) non-coincident load rule.
- **5. Primary Answer**: Total Calculated Load in **Amperes (A)** and **Volt-Amps (VA)**.
- **6. Decision Output**: **Required Main Service Panel Size** (e.g. `200A Main Service Panel Required (Calculated Load: 154.2A @ 240V / 37,008 VA)`).
- **7. Takeoff**: **YES**. Service panel ampacity, Minimum service entrance conductor size (Cu/Al AWG/kcmil), Grounding electrode conductor size, Panel space slot count.
- **8. Unit System**: `Volt-Amps (VA)`, `Amps (A)`, `Volts (120/240V)`, `Watts (W)`, `Kilowatts (kW)`.
- **9. Trust / Methodology**:
  - NEC 2023 / 2026 Article 220 Optional Method (Section 220.82):
    - First 10,000 VA of general load @ 100%; Remainder @ 40%.
    - HVAC / Heat Pump evaluated per 220.82(C) with cooling vs heating diversity.
    - EV Chargers treated as 100% continuous load.
- **10. Mobile Flow**: `Square Footage & Key Appliances → Live Service Panel Load Meter → Service Rating HUD → Category Breakdown → NEC 220 Methodology`.
- **11. Search Intent**:
  - *Primary*: `residential electrical load calculator`, `nec electrical load calculation`, `do i need 200 amp service`.
  - *Secondary*: `ev charger electrical load calculation`, `200 amp vs 400 amp service calculator`.
  - *Commercial*: Electricians, service upgrade permits, Square D / Eaton / Siemens panels, EVSE chargers (Tesla, ChargePoint).
- **12. Commercial Value**: **HIGH** (High-ticket electrical upgrades ($3,000–$8,000 service replacements) with high insurance and solar/EV advertiser interest).
- **13. Differentiation**: Live NEC 220 demand calculation engine with instant EV charger and heat pump impact analysis, non-coincident load filtering, and wire sizing.

---

### 9. Wire Voltage Drop Calculator (Recommended Priority Redesign #4)
- **Archetype**: `D — Engineering Sizing Tool`
- **1. User Job**: "For a given circuit voltage, current, wire length (one-way run distance), and wire gauge, what is the voltage drop percentage, and what wire size must I upsize to in order to stay under the NEC 3% branch circuit limit?"
- **2. Primary Inputs**:
  - *Essential*: Circuit Voltage (120V / 240V / 208V / 277V / 480V), Load Current (Amperes), One-Way Distance (Feet / Meters), Phase (Single-Phase / 3-Phase).
  - *Optional*: Conductor Material (Copper / Aluminum), Wire Size (14 AWG to 1000 kcmil), Target Max Drop (3% branch / 5% total feeder).
  - *Advanced*: Conductor Conduit Type (PVC / Steel / Aluminum), Power Factor ($\cos \phi$, default 0.95–1.0), Temperature rating (75°C / 90°C).
- **3. Visual Model**: `Single-Line Circuit Loop Vector Schematic`.
  - *Why*: Electrical voltage drop is a circuit loop degradation. Visualizing the source $\to$ conductor resistance drop $\to$ load end voltage reveals why long wire runs cause equipment malfunction or LED flickering.
- **4. What Must Physically Change**:
  - Distance or Current increase $\to$ End-of-line voltage gauge drops, and wire heat-loss gradient deepens from Green ($<3\%$) $\to$ Red ($>3\%$).
  - Selecting larger wire gauge $\to$ Conductor diameter expands and voltage drop percentage immediately drops below threshold.
- **5. Primary Answer**: **Voltage Drop Percentage (`%`) and Voltage at Load (`V`)**.
- **6. Decision Output**: **Recommended Wire Gauge Upsize** (e.g. `Upsize from #10 AWG to #6 AWG Copper for 175ft Run on 24A Load to maintain 2.3% Drop (117.2V at Load)`).
- **7. Takeoff**: **YES**. Minimum AWG/kcmil conductor size, Conduit size adjustment for larger wire, Total wire length needed (hot + neutral + ground), Power loss in Watts ($I^2R$).
- **8. Unit System**: `Volts (V)`, `Amps (A)`, `Feet (ft)`, `Meters (m)`, `AWG`, `kcmil`, `Ohms (\Omega)`.
- **9. Trust / Methodology**:
  - Single-Phase Formula: $V_d = \frac{2 \times K \times I \times L}{CM}$ or Chapter 9 Table 9 effective impedance.
  - 3-Phase Formula: $V_d = \frac{1.732 \times K \times I \times L}{CM}$.
  - Copper resistivity constant $K \approx 12.9\ \Omega\cdot\text{cmil/ft}$ @ 75°C; Aluminum $K \approx 21.2$.
  - NEC Informational Note 210.19(A) & 215.2(A)(1): Max 3% branch circuit drop; Max 5% total feeder + branch drop.
- **10. Mobile Flow**: `Voltage, Current & Distance → Circuit Drop Schematic → Upsize Decision HUD → Conductor Comparison Table → NEC Guidelines`.
- **11. Search Intent**:
  - *Primary*: `voltage drop calculator`, `wire size for distance calculator`, `how to calculate voltage drop`.
  - *Secondary*: `100 amp subpanel 150 feet away wire size`, `3 phase voltage drop calculator`.
  - *Commercial*: Electrical supply distributors, Southwire copper/aluminum wire, subpanels, EV installation contractors.
- **12. Commercial Value**: **HIGH** (Essential daily calculation for electricians, solar installers, subpanel builders, and off-grid engineers).
- **13. Differentiation**: Live interactive distance slider showing exact load voltage and auto-suggested conductor upsize table with $I^2R$ power loss.

---

### 10. Electrical Conduit Fill Calculator
- **Archetype**: `E — Code / Table Lookup + Sizing Tool`
- **1. User Job**: "Can my combination of THHN/XHHW wires fit into a specific conduit size, or what is the minimum trade size raceway (EMT, PVC, RMC, FMC) required by NEC Chapter 9 Tables 1, 4 & 5?"
- **2. Primary Inputs**:
  - *Essential*: Raceway Material (EMT / PVC Sch 40 / PVC Sch 80 / RMC / FMC / LFMC), Conductor Schedule (Wire Gauges + Quantities + Insulation Types).
  - *Optional*: Short Nipple ($\le 24''$) exemption toggle (60% fill limit).
  - *Advanced*: Jam ratio risk check ($1.05 \le D/d \le 1.16$ for 3 conductors).
- **3. Visual Model**: `Conduit Cross-Section Circular Packing Blueprint`.
  - *Why*: Wires are round conductors packed inside a round raceway. Visual packing provides immediate human verification of physical fit and safety margin.
- **4. What Must Physically Change**:
  - Adding/Changing Wires $\to$ Conductor circles dynamically pack into the conduit boundary with individual gauge callout labels.
  - Exceeding 40% fill limit $\to$ Boundary changes to Red warning glow with NEC violation tag.
  - Raceway selection $\to$ Internal diameter circle rescales based on wall thickness (e.g. PVC Sch 80 has thicker walls than EMT).
- **5. Primary Answer**: **Recommended Conduit Trade Size** (e.g. `1″ EMT`).
- **6. Decision Output**: **Conduit Specification Decision** (e.g. `Use 1″ EMT (Fill: 29.4% / NEC Max 40% Allowable) — 3/4″ EMT is Overfilled at 51.2%`).
- **7. Takeoff**: **NO**. (Pure raceway sizing decision).
- **8. Unit System**: `Trade Sizes (1/2″, 3/4″, 1″, 1-1/4″, etc.)`, `sq in`, `mm²`, `AWG`, `kcmil`.
- **9. Trust / Methodology**:
  - NEC Chapter 9 Table 1 limits: 1 Conductor = 53% max; 2 Conductors = 31% max; 3+ Conductors = 40% max; Nipples $\le 24'' = 60\%$ max.
  - Conductor dimensions pulled strictly from NEC Chapter 9 Table 5 (THHN, XHHW-2, RHW) and Table 4 conduit areas.
- **10. Mobile Flow**: `Raceway Selector → Conductor Table → Cross-Section Packing Blueprint → Sizing Decision HUD → Candidate Comparison Table`.
- **11. Search Intent**:
  - *Primary*: `conduit fill calculator`, `how many wires in 3/4 conduit`, `nec conduit fill table`.
  - *Secondary*: `pvc conduit fill calculator`, `conduit jam ratio calculator`.
  - *Commercial*: Conduit bending tools, EMT tubing, wire pullers, commercial electrical contractors.
- **12. Commercial Value**: **HIGH** (High repeat usage among electricians, apprentices, and commercial engineers).
- **13. Differentiation**: Real-time circular wire packing visualization with jam ratio risk warnings and full NEC Table 4 candidate comparisons.

---

### 11. Electrical Box Fill Calculator
- **Archetype**: `E — Code / Table Lookup + Sizing Tool`
- **1. User Job**: "How many cubic inches are required for all the conductors, receptacles, switches, clamps, and grounds in my junction box, and what standard electrical box size meets NEC Article 314.16?"
- **2. Primary Inputs**:
  - *Essential*: Largest conductor gauge (14 AWG / 12 AWG / 10 AWG / 8 AWG / 6 AWG), Number of Conductors originating outside box.
  - *Optional*: Internal cable clamps (1 allowance), Receptacles / Switches / Devices (2 allowances each based on largest connected wire), Equipment grounding conductors count (1 allowance for 1–4 grounds; 0.25 allowance for each ground over 4 per 2020/2023 NEC), Fixture studs / hickeys.
  - *Advanced*: Gang box choice (1-gang, 2-gang, 4″ square with mud ring).
- **3. Visual Model**: `Junction Box Volume Fill Level Profile (2D Elevation CAD)`.
  - *Why*: Box fill is a volumetric allowance problem. A visual box gauge showing volume utilization percentage prevents overcrowded, fire-hazard junction boxes.
- **4. What Must Physically Change**:
  - Adding devices or conductors $\to$ Volume fill level bar fills up inside the box outline.
  - Changing wire gauge $\to$ Allowance unit volumes adjust ($14\text{ AWG} = 2.00\text{ cu in}$; $12\text{ AWG} = 2.25\text{ cu in}$; $10\text{ AWG} = 2.50\text{ cu in}$).
- **5. Primary Answer**: Total **Required Box Volume (Cubic Inches, `cu in`)**.
- **6. Decision Output**: **Recommended Standard Box Enclosure** (e.g. `Minimum 22.5 cu in Box Required: Use 4″ Square × 2-1/8″ Deep Box (30.3 cu in) or 1-Gang Extra-Deep Box`).
- **7. Takeoff**: **NO**. (Pure box sizing selection).
- **8. Unit System**: `cu in`, `cm³`, `AWG`.
- **9. Trust / Methodology**:
  - Governed by NEC 2023 Article 314.16(B)(1) through (B)(5) volume allowance tables.
  - Conductor volume allowances: 18 AWG (1.50), 16 AWG (1.75), 14 AWG (2.00), 12 AWG (2.25), 10 AWG (2.50), 8 AWG (3.00), 6 AWG (5.00 cu in).
- **10. Mobile Flow**: `Conductor & Device Counter → Box Fill Level Profile → Volume HUD → Standard Box Sizing Table → NEC 314 Rules`.
- **11. Search Intent**:
  - *Primary*: `box fill calculator`, `nec box fill calculation`, `electrical box volume calculator`.
  - *Secondary*: `how many 12 gauge wires in a 4x4 box`, `junction box sizing`.
  - *Commercial*: Electrical junction boxes (RACO, Carlon), mud rings, outlets, smart switches.
- **12. Commercial Value**: **MEDIUM** (High electrical trade intent, slightly smaller search volume than conduit fill).
- **13. Differentiation**: Explicit visual itemized allowance breakdown per NEC 314.16(B) with mud ring extension volume additions.

---

### 12. HVAC BTU & Cooling Tonnage Calculator
- **Archetype**: `D — Engineering Sizing Tool`
- **1. User Job**: "How many BTU/hr of cooling and heating capacity, and how many nominal tons of air conditioning (e.g. 2.5 Tons, 3.0 Tons), are needed to condition a house or room based on square footage, climate zone, ceiling height, and insulation?"
- **2. Primary Inputs**:
  - *Essential*: Conditioned Floor Area (sq ft), Ceiling Height (ft), US Climate Zone (Zones 1–7).
  - *Optional*: Insulation Level (Poor / Average / Good), Sun Exposure (Low / Moderate / High), Number of Occupants, Kitchen inclusion.
  - *Advanced*: Ductwork Location (Inside Conditioned Space / Insulated Attic / Uninsulated Attic / Crawlspace), Window count / orientation.
- **3. Visual Model**: `Building Thermal Envelope CAD Blueprint (Solar flux, attic boundary, CFM streams)`.
  - *Why*: Heat gain is a multi-path thermal envelope model. Visualizing solar radiation, attic thermal barriers, and airflow streams explains why insulation and climate zones alter sizing.
- **4. What Must Physically Change**:
  - Floor Area $\to$ Conditioned space box width expands in real time.
  - Solar Exposure $\to$ Sun ray vectors brighten / multiply.
  - Output cooling load $\to$ Tonnage badge and supply CFM airflow arrows update instantly.
- **5. Primary Answer**: **Recommended Air Conditioner Capacity (Tons AC)** + **Cooling Load (BTU/h)**.
- **6. Decision Output**: **Equipment Sizing & Airflow Decision** (e.g. `Install 2.5 Ton AC / Heat Pump (Cooling: 28,400 BTU/h, Heating: 32,100 BTU/h, Airflow: 1,000 CFM)`).
- **7. Takeoff**: **YES** (Preliminary equipment sizing, airflow CFM, ductwork trunk diameter).
- **8. Unit System**: `BTU/h`, `Tons AC`, `sq ft`, `m²`, `CFM`, `kW`.
- **9. Trust / Methodology**:
  - Uses ASHRAE / ACCA Manual J simplified block load methodology.
  - Explicit disclaimer: Block load calculator is for preliminary equipment estimation and does not replace ACCA Manual J room-by-room load calculations required for building permits.
- **10. Mobile Flow**: `Floor Area & Climate Zone → Thermal Envelope Canvas → Equipment Tonnage HUD → Thermal Load Telemetry → Manual J Sizing Notes`.
- **11. Search Intent**:
  - *Primary*: `hvac btu calculator`, `how many tons of ac do i need`, `air conditioner sizing calculator`.
  - *Secondary*: `mini split sizing calculator`, `heat pump btu calculator`.
  - *Commercial*: Heat pump and AC units (Carrier, Trane, Mitsubishi), HVAC contractors, ductless mini-splits.
- **12. Commercial Value**: **HIGH** (Extremely high advertiser CPC for HVAC replacement leads ($15–$45 CPC)).
- **13. Differentiation**: Live building envelope thermal canvas with climate zone design temperatures, ductwork loss adjustments, and ACCA Manual J educational guide.

---

### 13. HVAC Duct Sizing Calculator
- **Archetype**: `D — Engineering Sizing Tool`
- **1. User Job**: "Given an airflow rate in CFM and a design friction rate (e.g. 0.10 in. wg per 100 ft), what round duct diameter or equivalent rectangular duct size (Width × Depth) should I use to prevent noisy air velocity and maintain static pressure?"
- **2. Primary Inputs**:
  - *Essential*: Airflow Volume (CFM), Design Friction Rate (default 0.10 or 0.08 in. wg / 100 ft) OR Max Design Velocity (FPM).
  - *Optional*: Duct Shape Preference (Round vs Rectangular), Aspect Ratio preference for rectangular duct.
  - *Advanced*: Duct Material / Roughness (Sheet Metal, Flexible Duct, Duct Board), Maximum duct height constraint.
- **3. Visual Model**: `Duct Cross-Section & Velocity Profile (2D CAD)`.
  - *Why*: Duct sizing balances cross-sectional area against air velocity noise thresholds ($<700\text{ FPM}$ residential branches, $<900\text{ FPM}$ main trunks).
- **4. What Must Physically Change**:
  - CFM input $\to$ Duct circle/rectangle cross-section scales up/down.
  - Velocity threshold $\to$ Airflow streamline vectors speed up and shift color (Green $<700\text{ FPM}$, Amber $700\text{–}1000\text{ FPM}$, Red $>1000\text{ FPM}$ noise risk).
- **5. Primary Answer**: **Recommended Round Duct Diameter (inches)** and **Equivalent Rectangular Dimensions (W × D)**.
- **6. Decision Output**: **Duct Fabrication Decision** (e.g. `Use 10″ Round Spiral Duct (Air Velocity: 733 FPM) OR 14″ × 6″ Rectangular Trunk Duct`).
- **7. Takeoff**: **NO**. (Pure duct sizing instrument).
- **8. Unit System**: `CFM (ft³/min)`, `Inches of Water Gauge (in. wg / 100 ft)`, `Feet Per Minute (FPM)`, `Inches (in)`.
- **9. Trust / Methodology**:
  - Uses ACCA Manual D & ASHRAE equal friction method:
    - Round duct diameter formula: $D = 0.545 \times \left(\frac{\text{CFM}}{F}\right)^{0.36}$.
    - Huebscher equivalent rectangular duct equation: $D_e = \frac{1.30 \times (a \cdot b)^{0.625}}{(a + b)^{0.25}}$.
- **10. Mobile Flow**: `CFM & Friction Input → Duct Velocity Profile Canvas → Sizing HUD → Rectangular Equivalent Grid → Manual D Velocity Rules`.
- **11. Search Intent**:
  - *Primary*: `duct sizing calculator`, `cfm to duct size calculator`, `hvac duct size calculator`.
  - *Secondary*: `manual d duct sizing`, `round to rectangular duct conversion`.
  - *Commercial*: Sheet metal fabrication, flexible ducting, register diffusers, inline booster fans.
- **12. Commercial Value**: **MEDIUM** (High HVAC trade niche, strong organic intent from technicians).
- **13. Differentiation**: Live friction rate vs velocity noise check with instant round-to-rectangular equivalent cross-reference table.

---

### 14. Plumbing Drainage Fixture Unit (DFU) Calculator
- **Archetype**: `E — Code / Table Lookup + Sizing Tool`
- **1. User Job**: "What is the total Drainage Fixture Unit (DFU) load of my bathroom/kitchen fixture schedule, and what is the minimum code-required pipe diameter for my horizontal branch drains, vertical soil stack, and main building drain?"
- **2. Primary Inputs**:
  - *Essential*: Fixture Schedule (Toilets, Sinks, Showers, Tubs, Kitchen Sinks, Washers), Horizontal Drain Slope (1/8″, 1/4″, 1/2″ per foot fall).
  - *Optional*: Drainage System Type (Building Drain / Horizontal Branch / Vertical Soil Stack), Continuous flow sump pumps (GPM).
  - *Advanced*: Governing Code Standard (IPC 2024 Chapter 7 vs UPC 2024 Chapter 7), Bathroom group discount rule.
- **3. Visual Model**: `Sanitary Soil Stack & Drainage Slope Blueprint (2D CAD Schematic)`.
  - *Why*: Plumbing drainage relies on gravity flow fall gradients ($1/4''\text{ per ft}$). Visualizing fixture branches discharging into a vertical stack and building drain clarifies hydraulic capacity.
- **4. What Must Physically Change**:
  - Slope Selector ($1/8'' \to 1/4'' \to 1/2''$) $\to$ Drain line fall angle visibly tilts in the CAD blueprint.
  - Adding Fixtures $\to$ Fixture branch drops attach to the soil stack, increasing total DFU load counter.
  - Pipe Size Threshold $\to$ Main drain pipe thickness widens (e.g. $2'' \to 3'' \to 4''$).
- **5. Primary Answer**: **Recommended Building Drain Pipe Size (Inches)**.
- **6. Decision Output**: **Pipe Sizing & Fall Schedule Decision** (e.g. `Install 3″ PVC/ABS Main Building Drain @ 1/4″/ft Slope (Total Load: 18.0 DFU / Max Capacity: 42.0 DFU) with 2″ Roof Vent Stack`).
- **7. Takeoff**: **NO**. (Prescriptive pipe sizing decision).
- **8. Unit System**: `Drainage Fixture Units (DFU)`, `Pipe Size (inches: 1-1/2″, 2″, 3″, 4″)`, `Slope (inches/ft)`, `GPM`.
- **9. Trust / Methodology**:
  - IPC 2024 Table 709.1 / 710.1(1) / 710.1(2) & UPC 2024 Table 702.1 / 703.2.
  - Water closet rule: Minimum 3″ drain required for any line serving a water closet; max 2 water closets on a 3″ horizontal branch under IPC.
- **10. Mobile Flow**: `Fixture Schedule & Slope → Sanitary Drainage Canvas → Sizing HUD → Fixture DFU Breakdown → IPC/UPC Sizing Tables`.
- **11. Search Intent**:
  - *Primary*: `plumbing dfu calculator`, `drainage fixture unit calculator`, `how to size drain pipe plumbing`.
  - *Secondary*: `ipc table 710.1 pipe size`, `toilet dfu value`.
  - *Commercial*: PVC/ABS DWV pipes, cleanouts, plumbing contractors, sanitary fittings.
- **12. Commercial Value**: **HIGH** (Key tool for plumbers, general contractors, and home remodelers).
- **13. Differentiation**: Live sanitary stack blueprint with slope tilt, IPC vs UPC code toggle, and water closet restriction enforcement.

---

### 15. Plumbing Water Supply Fixture Unit (WSFU) Calculator
- **Archetype**: `E — Code / Table Lookup + Sizing Tool`
- **1. User Job**: "Based on my residential or commercial fixture count, what is the total Water Supply Fixture Unit (WSFU) demand load in GPM, and what size water meter and main water supply line (3/4″, 1″, 1-1/4″) is required to ensure adequate water pressure?"
- **2. Primary Inputs**:
  - *Essential*: Water supply fixture schedule (Toilets, Sinks, Showers, Hose Bibbs, Dishwasher), System supply type (Flush Tank vs Flushometer Valve).
  - *Optional*: Available street water main pressure (PSI), Developed length of pipe from meter to farthest fixture (ft), Highest fixture elevation above meter (ft).
  - *Advanced*: Pipe material (Copper Type L / PEX / CPVC), Governing code (IPC Appendix E vs UPC Chapter 6 Table 610.4).
- **3. Visual Model**: `Potable Water Service Distribution Schematic (Pressure gradient)`.
  - *Why*: Potable water supply sizing is a pressure-loss and demand diversity calculation (Hunter's Curve). Showing the pressure loss from meter $\to$ elevation $\to$ friction clarifies pipe sizing.
- **4. What Must Physically Change**:
  - Fixture count $\to$ Demand flow vector scales along Hunter's Curve in real time.
  - Pipe length $\to$ Friction head-loss meter increases.
  - Supply Pipe Size $\to$ Pressure drop indicator stabilizes in the safe green zone ($<8\text{ PSI}$ friction loss).
- **5. Primary Answer**: **Recommended Main Water Service Line Size** + **Peak Design Demand (GPM)**.
- **6. Decision Output**: **Water Service Line & Meter Specification** (e.g. `Install 1″ Type L Copper or 1-1/4″ PEX Service Line on 3/4″ Water Meter (Design Flow: 16.5 GPM @ 28 WSFU)`).
- **7. Takeoff**: **NO**. (Service and branch pipe sizing).
- **8. Unit System**: `Water Supply Fixture Units (WSFU)`, `Gallons Per Minute (GPM)`, `PSI`, `Pipe Inches (3/4″, 1″, 1-1/4″, 1-1/2″)`.
- **9. Trust / Methodology**:
  - Hunter's Curve demand conversion (IPC Table E103.3(3) / UPC Table 610.3).
  - Friction loss calculations based on Hazen-Williams formula ($C=150$ for PEX/Copper).
- **10. Mobile Flow**: `Fixture Schedule & Water Pressure → Water Service Schematic → Pipe Sizing HUD → Friction Loss Breakdown → Hunter's Curve Chart`.
- **11. Search Intent**:
  - *Primary*: `wsfu calculator`, `water supply fixture unit calculator`, `water service line sizing calculator`.
  - *Secondary*: `hunters curve gpm calculator`, `pex water main line size`.
  - *Commercial*: PEX-A tubing, water meters, pressure reducing valves, water filtration systems.
- **12. Commercial Value**: **HIGH** (High commercial plumbing interest and residential re-piping contractor value).
- **13. Differentiation**: Live Hunter's Curve conversion, Hazen-Williams friction loss calculation, and PEX vs Copper diameter compensation.

---

## 5. Strategic Redesign Priority: The Next 4 Flagships

Based on the multi-factor evaluation of:
$$\text{User Value} + \text{Search Demand} + \text{Commercial AdSense Intent} + \text{Visual Differentiation} + \text{Engineering Trust}$$

The next 4 calculation instruments to receive the 2-Pane Split CAD / Live-Synchronized redesign are:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       NEXT REDESIGN BATCH (TOP 4)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. DECK CALCULATOR (Construction / Archetype C)                             │
│    • Massive seasonal search volume ($500/mo revenue driver).               │
│    • Multi-layer framing plan (Footings -> Posts -> Beams -> Joists).       │
│    • High-ticket lumber & composite material takeoff.                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. ROOF PITCH & RAFTER CALCULATOR (Construction / Archetype B)              │
│    • Core daily carpentry utility with live rafter slope triangle.          │
│    • Birdsmouth cut geometry + shingle bundle takeoff.                      │
│    • Extremely high roofing contractor advertising value.                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. RESIDENTIAL ELECTRICAL LOAD CALCULATOR (Electrical / Archetype F)        │
│    • Modern electrification driver (EV chargers, heat pumps, solar).        │
│    • Interactive service bus load meter preventing undersized panels.       │
│    • High commercial CPC from electrical equipment manufacturers.           │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. VOLTAGE DROP CALCULATOR (Electrical / Archetype D)                       │
│    • Essential technical tool for electricians and off-grid builders.       │
│    • Single-line circuit loop schematic with live conductor upsize table.   │
│    • High-frequency professional search queries.                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Architecture Review Verification & Next Steps

This document provides the exhaustive blueprint for all 15 calculation instruments without modifying production code. 

**Status**: Strategy & UX Architecture phase complete. Ready for CEO / Lead UX review.
