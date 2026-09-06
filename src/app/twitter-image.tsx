// O card do Twitter/X usa a mesma arte do Open Graph.
export { default, alt, size, contentType } from "./opengraph-image";

// Precisa ser declarado aqui (o Next não aceita `dynamic` re-exportado);
// exigido com output: "export".
export const dynamic = "force-static";
