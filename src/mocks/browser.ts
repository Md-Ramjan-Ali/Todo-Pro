import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// Create a worker instance with the request handlers
export const worker = setupWorker(...handlers);
