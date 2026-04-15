"use client";

import { useState } from "react";

const CONTACT_EMAIL = "bonjour@pouetpouet.be";

type FormState = {
  nom: string;
  email: string;
  telephone: string;
  typeEvenement: string;
  invites: string;
  ville: string;
  message: string;
};

const initialState: FormState = {
  nom: "",
  email: "",
  telephone: "",
  typeEvenement: "",
  invites: "",
  ville: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "ready">("idle");

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = `Demande de devis Pouet Pouet - ${form.typeEvenement || "événement à préciser"}`;
    const body = [
      `Nom : ${form.nom}`,
      `Email : ${form.email}`,
      `Téléphone : ${form.telephone || "-"}`,
      `Type d'événement : ${form.typeEvenement || "-"}`,
      `Nombre d'invités : ${form.invites || "-"}`,
      `Ville / lieu : ${form.ville || "-"}`,
      "",
      "Message :",
      form.message || "-",
    ].join("\n");

    const url = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    setStatus("ready");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="nom" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-[#ffe4bd]">
            Nom
          </label>
          <input
            id="nom"
            name="nom"
            required
            className="contact-field"
            placeholder="Votre nom ou celui de votre société"
            value={form.nom}
            onChange={(event) => updateField("nom", event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-[#ffe4bd]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="contact-field"
            placeholder="bonjour@votreboite.be"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="telephone" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-[#ffe4bd]">
            Téléphone
          </label>
          <input
            id="telephone"
            name="telephone"
            type="tel"
            className="contact-field"
            placeholder="+32 ..."
            value={form.telephone}
            onChange={(event) => updateField("telephone", event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="typeEvenement" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-[#ffe4bd]">
            Type d&apos;événement
          </label>
          <select
            id="typeEvenement"
            name="typeEvenement"
            className="contact-select"
            value={form.typeEvenement}
            onChange={(event) => updateField("typeEvenement", event.target.value)}
          >
            <option value="">Choisir</option>
            <option value="Lunch d'entreprise">Lunch d&apos;entreprise</option>
            <option value="Afterwork / soirée B2B">Afterwork / soirée B2B</option>
            <option value="Anniversaire adulte">Anniversaire adulte</option>
            <option value="Événement privé">Événement privé</option>
          </select>
        </div>
        <div>
          <label htmlFor="invites" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-[#ffe4bd]">
            Invités
          </label>
          <input
            id="invites"
            name="invites"
            className="contact-field"
            placeholder="40, 80, 150..."
            value={form.invites}
            onChange={(event) => updateField("invites", event.target.value)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="ville" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-[#ffe4bd]">
          Lieu
        </label>
        <input
          id="ville"
          name="ville"
          className="contact-field"
          placeholder="Ville, entreprise, jardin, cour, rooftop..."
          value={form.ville}
          onChange={(event) => updateField("ville", event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-[#ffe4bd]">
          Votre brief
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="contact-textarea"
          placeholder="Date, horaires, ambiance recherchée, contraintes techniques, préférences de service..."
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
        />
      </div>

      {status === "ready" ? (
        <p className="rounded-2xl border border-[#ffe4bd]/16 bg-white/5 px-4 py-3 text-sm text-[#fff4e8]/72">
          Votre logiciel d&apos;email devrait s&apos;ouvrir avec le brief prérempli.
          Si besoin, écrivez-nous directement à <a href={`mailto:${CONTACT_EMAIL}`} className="underline decoration-[#f0c47c] underline-offset-4">{CONTACT_EMAIL}</a>.
        </p>
      ) : null}

      <button type="submit" className="button-primary w-full justify-center">
        Préparer ma demande
      </button>
    </form>
  );
}
