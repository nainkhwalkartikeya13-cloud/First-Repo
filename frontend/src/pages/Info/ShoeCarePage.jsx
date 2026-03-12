import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ShoeCarePage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white"
        >
            {/* Hero */}
            <section className="bg-gradient-to-b from-[#F5F5F2] to-white pt-24 pb-20 px-6 text-center">
                <h1
                    className="text-[#212A2C] text-4xl md:text-5xl lg:text-5xl mb-6"
                    style={{ fontFamily: "Source Serif 4, Georgia, serif", fontWeight: 300 }}
                >
                    How To Keep Your Shoes Fresh
                </h1>
                <p className="text-[15px] md:text-[16px] text-[#555] max-w-xl mx-auto leading-relaxed">
                    Our shoes are made from natural materials designed for long-lasting comfort. By following these simple steps, you can extend their life and keep them looking brand new.
                </p>
            </section>

            {/* Grid Guide */}
            <section className="max-w-[1100px] mx-auto px-6 md:px-10 py-16 lg:py-24">

                {/* Step 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center mb-20 md:mb-32">
                    <div className="aspect-[4/3] bg-[#E8E8E3] rounded-lg overflow-hidden flex items-center justify-center p-10">
                        {/* Visual Placeholder for Removing Laces */}
                        <div className="w-full h-full border-2 border-dashed border-[#BDBDBD] rounded-md flex items-center justify-center text-[13px] text-[#999] uppercase tracking-widest font-bold">
                            Remove Laces & Insoles
                        </div>
                    </div>
                    <div>
                        <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#2D5233] mb-3 block">
                            Step 1
                        </span>
                        <h2
                            className="text-[#212A2C] text-3xl mb-5"
                            style={{ fontFamily: "Source Serif 4, Georgia, serif" }}
                        >
                            Prep for the Wash
                        </h2>
                        <p className="text-[15px] text-[#555] leading-relaxed mb-6">
                            Before tossing your shoes into the washing machine, make sure to remove both the laces and the cushioned insoles. Doing so ensures a more thorough clean and prevents the laces from getting tangled.
                        </p>
                        <p className="text-[14px] text-[#767676] bg-[#F9F9F8] p-4 border-l-2 border-[#2D5233]">
                            <strong>Pro Tip:</strong> You can wash the laces by placing them inside a small delicates bag. Insoles should be hand-washed separately and laid flat to dry.
                        </p>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center mb-20 md:mb-32 md:flex-row-reverse">
                    <div className="md:order-last aspect-[4/3] bg-[#E8E8E3] rounded-lg overflow-hidden flex items-center justify-center p-10">
                        {/* Visual Placeholder for Washing */}
                        <div className="w-full h-full border-2 border-dashed border-[#BDBDBD] rounded-md flex items-center justify-center text-[13px] text-[#999] uppercase tracking-widest font-bold">
                            Gentle Cycle Only
                        </div>
                    </div>
                    <div>
                        <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#2D5233] mb-3 block">
                            Step 2
                        </span>
                        <h2
                            className="text-[#212A2C] text-3xl mb-5"
                            style={{ fontFamily: "Source Serif 4, Georgia, serif" }}
                        >
                            Machine Wash Cold
                        </h2>
                        <p className="text-[15px] text-[#555] leading-relaxed mb-6">
                            Place the shoes in a delicates bag or a pillowcase. Set your washing machine to a gentle or delicate cycle with cold water. We recommend using a mild, bleach-free detergent to protect the natural fibers.
                        </p>
                        <p className="text-[14px] text-[#767676] bg-[#F9F9F8] p-4 border-l-2 border-[#BC4749]">
                            <strong>Warning:</strong> Never use hot water or heavy spin cycles, as this can severely damage the wool or tree fibers and alter the shape of the shoe.
                        </p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
                    <div className="aspect-[4/3] bg-[#E8E8E3] rounded-lg overflow-hidden flex items-center justify-center p-10">
                        {/* Visual Placeholder for Drying */}
                        <div className="w-full h-full border-2 border-dashed border-[#BDBDBD] rounded-md flex items-center justify-center text-[13px] text-[#999] uppercase tracking-widest font-bold">
                            Air Dry
                        </div>
                    </div>
                    <div>
                        <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#2D5233] mb-3 block">
                            Step 3
                        </span>
                        <h2
                            className="text-[#212A2C] text-3xl mb-5"
                            style={{ fontFamily: "Source Serif 4, Georgia, serif" }}
                        >
                            Air Dry Completely
                        </h2>
                        <p className="text-[15px] text-[#555] leading-relaxed mb-6">
                            Remove your shoes from the washing machine and shake off any excess water. Let them air dry in a well-ventilated area for at least 24 hours. Once completely dry, re-insert your clean insoles and lace them back up.
                        </p>
                        <p className="text-[14px] text-[#767676] bg-[#F9F9F8] p-4 border-l-2 border-[#BC4749]">
                            <strong>Warning:</strong> Absolutely no tumble drying! Heat from a dryer will shrink and warp the natural materials instantly.
                        </p>
                    </div>
                </div>

            </section>

            {/* Fresh Pair CTA */}
            <section className="bg-[#212A2C] py-24 text-center px-6">
                <h2
                    className="text-white text-3xl md:text-5xl mb-6"
                    style={{ fontFamily: "Source Serif 4, Georgia, serif", fontWeight: 300 }}
                >
                    Time for a fresh pair?
                </h2>
                <p className="text-[15px] text-[#BDBDBD] max-w-lg mx-auto mb-10">
                    Some stains are stubborn, and after miles of walking, it might be time to treat yourself to a new everyday staple.
                </p>
                <Link
                    to="/shop"
                    className="inline-block px-10 py-4 bg-white text-[#212A2C] text-[12px] font-bold uppercase tracking-[0.15em] hover:bg-gray-100 transition-colors rounded-sm"
                >
                    Shop New Arrivals
                </Link>
            </section>
        </motion.div>
    );
};

export default ShoeCarePage;
