/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { MapPin, Music, Utensils, Users, Heart, Instagram, Facebook, Phone, Calendar, Clock, X, ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useMemo, FormEvent } from "react";

const BookingModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const timeSlots = useMemo(() => {
    if (!date) return [];
    const day = new Date(date).getDay(); // 0 is Sunday, 1 is Monday...
    
    // Mon-Thu: 19:00 - 00:00
    // Fri-Sat: 19:00 - 01:30
    // Sun: 12:30 - 15:00 | 19:00 - 00:00
    
    const slots = [];
    if (day === 0) { // Sunday
      slots.push("12:30", "13:00", "13:30", "14:00", "14:30");
    }
    
    slots.push("19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00");
    
    if (day === 5 || day === 6) { // Fri-Sat
      slots.push("23:30", "00:00", "00:30");
    }
    
    return slots;
  }, [date]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-tavern-brown/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-tavern-cream w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden border border-tavern-gold/20"
        >
          {/* Header */}
          <div className="p-6 border-b border-tavern-gold/10 flex items-center justify-between bg-white">
            <h3 className="text-2xl font-serif font-bold text-tavern-brown">Prenota un Tavolo</h3>
            <button onClick={onClose} className="p-2 hover:bg-tavern-gold/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-8">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-tavern-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="text-tavern-gold w-10 h-10" />
                </div>
                <h4 className="text-3xl font-serif font-bold mb-4">Prenotazione Inviata!</h4>
                <p className="text-tavern-brown/70 mb-8">Grazie {name}, ti abbiamo inviato una conferma. Ti aspettiamo alla Taverna!</p>
                <button 
                  onClick={onClose}
                  className="w-full bg-tavern-brown text-tavern-cream py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-tavern-gold transition-all"
                >
                  Chiudi
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-tavern-gold flex items-center gap-2">
                        <Calendar size={14} /> Data della visita
                      </label>
                      <input 
                        type="date" 
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-white border border-tavern-gold/20 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-tavern-gold/50 transition-all font-sans"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-tavern-gold flex items-center gap-2">
                        <Clock size={14} /> Orario disponibile
                      </label>
                      <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
                        {date ? (
                          timeSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTime(slot)}
                              className={`p-3 rounded-xl text-sm font-medium transition-all border ${
                                time === slot 
                                  ? "bg-tavern-gold text-white border-tavern-gold shadow-md" 
                                  : "bg-white border-tavern-gold/10 hover:border-tavern-gold/40"
                              }`}
                            >
                              {slot}
                            </button>
                          ))
                        ) : (
                          <p className="col-span-3 text-sm text-tavern-brown/40 italic text-center py-4">Seleziona prima una data</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-tavern-gold flex items-center gap-2">
                        <Users size={14} /> Numero di persone
                      </label>
                      <div className="flex items-center justify-between bg-white border border-tavern-gold/20 p-2 rounded-2xl">
                        <button 
                          type="button"
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          className="w-12 h-12 flex items-center justify-center hover:bg-tavern-gold/10 rounded-xl transition-colors"
                        >
                          -
                        </button>
                        <span className="text-xl font-bold">{guests}</span>
                        <button 
                          type="button"
                          onClick={() => setGuests(guests + 1)}
                          className="w-12 h-12 flex items-center justify-center hover:bg-tavern-gold/10 rounded-xl transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button 
                      type="button"
                      disabled={!date || !time}
                      onClick={() => setStep(2)}
                      className="w-full bg-tavern-brown text-tavern-cream py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-tavern-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Continua <ChevronRight size={18} />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-tavern-gold">Nome e Cognome</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Es. Mario Rossi"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-tavern-gold/20 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-tavern-gold/50 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-tavern-gold">Telefono o Email</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Per la conferma"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="w-full bg-white border border-tavern-gold/20 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-tavern-gold/50 transition-all"
                      />
                    </div>

                    <div className="bg-tavern-gold/5 p-4 rounded-2xl border border-tavern-gold/10 text-sm">
                      <p className="flex justify-between mb-1"><span>Data:</span> <span className="font-bold">{new Date(date).toLocaleDateString('it-IT')}</span></p>
                      <p className="flex justify-between mb-1"><span>Orario:</span> <span className="font-bold">{time}</span></p>
                      <p className="flex justify-between"><span>Persone:</span> <span className="font-bold">{guests}</span></p>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 border border-tavern-gold/30 text-tavern-brown py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-tavern-gold/10 transition-all flex items-center justify-center gap-2"
                      >
                        <ChevronLeft size={18} /> Indietro
                      </button>
                      <button 
                        type="submit"
                        disabled={isSubmitting || !name || !contact}
                        className="flex-[2] bg-tavern-brown text-tavern-cream py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-tavern-gold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? "Invio in corso..." : "Conferma Prenotazione"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const TeamMember = ({ name, role, description, imageUrl }: { name: string; role: string; description?: string; imageUrl?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex flex-col items-center p-6 text-center"
  >
    <div className="w-32 h-32 rounded-full bg-tavern-gold/20 mb-4 flex items-center justify-center border-2 border-tavern-gold/30 overflow-hidden shadow-inner">
       {imageUrl ? (
         <img 
           src={imageUrl} 
           alt={name} 
           className="w-full h-full object-cover"
           referrerPolicy="no-referrer"
         />
       ) : (
         <Users className="w-12 h-12 text-tavern-gold" />
       )}
    </div>
    <h3 className="text-2xl font-serif font-bold text-tavern-brown">{name}</h3>
    <p className="text-tavern-gold font-medium uppercase tracking-wider text-sm mb-2">{role}</p>
    {description && <p className="text-tavern-brown/70 italic">{description}</p>}
  </motion.div>
);

