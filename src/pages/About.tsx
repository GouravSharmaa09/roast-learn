import { Flame, Code2, Brain, Trophy, Users, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogoClick={() => {}} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 px-4 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[100px]" />
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center animate-float">
                <Flame className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
              <span className="text-foreground">Roast</span>
              <span className="text-primary">My</span>
              <span className="text-foreground">Code</span>
            </h1>
            
            <p className="text-xl text-gradient-fire font-semibold mb-4">
              Seekh Le Bhai, Mushkil Tarike Se 🔥
            </p>
            
            <p className="text-muted-foreground text-lg leading-relaxed">
              Ye app developers ke liye hai jo apni coding skills improve karna chahte hain - 
              but thoda mazze ke saath. Yahan tera code roast hoga, tu hasega, sharmayega, 
              aur phir actually seekhega bhi.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Hum Kya Karte Hain? 🤔
            </h2>
            
            <div className="space-y-4">
              <FeatureCard
                icon={<Flame className="w-6 h-6 text-primary" />}
                title="Brutal Roast 🔥"
                description="Tera code dekh ke hum itna roast karenge ki tu sochega 'maine ye kya likh diya'. Thodi gaali, thoda mazak, bahut sara learning."
              />
              <FeatureCard
                icon={<Brain className="w-6 h-6 text-primary" />}
                title="Deep Explanation 🧠"
                description="Sirf roast nahi, samjhate bhi hain. Kyun galti hui, kya problem hai, production mein kya hoga - sab batayenge Hinglish mein."
              />
              <FeatureCard
                icon={<Code2 className="w-6 h-6 text-primary" />}
                title="Sahi Code ✨"
                description="Ganda code ke baad sahi code bhi denge. Step-by-step fix, proper comments, aur ek golden rule jo zindagi bhar yaad rahega."
              />
              <FeatureCard
                icon={<Trophy className="w-6 h-6 text-primary" />}
                title="Quiz Time 📝"
                description="Seekha ya nahi, ye prove karna padega. Quick MCQs aur mini practice problem se test hoga tera."
              />
            </div>
          </div>
        </section>

        {/* Why Hinglish */}
        <section className="py-12 px-4 bg-card/30">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Hinglish Mein Kyun? 🇮🇳
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Dekh bhai, English documentation padhte padhte so jaate hain log. 
              Lekin jab apni bhasha mein samjhao, toh dimag mein jaldi ghusta hai. 
              Isliye humne Hinglish choose kiya - <span className="text-primary font-semibold">relatable, funny, aur memorable</span>.
            </p>
            <p className="text-muted-foreground">
              Plus, jab thoda roast hota hai toh motivation alag level pe hoti hai seekhne ki 😈
            </p>
          </div>
        </section>

        {/* Target Audience */}
        <section className="py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Ye App Kiske Liye Hai? 👨‍💻
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AudienceCard
                emoji="🌱"
                title="Beginners"
                description="Jo coding seekh rahe hain aur basics mein galti kar rahe hain"
              />
              <AudienceCard
                emoji="📚"
                title="Students"
                description="College projects mein jo code paste karte hain bina samjhe"
              />
              <AudienceCard
                emoji="💼"
                title="Working Devs"
                description="Jo apne old code dekh ke cringe karte hain"
              />
              <AudienceCard
                emoji="🎯"
                title="Interview Prep"
                description="Jo coding interview ke liye practice kar rahe hain"
              />
            </div>
          </div>
        </section>

        {/* Supported Languages */}
        <section className="py-12 px-4 bg-card/30">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">
              Supported Languages 🌐
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              <LanguageBadge icon="🟨" name="JavaScript" />
              <LanguageBadge icon="🐍" name="Python" />
              <LanguageBadge icon="⚡" name="C++" />
              <LanguageBadge icon="☕" name="Java" />
            </div>
            <p className="text-muted-foreground mt-4">
              Aur languages jaldi aa rahe hain... 🚀
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Taiyaar Hai Roast Ke Liye? 🔥
            </h2>
            <p className="text-muted-foreground mb-6">
              Himmat hai toh apna code daal aur dekh kya hota hai
            </p>
            <Link to="/">
              <Button variant="hero" size="xl" className="w-full">
                <Flame className="w-6 h-6" />
                Roast Karo Mera Code
              </Button>
            </Link>
          </div>
        </section>

        {/* Credits */}
        <section className="py-8 px-4 border-t border-border/50">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              Made with <Heart className="w-4 h-4 text-destructive fill-destructive" /> by developers, for developers
            </p>
            <p className="text-sm text-muted-foreground/60 mt-2">
              Powered by AI + Desi Humor 😎
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4 p-4 bg-card/50 border border-border/50 rounded-2xl">
      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function AudienceCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="p-4 bg-card/50 border border-border/50 rounded-2xl text-center">
      <div className="text-3xl mb-2">{emoji}</div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function LanguageBadge({ icon, name }: { icon: string; name: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
      <span className="text-xl">{icon}</span>
      <span className="font-medium text-foreground">{name}</span>
    </div>
  );
}

export default About;
