const creators = [
  { name: "Alex Rivet", role: "AI Strategist", img: "/avatar1.png" },
  { name: "Sarah Chen", role: "Prompt Engineer", img: "/avatar2.png" },
  { name: "Mike Ross", role: "SaaS Maker", img: "/avatar3.png" },
];

export function TopCreators() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">Top Prompt Creators</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {creators.map((c, i) => (
            <div key={i} className="w-48 p-6 bg-white border rounded-2xl flex flex-col items-center">
              <div className="w-20 h-20 bg-zinc-200 rounded-full mb-4"></div>
              <h4 className="font-bold">{c.name}</h4>
              <p className="text-sm text-zinc-500">{c.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}