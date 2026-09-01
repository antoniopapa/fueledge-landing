# FuelEdge

## 1. Project Description
FuelEdge is a B2B SaaS platform for European fuel distributors. It helps distributors increase margins on every load by finding the best fuel source based on terminal prices and delivery costs, then managing the delivery from one platform. Target users are fuel distribution operators, dispatch teams, and logistics managers across Europe. The brand should feel like modern logistics, fintech, and supply-chain infrastructure software — reliable, operational, and profitability-focused.

## 2. Page Structure
- `/` - Home (marketing homepage)
- `/driver` - Driver App (login)
  - `/driver/home` - Home (current load, today's loads, upcoming loads)
  - `/driver/map` - Route map (current route, stops, next destination, navigation)
  - `/driver/loads/:id` - Load detail (pickups + delivery workflow)
  - `/driver/schedule` - Assigned shifts (upcoming schedule)
  - `/driver/profile` - Driver info, settings (notifications, language, security, history, support)

## 3. Core Features
- [x] Hero with product screenshot placeholder
- [x] Problem section (delivered cost insight)
- [x] Platform overview (end-to-end scope)
- [x] How-it-works workflow (order → proof of delivery)
- [x] Capabilities list
- [x] Operations control center (screenshot placeholder)
- [x] Outcomes / ROI stats
- [x] Distribution (European focus + integrations)
- [x] Final CTA
- [x] Demo request form

## 4. Data Model Design
No database required for the marketing homepage. (Future phases may add: orders, terminals, loads, deliveries, fleet.)

### Driver / Dispatch Load Model (mock-only, no backend yet)
A **load is an ordered sequence of stops** — not "pickups then deliveries". Each stop is a `Pickup` or `Delivery`, and the dispatcher controls the order. The driver always executes stops in dispatcher-defined order (the current stop is simply the first eligible incomplete stop).

- Load: `Scheduled → In Progress → Completed` (Cancelled is dispatcher-controlled terminal).
- Stop: `Upcoming → En Route → Arrived → Completed` (Next is derived, not persisted). Both kinds open a completion form while the stop stays `Arrived`: Pickup uses a `loadCompletedAt` marker, Delivery uses a `deliveryCompletedAt` marker.
- Issue: `Reported → Acknowledged → Resolved`.

**Truck onboard inventory** (mock): a truck can begin a load with compatible product already onboard, so a load does not require a leading terminal pickup. Tracked per truck as `{ truckId, fuelType, quantityL }`, with an optional `compartments[]` slot reserved for a future compartment model. Completing a pickup increases onboard inventory; completing a delivery decreases it. Dispatcher validation warns when a delivery-first route requires more than the truck has onboard, or when onboard product does not match the required fuel type.

**Rig model**: the driver's rig is a separate tractor + trailer, modeled as `Vehicle { id, fleetNumber, registrationNumber }`. `registrationNumber` (license plate) is the primary identifier the driver physically checks; `fleetNumber` (e.g. "Truck 24" / "Trailer 08") and `id` are internal fleet/inventory keys used by dispatch. Each stop now also carries scalar `supplier`, `loadingNumber` (pickup), and `poNumber` (delivery), plus compartment-level child arrays `pickupProducts[]` and `deliveryProducts[]` — so a single stop can hold EN590 in Compartment 2 and B7 in Compartment 4 without flattening operational fields onto the Stop itself.

**Driver workflow principle** (one screen = one task = one main action): the backend model can be complex, but the driver sees one operational instruction at a time. Complexity (compartments, mappings, gross/net, supplier, timestamps, document metadata, issues, history) stays on the dispatcher side. Planned driver flow: Confirm rig → Navigate → Arrived → Load Compartment N (sequential) → Photograph BoL → Confirm extracted quantities → Navigate to customer → Arrived → Tank level (optional) → Unload Compartment N → Delivery ticket → Signature/PoD → Complete.

### Driver app phase plan (incremental)
- **Phase 1 (done)** — Data model: `Vehicle` split, `Stop` product arrays + supplier/po/loading, enriched mock run RN-2841.
- **Phase 2 (done)** — Pre-start rig confirm screen: prominent plates + fleet number, big "Confirm & Start", secondary "Report mismatch".
- **Phase 3 (done)** — Compartment-driven pickup (sequential load instructions, supplier as reference line; dispatch sends only planned compartments; "differs from plan" deviation capture; per-compartment BoL with aggregate fallback).
- **Phase 4 (done)** — BoL guided mini-flow + quantity automation (Expected → Gross/Net → Confirm; manual inputs only on OCR failure).
- **Phase 5 (done)** — Compartment + tank step-by-step delivery (deliver-needed-compartment, optional tank sub-flow, delivery ticket + PoD separately, retained load as instruction, PO as small reference).
- **Phase 6 (done)** — Dispatcher full-detail view at `/dispatch/runs/:id` (compartments, mappings, gross/net, supplier, timestamps, documents, issues, history), fed live from the driver store.
- **Phase 7 (done)** — Dispatcher command center on Overview: a consolidated, priority-sorted **Action Queue** (blocked stops, issues, deviations, quantity exceptions, unassigned runs, delayed + double-booked vehicles, missing documents) plus a compact **Live Runs** strip (progress + risk at a glance). Overview is now action-first; operational detail stays hidden until an item is opened.

### Dispatcher command center (Phase 7)
The dispatcher's job is triage, so the Overview no longer fronts a firehose of KPI cards. It leads with the **Action Queue** — a single list that aggregates, deduplicates and ranks everything that needs a human decision, sourced live from the driver store (`useDriverRuns`) and dispatch store (`useUnassignedRuns` / `useScheduleRuns`). Blocked stops and urgent issues rise to the top; each item links to its run detail (or the Unassigned board) with inline Acknowledge / Resolve where applicable. A compact **Live Runs** strip shows today's in-flight runs with progress % and a risk pill (Blocked / Conflict / Delayed / In progress / Dispatched), so a dispatcher can scan status without opening every run. Sourcing, availability, map, KPIs and the runs table remain below as reference material.

### Delivery product model (Phase 5)
`DeliveryProduct` carries the same compartment-aware shape as pickup — `plannedQuantity`, `currentL`, `retainedQuantity` (an instruction shown to the driver, never an editable field), `actualDeliveredQuantity` and `deviation` (captured only on deviation), plus per-tank `tankSerialNumber` / `initialTankVolume` / `finalTankVolume` / `waterInTank` (optional — a stop with no tank serial skips the tank sub-flow). The delivery meter ticket number is stored stop-level as `deliveryTicket`.

## 5. Backend / Third-party Integration Plan
- Forms: Demo request / contact form (built-in Forms)
- Supabase: Not required for the current homepage

## 6. Development Phase Plan

### Phase 1: Marketing Homepage
- Goal: Deliver a complete, polished marketing homepage.
- Deliverable: Single-page homepage with all sections and a working demo request form.