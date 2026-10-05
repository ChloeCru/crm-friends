// Icônes au trait (SVG), reprises des maquettes.
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import type { Channel } from '@/domain/types';

import { colors } from './theme';

type IconProps = { size?: number; color?: string; strokeWidth?: number };

const stroke = (color: string, strokeWidth: number) =>
  ({ fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' }) as const;

export function SearchIcon({ size = 20, color = colors.ink, strokeWidth = 2.4 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...stroke(color, strokeWidth)}>
      <Circle cx={11} cy={11} r={7} />
      <Path d="M20 20l-3.5-3.5" />
    </Svg>
  );
}

export function PlusIcon({ size = 24, color = colors.white, strokeWidth = 2.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...stroke(color, strokeWidth)}>
      <Path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function BackIcon({ size = 20, color = colors.ink, strokeWidth = 2.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...stroke(color, strokeWidth)}>
      <Path d="M15 5l-7 7 7 7" />
    </Svg>
  );
}

export function CloseIcon({ size = 20, color = colors.ink, strokeWidth = 2.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...stroke(color, strokeWidth)}>
      <Path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}

export function MoreIcon({ size = 24, color = colors.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Circle cx={5} cy={12} r={2} />
      <Circle cx={12} cy={12} r={2} />
      <Circle cx={19} cy={12} r={2} />
    </Svg>
  );
}

export function PencilIcon({ size = 16, color = colors.ink, strokeWidth = 2.4 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...stroke(color, strokeWidth)}>
      <Path d="M4 20l4-1 11-11-3-3L5 16z" />
    </Svg>
  );
}

export function CheckIcon({ size = 20, color = colors.white, strokeWidth = 2.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...stroke(color, strokeWidth)}>
      <Path d="M5 12.5l4.5 4.5L19 7.5" />
    </Svg>
  );
}

export function TrashIcon({ size = 20, color = colors.ink, strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...stroke(color, strokeWidth)}>
      <Path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
    </Svg>
  );
}

export function DiceIcon({ size = 20, color = colors.ink, strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...stroke(color, strokeWidth)}>
      <Rect x={4} y={4} width={16} height={16} rx={4} />
      <Circle cx={9} cy={9} r={1} />
      <Circle cx={15} cy={15} r={1} />
      <Circle cx={15} cy={9} r={1} />
      <Circle cx={9} cy={15} r={1} />
    </Svg>
  );
}

export function FriendsIcon({ size = 24, color = colors.ink, strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...stroke(color, strokeWidth)}>
      <Circle cx={9} cy={8} r={3.5} />
      <Path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <Circle cx={17.5} cy={9} r={2.5} />
      <Path d="M17.5 14c2.4 0 4 1.7 4 4" />
    </Svg>
  );
}

export function BellIcon({ size = 24, color = colors.ink, strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...stroke(color, strokeWidth)}>
      <Path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
      <Path d="M10 20.5a2.2 2.2 0 0 0 4 0" />
    </Svg>
  );
}

export function SlidersIcon({ size = 24, color = colors.ink, strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...stroke(color, strokeWidth)}>
      <Path d="M4 7h10M18 7h2M4 12h3M11 12h9M4 17h12" />
      <Circle cx={16} cy={7} r={2} />
      <Circle cx={9} cy={12} r={2} />
      <Circle cx={18} cy={17} r={2} />
    </Svg>
  );
}

export function ChannelIcon({ channel, size = 18, color = colors.ink, strokeWidth = 2.2 }: IconProps & { channel: Channel }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...stroke(color, strokeWidth)}>
      {channel === 'appel' && (
        <Path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1z" />
      )}
      {channel === 'message' && <Path d="M4 5h16v11H9l-5 4z" />}
      {channel === 'cafe' && (
        <>
          <Path d="M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" />
          <Path d="M16 10h2a2 2 0 0 1 0 5h-2" />
          <Path d="M8 3v2M12 3v2" />
        </>
      )}
      {channel === 'autre' && (
        <>
          <Circle cx={12} cy={12} r={8} />
          <Path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth={strokeWidth + 0.6} />
        </>
      )}
    </Svg>
  );
}
