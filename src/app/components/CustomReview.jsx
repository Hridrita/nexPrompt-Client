const reviews = [
  { name: "John Doe", text: "NexPrompt completely changed how I build my SaaS landing pages!", rating: 5 },
  { name: "Jane Smith", text: "The quality of prompts here is unmatched. Highly recommended.", rating: 5 },
];

export function CustomerReviews() {
  return (
    <section className="py-20 bg-[#066a9b]/5">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="p-8 bg-white rounded-2xl shadow-sm">
              <div className="text-yellow-400 mb-4">★★★★★</div>
              <p className="text-zinc-700 italic mb-6">"{r.text}"</p>
              <h4 className="font-bold">- {r.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}