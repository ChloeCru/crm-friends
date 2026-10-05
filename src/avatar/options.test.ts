/// <reference types="node" />
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { test } from 'node:test';

import { Avatar, Style } from '@dicebear/core';

import * as options from './options.ts';

const require = createRequire(import.meta.url);
const definition = JSON.parse(readFileSync(require.resolve('@dicebear/styles/toon-head.json'), 'utf8'));
const style = new Style(definition);

const variants = (component: string) => Object.keys(definition.components[component].variants).sort();
const colors = (name: string) => definition.colors[name].values.map((c: string) => c.slice(1)).sort();
const values = (choices: { value: string }[]) => choices.map((c) => c.value).sort();

test('les options correspondent exactement à toon-head.json', () => {
  assert.deepEqual(values(options.HAIR), variants('hair'));
  assert.deepEqual(values(options.REAR_HAIR), variants('rearHair'));
  assert.deepEqual(values(options.BEARD), variants('beard'));
  assert.deepEqual(values(options.EYES), variants('eyes'));
  assert.deepEqual(values(options.EYEBROWS), variants('eyebrows'));
  assert.deepEqual(values(options.MOUTH), variants('mouth'));
  assert.deepEqual(values(options.CLOTHES), variants('clothes'));
  assert.deepEqual(values(options.HAIR_COLORS), colors('hair'));
  assert.deepEqual(values(options.SKIN_COLORS), colors('skin'));
  assert.deepEqual(values(options.CLOTHES_COLORS), colors('clothes'));
});

test('les réglages sont rendus tels quels (couleurs sans #, probabilités 0/100)', () => {
  const settings = options.randomAvatar();
  const json = new Avatar(style, { seed: 'test', ...settings }).toJSON();
  const o = json.options as Record<string, unknown>;
  assert.deepEqual(o.hairColor, [`#${settings.hairColor}`]);
  assert.deepEqual(o.skinColor, [`#${settings.skinColor}`]);
  assert.deepEqual(o.clothesColor, [`#${settings.clothesColor}`]);
  assert.match(json.svg, /^<svg/);
});

test('changer une option change le dessin', () => {
  const base = options.randomAvatar(() => 0);
  const render = (s: object) => new Avatar(style, { seed: 'test', ...base, ...s }).toString();
  assert.notEqual(render({ beardProbability: 0 }), render({ beardProbability: 100 }));
  assert.notEqual(render({ mouthVariant: 'smile' }), render({ mouthVariant: 'sad' }));
});
