/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  addDays,
  daysSince,
  needsFollowUp,
  relativeDay,
  rhythmLabel,
  shortDate,
  splitByStatus,
  todayISO,
} from './friendship.ts';
import type { FriendWithLastContact } from './types';

const TODAY = '2026-10-05';

test('todayISO utilise la date locale', () => {
  assert.equal(todayISO(new Date(2026, 0, 3, 23, 30)), '2026-01-03');
});

test('addDays traverse les mois et les changements d’heure', () => {
  assert.equal(addDays('2026-10-05', -23), '2026-09-12');
  assert.equal(addDays('2026-03-28', 2), '2026-03-30');
});

test('daysSince', () => {
  assert.equal(daysSince(null, TODAY), null);
  assert.equal(daysSince('2026-10-04', TODAY), 1);
  assert.equal(daysSince('2026-09-12', TODAY), 23);
});

test('needsFollowUp : strictement plus que le rythme, ou aucun contact', () => {
  assert.equal(needsFollowUp(null, 21, TODAY), true);
  assert.equal(needsFollowUp(addDays(TODAY, -21), 21, TODAY), false);
  assert.equal(needsFollowUp(addDays(TODAY, -22), 21, TODAY), true);
});

test('relativeDay', () => {
  assert.equal(relativeDay(0), "aujourd'hui");
  assert.equal(relativeDay(1), 'hier');
  assert.equal(relativeDay(8), 'il y a 8 jours');
  assert.equal(relativeDay(null), 'jamais');
});

test('splitByStatus trie chaque bloc dans le bon sens', () => {
  const f = (name: string, lastContact: string | null, rhythmDays = 21) =>
    ({ name, lastContact, rhythmDays }) as FriendWithLastContact;
  const { toFollowUp, fine } = splitByStatus(
    [
      f('Hugo', addDays(TODAY, -31)),
      f('Tom', addDays(TODAY, -1)),
      f('Zoé', addDays(TODAY, -40)),
      f('Nouveau', null),
      f('Malo', addDays(TODAY, -3)),
      f('Inès', addDays(TODAY, -23)),
    ],
    TODAY,
  );
  assert.deepEqual(toFollowUp.map((x) => x.name), ['Nouveau', 'Zoé', 'Hugo', 'Inès']);
  assert.deepEqual(fine.map((x) => x.name), ['Tom', 'Malo']);
});

test('rhythmLabel', () => {
  assert.equal(rhythmLabel(7), 'toutes les semaines');
  assert.equal(rhythmLabel(21), 'toutes les 3 semaines');
  assert.equal(rhythmLabel(10), 'tous les 10 jours');
});

test('shortDate', () => {
  assert.equal(shortDate('2026-09-12', TODAY), '12 sept.');
  assert.equal(shortDate('2025-03-03', TODAY), '3 mars 2025');
});
