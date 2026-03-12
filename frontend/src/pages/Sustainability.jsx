import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IoLeafOutline } from "react-icons/io5";
import { BsArrowRight } from "react-icons/bs";

/* ═══════════════════════════════════════
   AEROLITH Sustainability Page
═══════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const materials = [
  {
    name: "ZQ Merino Wool",
    desc: "Soft, temperature-regulating, and moisture-wicking. Sourced from ZQ-certified farms that meet the highest animal welfare and environmental standards.",
    icon: "🐑",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
  },
  {
    name: "Tree Fiber (TENCEL™ Lyocell)",
    desc: "Made from FSC-certified eucalyptus trees, harvested from responsibly managed forests. Silky smooth, breathable, and lightweight.",
    icon: "🌿",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
  },
  {
    name: "SweetFoam™",
    desc: "The world's first carbon-negative green EVA. Made from Brazilian sugarcane, our midsoles provide cloud-like comfort while pulling carbon from the atmosphere.",
    icon: "🍬",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
  },
  {
    name: "Trino™",
    desc: "Our proprietary blend of merino wool and tree fiber. Combines the best of both materials for socks and shoe liners that regulate temperature and fight odor naturally.",
    icon: "🧶",
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&q=80",
  },
];

const stats = [
  { number: "0", label: "Net Carbon", suffix: "kg CO₂e", desc: "We offset what we can't yet eliminate" },
  { number: "70", label: "Natural Materials", suffix: "%", desc: "Replacing petroleum-based synthetics" },
  { number: "100", label: "Renewable Energy", suffix: "%", desc: "Powering our operations sustainably" },
  { number: "50", label: "Carbon Reduced", suffix: "%", desc: "Since our first carbon footprint label" },
];

const timeline = [
  { year: "2016", title: "Founded", desc: "AEROLITH launches with one core product: The Everyday Runner." },
  { year: "2019", title: "Carbon Neutral", desc: "We become one of the first fashion brands to measure and offset our entire carbon footprint." },
  { year: "2020", title: "B Corp Certified", desc: "We meet the highest standards of verified social and environmental performance." },
  { year: "2021", title: "Flight Plan", desc: "We commit to cutting our per-unit carbon footprint in half by 2025, with the goal of near zero by 2030." },
  { year: "2023", title: "Regenerative Wool", desc: "We begin sourcing wool from regenerative farms that actively restore ecosystems." },
  { year: "2025", title: "Carbon Labels on Every Product", desc: "Every product includes a transparent carbon footprint label so customers know the impact." },
];

const Sustainability = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* ── Hero ── */}
      <section className="relative bg-[#212A2C] text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&q=80"
            alt="Nature"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#212A2C]/60 to-[#212A2C]" />
        </div>
        <div className="relative max-w-[900px] mx-auto px-6 py-24 md:py-40 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <IoLeafOutline className="mx-auto mb-6 text-emerald-400" size={40} />
          </motion.div>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-4xl md:text-6xl font-light tracking-tight mb-6"
            style={{ fontFamily: "Source Serif 4, Georgia, serif" }}
          >
            Better Things,<br />In a Better Way
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-white/70 text-[15px] md:text-[17px] max-w-xl mx-auto leading-relaxed mb-8"
          >
            We believe in creating comfortable products that are also kind to the planet.
            From the materials we choose to the way we ship, sustainability is at the core of everything we do.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <Link
              to="/shop?filter=new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#212A2C] text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-white/90 transition-colors"
            >
              Shop Sustainable
              <BsArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Mission Statement ── */}
      <section className="max-w-[900px] mx-auto px-6 py-20 md:py-28 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[22px] md:text-[28px] font-light text-[#212A2C] leading-relaxed"
          style={{ fontFamily: "Source Serif 4, Georgia, serif" }}
        >
          {`"We make shoes from natural materials — like wool, trees, and sugarcane —
          because they perform better and leave a lighter footprint. Our goal is
          to create the most comfortable shoes in the most sustainable way possible,
          and then leave the planet better than we found it."`}
        </motion.p>
        <p className="mt-6 text-[13px] font-semibold text-[#767676] uppercase tracking-[0.12em]">
          — AEROLITH Founding Principle
        </p>
      </section>

      {/* ── Impact Stats ── */}
      <section className="bg-[#F7F5F0]">
        <div className="max-w-[1100px] mx-auto px-6 py-16 md:py-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[#767676] mb-14"
          >
            Our Impact in Numbers
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-[48px] md:text-[56px] font-light text-[#212A2C] leading-none mb-1">
                  {s.number}
                  <span className="text-[24px] md:text-[28px] text-emerald-600">{s.suffix}</span>
                </div>
                <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#212A2C] mb-1">
                  {s.label}
                </p>
                <p className="text-[12px] text-[#767676]">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Natural Materials ── */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-light text-[#212A2C] mb-4"
            style={{ fontFamily: "Source Serif 4, Georgia, serif" }}
          >
            Materials From the Earth
          </h2>
          <p className="text-[14px] text-[#767676] max-w-lg mx-auto">
            We replace petroleum-based synthetics with natural alternatives wherever we can.
            They&apos;re soft, breathable, and better for the planet.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {materials.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative overflow-hidden bg-[#F7F5F0]"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 aspect-square md:aspect-auto overflow-hidden">
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                  <span className="text-3xl mb-3">{m.icon}</span>
                  <h3 className="text-[18px] font-semibold text-[#212A2C] mb-3">
                    {m.name}
                  </h3>
                  <p className="text-[13px] text-[#767676] leading-relaxed">
                    {m.desc}
                  </p>
                  <Link
                    to={`/shop?search=${encodeURIComponent(m.name.split(" ")[0])}`}
                    className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#212A2C] group/link"
                  >
                    Shop {m.name.split("(")[0].trim()}
                    <BsArrowRight
                      size={12}
                      className="transition-transform duration-200 group-hover/link:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Carbon Footprint Label ── */}
      <section className="bg-[#212A2C] text-white">
        <div className="max-w-[1000px] mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400 mb-4">
                Transparency First
              </p>
              <h2
                className="text-3xl md:text-4xl font-light mb-6"
                style={{ fontFamily: "Source Serif 4, Georgia, serif" }}
              >
                Every Product Has a Carbon Footprint. We Label Ours.
              </h2>
              <p className="text-white/70 text-[14px] leading-relaxed mb-6">
                Just like nutrition labels on food, we put a carbon footprint number on every product.
                We measure the total CO₂ emissions from raw materials through to end of life —
                and we&apos;re working to bring that number down every year.
              </p>
              <p className="text-white/70 text-[14px] leading-relaxed">
                The average AEROLITH shoe has a carbon footprint of <strong className="text-white">7.6 kg CO₂e</strong>
                {" "} — about 30% less than a standard sneaker. And we&apos;re just getting started.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-10 text-center w-[260px]">
                <p className="text-[80px] font-light leading-none text-emerald-400">7.6</p>
                <p className="text-[13px] font-bold uppercase tracking-[0.12em] mt-2 mb-1">kg CO₂e</p>
                <p className="text-[11px] text-white/50">Average Carbon Footprint</p>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-[11px] text-white/50 mb-2">Standard Industry Avg.</p>
                  <p className="text-[28px] font-light text-white/40">14.0</p>
                  <p className="text-[11px] text-white/40">kg CO₂e</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="max-w-[800px] mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-light text-[#212A2C] mb-4"
            style={{ fontFamily: "Source Serif 4, Georgia, serif" }}
          >
            Our Flight Plan
          </h2>
          <p className="text-[14px] text-[#767676] max-w-md mx-auto">
            {`We're on a journey to reduce our carbon footprint to near zero. Here's where we've been.`}
          </p>
        </div>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[18px] md:left-1/2 top-0 bottom-0 w-px bg-[#E5E4E0] md:-translate-x-px" />
          <div className="space-y-10">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
              >
                {/* Dot */}
                <div className="absolute left-[12px] md:left-1/2 md:-translate-x-1/2 w-[14px] h-[14px] rounded-full bg-emerald-500 border-4 border-white z-10" />
                {/* Content */}
                <div className={`ml-10 md:ml-0 md:w-[45%] ${i % 2 === 0 ? "md:text-right md:pr-10" : "md:text-left md:pl-10"}`}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-600 mb-1">
                    {item.year}
                  </p>
                  <h4 className="text-[16px] font-semibold text-[#212A2C] mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[13px] text-[#767676] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certifications ── */}
      <section className="bg-[#F7F5F0]">
        <div className="max-w-[900px] mx-auto px-6 py-16 md:py-24 text-center">
          <h2
            className="text-2xl md:text-3xl font-light text-[#212A2C] mb-12"
            style={{ fontFamily: "Source Serif 4, Georgia, serif" }}
          >
            Certified & Committed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "B Corp™ Certified",
                desc: "Meeting the highest standards of verified social and environmental performance, public transparency, and legal accountability.",
                badge: "B",
              },
              {
                title: "1% for the Planet",
                desc: "We donate 1% of annual revenue to environmental nonprofits working to protect and restore our planet.",
                badge: "1%",
              },
              {
                title: "Carbon Neutral",
                desc: "We measure, reduce, and offset our entire carbon footprint — from raw materials to your doorstep.",
                badge: "CO₂",
              },
            ].map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#212A2C] text-white[#212A2C] flex items-center justify-center text-[14px] font-bold">
                  {cert.badge}
                </div>
                <h3 className="text-[15px] font-semibold text-[#212A2C] mb-2">
                  {cert.title}
                </h3>
                <p className="text-[13px] text-[#767676] leading-relaxed">
                  {cert.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-[700px] mx-auto px-6 py-20 md:py-28 text-center">
        <h2
          className="text-3xl md:text-4xl font-light text-[#212A2C] mb-4"
          style={{ fontFamily: "Source Serif 4, Georgia, serif" }}
        >
          Walk Lighter
        </h2>
        <p className="text-[14px] text-[#767676] mb-8 max-w-md mx-auto">
          Every step counts. Choose shoes that are as kind to the planet as they are to your feet.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/shop?category=Men"
            className="px-8 py-4 bg-[#212A2C] text-white[#212A2C] text-[11px] font-bold uppercase tracking-[0.14em] hover:opacity-90 transition-opacity"
          >
            Shop Men
          </Link>
          <Link
            to="/shop?category=Women"
            className="px-8 py-4 border border-[#212A2C] text-[#212A2C] text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-[#212A2C] hover:text-white:bg-white:text-[#212A2C] transition-all"
          >
            Shop Women
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Sustainability;
