import React from 'react';
import { Leaf, Instagram, Twitter, Facebook } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-sproutly-forest text-sproutly-cream py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="w-6 h-6 text-sproutly-sage" />
              <span className="font-serif text-2xl font-semibold tracking-tight">
                Sproutly
              </span>
            </div>
            <p className="text-sproutly-cream/70 max-w-sm mb-8">
              Helping every plant — indoor, balcony, terrace, or garden —
              thrive, without the stress or the spreadsheets.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-sproutly-cream/50 hover:text-sproutly-cream transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-sproutly-cream/50 hover:text-sproutly-cream transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-sproutly-cream/50 hover:text-sproutly-cream transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-sproutly-cream/70">
              <li>
                <a
                  href="#features"
                  className="hover:text-sproutly-cream transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#ai"
                  className="hover:text-sproutly-cream transition-colors"
                >
                  AI Botanist
                </a>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-sproutly-cream transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-sproutly-cream/70">
              <li>
                <Link
                  href="/guides"
                  className="hover:text-sproutly-cream transition-colors"
                >
                  Plant Guides
                </Link>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="hover:text-sproutly-cream transition-colors"
                >
                  Help Center
                </a>
              </li> */}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-sproutly-cream/70">
              <li>
                <a
                  href="#"
                  className="hover:text-sproutly-cream transition-colors"
                >
                  About Us
                </a>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="hover:text-sproutly-cream transition-colors"
                >
                  Careers
                </a>
              </li> */}
              <li>
                <a
                  href="#"
                  className="hover:text-sproutly-cream transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-sproutly-cream/10 text-sm text-sproutly-cream/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            &copy; {new Date().getFullYear()} Sproutly Inc. All rights reserved.
          </p>
          <p>Designed with &hearts; for plant lovers.</p>
        </div>
      </div>
    </footer>
  );
}
