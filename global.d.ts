interface Point {
  x: number;
  y: number;
}

declare module "*.png" {
  const content: string;
  export default content;
}