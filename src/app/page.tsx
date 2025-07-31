"use client";
import React, { useState, useEffect } from "react";
import {
  Pen,
  Users,
  Play,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  MousePointer,
  Layers,
  Share2,
} from "lucide-react";
import Link from "next/link";

const WhiteboardLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Pen,
      title: "Intuitive Drawing",
      desc: "Natural pen-like experience",
    },
    {
      icon: Users,
      title: "Real-time Collaboration",
      desc: "Work together seamlessly",
    },
    {
      icon: Layers,
      title: "Infinite Canvas",
      desc: "Unlimited creative space",
    },
    { icon: Share2, title: "Instant Sharing", desc: "Share with one click" },
  ];

  const FloatingShape = ({ delay = 0, duration = 6 }) => (
    <div
      className="absolute animate-pulse opacity-20"
      style={{
        animation: `float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full blur-sm"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(75, 85, 99, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(75, 85, 99, 0.5);
          }
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingShape delay={0} />
        <FloatingShape delay={1} />
        <FloatingShape delay={2} />
      </div>

      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrollY > 50
            ? "bg-gray-900/80 backdrop-blur-md border-b border-gray-600/20"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg animate-glow"></div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-200 to-gray-300 bg-clip-text text-transparent">
                WhiteBoard
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="hover:text-gray-300 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="hover:text-gray-300 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="hover:text-gray-300 transition-colors"
              >
                About
              </a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                href={"/auth/signin"}
                className="px-4 py-2 hover:text-gray-300 transition-colors"
              >
                Sign In
              </Link>
              <Link href={"/auth/signup"} className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105">
                Get Started
              </Link>
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-md z-40 md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <a
              href="#features"
              className="text-2xl hover:text-gray-300 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-2xl hover:text-gray-300 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-2xl hover:text-gray-300 transition-colors"
            >
              About
            </a>
            <button className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full text-lg">
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
              Create & Collaborate
              <br />
              <span className="text-4xl md:text-6xl">Without Limits</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              The most intuitive whiteboarding experience. Draw, brainstorm, and
              collaborate in real-time with your team from anywhere in the
              world.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full text-lg font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
              <Play size={20} />
              <span>Try It Free</span>
            </button>
            <button className="px-8 py-4 border-2 border-gray-500 rounded-full text-lg font-semibold hover:bg-gray-500 hover:text-gray-900 transition-all duration-300 flex items-center justify-center space-x-2">
              <span>Learn More</span>
            </button>
          </div>

          {/* Demo Canvas Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-8 border border-gray-600/20 animate-glow">
              <div className="bg-white rounded-lg h-64 md:h-80 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100">
                  {/* Animated drawing elements */}
                  <svg className="absolute inset-0 w-full h-full">
                    <path
                      d="M50 100 Q 150 50 250 100 T 450 100"
                      stroke="#6b7280"
                      strokeWidth="3"
                      fill="none"
                      className="animate-pulse"
                    />
                    <circle
                      cx="100"
                      cy="150"
                      r="30"
                      fill="#9ca3af"
                      opacity="0.7"
                      className="animate-pulse"
                    />
                    <rect
                      x="300"
                      y="120"
                      width="80"
                      height="60"
                      fill="#4b5563"
                      opacity="0.7"
                      rx="8"
                      className="animate-pulse"
                    />
                  </svg>

                  {/* Floating cursor */}
                  <div
                    className="absolute transition-all duration-1000"
                    style={{
                      left: `${20 + currentFeature * 20}%`,
                      top: `${30 + currentFeature * 15}%`,
                    }}
                  >
                    <MousePointer className="text-gray-600" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-200 to-gray-300 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to bring your ideas to life and collaborate
              effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl transition-all duration-500 transform hover:scale-105 ${
                  currentFeature === index
                    ? "bg-gradient-to-br from-gray-700/30 to-gray-600/30 border-2 border-gray-500"
                    : "bg-gray-800/50 border border-gray-700 hover:border-gray-500"
                }`}
              >
                <div className="mb-4">
                  <feature.icon className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gray-800/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-gray-200 to-gray-300 bg-clip-text text-transparent">
                100K+
              </div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-gray-200 to-gray-300 bg-clip-text text-transparent">
                1M+
              </div>
              <div className="text-gray-400">Boards Created</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-gray-200 to-gray-300 bg-clip-text text-transparent">
                99.9%
              </div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Ideas?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of teams already using WhiteBoard to bring their
              visions to life.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full text-lg font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto">
              <span>Start Creating Today</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg"></div>
              <span className="text-xl font-bold">WhiteBoard</span>
            </div>
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-gray-300 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2025 WhiteBoard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WhiteboardLanding;
