import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    name: "Nito's Empanadas",
    description:
      "The hottest food truck in Myrtle Beach. We built a full website with online ordering, real-time truck location tracking, and a catering booking system.",
    image: "/portfolio/nitos.png",
    url: "https://nitosempanadas.com",
  },
  {
    name: "Palmetto Taps",
    description:
      "Horry County's first self-serve taproom. We built a site featuring daily event listings, an interactive tap menu, and an age-verified entrance experience.",
    image: "/portfolio/palmetto-taps.png",
    url: "https://palmettotaps.com",
  },
  {
    name: "Dani Díaz Real Estate",
    description:
      "A local real estate agent with a fully bilingual website, custom client dashboard, neighborhood guides, and integrated property listings.",
    image: "/portfolio/danidiaz.png",
    url: "https://daniglobalhomes.com",
  },
  {
    name: "Grow With Gia",
    description:
      "A personalized tutoring service. We built a colorful, inviting site with an intake form, subject picker, and parent-friendly scheduling flow.",
    image: "/portfolio/growwithgia.png",
    url: "https://demo.growwithgia.shortlistpass.com",
  },
];

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Our Work
        </h1>
        <p className="text-lg text-neutral-400 mb-16 max-w-2xl">
          Websites we&apos;ve built for local businesses on the Grand Strand.
        </p>

        <div className="grid gap-12">
          {projects.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-all hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="relative w-full aspect-[16/9] overflow-hidden">
                <Image
                  src={project.image}
                  alt={`${project.name} homepage screenshot`}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-2 group-hover:text-neutral-200 transition-colors">
                  {project.name}
                </h2>
                <p className="text-neutral-400 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
