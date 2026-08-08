import { BlueprintEditor } from "./components/BlueprintEditor";

const workflow = [
  {
    number: "01",
    name: "Structure",
    role: "Architect",
    copy: "Define the shell, section plane, chambers, connectors, and boundaries before asking for a beautiful image.",
  },
  {
    number: "02",
    name: "Expand",
    role: "Visual translator",
    copy: "Apply materials, density, lighting, and exact callouts without breaking the approved spatial system.",
  },
  {
    number: "03",
    name: "Inspect",
    role: "Diagram verifier",
    copy: "Reject floating parts, impossible intersections, fake text, and labels that explain nothing.",
  },
];

function DiagramPreview() {
  return (
    <div className="diagram-card" aria-label="Example structural cutaway">
      <div className="diagram-toolbar">
        <span>STRUCTURAL STUDY / 001</span>
        <span>SECTION A—A</span>
      </div>
      <svg viewBox="0 0 760 520" role="img" aria-labelledby="diagram-title">
        <title id="diagram-title">A labeled cutaway with connected chambers</title>
        <defs>
          <pattern id="minor-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity=".08" strokeWidth="1" />
          </pattern>
          <filter id="paper-noise">
            <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" stitchTiles="stitch" />
            <feBlend mode="multiply" in="SourceGraphic" />
          </filter>
        </defs>
        <rect width="760" height="520" fill="url(#minor-grid)" />
        <path className="shell" d="M206 415 C165 370 160 294 184 222 C206 154 270 104 366 92 C466 80 548 126 580 205 C611 282 596 370 539 419 C454 452 296 452 206 415Z" />
        <path className="section-fill" d="M217 394 C190 351 189 288 210 229 C233 167 291 128 370 118 C453 108 520 148 548 211 C574 270 562 340 518 385 C438 414 298 416 217 394Z" />
        <path className="chamber chamber-a" d="M254 308 C235 271 249 218 291 193 C332 169 375 192 384 234 C394 278 367 321 322 332 C295 338 270 328 254 308Z" />
        <path className="chamber chamber-b" d="M408 182 C441 157 491 170 514 204 C536 238 524 284 492 306 C456 331 412 315 397 278 C384 244 385 201 408 182Z" />
        <path className="chamber chamber-c" d="M362 339 C393 316 441 326 461 355 C480 382 462 409 427 416 L349 416 C332 390 339 356 362 339Z" />
        <path className="connector" d="M374 250 C398 244 415 244 433 247" />
        <path className="connector" d="M338 321 C356 342 370 353 386 361" />
        <path className="connector thin" d="M477 309 C470 329 456 344 441 354" />
        <line className="section-line" x1="188" y1="111" x2="573" y2="426" />

        <g className="callout">
          <circle cx="280" cy="219" r="5" />
          <path d="M280 219 L128 151 L54 151" />
          <text x="54" y="137">01 / INTAKE CHAMBER</text>
          <text className="callout-note" x="54" y="169">Receives and sorts source material</text>
        </g>
        <g className="callout">
          <circle cx="488" cy="218" r="5" />
          <path d="M488 218 L620 154 L711 154" />
          <text textAnchor="end" x="711" y="140">02 / TRANSLATION CORE</text>
          <text className="callout-note" textAnchor="end" x="711" y="172">Converts structure into visual language</text>
        </g>
        <g className="callout">
          <circle cx="414" cy="375" r="5" />
          <path d="M414 375 L557 454 L711 454" />
          <text textAnchor="end" x="711" y="440">03 / INSPECTION WELL</text>
          <text className="callout-note" textAnchor="end" x="711" y="472">Rejects disconnected or false detail</text>
        </g>
        <g className="legend" transform="translate(54 452)">
          <rect width="12" height="12" className="legend-solid" />
          <text x="20" y="10">SOLID</text>
          <rect x="78" width="12" height="12" className="legend-membrane" />
          <text x="98" y="10">MEMBRANE</text>
          <rect x="190" width="12" height="12" className="legend-fluid" />
          <text x="210" y="10">FLUID</text>
        </g>
      </svg>
      <div className="diagram-caption">
        <span>Every visible part has a reason to exist.</span>
        <span>CVH / DIAGRAM FOUNDRY</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Carta Vespa Hive home">
          <span className="wordmark-mark" aria-hidden="true">CVH</span>
          <span>Carta Vespa Hive</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#workflow">Workflow</a>
          <a href="#blueprint">Blueprint</a>
          <a href="#rules">Rules</a>
        </nav>
        <a className="header-action" href="#blueprint">Build a blueprint</a>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow">A structural diagram foundry</p>
            <h1>Build the diagram before you build the image.</h1>
            <p className="hero-lede">
              Turn a rough idea into a coherent cutaway, exploded view, or miniature world—then inspect every connection before it becomes visual noise.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#blueprint">Build a blueprint</a>
              <a className="text-link" href="#workflow">See the three-stage method <span>↓</span></a>
            </div>
          </div>
          <DiagramPreview />
        </section>

        <section className="workflow-section" id="workflow">
          <div className="section-heading">
            <p className="eyebrow">One method. Three gates.</p>
            <h2>Structure → Expand → Inspect</h2>
            <p>Each stage has one job. Nothing advances until its structure survives review.</p>
          </div>
          <div className="workflow-grid">
            {workflow.map((step) => (
              <article className="workflow-card" key={step.number}>
                <div className="workflow-meta">
                  <span>{step.number}</span>
                  <span>{step.role}</span>
                </div>
                <h3>{step.name}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="blueprint-section" id="blueprint">
          <div className="foundry-intro">
            <p className="eyebrow">Truth-model blueprint editor</p>
            <h2>Map the truth before styling the picture.</h2>
            <p>
              Name the system, add its parts, and connect what happens. Add evidence when you are
              ready; Carta Vespa Hive keeps the facts separate from the layout.
            </p>
          </div>
          <BlueprintEditor />
        </section>

        <section className="rules-section" id="rules">
          <div className="rules-copy">
            <p className="eyebrow">The inspection standard</p>
            <h2>Pretty is not a passing grade.</h2>
            <p>A CVH diagram must remain intelligible when the atmosphere, texture, and spectacle are removed.</p>
          </div>
          <div className="rules-list">
            {[
              ["01", "Every chamber connects", "No floating rooms, tubes, organs, panels, or decorative fragments."],
              ["02", "Every label teaches", "Callouts name a function, behavior, material boundary, or relationship."],
              ["03", "Every material separates", "Solid, membrane, fluid, and void cannot dissolve into one ambiguous surface."],
              ["04", "Every section remains plausible", "The cutaway reveals the system without creating impossible geometry."],
            ].map(([number, title, copy]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <div>
          <span className="wordmark-mark">CVH</span>
          <strong>Carta Vespa Hive</strong>
        </div>
        <p>Structure first. Image second. Inspection always.</p>
        <a href="mailto:hello@cartavespahive.com">hello@cartavespahive.com</a>
      </footer>
    </div>
  );
}

export default App;
