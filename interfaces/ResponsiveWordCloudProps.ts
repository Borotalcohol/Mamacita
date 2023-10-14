import { WordData } from "./WordData";

export interface ResponsiveWordCloudProps {
  words: WordData[];
  colors: string[];
  width: number;
  height: number;
}
