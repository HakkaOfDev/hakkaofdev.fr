# Changelog

## [1.6.0](https://github.com/HakkaOfDev/hakkaofdev.fr/compare/v1.5.0...v1.6.0) (2026-05-01)


### Features

* **i18n:** next-intl across 22 locales - full UI, CV, OG, RTL ([c3e61d2](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/c3e61d2c91f014035a53e176add4e6054eba47bc))
* **i18n:** switch to freelance positioning + complete language picker ([382b9e2](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/382b9e2bcdfc103c6dd60fd4f658267f45fcdc2e))


### Bug Fixes

* **og:** retry Google Fonts requests so flaky builds don't fail ([a779d33](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/a779d3386299aaa68e59a6a8ed7f51eeee4065f6))
* **readme:** preserve version badge color across release-please bumps ([a0e2303](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/a0e2303030f1c466bad8a4d1b25ce528fd44b60a))
* **security:** CSP, HSTS, hardened headers, prod source maps ([7fb21f8](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/7fb21f8070d468d9fa6a578b0bc92520315f8042))
* **welcome:** align shortcut rows on a shared label column ([315a915](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/315a915de102dddfdc7da2a8dce7f580758ff141))


### Performance

* **og:** pre-render OG images at build time, drop edge runtime ([826ff70](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/826ff70d4ebd37809dd9b349be860f424ac73930))


### Documentation

* **readme:** move preview image above tech stack badges ([c266fbb](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/c266fbb956703d0895ef78422cdd90ac6f271956))


### Miscellaneous

* **security:** add CSP + security headers, enable prod source maps ([488d439](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/488d439995fe2718be91830b9bd8e2b054097f0f))
* **security:** harden headers and JSON-LD script ([327e025](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/327e02506798cf5f9c0cdb9873a783054fcba853))


### Code Refactoring

* **guestbook:** pass resolved messages to schema builder ([a359363](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/a359363162ecfffa0015bf399a9eb901715842f8))
* **i18n:** clear locale cookie via server action ([1b0dfe2](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/1b0dfe2c7875e4df64134f8d7a9cfeb9546be947))

## [1.5.0](https://github.com/HakkaOfDev/hakkaofdev.fr/compare/v1.4.0...v1.5.0) (2026-04-30)


### Features

* advanced theming - architecture foundation - documentation ([9c3b9ef](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/9c3b9efdfd2dd730b0ea39989761d0e17d315abe))
* **cv:** link experiences to companies and refresh resume copy ([44594ef](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/44594efb2579257ee9b7accaecfb86a495ad819e))
* **cv:** link experiences to companies and refresh resume copy ([c93a065](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/c93a06548618f1bae492b65f6d6fe1373ee6cb1d))
* **guestbook:** use Select component in FilterPopover country filter ([6a348ce](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/6a348cef0a31e13460a13bb0eb4a11ee35c329a8))
* **terminal:** add stores, types, constants, and layout utils ([a719d45](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/a719d45fa52c168d98fdca9ef00f9d6a800b7c10))
* **terminal:** add terminal hooks and extend global shortcuts ([5a1d213](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/5a1d21335b29a6e93bd8af0e2325426fb6fb4c52))
* **terminal:** add terminal module and remove legacy components ([cf72224](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/cf72224f3fdb4fa3810f5faf27902d087eeec8dd))
* **terminal:** add TrafficLights actions, DeferredFontLoader, typography CSS ([4c5fed5](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/4c5fed53f91156b312995d93a3b16579275d210d))
* **terminal:** integration and minor updates ([aeef05c](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/aeef05c9e12fb7db88bec1faf72f4f39fc4a584e))
* **terminal:** refactor providers for sessions/tabs, integrate new Terminal ([3808a03](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/3808a03e041660d611c352c5da3a8e8b4e0f67dd))
* **theme:** add CycleTheme, migrate chart-* to semantic tokens, add useSortedClasses ([2d9b254](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/2d9b254ad0c61f476d9f91ca5969ce36cd56d179))
* **theme:** add theme engine, commands, and provider restructure ([a0cbf01](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/a0cbf01d99a3281ae389fad5b129b605790805a1))
* **theme:** add Zustand theme store and refactor ThemeProvider ([fc83b46](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/fc83b4646f3f97bd74e52d2b0d2306b22c21c45c))
* **ui:** add Select and Dialog components ([e72bc31](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/e72bc31972ab78643051ce0789321bac33775189))


### Documentation

* update README and ROADMAP for terminal UX ([050e5c7](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/050e5c77aa3654e190c9a4c7b242b7dae60db21b))
* update README with theme system, ROADMAP, release-please ([e813ab4](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/e813ab4086fa3f63a4196d1e3879a833531a1e25))


### Styles

