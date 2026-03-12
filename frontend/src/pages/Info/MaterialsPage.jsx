import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const materialsData = [
    {
        title: "ZQ Merino Wool",
        subtitle: "Soft, Cozy, and Ethical",
        description: "Our superfine Merino wool is sourced from ZQ-certified farms in New Zealand. These farms adhere to the highest standards of animal welfare, environmental care, and social sustainability. The wool naturally regulates temperature and wicks away moisture, creating a cloud-like experience for your feet.",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"
    },
    {
        title: "FSC® Certified Tree Fiber",
        subtitle: "Breezy and Cooling",
        description: "When the weather warms up, our Tree material shines. Sourced from South African eucalyptus farms that rely strictly on rainfall, this fiber is naturally breathable, silky smooth, and drastically minimizes our water footprint compared to traditional cotton.",
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80"
    },
    {
        title: "SweetFoam®",
        subtitle: "Carbon-Negative Soles",
        description: "Standard shoe soles are made from highly polluting petroleum. We invented SweetFoam®, a revolutionary midsole material derived from Brazilian sugarcane. It’s bouncy, durable, and naturally removes carbon from the atmosphere as it grows.",
        image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80"
    }
];

const MaterialsPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white"
        >
            {/* Header */}
            <section className="bg-[#F5F5F2] pt-24 pb-16 px-6 md:px-10 text-center">
                <h1
                    className="text-[#212A2C] text-4xl md:text-5xl lg:text-6xl mb-6"
                    style={{ fontFamily: "Source Serif 4, Georgia, serif", fontWeight: 300 }}
                >
                    Nature&apos;s Magic
                </h1>
                <p className="text-[15px] md:text-[16px] text-[#555] max-w-xl mx-auto leading-relaxed">
                    We look to nature&apos;s brilliance rather than cheap synthetics to craft materials that are better for you and the planet.
                </p>
            </section>

            {/* Materials Showcase */}
            <section className="py-12 md:py-24">
                {materialsData.map((mat, index) => (
                    <div
                        key={index}
                        className={`max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 mb-20 md:mb-32 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                        <div className={`${index % 2 !== 0 ? 'md:order-2' : 'md:order-1'}`}>
                            <img
                                src={mat.image}
                                alt={mat.title}
                                className="w-full h-[400px] md:h-[600px] object-cover rounded-sm shadow-sm"
                            />
                        </div>
                        <div className={`${index % 2 !== 0 ? 'md:order-1' : 'md:order-2'} flex flex-col justify-center`}>
                            <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#767676] mb-4">
                                {mat.subtitle}
                            </p>
                            <h2
                                className="text-3xl md:text-5xl text-[#212A2C] mb-6"
                                style={{ fontFamily: "Source Serif 4, Georgia, serif", fontWeight: 300 }}
                            >
                                {mat.title}
                            </h2>
                            <p className="text-[15px] md:text-[16px] text-[#555] leading-relaxed mb-10">
                                {mat.description}
                            </p>
                            <div className="w-[40px] h-[1px] bg-[#212A2C] mb-8"></div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Bottom CTA */}
            <section className="bg-[#212A2C] text-white py-24 px-6 text-center">
                <h3
                    className="text-3xl md:text-4xl mb-6"
                    style={{ fontFamily: "Source Serif 4, Georgia, serif", fontWeight: 300 }}
                >
                    Ready to Feel the Difference?
                </h3>
                <Link
                    to="/shop"
                    className="inline-block mt-4 px-10 py-4 bg-white text-[#212A2C] text-[12px] font-bold uppercase tracking-[0.15em] hover:bg-[#F5F5F2] transition-colors shadow-lg"
                >
                    Shop All Men & Women
                </Link>
            </section>

        </motion.div>
    );
};

export default MaterialsPage;
