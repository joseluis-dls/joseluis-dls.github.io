const AVAILABLE = true;
// Crea tu cuenta gratis en formspree.io y reemplaza el ID
const FORMSPREE_ID = 'YOUR_FORM_ID';
const NAME = 'JDS Studio';

const PROJECTS = [
{
  id: 0,
  label: "Landing Corporativa",
  name: "Sande Transportes",
  industry: "Logística & Transporte",
  tech: ["HTML", "CSS", "JavaScript"],
  color: "#1A0808",
  accent: "#D94040",
  description: "Presencia digital para empresa de maquinaria pesada y transportes especiales.",
  metrics: ["Responsive", "SEO local", "Captación leads"],
  url: "https://www.sandemaq.com/"
},
{
  id: 1,
  label: "Landing Corporativa",
  name: "Orduña Transportes",
  industry: "Logística & Transporte",
  tech: ["HTML", "CSS", "JavaScript"],
  color: "#0F1B2D",
  accent: "#2C74D4",
  description: "Landing corporativa para empresa de transporte. Diseño limpio, orientado a captación de clientes B2B.",
  metrics: ["Mobile-first", "< 1s load", "SEO optimizado"],
  url: "https://ordunatransportes.com/"
},
{
  id: 2,
  label: "E-Commerce Premium",
  name: "The Container House®",
  industry: "Arte & Diseño Portuario",
  tech: ["JavaScript", "FastAPI", "Supabase"],
  color: "#0D0D0D",
  accent: "#C9A23A",
  description: "E-commerce y Showroom digital para marca mexicana de mobiliario y arte 3D de lujo inspirado en la industria portuaria y logística.",
  metrics: ["Full-stack", "Auth + pagos", "UX premium"],
  url: "https://www.thecontainerh.com/coming-soon"
}];

const SKILLS = [
{
  label: "Frontend",
  chips: [["React", true], ["Next.js", true], ["TypeScript", true]]
},
{
  label: "UX & Diseño",
  chips: [["Figma", true], ["Prototyping", false]]
},
{
  label: "Backend & API",
  chips: [["Node.js", true], ["PostgreSQL", true], ["Supabase", true], ["FastAPI", false], ["Stripe", false]]
}];
