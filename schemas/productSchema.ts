import { z } from "zod";

export const productSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    details: z.string(),
    image: z.string(),
    category: z.string(),
    
})