type PointType = [number, number];

interface ICircle {
  x: number;
  y: number;
  r: number;
}

type PathType = PointType[];
type LineType = [PointType, PointType];

type T_UNITS = "mm" | "cm" | "m" | "pc" | "pt" | "in" | "ft" | "px";
