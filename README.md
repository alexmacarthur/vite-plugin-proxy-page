# vite-plugin-proxy-page

A Vite plugin for developing an SPA in the context of a deployed production page.

## What's the Problem?

It's an increasingly common pattern to independently develop small applications outside of the context of where they'll live. For example, an interactive calculator might be built with Vite's out-of-the-box development server, and then be published where it'll be used on the pages of an enterprise CMS -- pages that have their own set of styles, UI quirks, and other characteristics. If you're not careful, you could have unexpected interference with how your little application looks or works.

This plugin swaps out your local `index.html` file for a public page of your choosing. You'll get the UI, styles, and other assets just as if you were on the actual page, but still get to keep the snappy developer experience of a typical Vite setup.

## Installation

`npm install vite-plugin-proxy-page`

## Setup

Import the plugin and initialize it your `plugins` array:

```js
// vite.config.js

import { proxyPage } from "vite-plugin-proxy-page";

export default defineConfig({
  plugins: [
    proxyPage({
      // Options go here.
    }),
  ],
  // ...remaining configuration
});
```

At the very least, you'll need to specify a remote page you'd like to proxy, as well as which local entry point Vite should inject onto the page. By default, this script tag will be injected just before the closing `</body>` tag, but if that doesn't exist, it'll be attached to the end of the HTML.

```diff
// vite.config.js

import { proxyPage } from "vite-plugin-proxy-page";

export default defineConfig({
  plugins: [
    proxyPage({
+     remoteUrl: "https://vite-proxy-demo.netlify.app/some-page",
+     localEntryPoint: "./local-dev.tsx",
    })
  ],
 // ...remaining configuration
});
```

At this point, if your target page has a node to which you can mount and your `local-dev.tsx` file is targeting it, you're ready to go. However, if you want to inject a _new_ node onto a certain part of the page, you can use the `rootNode` options:

```diff
// vite.config.js

import { proxyPage } from "vite-plugin-proxy-page";

export default defineConfig({
  plugins: [
    proxyPage({
      remoteUrl: "https://vite-proxy-demo.netlify.app/some-page",
      localEntryPoint: "./local-dev.tsx",
+     rootNode: {
+       id: "app",
+       prependTo: "main" // Optional. If left empty, the body will be used.
+     }
    })
  ],
 // ...remaining configuration
});
```

Using this example, a new `<div id="app"></div>` node will be prepended to the `<main></main>` element on the page.

## Options

| Name               | Description                                                                                                                                                                                                                                                                         | Required |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `localEntryPoint`  | The entry point file that should be loaded onto the page. For a fresh Vite TypeScript project, this will be the `main.ts` file.                                                                                                                                                     | `true`   |
| `remoteUrl`        | The full URL of the page you want proxy. Ex: "https://example-site.com/my-page"                                                                                                                                                                                                     | `true`   |
| `remoteEntryPoint` | A RegExp or string of the deployed bundle URL. If this is set, the script tag loading that bundle will be removed from the proxied page's HTML in order to prevent unexpected bundle collisions with your local version. Ex: "./production-bundle.js" or /\./production-bundle\.js/ | `false`  |
| `rootNode`         | An object for specifying the HTML ID of the node you'd like to inject on to the page (`id`), as well as a CSS selector for where you'd like to prepend it (the default is the body). Ex: `{ id: "myApp", prependTo: ".ArticleContent" }`.                                           | `false`  |
| `cacheHtml`        | Determines whether the remote HTML will be cached in memory while your Vite server runs, rather than refetching after each page reload or local code change. By default, this is set to `true`.                                                                                     | `false`  |

## Contributions

File an issue or make a PR!
