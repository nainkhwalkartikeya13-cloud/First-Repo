import { motion } from "framer-motion";

const AboutPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white"
        >
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] bg-[#212A2C] text-white flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
                        alt="Our Story Hero"
                        className="w-full h-full object-cover opacity-40"
                    />
                </div>
                <div className="relative text-center px-6 max-w-4xl mx-auto z-10">
                    <p className="text-[12px] md:text-[14px] font-bold uppercase tracking-[0.2em] mb-4 text-emerald-400">
                        Our Story
                    </p>
                    <h1
                        className="text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight"
                        style={{ fontFamily: "Source Serif 4, Georgia, serif", fontWeight: 300 }}
                    >
                        Comfort, Crafted by Nature.
                    </h1>
                </div>
            </section>

            {/* The Problem Section */}
            <section className="py-20 md:py-32 px-6">
                <div className="max-w-[800px] mx-auto text-center">
                    <h2
                        className="text-3xl md:text-5xl text-[#212A2C] mb-8 leading-tight"
                        style={{ fontFamily: "Source Serif 4, Georgia, serif", fontWeight: 300 }}
                    >
                        The Shoe Industry is Broken.
                    </h2>
                    <p className="text-[16px] md:text-[18px] text-[#555] leading-relaxed mb-6">
                        For decades, footwear has been dominated by cheap, synthetic materials that are bad for the environment and leave your feet sweating and suffocated. Plastics, heavy glues, and non-recyclable parts became the standard simply because they were cheaper to produce.
                    </p>
                    <p className="text-[16px] md:text-[18px] text-[#555] leading-relaxed">
                        We knew there had to be a better way. A way to make shoes that look great, feel like clouds, and tread lightly on the planet.
                    </p>
                </div>
            </section>

            {/* Split Image Text Section */}
            <section className="bg-[#F5F5F2] py-20 px-6">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <img
                            src="https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&q=80"
                            alt="Craftsmanship"
                            className="w-full h-[500px] object-cover rounded-sm"
                        />
                    </div>
                    <div className="order-1 md:order-2 md:pl-10">
                        <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#767676] mb-4">
                            The AEROLITH Difference
                        </p>
                        <h2
                            className="text-3xl md:text-4xl text-[#212A2C] mb-6"
                            style={{ fontFamily: "Source Serif 4, Georgia, serif", fontWeight: 300 }}
                        >
                            Mother Nature is the Best Designer.
                        </h2>
                        <p className="text-[15px] text-[#555] mb-6 leading-relaxed">
                            Rather than relying on fossil fuels, we turned to natural alternatives. We experimented with premium Merino wool for its unmatched softness and temperature regulation. We utilized Eucalyptus tree fibers for their breathable, cooling properties.
                        </p>
                        <p className="text-[15px] text-[#555] leading-relaxed">
                            The result is a line of footwear that feels utterly premium, radically comfortable, and completely sustainable.
                        </p>
                    </div>
                </div>
            </section>

            {/* The Promise Section */}
            <section className="py-20 md:py-32 px-6 text-center">
                <div className="max-w-[800px] mx-auto">
                    <h2
                        className="text-3xl md:text-5xl text-[#212A2C] mb-8"
                        style={{ fontFamily: "Source Serif 4, Georgia, serif", fontWeight: 300 }}
                    >
                        Our Promise to You
                    </h2>
                    <p className="text-[16px] md:text-[18px] text-[#555] leading-relaxed mb-12">
                        We will never compromise on quality or sustainability. We will continue to innovate, to measure our impact, and to prove that business can be a force for good. When you wear AEROLITH, you&apos;re not just wearing a shoe—you&apos;re joining a movement for better.
                    </p>
                    <div className="w-[1px] h-20 bg-[#212A2C] mx-auto opacity-20"></div>
                </div>
            </section>
        </motion.div>
    );
};

export default AboutPage;
