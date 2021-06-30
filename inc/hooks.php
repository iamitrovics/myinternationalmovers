<?php
/**
 * Custom hooks
 *
 * @package UnderStrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

add_theme_support( 'editor-color-palette', array(
	array(
		'name'  => __( 'Gray', 'understrap' ),
		'slug'  => 'gray',
		'color'	=> '#1d1d1d',
	),
	array(
		'name'  => __( 'White', 'understrap' ),
		'slug'  => 'white',
		'color' => '#fff',
	),
	array(
		'name'  => __( 'Black', 'understrap' ),
		'slug'  => 'black',
		'color' => '#000',
	),
	array(
		'name'	=> __( 'Red', 'understrap' ),
		'slug'	=> 'red',
		'color'	=> '#e11b22',
	),
) );