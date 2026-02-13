import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Recycle, Sparkles, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import "./landing.css";

const heroLetters = "THRIFTIT".split("");

const featureCards = [
  {
    title: "Circular Fashion",
    description: "Pre-loved drops that stay in motion, not in landfills.",
    icon: Recycle,
  },
  {
    title: "Impact Visible",
    description: "Every listing highlights the climate value behind your purchase.",
    icon: Leaf,
  },
  {
    title: "Curated Finds",
    description: "Unique pieces from real closets, selected for quality and style.",
    icon: Sparkles,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 130, damping: 16 },
  },
};

const LandingPage = () => {
  const markSellerIntent = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("sellerEntryIntent", "true");
    }
  };
  const markBuyerIntent = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("sellerEntryIntent");
      window.localStorage.setItem("userMode", "buyer");
    }
  };

  return (
    <div className="landing-shell">
      <div className="landing-grain" />

      <section className="landing-hero">
        <motion.div
          className="landing-badge"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Waves className="w-4 h-4" />
          <span>Future of Thrift Commerce</span>
        </motion.div>

        <motion.h1 className="landing-title" variants={container} initial="hidden" animate="show">
          {heroLetters.map((letter, index) => (
            <motion.span key={`${letter}-${index}`} variants={item}>
              {letter}
            </motion.span>
          ))}
        </motion.h1>

        <motion.h2
          className="landing-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          Shop with sustainability.
        </motion.h2>

        <motion.p
          className="landing-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
        >
          THRIFTIT connects conscious buyers and sellers through a living marketplace of quality
          pre-loved fashion.
        </motion.p>

        <motion.div
          className="landing-actions"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.65 }}
        >
          <Link to="/home" className="landing-btn-primary" onClick={markBuyerIntent}>
            Start Exploring <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/seller-registration" className="landing-btn-secondary" onClick={markSellerIntent}>
            Become a Seller
          </Link>
        </motion.div>
      </section>

      <section className="landing-metrics">
        <motion.div
          className="landing-marquee"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
        >
          <span>Carbon Saved</span>
          <span>Water Conserved</span>
          <span>Closet Circularity</span>
          <span>Ethical Shopping</span>
          <span>Carbon Saved</span>
          <span>Water Conserved</span>
          <span>Closet Circularity</span>
          <span>Ethical Shopping</span>
        </motion.div>
      </section>

      <section className="landing-features">
        {featureCards.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.article
              key={feature.title}
              className="landing-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.12, duration: 0.6 }}
              whileHover={{ y: -8, rotateX: 3, rotateY: -3 }}
            >
              <div className="landing-card-icon">
                <Icon className="w-5 h-5" />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.article>
          );
        })}
      </section>
    </div>
  );
};

export default LandingPage;
