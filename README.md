# Slack Export Viewer (Slorter?)

This is a WIP tool to view exported Slack data.

You can use it to view the data for a channels history in a human readable format.

[Try it out here!](https://slax.pro)

## Build Yourself

Currently to use it, you need to:
1. Export the data from Slack
3. Run `yarn` and then `yarn dev`

## TO DO:

- [x] Add in vue-router
- [x] Add in vuex?
- [x] Add a view for a messages reply thread
  - [x] Allow externally linking to a message thread view
- [x] Add linking to a message in the channel view (where ever it is in the history)
- [ ] Add in search functionality
- [ ] Add in a view for a user profile
  - [ ] Allow externally linking to a user profile view
- [x] Switch to pre-processing the export and save it as a [binary file](https://github.com/sitegui/js-binary)
  - [x] Unpack binary file instead, regress data structure
    - [x] zip binary file for even more compression (10MB export.zip -> 1.1MB export.bin -> 0.3MB export.bin.zip 😗👌)
  - [x] Make sure sensitive data is not exposed (slack exports emails and phone numbers, etc)
  - [x] Have a UI flow for creating the binary, with config options
- [x] Propperly setup types with typescript
- [x] Setup a Linter :/
- [ ] Finish message rendering
  - [ ] Support ordered lists
  - [ ] Support Blockquotesgit 
  - [ ] Fix code blocks
  - [ ] Support Attachments (link previews and quoting earlier messages)
- [ ] Add docker config for pre-processing/deploying
- [x] Add a logo/favicon

---

# Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.
