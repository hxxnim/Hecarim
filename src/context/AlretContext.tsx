import { createContext } from "react";

export interface AlretContext {
  showAlret: (alret: Alret) => Promise<void>;
}

export type ButtonColor = "black" | "red" | "primary";

export interface Button {
  color: ButtonColor;
  text: string;
  onPress: () => void;
  type: "default" | "close";
}

export interface Alret {
  title: string;
  content: string;
  buttons: Button[];
}

export const alretContext = createContext<AlretContext>({
  showAlret: async () => {},
});
