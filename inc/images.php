<?php
/**
 * Custom image sizes
 *
 * @package understrap
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// general
add_image_size('preview-image', 300, 200, TRUE);
add_image_size('test-image', 260, 260, TRUE);
add_image_size('header-image', 1680, 9999, FALSE);

// Gallery
add_image_size('thumb-image', 500, 9999, FALSE);
add_image_size('big-image', 1280, 9999, FALSE);

// Blog
add_image_size('blogarticle-image', 1024, 9999, FALSE);
add_image_size('blogthumb-image', 400, 350, TRUE);