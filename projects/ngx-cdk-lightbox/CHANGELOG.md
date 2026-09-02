## 22.1.0 (2026-09-02)

### Breaking Changes:

- **Unified i18n & Localization Interface**:
  - Replaced legacy, fragmented `ariaLabel*` and `imageCounterText` properties in `IGalleryConfig` with a clean, unified `i18n: TSupportedLightboxLanguage | Partial<IGalleryI18n>` configuration.
  - Standardized dictionary structure under `IGalleryI18n` with keys: `next`, `previous`, `close`, `loading`, `gallery`, `counter`.
  - Added `resolveLightboxI18n(i18n)` helper function with English defaults fallback.
  - Added DI token and provider `provideLightboxI18n()` for global application-level language configuration.

### Features & Enhancements:

- **Built-in Support for 26 Languages**:
  - Added predefined internationalization presets for 26 languages: English (`en`), German (`de`), Polish (`pl`), Czech (`cs`), Slovak (`sk`), Spanish (`es`), Italian (`it`), French (`fr`), Portuguese (`pt`), Dutch (`nl`), Swedish (`sv`), Norwegian (`no`/`nb`), Danish (`da`), Finnish (`fi`), Hungarian (`hu`), Greek (`el`), Romanian (`ro`), Croatian (`hr`), Ukrainian (`uk`), Turkish (`tr`), Japanese (`ja`), Korean (`ko`), Chinese (`zh`/`zh-CN`), Hindi / Indian (`hi`/`in`), Vietnamese (`vi`), and Arabic (`ar`).
- **Accessibility & Screen Reader Enhancements**:
  - Integrated Angular CDK `LiveAnnouncer` for polite screen reader announcements (`LiveAnnouncer.announce(message, 'polite')`) on slide navigation.
  - Standardized WAI-ARIA landmark roles (`role="region"` with `aria-roledescription="carousel"`, `role="group"` with `aria-roledescription="slide"`).
  - Added accessible screen reader text (`loader__sr-only`) and `role="status"` to loading indicator.
- **Dynamic Video Metadata Preloading & Sizing**:
  - Added automatic background video metadata preloading (`loadedmetadata`) to retrieve true video dimensions and aspect ratios before initiating lightbox container morphing.
  - Guarded against duplicate resize recalculations and eliminated awkward initial default dimension jumps (e.g. assuming 16:9 for non-16:9 videos).
- **Flicker-Free Media Transitions**:
  - Coordinated slide swapping and dimension animation timing in `loadDisplayObject()`.
  - Applied baseline `opacity: 0` to image and video elements to eliminate transition flashes and double-rendering during slide navigation.
- **Custom Loader Template Support**:
  - Supported passing custom `TemplateRef` via `loaderTemplate` in `IGalleryConfig` to replace the default spinner.
- **Modernized Interactive Demo Application**:
  - Added real-time 26-language dropdown selector to Photo Gallery and Live Playground.
  - Restored interactive demo cards including Cyberpunk Neon Theme, Minimalist Kiosk, Custom Labels, and live animated custom pulse loader preview.

## 22.0.0 (2026-08-05)

- Change Angular supported version to v22
- Update dependencies (TypeScript 6.0, ESLint 10, angular-eslint flat config)
- Migrate ESLint to flat config (required by angular-eslint v22 / ESLint v10)
- Remove deprecated `@angular/animations` and `@angular/platform-browser-dynamic`
- Remove obsolete empty polyfills and zoneless provider (zoneless is default since v21)
- Adopt Angular v22 `@Service()` decorator and signal `input()` where applicable
- Apply TypeScript 6 `baseUrl` deprecation migration for path mappings

## 21.0.0 (2025-11-24)

- Change Angular supported version to v21

## 20.0.1 (2025-11-24)

- Minor dependencies update

## 20.0.0 (2025-06-02)

- Change Angular supported version to v20
- Update dependencies
- Switch to use pnpm
- Switch from jest to vitest

## 19.0.0 (2024-12-05)

- Huge refactoring (and will be refactored even more), cleanup, simplification & modernization
- Use of css custom properties
- Drop dependency on Angular Material
- OnPush change detection strategy
- Change Angular supported version to v19
- Update dependencies

## 18.0.0 (2024-05-28)

- Change Angular supported version to v18
- Update dependencies

## 18.0.1 (2024-05-30)

- Update dependencies

## 17.0.0 (2024-01-03)

- Drop pretty-quick dependency
- Change Angular supported version to v17

## 16.0.0 (2023-05-11)

- Change Angular supported version to v16
- Update dependencies

## 15.0.1 (2023-01-19)

- Update dependencies

## 15.0.0 (2022-12-30)

- Change Angular supported version to v15
- Update dependencies
- Updated demo settings
- Demo app as standalone

## 14.0.0 (2022-08-29)

- Change Angular supported version to v14
- Update dependencies
- Cleanup
- Optimize repo

## 13.0.0 (2021-11-04)

- Change Angular supported version to v13
- Update dependencies

## 1.5.1 (2021-07-15)

- Update dependencies

## 1.5.0 (2021-06-14)

- Update Angular to v12 & demo dependencies

## 1.4.0 (2020-11-12)

- Update Angular to v11 & demo dependencies

## 1.3.0 (2020-06-29)

- Update Angular to v10 & other dependencies

## 1.2.1 (2020-03-23)

- Update dependencies

## 1.2.0 (2020-02-11)

- Update to Angular 9

## 1.1.1 (2020-01-20)

- Small cleanup
- Update npm dependencies
- Preparation for bigger cleanup

## 1.1.0 (2019-11-12)

### Breaking changes:

- Renamed LightboxModule to NgxCdkLightboxModule
- Renamed LightboxService to NgxCdkLightboxService
- No need to import service into module anymore

### Other changes

- Project cleanup
- Updated dependencies

## 1.0.0 (2019-10-30)

- Added demo
- Updated npm dependencies
- Added iframe support to ToDo list

## 0.1.0 (2019-08-12)

### Breaking changes:

- You have to now set type of item to 'image' or 'video'

### Other changes:

- Cleanup
- Update npm dependencies
- Add aria-labels
- Add posibility to set ratio (width & height) for videos

## 0.0.23 (2019-08-12)

- Cleanup dependencies

## 0.0.22 (2019-08-08)

- Add support for HTML5 videos

## 0.0.21 (2019-08-05)

- Update npm dependencies

## 0.0.20 (2019-07-19)

- Update npm dependencies
- Add cdk into peerDependencies

## 0.0.19 (2019-07-17)

- Update cdk dependencies

## 0.0.18 (2019-07-16)

- Add CHANGELOG
- Add README

## 0.0.17 (2019-07-16)
