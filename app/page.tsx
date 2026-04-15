import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import Navbar from "@/components/Navbar";
import RevealOnScroll from "@/components/RevealOnScroll";

const eventCards = [
  {
    title: "Lunchs d'entreprise",
    text: "Un vrai service barbecue en plein milieu de votre journée, avec une remorque compacte qui s'installe vite et garde une allure premium.",
    image: "/images/lunch.webp",
  },
  {
    title: "Anniversaires adultes",
    text: "Une ambiance qui sent le feu, la braise et les bons délires. Vous profitez de vos invités, on gère la cuisine, le rythme et la chaleur autour du spot.",
    image: "/images/birthday.webp",
  },
  {
    title: "Soirées & afterworks",
    text: "Guirlandes cosy, fumée légère, service en direct et une présence qui transforme la cour, le jardin ou le parking en vraie scène food.",
    image: "/images/setup.webp",
  },
];

const promiseCards = [
  {
    number: "01",
    title: "Une remorque qui passe partout",
    text: "Pouet Pouet n'est pas un van reconditionné. C'est une remorque foodtruck pensée pour se poser proprement là où l'événement se vit vraiment.",
  },
  {
    number: "02",
    title: "Quatre passionnés aux commandes",
    text: "On vient avec la cuisine, le feu, le sens du timing et la bonne énergie. L'idée n'est pas juste de nourrir, mais d'installer un vrai moment.",
  },
  {
    number: "03",
    title: "Vous profitez, on régale",
    text: "Installation, service, rythme, nettoyage. On absorbe l'opérationnel pour que vous restiez disponible pour vos invités et votre événement.",
  },
];

const metrics = [
  { value: "4", label: "passionnés derrière la remorque" },
  { value: "Midi", label: "ou soirée, on s'adapte au tempo" },
  { value: "B2B", label: "comme anniversaires adultes" },
];

const steps = [
  {
    title: "On cadre le format",
    text: "On parle nombre d'invités, lieu, timing, ambiance et contraintes d'accès pour que la remorque arrive déjà au bon format.",
  },
  {
    title: "On pose le spot",
    text: "On installe la remorque, la zone de cuisson et la lumière d'ambiance pour créer un point de ralliement élégant, pas un coin catering bricolé.",
  },
  {
    title: "On lance le feu",
    text: "Barbecue, cuisson minute, circulation fluide, service attentif. Le coeur de l'événement bat autour du comptoir et de la braise.",
  },
  {
    title: "On remballe proprement",
    text: "On laisse le lieu net et l'expérience complète. La sensation côté invités doit rester simple : c'était bon, beau et facile à vivre.",
  },
];

const faqItems = [
  {
    question: "Vous avez besoin de beaucoup de place ?",
    answer:
      "Non. La remorque est justement pensée pour passer partout. On valide simplement l'accès, la zone de stationnement et le flux invités en amont.",
  },
  {
    question: "Vous faites seulement des soirées ?",
    answer:
      "Pas du tout. Pouet Pouet fonctionne très bien le midi pour les entreprises, comme en fin de journée pour un anniversaire adulte ou un afterwork.",
  },
  {
    question: "C'est adapté à un événement pro ?",
    answer:
      "Oui. Le rendu visuel, le service et le rythme sont pensés pour du B2B autant que pour du privé. On sait jouer plus corporate ou plus festif selon le contexte.",
  },
  {
    question: "Vous pouvez proposer du sur-mesure ?",
    answer:
      "Oui. Le bon format dépend du nombre d'invités, du créneau, du lieu et du niveau d'ambiance recherché. On construit ça avec vous à partir du brief.",
  },
];

