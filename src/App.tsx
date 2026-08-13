import { BlueprintEditor } from "./components/BlueprintEditor";

const practices = [
  {
    number: "01",
    verb: "Explain it",
    title: "Diagrams & visual systems",
    copy: "Cutaways, process maps, roadmaps, product stories, and labeled worlds that turn difficult material into something people can actually follow.",
    examples: "CUTAWAYS / SYSTEM MAPS / EDITORIAL DIAGRAMS",
    tone: "coral",
  },
  {
    number: "02",
    verb: "Embody it",
    title: "Characters & artifacts",
    copy: "Cards, capsules, little guys, identity objects, and collectible systems developed from a person, pet, project, song, or brand.",
    examples: "CARDS / CAPSULES / CHARACTERS / STATIONERY",
    tone: "violet",
  },
  {
    number: "03",
    verb: "Make it interactive",
    title: "Websites & prototypes",
    copy: "Expressive websites, apps, CodePens, controls, and playable interfaces where the interaction belongs to the same visual world as the idea.",
    examples: "SITES / APPS / BUTTONS / SLIDERS / PLAY",
    tone: "teal",
  },
  {
    number: "04",
    verb: "Put it into the world",
    title: "Covers, print & merch",
    copy: "Album worlds, posters, campaign images, and production-conscious artwork prepared for the format it is meant to live on.",
    examples: "COVERS / POSTERS / MERCH / PRINT SYSTEMS",
    tone: "gold",
  },
];

const selectedWork = [
  {
    title: "The Diagram Foundry",
    label: "Flagship direction / explanatory systems",
    image: "/work/diagram-foundry.jpg",
    alt: "An editorial cutaway showing six stages of the Carta Vespa Hive diagram workflow",
    size: "wide",
  },
  {
    title: "Idea Capsule",
    label: "Concept study / collectible knowledge object",
    image: "/work/idea-capsule.jpg",
    alt: "A dark technical dossier centered on a glowing idea capsule",
    size: "standard",
  },
  {
    title: "UBY: Echo Diver",
    label: "Original worldbuilding / character dossier",
    image: "/work/uby-capsule-dossier.jpg",
    alt: "A science fiction character capsule dossier titled UBY Echo Diver",
    size: "portrait",
  },
  {
    title: "Idea Refinery",
    label: "Pixel-system study / process visualization",
    image: "/work/idea-refinery.jpg",
    alt: "A pixel-art idea refinery with six labeled workflow chambers",
    size: "standard",
  },
  {
    title: "Build the Duck",
    label: "Working prototype / geometric puzzle interface",
    image: "/work/interactive-puzzle.jpg",
    alt: "A geometric duck puzzle game interface",
    size: "standard",
  },
  {
    title: "Techno Torment",
    label: "Album-world study / visual direction",
    image: "/work/album-world.jpg",
    alt: "A red-lit techno underworld developed as an album art concept",
    size: "wide",
  },
];

const exoskeletonStudy = [
  {
    image: "/work/emergent-exoskeleton-coat.jpg",
    alt: "Long layered coat concept built from a porous fibrous shell material",
    label: "Layered shell / full silhouette",
  },
  {
    image: "/work/emergent-exoskeleton-material.jpg",
    alt: "Macro study of a fibrous porous biomaterial",
    label: "Porous membrane / material study",
  },
  {
    image: "/work/emergent-exoskeleton-knit.jpg",
    alt: "Knitwear concept crossed by an irregular fibrous exoskeleton",
    label: "Knit integration / surface system",
  },
  {
    image: "/work/emergent-exoskeleton-shell.jpg",
    alt: "Sculptural wrapped top concept made from layered cellular material",
    label: "Protective wrap / form study",
  },
];

const ubsessStudy = [
  {
    image: "/work/ubsess-biomorphic-luxury.jpg",
    alt: "Silver biomorphic mask and jewelry objects presented in a pearlescent luxury campaign",
    label: "Biomorphic luxury / brand world",
  },
  {
    image: "/work/ubsess-voting-dashboard.jpg",
    alt: "UBSESS voting dashboard showing three community-selected fashion concepts",
    label: "Community voting / concept selection",
  },
  {
    image: "/work/ubsess-evolution-tree.jpg",
    alt: "UBSESS capsule evolution tree connecting common, rare, epic, and legendary tiers",
    label: "Capsule tiers / evolution logic",
  },
  {
    image: "/work/ubsess-inventory-vault.jpg",
    alt: "UBSESS inventory interface with capsule collection and evolution chamber",
    label: "Inventory vault / collection system",
  },
  {
    image: "/work/ubsess-sandal-concept.jpg",
    alt: "Pair of pearlescent sculptural platform sandal concepts",
    label: "Wearable object / sandal concept",
  },
  {
    image: "/work/ubsess-capsule-jacket.jpg",
    alt: "Transparent jacket concept with modular purple and copper capsule units",
    label: "Modular garment / capsule attachment",
  },
];