* **guestbook:** text-xs consistency in guestbook read components ([248e1e3](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/248e1e31db64c58d68e12111c9332ed38b649370))
* import order and formatting in stores and storage ([9624ed2](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/9624ed23ea9c30bb36c0a682712e4fc3c030f2ce))
* **terminal:** fix TrafficLights className and format DeferredFontLoader ([24c7966](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/24c79664dff69414aeb33b87b77a82bc5cf96dff))
* **terminal:** import order and formatting ([c572ef4](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/c572ef423e0c049d986b7eb13e332fcf73789ae7))
* **ui:** apply useSortedClasses to remaining components ([5e3bbda](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/5e3bbda629e3e40b167fc9ffd9489ec6aa5c4ec6))
* **ui:** import order and format Dialog component ([4ab9ba8](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/4ab9ba8f859bd46ef38ddf07896e4cf5cccb4d46))


### Miscellaneous

* **config:** update release-please, robots, next.config ([f21263c](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/f21263ce204a2dbca85a9c8388cc28f62f7f23ec))
* **constants:** add analytics, api, guestbook-client, suggestions constants ([d7bff89](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/d7bff896e98a4be1916b07658110f08907d77405))
* **deps:** add zustand for state management ([e644af9](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/e644af955efbdb21580042237e6aec795f4e84b4))
* sync develop with main (release-please config) ([16094f0](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/16094f0622e124c06d973dcf0861a71eef9e1fb5))
* **utils:** extract request, string, url, number, suggestions utils ([8e04312](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/8e04312230d1c1835d6a1936950cce41730a4f14))


### Code Refactoring

* **commands:** add async command registry modules ([85c55d3](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/85c55d3b37dd5969a93af89ec68dc5091da5e4ac))
* **commands:** move command-descriptors to lib ([b8cac47](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/b8cac47df3b125758ff971ad172482f9430add23))
* **commands:** remove old registry files ([c2f3691](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/c2f3691f8f53bf5c5c02126baf1802a1c97a895a))
* **commands:** update CommandItem and consumers for async registry ([e302cd1](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/e302cd1366652ca512bc1f95c54f4865b6c121e1))
* move scroll logic to CommandItem ([4bfccdb](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/4bfccdb47bfc0a6c99e75ff8da9c7963bd69e35a))
* move scroll logic to CommandItem ([473580a](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/473580a024297edbac33351fa9f5cc45a4af913d))
* move scroll logic to CommandItem ([693f16e](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/693f16e81c4c7b874e8345b89707b2a771cdddd0))
* **services:** add barrel export and class-based API ([9abe09b](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/9abe09b8ca3533bad9594e982ef16b792b366a04))
* **types:** consolidate lib/types to types/ directory ([7d7bce3](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/7d7bce3ad1d00c8d908515633e27ce26a09a4c54))

## [1.4.0](https://github.com/HakkaOfDev/hakkaofdev.fr/compare/v1.3.1...v1.4.0) (2026-02-18)


### Features

* add guestbook, enhanced analytics, terminal improvements, and project polish ([9d15bfd](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/9d15bfda6458ef3e3c129769b74df17e08522cd7))
* **analytics:** enhance visitor tracking with IP hashing and geo-detection ([63bc2a5](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/63bc2a53d02f568b455452a6041c864099c5e305))
* **guestbook:** add guestbook command with sign, read, and moderation ([79f031d](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/79f031d763d1b0a35c113a51de9bf74164e6eb43))
* **terminal:** add GitHub star button and improve resize animation ([3e6b5fc](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/3e6b5fc8a7042c8924843e4d767e1f283c22e25b))
* **ui:** add Popover component and pink variant to Shortcut and Tag ([6767914](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/676791489cf7863a01bff25893341f6da26ce20f))
* **utils:** add formatEntryDate date formatting helper ([15c582a](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/15c582aa8fdeff44c598ca4f2c0e920be33344df))


### Bug Fixes

* **assets:** replace avatar.jpeg with optimized jpg and add site preview ([c59bb48](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/c59bb483398700bdc7166cb6b49d9b31937125a5))
* **lint:** apply Biome auto-formatting fixes ([75abfdc](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/75abfdc0b42df017792542c4069347884ac064fd))


### Documentation

* add project roadmap ([b673f3c](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/b673f3cea3788d9fe599e822981d6b9abf5c220d))
* rewrite README with badges, structure, and guestbook docs ([dcec697](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/dcec6978a2cfa74ef77f8d02e9c88a88348fe59c))


### Miscellaneous

