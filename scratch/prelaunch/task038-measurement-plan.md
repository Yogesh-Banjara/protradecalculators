# Task 038: Pre-Launch Measurement & Product Analytics Plan

**Platform**: ProTrade Calculators  
**Production Domain**: `https://protradecalculators.com`  
**Standard**: Privacy-First, Zero-Cookie, Deterministic Event Dispatching  

---

## 1. Analytics Architecture Principles

- **Zero Invasive Third-Party Tracking**: No unconsented tracking cookies, no cross-site surveillance pixels, no render-blocking analytics scripts.
- **Client Event Abstraction**: Event dispatching is handled through the lightweight abstraction layer in `src/lib/analytics/events.ts`.
- **Task-Completion Focus**: Measurement focuses on whether users successfully complete trade calculations, adjust units, and export worksheets.

---

## 2. Standardized Measurement Event Taxonomy

| Event Name | Trigger Condition | Event Payload Parameters | Purpose |
| :--- | :--- | :--- | :--- |
| `calculator_started` | User interacts with first input field | `tool_slug`, `category_slug` | Measures engagement entry rate |
| `calculation_completed` | Valid result generated and rendered | `tool_slug`, `category_slug`, `primary_output_unit` | Measures task success rate |
| `unit_changed` | User toggles imperial/metric or wire units | `tool_slug`, `from_unit`, `to_unit` | Measures multi-unit demand |
| `copy_result_clicked` | User clicks copy button on result HUD | `tool_slug`, `field_name` | Measures result utility & clipboard sharing |
| `print_worksheet_clicked` | User triggers jobsite print worksheet | `tool_slug`, `category_slug` | Measures jobsite takeaway usage |
| `preset_selected` | User clicks a quick circuit/fixture preset | `tool_slug`, `preset_name` | Measures preset adoption |
| `validation_error` | User enters out-of-bounds or invalid input | `tool_slug`, `field_name`, `error_type` | Identifies UX friction points |

---

## 3. Post-Launch Google Search Console Tracking Framework

- **Indexation Health**: Monitor 100% indexation of all 33 canonical URLs in Google Search Console.
- **Query Capture**: Track top-performing query impressions across the 5 trade clusters without making speculative ranking guarantees.
- **Core Web Vitals Monitoring**: Monitor real-world Chrome User Experience Report (CrUX) metrics against pre-launch lab targets:
  - $\text{LCP} \le 2.5\text{s}$
  - $\text{INP} \le 200\text{ms}$
  - $\text{CLS} \le 0.10$