const process = [
  ["01", "Bring the source", "A sketch, folder, song, pet, business, system, story, or half-formed idea is enough to begin."],
  ["02", "Find the form", "We decide whether the idea wants to become a diagram, identity object, interface, image, or connected set."],
  ["03", "Build the system", "Structure, visual language, variants, and interactions are developed together—not as disconnected outputs."],
  ["04", "Finish for reality", "The final work is prepared for its destination: screen, deck, social post, print, merch, or continued production."],
];

function App() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Carta Vespa Hive home">
          <span className="wordmark-mark" aria-hidden="true">CVH</span>
          <span>Carta Vespa Hive</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#practices">Practices</a>
          <a href="#tool">Foundry tool</a>
          <a href="#about">About</a>
        </nav>
        <a className="header-action" href="mailto:pheroh@cartavespahive.com?subject=Project%20inquiry%20for%20Carta%20Vespa%20Hive">
          Start a project <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow">Independent multimodal foundry</p>
            <h1>Difficult ideas,<br /><em>made visible.</em></h1>
            <p className="hero-lede">
              Carta Vespa Hive turns raw source material into diagrams, visual worlds,
              collectible artifacts, interfaces, and production-ready creative systems.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="mailto:pheroh@cartavespahive.com?subject=Make%20me%20a%20diagram">
                Make me a diagram
              </a>
              <a className="text-link" href="#work">Explore the foundry <span>↓</span></a>
            </div>
            <div className="hero-statement">
              <span>THE INPUT</span>
              <p>One rough idea, in whatever form it currently exists.</p>
              <span>THE OUTPUT</span>
              <p>The form that makes it understandable, memorable, or real.</p>
            </div>
          </div>
          <figure className="hero-visual">
            <img
              src="/work/diagram-foundry.jpg"
              alt="The Diagram Foundry shown as a detailed six-stage editorial cutaway"
            />
            <figcaption>
              <span>01 / FLAGSHIP PRACTICE</span>
              <strong>The Diagram Foundry</strong>
              <span>Every part has a purpose. Every claim has a source.</span>
            </figcaption>
          </figure>
        </section>

        <div className="material-strip" aria-label="Examples of source material">
          <span>BRING US</span>
          <span>ROUGH NOTES</span><i>◆</i>
          <span>PHOTOS</span><i>◆</i>
          <span>A SONG</span><i>◆</i>
          <span>A PET</span><i>◆</i>
          <span>A SYSTEM</span><i>◆</i>
          <span>A STRANGE IDEA</span>
        </div>

        <section className="work-section" id="work">
          <div className="section-heading">
            <p className="eyebrow">Selected work & current directions</p>
            <h2>One foundry.<br />Many forms.</h2>
            <p>
              The medium changes with the job. The through-line is visual direction,
              structural thinking, and the patience to keep iterating until the work belongs together.
            </p>
          </div>
          <div className="work-grid">
            {selectedWork.map((item, index) => (
              <figure className={`work-card work-card--${item.size}`} key={item.title}>
                <div className="work-image-frame">
                  <img src={item.image} alt={item.alt} loading={index < 2 ? "eager" : "lazy"} />
                </div>
                <figcaption>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><strong>{item.title}</strong><small>{item.label}</small></div>
                  <span aria-hidden="true">↗</span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="case-studies" aria-label="Featured concept studies">
            <article className="case-study case-study--exoskeleton">
              <div className="case-study-heading">
                <div>
                  <p className="eyebrow">07 / Material futures</p>
                  <h3 aria-label="Emergent Exoskeletons">Emergent<br />Exoskeletons</h3>
                </div>
                <div className="case-study-copy">
                  <p>
                    A biomorphic apparel study translating nest architecture into layered silhouettes,
                    porous membranes, and fibrous protective shells. The series demonstrates a coherent
                    material language across outerwear and knit forms.
                  </p>
                  <small>CONCEPT DIRECTION / APPAREL STUDY / NOT PRESENTED AS MANUFACTURED</small>
                </div>
              </div>
              <div className="concept-gallery concept-gallery--exoskeleton">
                {exoskeletonStudy.map((item) => (
                  <figure key={item.image}>
                    <img src={item.image} alt={item.alt} loading="lazy" />
                    <figcaption>{item.label}</figcaption>
                  </figure>
                ))}
              </div>
            </article>

            <article className="case-study case-study--ubsess">
              <div className="case-study-heading">
                <div>
                  <p className="eyebrow">08 / Product-system concept</p>
                  <h3>UBSESS</h3>
                </div>
                <div className="case-study-copy">
                  <p>
                    A concept-to-market ecosystem for collectible design: creators submit objects,
                    the community votes, selected concepts move toward prototyping, and capsule tiers
                    create a visual language for collecting, evolving, and trading.
                  </p>
                  <small>PRODUCT VISION / MARKETPLACE UX / WEARABLE OBJECTS / CONCEPT STAGE</small>
                </div>
              </div>
              <div className="concept-gallery concept-gallery--ubsess">
                {ubsessStudy.map((item) => (
                  <figure key={item.image}>
                    <img src={item.image} alt={item.alt} loading="lazy" />
                    <figcaption>{item.label}</figcaption>
                  </figure>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="practices-section" id="practices">
          <div className="practices-intro">
            <p className="eyebrow">Foundry practices</p>
            <h2>Focused enough to hire.<br />Open enough to grow.</h2>
          </div>
          <div className="practices-grid">
            {practices.map((practice) => (
              <article className={`practice-card practice-card--${practice.tone}`} key={practice.number}>
                <div className="practice-meta"><span>{practice.number}</span><span>{practice.verb}</span></div>
                <h3>{practice.title}</h3>
                <p>{practice.copy}</p>
                <small>{practice.examples}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="process-section">
          <div className="process-title">
            <p className="eyebrow">How commissions move</p>
            <h2>Source → Form → System → Finish</h2>
          </div>
          <div className="process-list">
            {process.map(([number, title, copy]) => (
              <article key={number}>
                <span>{number}</span><h3>{title}</h3><p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="tool-section" id="tool">
          <div className="tool-intro">
            <div>
              <p className="eyebrow">Working capability / Diagram Foundry</p>
              <h2>Map the truth before styling the picture.</h2>
            </div>
            <p>
              This live blueprint workbench separates facts, parts, relationships, and evidence
              from visual styling. It is an early working tool—not a claim that AI has finished the job.
            </p>
          </div>
          <details className="tool-disclosure">
            <summary><span>Open the blueprint workbench</span><span>Interactive tool +</span></summary>
            <div className="tool-body"><BlueprintEditor /></div>
          </details>
        </section>

        <section className="about-section" id="about">
          <div className="about-mark" aria-hidden="true"><span>C</span><span>V</span><span>H</span></div>
          <div className="about-copy">
            <p className="eyebrow">About the foundry</p>
            <h2>A personal studio with a wide instrument panel.</h2>
            <p className="about-lede">
              Carta Vespa Hive is Connor Impey’s independent creative practice. You work directly
              with me. I use drawing, design, code, research, and generative tools—whatever makes
              the idea work.
            </p>
            <p>
              Some studios begin with a fixed medium. CVH begins with the source material and asks
              what it needs to become. That may be one precise diagram or an entire connected world.
            </p>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <p className="eyebrow">Have something difficult to explain—or strange enough to build?</p>
          <h2>Bring the source.<br /><em>We’ll find the form.</em></h2>
          <a className="contact-link" href="mailto:pheroh@cartavespahive.com?subject=Project%20inquiry%20for%20Carta%20Vespa%20Hive">
            pheroh@cartavespahive.com <span aria-hidden="true">↗</span>
          </a>
          <p className="contact-note">Include what you have, what it needs to do, and where it needs to live. Rough is welcome.</p>
        </section>
      </main>

      <footer>
        <div><span className="wordmark-mark">CVH</span><strong>Carta Vespa Hive</strong></div>
        <p>Independent multimodal foundry.</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </div>
  );
}

export default App;
