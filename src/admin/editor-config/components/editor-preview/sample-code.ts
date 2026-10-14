/**
 * Internal dependencies
 */
import type { PreviewLanguage } from '../../../../types';

const SAMPLE_CODE: Record< PreviewLanguage, string > = {
	html: `<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
	<!-- wp:heading -->
	<h2 class="wp-block-heading">Hello World</h2>
	<!-- /wp:heading -->
	<!-- wp:columns -->
	<div class="wp-block-columns">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:image {"width":"470px","height":"317px"} -->
			<figure class="wp-block-image is-resized"><img src="image.png" alt="WordPress" width="470" height="317"></figure>
			<!-- /wp:image -->
			<!-- wp:paragraph -->
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:shortcode -->
			[gallery ids="1,2,3" columns="3" size="medium"]
			<!-- /wp:shortcode -->
			<!-- wp:html -->
			[caption id="attachment_1" align="aligncenter"]<a href="https://wordpress.org/" target="_blank">WordPress.org</a>[/caption]
			<!-- /wp:html -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
	<!-- wp:latest-posts {"postsToShow":3} /-->
</div>
<!-- /wp:group -->
`,
	php: `<?php
/**
 * Display the latest posts of the given category.
 *
 * @param string $category Category slug.
 * @param int    $count    Number of posts.
 */
function my_theme_latest_posts( $category, $count = 3 ) {
	$query = new WP_Query(
		array(
			'post_type'      => 'post',
			'posts_per_page' => $count,
			'tax_query'      => array(
				array(
					'taxonomy' => 'category',
					'field'    => 'slug',
					'terms'    => array( $category ),
				),
			),
		)
	);

	if ( ! $query->have_posts() ) {
		return;
	}
	?>
	<ul class="latest-posts">
		<?php while ( $query->have_posts() ) : ?>
			<?php $query->the_post(); ?>
			<li><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></li>
		<?php endwhile; ?>
	</ul>
	<?php
	wp_reset_postdata();
}

add_action(
	'wp_footer',
	function () {
		my_theme_latest_posts( 'news', 5 );
	}
);
`,
	javascript: `/**
 * Fetch the latest posts and render them as a list.
 */
const API_URL = '/wp-json/wp/v2/posts';

async function fetchPosts( { perPage = 3, categories = [] } = {} ) {
	const params = new URLSearchParams( {
		per_page: String( perPage ),
		categories: categories.join( ',' ),
	} );
	const response = await fetch( \`\${ API_URL }?\${ params }\` );
	if ( ! response.ok ) {
		throw new Error( \`Failed to fetch posts: \${ response.status }\` );
	}
	return response.json();
}

document.addEventListener( 'DOMContentLoaded', async () => {
	const list = document.querySelector( '.latest-posts' );
	try {
		const posts = await fetchPosts( { perPage: 5, categories: [ 1, 2 ] } );
		list.innerHTML = posts
			.map( ( { link, title } ) => \`<li><a href="\${ link }">\${ title.rendered }</a></li>\` )
			.join( '' );
	} catch ( error ) {
		console.error( error );
	}
} );
`,
	css: `:root {
	--primary-color: #3858e9;
	--spacing: clamp(1rem, calc(0.5rem + 2vw), 2rem);
}

.wp-block-group {
	padding: var(--spacing);
	background: linear-gradient(135deg, rgba(56, 88, 233, 0.1), rgb(255 255 255 / 80%));
}

.latest-posts li:not(:last-child) {
	margin-bottom: calc(var(--spacing) / 2);
}

.latest-posts a[target="_blank"]::after {
	content: "↗";
}

@media screen and (max-width: 782px) {

	.wp-block-columns {
		flex-direction: column;
	}
}

@keyframes fade-in {

	from {
		opacity: 0;
		transform: translateY(8px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}
`,
};

// Sample code based on indent type and tab size settings.
export function getSampleCode(): Record< PreviewLanguage, string > {
	const { insertSpaces, tabSize } = window.chbeObj.editorSettings;
	if ( ! insertSpaces || ! tabSize ) {
		return SAMPLE_CODE;
	}
	return Object.fromEntries(
		Object.entries( SAMPLE_CODE ).map( ( [ language, code ] ) => [
			language,
			code.replace( /\t/gm, ' '.repeat( tabSize ) ),
		] )
	) as Record< PreviewLanguage, string >;
}
