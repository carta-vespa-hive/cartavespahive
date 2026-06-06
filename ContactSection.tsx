/**
 * ContactSection — Invitation to connect
 * Design: Crystalline Emergence — editorial form with gold accents
 */
import { useState } from "react";
import { toast } from "sonner";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message received. We will follow up soon.", {
      style: {
        background: "oklch(0.10 0.015 70)",
        color: "oklch(0.94 0.02 90 / 80%)",
        border: "1px solid oklch(0.62 0.14 70 / 20%)",
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.7rem",
      },
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const inputStyle = {
    background: "oklch(0.08 0.01 70)",
    border: "1px solid oklch(0.62 0.14 70 / 15%)",
    color: "oklch(0.94 0.02 90 / 70%)",
    fontFamily: "'Cormorant', Georgia, serif",
    fontSize: "1.1rem",
    padding: "0.8rem 1rem",
    outline: "none",
    width: "100%",
    transition: "border-color 0.5s ease",
  };

  return (
    <section
      id="contact"
      className="relative py-32 md:py-44"
      style={{ background: "oklch(0.05 0.005 70)" }}
    >
      <div className="gold-rule w-full" data-animate="rule" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-20 md:pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          {/* Left column — invitation text */}
          <div className="lg:col-span-5" data-animate="fade-up">
            <div
              className="text-utility-sm mb-6"
              style={{ color: "oklch(0.62 0.14 70 / 45%)" }}
            >
              004 &mdash; CONTACT
            </div>

            <h2
              className="heading-display mb-8"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
                color: "oklch(0.94 0.02 90 / 85%)",
              }}
            >
              Need another pyramid in the{" "}
              <em style={{ color: "oklch(0.62 0.14 70)", fontWeight: 300 }}>
                cavern
              </em>
            </h2>

            <p
              style={{
                fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)",
                color: "oklch(0.94 0.02 90 / 45%)",
                lineHeight: 1.8,
                fontWeight: 400,
              }}
            >
              If you are expanding the ecosystem, refining one of the existing
              properties, or building the next destination inside the same
              world, send over the brief and we can shape the next structure.
            </p>

            <div className="mt-12 space-y-4">
              <div>
                <div
                  className="text-utility-sm mb-1"
                  style={{ color: "oklch(0.62 0.14 70 / 35%)" }}
                >
                  EMAIL
                </div>
                <a
                  href="mailto:hello@cartavespahive.com"
                  style={{
                    color: "oklch(0.94 0.02 90 / 60%)",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  hello@cartavespahive.com
                </a>
              </div>
              <div>
                <div
                  className="text-utility-sm mb-1"
                  style={{ color: "oklch(0.62 0.14 70 / 35%)" }}
                >
                  LOCATION
                </div>
                <span
                  style={{
                    color: "oklch(0.94 0.02 90 / 60%)",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  Remote studio &mdash; available worldwide
                </span>
              </div>
              <div>
                <div
                  className="text-utility-sm mb-1"
                  style={{ color: "oklch(0.62 0.14 70 / 35%)" }}
                >
                  IDEAL FOR
                </div>
                <span
                  style={{
                    color: "oklch(0.94 0.02 90 / 60%)",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  New properties, redesigns, connected site systems
                </span>
              </div>
            </div>
          </div>

          {/* Right column — form */}
          <div className="lg:col-span-6 lg:col-start-7" data-animate="fade-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  className="text-utility-sm block mb-2"
                  style={{ color: "oklch(0.62 0.14 70 / 35%)" }}
                >
                  NAME
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "oklch(0.62 0.14 70 / 40%)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "oklch(0.62 0.14 70 / 15%)")
                  }
                  required
                />
              </div>

              <div>
                <label
                  className="text-utility-sm block mb-2"
                  style={{ color: "oklch(0.62 0.14 70 / 35%)" }}
                >
                  EMAIL
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "oklch(0.62 0.14 70 / 40%)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "oklch(0.62 0.14 70 / 15%)")
                  }
                  required
                />
              </div>

              <div>
                <label
                  className="text-utility-sm block mb-2"
                  style={{ color: "oklch(0.62 0.14 70 / 35%)" }}
                >
                  MESSAGE
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={5}
                  style={{ ...inputStyle, resize: "vertical" as const }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "oklch(0.62 0.14 70 / 40%)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "oklch(0.62 0.14 70 / 15%)")
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="text-utility px-8 py-3 transition-all duration-700 hover:tracking-[0.25em]"
                style={{
                  background: "transparent",
                  border: "1px solid oklch(0.62 0.14 70 / 30%)",
                  color: "oklch(0.62 0.14 70 / 70%)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "oklch(0.62 0.14 70 / 10%)";
                  e.currentTarget.style.borderColor =
                    "oklch(0.62 0.14 70 / 50%)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor =
                    "oklch(0.62 0.14 70 / 30%)";
                }}
              >
                SEND INQUIRY
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
