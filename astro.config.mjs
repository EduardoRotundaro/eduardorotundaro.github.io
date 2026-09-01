// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	// Repositorio de usuario: publica na raiz, sem `base`.
	site: 'https://eduardorotundaro.github.io',
	integrations: [
		starlight({
			title: 'handbook',
			description: 'Guias rapidos, resumos e pontos-chave. Notas pessoais de estudo.',
			// Sem `sidebar`: o Starlight ja gera o menu a partir da estrutura de pastas.
			lastUpdated: true,
			defaultLocale: 'root',
			locales: {
				root: { label: 'Portugues', lang: 'pt-BR' },
			},
			head: [
				// Decisao de Fase 0: acessivel por link, nao descoberto por busca.
				// Ver development/decisoes.md. Remover estas linhas reverte a decisao.
				{ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' } },
			],
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/EduardoRotundaro/eduardorotundaro.github.io',
				},
			],
		}),
	],
});