const Mascot = ({ name, type, icon: Icon }: { name: string; type: string; icon: any }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="bg-white/50 p-6 rounded-3xl border border-tavern-gold/20 flex items-center gap-4 shadow-sm"
  >
    <div className="bg-tavern-gold text-white p-3 rounded-2xl">
      <Icon size={24} />
    </div>
    <div>
      <h4 className="text-xl font-serif font-bold">{name}</h4>
      <p className="text-sm text-tavern-brown/60 uppercase tracking-widest">{type}</p>
    </div>
  </motion.div>
);

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen selection:bg-tavern-gold selection:text-white">
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-tavern-cream/80 backdrop-blur-md border-b border-tavern-gold/10">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="text-3xl font-serif font-bold tracking-tighter text-tavern-brown">
            Taverna <span className="text-tavern-gold italic">di</span> Fred
          </h1>
          <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest">
            <a href="#chi-siamo" className="hover:text-tavern-gold transition-colors">Chi Siamo</a>
            <a href="#mascotte" className="hover:text-tavern-gold transition-colors">Mascotte</a>
            <a href="#contatti" className="hover:text-tavern-gold transition-colors">Contatti</a>
          </div>
          <button 
            onClick={() => setIsBookingOpen(true)}
            className="bg-tavern-brown text-tavern-cream px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-tavern-gold transition-all shadow-lg"
          >
            Prenota
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop" 
            alt="Taverna Interior" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-tavern-cream/0 via-tavern-cream/50 to-tavern-cream" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 bg-tavern-gold/10 text-tavern-gold rounded-full text-xs font-bold uppercase tracking-[0.3em] mb-6">
              Dal cuore di Prato
            </span>
            <h2 className="text-6xl md:text-8xl font-serif font-bold leading-tight mb-8">
              Sapori Autentici, <br />
              <span className="italic text-tavern-gold">Atmosfera di Casa.</span>
            </h2>
            <p className="text-lg md:text-xl text-tavern-brown/80 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              Benvenuti alla Taverna di Fred. Un luogo dove la tradizione culinaria incontra la buona musica e l'accoglienza più sincera.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="bg-tavern-brown text-tavern-cream px-10 py-4 rounded-full text-lg font-bold uppercase tracking-widest hover:bg-tavern-gold transition-all shadow-xl"
              >
                Prenota un Tavolo
              </button>
              <a href="#chi-siamo" className="flex items-center gap-2 text-tavern-brown font-bold border-b-2 border-tavern-gold pb-1 hover:text-tavern-gold transition-all">
                Scopri la nostra storia <Utensils size={18} />
              </a>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-tavern-gold/50"
        >
          <div className="w-px h-12 bg-tavern-gold/30 mx-auto mb-2" />
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        </motion.div>
      </header>

      {/* Chi Siamo Section */}
      <section id="chi-siamo" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Il Nostro Team</h2>
            <div className="w-20 h-1 bg-tavern-gold mx-auto" />
            <p className="mt-6 text-tavern-brown/60 max-w-xl mx-auto">
              Le persone che ogni giorno rendono unica l'esperienza alla Taverna di Fred.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <TeamMember name="Giulio" role="Titolare" description="L'anima e il fondatore della taverna." />
            <TeamMember name="Elena" role="Vice Proprietaria" description="Il braccio destro che coordina ogni dettaglio." />
            <TeamMember name="Giovanni" role="Pizzaiolo" description="Maestro degli impasti e della tradizione." />
            <TeamMember name="Paolo Vitellozzi" role="Chitarrista" description="Colui che dà voce alle nostre serate." imageUrl="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop" />
          </div>
        </div>
      </section>

      {/* Mascotte Section */}
      <section id="mascotte" className="py-24 px-6 bg-tavern-gold/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-tavern-gold font-bold uppercase tracking-widest text-xs">I nostri amici</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mt-4 mb-6">Le Mascotte della Taverna</h2>
              <p className="text-tavern-brown/70 text-lg mb-8 leading-relaxed">
                Non saremmo gli stessi senza Lea e Spillo. Sono loro ad accogliervi con un colpo di coda o una fusa appena varcata la soglia. La Taverna di Fred è un luogo pet-friendly dove ogni animale è il benvenuto.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Mascot name="Lea" type="Il nostro Cane" icon={Heart} />
                <Mascot name="Spillo" type="Il nostro Gatto" icon={Heart} />
              </div>
            </div>
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-tavern-gold/10 rounded-[40px] rotate-3" />
              <img 
                src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=2071&auto=format&fit=crop" 
                alt="Pets at Tavern" 
                className="relative z-10 w-full h-full object-cover rounded-[40px] shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Dalla Cucina</h2>
            <div className="w-20 h-1 bg-tavern-gold mx-auto" />
            <p className="mt-6 text-tavern-brown/60">I grandi classici della tradizione pratese e non solo.</p>
          </div>

          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-serif font-bold border-b border-tavern-gold/20 pb-2 mb-6 italic">Primi Piatti</h3>
                <ul className="space-y-6">
                  <li className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">Pappa al Pomodoro</h4>
                      <p className="text-sm text-tavern-brown/60">Pane toscano, pomodoro, basilico e olio bono.</p>
                    </div>
                    <span className="font-serif font-bold text-tavern-gold">€10</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">Tortelli di Patate</h4>
                      <p className="text-sm text-tavern-brown/60">Fatti in casa con ragù di carne chianina.</p>
                    </div>
                    <span className="font-serif font-bold text-tavern-gold">€14</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold border-b border-tavern-gold/20 pb-2 mb-6 italic">Specialità</h3>
                <ul className="space-y-6">
                  <li className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">Pizza del Pizzaiolo Giovanni</h4>
                      <p className="text-sm text-tavern-brown/60">Lunga lievitazione con ingredienti di stagione.</p>
                    </div>
                    <span className="font-serif font-bold text-tavern-gold">€12</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">Cantucci di Prato e Vin Santo</h4>
                      <p className="text-sm text-tavern-brown/60">Il fine pasto per eccellenza della nostra città.</p>
                    </div>
                    <span className="font-serif font-bold text-tavern-gold">€8</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Music Banner */}
      <section className="py-20 bg-tavern-brown text-tavern-cream overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10">
          <Music size={400} />
        </div>
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <Music className="mx-auto mb-6 text-tavern-gold" size={48} />
          <h2 className="text-3xl md:text-5xl font-serif italic mb-6">"La musica è il vino che riempie la coppa del silenzio."</h2>
          <p className="text-tavern-gold font-bold uppercase tracking-[0.2em]">Ogni sera con Paolo Vitellozzi</p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contatti" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-serif font-bold mb-8">Vieni a trovarci</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="bg-tavern-gold/10 p-3 rounded-xl h-fit">
                    <MapPin className="text-tavern-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Indirizzo</h4>
                    <p className="text-tavern-brown/70">Via Vittorio Emanuele Orlando, Prato (PO)</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-tavern-gold/10 p-3 rounded-xl h-fit">
                    <Phone className="text-tavern-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Telefono</h4>
                    <p className="text-tavern-brown/70">+39 0574 123456</p>
                  </div>
                </div>
                <div className="flex gap-6 pt-4">
                  <a href="#" className="text-tavern-brown hover:text-tavern-gold transition-colors"><Instagram size={24} /></a>
                  <a href="#" className="text-tavern-brown hover:text-tavern-gold transition-colors"><Facebook size={24} /></a>
                </div>
              </div>
            </div>
            <div className="bg-tavern-cream p-8 rounded-3xl border border-tavern-gold/10">
              <h3 className="text-2xl font-serif font-bold mb-6">Orari di Apertura</h3>
              <ul className="space-y-4">
                <li className="flex justify-between border-b border-tavern-gold/10 pb-2">
                  <span>Lunedì - Giovedì</span>
                  <span className="font-bold text-tavern-gold">19:00 - 00:00</span>
                </li>
                <li className="flex justify-between border-b border-tavern-gold/10 pb-2">
                  <span>Venerdì - Sabato</span>
                  <span className="font-bold text-tavern-gold">19:00 - 01:30</span>
                </li>
                <li className="flex justify-between border-b border-tavern-gold/10 pb-2">
                  <span>Domenica</span>
                  <span className="font-bold text-tavern-gold">12:30 - 15:00 | 19:00 - 00:00</span>
                </li>
              </ul>
              <p className="mt-8 text-sm text-tavern-brown/50 italic">
                * Si consiglia la prenotazione, specialmente nei weekend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-tavern-gold/10 text-center text-sm text-tavern-brown/40 uppercase tracking-widest">
        <p>&copy; {new Date().getFullYear()} Taverna di Fred - Prato. Tutti i diritti riservati.</p>
      </footer>
    </div>
  );
}
