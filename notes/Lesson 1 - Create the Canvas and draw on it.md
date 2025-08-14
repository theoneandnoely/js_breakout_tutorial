# HTML
[[HTML]] header contains a `meta` tag to define the `charset` as 'utf-8'. _Unsure if this is strictly necessary._

The [[canvas]] element is initialised in the body with an `id`, `width`, and `height`. Both the `width` and `height` are given static pixel values. _Not sure if that's ideal or whether this will later be made dynamic._
# CSS
[[CSS]] styling is included in the HTML header. It uses an `*` selector to set all element padding and margin to `0`. The only other thing it specifies is the `canvas` element should have a light grey background, the display should be set to `block`, and the margin should be `0 auto`.

# JavaScript
[[JavaScript]] is written directly to a script tag in the HTML body.

A const variable is created to reference the canvas element from the DOM, and another is created to store the 2D rendering context for painting on the canvas.

