# Task 034G: Semantic Internal Link Quality Review

**Document Version**: 1.0  
**Audit Scope**: Rigorous semantic validation of cross-calculator recommendations against real-world jobsite workflows.

---

## 1. Explicit Review of Flagged Relationships

| Candidate Link Pair | Initial Status | Real Jobsite Decision Context | Final Decision | Rationale |
| :--- | :---: | :--- | :---: | :--- |
| **Drywall $\to$ Gravel** | FLAG | Hanging sheetrock on interior studs has zero correlation with bulk aggregate or driveway stone delivery. | **REMOVED** | Replaced with `/construction/framing-calculator` (checking stud layout and room dimensions). |
| **Roof Pitch $\to$ Stairs** | FLAG | Cutting rafters and ordering roofing shingles has no structural or sequential connection to stair stringer layout. | **REMOVED** | Replaced with `/construction/framing-calculator` (top plate load connections and building span). |
| **Box Fill $\to$ Res. Load** | FLAG | Sizing device junction boxes is a local branch circuit rough-in task, not a whole-home service entrance load calculation. | **REMOVED** | Replaced with `/electrical/conduit-fill-calculator` and `/electrical/voltage-drop-calculator`. |
| **Concrete $\to$ Deck** | REVIEW | Deck posts require poured sonotube concrete pier footings sized to regional frost depths. | **KEPT** | Directly relevant: Estimator needs pier concrete yardage and bag counts for the deck framing layout. |
| **Gravel $\to$ Deck** | FLAG | Gravel ordering is primarily for driveway base, slab cushion, and utility trenching rather than deck lumber takeoff. | **REMOVED** | Concentrated on `/construction/concrete-calculator` (slab and driveway base bedding). |

---

## 2. Refined 15-Tool Contextual Link Matrix

Every calculator now features 1 to 3 tightly coupled, high-intent next-step tools answering: *"If a user just finished this calculation, is this actually the next useful tool?"*

| Calculator Route | Discipline | Refined Related Tools | Jobsite Workflow Rationale |
| :--- | :--- | :--- | :--- |
| `/construction/concrete-calculator` | Construction | 1. `/materials/gravel-calculator`<br>2. `/construction/deck-calculator` | • Size gravel sub-base cushion before pouring slab.<br>• Estimate concrete sonotube footings for deck posts. |
| `/materials/gravel-calculator` | Materials | 1. `/construction/concrete-calculator` | • Calculate concrete volume for slab poured over compacted base. |
| `/construction/framing-calculator` | Construction | 1. `/materials/drywall-calculator`<br>2. `/construction/roof-pitch-calculator` | • Estimate sheet goods needed to cover framed wall studs.<br>• Calculate roof rafter spans bearing on framed wall plates. |
| `/materials/drywall-calculator` | Materials | 1. `/construction/framing-calculator` | • Verify 16″/24″ OC stud spacing and room wall dimensions. |
| `/construction/roof-pitch-calculator` | Construction | 1. `/construction/framing-calculator` | • Size bearing wall framing supporting the rafter spans. |
| `/construction/stair-calculator` | Construction | 1. `/construction/deck-calculator`<br>2. `/construction/framing-calculator` | • Plan exterior stair stringer attachment to deck rim joist.<br>• Frame interior stairwell rough openings and headers. |
| `/construction/deck-calculator` | Construction | 1. `/construction/concrete-calculator`<br>2. `/construction/stair-calculator`<br>3. `/construction/framing-calculator` | • Calculate sonotube pier concrete volume for deck posts.<br>• Cut stringers for deck stairs and landing steps.<br>• Fasten ledger board to house wall framing. |
| `/electrical/voltage-drop-calculator` | Electrical | 1. `/electrical/conduit-fill-calculator`<br>2. `/electrical/residential-load-calculator` | • Check raceway trade size for upsized conductors.<br>• Verify service panel capacity before adding heavy subpanel runs. |
| `/electrical/conduit-fill-calculator` | Electrical | 1. `/electrical/voltage-drop-calculator`<br>2. `/electrical/box-fill-calculator` | • Check conductor gauge for distance voltage drop.<br>• Size junction boxes where conduit raceways terminate. |
| `/electrical/box-fill-calculator` | Electrical | 1. `/electrical/conduit-fill-calculator`<br>2. `/electrical/voltage-drop-calculator` | • Verify conduit sizing entering the enclosure.<br>• Size branch circuit conductors for run length. |
| `/electrical/residential-load-calculator` | Electrical | 1. `/electrical/voltage-drop-calculator`<br>2. `/electrical/conduit-fill-calculator` | • Size service entrance feeder wire from utility meter.<br>• Size service mast conduit raceway. |
| `/hvac/btu-calculator` | HVAC | 1. `/hvac/duct-sizing-calculator` | • Size supply and return ductwork for calculated heating/cooling CFM. |
| `/hvac/duct-sizing-calculator` | HVAC | 1. `/hvac/btu-calculator` | • Calculate required room CFM based on heating/cooling thermal loads. |
| `/plumbing/dfu-calculator` | Plumbing | 1. `/plumbing/wsfu-calculator` | • Size potable water supply lines corresponding to drainage fixture load. |
| `/plumbing/wsfu-calculator` | Plumbing | 1. `/plumbing/dfu-calculator` | • Size sanitary drainage branches corresponding to fixture water supply. |
