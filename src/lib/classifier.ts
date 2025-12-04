// src/lib/classifier.ts

export type ExpenseRow = {
  id: number;
  date: string;
  description: string;
  amount: number;
  rawCategory?: string;
  aiCategory: string; // we will treat this as "current category"
};

export function classifyExpense(text: string): string {
  const t = text.toLowerCase();

  if (/(flight|uber|taxi|hotel|airbnb|train|travel|trip|parking)/.test(t)) {
    return "Travel";
  }

  if (/(meal|restaurant|coffee|dinner|lunch|food|cafe|snacks)/.test(t)) {
    return "Meals & Entertainment";
  }

  if (/(aws|azure|gcp|office 365|adobe|subscription|saas|license|software)/.test(t)) {
    return "Software & Subscriptions";
  }

  if (/(hydro|electric|electricity|internet|wifi|phone|mobile|gas|utility|utilities)/.test(t)) {
    return "Utilities";
  }

  if (/(rent|lease|office|coworking)/.test(t)) {
    return "Rent & Facilities";
  }

  return "Other";
}