* add MIT license ([8cae83b](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/8cae83ba6f980a57495df0ee279137fba838040e))
* add pre-commit hook to run Biome on staged files ([a262f46](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/a262f46e38a7063c2f748e043f5112f8232c14e7))
* add pre-commit hook to run Biome on staged files ([3f14ad0](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/3f14ad027379a8f147d7d81402a5eb26f7bb85ac))
* **config:** update env template for guestbook and analytics ([c073a82](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/c073a822bb7b8c3de578a0a663469ce8e14bf37b))
* **config:** update release-please settings ([38deead](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/38deead246dcb31ab86a19d6e6ca2653a3dc1ea0))
* **deps:** add form, popover, validation, and e2e dependencies ([24b293c](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/24b293cbc28087f606f8b6e09b102a6f7261a398))


### Code Refactoring

* **commands:** reorganize registries and generalize sub-command routing ([50d7b36](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/50d7b36a5ef1256b175d9fb56a0659b6efb328ee))
* **constants:** split monolithic constants into dedicated modules ([c31811c](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/c31811c17e836728e935cd206494ed1937b306eb))

## [1.3.1](https://github.com/HakkaOfDev/hakkaofdev.fr/compare/v1.3.0...v1.3.1) (2026-02-17)


### Bug Fixes

* formatting in contact and spotify ([ffafa45](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/ffafa45f616db37c2b0244763f15d2f5e920a38f))


### Code Refactoring

* **commands:** extract SubCommandRouter and polish command renders ([ed6ab1c](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/ed6ab1cf1a81bf52b50b38de695922858dc2b9d8))

## [1.3.0](https://github.com/HakkaOfDev/hakkaofdev.fr/compare/v1.2.0...v1.3.0) (2026-02-17)


### Features

* v1.2.0 — new commands, terminal redesign, analytics & CV generation ([5f9ee6f](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/5f9ee6f6168879544cdc4d598e52b0db696da8a2))


### Code Refactoring

* **stats:** track unique visitors by IP instead of page views ([8e70c50](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/8e70c50815bf4ac2a36f95999fb2da0300da1e51))

## [1.2.0](https://github.com/HakkaOfDev/hakkaofdev.fr/compare/v1.1.1...v1.2.0) (2026-02-17)


### Features

* **analytics:** add page view tracking with Supabase ([036c882](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/036c882acdb63aecd5d0731dc37efdc521f39a07))
* **commands:** add new commands and refactor command system ([2d2859f](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/2d2859f6f1507367909b39cc9c569663269b4998))
* **cv:** add PDF resume generation with react-pdf ([7146532](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/714653208807831e0fb49ab73786f870416b19f1))
* **lib:** add service layer with types and Supabase client ([dc25725](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/dc25725af7ef3a7a8c6d3b9054f4ae32be6fc2ff))
* terminal v2 redesign with new commands, CV generation, and analytics ([ba74849](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/ba74849258c2164ed78ea818895531e8a66622bb))
* **ux:** add global shortcuts and improve input and suggestion UX ([23cbcb5](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/23cbcb551c256ee98563e02c9b3d80745876b24e))


### Bug Fixes

* **lint:** sort imports to satisfy Biome organizeImports rule ([a0bd1e7](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/a0bd1e7968ee718b7806300226f687b2bcef3829))


### Miscellaneous

* **config:** update environment template and relax biome rules ([df3a386](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/df3a38639b30de19e83d41ac89bdc967d9376eeb))
* **deps:** add react-pdf and supabase dependencies ([0b76eb0](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/0b76eb0444fc62a37b009634a336a6feb3c94033))


### Code Refactoring

* **actions:** delegate server actions to service modules ([be7bb9d](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/be7bb9df064b3b3586e965a840f5dadc44a8f1b7))
* **content:** update site metadata, skill labels, and languages ([6be12ae](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/6be12ae30aae7e2343c5b8bb474fc0b970c8aa62))
* **terminal:** redesign terminal with macOS-style chrome ([bb551f7](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/bb551f7bad6074e63eea83ab616b5f8d78a9e485))

## [1.1.1](https://github.com/HakkaOfDev/hakkaofdev.fr/compare/v1.1.0...v1.1.1) (2026-02-17)


### Miscellaneous

* **deps:** remove duplicate framer-motion in favor of motion ([8853fa5](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/8853fa555d8b27f96c1009b4ebbd6c9b1401c8f0))

## [1.1.0](https://github.com/HakkaOfDev/hakkaofdev.fr/compare/v1.0.0...v1.1.0) (2026-02-17)


### Features

