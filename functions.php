<?php
/**
 * UnderStrap functions and definitions
 *
 * @package UnderStrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$understrap_includes = array(
	'/theme-settings.php',                  // Initialize theme default settings.
	'/setup.php',                           // Theme setup and custom theme supports.
	'/widgets.php',                         // Register widget area.
	'/enqueue.php',                         // Enqueue scripts and styles.
	'/template-tags.php',                   // Custom template tags for this theme.
	// '/pagination.php',                      Custom pagination for this theme.
	'/hooks.php',                           // Custom hooks.
	'/extras.php',                          // Custom functions that act independently of the theme templates.
	// '/customizer.php',                   // Customizer additions.
	// '/custom-comments.php',                 Custom Comments file.
	// '/jetpack.php',                         Load Jetpack compatibility file.
	'/class-wp-bootstrap-navwalker.php',    // Load custom WordPress nav walker. Trying to get deeper navigation? Check out: https://github.com/understrap/understrap/issues/567.
	// '/woocommerce.php',                     Load WooCommerce functions.
	'/editor.php',                          // Load Editor functions.
	'/deprecated.php',                      // Load deprecated functions.
	// Custom include files
	'/cleanup.php',                         // Cleaning worpdress garbage
	'/images.php',                          // Image sizes
	'/settings.php',                        // Theme Settings
	'/customize.php',                       // Customize theme
    '/ctp.php',                             // Custom Post Types	
    // '/blocks.php',                          // Custom Post Types	
);

foreach ( $understrap_includes as $file ) {
	require_once get_template_directory() . '/inc' . $file;
}

require_once('wp_bootstrap_mobile_navwalker.php');

// disable this on publishing
// remove_action( 'shutdown', 'wp_ob_end_flush_all', 1 );

// function gb_gutenberg_admin_styles() {
//     echo '
//         <style>
//             /* Main column width */
//             .wp-block {
//                 max-width: 100%;
//             }
 
//             /* Width of "wide" blocks */
//             .wp-block[data-align="wide"] {
//                 max-width: 100%;
//             }
 
//             /* Width of "full-wide" blocks */
//             .wp-block[data-align="full"] {
//                 max-width: none;
//             }	
//         </style>
//     ';
// }

// add_action('admin_head', 'gb_gutenberg_admin_styles');

add_filter( 'wpcf7_autop_or_not', '__return_false' );

add_action('init', 'init_remove_support',100);
function init_remove_support(){
    $post_type = 'post';
    remove_post_type_support( $post_type, 'editor');
}


function wpex_remove_cpt_slug_services( $post_link, $post, $leavename ) {
	if ( 'services' != $post->post_type || 'publish' != $post->post_status ) {
		return $post_link;
	}
	$post_link = str_replace( '/' . $post->post_type . '/', '/', $post_link );
	return $post_link;
}
add_filter( 'post_type_link', 'wpex_remove_cpt_slug_services', 10, 3 );


/**
 * Some hackery to have WordPress match postname to any of our public post types
 * All of our public post types can have /post-name/ as the slug, so they better be unique across all posts
 * Typically core only accounts for posts and pages where the slug is /post-name/
 */
function wpex_parse_request_tricksy( $query ) {
	// Only noop the main query
	if ( ! $query->is_main_query() )
		return;
	// Only noop our very specific rewrite rule match
	if ( 2 != count( $query->query ) || ! isset( $query->query['page'] ) ) {
		return;
	}
	// 'name' will be set if post permalinks are just post_name, otherwise the page rule will match
	if ( ! empty( $query->query['name'] ) ) {
		$query->set( 'post_type', array( 'post', 'page', 'services' ) );
	}
}
add_action( 'pre_get_posts', 'wpex_parse_request_tricksy' );

function cf7_post_to_third_party($form)
{
    $formMappings = array(
        'first_name' => array('your-first'),
		'last_name' => array('your-last'),
		'email' => array('your-email'),
		'phone' => array('your-tel'),
		'move_date' => array('your-date'),
		'move_size' => array('home-size'),
		'from_zip' => array('zip-from'),
		'to_zip' => array('zip-to'),
		'car_trailer' => array('your-trailer'),
		'car_make' => array('car-make'),
		'car_model' => array('car-model'),
		'car_year' => array('car-year'),
        'source_details[url]' => array('dynamichidden-672'),
        'source_details[title]' => array('dynamichidden-673'),
		'move_type' => array('dynamichidden-100')
    );
    $handler = new MovingSoftFormHandler($formMappings);
    $handler->setOrigin('https://myinternationalmovers.com')->handleCF7($form, [232, 1507, 1516]);
}
add_action('wpcf7_mail_sent', 'cf7_post_to_third_party', 10, 1);


function skip_mail_when_testing($f){
    $submission = WPCF7_Submission::get_instance();
    $handler = new MovingSoftFormHandler();
    
    return $handler->getIP() == '206.189.212.83'; //testing Bot IP address
}
add_filter('wpcf7_skip_mail','skip_mail_when_testing');


if ( ! is_admin() ) {

	function fb_filter_query( $query, $error = true ) {

		if ( is_search() ) {
			$query->is_search = false;
			$query->query_vars['s'] = false;
			$query->query['s'] = false;

			if ( $error == true )
				$query->is_404 = true;
		}
	}

	add_action( 'parse_query', 'fb_filter_query' );
	add_filter( 'get_search_form', function() { return null;} );

}