export default function Page() {
  return (
    <>
      <Navbar />

      <main>
        <section
          id="accueil"
          className="noise section-shell relative min-h-screen overflow-hidden bg-[#1b1513] text-[#fff5e7]"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(13, 8, 7, 0.42) 0%, rgba(20, 13, 11, 0.82) 54%, rgba(21, 14, 12, 0.96) 100%), url('/images/hero.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="ambient-orb one" />
          <div className="ambient-orb two" />

          <div className="mx-auto flex min-h-screen max-w-7xl items-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
            <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
              <div className="max-w-4xl">
                <RevealOnScroll>
                  <div className="eyebrow">
                    <span className="eyebrow-dot" />
                    Foodtruck remorque · street food barbecue · privé & B2B
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={120}>
                  <h1 className="font-display mt-8 max-w-4xl text-[clamp(4.2rem,11vw,8.2rem)] font-semibold leading-[0.86] tracking-[-0.05em]">
                    Pouet
                    <span className="mx-2 italic text-[#ffd698]">Pouet</span>
                  </h1>
                </RevealOnScroll>

                <RevealOnScroll delay={220}>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-[#fff5e7]/78 sm:text-xl">
                    La remorque gourmande qui apporte le feu, la lumière et le bon tempo à vos
                    lunchs, anniversaires adultes, soirées d&apos;entreprise et événements qui veulent une
                    vraie présence culinaire.
                  </p>
                </RevealOnScroll>

                <RevealOnScroll delay={320}>
                  <div className="mt-8 grid max-w-3xl gap-4 text-sm text-[#fff5e7]/80 sm:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm">
                      Remorque toute équipée qui passe partout
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm">
                      4 passionnés de cuisine et de bons délires
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm">
                      Profitez de vos invités, on s&apos;occupe du reste
                    </div>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={420}>
                  <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <a href="#contact" className="button-primary">
                      Demander un devis
                    </a>
                    <a href="#ambiance" className="button-secondary dark">
                      Voir l&apos;ambiance
                    </a>
                  </div>
                </RevealOnScroll>
              </div>

              <RevealOnScroll delay={200}>
                <div className="card-dark relative ml-auto overflow-hidden p-5 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ffe4bd]/72">
                    Signature Pouet Pouet
                  </p>
                  <div className="mt-4 rounded-[1.4rem] bg-[#fff3e3] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                    <Image
                      src="/brand/logo-dark.png"
                      alt="Logo Pouet Pouet"
                      width={900}
                      height={360}
                      className="h-auto w-full"
                      priority
                    />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#fff5e7]/72">
                    Une identité chaude, simple et assumée: pas un van déguisé, mais une remorque qui
                    devient le coeur visuel et gourmand de votre événement.
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        <section className="ticker panel-dark">
          <div className="ticker-track">
            {[
              "Lunchs d'entreprise",
              "Anniversaires adultes",
              "Afterworks",
              "Cour intérieure",
              "Jardin",
              "Parking aménagé",
              "Barbecue live",
              "Ambiance cosy",
            ]
              .concat([
                "Lunchs d'entreprise",
                "Anniversaires adultes",
                "Afterworks",
                "Cour intérieure",
                "Jardin",
                "Parking aménagé",
                "Barbecue live",
                "Ambiance cosy",
              ])
              .map((item, index) => (
                <div key={`${item}-${index}`} className="ticker-item">
                  <span className="ticker-spark" />
                  {item}
                </div>
              ))}
          </div>
        </section>

        <section id="concept" className="section-shell px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
              <div>
                <RevealOnScroll>
                  <p className="section-kicker">Le concept</p>
                  <h2 className="section-title mt-4 max-w-3xl">
                    Une remorque foodtruck pensée pour vivre là où votre événement se passe.
                  </h2>
                  <div className="section-rule" />
                </RevealOnScroll>

                <RevealOnScroll delay={120}>
                  <div className="mt-8 space-y-5 text-base leading-8 text-[var(--text-soft)] sm:text-lg">
                    <p>
                      Pouet Pouet, c&apos;est une vraie scène street food barbecue mobile. On arrive avec une remorque
                      compacte, totalement équipée, capable de s&apos;installer aussi bien pour un lunch
                      d&apos;entreprise que pour une grande soirée d&apos;anniversaire entre adultes.
                    </p>
                    <p>
                      Ce qui change tout, c&apos;est l&apos;ambiance. Autour du comptoir, on veut de la chaleur,
                      une lumière douce, une odeur de braise qui attire et une cuisine qui reste vivante,
                      visible, généreuse.
                    </p>
                    <p>
                      Nous sommes quatre, passionnés de cuisine et de bons délires, avec une obsession
                      simple: faire en sorte que vous puissiez vraiment vivre votre événement pendant qu&apos;on
                      régale vos invités.
                    </p>
                  </div>
                </RevealOnScroll>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {metrics.map((metric, index) => (
                    <RevealOnScroll key={metric.label} delay={180 + index * 80}>
                      <div className="panel-dark rounded-[1.5rem] p-5">
                        <div className="metric-value">{metric.value}</div>
                        <p className="mt-3 text-sm leading-6 text-[#fff4e8]/72">{metric.label}</p>
                      </div>
                    </RevealOnScroll>
                  ))}
                </div>
              </div>

              <div className="grid gap-5">
                <RevealOnScroll>
                  <div className="image-frame aspect-[4/5]">
                    <Image
                      src="/images/concept.webp"
                      alt="L'équipe Pouet Pouet autour de la remorque barbecue, en pleine préparation"
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                    />
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={120}>
                  <div className="grid gap-5 sm:grid-cols-[1fr_0.9fr]">
                    <div className="card-soft p-6">
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--ember)]">
                        Ce qu&apos;on apporte
                      </p>
                      <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--text-soft)]">
                        <li>Feu, cuisson minute et service qui reste fluide.</li>
                        <li>Une présence visuelle soignée, pas un simple stand.</li>
                        <li>Un format mobile qui respecte le lieu et son rythme.</li>
                      </ul>
                    </div>

                    <div className="image-frame aspect-[4/5]">
                      <Image
                        src="/brand/presentation-bag.jpg"
                        alt="Packaging Pouet Pouet sur sacs papier dans les couleurs de la marque"
                        fill
                        sizes="(max-width: 1024px) 100vw, 22vw"
                      />
                    </div>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>

        <section id="evenements" className="section-shell px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <RevealOnScroll>
              <p className="section-kicker">Formats</p>
              <h2 className="section-title mt-4 max-w-4xl">
                Une présence qui fonctionne autant pour le pro que pour les soirées qui veulent du relief.
              </h2>
              <div className="section-rule" />
            </RevealOnScroll>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {eventCards.map((card, index) => (
                <RevealOnScroll key={card.title} delay={index * 120}>
                  <article className="card-soft h-full overflow-hidden p-0">
                    <div className="image-frame aspect-[4/3] rounded-none border-0 shadow-none">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-7">
                      <h3 className="font-display text-3xl font-semibold text-[var(--text-ink)]">
                        {card.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-[var(--text-soft)] sm:text-[0.95rem]">
                        {card.text}
                      </p>
                    </div>
                  </article>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell panel-dark noise px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_minmax(0,1.05fr)] lg:items-center">
              <RevealOnScroll>
                <div className="card-dark relative p-8">
                  <span className="quote-mark absolute left-5 top-6">“</span>
                  <div className="relative">
                    <p className="section-kicker text-[#ffe4bd]">La promesse</p>
                    <h2 className="section-title mt-5 text-[#fff4e8]">
                      Vous restez avec vos invités. Nous, on prend le feu, le service et l&apos;ambiance.
                    </h2>
                    <p className="mt-6 max-w-2xl text-base leading-8 text-[#fff4e8]/72 sm:text-lg">
                      Pouet Pouet n&apos;est pas là pour juste déposer des burgers. On installe un point
                      chaud, vivant, élégant, qui attire naturellement les gens sans casser l&apos;événement.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>

              <div className="grid gap-4">
                {promiseCards.map((card, index) => (
                  <RevealOnScroll key={card.title} delay={120 + index * 100}>
                    <div className="card-dark p-6">
                      <div className="flex items-start gap-5">
                        <div className="font-display rounded-full border border-[#ffe4bd]/16 px-4 py-3 text-2xl text-[#ffd698]">
                          {card.number}
                        </div>
                        <div>
                          <h3 className="font-display text-3xl text-[#fff4e8]">{card.title}</h3>
                          <p className="mt-3 text-sm leading-7 text-[#fff4e8]/72">{card.text}</p>
                        </div>
                      </div>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="ambiance" className="section-shell px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <RevealOnScroll>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="section-kicker">Ambiance</p>
                  <h2 className="section-title mt-4 max-w-3xl">
                    Le spot doit donner faim, mais aussi donner envie d&apos;y rester.
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-7 text-[var(--text-soft)] sm:text-base">
                  Guirlandes, braise, tables hautes, fumée légère et service vivant: l&apos;idée est de faire du
                  passage au foodtruck-remorque un vrai moment de votre événement.
                </p>
              </div>
            </RevealOnScroll>

            <div className="mt-14 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <RevealOnScroll>
                <div className="image-frame aspect-[16/10]">
                  <Image
                    src="/images/grill.webp"
                    alt="Plan rapproché du barbecue Pouet Pouet avec cuisson minute et braises vives"
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                </div>
              </RevealOnScroll>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <RevealOnScroll delay={120}>
                  <div className="image-frame aspect-[4/3]">
                    <Image
                      src="/images/setup.webp"
                      alt="Remorque Pouet Pouet dans une ambiance cosy avec guirlandes lumineuses"
                      fill
                      sizes="(max-width: 1024px) 100vw, 30vw"
                    />
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={220}>
                  <div className="card-soft h-full p-7">
                    <p className="section-kicker">Ce que vos invités retiennent</p>
                    <ul className="mt-5 space-y-4 text-sm leading-7 text-[var(--text-soft)]">
                      <li>Un point central chaleureux et vivant.</li>
                      <li>Une cuisine qui se voit, se sent et rassemble.</li>
                      <li>Un service qui reste cool sans perdre en tenue.</li>
                      <li>Une vraie sensation de moment, pas juste un repas livré.</li>
                    </ul>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell panel-light px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.92fr_minmax(0,1.08fr)] lg:items-center">
              <RevealOnScroll>
                <div>
                  <p className="section-kicker">Le déroulé</p>
                  <h2 className="section-title mt-4 max-w-3xl">
                    Un format simple à vivre, propre à produire, fort à ressentir.
                  </h2>
                  <div className="section-rule" />
                </div>
              </RevealOnScroll>

              <div className="grid gap-4">
                {steps.map((step, index) => (
                  <RevealOnScroll key={step.title} delay={120 + index * 90}>
                    <div className="card-soft p-6">
                      <div className="flex items-start gap-5">
                        <div className="font-display rounded-full border border-[var(--line-soft)] px-4 py-3 text-2xl text-[var(--ember)]">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <h3 className="font-display text-3xl text-[var(--text-ink)]">{step.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-[var(--text-soft)]">{step.text}</p>
                        </div>
                      </div>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="section-shell px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_minmax(0,1fr)]">
            <RevealOnScroll>
              <div className="lg:sticky lg:top-28">
                <p className="section-kicker">Questions fréquentes</p>
                <h2 className="section-title mt-4 max-w-xl">
                  Ce qu&apos;on vérifie toujours avant de garer la remorque.
                </h2>
                <p className="mt-6 max-w-lg text-sm leading-7 text-[var(--text-soft)] sm:text-base">
                  L&apos;accès, le timing, le flux invités, l&apos;ambiance attendue et la bonne place pour que
                  Pouet Pouet soit visible sans jamais gêner l&apos;événement.
                </p>
              </div>
            </RevealOnScroll>

            <div>
              {faqItems.map((item, index) => (
                <RevealOnScroll key={item.question} delay={index * 90}>
                  <div className="faq-item">
                    <h3 className="font-display text-3xl text-[var(--text-ink)]">{item.question}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-soft)] sm:text-base">
                      {item.answer}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section-shell panel-dark noise px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.88fr_minmax(0,1.12fr)] lg:items-start">
              <RevealOnScroll>
                <div className="lg:sticky lg:top-28">
                  <Image
                    src="/brand/logo-light.png"
                    alt="Logo Pouet Pouet"
                    width={520}
                    height={220}
                    className="h-auto w-52"
                  />
                  <h2 className="section-title mt-8 max-w-xl text-[#fff4e8]">
                    Racontez-nous votre événement, on prépare le bon feu.
                  </h2>
                  <p className="mt-6 max-w-xl text-sm leading-7 text-[#fff4e8]/72 sm:text-base">
                    Lunch d&apos;équipe, anniversaire adulte, soirée d&apos;entreprise ou événement privé: plus le brief
                    est clair, plus on peut penser juste. Le formulaire ci-contre prépare un email prêt à envoyer.
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="metric-card">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ffe4bd]/72">Basés en Belgique</p>
                      <p className="mt-3 text-sm leading-7 text-[#fff4e8]/72">
                        On se déplace là où la remorque peut créer un vrai point de rencontre.
                      </p>
                    </div>
                    <div className="metric-card">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ffe4bd]/72">Contact direct</p>
                      <a href="mailto:bonjour@pouetpouet.be" className="mt-3 block text-sm text-[#fff4e8] underline decoration-[#f0c47c] underline-offset-4">
                        bonjour@pouetpouet.be
                      </a>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={120}>
                <div className="card-dark p-7 sm:p-9">
                  <ContactForm />
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
