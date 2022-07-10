/**
 * @typedef {import('hast').Root} Root
 */
import { hasProperty } from 'hast-util-has-property'
import { headingRank } from 'hast-util-heading-rank'
import { toString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'

/**
 * Plugin to add `id`s to headings
 *
 * @type {import('unified').Plugin<Array<void>, Root>}
 */
export default function rehypeSlugify(options) {
	return (tree) => {
		if (!(typeof options['reset'] === 'function' && typeof options['slugify'] === 'function')) {
			return
		}

		options.reset()

		visit(tree, 'element', (node) => {
			if (headingRank(node) && node.properties && !hasProperty(node, 'id')) {
				node.properties.id = options.slugify(toString(node))
			}
		})
	}
}