* about command ([450ce7d](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/450ce7da7c1e926cbb6548560758223ab7c47ea5))
* **commands:** did-you-mean + UI polish ([3f269ed](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/3f269edc4c5c37d10b3b90e5bcd0fd7f69f97488))
* **content:** refresh projects, skills, experiences and update assets ([145821a](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/145821afcf1f7cb3192d9698157b309dca13d3b7))
* education command ([d31e5b9](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/d31e5b965741e156cf11485de4c1eed632f681c1))
* experiences command ([a2bfd34](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/a2bfd34c1cb33220dfc2815e44e50c72069afefd))
* optimize SEO ([82c9580](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/82c9580b178f3110103226206e440f7bd79adb20))
* portfolio v2 redesign — UI overhaul, performance and content refresh ([def9958](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/def9958127f1cac1f9d89bba7ff9b36285e35d0d))
* projects command ([dffe1b3](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/dffe1b3b9be7981e79ad35a6d7685c48e85463fc))
* reset command and control 204 error ([44c2c63](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/44c2c632227c4c6bce0dac3bc6cbd2fa163d5fef))
* **seo:** add social preview images and JSON-LD ([54f73df](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/54f73df6b66e7d268d41a3243e153ef8a9f9d51c))
* **seo:** update metadata, improve accessibility and add Vercel analytics ([7740a63](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/7740a6360c0cddf1e3481c2d956445631f5cd44f))
* skills command ([34391c0](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/34391c020a184d5918cc8f0617efbbe0367b9f1c))
* speed insights ([e7720ad](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/e7720ad4c85cdd36f6fa3a0bff79997bbf9b3719))
* spotify command and player ([18f13e4](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/18f13e4c7193c0e3bfdb0d8745d6fdd08e2ccef5))
* **terminal:** custom autocomplete + history navigation ([34c71f6](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/34c71f624011aa1aed2ce615f1561f2b993cb74d))
* **ui:** add Shortcut, Tag and ShortcutSection components ([63a9879](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/63a987988c38298a2e0bb831926f5c13a9013c2e))
* **welcome:** redesign welcome hero with profile card and shortcuts ([878904c](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/878904c37c98a6e63c8274a641164c812611bd9c))


### Bug Fixes

* avoid empty command ([97df2b7](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/97df2b74cc0c4ed63e4e8bc9b4855551084edfa7))
* **ci:** assign named variable before default export ([f2e0207](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/f2e020788c3bddc5f51e072e69569f232f6b753a))
* **ci:** clean up release-please branch and tag naming ([0204d9a](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/0204d9afe3abf43b3072ffee2ea359fb95c4530f))
* **ci:** clean up release-please branch and tag naming ([970aec8](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/970aec8f0587b94f4b75a1aab89929358602bd22))
* **ci:** rename commitlint config to .mjs for action v6 compatibility ([d8a8f03](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/d8a8f03265780c28a9822a5401830980cbcc6688))
* input trim and spotify helpers ([7aa382c](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/7aa382cc337fd365c4f13ca49d5b812a1d51cba6))
* **lint:** resolve all Biome warnings by extracting GITHUB_URL constant ([2b993b8](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/2b993b85b122eb365d1c8f9c7afa9395c66912ee))
* scroll to command + brian ([9536caf](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/9536caf7e2b0f9669f4139ffcc6600d588af8e5a))
* SEO + terminal height problem ([58cd831](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/58cd831e3c78c749332fec68f2636775da531605))


### Performance

* **next:** optimize image quality and enable experimental inline CSS ([68e3274](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/68e3274912bd4f93e5b6df20c397a0275acba92c))


### Documentation

* update README and add audit script ([8b8dad6](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/8b8dad69b107ee6cf91ee0bfe9c4d4ae6fd04e06))


### Styles

* **theme:** simplify CSS variables and add wave keyframe animation ([97d8d7e](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/97d8d7e129eac0c5ef19638ddbee662784bf1210))


### Miscellaneous

* **deps:** upgrade lucide-react to v0.564 and add @vercel/analytics ([74fe507](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/74fe5073517573798a8954268539fc851a76961c))
* fix typecheck script ([954c646](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/954c6462d1cdfbc9e59dca93f78e661502a34b23))


### Code Refactoring

* **commands:** extract command descriptors into shared module ([3ab84c1](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/3ab84c1adaa03d128bbdad599b340f535291b8d1))
* **icons:** replace DynamicIcon with direct lucide-react imports ([665bd9e](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/665bd9e106014aea420da7c1916ad02388820f69))
* old portfolio project ([79c7367](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/79c7367311e3f93435157b617ca895fa669133bd))
* **seo:** extract SITE constants and improve OG image ([e71a616](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/e71a616ee54ffcd458acec972f303abcf8e37d3e))
* shared command list + spotify query wrappers ([e5d1b81](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/e5d1b81145b4846f1ab02ea67060e80e8443ffc0))
* **terminal:** extract animation components into dedicated module ([790ead0](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/790ead0c1158bc86a9aeb87fef34062b57fe29a1))
* **tooling:** migrate from ESLint + Prettier to Biome ([388d1e8](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/388d1e8e788bbb77aa917e59078e6e296e60c5aa))
* **tooling:** migrate from ESLint + Prettier to Biome ([51b055a](https://github.com/HakkaOfDev/hakkaofdev.fr/commit/51b055a2f714dc7f946de7af74c1eb9ebe54ed8e))
