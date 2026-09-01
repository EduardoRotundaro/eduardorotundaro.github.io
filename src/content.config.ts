import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				// Maturidade da ESCRITA, nao validade do conteudo.
				// Um verbete `estavel` ainda pode estar errado -- ver a auditoria trimestral.
				status: z.enum(['semente', 'crescendo', 'estavel']).default('semente'),
				tags: z.array(z.string()).default([]),
			}),
		}),
	}),
};
