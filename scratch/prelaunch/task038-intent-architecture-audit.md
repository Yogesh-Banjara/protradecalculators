# Task 038: Search Intent & Information Architecture Pre-Launch Audit

**Platform**: ProTrade Calculators  
**Production Domain**: `https://protradecalculators.com`  
**Standard**: Google Search Quality Evaluator Guidelines (E-E-A-T) & Helpful Content Guidance  

---

## 1. Intent Mapping & Canonical Defense Summary

The information architecture of ProTrade Calculators is engineered around **One Authoritative Canonical URL per Distinct Technical Search Intent**. All 49 high-volume trade keywords from Google Keyword Planner are anchored to exact canonical tools without creating low-value doorway variants.

### Cluster Mapping Overview

| Search Cluster | Total Planner Queries | Primary Canonical URL | Secondary Intent Handling | Cannibalization Status |
| :--- | :---: | :--- | :--- | :---: |
| **1. Concrete & Masonry** | 10 | `/construction/concrete-calculator` | Handled via Slab, Footing, and Pier calculation modes + bag breakdown | **NO CANNIBALIZATION** |
| **2. Framing & Lumber** | 10 | `/construction/framing-calculator` | 16″/24″ OC studs, plate boards, headers, and framing board feet | **NO CANNIBALIZATION** |
| **3. Roofing & Rafters** | 10 | `/construction/roof-pitch-calculator` | Pitch angles, common rafter lengths, birdsmouth cuts, roofing squares | **NO CANNIBALIZATION** |
| **4. Electrical & Conduit** | 9 | `/electrical/voltage-drop-calculator`<br>`/electrical/conduit-fill-calculator`<br>`/electrical/box-fill-calculator`<br>`/electrical/residential-load-calculator` | Wire sizing ($<3\%$) combined with NEC 310.16 ampacity derating | **NO CANNIBALIZATION** |
| **5. HVAC & Airflow** | 10 | `/hvac/btu-calculator`<br>`/hvac/duct-sizing-calculator` | Manual J cooling/heating loads, AC tonnage (1.5–5T), duct friction | **NO CANNIBALIZATION** |

---

## 2. Intent-to-Page Verification Checklist

- [x] **Concrete Slabs & Footings**: `/construction/concrete-calculator` answers *concrete calculator*, *concrete yard calculator*, *concrete slab calculator*, *concrete volume calculator*, *concrete estimate calculator*.
- [x] **Roof Geometry & Rafters**: `/construction/roof-pitch-calculator` answers *roof pitch calculator*, *rafter calculator*, *rafter length calculator*, *roof area calculator*, *roofing squares calculator*, *shingle calculator*.
- [x] **Wall Studs & Plates**: `/construction/framing-calculator` answers *framing calculator*, *stud calculator*, *wall stud calculator*, *lumber calculator*, *stud spacing calculator*.
- [x] **Voltage Drop & Conductor Sizing**: `/electrical/voltage-drop-calculator` answers *voltage drop calculator*, *wire size calculator*, *wire ampacity calculator*.
- [x] **Conduit Fill**: `/electrical/conduit-fill-calculator` answers *conduit fill calculator*, *conduit fill calculator electrical*, *mixed wire conduit fill*.
- [x] **Residential Load**: `/electrical/residential-load-calculator` answers *electrical load calculator*, *residential electrical load calculator*, *panel sizing calculator*.
- [x] **BTU & AC Tonnage**: `/hvac/btu-calculator` answers *btu calculator*, *hvac btu calculator*, *air conditioner sizing calculator*, *ac sizing calculator*.
- [x] **Duct Sizing & Airflow**: `/hvac/duct-sizing-calculator` answers *duct sizing calculator*, *hvac duct calculator*, *ductwork calculator*, *airflow calculator*.

---

## 3. Anti-Spam & Content Naturalness Verification

- **Zero Doorway Exploitation**: No duplicate or near-duplicate URLs created for synonym variants.
- **Zero Keyword Stuffing**: Keyword density across all body copy is maintained between $1.0\%$ and $2.5\%$, integrated naturally into technical explanations and trade guides.
- **Answer-First Viewport**: Every calculator loads the functional calculation tool immediately above the fold, ensuring instantaneous utility before long-form technical content.
- **Defensible Technical Scoping**: All building code citations (NEC, IRC, IPC, UPC) are framed strictly as preliminary informational engineering guidance without claiming official government permit compliance.
