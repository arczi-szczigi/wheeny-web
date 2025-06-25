/** @type {import('next').NextConfig} */
const nextConfig = {
	// ignoruj ESLint podczas builda, żeby błędy typu no-unused-vars / no-explicit-any nie przerywały kompilacji
	eslint: {
		ignoreDuringBuilds: true,
	},
	compiler: {
		styledComponents: true,
	},
};

module.exports = nextConfig;
