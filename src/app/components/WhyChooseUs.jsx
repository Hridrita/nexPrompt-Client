const features = [
  { title: "Fast Delivery", desc: "Get your projects done in record time with our AI-powered workflows.", icon: "⚡" },
  { title: "Quality Guaranteed", desc: "Top-tier prompts refined by experts for maximum precision.", icon: "🎯" },
  { title: "Community Driven", desc: "Join thousands of makers sharing and remixing daily.", icon: "🤝" },
];

export function WhyChooseUs() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose NexPrompt?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 bg-white rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-zinc-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}