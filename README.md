# rehype-slugify

[![npm](https://img.shields.io/npm/v/@microflash/rehype-slugify)](https://www.npmjs.com/package/@microflash/rehype-slugify)
[![license](https://img.shields.io/npm/l/@microflash/rehype-slugify)](./LICENSE.md)

[rehype](https://github.com/rehypejs/rehype) plugin to add `id`s to headings using a slugger of your choice

## Contents

- [Contents](#contents)
- [What's this?](#whats-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
	- [Options](#options)
- [Security](#security)
- [Related](#related)
- [License](#license)

## What's this?

This package is a [unified](https://github.com/unifiedjs/unified) ([rehype](https://github.com/rehypejs/rehype)) plugin to add `id`s to headings. It looks for headings (`<h1>` through `<h6>`) that do not yet have `id`s and adds `id` attributes to them based on the text they contain. You'll have to provide an implementation of the algorithm that does that, such as [`github-slugger`](https://github.com/Flet/github-slugger), [`@sindresorhus/slugify`](https://github.com/sindresorhus/slugify),etc.

## When should I use this?

This plugin is useful when you have relatively long documents and you want to be able to link to particular sections.

A different plugin, [`rehype-autolink-headings`](https://github.com/rehypejs/rehype-autolink-headings), adds links to these headings back to themselves, which is useful as it lets users more easily link to particular sections.

This plugin allows you to use your own slug algorithm to handle usecases that [`rehype-slug`](https://github.com/rehypejs/rehype-slug) does not allow (e.g, additional language support, custom replacements, etc)

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm](https://docs.npmjs.com/cli/install):

```sh
npm install @microflash/rehype-slugify
```

In Deno, with [esm.sh](https://esm.sh/):

```js
import rehypeSlugify from 'https://esm.sh/@microflash/rehype-slugify'
```

In browsers, with [esm.sh](https://esm.sh/):

```html
<script type="module">
  import rehypeSlugify from 'https://esm.sh/@microflash/rehype-slugify?bundle'
</script>
```

## Use

Say we have the following file `example.html`:

```html
<h1 id=some-id>Lorem ipsum</h1>
<h2>Dolor sit amet 😪</h2>
<h3>consectetur &amp; adipisicing</h3>
<h4>elit</h4>
<h5>elit</h5>
```

And our module `example.js` looks as follows:

```js
import Slugger from 'github-slugger'
import { read } from 'to-vfile'
import { rehype } from 'rehype'
import rehypeSlugify from '@microflash/rehype-slugify'

const slugger = new Slugger()

main()

async function main() {
  const file = await rehype()
    .data('settings', { fragment: true })
    .use(rehypeSlugify, {
      reset() {
        slugger.reset()
      },
      slugify(text) {
        return slugger.slug(text)
      }
    })
    .process(await read('example.html'))

  console.log(String(file))
}
```

Running that with `node example.js` yields:

```html
<h1 id="some-id">Lorem ipsum</h1>
<h2 id="dolor-sit-amet-">Dolor sit amet 😪</h2>
<h3 id="consectetur--adipisicing">consectetur &#x26; adipisicing</h3>
<h4 id="elit">elit</h4>
<h5 id="elit-1">elit</h5>
```

## API

The default export is `rehypeSlugify`.

### Options

The following options are available. All of them are required.

- `reset`: function that resets the slug counter
- `slugify`: function that slugifies the text

## Security

Use of `@microflash/rehype-slugify` can open you up to a [cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) attack as it sets `id` attributes on headings, which causes what is known as "DOM clobbering". Please use [`rehype-sanitize`](https://github.com/rehypejs/rehype-sanitize) and see its [Example: headings (DOM clobbering)](https://github.com/rehypejs/rehype-sanitize#example-headings-dom-clobbering) for information on how to properly solve it.

## Related

- [`rehype-slug`](https://github.com/rehypejs/rehype-slug) &mdash; opinionated plugin to generate slugs using [`github-slugger`](https://github.com/Flet/github-slugger)
- [`rehype-autolink-headings`](https://github.com/rehypejs/rehype-autolink-headings) &mdash; add links to headings with IDs back to themselves

## License

[MIT](./LICENSE.md)
