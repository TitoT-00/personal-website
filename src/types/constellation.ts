// Core constellation types

export type WorldCoordinate = {
  x: number;
  y: number;
};

export type MainNodeLayout = {
  id: string;
  title: string;
  color: string;
  x: number; // world coordinates
  y: number; // world coordinates
  angle: number; // angle from center in degrees
  radius: number; // distance from center
  delay: number; // animation delay
};

export type SubNodeLayout = {
  id: string;
  x: number; // world coordinates
  y: number; // world coordinates
  data: any;
};

export type CardLayout = {
  nodeId: string;
  x: number; // world coordinates
  y: number; // world coordinates
  width: number;
  height: number;
  isRight: boolean; // card on right or left of node
};

export type BranchPath = {
  id: string;
  d: string; // SVG path data
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

export type TreeLayout = {
  type: 'progression' | 'radial';
  rootX: number;
  rootY: number;
  nodes: SubNodeLayout[];
  cards: CardLayout[];
  branches: BranchPath[];
};

export type CameraState = {
  x: number;
  y: number;
  scale: number;
};
