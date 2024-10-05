'use client';
import { AppHero } from '../ui/ui-layout';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import heroImage from '@/public/hero.svg'
import { useEffect, useState } from 'react';

export default function DashboardFeature() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full  flex flex-col text-white "> 
      <AppHero
        title={
          <h1 className={`text-6xl font-extrabold text-emerald-400 mb-8 ${isVisible ? 'opacity-100 translate-y-0 transition-all duration-500' : 'opacity-0 translate-y-[-50px]'}`}>
            PokSol
          </h1>
        }
        subtitle={
          <p className={`text-2xl italic ${isVisible ? 'opacity-100 transition-all duration-500 delay-200' : 'opacity-0'}`}>
            "Quiz your poker skills and track your results on the blockchain"
          </p>
        }
      />

      <div className={`flex justify-center mt-8 ${isVisible ? 'opacity-100 scale-100 transition-all duration-500 delay-400' : 'opacity-0 scale-80'}`}>
        <Image
          src={heroImage}
          alt="Poker quiz illustration"
          className="w-1/2 h-1/3 mx-auto rounded-lg" 
        />
      </div>


      <div className="container mx-auto px-6 py-12 my-24 flex-grow"> 
        <section className={`mb-16 text-center ${isVisible ? 'opacity-100 translate-y-0 transition-all duration-500 delay-600' : 'opacity-0 translate-y-[50px]'}`}>
          <h2 className="text-5xl font-extrabold mb-6 text-emerald-400">Our Vision</h2>
          <p className="text-2xl leading-relaxed max-w-3xl mx-auto">
            We're dedicated to enhancing poker skills through engaging quizzes while leveraging the transparency of blockchain technology.
          </p>
        </section>

        <section className={`mb-16 mt-32 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-5xl font-extrabold mb-12 text-center text-emerald-400">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "1. Take the Quiz", description: "Connect your wallet to take the quiz and earn tokens and points." },
              { title: "2. Save Your Results", description: "Results are securely stored on the Solana blockchain." },
              { title: "3. Improve Your Skills", description: "Track your progress and enhance your poker abilities." }
            ].map((step, index) => (
              <div key={index} className="p-8 text-lg rounded-xl shadow-xl bg-emerald-200 bg-opacity-30 backdrop-filter backdrop-blur-lg">
                <h3 className="text-2xl font-semibold mb-4 underline underline-offset-4 decoration-emerald-400 font-extrabold">{step.title}</h3>
                <p className="font-bold text-xl">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={`text-center mt-32 ${isVisible ? 'opacity-100 translate-y-0 transition-all duration-500 delay-800' : 'opacity-0 translate-y-[50px]'}`}>
          <h2 className="text-5xl font-extrabold mb-12 text-emerald-400">Take the Quiz</h2>
          <button
            className="bg-emerald-600 text-white text-xl px-10 py-4 rounded-full hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => router.push('/game')}
          >
            Play Now
          </button>
        </section>
      </div>
    </div>
  );
}
